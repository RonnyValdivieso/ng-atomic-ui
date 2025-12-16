import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from '../../../../../components/atoms/checkbox';

/**
 * Página de documentación del componente Checkbox
 * Muestra ejemplos, variantes, tamaños y mejores prácticas
 */
@Component({
  selector: 'app-checkbox-guide',
  standalone: true,
  imports: [CommonModule, CheckboxComponent],
  templateUrl: './checkbox-guide.html',
  styleUrls: ['./checkbox-guide.css']
})
export class CheckboxGuideComponent {
  // Estados de ejemplo
  readonly basicChecked = signal(true);
  readonly termsAccepted = signal(false);
  readonly newsletterSubscribed = signal(true);
  readonly notificationsEnabled = signal(false);
  readonly selectAll = signal(false);
  readonly indeterminateState = signal(true);

  // Grupo de opciones
  readonly options = signal({
    option1: true,
    option2: false,
    option3: true
  });

  /**
   * Maneja cambios en el checkbox básico
   */
  onBasicChange(checked: boolean): void {
    this.basicChecked.set(checked);
    console.log('Checkbox básico:', checked);
  }

  /**
   * Maneja cambios en términos y condiciones
   */
  onTermsChange(checked: boolean): void {
    this.termsAccepted.set(checked);
    console.log('Términos aceptados:', checked);
  }

  /**
   * Maneja cambios en newsletter
   */
  onNewsletterChange(checked: boolean): void {
    this.newsletterSubscribed.set(checked);
    console.log('Newsletter suscrito:', checked);
  }

  /**
   * Maneja cambios en notificaciones
   */
  onNotificationsChange(checked: boolean): void {
    this.notificationsEnabled.set(checked);
    console.log('Notificaciones habilitadas:', checked);
  }

  /**
   * Maneja el estado de seleccionar todo
   */
  onSelectAllChange(checked: boolean): void {
    this.selectAll.set(checked);
    const currentOptions = this.options();
    this.options.set({
      option1: checked,
      option2: checked,
      option3: checked
    });
    this.updateIndeterminateState();
    console.log('Seleccionar todo:', checked);
  }

  /**
   * Maneja cambios en opciones individuales
   */
  onOptionChange(option: 'option1' | 'option2' | 'option3', checked: boolean): void {
    const currentOptions = this.options();
    this.options.set({
      ...currentOptions,
      [option]: checked
    });
    this.updateIndeterminateState();
    console.log(`Opción ${option}:`, checked);
  }

  /**
   * Actualiza el estado indeterminado del checkbox "Seleccionar todo"
   */
  private updateIndeterminateState(): void {
    const opts = this.options();
    const checkedCount = Object.values(opts).filter(Boolean).length;
    
    if (checkedCount === 0) {
      this.selectAll.set(false);
      this.indeterminateState.set(false);
    } else if (checkedCount === 3) {
      this.selectAll.set(true);
      this.indeterminateState.set(false);
    } else {
      this.selectAll.set(false);
      this.indeterminateState.set(true);
    }
  }
}
