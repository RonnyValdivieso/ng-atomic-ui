import { Component } from '@angular/core';

import { ButtonComponent } from '@atoms/button';

/**
 * Guide section showcasing the Button component
 * Demonstrates all variants, sizes, states and use cases
 */
@Component({
  selector: 'app-button-guide',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './button-guide.html',
  styleUrls: ['./button-guide.css']
})
export class ButtonGuideComponent {
  onButtonClick(action: string): void {
    console.log(`Button clicked: ${action}`);
    alert(`Acción: ${action}`);
  }
}
