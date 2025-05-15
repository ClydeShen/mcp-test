import { ComponentsPropsList, Theme, ThemeOptions } from '@mui/material';

type ComponentName = keyof ComponentsPropsList;
interface StyleOverridesRootProps {
  ownerState: ComponentsPropsList[ComponentName] & Record<string, unknown>;
  theme: Theme & Record<string, unknown>;
}

const htmlBaseFontSize = 10;
const typographyBaseFontSize = 16;

enum FontWeight {
  LIGHT = 300,
  REGULAR = 400,
  MEDIUM = 600,
  BOLD = 700,
  BLACK = 800,
  STRONG = 900,
}

enum Color {
  BRAND_PRIMARY_MAIN = '#00A45F',
  BRAND_PRIMARY_DARK_ACCENT = '#1b7c53',
  BRAND_SECONDARY_ACCENT_GREEN = '#A8B400',

  TEXT_PRIMARY_DEFAULT = '#323232',
  TEXT_SECONDARY_MEDIUM_GRAY = '#5A6376',
  TEXT_MUTED_DARK_GRAY = '#4A4D4E',
  TEXT_DISABLED_LIGHT_GRAY = '#8C96A8',

  BACKGROUND_MAIN_DEFAULT = '#ffffff',
  BACKGROUND_PAPER_WHITE = '#fffffe',
  BACKGROUND_NEUTRAL_LIGHT_GRAY = '#F0F2F5',
  BORDER_NEUTRAL_LIGHT_GRAY = '#E1E5E9',

  SEMANTIC_ERROR_MAIN_RED = '#e60000',
  SEMANTIC_ERROR_LIGHT_BG = '#FDF6F3',
  SEMANTIC_WARNING_MAIN_YELLOW = '#FECB00',
  SEMANTIC_WARNING_LIGHT_BG = '#FDF7E5',
  SEMANTIC_INFO_MAIN_BLUE = '#194488',
  SEMANTIC_INFO_LIGHT_BLUE_FOCUS = '#1199ff', // Color for focus rings, similar to #19f
  SEMANTIC_INFO_LIGHT_BG = '#E6F0F7',

  COMMON_UTILITY_WHITE = '#fffffd',
  COMMON_UTILITY_BLACK_PROXY = '#323231',
  FLICKITY_BUTTON_BG_SEMI_TRANSPARENT = 'hsla(0,0%,100%,.75)',
}

export const THEME_APP_PALETTE = Object.freeze({
  primaryAction: Color.BRAND_PRIMARY_MAIN,
  accentDark: Color.BRAND_PRIMARY_DARK_ACCENT,
  accentSecondary: Color.BRAND_SECONDARY_ACCENT_GREEN,
  backgroundLightNeutral: Color.BACKGROUND_NEUTRAL_LIGHT_GRAY,
  backgroundMain: Color.BACKGROUND_MAIN_DEFAULT,
  textPrimary: Color.TEXT_PRIMARY_DEFAULT,
  borderNeutral: Color.BORDER_NEUTRAL_LIGHT_GRAY,
  textMuted: Color.TEXT_MUTED_DARK_GRAY,
});

const palette = {
  white: Color.COMMON_UTILITY_WHITE,
  black: Color.COMMON_UTILITY_BLACK_PROXY,
  primary: {
    main: Color.BRAND_PRIMARY_MAIN,
    light: Color.BRAND_SECONDARY_ACCENT_GREEN,
    dark: Color.BRAND_PRIMARY_DARK_ACCENT,
    contrastText: Color.TEXT_PRIMARY_DEFAULT,
  },
  secondary: {
    main: Color.TEXT_SECONDARY_MEDIUM_GRAY,
    light: Color.TEXT_DISABLED_LIGHT_GRAY,
    dark: Color.TEXT_PRIMARY_DEFAULT,
    contrastText: Color.BACKGROUND_NEUTRAL_LIGHT_GRAY,
  },
  border: Color.BORDER_NEUTRAL_LIGHT_GRAY,
  background: {
    default: Color.BACKGROUND_MAIN_DEFAULT,
    paper: Color.BACKGROUND_PAPER_WHITE,
  },
  error: {
    main: Color.SEMANTIC_ERROR_MAIN_RED,
    light: Color.SEMANTIC_ERROR_LIGHT_BG,
    contrastText: Color.TEXT_PRIMARY_DEFAULT,
  },
  warning: {
    main: Color.SEMANTIC_WARNING_MAIN_YELLOW,
    light: Color.SEMANTIC_WARNING_LIGHT_BG,
    contrastText: Color.TEXT_PRIMARY_DEFAULT,
  },
  info: {
    main: Color.SEMANTIC_INFO_MAIN_BLUE,
    light: Color.SEMANTIC_INFO_LIGHT_BG,
    contrastText: Color.BACKGROUND_NEUTRAL_LIGHT_GRAY,
  },
  success: {
    main: Color.BRAND_SECONDARY_ACCENT_GREEN,
    dark: Color.BRAND_PRIMARY_MAIN,
    light: Color.BACKGROUND_NEUTRAL_LIGHT_GRAY,
    contrastText: Color.TEXT_PRIMARY_DEFAULT,
  },
  text: {
    primary: Color.TEXT_PRIMARY_DEFAULT,
    secondary: Color.TEXT_SECONDARY_MEDIUM_GRAY,
    disabled: Color.TEXT_DISABLED_LIGHT_GRAY,
  },
  action: {
    disabledBackground: Color.BORDER_NEUTRAL_LIGHT_GRAY,
    disabled: Color.TEXT_DISABLED_LIGHT_GRAY,
  },
};

const baseThemeOptions = Object.freeze({
  palette: {
    primary: {
      main: palette.primary.main,
      light: palette.primary.light,
      dark: palette.primary.dark,
      contrastText: palette.primary.contrastText,
    },
    secondary: {
      main: palette.secondary.main,
      light: palette.secondary.light,
      dark: palette.secondary.dark,
      contrastText: palette.secondary.contrastText,
    },
    text: {
      primary: palette.primary.contrastText,
      secondary: palette.secondary.main,
      disabled: palette.text.disabled,
    },
    error: {
      main: palette.error.main,
      light: palette.error.light,
      contrastText: palette.error.contrastText,
    },
    warning: {
      main: palette.warning.main,
      light: palette.warning.light,
      contrastText: palette.warning.contrastText,
    },
    info: {
      main: palette.info.main,
      light: palette.info.light,
      contrastText: palette.info.contrastText,
    },
    success: {
      main: palette.success.main,
      light: palette.success.light,
      dark: palette.success.dark,
      contrastText: palette.success.contrastText,
    },
    background: palette.background,
    common: {
      black: palette.black,
      white: palette.white,
    },
    divider: palette.border,
    action: palette.action,
  },
  typography: {
    fontFamily: 'var(--font-euclid)',
    htmlFontSize: htmlBaseFontSize,
    fontSize: typographyBaseFontSize,
    fontWeightLight: FontWeight.LIGHT,
    fontWeightRegular: FontWeight.REGULAR,
    fontWeightMedium: FontWeight.MEDIUM,
    fontWeightBold: FontWeight.BOLD,

    body1: {
      fontSize: '1.6rem',
      fontWeight: FontWeight.REGULAR,
      lineHeight: 24 / 16,
      letterSpacing: '-0.16px',
    },
    body2: {
      fontSize: '1.4rem',
      fontWeight: FontWeight.REGULAR,
      letterSpacing: '-0.14px',
      lineHeight: 16 / 14,
    },
    subtitle1: {
      fontSize: '1.8rem',
      lineHeight: 16 / 14,
      fontWeight: FontWeight.BOLD,
    },
    subtitle2: {
      fontSize: '1.5rem',
      lineHeight: 16 / 14,
      fontWeight: FontWeight.MEDIUM,
    },
    overline: {
      fontSize: '1.2rem',
      lineHeight: 16 / 14,
      fontWeight: FontWeight.REGULAR,
      textTransform: 'uppercase',
    },
    caption: {
      fontSize: '1.2rem',
      lineHeight: 16 / 14,
      fontWeight: FontWeight.MEDIUM,
    },
    h1: {
      fontWeight: FontWeight.BOLD,
      fontSize: '3.0rem',
      letterSpacing: '-0.32px',
      lineHeight: 36 / 32,
    },
    h2: {
      fontWeight: FontWeight.MEDIUM,
      fontSize: '2.6rem',
      lineHeight: 32 / 24,
    },
    h3: {
      fontWeight: FontWeight.BOLD,
      fontSize: '2.0rem',
      lineHeight: 28 / 20,
    },
    h4: {
      fontWeight: FontWeight.MEDIUM,
      fontSize: '1.9rem',
      lineHeight: 28 / 18,
      letterSpacing: '-0.36px',
    },
    h5: {
      fontSize: '1.8rem',
      lineHeight: 28 / 18,
      fontWeight: FontWeight.REGULAR,
      letterSpacing: '-0.18px',
    },
    h6: {
      fontSize: '2.0rem',
      lineHeight: 24 / 16,
      fontWeight: FontWeight.MEDIUM,
      letterSpacing: '-0.16px',
    },
    button: {
      fontSize: '1.5rem',
      fontWeight: FontWeight.MEDIUM,
      lineHeight: 1.266666,
      letterSpacing: '-0.5px',
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          MozOsxFontSmoothing: 'grayscale',
          WebkitFontSmoothing: 'antialiased',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100dvh',
          width: '100%',
        },
        body: {
          display: 'flex',
          flex: '1 1 auto',
          minHeight: '100dvh',
          width: '100%',
          margin: 0,
        },
      },
    },
    MuiPaper: {},
    MuiIconButton: {
      styleOverrides: {
        root: {
          width: '44px',
          height: '44px',
          padding: 0,
          backgroundColor: Color.FLICKITY_BUTTON_BG_SEMI_TRANSPARENT,
          color: Color.TEXT_PRIMARY_DEFAULT,
          border: 'none',
          borderRadius: '50%',
          transition: 'background-color .25s, opacity .25s',
          '&:hover': {
            backgroundColor: Color.COMMON_UTILITY_WHITE,
          },
          '&:focus-visible': {
            outline: 'none',
            boxShadow: `0 0 0 5px ${Color.SEMANTIC_INFO_LIGHT_BLUE_FOCUS}`,
          },
          '&:active': {
            opacity: 0.6,
          },
          '&.Mui-disabled': {
            opacity: 0.3,
            backgroundColor: Color.FLICKITY_BUTTON_BG_SEMI_TRANSPARENT, // Ensure background doesn't change much
            pointerEvents: 'auto', // CSS had this, but MUI handles it
            cursor: 'auto', // CSS had this
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: ({ theme }: StyleOverridesRootProps) => ({
          minHeight: '50px',
          height: '50px',
          paddingLeft: theme.spacing(2.5), // 20px approx
          paddingRight: theme.spacing(2.5),
          transition: 'color .25s, background-color .25s, border-color .25s',
        }),
        containedPrimary: ({ theme }: StyleOverridesRootProps) => ({
          paddingLeft: '45px',
          paddingRight: '45px',
          backgroundColor: theme.palette.primary.main,
          color: Color.COMMON_UTILITY_WHITE, // from .primaryButton color: #fff
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        }),
        disabled: ({ theme }: StyleOverridesRootProps) => ({
          backgroundColor: `${theme.palette.action.disabledBackground} !important`,
          color: `${theme.palette.action.disabled} !important`,
        }),
      },
    },
    MuiInputBase: {},
  },
} satisfies ThemeOptions);

export default baseThemeOptions;
