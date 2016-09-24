import { UIComponent, UIComponentSources, UIComponentSinks } from '../';
import { Stream } from 'xstream';
import { DOMSource } from '@cycle/dom/xstream-typings';
import { VNode, span } from '@cycle/dom';
import isolate from '@cycle/isolate';
import { merge, take } from '../../utils/extend';
import { themeify } from '../../utils/themeify';
import { Style } from '../../styles';
import { Theme, defaultTheme } from '../../styles/themes';

export interface FontIconSources extends UIComponentSources {
  color$: Stream<string>;
  icon$: Stream<string>;
  hoverColor$?: Stream<string>;
}

export interface FontIconSinks extends UIComponentSinks { }

const fontIconStyle: Style = {};
const fontIconClasses = '.material-icons';

function FontIconComponent(sources: FontIconSources): FontIconSinks {
  const hover$ =
    Stream.merge(
      sources.dom
        .select('span')
        .events('mouseenter')
        .mapTo(false),
      sources.dom
        .select('span')
        .events('mouseenter')
        .mapTo(true)
    ).startWith(false);
  const theme$ =
    take(sources.theme$, Stream.of(defaultTheme))
      .map(theme => merge(defaultTheme, theme));
  const localColor$ =
    theme$.map(theme =>
      take(sources.color$, Stream.of(theme.palette.textColor))
    ).flatten();
  const hoverColor$ =
    take(sources.hoverColor$, localColor$);
  const colorStyle$ =
    hover$.map(hover =>
      hover
        ? hoverColor$
        : localColor$
    ).flatten()
    .map(color => ({ color } as Style));
  const style$ =
    colorStyle$.map(colorStyle =>
      theme$.map(theme =>
        take(sources.style$, Stream.of(fontIconStyle)
          .map(style => merge(fontIconStyle, style))
        ).map(style => themeify(style, theme))
      ).flatten()
      .map(style => merge(style, colorStyle))
    ).flatten();
  const classes$ =
    take(sources.classes$, Stream.of(fontIconClasses));
  const dom =
    Stream.combine(classes$, style$, sources.icon$)
      .map(([classes, style, icon]) => span(classes, { style }, [icon]));
  return {
    dom
  };
}

export const FontIcon = (sources: FontIconSources) => isolate(FontIconComponent)(sources);
export default FontIcon;
