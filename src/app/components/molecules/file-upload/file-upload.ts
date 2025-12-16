import { Component, input, signal, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-file-upload',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './file-upload.html',
	styleUrls: ['./file-upload.css'],
})
export class FileUploadComponent {
	readonly label = input<string>('Upload File');
	readonly accept = input<string>('*/*');
	readonly multiple = input<boolean>(false);
	readonly disabled = input<boolean>(false);
	readonly maxSizeMb = input<number>(5); // Default 5MB
	readonly variant = input<'default' | 'circle'>('default');

	readonly fileSelected = output<File[]>();

	protected readonly isDragging = signal<boolean>(false);
	protected readonly files = signal<File[]>([]);
	protected readonly error = signal<string | null>(null);

	protected readonly fileInputId = computed(
		() => `file-upload-${Math.random().toString(36).substring(2, 9)}`
	);

	onDragOver(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		if (!this.disabled()) {
			this.isDragging.set(true);
		}
	}

	onDragLeave(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		this.isDragging.set(false);
	}

	onDrop(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		this.isDragging.set(false);

		if (this.disabled()) return;

		const droppedFiles = event.dataTransfer?.files;
		if (droppedFiles && droppedFiles.length > 0) {
			this.handleFiles(Array.from(droppedFiles));
		}
	}

	onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			this.handleFiles(Array.from(input.files));
		}
	}

	removeFile(fileToRemove: File): void {
		if (this.disabled()) return;
		this.files.update((currentFiles) => currentFiles.filter((f) => f !== fileToRemove));
		this.fileSelected.emit(this.files());
		this.validateFiles(this.files());
	}

	private handleFiles(newFiles: File[]): void {
		let validFiles: File[] = [];

		// Validate file types if needed (basic check)
		// Note: 'accept' attribute handles browser dialog, but we should check drag/drop too

		if (this.multiple()) {
			validFiles = [...this.files(), ...newFiles];
		} else {
			validFiles = [newFiles[0]];
		}

		this.validateFiles(validFiles);

		if (!this.error()) {
			this.files.set(validFiles);
			this.fileSelected.emit(validFiles);
		}
	}

	private validateFiles(files: File[]): void {
		this.error.set(null);
		const maxBytes = this.maxSizeMb() * 1024 * 1024;

		for (const file of files) {
			if (file.size > maxBytes) {
				this.error.set(`File "${file.name}" exceeds the maximum size of ${this.maxSizeMb()}MB.`);
				return;
			}
		}
	}
}
