import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

/**
 * Black Noir Theme Preset
 * Based on PrimeNG Aura with elegant gray/black palette
 * Enhanced for proper light/dark mode functionality
 */
export const BlackNoirPreset = definePreset(Aura, {
  semantic: {
    // Primary color: Zinc (sophisticated grays) instead of Emerald
    primary: {
      50: '{zinc.50}',   // Very light gray #fafafa
      100: '{zinc.100}', // #f4f4f5
      200: '{zinc.200}', // #e4e4e7
      300: '{zinc.300}', // #d4d4d8
      400: '{zinc.400}', // #a1a1aa
      500: '{zinc.500}', // #71717a (main)
      600: '{zinc.600}', // #52525b
      700: '{zinc.700}', // #3f3f46
      800: '{zinc.800}', // #27272a
      900: '{zinc.900}', // #18181b
      950: '{zinc.950}'  // #09090b (almost black)
    },
    
    // Complete color scheme configuration for both modes
    colorScheme: {
      light: {
        // Surface colors for light mode
        surface: {
          0: '#ffffff',
          50: '{zinc.50}',
          100: '{zinc.100}',
          200: '{zinc.200}',
          300: '{zinc.300}',
          400: '{zinc.400}',
          500: '{zinc.500}',
          600: '{zinc.600}',
          700: '{zinc.700}',
          800: '{zinc.800}',
          900: '{zinc.900}',
          950: '{zinc.950}'
        },
        
        // Primary colors for light mode
        primary: {
          color: '{zinc.950}',
          contrastColor: '#ffffff',
          hoverColor: '{zinc.900}',
          activeColor: '{zinc.800}'
        },
        
        // Text colors for light mode
        text: {
          color: '{zinc.950}',
          hoverColor: '{zinc.800}',
          mutedColor: '{zinc.600}',
          inverseColor: '#ffffff'
        },
        
        // Highlight and focus states
        highlight: {
          background: '{zinc.950}',
          focusBackground: '{zinc.800}',
          color: '#ffffff',
          focusColor: '#ffffff'
        }
      },
      
      dark: {
        // Surface colors for dark mode
        surface: {
          0: '{zinc.950}',
          50: '{zinc.900}',
          100: '{zinc.800}',
          200: '{zinc.700}',
          300: '{zinc.600}',
          400: '{zinc.500}',
          500: '{zinc.400}',
          600: '{zinc.300}',
          700: '{zinc.200}',
          800: '{zinc.100}',
          900: '{zinc.50}',
          950: '#ffffff'
        },
        
        // Primary colors for dark mode
        primary: {
          color: '{zinc.50}',
          contrastColor: '{zinc.950}',
          hoverColor: '{zinc.100}',
          activeColor: '{zinc.200}'
        },
        
        // Text colors for dark mode
        text: {
          color: '{zinc.50}',
          hoverColor: '{zinc.200}',
          mutedColor: '{zinc.400}',
          inverseColor: '{zinc.950}'
        },
        
        // Highlight and focus states for dark mode
        highlight: {
          background: 'rgba(255, 255, 255, 0.1)',
          focusBackground: 'rgba(255, 255, 255, 0.2)',
          color: '{zinc.50}',
          focusColor: '{zinc.50}'
        }
      }
    }
  }
});

export default BlackNoirPreset;