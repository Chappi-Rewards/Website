export const COLORS = {
  primary: '#2563EB',     // Blue-600
  secondary: '#FBBF24',   // Amber-400  
  accent: '#10B981',      // Emerald-500
  neutral: '#6B7280',     // Gray-500
  background: {
    light: '#FFFFFF',
    dark: '#1F2937'       // Gray-800
  },
  text: {
    primary: '#111827',   // Gray-900
    secondary: '#6B7280', // Gray-500
    light: '#FFFFFF'
  }
} as const;

export const CARD_STYLES = {
  width: 'w-80',          // 320px
  height: 'h-64',         // 256px
  borderRadius: 'rounded-lg', // 8px
  padding: 'p-6',         // 24px
  margin: 'mb-6'          // 24px bottom margin
} as const;

export const ICON_SIZES = {
  inline: 'w-5 h-5',      // 20px
  standalone: 'w-6 h-6',  // 24px
  large: 'w-8 h-8'        // 32px
} as const;

export const SECTIONS = {
  hero: 'hero',
  chappiWay: 'chappi-way',
  networkMap: 'network-map',
  toggleSection: 'toggle-section',
  culture: 'culture',
  cta: 'cta',
  footer: 'footer'
} as const;