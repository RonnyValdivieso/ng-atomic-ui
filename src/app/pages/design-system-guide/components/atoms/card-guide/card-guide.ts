import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../../../components/atoms/card';
import { ButtonComponent } from '../../../../../components/atoms/button';
import { BadgeComponent } from '../../../../../components/atoms/badge';

/**
 * Página de documentación del componente Card
 * Muestra ejemplos, variantes, tamaños y mejores prácticas
 */
@Component({
  selector: 'app-card-guide',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, BadgeComponent],
  templateUrl: './card-guide.html',
  styleUrls: ['./card-guide.css']
})
export class CardGuideComponent {
}
