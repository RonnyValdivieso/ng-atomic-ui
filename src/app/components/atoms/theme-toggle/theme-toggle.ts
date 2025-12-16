import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../shared/services/theme.service';

/**
 * Theme Toggle Button Component
 * Atom-level component that provides a button to toggle between light and dark themes
 * Uses PrimeNG icons and Tailwind classes for styling
 *
 * @example
 * <app-theme-toggle />
 */
@Component({
	selector: 'app-theme-toggle',
	standalone: true,
	imports: [CommonModule],
	template: `
		<button
			type="button"
			(click)="toggleTheme()"
			class="relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-surface-100 focus:outline-none focus:ring-2 focus:ring-primary"
			[attr.aria-label]="isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'"
			[title]="isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'"
		>
			<!-- Sun Icon (Light Mode) -->
			<i
				class="pi pi-sun text-xl transition-all duration-300 absolute"
				[class.opacity-0]="isDarkMode()"
				[class.rotate-90]="isDarkMode()"
				[class.opacity-100]="!isDarkMode()"
				[class.rotate-0]="!isDarkMode()"
			></i>

			<!-- Moon Icon (Dark Mode) -->
			<i
				class="pi pi-moon text-xl transition-all duration-300 absolute"
				[class.opacity-0]="!isDarkMode()"
				[class.-rotate-90]="!isDarkMode()"
				[class.opacity-100]="isDarkMode()"
				[class.rotate-0]="isDarkMode()"
			></i>
		</button>
	`,
	styles: [
		`
			button {
				position: relative;
				overflow: hidden;
			}

			/* Icon animations */
			i {
				transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
			}

			/* Hover effect */
			button:hover {
				background-color: var(--p-surface-100);
			}

			/* Focus ring */
			button:focus-visible {
				outline: 2px solid var(--p-primary-color);
				outline-offset: 2px;
			}
		`,
	],
})
export class ThemeToggleComponent {
	private readonly themeService = inject(ThemeService);

	// Expose isDarkMode signal for template
	readonly isDarkMode = this.themeService.isDarkMode;

	/**
	 * Toggle between light and dark theme
	 */
	toggleTheme(): void {
		this.themeService.toggleDarkMode();
	}
}
