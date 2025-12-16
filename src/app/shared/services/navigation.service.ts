import { Injectable } from '@angular/core';
import { NavigationItem } from '../../components/organisms/sidebar/sidebar';

/**
 * Navigation Service - Centralizes all application navigation menus
 * This service provides a single source of truth for navigation items
 * used across different layouts and components
 */
@Injectable({
	providedIn: 'root',
})
export class NavigationService {
	/**
	 * Main application navigation menu
	 * Used in the main sidebar for primary navigation
	 */
	getMainNavigation(): NavigationItem[] {
		return [
			{
				label: 'Design System',
				icon: 'pi-palette',
				route: '/design-system-guide',
			},
			{
				label: 'Layout Demo',
				icon: 'pi-th-large',
				route: '/layout-demo',
			},
		];
	}

	/**
	 * Design System Guide internal navigation
	 * Used for the right-side menu within the guide page
	 */
	getDesignSystemNavigation(): Array<{
		id: string;
		title: string;
		icon: string;
		category: string;
	}> {
		return [
			{ id: 'intro', title: 'Introducción', icon: '📚', category: 'intro' },
			{ id: 'button', title: 'Button', icon: '🔘', category: 'atoms' },
			{ id: 'card', title: 'Card', icon: '🃏', category: 'atoms' },
			{ id: 'checkbox', title: 'Checkbox', icon: '☑️', category: 'atoms' },
			{ id: 'icon', title: 'Icon', icon: '⭐', category: 'atoms' },
			{ id: 'input', title: 'Input', icon: '📝', category: 'atoms' },
			{ id: 'label', title: 'Label', icon: '🏷️', category: 'atoms' },
			{ id: 'avatar', title: 'Avatar', icon: '👤', category: 'atoms' },
			{ id: 'badge', title: 'Badge', icon: '🎯', category: 'atoms' },
			{ id: 'form-field', title: 'Form Field', icon: '📋', category: 'molecules' },
			{ id: 'search-box', title: 'Search Box', icon: '🔍', category: 'molecules' },
			{ id: 'themes', title: 'Themes', icon: '🎨', category: 'themes' },
		];
	}

	/**
	 * Design System categories for grouping
	 */
	getDesignSystemCategories(): Array<{
		id: string;
		title: string;
		icon: string;
	}> {
		return [
			{ id: 'intro', title: 'Introducción', icon: '📚' },
			{ id: 'atoms', title: 'Atoms', icon: '⚛️' },
			{ id: 'molecules', title: 'Molecules', icon: '🧬' },
			{ id: 'themes', title: 'Themes', icon: '🎨' },
		];
	}
}
