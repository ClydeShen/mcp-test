import { CssBaseline } from '@mui/material';
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  responsiveFontSizes,
  ThemeOptions,
} from '@mui/material/styles';
import themeOption from './theme-options';
const createCustomTheme = () => {
  if (!themeOption || typeof themeOption !== 'object') {
    throw new Error('themeOption is invalid');
  }
  return responsiveFontSizes(createTheme(themeOption as ThemeOptions));
};
const theme = createCustomTheme();

export interface ThemeProviderProps {
  children?: React.ReactNode;
}
export const ThemeProvider = (props: ThemeProviderProps) => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {props.children}
    </MuiThemeProvider>
  );
};
