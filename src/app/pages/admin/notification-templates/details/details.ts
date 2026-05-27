import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonComponent } from '@atoms/button';
import { CardComponent } from '@atoms/card';
import { ConfirmDialogComponent } from '@molecules/confirm-dialog/confirm-dialog';
import { NotificationTemplateService } from '@services/api/aaa/notification-template.service';
import { NotificationTemplateDetail } from '@interfaces/aaa';
import {
  NotificationTemplateFormComponent,
  NotificationTemplateFormValue
} from '../form/form';

@Component({
  selector: 'app-admin-notification-template-details',
  standalone: true,
  imports: [ButtonComponent, CardComponent, NotificationTemplateFormComponent, ConfirmDialogComponent],
  templateUrl: './details.html',
  styleUrls: ['./details.css']
})
export class AdminNotificationTemplateDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(NotificationTemplateService);

  protected readonly template = signal<NotificationTemplateDetail | undefined>(undefined);
  protected readonly loading = signal<boolean>(true);
  protected readonly error = signal<boolean>(false);

  protected readonly isEditModalVisible = signal<boolean>(false);
  protected readonly saving = signal<boolean>(false);

  protected readonly isDeleteVisible = signal<boolean>(false);
  protected readonly deleting = signal<boolean>(false);
  protected get deleteMessage(): string {
    const t = this.template();
    return t ? `¿Eliminar la plantilla "${t.name}"?` : '';
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set(true);
      this.loading.set(false);
      return;
    }
    this.load(id);
  }

  protected goBack(): void {
    this.router.navigate(['/admin/notification-templates']);
  }

  protected openEdit(): void {
    this.isEditModalVisible.set(true);
  }

  protected save(value: NotificationTemplateFormValue): void {
    const current = this.template();
    if (!current) return;
    this.saving.set(true);
    this.service.update(current.id, value).subscribe({
      next: () => {
        this.saving.set(false);
        this.isEditModalVisible.set(false);
        this.load(current.id);
      },
      error: () => this.saving.set(false)
    });
  }

  protected delete(): void {
    if (!this.template()) return;
    this.isDeleteVisible.set(true);
  }

  protected confirmDelete(): void {
    const current = this.template();
    if (!current) return;
    this.deleting.set(true);
    this.service.delete(current.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.isDeleteVisible.set(false);
        this.goBack();
      },
      error: () => this.deleting.set(false)
    });
  }

  private load(id: string): void {
    this.loading.set(true);
    this.error.set(false);
    this.service.getById(id).subscribe({
      next: t => {
        this.template.set(t);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }
}
