import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectRepository } from '@shared/services';
import { CardComponent } from '@atoms/card';
import { ButtonComponent } from '@atoms/button';
import { Workspace } from '@shared/interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-workspace-selector',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, ButtonComponent],
  templateUrl: './workspace-selector.html',
  styleUrls: ['./workspace-selector.css']
})
export class WorkspaceSelectorComponent {
  private projectRepo = inject(ProjectRepository);
  workspaces$: Observable<Workspace[]> = this.projectRepo.getByUser();
}
