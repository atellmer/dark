import {
  StyleSheet,
  StyleRule,
  MediaQueryRule,
  ContainerQueryRule,
  KeyframesRule,
  NestingRule,
  FunctionRule,
} from '../tokens';
import { FUNCTION_MARK } from '../constants';
import { parse } from './parse';

describe('[@styled/parse]', () => {
  test('throws errors with illegal nesting #1', () => {
    const make = () => {
      parse(`
        color: green;

        & span {
          color: purple;

          & span {
            color: red;
          }
        }
    `);
    };

    expect(make).toThrowError();
  });

  test('throws errors with illegal nesting #2', () => {
    const make = () => {
      parse(`
        color: green;

        & span {
          color: purple;

          @media(max-width: 600px) {
            color: red;
          }
        }
    `);
    };

    expect(make).toThrowError();
  });

  test('throws errors with illegal nesting #3', () => {
    const make = () => {
      parse(`
        color: green;

        & span {
          color: purple;

          @container(max-width: 600px) {
            color: red;
          }
        }
    `);
    };

    expect(make).toThrowError();
  });

  test('throws errors with illegal nesting #4', () => {
    const make = () => {
      parse(`
        color: green;

        @media(max-width: 600px) {
          color: purple;

          @media(max-width: 400px) {
            color: red;
          }
        }
    `);
    };

    expect(make).toThrowError();
  });

  test('throws errors with illegal nesting #5', () => {
    const make = () => {
      parse(`
        color: green;

        @container(max-width: 600px) {
          color: purple;

          @container(max-width: 400px) {
            color: red;
          }
        }
    `);
    };

    expect(make).toThrowError();
  });

  test('throws errors with illegal nesting #6', () => {
    const make = () => {
      parse(`
        color: green;

        @media(max-width: 600px) {
          color: purple;

          @keyframes slidein {
            from {
              color: red;
            }

            to {
              color: yellow;
            }
          }
        }
    `);
    };

    expect(make).toThrowError();
  });

  test('does not throw errors with legal nesting #1', () => {
    const make = () => {
      parse(`
        color: green;

        & span {
          color: purple;
        }

        @media(max-width: 600px) {
          color: purple;
        }
    `);
    };

    expect(make).not.toThrowError();
  });

  test('does not throw errors with legal nesting #2', () => {
    const make = () => {
      parse(`
        color: green;

        & span {
          color: purple;
        }

        @container(max-width: 600px) {
          color: purple;
        }
    `);
    };

    expect(make).not.toThrowError();
  });

  test('does not throw errors with legal nesting #3', () => {
    const make = () => {
      parse(`
        color: green;

        @media(max-width: 600px) {
          color: purple;

          & span {
            color: red;
          }
        }
    `);
    };

    expect(make).not.toThrowError();
  });

  test('does not throw errors with legal nesting #4', () => {
    const make = () => {
      parse(`
        color: green;

        @container(max-width: 600px) {
          color: purple;

          & span {
            color: red;
          }
        }
    `);
    };

    expect(make).not.toThrowError();
  });

  test('parses a simple valid css correctly', () => {
    const style = parse(`
      color: red;
      background-color: blue;
    `);

    expect(style).toBeInstanceOf(StyleSheet);
    expect(style.children.length).toBe(2);

    const color = style.children[0] as StyleRule;
    const backgroundColor = style.children[1] as StyleRule;

    expect(color).toBeInstanceOf(StyleRule);
    expect(color.name).toBe('color');
    expect(color.value).toBe('red');
    expect(backgroundColor).toBeInstanceOf(StyleRule);
    expect(backgroundColor.name).toBe('background-color');
    expect(backgroundColor.value).toBe('blue');
  });

  test('parses a valid css with a media query correctly', () => {
    const style = parse(`
      @media (max-width: 600px) {
        color: red;
        background-color: blue;
      }
    `);

    expect(style).toBeInstanceOf(StyleSheet);
    expect(style.children.length).toBe(1);

    const mqr = style.children[0] as MediaQueryRule;

    expect(mqr).toBeInstanceOf(MediaQueryRule);
    expect(mqr.value).toBe('@media (max-width: 600px)');

    const color = mqr.children[0] as StyleRule;
    const backgroundColor = mqr.children[1] as StyleRule;

    expect(mqr.children.length).toBe(2);
    expect(color).toBeInstanceOf(StyleRule);
    expect(color.name).toBe('color');
    expect(color.value).toBe('red');
    expect(backgroundColor).toBeInstanceOf(StyleRule);
    expect(backgroundColor.name).toBe('background-color');
    expect(backgroundColor.value).toBe('blue');
  });

  test('parses a valid css with a pseudo class correctly', () => {
    const style = parse(`
      &:hover {
        color: red;
        background-color: blue;
      }
    `);

    expect(style).toBeInstanceOf(StyleSheet);
    expect(style.children.length).toBe(1);

    const nsr = style.children[0] as NestingRule;

    expect(nsr).toBeInstanceOf(NestingRule);
    expect(nsr.value).toBe('&:hover');

    const color = nsr.children[0] as StyleRule;
    const backgroundColor = nsr.children[1] as StyleRule;

    expect(nsr.children.length).toBe(2);
    expect(color).toBeInstanceOf(StyleRule);
    expect(color.name).toBe('color');
    expect(color.value).toBe('red');
    expect(backgroundColor).toBeInstanceOf(StyleRule);
    expect(backgroundColor.name).toBe('background-color');
    expect(backgroundColor.value).toBe('blue');
  });

  test('parses a valid css with a media query and pseudo class correctly', () => {
    const style = parse(`
      @media (max-width: 600px) {
        &:hover {
          color: red;
          background-color: blue;
        }
      }
    `);

    expect(style).toBeInstanceOf(StyleSheet);
    expect(style.children.length).toBe(1);

    const mqr = style.children[0] as MediaQueryRule;

    expect(mqr).toBeInstanceOf(MediaQueryRule);
    expect(mqr.value).toBe('@media (max-width: 600px)');

    const nsr = mqr.children[0] as NestingRule;

    expect(nsr.children.length).toBe(2);
    expect(nsr.value).toBe('&:hover');

    const color = nsr.children[0] as StyleRule;
    const backgroundColor = nsr.children[1] as StyleRule;

    expect(color).toBeInstanceOf(StyleRule);
    expect(color.name).toBe('color');
    expect(color.value).toBe('red');
    expect(backgroundColor).toBeInstanceOf(StyleRule);
    expect(backgroundColor.name).toBe('background-color');
    expect(backgroundColor.value).toBe('blue');
  });

  test('parses a valid css with a container at-rule correctly', () => {
    const style = parse(`
      container-type: inline-size;
      container-name: sidebar;

      @container sidebar (min-width: 600px) {
        & span {
          font-size: 2em;
        }
      }
    `);

    expect(style).toBeInstanceOf(StyleSheet);
    expect(style.children.length).toBe(3);

    const containerType = style.children[0] as StyleRule;
    const containerName = style.children[1] as StyleRule;

    expect(containerType).toBeInstanceOf(StyleRule);
    expect(containerType.name).toBe('container-type');
    expect(containerType.value).toBe('inline-size');
    expect(containerName).toBeInstanceOf(StyleRule);
    expect(containerName.name).toBe('container-name');
    expect(containerName.value).toBe('sidebar');

    const cqr = style.children[2] as ContainerQueryRule;

    expect(cqr).toBeInstanceOf(ContainerQueryRule);
    expect(cqr.value).toBe('@container sidebar (min-width: 600px)');

    const nsr = cqr.children[0] as NestingRule;

    expect(nsr.children.length).toBe(1);
    expect(nsr.value).toBe('& span');

    const fontSize = nsr.children[0] as StyleRule;

    expect(fontSize).toBeInstanceOf(StyleRule);
    expect(fontSize.name).toBe('font-size');
    expect(fontSize.value).toBe('2em');
  });

  test('parses complex style properties correctly', () => {
    const style = parse(`
      border: 1px solid black;
      padding: 10px 20px;
      font-size: 16px;
    `);

    expect(style).toBeInstanceOf(StyleSheet);
    expect(style.children.length).toBe(3);

    const border = style.children[0] as StyleRule;
    const padding = style.children[1] as StyleRule;
    const fontSize = style.children[2] as StyleRule;

    expect(border).toBeInstanceOf(StyleRule);
    expect(border.name).toBe('border');
    expect(border.value).toBe('1px solid black');
    expect(padding).toBeInstanceOf(StyleRule);
    expect(padding.name).toBe('padding');
    expect(padding.value).toBe('10px 20px');
    expect(fontSize).toBeInstanceOf(StyleRule);
    expect(fontSize.name).toBe('font-size');
    expect(fontSize.value).toBe('16px');
  });

  test('parses style properties with quotes correctly', () => {
    const style = parse(`
      content: "Hello, world";
      font-family: "Arial", sans-serif;
    `);

    expect(style).toBeInstanceOf(StyleSheet);
    expect(style.children.length).toBe(2);

    const content = style.children[0] as StyleRule;
    const fontFamily = style.children[1] as StyleRule;

    expect(content).toBeInstanceOf(StyleRule);
    expect(content.name).toBe('content');
    expect(content.value).toBe('"Hello, world"');
    expect(fontFamily).toBeInstanceOf(StyleRule);
    expect(fontFamily.name).toBe('font-family');
    expect(fontFamily.value).toBe('"Arial", sans-serif');
  });

  test('parses style properties with spaces correctly', () => {
    const style = parse(`
         color   : red ;
      background-color :     
           blue ;
    `);

    expect(style).toBeInstanceOf(StyleSheet);
    expect(style.children.length).toBe(2);

    const color = style.children[0] as StyleRule;
    const backgroundColor = style.children[1] as StyleRule;

    expect(color).toBeInstanceOf(StyleRule);
    expect(color.name).toBe('color');
    expect(color.value).toBe('red');
    expect(backgroundColor).toBeInstanceOf(StyleRule);
    expect(backgroundColor.name).toBe('background-color');
    expect(backgroundColor.value).toBe('blue');
  });

  test('parses an invalid css correctly', () => {
    const style = parse(`
      color
      background-color
    `);

    expect(style).toBeInstanceOf(StyleSheet);
    expect(style.children.length).toBe(0);
  });

  test('parses an empty css correctly', () => {
    const style = parse(``);

    expect(style).toBeInstanceOf(StyleSheet);
    expect(style.children.length).toBe(0);
  });

  test('parses a complex css correctly', () => {
    const style = parse(`
      @media(min-width: 400px) {
        top: 10px;
        left: 20px;

        &:hover {
          color: yellow;
          display: block;
        }

        flex: 1;
      }

      width: 100%;
      height: 100%;
      background-image: url('https://www.cats.com/cat.jpg'); // some comment
      font-size: 16px;

      @media(min-width: 700px) {
        top: 100px;
        left: 100px;

        &:hover {
          color: red;
        }

        & div .active {
          color: blue;
          display: flex;
        }
      }

      transition: none;
      transform: translate(10%, 20%, 0) scale(45deg);
    `);

    expect(style).toBeInstanceOf(StyleSheet);
    expect(style.children.length).toBe(8);

    {
      const mqr = style.children[0] as MediaQueryRule;

      expect(mqr).toBeInstanceOf(MediaQueryRule);
      expect(mqr.value).toBe('@media(min-width: 400px)');
      expect(mqr.children.length).toBe(4);

      const top = mqr.children[0] as StyleRule;
      const left = mqr.children[1] as StyleRule;

      expect(top).toBeInstanceOf(StyleRule);
      expect(top.name).toBe('top');
      expect(top.value).toBe('10px');
      expect(left).toBeInstanceOf(StyleRule);
      expect(left.name).toBe('left');
      expect(left.value).toBe('20px');

      {
        const nsr = mqr.children[2] as NestingRule;

        expect(nsr).toBeInstanceOf(NestingRule);
        expect(nsr.value).toBe('&:hover');

        const color = nsr.children[0] as StyleRule;
        const display = nsr.children[1] as StyleRule;

        expect(color).toBeInstanceOf(StyleRule);
        expect(color.name).toBe('color');
        expect(color.value).toBe('yellow');
        expect(display).toBeInstanceOf(StyleRule);
        expect(display.name).toBe('display');
        expect(display.value).toBe('block');
      }

      const flex = mqr.children[3] as StyleRule;

      expect(flex).toBeInstanceOf(StyleRule);
      expect(flex.name).toBe('flex');
      expect(flex.value).toBe('1');
    }

    {
      const width = style.children[1] as StyleRule;
      const height = style.children[2] as StyleRule;
      const backgroundImage = style.children[3] as StyleRule;
      const fontSize = style.children[4] as StyleRule;

      expect(width).toBeInstanceOf(StyleRule);
      expect(width.name).toBe('width');
      expect(width.value).toBe('100%');
      expect(height).toBeInstanceOf(StyleRule);
      expect(height.name).toBe('height');
      expect(height.value).toBe('100%');
      expect(backgroundImage).toBeInstanceOf(StyleRule);
      expect(backgroundImage.name).toBe('background-image');
      expect(backgroundImage.value).toBe("url('https://www.cats.com/cat.jpg')");
      expect(fontSize).toBeInstanceOf(StyleRule);
      expect(fontSize.name).toBe('font-size');
      expect(fontSize.value).toBe('16px');
    }

    {
      const mqr = style.children[5] as MediaQueryRule;

      expect(mqr).toBeInstanceOf(MediaQueryRule);
      expect(mqr.value).toBe('@media(min-width: 700px)');
      expect(mqr.children.length).toBe(4);

      const top = mqr.children[0] as StyleRule;
      const left = mqr.children[1] as StyleRule;

      expect(top).toBeInstanceOf(StyleRule);
      expect(top.name).toBe('top');
      expect(top.value).toBe('100px');
      expect(left).toBeInstanceOf(StyleRule);
      expect(left.name).toBe('left');
      expect(left.value).toBe('100px');

      {
        const nsr = mqr.children[2] as NestingRule;

        expect(nsr).toBeInstanceOf(NestingRule);
        expect(nsr.value).toBe('&:hover');

        const color = nsr.children[0] as StyleRule;

        expect(color).toBeInstanceOf(StyleRule);
        expect(color.name).toBe('color');
        expect(color.value).toBe('red');
      }

      {
        const nsr = mqr.children[3] as NestingRule;

        expect(nsr).toBeInstanceOf(NestingRule);
        expect(nsr.value).toBe('& div .active');

        const color = nsr.children[0] as StyleRule;
        const display = nsr.children[1] as StyleRule;

        expect(color).toBeInstanceOf(StyleRule);
        expect(color.name).toBe('color');
        expect(color.value).toBe('blue');
        expect(display).toBeInstanceOf(StyleRule);
        expect(display.name).toBe('display');
        expect(display.value).toBe('flex');
      }
    }

    {
      const transition = style.children[6] as StyleRule;
      const transform = style.children[7] as StyleRule;

      expect(transition).toBeInstanceOf(StyleRule);
      expect(transition.name).toBe('transition');
      expect(transition.value).toBe('none');
      expect(transform).toBeInstanceOf(StyleRule);
      expect(transform.name).toBe('transform');
      expect(transform.value).toBe('translate(10%, 20%, 0) scale(45deg)');
    }
  });

  test('parses a css with a complex selector correctly', () => {
    const style = parse(`
      & * div.red > .item [selected="true"] #x:hover {
        color: red;
        background-color: blue;
      }
    `);

    expect(style).toBeInstanceOf(StyleSheet);
    expect(style.children.length).toBe(1);

    const nsr = style.children[0] as NestingRule;

    expect(nsr.children.length).toBe(2);
    expect(nsr.value).toBe('& * div.red > .item [selected="true"] #x:hover');

    const color = nsr.children[0] as StyleRule;
    const backgroundColor = nsr.children[1] as StyleRule;

    expect(color).toBeInstanceOf(StyleRule);
    expect(color.name).toBe('color');
    expect(color.value).toBe('red');
    expect(backgroundColor).toBeInstanceOf(StyleRule);
    expect(backgroundColor.name).toBe('background-color');
    expect(backgroundColor.value).toBe('blue');
  });

  test('parses a css with variables correctly', () => {
    const style = parse(`
      :root {
        --color: red;
      }
      
      color: var(--color);
    `);

    expect(style).toBeInstanceOf(StyleSheet);
    expect(style.children.length).toBe(2);

    {
      const nsr = style.children[0] as NestingRule;

      expect(nsr.children.length).toBe(1);
      expect(nsr.value).toBe(':root');

      const colorVar = nsr.children[0] as StyleRule;

      expect(colorVar).toBeInstanceOf(StyleRule);
      expect(colorVar.name).toBe('--color');
      expect(colorVar.value).toBe('red');
    }

    const color = style.children[1] as StyleRule;

    expect(color).toBeInstanceOf(StyleRule);
    expect(color.name).toBe('color');
    expect(color.value).toBe('var(--color)');
  });

  test('parses a valid css with keyframes correctly', () => {
    const style = parse(`
      animation-name: slidein;
      animation-duration: 3s;

      @keyframes slidein {
        from {
          transform: translateX(0%);
        }
    
        to {
          transform: translateX(100%);
        }
      }
    `);

    expect(style).toBeInstanceOf(StyleSheet);
    expect(style.children.length).toBe(3);

    const animationName = style.children[0] as StyleRule;
    const animationDuration = style.children[1] as StyleRule;

    expect(animationName).toBeInstanceOf(StyleRule);
    expect(animationName.name).toBe('animation-name');
    expect(animationName.value).toBe('slidein');
    expect(animationDuration).toBeInstanceOf(StyleRule);
    expect(animationDuration.name).toBe('animation-duration');
    expect(animationDuration.value).toBe('3s');

    const kr = style.children[2] as KeyframesRule;

    expect(kr).toBeInstanceOf(KeyframesRule);
    expect(kr.value).toBe('@keyframes slidein');

    const from = kr.children[0] as NestingRule;
    const to = kr.children[1] as NestingRule;

    expect(from.children.length).toBe(1);
    expect(from.value).toBe('from');
    expect(to.children.length).toBe(1);
    expect(to.value).toBe('to');

    const transformFrom = from.children[0] as StyleRule;
    const transformTo = to.children[0] as StyleRule;

    expect(transformFrom).toBeInstanceOf(StyleRule);
    expect(transformFrom.name).toBe('transform');
    expect(transformFrom.value).toBe('translateX(0%)');
    expect(transformTo).toBeInstanceOf(StyleRule);
    expect(transformTo.name).toBe('transform');
    expect(transformTo.value).toBe('translateX(100%)');
  });

  test('parses a valid css with a single line comment correctly', () => {
    const style = parse(`
      font-size: 2rem; // this is a single line comment
      color: #fff;
    `);

    expect(style).toBeInstanceOf(StyleSheet);
    expect(style.children.length).toBe(2);

    const fontSize = style.children[0] as StyleRule;
    const color = style.children[1] as StyleRule;

    expect(fontSize).toBeInstanceOf(StyleRule);
    expect(fontSize.name).toBe('font-size');
    expect(fontSize.value).toBe('2rem');
    expect(color).toBeInstanceOf(StyleRule);
    expect(color.name).toBe('color');
    expect(color.value).toBe('#fff');
  });

  test('parses a valid css with a milti line comment correctly', () => {
    const style = parse(`
      /* this is a multi
      line comment */
      font-size: 2rem;
      color: #fff;
    `);

    expect(style).toBeInstanceOf(StyleSheet);
    expect(style.children.length).toBe(2);

    const fontSize = style.children[0] as StyleRule;
    const color = style.children[1] as StyleRule;

    expect(fontSize).toBeInstanceOf(StyleRule);
    expect(fontSize.name).toBe('font-size');
    expect(fontSize.value).toBe('2rem');
    expect(color).toBeInstanceOf(StyleRule);
    expect(color.name).toBe('color');
    expect(color.value).toBe('#fff');
  });

  test('parses a valid css with a lot of comments correctly', () => {
    const style = parse(`
      /* this is a multi
      line comment */
      font-size: 2rem; // this is a single line comment
      // this is an another single line comment
      color: /*comment*/ #fff /*comment*/;
      /*
        this is an another multi
        line
        comment
      */
      background-color: blue;
    `);

    expect(style).toBeInstanceOf(StyleSheet);
    expect(style.children.length).toBe(3);

    const fontSize = style.children[0] as StyleRule;
    const color = style.children[1] as StyleRule;
    const backgroundColor = style.children[2] as StyleRule;

    expect(fontSize).toBeInstanceOf(StyleRule);
    expect(fontSize.name).toBe('font-size');
    expect(fontSize.value).toBe('2rem');
    expect(color).toBeInstanceOf(StyleRule);
    expect(color.name).toBe('color');
    expect(color.value).toBe('#fff');
    expect(backgroundColor).toBeInstanceOf(StyleRule);
    expect(backgroundColor.name).toBe('background-color');
    expect(backgroundColor.value).toBe('blue');
  });

  test('parses a css with function marks correctly', () => {
    const style = parse(`
      ${FUNCTION_MARK}
      border: ${FUNCTION_MARK} ${FUNCTION_MARK} red;
      color: black;
    `);

    expect(style).toBeInstanceOf(StyleSheet);
    expect(style.children.length).toBe(3);

    const fnr1 = style.children[0] as FunctionRule;
    const fnr2 = style.children[1] as FunctionRule;
    const color = style.children[2] as StyleRule;

    expect(fnr1).toBeInstanceOf(FunctionRule);
    expect(fnr1.args).toEqual([0]);
    expect(fnr1.getIsSealed()).toBe(false);
    expect(fnr1.style).toBe(null);
    expect(fnr1.getEnd()).toBe('');
    expect(fnr2).toBeInstanceOf(FunctionRule);
    expect(fnr2.args).toEqual([1, 2]);
    expect(fnr2.getIsSealed()).toBe(true);
    expect(fnr2.getEnd()).toBe(' red');
    expect(fnr2.style).toBeInstanceOf(StyleRule);
    expect(fnr2.style.name).toBe('border');
    expect(fnr2.style.value).toBe('');
    expect(color).toBeInstanceOf(StyleRule);
    expect(color.name).toBe('color');
    expect(color.value).toBe('black');
  });
});
