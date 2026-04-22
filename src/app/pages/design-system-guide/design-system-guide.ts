import { Component, computed, inject, signal } from '@angular/core';

import { ThemeService } from '@services/theme.service';
import { MainLayoutComponent } from '@templates/main-layout';
import { type NavigationItem } from '@organisms/sidebar';

// Import modular guide components
import { AtomicDesignIntroComponent } from './components/intro/atomic-design';
import { GuideHeaderComponent } from './components/shared/guide-header';

// Atoms Guide Components
import {
	BadgeGuideComponent,
	LabelGuideComponent,
	ButtonGuideComponent,
	IconGuideComponent,
	AvatarGuideComponent,
	CardGuideComponent,
	ChipGuideComponent,
	CheckboxGuideComponent,
	InputGuideComponent,
	TieredMenuGuideComponent,
	TooltipGuideComponent,
	SpinnerGuideComponent,
} from '@guide-components/atoms';

// Molecules Guide Components
import { FormFieldGuideComponent, SearchBoxGuideComponent, ToastGuideComponent, DropdownGuideComponent, SwitchGuideComponent, DatepickerGuideComponent, BreadcrumbGuideComponent, FileUploadGuideComponent } from '@guide-components/molecules';

// Organisms Guide Components
import { TableGuideComponent, ModalGuideComponent, TabsGuideComponent } from '@guide-components/organisms';

// Themes Guide Components
import { ThemeGuideComponent } from './components/themes/theme-guide';
import { NavigationService } from '@services/navigation.service';

@Component({
	selector: 'app-design-system-guide',
	standalone: true,
	imports: [
    MainLayoutComponent,
    AtomicDesignIntroComponent,
    GuideHeaderComponent,
    AvatarGuideComponent,
    BadgeGuideComponent,
    ButtonGuideComponent,
    CardGuideComponent,
    CheckboxGuideComponent,
    IconGuideComponent,
    InputGuideComponent,
    LabelGuideComponent,
    TieredMenuGuideComponent,
    ChipGuideComponent,
    TooltipGuideComponent,
    SpinnerGuideComponent,
    FormFieldGuideComponent,
    SearchBoxGuideComponent,
    ToastGuideComponent,
    DropdownGuideComponent,
    SwitchGuideComponent,
    DatepickerGuideComponent,
    BreadcrumbGuideComponent,
    FileUploadGuideComponent,
    TableGuideComponent,
    ModalGuideComponent,
    TabsGuideComponent,
    ThemeGuideComponent
],
	templateUrl: './design-system-guide.html',
	styleUrls: ['./design-system-guide.css'],
})
export class DesignSystemGuideComponent {
	private readonly themeService = inject(ThemeService);
	private readonly navigationService = inject(NavigationService);

	// Computed properties for template binding
	readonly isDarkMode = computed(() => this.themeService.isDarkMode());

	// Navigation state
	activeSection = signal<string>('intro');

	// Navigation items for main sidebar (solo páginas principales)
	readonly navigation: NavigationItem[] = this.navigationService.getMainNavigation();

	// Menu items para la navegación interna de la guía (lado derecho)
	readonly guideMenuItems = [
		{ id: 'intro', title: 'Introducción', icon: '📚', category: 'general' },
		{ id: 'button', title: 'Button', icon: '🔘', category: 'atoms' },
		{ id: 'card', title: 'Card', icon: '🃏', category: 'atoms' },
		{ id: 'checkbox', title: 'Checkbox', icon: '☑️', category: 'atoms' },
		{ id: 'icon', title: 'Icon', icon: '🎨', category: 'atoms' },
		{ id: 'input', title: 'Input', icon: '📝', category: 'atoms' },
		{ id: 'label', title: 'Label', icon: '🏷️', category: 'atoms' },
		{ id: 'avatar', title: 'Avatar', icon: '👤', category: 'atoms' },
		{ id: 'badge', title: 'Badge', icon: '🏆', category: 'atoms' },
		{ id: 'tiered-menu', title: 'TieredMenu', icon: '📋', category: 'atoms' },
		{ id: 'chip', title: 'Chip', icon: '🏷️', category: 'atoms' },
		{ id: 'tooltip', title: 'Tooltip', icon: '💬', category: 'atoms' },
		{ id: 'spinner', title: 'Spinner', icon: '⏳', category: 'atoms' },
		{ id: 'form-field', title: 'Form Field', icon: '📝', category: 'molecules' },
		{ id: 'search-box', title: 'Search Box', icon: '🔍', category: 'molecules' },
		{ id: 'toast', title: 'Toast', icon: '🍞', category: 'molecules' },
		{ id: 'dropdown', title: 'Dropdown', icon: '🔽', category: 'molecules' },
		{ id: 'switch', title: 'Switch', icon: '🔛', category: 'molecules' },
		{ id: 'datepicker', title: 'Datepicker', icon: '📅', category: 'molecules' },
		{ id: 'breadcrumb', title: 'Breadcrumb', icon: '🗺️', category: 'molecules' },
		{ id: 'file-upload', title: 'File Upload', icon: '📁', category: 'molecules' },
		{ id: 'table', title: 'Table', icon: '📊', category: 'organisms' },
		{ id: 'modal', title: 'Modal', icon: '🪟', category: 'organisms' },
		{ id: 'tabs', title: 'Tabs', icon: '📑', category: 'organisms' },
		{ id: 'themes', title: 'Themes', icon: '🎨', category: 'themes' },
	];

	// Categorías para organizar el menú
	readonly categories = [
		{ id: 'general', title: 'General', icon: '📚' },
		{ id: 'atoms', title: 'Atoms', icon: '⚛️' },
		{ id: 'molecules', title: 'Molecules', icon: '🧬' },
		{ id: 'organisms', title: 'Organisms', icon: '🧩' },
		{ id: 'themes', title: 'Themes', icon: '🎨' },
	];

	/**
	 * Toggle between light and dark mode
	 */
	toggleDarkMode(): void {
		this.themeService.toggleDarkMode();
	}

	/**
	 * Navigate to a specific section
	 */
	navigateToSection(sectionId: string): void {
		this.activeSection.set(sectionId);
	}

	/**
	 * Get items by category
	 */
	getItemsByCategory(categoryId: string) {
		return this.guideMenuItems.filter((item) => item.category === categoryId);
	}

	/**
	 * Check if section is active
	 */
	isActiveSection(sectionId: string): boolean {
		return this.activeSection() === sectionId;
	}

	/**
	 * TrackBy functions
	 */
	trackByCategory(index: number, category: any): string {
		return category.id;
	}

	trackByItem(index: number, item: any): string {
		return item.id;
	}
}
