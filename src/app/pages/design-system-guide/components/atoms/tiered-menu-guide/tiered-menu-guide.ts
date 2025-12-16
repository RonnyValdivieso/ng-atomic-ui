import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TieredMenuComponent } from '../../../../../components/atoms/tiered-menu';
import { ButtonComponent } from '../../../../../components/atoms/button';
import { MenuItem } from 'primeng/api';

/**
 * Página de documentación del componente TieredMenu
 * Muestra ejemplos, variantes, tamaños y mejores prácticas
 */
@Component({
  selector: 'app-tiered-menu-guide',
  standalone: true,
  imports: [CommonModule, TieredMenuComponent, ButtonComponent],
  templateUrl: './tiered-menu-guide.html',
  styleUrls: ['./tiered-menu-guide.css']
})
export class TieredMenuGuideComponent {
  // Basic menu items
  basicItems = signal<MenuItem[]>([
    {
      label: 'Archivo',
      icon: 'pi pi-file',
      items: [
        { label: 'Nuevo', icon: 'pi pi-plus' },
        { label: 'Abrir', icon: 'pi pi-folder-open' },
        { separator: true },
        { label: 'Guardar', icon: 'pi pi-save' },
        { label: 'Guardar como', icon: 'pi pi-save' }
      ]
    },
    {
      label: 'Editar',
      icon: 'pi pi-pencil',
      items: [
        { label: 'Deshacer', icon: 'pi pi-undo' },
        { label: 'Rehacer', icon: 'pi pi-refresh' },
        { separator: true },
        { label: 'Copiar', icon: 'pi pi-copy' },
        { label: 'Pegar', icon: 'pi pi-paste' }
      ]
    },
    {
      label: 'Ver',
      icon: 'pi pi-eye',
      items: [
        { label: 'Zoom In', icon: 'pi pi-search-plus' },
        { label: 'Zoom Out', icon: 'pi pi-search-minus' }
      ]
    }
  ]);

  // Advanced menu items with nested levels
  advancedItems = signal<MenuItem[]>([
    {
      label: 'Archivo',
      icon: 'pi pi-file',
      items: [
        {
          label: 'Nuevo',
          icon: 'pi pi-plus',
          items: [
            { label: 'Documento', icon: 'pi pi-file' },
            { label: 'Hoja de cálculo', icon: 'pi pi-table' },
            { label: 'Presentación', icon: 'pi pi-chart-bar' }
          ]
        },
        { label: 'Abrir', icon: 'pi pi-folder-open' },
        {
          label: 'Recientes',
          icon: 'pi pi-clock',
          items: [
            { label: 'proyecto-2024.doc' },
            { label: 'informe.xlsx' },
            { label: 'presentacion.pptx' }
          ]
        },
        { separator: true },
        { label: 'Guardar', icon: 'pi pi-save' },
        { label: 'Cerrar', icon: 'pi pi-times' }
      ]
    },
    {
      label: 'Editar',
      icon: 'pi pi-pencil',
      items: [
        { label: 'Deshacer', icon: 'pi pi-undo' },
        { label: 'Rehacer', icon: 'pi pi-refresh' },
        { separator: true },
        { label: 'Cortar', icon: 'pi pi-times' },
        { label: 'Copiar', icon: 'pi pi-copy' },
        { label: 'Pegar', icon: 'pi pi-paste' }
      ]
    },
    {
      label: 'Ayuda',
      icon: 'pi pi-question-circle',
      items: [
        { label: 'Documentación', icon: 'pi pi-book' },
        { label: 'Tutoriales', icon: 'pi pi-video' },
        { separator: true },
        { label: 'Acerca de', icon: 'pi pi-info-circle' }
      ]
    }
  ]);

  // User menu
  userMenuItems = signal<MenuItem[]>([
    {
      label: 'Mi Cuenta',
      icon: 'pi pi-user',
      items: [
        { label: 'Perfil', icon: 'pi pi-id-card' },
        { label: 'Configuración', icon: 'pi pi-cog' },
        { separator: true },
        { label: 'Cerrar Sesión', icon: 'pi pi-sign-out' }
      ]
    },
    {
      label: 'Preferencias',
      icon: 'pi pi-sliders-h',
      items: [
        { label: 'Tema', icon: 'pi pi-palette' },
        { label: 'Idioma', icon: 'pi pi-globe' },
        { label: 'Notificaciones', icon: 'pi pi-bell' }
      ]
    }
  ]);

  handleMenuClick(event: { originalEvent: Event; item: MenuItem }) {
    console.log('Menu item clicked:', event.item.label);
  }

  // Helper methods to get MouseEvent from button clicks
  toggleMenu1(event: MouseEvent, menu: any) {
    menu.toggle(event);
  }

  toggleMenu2(event: MouseEvent, menu: any) {
    menu.toggle(event);
  }

  toggleMenu3(event: MouseEvent, menu: any) {
    menu.toggle(event);
  }

  toggleMenu4(event: MouseEvent, menu: any) {
    menu.toggle(event);
  }

  toggleMenuSmall(event: MouseEvent, menu: any) {
    menu.toggle(event);
  }

  toggleMenuMedium(event: MouseEvent, menu: any) {
    menu.toggle(event);
  }

  toggleMenuLarge(event: MouseEvent, menu: any) {
    menu.toggle(event);
  }
}
