class Token {
  name: string;
  value: string;

  constructor(name = '', value = '') {
    this.name = name;
    this.value = value || name;
  }

  normalize() {
    this.value = this.value.trim();
  }

  generate(x?: string): string | [string, string] {
    return this.value;
  }
}

class StyleProp extends Token {
  override normalize() {
    this.name = this.name.trim();
    super.normalize();
  }

  override generate() {
    return `${this.name}${PROP_VALUE_START_MARK}${this.value}${PROP_VALUE_END_MARK}`;
  }
}

class MediaQueryExp extends Token {
  children: Array<StyleProp | NestingExp> = [];

  constructor() {
    super(MEDIA_QUERY_EXP_MARK);
  }

  override generate(className: string) {
    let css = `${this.value}${CHILDREN_START_MARK}${CLASS_NAME_MARK}${className}${CHILDREN_START_MARK}`;
    let nesting = '';

    for (const token of this.children) {
      if (detectIsStyleProp(token)) {
        css += token.generate();
      } else if (detectIsNestingExp(token)) {
        nesting += token.generate(className);
      }
    }

    css += `${CHILDREN_END_MARK}${CHILDREN_END_MARK}`;

    return [css, nesting] as [string, string];
  }
}

class NestingExp extends Token {
  children: Array<StyleProp> = [];

  constructor() {
    super(NESTING_EXP_MARK);
  }

  override generate(className: string) {
    let css = `${CLASS_NAME_MARK}${this.value.replace(NESTING_EXP_MARK, className)}${CHILDREN_START_MARK}`;

    for (const token of this.children) {
      if (detectIsStyleProp(token)) {
        css += token.generate();
      }
    }

    css += `${CHILDREN_END_MARK}`;

    return css;
  }
}

class StyleSheet {
  body: Array<StyleProp | MediaQueryExp | NestingExp> = [];

  generate(className: string) {
    let css = `${CLASS_NAME_MARK}${className}${CHILDREN_START_MARK}`;
    let nesting = '';
    let media = '';

    for (const token of this.body) {
      if (detectIsStyleProp(token)) {
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

enum Cursor {
  PROP_NAME = 'PROP_NAME',
  PROP_VALUE = 'PROP_VALUE',
  MEDIA_EXP = 'MEDIA_EXP',
  NESTING_EXP = 'NESTING_EXP',
}
const PROP_VALUE_START_MARK = ':';
const PROP_VALUE_END_MARK = ';';
const MEDIA_QUERY_EXP_MARK = '@';
const NESTING_EXP_MARK = '&';
const CHILDREN_START_MARK = '{';
const CHILDREN_END_MARK = '}';
const CLASS_NAME_MARK = '.';

function parse(css: string) {
  const stylesheet = new StyleSheet();
  let cursor: Cursor = null;
  let sp: StyleProp = null;
  let mqe: MediaQueryExp = null;
  let nse: NestingExp = null;

  //console.log(css);

  for (let i = 0; i < css.length; i++) {
    const lex = css[i];

    switch (lex) {
      case PROP_VALUE_START_MARK:
        if (cursor === Cursor.PROP_NAME) {
          cursor = Cursor.PROP_VALUE;
          continue;
        }
        break;
      case PROP_VALUE_END_MARK:
        sp.normalize();

        if (!sp.name) {
          throw new Error('Incorrect style property name!');
        }

        if (mqe || nse) {
          mqe && !nse && mqe.children.push(sp);
          nse && nse.children.push(sp);
        } else {
          stylesheet.body.push(sp);
        }

        sp = null;
        continue;
      case MEDIA_QUERY_EXP_MARK:
        if (nse) {
          throw new Error('Illegal style nesting!');
        }

        cursor = Cursor.MEDIA_EXP;
        mqe = new MediaQueryExp();
        stylesheet.body.push(mqe);
        continue;
      case NESTING_EXP_MARK:
        cursor = Cursor.NESTING_EXP;
        nse = new NestingExp();

        if (mqe) {
          mqe.children.push(nse);
        } else {
          stylesheet.body.push(nse);
        }
        continue;
      case CHILDREN_START_MARK:
        if (mqe || nse) {
          cursor = Cursor.PROP_NAME;
          sp = new StyleProp();
        }
        continue;
      case CHILDREN_END_MARK:
        if (mqe || nse) {
          sp = null;

          if (mqe) {
            mqe.normalize();

            if (!nse) {
              mqe = null;
            }
          }

          if (nse) {
            nse.normalize();
            nse = null;
          }
        }
        continue;
      default:
        if (!sp) {
          cursor = Cursor.PROP_NAME;
          sp = new StyleProp();
        }
        break;
    }

    switch (cursor) {
      case Cursor.PROP_NAME:
        sp.name += lex;
        break;
      case Cursor.PROP_VALUE:
        sp.value += lex;
        break;
      case Cursor.MEDIA_EXP:
        mqe.value += lex;
        break;
      case Cursor.NESTING_EXP:
        nse.value += lex;
        break;
      default:
        throw new Error(`Unexpected cursor: ${cursor}`);
    }
  }

  return stylesheet;
}

const detectIsStyleProp = (x: unknown): x is StyleProp => x instanceof StyleProp;

const detectIsMediaQueryExp = (x: unknown): x is MediaQueryExp => x instanceof MediaQueryExp;

const detectIsNestingExp = (x: unknown): x is NestingExp => x instanceof NestingExp;

export { parse, StyleSheet, StyleProp, MediaQueryExp, NestingExp };
