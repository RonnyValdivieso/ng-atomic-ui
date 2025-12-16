import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from '@atoms/input';
import { LabelComponent } from '@atoms/label';

@Component({
  selector: 'app-input-guide',
  standalone: true,
  imports: [CommonModule, InputComponent, LabelComponent],
  templateUrl: './input-guide.html',
  styleUrls: ['./input-guide.css']
})
export class InputGuideComponent {
  
}