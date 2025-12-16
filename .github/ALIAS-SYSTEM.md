# 🎯 Sistema de Alias - Path Mapping

Este proyecto utiliza **TypeScript Path Mapping** para crear imports más limpios y organizados siguiendo los principios de **Atomic Design**.

## 📁 Alias Disponibles

### Componentes por Nivel Atomic Design
```typescript
// Átomos - Componentes básicos e indivisibles
import { ButtonComponent } from '@atoms/button';
import { InputComponent } from '@atoms/input';
import { LabelComponent } from '@atoms/label';
import { IconComponent } from '@atoms/icon';
import { AvatarComponent } from '@atoms/avatar';
import { BadgeComponent } from '@atoms/badge';

// Moléculas - Combinaciones de átomos
import { FormFieldComponent } from '@molecules/form-field';
import { SearchBoxComponent } from '@molecules/search-box';

// Organismos - Componentes complejos (futuro)
import { HeaderComponent } from '@organisms/header';
import { SidebarComponent } from '@organisms/sidebar';

// Templates - Layouts de página (futuro)
import { PageLayoutTemplate } from '@templates/page-layout';

// Páginas - Páginas completas
import { DashboardComponent } from '@pages/dashboard';
```

### Servicios y Utilidades
```typescript
// Servicios Angular
import { ThemeService } from '@services/theme';
import { AuthService } from '@services/auth';
import { ApiService } from '@services/api';

// Interfaces TypeScript
import { User } from '@interfaces/user';
import { ApiResponse } from '@interfaces/api';

// Tipos TypeScript
import { ButtonVariant } from '@types/button';
import { ThemeMode } from '@types/theme';

// Funciones de utilidad
import { formatDate } from '@utils/date';
import { debounce } from '@utils/performance';

// Recursos compartidos
import { Constants } from '@shared/constants';
import { Validators } from '@shared/validators';
```

### Guías del Sistema de Diseño
```typescript
// Guías de componentes
import { ButtonGuideComponent } from '@guides/components/atoms/button-guide';
import { FormFieldGuideComponent } from '@guides/components/molecules/form-field-guide';
```

### Configuración y Entornos
```typescript
// Configuraciones de entorno
import { environment } from '@env/environment';
import { environment as prodEnv } from '@env/environment.prod';
```

## ⚙️ Configuración Técnica

Los alias están configurados en `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@atoms/*": ["app/components/atoms/*"],
      "@molecules/*": ["app/components/molecules/*"],
      "@organisms/*": ["app/components/organisms/*"],
      "@templates/*": ["app/components/templates/*"],
      "@pages/*": ["app/pages/*"],
      "@services/*": ["app/shared/services/*"],
      "@interfaces/*": ["app/shared/interfaces/*"],
      "@types/*": ["app/shared/types/*"],
      "@utils/*": ["app/shared/utils/*"],
      "@shared/*": ["app/shared/*"],
      "@guides/*": ["app/design-system/*"],
      "@env/*": ["environments/*"]
    }
  }
}
```

## 📈 Ventajas del Sistema de Alias

### ✅ Antes (Rutas Relativas)
```typescript
// Confuso y propenso a errores
import { ButtonComponent } from '../../../atoms/button';
import { FormFieldComponent } from '../../../../molecules/form-field';
import { ThemeService } from '../../shared/services/theme.service';
```

### 🚀 Después (Con Alias)
```typescript
// Limpio, claro y fácil de mantener
import { ButtonComponent } from '@atoms/button';
import { FormFieldComponent } from '@molecules/form-field';
import { ThemeService } from '@services/theme';
```

## 🎯 Beneficios

1. **Imports más limpios** - Fáciles de leer y escribir
2. **Menos errores** - No más rutas relativas confusas
3. **Refactoring seguro** - Mover archivos no rompe imports
4. **Mejor organización** - Estructura mental clara del proyecto
5. **IntelliSense mejorado** - VS Code autocompleta mejor
6. **Consistencia** - Mismo patrón en todo el proyecto

## 🔧 Uso en VS Code

Los alias funcionan automáticamente con:
- **Auto-importación** - VS Code sugiere los alias correctos
- **Go to Definition** - Navegar directamente a los archivos
- **Refactoring** - Renombrar y mover archivos actualiza imports
- **IntelliSense** - Autocompletado inteligente

## 📋 Reglas de Uso

### ✅ Hacer
- Usar alias consistentemente en todo el proyecto
- Seguir la estructura de Atomic Design
- Mantener los índices `index.ts` actualizados
- Usar imports específicos cuando sea posible

### ❌ Evitar
- Mezclar alias con rutas relativas
- Crear alias demasiado genéricos
- Importar archivos internos que no están exportados
- Usar alias para archivos en la misma carpeta

## 🔄 Mantenimiento

### Agregar Nuevos Componentes
1. Crear el componente en la carpeta correspondiente
2. Exportarlo en el `index.ts` de la carpeta
3. Usar el alias en las importaciones

### Ejemplo:
```typescript
// 1. Crear: src/app/components/atoms/chip/chip.ts
export class ChipComponent { ... }

// 2. Exportar: src/app/components/atoms/chip/index.ts
export * from './chip';

// 3. Usar: cualquier archivo
import { ChipComponent } from '@atoms/chip';
```

---

## 🚀 Próximos Pasos

El sistema está configurado para crecer con el proyecto:
- Organismos y Templates cuando se necesiten
- Más servicios y utilidades
- Tipos e interfaces específicas del dominio
- Configuraciones avanzadas

¡Disfruta de imports más limpios y un código mejor organizado! 🎉