import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ModalComponent } from '@organisms/modal';

@Component({
  selector: 'app-modal-guide',
  standalone: true,
  imports: [CommonModule, ButtonModule, ModalComponent],
  templateUrl: './modal-guide.html',
  styleUrls: ['./modal-guide.css']
})
export class ModalGuideComponent {
  // Visibility signals for different examples
  readonly basicVisible = signal<boolean>(false);
  readonly footerVisible = signal<boolean>(false);
  readonly scrollingVisible = signal<boolean>(false);
  
  // Position example
  readonly positionVisible = signal<boolean>(false);
  readonly position = signal<'center' | 'top' | 'bottom' | 'left' | 'right'>('center');

  showBasic() {
    this.basicVisible.set(true);
  }

  showFooter() {
    this.footerVisible.set(true);
  }

  showScrolling() {
    this.scrollingVisible.set(true);
  }

  showPosition(pos: 'center' | 'top' | 'bottom' | 'left' | 'right') {
    this.position.set(pos);
    this.positionVisible.set(true);
  }
}
