import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from '@molecules/file-upload';

@Component({
	selector: 'app-file-upload-guide',
	standalone: true,
	imports: [CommonModule, FileUploadComponent],
	templateUrl: './file-upload-guide.html',
	styleUrls: ['./file-upload-guide.css'],
})
export class FileUploadGuideComponent {
	lastSelectedFiles = signal<string[]>([]);

	onFileSelected(files: File[]) {
		this.lastSelectedFiles.set(files.map((f) => `${f.name} (${(f.size / 1024).toFixed(1)} KB)`));
	}
}
