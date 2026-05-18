export const ThemeColorKey = [
  'black',
  'white',

  'back1',
  'back2',
  'back3',

  'overlayBack',

  'uiShadow',

  'codeBackground',

  'fore',
  'foresub',
  'foredark',

  'barBg',
  'barFg',

  'listBg',
  'listHoverBg',
  'listFocusedBg',
  'listFg',
  'listHoverFg',
  'listFocusedFg',

  'headerBg',
  'headerFg',

  'contextMenuBg',
  'contextMenuFg',

  'modalBg',
  'modalFg',

  'inputBack',
  'inputBackInvalid',
  'inputFore',

  'gray',

  'knobColor',
  'knobNotch',
  'knobGuide',
  'knobBorder',
  'knobGutter',
  'knobShadow',

  'accent',
  'accentBright',
  'accentGray',
  'green',
  'error',

  'levelMeter',
] as const;
export type ThemeColorKey = (typeof ThemeColorKey)[number];
