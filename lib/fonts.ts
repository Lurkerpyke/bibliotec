import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';    
import { createGlobalStyle } from 'styled-components';

// Create CSS variable injector
export const FontStyles = createGlobalStyle`
  :root {
    --font-geist-sans: ${GeistSans.style.fontFamily};
    --font-geist-mono: ${GeistMono.style.fontFamily};
    --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
    --font-mono: var(--font-geist-mono), ui-monospace, monospace;
  }
`;

// Export class name utilities
export const fontClasses = {
  sans: GeistSans.className,
  mono: GeistMono.className,
  variable: [
    GeistSans.variable,
    GeistMono.variable,
    'font-sans' // Default to sans
  ].join(' ')
};