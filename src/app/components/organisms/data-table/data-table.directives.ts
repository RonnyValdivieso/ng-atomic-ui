import { Directive, TemplateRef, inject, input } from '@angular/core';

/**
 * Marks an `<ng-template>` as the cell renderer for a column whose
 * `type` is `'template'`. The bound value is the column `field`.
 *
 * @example
 * <ng-template appDataCell="status" let-row> … </ng-template>
 */
@Directive({
  selector: '[appDataCell]',
  standalone: true
})
export class DataTableCellDirective {
  readonly appDataCell = input.required<string>();
  readonly template = inject(TemplateRef<{ $implicit: unknown; row: unknown }>);
}

/**
 * Marks an `<ng-template>` as the card renderer for the grid (card) view.
 * When present, the data-table exposes a table/grid view toggle.
 *
 * @example
 * <ng-template appDataGridCard let-row> … </ng-template>
 */
@Directive({
  selector: '[appDataGridCard]',
  standalone: true
})
export class DataTableGridCardDirective {
  readonly template = inject(TemplateRef<{ $implicit: unknown; row: unknown }>);
}
