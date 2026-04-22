import { Component } from '@angular/core';

import { TooltipDirective } from '@atoms/tooltip';
import { ButtonComponent } from '@atoms/button';
import { InputComponent } from '@atoms/input';

@Component({
	selector: 'app-tooltip-guide',
	standalone: true,
	imports: [TooltipDirective, ButtonComponent, InputComponent],
	templateUrl: './tooltip-guide.html',
	styleUrls: ['./tooltip-guide.css']
})
export class TooltipGuideComponent {}
