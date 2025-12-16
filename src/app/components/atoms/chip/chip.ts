import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipModule } from 'primeng/chip';

/**
 * Reusable Chip component based on PrimeNG Chip
 */
@Component({
	selector: 'app-chip',
	standalone: true,
	imports: [CommonModule, ChipModule],
	templateUrl: './chip.html',
	styleUrls: ['./chip.css']
})
export class ChipComponent {
	// Inputs
	readonly label = input<string>('');
	readonly icon = input<string>('');
	readonly image = input<string>('');
	readonly alt = input<string>('');
	readonly removable = input<boolean>(false);
	readonly styleClass = input<string>('');

	// Outputs
	readonly onRemove = output<any>();

	// Event Handlers
	protected onRemoveHandler(event: any): void {
		this.onRemove.emit(event);
	}
}
