import { type Tokens, StyleSheet, StyleExp, MediaQueryExp, NestingExp } from '../tokens';
import {
  CHILDREN_START_MARK,
  CHILDREN_END_MARK,
  PROP_VALUE_START_MARK,
  PROP_VALUE_END_MARK,
  MEDIA_QUERY_MARK,
} from '../constants';

function parse(css: string) {
  const stylesheet = new StyleSheet();
  const stack: Array<Tokens> = [];
  let lastNesting: NestingExp | MediaQueryExp = null;
  let buffer = '';

  for (let i = 0; i < css.length; i++) {
    const lex = css[i];
    const children = stack[stack.length - 1] || stylesheet.body;

    buffer += lex;

    switch (lex) {
      case CHILDREN_START_MARK:
        buffer = normalizeBuffer(buffer);
        const token = detectIsMediaQuery(buffer) ? new MediaQueryExp() : new NestingExp();

        if (
          (detectIsMediaQueryExp(token) && detectIsMediaQueryExp(lastNesting)) ||
          (detectIsNestingExp(token) && detectIsNestingExp(lastNesting))
        ) {
          throw new Error('Illegal style nesting!');
        }

        token.value = buffer;
        token.normalize();

        if (!token.value) {
          throw new Error('Empty style nesting!');
        }

        children.push(token);
        stack.push(token.children);
        lastNesting = token;
        buffer = '';
        break;
      case CHILDREN_END_MARK:
        stack.pop();
        lastNesting = null;
        buffer = '';
        break;
      case PROP_VALUE_START_MARK:
        {
          if (!detectIsPropName(buffer, i, css, children)) continue;
          const token = new StyleExp();

          buffer = normalizeBuffer(buffer);
          token.name = buffer;
          children.push(token);
        }
        buffer = '';
        break;
      case PROP_VALUE_END_MARK:
        {
          const token = children[children.length - 1];

          if (!token) {
            throw new Error('Incorrect style!');
          }

          buffer = normalizeBuffer(buffer);
          token.value = buffer;
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

function detectIsPropName(name: string, idx: number, css: string, children: Tokens) {
  const last = children[children.length - 1];
  if (detectIsMediaQuery(name)) return false;
  if (detectIsStyleExp(last) && !last.value) return false;

  for (let i = idx; i < css.length; i++) {
    const lex = css[i];

    if (lex === CHILDREN_START_MARK) return false;
    if (lex === PROP_VALUE_END_MARK) return true;
  }

  return true;
}

const detectIsMediaQuery = (x: string) => x.trim().startsWith(MEDIA_QUERY_MARK);

const normalizeBuffer = (x: string) => x.substring(0, x.length - 1);

const detectIsStyleExp = (x: unknown): x is StyleExp => x instanceof StyleExp;

const detectIsMediaQueryExp = (x: unknown): x is MediaQueryExp => x instanceof MediaQueryExp;

const detectIsNestingExp = (x: unknown): x is NestingExp => x instanceof NestingExp;

export { parse };
