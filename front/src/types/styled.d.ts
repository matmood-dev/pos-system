import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    mode: 'light' | 'dark';
    colors: {
      primary: string;
      secondary: string;
      background: string;
      surface: string;
      text: string;
      textSecondary: string;
      border: string;
      accent: string;
      glass: string;
      glassBorder: string;
    };
    shadows: {
      small: string;
      medium: string;
      large: string;
      glow: string;
    };
    gradients: {
      primary: string;
      secondary: string;
      background: string;
    };
  }
}