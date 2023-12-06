abstract class Token {
  name = '';
  value = '';

  normalize() {
    this.name = this.name.trim();
    this.value = this.value.trim();
  }

  abstract generate(className?: string): string | [string, string];
}

class NestingExp extends Token {
  name = NESTING_MARK;
  children: Array<StyleExp> = [];

  override generate(className: string) {
    let css = `${CLASS_NAME_MARK}${this.value.replace(SELF_MARK, className)}${CHILDREN_START_MARK}`;

    for (const token of this.children) {
      if (detectIsStyleExp(token)) {
        css += token.generate();
      }
    }

    css += `${CHILDREN_END_MARK}`;

    return css;
  }
}

class StyleExp extends Token {
  override generate() {
    return `${this.name}${PROP_VALUE_START_MARK}${this.value}${PROP_VALUE_END_MARK}`;
  }
}

class MediaQueryExp extends Token {
  name = MEDIA_QUERY_MARK;
  children: Array<StyleExp | NestingExp> = [];

  override generate(className: string) {
    let css = `${this.value}${CHILDREN_START_MARK}${CLASS_NAME_MARK}${className}${CHILDREN_START_MARK}`;
    let nesting = '';

    for (const token of this.children) {
      if (detectIsStyleExp(token)) {
        css += token.generate();
      } else if (detectIsNestingExp(token)) {
        nesting += token.generate(className);
      }
    }

    css += `${CHILDREN_END_MARK}${CHILDREN_END_MARK}`;

    return [css, nesting] as [string, string];
  }
}

class StyleSheet {
  body: Array<StyleExp | MediaQueryExp | NestingExp> = [];

  generate(className: string) {
    let css = `${CLASS_NAME_MARK}${className}${CHILDREN_START_MARK}`;
    let nesting = '';
    let media = '';

    for (const token of this.body) {
      if (detectIsStyleExp(token)) {
        css += token.generate();
      } else if (detectIsNestingExp(token)) {
        nesting += token.generate(className);
      } else if (detectIsMediaQueryExp(token)) {
        const [$media, $nesting] = token.generate(className);

        media += $media;
        nesting += $nesting;
      }
    }

    css += `${CHILDREN_END_MARK}${nesting}${media}`;

    return css;
  }
}

type Tokens = Array<StyleExp | NestingExp | MediaQueryExp>;

const CHILDREN_START_MARK = '{';
const CHILDREN_END_MARK = '}';
const PROP_VALUE_START_MARK = ':';
const PROP_VALUE_END_MARK = ';';
const MEDIA_QUERY_MARK = '@';
const NESTING_MARK = '>';
const SELF_MARK = '&';
const CLASS_NAME_MARK = '.';

function parse(css: string) {
  const stylesheet = new StyleSheet();
  const stack: Array<Tokens> = [];
  let lastNesting: NestingExp | MediaQueryExp = null;
  let value = '';

  for (let i = 0; i < css.length; i++) {
    const lex = css[i];
    const children = stack[stack.length - 1] || stylesheet.body;

    value += lex;

    switch (lex) {
      case CHILDREN_START_MARK:
        value = normalizeValue(value);
        const token = detectIsMediaQuery(value) ? new MediaQueryExp() : new NestingExp();

        if (
          (detectIsMediaQueryExp(token) && detectIsMediaQueryExp(lastNesting)) ||
          (detectIsNestingExp(token) && detectIsNestingExp(lastNesting))
        ) {
          throw new Error('Illegal style nesting!');
        }

        token.value = value;
        token.normalize();
        children.push(token);
        stack.push(token.children);
        lastNesting = token;
        value = '';
        break;
      case CHILDREN_END_MARK:
        stack.pop();
        lastNesting = null;
        value = '';
        break;
      case PROP_VALUE_START_MARK:
        {
          if (!detectIsPropName(value, i, css, children)) continue;
          const token = new StyleExp();

          value = normalizeValue(value);
          token.name = value;
          children.push(token);
        }
        value = '';
        break;
      case PROP_VALUE_END_MARK:
        {
          const token = children[children.length - 1];

          value = normalizeValue(value);
          token.value = value;
          token.normalize();
        }
        value = '';
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

const normalizeValue = (x: string) => x.substring(0, x.length - 1);

const detectIsStyleExp = (x: unknown): x is StyleExp => x instanceof StyleExp;

const detectIsMediaQueryExp = (x: unknown): x is MediaQueryExp => x instanceof MediaQueryExp;

const detectIsNestingExp = (x: unknown): x is NestingExp => x instanceof NestingExp;

export { parse, StyleSheet, StyleExp, MediaQueryExp, NestingExp };
