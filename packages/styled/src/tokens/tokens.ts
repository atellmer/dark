import {
  CHILDREN_START_MARK,
  CHILDREN_END_MARK,
  PROP_VALUE_START_MARK,
  PROP_VALUE_END_MARK,
  MEDIA_QUERY_MARK,
  NESTING_MARK,
  SELF_MARK,
  CLASS_NAME_MARK,
  FUNCTION_MARK,
} from '../constants';

abstract class Token {
  name = '';
  value = '';
  parent: Parent;
  isDynamic = false;

  normalize() {
    this.name = this.name.trim();
    this.value = this.value.trim();
  }

  markAsDynamic() {
    this.isDynamic = true;
    detectIsToken(this.parent) && !this.parent.isDynamic && this.parent.markAsDynamic();
  }

  abstract generate(): string;
  abstract generate(className: string): string;
  abstract generate(props: object, args: Array<Function>): string;
}

class StyleExp extends Token {
  override generate() {
    return `${this.name}${PROP_VALUE_START_MARK}${this.value}${PROP_VALUE_END_MARK}`;
  }
}

class NestingExp<P extends object = {}> extends Token {
  name = NESTING_MARK;
  children: Children = [];

  override generate(...args: Array<unknown>) {
    const className = args[0] as string;
    const props = args[1] as P;
    const fns = args[2] as Array<Function>;
    let styles = `${this.value.replace(SELF_MARK, `${CLASS_NAME_MARK}${className}`)}${CHILDREN_START_MARK}`;

    for (const token of this.children) {
      const se = token as unknown as StyleExp;
      const mqe = token as unknown as MediaQueryExp;
      const fne = token as unknown as FunctionExp;

      if (detectIsStyleExp(token)) {
        styles += se.generate();
      } else if (detectIsMediaQueryExp(token)) {
        styles += mqe.generate(className, props, fns);
      } else if (detectIsFunctionExp(token)) {
        styles += fne.generate(props, fns);
      }
    }

    styles += `${CHILDREN_END_MARK}`;

    return styles;
  }
}

class MediaQueryExp<P extends object = {}> extends Token {
  name = MEDIA_QUERY_MARK;
  children: Children = [];

  override generate(...args: Array<unknown>) {
    const className = args[0] as string;
    const props = args[1] as P;
    const fns = args[2] as Array<Function>;
    let styles = `${this.value}${CHILDREN_START_MARK}${CLASS_NAME_MARK}${className}${CHILDREN_START_MARK}`;
    let nesting = '';

    for (const token of this.children) {
      const se = token as unknown as StyleExp;
      const nse = token as unknown as NestingExp;
      const fne = token as unknown as FunctionExp;

      if (detectIsStyleExp(token)) {
        styles += se.generate();
      } else if (detectIsNestingExp(token)) {
        nesting += nse.generate(className, props, fns);
      } else if (detectIsFunctionExp(token)) {
        styles += fne.generate(props, fns);
      }
    }

    styles += `${CHILDREN_END_MARK}${nesting}${CHILDREN_END_MARK}`;

    return styles;
  }
}

class FunctionExp<P extends object = {}> extends Token {
  name = FUNCTION_MARK;
  style: StyleExp = null;

  constructor(value: number) {
    super();
    this.value = String(value);
  }

  generate(...args: Array<unknown>): string {
    const props = args[0] as P;
    const fns = args[1] as Array<Function>;
    const value = fns[this.value](props);
    const style = this.style;

    if (style) {
      style.value = value;

      return style.generate();
    }

    return value;
  }
}

class StyleSheet<P extends object = {}> {
  children: Children = [];

  generate(className: string, props?: P, fns?: Array<Function>) {
    let styles = `${CLASS_NAME_MARK}${className}${CHILDREN_START_MARK}`;
    let nesting = '';
    let media = '';

    for (const token of this.children) {
      const se = token as unknown as StyleExp;
      const nse = token as unknown as NestingExp;
      const mqe = token as unknown as MediaQueryExp;
      const fne = token as unknown as FunctionExp;

      if (detectIsStyleExp(token)) {
        styles += se.generate();
      } else if (detectIsNestingExp(token)) {
        nesting += nse.generate(className, props, fns);
      } else if (detectIsMediaQueryExp(token)) {
        media += mqe.generate(className, props, fns);
      } else if (detectIsFunctionExp(token)) {
        styles += fne.generate(props, fns);
      }
    }

    styles += `${CHILDREN_END_MARK}${nesting}${media}`;

    return styles;
  }
}

export type Parent = StyleSheet | NestingExp | MediaQueryExp;

export type Children = Array<StyleExp | NestingExp | MediaQueryExp | FunctionExp>;

const detectIsToken = (x: unknown): x is Token => x instanceof Token;

const detectIsStyleExp = (x: unknown): x is StyleExp => x instanceof StyleExp;

const detectIsMediaQueryExp = (x: unknown): x is MediaQueryExp => x instanceof MediaQueryExp;

const detectIsNestingExp = (x: unknown): x is NestingExp => x instanceof NestingExp;

const detectIsFunctionExp = (x: unknown): x is FunctionExp => x instanceof FunctionExp;

const detectIsStyleSheet = (x: unknown): x is StyleSheet => x instanceof StyleSheet;

export {
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
};
