import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Header component for the Design System Guide
 * Shows title, subtitle and theme toggle controls
 */
@Component({
	selector: 'app-guide-header',
	standalone: true,
	imports: [CommonModule],
	template: ``,
	styleUrls: ['./guide-header.css'],
})
export class GuideHeaderComponent {
	readonly title = input<string>('Sistema de Diseño - Guía de Componentes');
	readonly subtitle = input<string>('Explora los componentes de nuestro Atomic Design System con tema Noir');
	readonly isDarkMode = input<boolean>(false);

	readonly themeToggle = output<void>();

	onThemeToggle(): void {
		this.themeToggle.emit();
	}
}
