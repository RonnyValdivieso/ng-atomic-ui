import {
  ApplicationRef,
  Component,
  ElementRef,
  EmbeddedViewRef,
  HostListener,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  inject,
  input,
  signal
} from '@angular/core';

/**
 * Item rendered inside the row-actions popover. Either an action (label + icon
 * + handler) or a visual divider between groups.
 */
export interface RowActionsMenuItem {
  /** Label shown to the user. Ignored when `divider` is true. */
  label?: string;
  /** PrimeIcons class name (e.g. `pi-pencil`). Ignored when `divider` is true. */
  icon?: string;
  /** Tints the item red and routes it through the danger hover state. */
  danger?: boolean;
  /** Visually present but unclickable. */
  disabled?: boolean;
  /** When true, renders a 1px separator instead of an item. */
  divider?: boolean;
  /** Callback fired on click; the menu closes automatically afterwards. */
  action?: () => void;
}

interface PopoverPosition {
  top: number;
  right: number;
}

/** Approximate heights used to choose the open direction before render. */
const ITEM_HEIGHT_PX = 31;
const DIVIDER_HEIGHT_PX = 9;
const POPOVER_PADDING_PX = 8;
const TRIGGER_GAP_PX = 6;

/**
 * Compact "three-dots" popover used inside data-table row actions. Keeps the
 * trigger in the row (Copy ID + view stay visible alongside it) and reveals
 * secondary actions on demand.
 *
 * The popover view is rendered into `document.body` so it escapes any ancestor
 * `overflow: hidden` (notably the `.table-card`). Placement flips above the
 * trigger when there isn't enough room below it. Uses
 * `ViewEncapsulation.None` so the global popover element still picks up our
 * scoped styles after being teleported out of the host subtree; class names
 * are namespaced with `ram-` to avoid collisions.
 */
@Component({
  selector: 'app-row-actions-menu',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './row-actions-menu.html',
  styleUrls: ['./row-actions-menu.css']
})
export class RowActionsMenuComponent implements OnDestroy {
  readonly items = input.required<RowActionsMenuItem[]>();
  readonly ariaLabel = input<string>('More actions');

  private host = inject(ElementRef<HTMLElement>);
  private appRef = inject(ApplicationRef);

  protected readonly open = signal(false);
  protected readonly placement = signal<'below' | 'above'>('below');
  protected readonly position = signal<PopoverPosition | null>(null);

  @ViewChild('popoverTpl', { read: TemplateRef, static: true })
  private popoverTpl!: TemplateRef<unknown>;

  private viewRef: EmbeddedViewRef<unknown> | null = null;

  protected toggle(event: MouseEvent): void {
    event.stopPropagation();
    if (this.open()) {
      this.close();
    } else {
      this.show(event.currentTarget as HTMLElement);
    }
  }

  protected run(event: MouseEvent, item: RowActionsMenuItem): void {
    event.stopPropagation();
    if (item.disabled || item.divider) return;
    this.close();
    item.action?.();
  }

  private show(triggerEl: HTMLElement): void {
    const rect = triggerEl.getBoundingClientRect();
    const estHeight = this.estimateHeight();
    const viewportH = window.innerHeight;
    const spaceBelow = viewportH - rect.bottom - TRIGGER_GAP_PX;
    const spaceAbove = rect.top - TRIGGER_GAP_PX;

    let placement: 'below' | 'above';
    let top: number;

    if (estHeight <= spaceBelow || spaceBelow >= spaceAbove) {
      placement = 'below';
      top = rect.bottom + TRIGGER_GAP_PX;
    } else {
      placement = 'above';
      top = rect.top - TRIGGER_GAP_PX - estHeight;
    }

    const right = window.innerWidth - rect.right;

    this.placement.set(placement);
    this.position.set({ top, right });
    this.open.set(true);

    // Render the popover template into document.body so it escapes any
    // ancestor's overflow:hidden (notably `.table-card`).
    this.viewRef = this.popoverTpl.createEmbeddedView({});
    this.appRef.attachView(this.viewRef);
    for (const node of this.viewRef.rootNodes) {
      if (node instanceof Node) document.body.appendChild(node);
    }
  }

  private close(): void {
    this.open.set(false);
    this.position.set(null);
    if (this.viewRef) {
      this.appRef.detachView(this.viewRef);
      this.viewRef.destroy();
      this.viewRef = null;
    }
  }

  ngOnDestroy(): void {
    this.close();
  }

  private estimateHeight(): number {
    const items = this.items();
    const inner = items.reduce(
      (sum, it) => sum + (it.divider ? DIVIDER_HEIGHT_PX : ITEM_HEIGHT_PX),
      0
    );
    return POPOVER_PADDING_PX + inner;
  }

  @HostListener('document:click', ['$event'])
  protected onDocClick(event: MouseEvent): void {
    if (!this.open()) return;
    const target = event.target as Node;
    const insideHost = this.host.nativeElement.contains(target);
    const insidePopover = !!this.viewRef?.rootNodes.some(
      (n: Node) => n instanceof Element && (n === target || n.contains(target))
    );
    if (!insideHost && !insidePopover) this.close();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open()) this.close();
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  protected onViewportChange(): void {
    if (this.open()) this.close();
  }
}
