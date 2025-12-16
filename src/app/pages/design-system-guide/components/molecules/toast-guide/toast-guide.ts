import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastComponent } from '@molecules/toast';

@Component({
  selector: 'app-toast-guide',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToastComponent],
  templateUrl: './toast-guide.html',
  styleUrls: ['./toast-guide.css'],
  providers: [MessageService]
})
export class ToastGuideComponent {
  constructor(private messageService: MessageService) {}

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Operation completed successfully' });
  }

  showInfo() {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Here is some useful information' });
  }

  showWarn() {
    this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please be careful with this action' });
  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while processing' });
  }

  showSticky() {
    this.messageService.add({ severity: 'info', summary: 'Sticky', detail: 'I will stay here until you close me', sticky: true });
  }
}
