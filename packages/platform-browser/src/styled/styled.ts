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
}

class StyleProp extends Token {
  override normalize() {
    this.name = this.name.trim();
    super.normalize();
  }
}

class MediaQueryExp extends Token {
  children: Array<StyleProp | NestingExp> = [];

  constructor() {
    super(MEDIA_QUERY_EXP_START);
  }
}

class NestingExp extends Token {
  children: Array<StyleProp> = [];

  constructor() {
    super(NESTING_EXP_START);
  }
}

class StyleSheet {
  body: Array<StyleProp | MediaQueryExp | NestingExp> = [];
}

enum Cursor {
  PROP_NAME = 'PROP_NAME',
  PROP_VALUE = 'PROP_VALUE',
  MEDIA_EXP = 'MEDIA_EXP',
  NESTING_EXP = 'NESTING_EXP',
}
const PROP_VALUE_START = ':';
const PROP_VALUE_END = ';';
const MEDIA_QUERY_EXP_START = '@';
const NESTING_EXP_START = '&';
const CHILDREN_START = '{';
const CHILDREN_END = '}';

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
      case PROP_VALUE_START:
        if (cursor === Cursor.PROP_NAME) {
          cursor = Cursor.PROP_VALUE;
          continue;
        }
        break;
      case PROP_VALUE_END:
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
      case MEDIA_QUERY_EXP_START:
        if (nse) {
          throw new Error('Illegal style nesting!');
        }

        cursor = Cursor.MEDIA_EXP;
        mqe = new MediaQueryExp();
        stylesheet.body.push(mqe);
        continue;
      case NESTING_EXP_START:
        cursor = Cursor.NESTING_EXP;
        nse = new NestingExp();

        if (mqe) {
          mqe.children.push(nse);
        } else {
          stylesheet.body.push(nse);
        }
        continue;
      case CHILDREN_START:
        if (mqe || nse) {
          cursor = Cursor.PROP_NAME;
          sp = new StyleProp();
        }
        continue;
      case CHILDREN_END:
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

export { parse, StyleSheet, StyleProp, MediaQueryExp as MediaExp, NestingExp };
