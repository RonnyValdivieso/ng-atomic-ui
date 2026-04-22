import { Component } from '@angular/core';

import { ChipComponent } from '@atoms/chip';

@Component({
	selector: 'app-chip-guide',
	standalone: true,
	imports: [ChipComponent],
	templateUrl: './chip-guide.html',
	styleUrls: ['./chip-guide.css']
})
export class ChipGuideComponent {
	onRemove(event: any) {
		console.log('Chip removed:', event);
	}
}
