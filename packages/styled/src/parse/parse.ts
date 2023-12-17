import {
  CHILDREN_START_MARK,
  CHILDREN_END_MARK,
  PROP_VALUE_START_MARK,
  PROP_VALUE_END_MARK,
  MEDIA_QUERY_MARK,
  CONTAINER_QUERY_MARK,
  FUNCTION_MARK,
  SINGLE_LINE_COMMENT_START_MARK,
  SINGLE_LINE_COMMENT_END_MARK,
  MULTI_LINE_COMMENT_START_MARK,
  MULTI_LINE_COMMENT_END_MARK,
} from '../constants';
import {
  type Children,
  StyleSheet,
  StyleExp,
  MediaQueryExp,
  ContainerQueryExp,
  NestingExp,
  FunctionExp,
  detectIsStyleSheet,
  detectIsStyleExp,
  detectIsMediaQueryExp,
  detectIsContainerQueryExp,
  detectIsNestingExp,
  detectIsFunctionExp,
} from '../tokens';

function parse(css: string) {
  const stylesheet = new StyleSheet();
  const stack: Array<NestingExp | MediaQueryExp> = [];
  let buffer = '';
  let fnIdx = -1;
  let isSingleLineComment = false;
  let isMultiLineComment = false;

  for (let i = 0; i < css.length; i++) {
    const char = css[i];
    const parent = stack[stack.length - 1] || stylesheet;
    const last = parent.children[parent.children.length - 1];

    buffer += char;

    if (!isSingleLineComment && detectHasSingleLineCommentStartMark(buffer)) {
      isSingleLineComment = true;
    } else if (isSingleLineComment && detectHasSingleLineCommentEndMark(buffer)) {
      isSingleLineComment = false;
      buffer = '';
    }

    if (!isMultiLineComment && detectHasMultiLineCommentStartMark(buffer)) {
      isMultiLineComment = true;
    } else if (isMultiLineComment && detectHasMultiLineCommentEndMark(buffer)) {
      isMultiLineComment = false;
      buffer = '';
    }

    if (isSingleLineComment || isMultiLineComment) continue;

    if (detectHasFunctionMark(buffer)) {
      const fne = new FunctionExp(++fnIdx);

      fne.parent = parent;
      fne.markAsDynamic();

      if (detectIsStyleExp(last) && !last.value) {
        fne.style = last;
        fne.name = buffer.trim();
        last.normalize();
        last.isDynamic = true;
        parent.children[parent.children.length - 1] = fne;
      } else {
        parent.children.push(fne);
      }

      buffer = '';
      continue;
    }

    switch (char) {
      case CHILDREN_START_MARK:
        const token = detectHasMediaQueryMark(buffer)
          ? new MediaQueryExp()
          : detectHasContainerQueryMark(buffer)
          ? new ContainerQueryExp()
          : new NestingExp();
        const canNest =
          detectIsMediaQueryExp(token) || detectIsContainerQueryExp(token)
            ? detectIsStyleSheet(parent)
            : detectIsNestingExp(token)
            ? detectIsStyleSheet(parent) || detectIsMediaQueryExp(parent) || detectIsContainerQueryExp(parent)
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

function detectIsPropName(name: string, idx: number, css: string, children: Children) {
  const last = children[children.length - 1];
  if (detectHasMediaQueryMark(name) || detectHasContainerQueryMark(name)) return false;
  if (detectIsStyleExp(last) && !last.value) return false;

  for (let i = idx; i < css.length; i++) {
    const lex = css[i];

    if (lex === CHILDREN_START_MARK) return false;
    if (lex === PROP_VALUE_END_MARK) return true;
  }

  return true;
}

const detectHasSingleLineCommentStartMark = (x: string) => x.trim().startsWith(SINGLE_LINE_COMMENT_START_MARK);

const detectHasSingleLineCommentEndMark = (x: string) => x.endsWith(SINGLE_LINE_COMMENT_END_MARK);

const detectHasMultiLineCommentStartMark = (x: string) => x.trim().startsWith(MULTI_LINE_COMMENT_START_MARK);

const detectHasMultiLineCommentEndMark = (x: string) => x.endsWith(MULTI_LINE_COMMENT_END_MARK);

const detectHasMediaQueryMark = (x: string) => x.trim().startsWith(MEDIA_QUERY_MARK);

const detectHasContainerQueryMark = (x: string) => x.trim().startsWith(CONTAINER_QUERY_MARK);

const detectHasFunctionMark = (x: string) => x.endsWith(FUNCTION_MARK);

const normalizeBuffer = (x: string) => x.substring(0, x.length - 1);

export { parse };
