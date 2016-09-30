import { SvgIcon } from './';
import { expect } from 'chai';
import { mockDOMSource, h } from '@cycle/dom';
import xsAdapter from '@cycle/xstream-adapter';
import xs from 'xstream';

describe('SvgIcon', () => {
  it('should render as a SVG', done => {
    const svgIcon = SvgIcon({
      dom: mockDOMSource(xsAdapter, {}),
      color$: xs.of('pink'),
      children$: xs.of([h('path')])
    });
    const dom$ = svgIcon.dom.take(1);
    dom$.addListener({
        complete: done,
        error: err => done(err),
        next: vdom => expect(vdom.sel).to.have.string('svg')
      });
  });
  it('should render with no default class', done => {
    const svgIcon = SvgIcon({
      dom: mockDOMSource(xsAdapter, {}),
      color$: xs.of('pink'),
      children$: xs.of([h('path')])
    });
    const dom$ = svgIcon.dom.take(1);
    dom$.addListener({
        complete: done,
        error: err => done(err),
        next: vdom => expect(vdom.sel).to.have.string('svg.___cycle')
      });
  });
  it('should render the class that is passed in', done => {
    const svgIcon = SvgIcon({
      dom: mockDOMSource(xsAdapter, {}),
      color$: xs.of('pink'),
      children$: xs.of([h('path')]),
      classes$: xs.of('.fa.fa-icon')
    });
    const dom$ = svgIcon.dom.take(1);
    dom$.addListener({
        complete: done,
        error: err => done(err),
        next: vdom =>
          expect(vdom.sel).to.not.have.string('svg.___cycle')
          && expect(vdom.sel).to.have.string('.fa.fa-icon')
      });
  });
});
