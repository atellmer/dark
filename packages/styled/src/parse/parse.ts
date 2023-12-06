import {
  CHILDREN_START_MARK,
  CHILDREN_END_MARK,
  PROP_VALUE_START_MARK,
  PROP_VALUE_END_MARK,
  MEDIA_QUERY_MARK,
  FUNCTION_MARK,
} from '../constants';
import {
  type Children,
  StyleSheet,
  StyleExp,
  MediaQueryExp,
  NestingExp,
  FunctionExp,
  detectIsStyleSheet,
  detectIsStyleExp,
  detectIsMediaQueryExp,
  detectIsNestingExp,
  detectIsFunctionExp,
} from '../tokens';

function parse(css: string) {
  const stylesheet = new StyleSheet();
  const stack: Array<NestingExp | MediaQueryExp> = [];
  let buffer = '';
  let count = -1;

  for (let i = 0; i < css.length; i++) {
    const lex = css[i];
    const parent = stack[stack.length - 1] || stylesheet;
    const last = parent.children[parent.children.length - 1];

    buffer += lex;

    if (buffer.length >= FUNCTION_MARK.length && hasFunctionMark(buffer)) {
      const fne = new FunctionExp(++count);

      fne.parent = parent;
      fne.markAsDynamic();

      if (detectIsStyleExp(last) && !last.value) {
        fne.style = last;
        last.normalize();
        last.isDynamic = true;
        parent.children[parent.children.length - 1] = fne;
      } else {
        parent.children.push(fne);
      }

      buffer = buffer.slice(0, -FUNCTION_MARK.length);
      continue;
    }

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

          if (detectIsFunctionExp(token)) {
            buffer = '';
            continue;
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

function hasFunctionMark(x: string) {
  const length = FUNCTION_MARK.length;
  const part = x.slice(-length);

  for (let i = 0; i < length; i++) {
    if (part[i] !== FUNCTION_MARK[i]) return false;
  }

  return true;
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
