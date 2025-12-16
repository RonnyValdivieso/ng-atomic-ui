# Avatar Component

El componente **Avatar** es un átomo del sistema de diseño que permite mostrar fotos de perfil de usuarios, iniciales, o contenido de respaldo. Soporta múltiples tamaños, variantes, indicadores de estado e interacciones de clic.

## Características

- ✅ **Múltiples tipos de contenido**: Imagen, iniciales, placeholder con ícono o texto personalizado
- ✅ **Tamaños variables**: 6 tamaños desde `xs` (24px) hasta `2xl` (80px)
- ✅ **Variantes de forma**: Circular, redondeado, cuadrado
- ✅ **Indicadores de estado**: Online, offline, ausente, ocupado
- ✅ **Estados interactivos**: Clickeable, deshabilitado, cargando
- ✅ **Accesibilidad completa**: ARIA labels, navegación por teclado
- ✅ **Responsive**: Adaptación automática en móviles
- ✅ **Modo oscuro**: Soporte completo para temas

## Uso Básico

### Avatar con Imagen

```html
<app-avatar 
  src="/assets/user-photo.jpg"
  alt="John Doe"
  size="lg"
  variant="circular">
</app-avatar>
```

### Avatar con Iniciales

```html
<app-avatar 
  initials="John Doe"
  size="md"
  variant="rounded"
  status="online">
</app-avatar>
```

### Avatar Placeholder

```html
<app-avatar 
  placeholder="Admin"
  size="sm"
  variant="square">
</app-avatar>
```

## Propiedades (Inputs)

| Propiedad | Tipo | Valor por Defecto | Descripción |
|-----------|------|-------------------|-------------|
| `src` | `string` | `''` | URL de la imagen del avatar |
| `alt` | `string` | `''` | Texto alternativo para la imagen |
| `initials` | `string` | `''` | Nombre para generar iniciales |
| `size` | `AvatarSize` | `'md'` | Tamaño del avatar |
| `variant` | `AvatarVariant` | `'circular'` | Forma del avatar |
| `status` | `AvatarStatus` | `'none'` | Estado del usuario |
| `clickable` | `boolean` | `false` | Si el avatar es clickeable |
| `disabled` | `boolean` | `false` | Si el avatar está deshabilitado |
| `loading` | `boolean` | `false` | Si muestra estado de carga |
| `placeholder` | `string` | `''` | Texto personalizado de placeholder |

## Tipos de Datos

### AvatarSize
```typescript
type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
```

### AvatarVariant
```typescript
type AvatarVariant = 'circular' | 'rounded' | 'square';
```

### AvatarStatus
```typescript
type AvatarStatus = 'online' | 'offline' | 'away' | 'busy' | 'none';
```

## Indicadores de Estado

Los indicadores de estado son círculos pequeños que aparecen en la esquina inferior derecha del avatar para mostrar la disponibilidad del usuario. Han sido optimizados para máxima visibilidad:

### Características del Indicador de Estado:
- **Posicionamiento inteligente**: Se posiciona completamente visible dentro del avatar
- **Tamaños proporcionales**: Se ajusta automáticamente según el tamaño del avatar
- **Alta visibilidad**: Incluye borde blanco y sombra sutil para destacar
- **Colores semánticamente correctos**: Cada estado tiene un color intuitivo

### Tamaños del Indicador por Avatar:
| Avatar | Indicador | Descripción |
|--------|-----------|-------------|
| `xs` (24px) | 8px | Mínimo visible |
| `sm` (32px) | 10px | Compacto |
| `md` (40px) | 12px | Estándar |
| `lg` (48px) | 14px | Prominente |
| `xl` (64px) | 18px | Muy visible |
| `2xl` (80px) | 22px | Máxima visibilidad |

## Eventos (Outputs)

| Evento | Tipo | Descripción |
|--------|------|-------------|
| `clicked` | `void` | Se emite cuando el avatar es clickeado |
| `imageError` | `void` | Se emite cuando la imagen falla al cargar |
| `imageLoaded` | `void` | Se emite cuando la imagen se carga exitosamente |

## Ejemplos de Uso

### Avatar Interactivo
```html
<app-avatar 
  src="/assets/profile.jpg"
  alt="Profile Picture"
  size="lg"
  [clickable]="true"
  status="online"
  (clicked)="openUserProfile()">
</app-avatar>
```

### Avatar con Estado de Carga
```html
<app-avatar 
  [src]="userImage"
  [loading]="imageLoading"
  size="xl"
  (imageLoaded)="onImageLoad()"
  (imageError)="onImageError()">
</app-avatar>
```

### Lista de Usuarios
```html
@for (user of users; track user.id) {
  <app-avatar 
    [src]="user.avatar"
    [initials]="user.name"
    [alt]="user.name + ' profile'"
    size="md"
    variant="circular"
    [status]="user.status"
    [clickable]="true"
    (clicked)="selectUser(user)">
  </app-avatar>
}
```

## Tamaños y Dimensiones

| Tamaño | Dimensiones | Uso Recomendado |
|--------|-------------|-----------------|
| `xs` | 24x24px | Avatares inline, listas compactas |
| `sm` | 32x32px | Navegación, comentarios |
| `md` | 40x40px | Listas de usuarios, chat |
| `lg` | 48x48px | Perfiles de usuario, cards |
| `xl` | 64x64px | Headers de perfil |
| `2xl` | 80x80px | Páginas de perfil principales |

## Indicadores de Estado

| Estado | Color | Significado |
|--------|-------|-------------|
| `online` | Verde | Usuario activo |
| `offline` | Gris | Usuario desconectado |
| `away` | Amarillo | Usuario ausente |
| `busy` | Rojo | Usuario ocupado |
| `none` | - | Sin indicador |

## Métodos Estáticos Útiles

### Generar Iniciales
```typescript
const initials = AvatarComponent.generateInitials('John Doe'); // 'JD'
```

### Validar URL de Imagen
```typescript
const isValid = AvatarComponent.isValidImageUrl('https://example.com/image.jpg'); // true
```

### Obtener Color de Estado
```typescript
const color = AvatarComponent.getStatusColor('online'); // '#10b981'
```

## Accesibilidad

El componente Avatar incluye características de accesibilidad:

- **ARIA Labels**: Etiquetas descriptivas automáticas
- **Navegación por Teclado**: Soporte para Enter y Space
- **Alto Contraste**: Estilos adaptados para mejor visibilidad
- **Screen Readers**: Información de estado accesible

## Personalización

### Variables CSS Personalizables

```css
.avatar {
  --avatar-bg: var(--p-surface-200);
  --avatar-color: var(--p-text-color);
  --avatar-border: var(--p-surface-border);
}
```

### Clases CSS Disponibles

- `.avatar--{size}`: Clases de tamaño
- `.avatar--{variant}`: Clases de variante
- `.avatar--clickable`: Para avatares interactivos
- `.avatar--disabled`: Para avatares deshabilitados
- `.avatar--loading`: Para estado de carga

## Integración con Otros Componentes

El Avatar se puede usar fácilmente con otros componentes:

```html
<!-- Con Button -->
<app-button variant="ghost" (clicked)="openProfile()">
  <app-avatar src="/user.jpg" size="sm"></app-avatar>
  Profile
</app-button>

<!-- Con Dropdown -->
<app-dropdown>
  <app-avatar 
    src="/user.jpg" 
    size="md" 
    [clickable]="true"
    #trigger>
  </app-avatar>
  <div>Profile options...</div>
</app-dropdown>
```

## Buenas Prácticas

1. **Siempre incluir `alt`** para imágenes por accesibilidad
2. **Usar iniciales como fallback** cuando no hay imagen
3. **Aplicar estados apropiados** (online/offline) en tiempo real
4. **Optimizar imágenes** para mejor rendimiento
5. **Considerar lazy loading** para listas grandes
6. **Usar tamaños consistentes** en el mismo contexto

### Indicadores de Estado:
7. **Usar estados semánticamente correctos**:
   - `online` (verde): Usuario activamente disponible
   - `away` (amarillo): Usuario temporalmente ausente
   - `busy` (rojo): Usuario ocupado, no disponible
   - `offline` (gris): Usuario desconectado
8. **Actualizar en tiempo real** el estado del usuario
9. **Considerar el contexto**: No todos los avatares necesitan indicador
10. **Tamaños mínimos**: Usar al menos `md` cuando el estado es importante

## Rendimiento

- ✅ Lazy loading automático para imágenes
- ✅ CSS-in-JS mínimo, principalmente clases CSS
- ✅ Signals para reactividad eficiente
- ✅ Standalone component para tree-shaking

## Compatibilidad

- ✅ Angular 18+
- ✅ Todos los navegadores modernos
- ✅ Responsive design
- ✅ Touch devices
- ✅ Screen readers