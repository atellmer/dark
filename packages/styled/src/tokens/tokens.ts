import {
  CHILDREN_START_MARK,
  CHILDREN_END_MARK,
  PROP_VALUE_START_MARK,
  PROP_VALUE_END_MARK,
  MEDIA_QUERY_MARK,
  NESTING_MARK,
  SELF_MARK,
  CLASS_NAME_MARK,
} from '../constants';

abstract class Token {
  name = '';
  value = '';
  parent: Parent;

  normalize() {
    this.name = this.name.trim();
    this.value = this.value.trim();
  }

  abstract generate(className?: string): string;
}

class StyleExp extends Token {
  override generate() {
    return `${this.name}${PROP_VALUE_START_MARK}${this.value}${PROP_VALUE_END_MARK}`;
  }
}

class NestingExp extends Token {
  name = NESTING_MARK;
  children: Children = [];

  override generate(className: string) {
    let styles = `${this.value.replace(SELF_MARK, `${CLASS_NAME_MARK}${className}`)}${CHILDREN_START_MARK}`;

    for (const token of this.children) {
      const se = token as unknown as StyleExp;
      const mqe = token as unknown as MediaQueryExp;

      if (detectIsStyleExp(token)) {
        styles += se.generate();
      } else if (detectIsMediaQueryExp(token)) {
        styles += mqe.generate(className);
      }
    }

    styles += `${CHILDREN_END_MARK}`;

    return styles;
  }
}

class MediaQueryExp extends Token {
  name = MEDIA_QUERY_MARK;
  children: Children = [];

  override generate(className: string) {
    let styles = `${this.value}${CHILDREN_START_MARK}${CLASS_NAME_MARK}${className}${CHILDREN_START_MARK}`;
    let nesting = '';

    for (const token of this.children) {
      const se = token as unknown as StyleExp;
      const nse = token as unknown as NestingExp;

      if (detectIsStyleExp(token)) {
        styles += se.generate();
      } else if (detectIsNestingExp(token)) {
        nesting += nse.generate(className);
      }
    }

    styles += `${CHILDREN_END_MARK}${nesting}${CHILDREN_END_MARK}`;

    return styles;
  }
}

class StyleSheet {
  children: Children = [];

  generate(className: string) {
    let styles = `${CLASS_NAME_MARK}${className}${CHILDREN_START_MARK}`;
    let nesting = '';
    let media = '';

    for (const token of this.children) {
      const se = token as unknown as StyleExp;
      const nse = token as unknown as NestingExp;
      const mqe = token as unknown as MediaQueryExp;

      if (detectIsStyleExp(token)) {
        styles += se.generate();
      } else if (detectIsNestingExp(token)) {
        nesting += nse.generate(className);
      } else if (detectIsMediaQueryExp(token)) {
        media += mqe.generate(className);
      }
    }

    styles += `${CHILDREN_END_MARK}${nesting}${media}`;

    return styles;
  }
}

export type Parent = StyleSheet | NestingExp | MediaQueryExp;

export type Children = Array<StyleExp | NestingExp | MediaQueryExp>;

const detectIsStyleSheet = (x: unknown): x is StyleSheet => x instanceof StyleSheet;

const detectIsStyleExp = (x: unknown): x is StyleExp => x instanceof StyleExp;

const detectIsMediaQueryExp = (x: unknown): x is MediaQueryExp => x instanceof MediaQueryExp;

const detectIsNestingExp = (x: unknown): x is NestingExp => x instanceof NestingExp;

export {
  StyleSheet,
  StyleExp,
  MediaQueryExp,
  NestingExp,
  detectIsStyleSheet,
  detectIsStyleExp,
  detectIsMediaQueryExp,
  detectIsNestingExp,
};
