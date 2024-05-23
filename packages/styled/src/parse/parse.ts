import {
  OPENING_CURLY_BRACE_MARK,
  CLOSING_CURLY_BRACE_MARK,
  COLON_MARK,
  SEMICOLON_MARK,
  MEDIA_QUERY_MARK,
  CONTAINER_QUERY_MARK,
  KEYFRAMES_MARK,
  FUNCTION_MARK,
  SINGLE_LINE_COMMENT_START_MARK,
  SINGLE_LINE_COMMENT_END_MARK,
  MULTI_LINE_COMMENT_START_MARK,
  MULTI_LINE_COMMENT_END_MARK,
  OPENING_PARENTHESIS_MARK,
  CLOSING_PARENTHESIS_MARK,
  URL_FN_MARK,
} from '../constants';
import {
  type Children,
  StyleSheet,
  StyleRule,
  MediaQueryRule,
  ContainerQueryRule,
  KeyframesRule,
  NestingRule,
  FunctionRule,
  detectIsStyleSheet,
  detectIsStyleRule,
  detectIsQueryRule,
  detectIsKeyframesRule,
  detectIsNestingRule,
  detectIsFunctionRule,
} from '../tokens';
import { illegal } from '../utils';

function parse<P extends object>(css: string) {
  const stylesheet = new StyleSheet<P>();
  const stack: Array<NestingRule | MediaQueryRule> = [];
  let buffer = '';
  let end = '';
  let fnIdx = -1;
  let isSingleLineComment = false;
  let isMultiLineComment = false;
  let isPropValue = false;
  let isUrl = false;

  for (let i = 0; i < css.length; i++) {
    const char = css[i];
    const parent = stack[stack.length - 1] || stylesheet;
    const last = parent.children[parent.children.length - 1];

    buffer += char;

    if (!isSingleLineComment && detectHasSingleLineCommentStartMark(buffer)) {
      isSingleLineComment = !isUrl;
    } else if (isSingleLineComment && detectHasSingleLineCommentEndMark(buffer)) {
      isSingleLineComment = false;
      buffer = '';
    }

    if (!isMultiLineComment && detectHasMultiLineCommentStartMark(buffer)) {
      isMultiLineComment = true;
      end = detectIsStyleRule(last) ? createEnd(buffer) : '';
    } else if (isMultiLineComment && detectHasMultiLineCommentEndMark(buffer)) {
      isMultiLineComment = false;
      buffer = '';
    }

    if (isSingleLineComment || isMultiLineComment) continue;

    if (detectHasFunctionMark(buffer)) {
      const token = new FunctionRule();

      if (detectIsFunctionRule(last) && !last.getIsSealed() && last.style) {
        last.add(++fnIdx);
        buffer = '';
        continue;
      }

      token.add(++fnIdx);
      token.parent = parent;
      token.markAsDynamic();

      if (detectIsStyleRule(last) && !last.value) {
        token.style = last;
        token.name = buffer.trim();
        last.normalize();
        last.isDynamic = true;
        parent.children[parent.children.length - 1] = token;
      } else {
        parent.children.push(token);
      }

      buffer = '';
      continue;
    }

    switch (char) {
      case OPENING_CURLY_BRACE_MARK:
        {
          const token = detectHasMediaQueryMark(buffer)
            ? new MediaQueryRule()
            : detectHasContainerQueryMark(buffer)
            ? new ContainerQueryRule()
            : detectHasKeyframesMark(buffer)
            ? new KeyframesRule()
            : new NestingRule();
          const canNest = detectIsQueryRule(token)
            ? detectIsStyleSheet(parent) || detectIsNestingRule(parent)
            : detectIsKeyframesRule(token)
            ? detectIsStyleSheet(parent)
            : detectIsNestingRule(token)
            ? detectIsStyleSheet(parent) || detectIsQueryRule(parent) || detectIsKeyframesRule(parent)
            : false;

          if (!canNest) {
            illegal('Illegal style nesting!');
          }

          token.value = sub(buffer);
          token.normalize();
          token.parent = parent;

          if (!token.value) {
            illegal('Empty style nesting!');
          }

          parent.children.push(token);
          stack.push(token);
          buffer = '';
        }
        break;
      case CLOSING_CURLY_BRACE_MARK:
        stack.pop();
        buffer = '';
        break;
      case COLON_MARK:
        {
          if (!detectIsPropName(buffer, i, css, parent.children)) continue;
          const token = new StyleRule();

          token.name = sub(buffer);
          token.parent = parent;
          parent.children.push(token);
        }
        buffer = '';
        isPropValue = true;
        break;
      case SEMICOLON_MARK:
        if (!last) {
          illegal('Incorrect style!');
        }

        if (detectIsFunctionRule(last)) {
          last.seal(sub(buffer));
          buffer = '';
          continue;
        }

        last.value = end || sub(buffer);
        last.normalize();

        buffer = '';
        end = '';
        isPropValue = false;
        break;
      case OPENING_PARENTHESIS_MARK:
        if (isPropValue && detectHasUrlFnMark(buffer)) {
          isUrl = true;
        }
        break;
      case CLOSING_PARENTHESIS_MARK:
        isUrl = false;
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
  if (detectIsStyleRule(last) && !last.value) return false;

  for (let i = idx; i < css.length; i++) {
    const char = css[i];

    if (char === OPENING_CURLY_BRACE_MARK) return false;
    if (char === SEMICOLON_MARK) return true;
  }

  return true;
}

const detectHasSingleLineCommentStartMark = (x: string) => x.endsWith(SINGLE_LINE_COMMENT_START_MARK);

const detectHasSingleLineCommentEndMark = (x: string) => x.endsWith(SINGLE_LINE_COMMENT_END_MARK);

const detectHasMultiLineCommentStartMark = (x: string) => x.endsWith(MULTI_LINE_COMMENT_START_MARK);

const detectHasMultiLineCommentEndMark = (x: string) => x.endsWith(MULTI_LINE_COMMENT_END_MARK);

const detectHasFunctionMark = (x: string) => x.endsWith(FUNCTION_MARK);

const detectHasUrlFnMark = (x: string) => x.endsWith(URL_FN_MARK + OPENING_PARENTHESIS_MARK);

const detectHasMediaQueryMark = (x: string) => x.trim().startsWith(MEDIA_QUERY_MARK);

const detectHasContainerQueryMark = (x: string) => x.trim().startsWith(CONTAINER_QUERY_MARK);

const detectHasKeyframesMark = (x: string) => x.trim().startsWith(KEYFRAMES_MARK);

const sub = (x: string) => x.substring(0, x.length - 1);

const createEnd = (x: string) => x.replace(MULTI_LINE_COMMENT_START_MARK, '').trim();

export { parse };
