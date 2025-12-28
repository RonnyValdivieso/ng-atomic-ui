import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from '@atoms/input';
import { LabelComponent } from '@atoms/label';

interface UseCase {
	title: string;
	description: string;
	example: any;
}

@Component({
  selector: 'app-input-guide',
  standalone: true,
  imports: [CommonModule, InputComponent, LabelComponent],
  templateUrl: './input-guide.html',
  styleUrls: ['./input-guide.css']
})
export class InputGuideComponent {
  public readonly statusUseCases: UseCase[] = [
		{
			title: 'Error',
			description: 'An input field indicating an error state.',
			example: {
				placeholder: 'Input con error',
				value: 'Valor inválido',
				invalid: true
			}
		},
		{
			title: 'Success',
			description: 'An input field indicating a success state.',
			example: {
				placeholder: 'Input válido',
				value: 'Valor válido',
				success: true
			}
		}
	];
}