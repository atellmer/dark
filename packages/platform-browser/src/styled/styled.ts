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

class StyleSheet {
  children: Array<StyleProp | MediaExp | NestingExp> = [];
}

class StyleProp extends Token {
  override normalize() {
    this.name = this.name.trim();
    super.normalize();
  }
}

class MediaExp extends Token {
  children: Array<StyleProp | NestingExp> = [];

  constructor() {
    super(MEDIA_EXP_START);
  }
}

class NestingExp extends Token {
  children: Array<StyleProp> = [];

  constructor() {
    super(NESTING_EXP_START);
  }
}

enum Cursor {
  PROP_NAME = 'PROP_NAME',
  PROP_VALUE = 'PROP_VALUE',
  MEDIA_EXP = 'MEDIA_EXP',
  NESTING_EXP = 'NESTING_EXP',
}
const PROP_VALUE_START = ':';
const PROP_VALUE_END = ';';
const MEDIA_EXP_START = '@';
const NESTING_EXP_START = '&';
const CHILDREN_START = '{';
const CHILDREN_END = '}';

function parse(css: string) {
  const stylesheet = new StyleSheet();
  let cursor: Cursor = null;
  let prop: StyleProp = null;
  let media: MediaExp = null;
  let nest: NestingExp = null;

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
        prop.normalize();

        if (!prop.name) {
          throw new Error('Incorrect style property name!');
        }

        if (media || nest) {
          media && !nest && media.children.push(prop);
          nest && nest.children.push(prop);
        } else {
          stylesheet.children.push(prop);
        }

        prop = null;
        continue;
      case MEDIA_EXP_START:
        if (nest) {
          throw new Error('Illegal style nesting!');
        }

        cursor = Cursor.MEDIA_EXP;
        media = new MediaExp();
        stylesheet.children.push(media);
        continue;
      case NESTING_EXP_START:
        cursor = Cursor.NESTING_EXP;
        nest = new NestingExp();

        if (media) {
          media.children.push(nest);
        } else {
          stylesheet.children.push(nest);
        }
        continue;
      case CHILDREN_START:
        if (media || nest) {
          cursor = Cursor.PROP_NAME;
          prop = new StyleProp();
        }
        continue;
      case CHILDREN_END:
        if (media || nest) {
          prop = null;

          if (media) {
            media.normalize();

            if (!nest) {
              media = null;
            }
          }

          if (nest) {
            nest.normalize();
            nest = null;
          }
        }
        continue;
      default:
        if (!prop) {
          cursor = Cursor.PROP_NAME;
          prop = new StyleProp();
        }
        break;
    }

    switch (cursor) {
      case Cursor.PROP_NAME:
        prop.name += lex;
        break;
      case Cursor.PROP_VALUE:
        prop.value += lex;
        break;
      case Cursor.MEDIA_EXP:
        media.value += lex;
        break;
      case Cursor.NESTING_EXP:
        nest.value += lex;
        break;
      default:
        throw new Error(`Unexpected cursor: ${cursor}`);
    }
  }

  console.log('root', stylesheet);

  return stylesheet;
}

export { parse, StyleSheet, StyleProp, MediaExp, NestingExp };
