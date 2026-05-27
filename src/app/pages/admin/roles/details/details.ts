import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonComponent } from '@atoms/button';
import { CardComponent } from '@atoms/card';
import { ConfirmDialogComponent } from '@molecules/confirm-dialog/confirm-dialog';
import { RoleService } from '@services/api/aaa/role.service';
import { RoleDetail } from '@interfaces/aaa';
import { environment } from '@env/environment';
import { RoleFormComponent, RoleFormValue } from '../form/form';

const GLOBAL_SCOPE = '00000000-0000-0000-0000-000000000000';

@Component({
  selector: 'app-admin-role-details',
  standalone: true,
  imports: [ButtonComponent, CardComponent, RoleFormComponent, ConfirmDialogComponent],
  templateUrl: './details.html',
  styleUrls: ['./details.css']
})
export class AdminRoleDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(RoleService);

  protected readonly role = signal<RoleDetail | undefined>(undefined);
  protected readonly loading = signal<boolean>(true);
  protected readonly error = signal<boolean>(false);

  protected readonly isEditModalVisible = signal<boolean>(false);
  protected readonly saving = signal<boolean>(false);

  protected readonly isDeleteVisible = signal<boolean>(false);
  protected readonly deleting = signal<boolean>(false);
  protected get deleteMessage(): string {
    const r = this.role();
    return r ? `¿Eliminar el rol "${r.name}"?` : '';
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
    this.router.navigate(['/admin/roles']);
  }

  protected isGlobal(): boolean {
    const r = this.role();
    return (
      !r?.instanceId ||
      r.instanceId === GLOBAL_SCOPE ||
      r.instanceId === environment.defaultInstanceId
    );
  }

  protected openEdit(): void {
    this.isEditModalVisible.set(true);
  }

  protected save(value: RoleFormValue): void {
    const current = this.role();
    if (!current) return;
    this.saving.set(true);
    this.service.update(current.id, { name: value.name }).subscribe({
      next: () => {
        this.saving.set(false);
        this.isEditModalVisible.set(false);
        this.load(current.id);
      },
      error: () => this.saving.set(false)
    });
  }

  protected delete(): void {
    if (!this.role()) return;
    this.isDeleteVisible.set(true);
  }

  protected confirmDelete(): void {
    const current = this.role();
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
      next: r => {
        this.role.set(r);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }
}
