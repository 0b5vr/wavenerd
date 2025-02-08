const black = 'var(--black)';
const white = 'var(--white)';

const back1 = 'var(--back1)';
const back2 = 'var(--back2)';
const back3 = 'var(--back3)';

const overlayBack = `var(--overlay-back, ${back3})`;

const uiShadow = 'var(--ui-shadow, #0008)';

const codeBackground = 'var(--code-background)';

const fore = 'var(--fore)';
const foresub = 'var(--foresub)';
const foredark = 'var(--foredark)';

const barBg = `var(--bar-bg, ${back3})`;
const barFg = `var(--bar-fg, ${fore})`;

const listBg = `var(--list-bg, ${back2})`;
const listHoverBg = `var(--list-hover-bg, ${back3})`;
const listFocusedBg = `var(--list-focused-bg, ${back3})`;
const listFg = `var(--list-fg, ${fore})`;
const listHoverFg = `var(--list-hover-fg, ${listFg})`;
const listFocusedFg = `var(--list-focused-fg, ${listFg})`;

const headerBg = `var(--header-bg, ${barBg})`;
const headerFg = `var(--header-fg, ${barFg})`;

const contextMenuBg = `var(--context-menu-bg, ${back2})`;
const contextMenuFg = `var(--context-menu-fg, ${fore})`;

const modalBg = `var(--modal-bg, ${overlayBack})`;
const modalFg = `var(--modal-fg, ${fore})`;

const inputBack = 'var(--input-back)';
const inputBackInvalid = 'var(--input-back-invalid)';
const inputFore = 'var(--input-fore)';

const gray = 'var(--gray)';

const knobColor = `var(--knob-color, ${fore})`;
const knobNotch = `var(--knob-notch, ${back1})`;
const knobGuide = `var(--knob-guide, ${gray})`;
const knobBorder = `var(--knob-border, ${back1})`;
const knobGutter = `var(--knob-gutter, ${back1})`;
const knobShadow = 'var(--knob-shadow, #0008)';

const accent = 'var(--accent)';
const accentBright = 'var(--accent-bright)';
const green = 'var(--green)';
const error = 'var(--error)';

const levelMeter = `var(--level-meter, ${accent})`;

export const ThemeVars = {
  black,
  white,

  back1,
  back2,
  back3,

  overlayBack,

  uiShadow,

  codeBackground,

  fore,
  foresub,
  foredark,

  barBg,
  barFg,

  listBg,
  listHoverBg,
  listFocusedBg,
  listFg,
  listHoverFg,
  listFocusedFg,

  headerBg,
  headerFg,

  inputBack,
  inputBackInvalid,
  inputFore,

  contextMenuBg,
  contextMenuFg,

  modalBg,
  modalFg,

  gray,

  knobColor,
  knobNotch,
  knobGuide,
  knobBorder,
  knobGutter,
  knobShadow,

  accent,
  accentBright,
  green,
  error,

  levelMeter,
};
