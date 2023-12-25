import { type Readable, Writable, Transform } from 'node:stream';
import { type Component } from '@dark-engine/core';

import {
  STYLE_TAG,
  STYLED_ATTR,
  GLOBAL_ATTR_VALUE,
  COMPONENTS_ATTR_VALUE,
  INTERLEAVE_GLOBAL_ATTR_VALUE,
  INTERLEAVE_COMPONENTS_ATTR_VALUE,
  FUNCTION_MARK,
} from '../constants';
import { STYLE_LEVEL, Manager, ManagerProvider } from './manager';

class ServerStyleSheet {
  manager = new Manager();

  collectStyles(app: Component) {
    return ManagerProvider({ manager: this.manager, slot: app });
  }

  getStyleTags(): Array<string> {
    const styles = this.manager.getStyles();
    const tags: Array<string> = [];
    const tag1 = `<${STYLE_TAG} ${STYLED_ATTR}="${GLOBAL_ATTR_VALUE}">${FUNCTION_MARK}</${STYLE_TAG}>`;
    const tag2 = `<${STYLE_TAG} ${STYLED_ATTR}="${COMPONENTS_ATTR_VALUE}">${FUNCTION_MARK}</${STYLE_TAG}>`;
    let css1 = '';
    let css2 = '';

    for (const $css of styles[STYLE_LEVEL.GLOBAL]) {
      css1 += $css;
    }

    for (const $css of styles[STYLE_LEVEL.COMPONENT]) {
      css2 += $css;
    }

    css1 && tags.push(tag1.replace(FUNCTION_MARK, css1));
    css2 && tags.push(tag2.replace(FUNCTION_MARK, css2));

    return tags;
  }

  interleaveWithStream(readable: Readable): Transform {
    const { manager } = this;
    const $seal = this.seal.bind(this);
    const writable = new Writable({ write() {} });
    const transform = new Transform({
      encoding: 'utf-8',
      transform(chunk: Buffer, _, callback) {
        const pattern = /(<\/.*?>)/;
        const data = chunk.toString();
        const styles = manager.getStyles();
        const set1 = styles[STYLE_LEVEL.GLOBAL];
        const set2 = styles[STYLE_LEVEL.COMPONENT];
        const tag1 = `<${STYLE_TAG} ${STYLED_ATTR}="${INTERLEAVE_GLOBAL_ATTR_VALUE}">${FUNCTION_MARK}</${STYLE_TAG}>`;
        const tag2 = `<${STYLE_TAG} ${STYLED_ATTR}="${INTERLEAVE_COMPONENTS_ATTR_VALUE}">${FUNCTION_MARK}</${STYLE_TAG}>`;
        let css1 = '';
        let css2 = '';
        let content = '';

        if (pattern.test(data)) {
          for (const style of set1) {
            css1 += style;
            set1.delete(style);
          }

          for (const style of set2) {
            css2 += style;
            set2.delete(style);
          }

          css1 && (content += tag1.replace(FUNCTION_MARK, css1));
          css2 && (content += tag2.replace(FUNCTION_MARK, css2));
          content = data.replace(pattern, `$1${content}`);
          this.push(content);
        } else {
          this.push(chunk);
        }

        callback();
      },
      final(callback) {
        $seal();
        callback();
      },
    });

    readable.pipe(transform).pipe(writable);

    return transform;
  }

  seal() {
    this.manager.seal();
  }
}

export { ServerStyleSheet };
