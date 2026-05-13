import type { CSSProperties } from 'react';
import type { PopupTextStyle } from '@/lib/cms-types';

export function popupStyleToCss(s?: PopupTextStyle | null): CSSProperties {
  if (!s) return {};
  const css: CSSProperties = {
    textAlign: s.align,
    fontFamily: s.useDisplayFont ? 'var(--font-display)' : 'var(--font-body)',
  };
  if (s.fontSizeRem != null && !Number.isNaN(s.fontSizeRem)) {
    css.fontSize = `${s.fontSizeRem}rem`;
  }
  if (s.bold === true) css.fontWeight = 700;
  if (s.bold === false) css.fontWeight = 400;
  if (s.italic === true) css.fontStyle = 'italic';
  if (s.italic === false) css.fontStyle = 'normal';
  return css;
}
