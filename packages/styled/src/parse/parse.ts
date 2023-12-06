import {
  CHILDREN_START_MARK,
  CHILDREN_END_MARK,
  PROP_VALUE_START_MARK,
  PROP_VALUE_END_MARK,
  MEDIA_QUERY_MARK,
} from '../constants';
import {
  type Children,
  StyleSheet,
  StyleExp,
  MediaQueryExp,
  NestingExp,
  detectIsStyleSheet,
  detectIsStyleExp,
  detectIsMediaQueryExp,
  detectIsNestingExp,
} from '../tokens';

function parse(css: string) {
  const stylesheet = new StyleSheet();
  const stack: Array<NestingExp | MediaQueryExp> = [];
  let buffer = '';

  for (let i = 0; i < css.length; i++) {
    const lex = css[i];
    const parent = stack[stack.length - 1] || stylesheet;

    buffer += lex;

    switch (lex) {
      case CHILDREN_START_MARK:
        const token = detectHasMediaQueryMark(buffer) ? new MediaQueryExp() : new NestingExp();
        const canNest = detectIsMediaQueryExp(token)
          ? detectIsStyleSheet(parent)
          : detectIsNestingExp(token)
          ? detectIsStyleSheet(parent) || detectIsMediaQueryExp(parent)
          : false;

        if (!canNest) {
          throw new Error('Illegal style nesting!');
        }

        token.value = normalizeBuffer(buffer);
        token.normalize();
        token.parent = parent;

        if (!token.value) {
          throw new Error('Empty style nesting!');
        }

        parent.children.push(token);
        stack.push(token);
        buffer = '';
        break;
      case CHILDREN_END_MARK:
        stack.pop();
        buffer = '';
        break;
      case PROP_VALUE_START_MARK:
        {
          if (!detectIsPropName(buffer, i, css, parent.children)) continue;
          const token = new StyleExp();

          token.name = normalizeBuffer(buffer);
          token.parent = parent;
          parent.children.push(token);
        }
        buffer = '';
        break;
      case PROP_VALUE_END_MARK:
        {
          const token = parent.children[parent.children.length - 1];

          if (!token) {
            throw new Error('Incorrect style!');
          }

          token.value = normalizeBuffer(buffer);
          token.normalize();
        }
        buffer = '';
        break;
      default:
        break;
    }
  }

  return stylesheet;
}

function detectIsPropName(name: string, idx: number, css: string, children: Children) {
  const last = children[children.length - 1];
  if (detectHasMediaQueryMark(name)) return false;
  if (detectIsStyleExp(last) && !last.value) return false;

  for (let i = idx; i < css.length; i++) {
    const lex = css[i];

    if (lex === CHILDREN_START_MARK) return false;
    if (lex === PROP_VALUE_END_MARK) return true;
  }

  return true;
}

const detectHasMediaQueryMark = (x: string) => x.trim().startsWith(MEDIA_QUERY_MARK);

const normalizeBuffer = (x: string) => x.substring(0, x.length - 1);

export { parse };
