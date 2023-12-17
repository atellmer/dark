import {
  CHILDREN_START_MARK,
  CHILDREN_END_MARK,
  PROP_VALUE_START_MARK,
  PROP_VALUE_END_MARK,
  MEDIA_QUERY_MARK,
  CONTAINER_QUERY_MARK,
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

  abstract generate(): string | Tuple;
  abstract generate(className: string | null, props: object, args: Array<Function>): string | Tuple;
}

class StyleExp extends Token {
  override generate(): string {
    return `${this.name}${PROP_VALUE_START_MARK}${this.value}${PROP_VALUE_END_MARK}`;
  }
}

class NestingExp<P extends object = {}> extends Token {
  name = NESTING_MARK;
  children: Children = [];

  override generate(...args: Array<unknown>): string {
    const className = args[0] as string | null;
    const props = args[1] as P;
    const fns = args[2] as Array<Function>;
    let styles = `${this.value.replaceAll(SELF_MARK, `${CLASS_NAME_MARK}${className}`)}${CHILDREN_START_MARK}`;

    for (const token of this.children) {
      const [$styles] = generate({ token, className, props, fns });

      styles += $styles;
    }

    styles += `${CHILDREN_END_MARK}`;

    return styles;
  }
}

class MediaQueryExp<P extends object = {}> extends Token {
  name = MEDIA_QUERY_MARK;
  children: Children = [];

  override generate(...args: Array<unknown>): string {
    const className = args[0] as string | null;
    const props = args[1] as P;
    const fns = args[2] as Array<Function>;
    let styles = className
      ? `${this.value}${CHILDREN_START_MARK}${CLASS_NAME_MARK}${className}${CHILDREN_START_MARK}`
      : `${this.value}${CHILDREN_START_MARK}`;
    let nesting = '';

    for (const token of this.children) {
      const [$styles, $nesting] = generate({ token, className, props, fns });

      styles += $styles;
      nesting += $nesting;
    }

    if (className) {
      styles += `${CHILDREN_END_MARK}${nesting}${CHILDREN_END_MARK}`;
    } else {
      styles += `${nesting}${CHILDREN_END_MARK}`;
    }

    return styles;
  }
}

class ContainerQueryExp<P extends object = {}> extends Token {
  name = CONTAINER_QUERY_MARK;
  children: Children = [];

  override generate(...args: Array<unknown>): string {
    const className = args[0] as string | null;
    const props = args[1] as P;
    const fns = args[2] as Array<Function>;
    let styles = className
      ? `${this.value}${CHILDREN_START_MARK}${CLASS_NAME_MARK}${className}${CHILDREN_START_MARK}`
      : `${this.value}${CHILDREN_START_MARK}`;
    let nesting = '';

    for (const token of this.children) {
      const [$styles, $nesting] = generate({ token, className, props, fns });

      styles += $styles;
      nesting += $nesting;
    }

    if (className) {
      styles += `${CHILDREN_END_MARK}${nesting}${CHILDREN_END_MARK}`;
    } else {
      styles += `${nesting}${CHILDREN_END_MARK}`;
    }

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

  generate(...args: Array<unknown>): Tuple {
    const className = args[0] as string | null;
    const props = args[1] as P;
    const fns = args[2] as Array<Function>;
    const value = fns[this.value](props);
    const styleExp = this.style;
    let styles = '';
    let nesting = '';
    let media = '';
    let container = '';

    if (detectIsStyleSheet(value)) {
      for (const token of value.children) {
        const [$styles, $nesting, $media, $container] = generate({ token, className, props, fns });

        styles += $styles;
        nesting += $nesting;
        media += $media;
        container += $container;
      }
    } else if (styleExp) {
      styleExp.value = this.name.replace(FUNCTION_MARK, value);

      styles += styleExp.generate();
    }

    return [styles, nesting, media, container];
  }
}

class StyleSheet<P extends object = {}> {
  children: Children = [];

  generate(className: string | null, props?: P, fns?: Array<Function>) {
    let styles = className ? `${CLASS_NAME_MARK}${className}${CHILDREN_START_MARK}` : '';
    let nesting = '';
    let media = '';
    let container = '';

    for (const token of this.children) {
      const [$styles, $nesting, $media, $container] = generate({ token, className, props, fns });

      styles += $styles;
      nesting += $nesting;
      media += $media;
      container += $container;
    }

    if (className) {
      styles += `${CHILDREN_END_MARK}${nesting}${media}${container}`;
    } else {
      styles += `${nesting}${media}${container}`;
    }

    return styles;
  }
}

type GenerateProps<P extends object> = {
  token: Token;
  className: string | null;
  props?: P;
  fns?: Array<Function>;
};

function generate<P extends object = {}>(options: GenerateProps<P>): Tuple {
  const { token, className, props, fns } = options;
  let styles = '';
  let nesting = '';
  let media = '';
  let container = '';
  const se = token as unknown as StyleExp;
  const nse = token as unknown as NestingExp;
  const mqe = token as unknown as MediaQueryExp;
  const cqe = token as unknown as ContainerQueryExp;
  const fne = token as unknown as FunctionExp;

  if (detectIsStyleExp(token)) {
    styles += se.generate();
  } else if (detectIsNestingExp(token)) {
    nesting += nse.generate(className, props, fns);
  } else if (detectIsMediaQueryExp(token)) {
    media += mqe.generate(className, props, fns);
  } else if (detectIsContainerQueryExp(token)) {
    container += cqe.generate(className, props, fns);
  } else if (detectIsFunctionExp(token)) {
    const [$styles, $nesting, $media, $container] = fne.generate(className, props, fns);

    styles += $styles;
    nesting += $nesting;
    media += $media;
    container += $container;
  }

  return [styles, nesting, media, container];
}

type Tuple = [string, string, string, string];

export type Parent = StyleSheet | Token;

export type Children = Array<Token>;

const detectIsToken = (x: unknown): x is Token => x instanceof Token;

const detectIsStyleExp = (x: unknown): x is StyleExp => x instanceof StyleExp;

const detectIsMediaQueryExp = (x: unknown): x is MediaQueryExp => x instanceof MediaQueryExp;

const detectIsContainerQueryExp = (x: unknown): x is ContainerQueryExp => x instanceof ContainerQueryExp;

const detectIsNestingExp = (x: unknown): x is NestingExp => x instanceof NestingExp;

const detectIsFunctionExp = (x: unknown): x is FunctionExp => x instanceof FunctionExp;

const detectIsStyleSheet = (x: unknown): x is StyleSheet => x instanceof StyleSheet;

export {
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
};
