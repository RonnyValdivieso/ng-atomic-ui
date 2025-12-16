import { Directive, inject } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';

@Directive({
	selector: '[appTooltip]',
	standalone: true,
	hostDirectives: [
		{
			directive: Tooltip,
			inputs: [
				'tooltipPosition',
				'tooltipEvent',
				'tooltipStyleClass',
				'showDelay',
				'hideDelay',
				'tooltipDisabled: disabled',
				'escape',
				'tooltipOptions',
				// Map pTooltip (the value) to appTooltip (our selector)
				'pTooltip: appTooltip'
			]
		}
	]
})
export class TooltipDirective {
	private _tooltip = inject(Tooltip);

	constructor() {
		// Set default standard styling
		this._tooltip.tooltipStyleClass = 'atomic-tooltip';
	}
}
