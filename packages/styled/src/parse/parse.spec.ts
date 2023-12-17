import { StyleSheet, StyleExp, MediaQueryExp, ContainerQueryExp, NestingExp } from '../tokens';
import { parse } from './parse';

describe('[@styled/parse]', () => {
  test('parses css correctly #1', () => {
    const style = parse(`
      color: red;
      background-color: blue;
    `);

    expect(style).toBeInstanceOf(StyleSheet);
    expect(style.children.length).toBe(2);

    const color = style.children[0] as StyleExp;
    const backgroundColor = style.children[1] as StyleExp;

    expect(color).toBeInstanceOf(StyleExp);
    expect(color.name).toBe('color');
    expect(color.value).toBe('red');
    expect(backgroundColor).toBeInstanceOf(StyleExp);
    expect(backgroundColor.name).toBe('background-color');
    expect(backgroundColor.value).toBe('blue');
  });

  test('parses css correctly #2', () => {
    const style = parse(`
      @media (max-width: 600px) {
        color: red;
        background-color: blue;
      }
    `);

    expect(style).toBeInstanceOf(StyleSheet);
    expect(style.children.length).toBe(1);

    const mqe = style.children[0] as MediaQueryExp;

    expect(mqe).toBeInstanceOf(MediaQueryExp);
    expect(mqe.value).toBe('@media (max-width: 600px)');

    const color = mqe.children[0] as StyleExp;
    const backgroundColor = mqe.children[1] as StyleExp;

    expect(mqe.children.length).toBe(2);
    expect(color).toBeInstanceOf(StyleExp);
    expect(color.name).toBe('color');
    expect(color.value).toBe('red');
    expect(backgroundColor).toBeInstanceOf(StyleExp);
    expect(backgroundColor.name).toBe('background-color');
    expect(backgroundColor.value).toBe('blue');
  });

  test('parses css correctly #3', () => {
    const style = parse(`
      &:hover {
        color: red;
        background-color: blue;
      }
    `);

    expect(style).toBeInstanceOf(StyleSheet);
    expect(style.children.length).toBe(1);

    const nse = style.children[0] as NestingExp;

    expect(nse).toBeInstanceOf(NestingExp);
    expect(nse.value).toBe('&:hover');

    const color = nse.children[0] as StyleExp;
    const backgroundColor = nse.children[1] as StyleExp;

    expect(nse.children.length).toBe(2);
    expect(color).toBeInstanceOf(StyleExp);
    expect(color.name).toBe('color');
    expect(color.value).toBe('red');
    expect(backgroundColor).toBeInstanceOf(StyleExp);
    expect(backgroundColor.name).toBe('background-color');
    expect(backgroundColor.value).toBe('blue');
  });

  test('parses css correctly #4', () => {
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

    const mqe = style.children[0] as MediaQueryExp;

    expect(mqe).toBeInstanceOf(MediaQueryExp);
    expect(mqe.value).toBe('@media (max-width: 600px)');

    const nse = mqe.children[0] as NestingExp;

    expect(nse.children.length).toBe(2);
    expect(nse.value).toBe('&:hover');

    const color = nse.children[0] as StyleExp;
    const backgroundColor = nse.children[1] as StyleExp;

    expect(color).toBeInstanceOf(StyleExp);
    expect(color.name).toBe('color');
    expect(color.value).toBe('red');
    expect(backgroundColor).toBeInstanceOf(StyleExp);
    expect(backgroundColor.name).toBe('background-color');
    expect(backgroundColor.value).toBe('blue');
  });

  test('parses css correctly #5', () => {
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

    const containerType = style.children[0] as StyleExp;
    const containerName = style.children[1] as StyleExp;

    expect(containerType).toBeInstanceOf(StyleExp);
    expect(containerType.name).toBe('container-type');
    expect(containerType.value).toBe('inline-size');
    expect(containerName).toBeInstanceOf(StyleExp);
    expect(containerName.name).toBe('container-name');
    expect(containerName.value).toBe('sidebar');

    const cqe = style.children[2] as ContainerQueryExp;

    expect(cqe).toBeInstanceOf(ContainerQueryExp);
    expect(cqe.value).toBe('@container sidebar (min-width: 600px)');

    const nse = cqe.children[0] as NestingExp;

    expect(nse.children.length).toBe(1);
    expect(nse.value).toBe('& span');

    const fontSize = nse.children[0] as StyleExp;

    expect(fontSize).toBeInstanceOf(StyleExp);
    expect(fontSize.name).toBe('font-size');
    expect(fontSize.value).toBe('2em');
  });

  test('parses css correctly #6', () => {
    const style = parse(`
      border: 1px solid black;
      padding: 10px 20px;
      font-size: 16px;
    `);

    expect(style).toBeInstanceOf(StyleSheet);
    expect(style.children.length).toBe(3);

    const border = style.children[0] as StyleExp;
    const padding = style.children[1] as StyleExp;
    const fontSize = style.children[2] as StyleExp;

    expect(border).toBeInstanceOf(StyleExp);
    expect(border.name).toBe('border');
    expect(border.value).toBe('1px solid black');
    expect(padding).toBeInstanceOf(StyleExp);
    expect(padding.name).toBe('padding');
    expect(padding.value).toBe('10px 20px');
    expect(fontSize).toBeInstanceOf(StyleExp);
    expect(fontSize.name).toBe('font-size');
    expect(fontSize.value).toBe('16px');
  });

  test('parses css correctly #7', () => {
    const style = parse(`
      content: "Hello, world";
      font-family: "Arial", sans-serif;
    `);

    expect(style).toBeInstanceOf(StyleSheet);
    expect(style.children.length).toBe(2);

    const content = style.children[0] as StyleExp;
    const fontFamily = style.children[1] as StyleExp;

    expect(content).toBeInstanceOf(StyleExp);
    expect(content.name).toBe('content');
    expect(content.value).toBe('"Hello, world"');
    expect(fontFamily).toBeInstanceOf(StyleExp);
    expect(fontFamily.name).toBe('font-family');
    expect(fontFamily.value).toBe('"Arial", sans-serif');
  });

  test('parses css correctly #8', () => {
    const style = parse(`
      color : red ;
      background-color : blue ;
    `);

    expect(style).toBeInstanceOf(StyleSheet);
    expect(style.children.length).toBe(2);

    const color = style.children[0] as StyleExp;
    const backgroundColor = style.children[1] as StyleExp;

    expect(color).toBeInstanceOf(StyleExp);
    expect(color.name).toBe('color');
    expect(color.value).toBe('red');
    expect(backgroundColor).toBeInstanceOf(StyleExp);
    expect(backgroundColor.name).toBe('background-color');
    expect(backgroundColor.value).toBe('blue');
  });

  test('parses css correctly #9', () => {
    const style = parse(`
      color
      background-color
    `);

    expect(style).toBeInstanceOf(StyleSheet);
    expect(style.children.length).toBe(0);
  });

  test('parses css correctly #10', () => {
    const style = parse(``);

    expect(style).toBeInstanceOf(StyleSheet);
    expect(style.children.length).toBe(0);
  });

  test('parses css correctly #11', () => {
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
      background-image: url('https://www.cats.com/cat.jpg');
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
      const mqe = style.children[0] as MediaQueryExp;

      expect(mqe).toBeInstanceOf(MediaQueryExp);
      expect(mqe.value).toBe('@media(min-width: 400px)');
      expect(mqe.children.length).toBe(4);

      const top = mqe.children[0] as StyleExp;
      const left = mqe.children[1] as StyleExp;

      expect(top).toBeInstanceOf(StyleExp);
      expect(top.name).toBe('top');
      expect(top.value).toBe('10px');
      expect(left).toBeInstanceOf(StyleExp);
      expect(left.name).toBe('left');
      expect(left.value).toBe('20px');

      {
        const nse = mqe.children[2] as NestingExp;

        expect(nse).toBeInstanceOf(NestingExp);
        expect(nse.value).toBe('&:hover');

        const color = nse.children[0] as StyleExp;
        const display = nse.children[1] as StyleExp;

        expect(color).toBeInstanceOf(StyleExp);
        expect(color.name).toBe('color');
        expect(color.value).toBe('yellow');
        expect(display).toBeInstanceOf(StyleExp);
        expect(display.name).toBe('display');
        expect(display.value).toBe('block');
      }

      const flex = mqe.children[3] as StyleExp;

      expect(flex).toBeInstanceOf(StyleExp);
      expect(flex.name).toBe('flex');
      expect(flex.value).toBe('1');
    }

    {
      const width = style.children[1] as StyleExp;
      const height = style.children[2] as StyleExp;
      const backgroundImage = style.children[3] as StyleExp;
      const fontSize = style.children[4] as StyleExp;

      expect(width).toBeInstanceOf(StyleExp);
      expect(width.name).toBe('width');
      expect(width.value).toBe('100%');
      expect(height).toBeInstanceOf(StyleExp);
      expect(height.name).toBe('height');
      expect(height.value).toBe('100%');
      expect(backgroundImage).toBeInstanceOf(StyleExp);
      expect(backgroundImage.name).toBe('background-image');
      expect(backgroundImage.value).toBe("url('https://www.cats.com/cat.jpg')");
      expect(fontSize).toBeInstanceOf(StyleExp);
      expect(fontSize.name).toBe('font-size');
      expect(fontSize.value).toBe('16px');
    }

    {
      const mqe = style.children[5] as MediaQueryExp;

      expect(mqe).toBeInstanceOf(MediaQueryExp);
      expect(mqe.value).toBe('@media(min-width: 700px)');
      expect(mqe.children.length).toBe(4);

      const top = mqe.children[0] as StyleExp;
      const left = mqe.children[1] as StyleExp;

      expect(top).toBeInstanceOf(StyleExp);
      expect(top.name).toBe('top');
      expect(top.value).toBe('100px');
      expect(left).toBeInstanceOf(StyleExp);
      expect(left.name).toBe('left');
      expect(left.value).toBe('100px');

      {
        const nse = mqe.children[2] as NestingExp;

        expect(nse).toBeInstanceOf(NestingExp);
        expect(nse.value).toBe('&:hover');

        const color = nse.children[0] as StyleExp;

        expect(color).toBeInstanceOf(StyleExp);
        expect(color.name).toBe('color');
        expect(color.value).toBe('red');
      }

      {
        const nse = mqe.children[3] as NestingExp;

        expect(nse).toBeInstanceOf(NestingExp);
        expect(nse.value).toBe('& div .active');

        const color = nse.children[0] as StyleExp;
        const display = nse.children[1] as StyleExp;

        expect(color).toBeInstanceOf(StyleExp);
        expect(color.name).toBe('color');
        expect(color.value).toBe('blue');
        expect(display).toBeInstanceOf(StyleExp);
        expect(display.name).toBe('display');
        expect(display.value).toBe('flex');
      }
    }

    {
      const transition = style.children[6] as StyleExp;
      const transform = style.children[7] as StyleExp;

      expect(transition).toBeInstanceOf(StyleExp);
      expect(transition.name).toBe('transition');
      expect(transition.value).toBe('none');
      expect(transform).toBeInstanceOf(StyleExp);
      expect(transform.name).toBe('transform');
      expect(transform.value).toBe('translate(10%, 20%, 0) scale(45deg)');
    }
  });

  test('parses css correctly #12', () => {
    const style = parse(`
      & * div.red > .item [selected="true"] #x:hover {
        color: red;
        background-color: blue;
      }
    `);

    expect(style).toBeInstanceOf(StyleSheet);
    expect(style.children.length).toBe(1);

    const nse = style.children[0] as NestingExp;

    expect(nse.children.length).toBe(2);
    expect(nse.value).toBe('& * div.red > .item [selected="true"] #x:hover');

    const color = nse.children[0] as StyleExp;
    const backgroundColor = nse.children[1] as StyleExp;

    expect(color).toBeInstanceOf(StyleExp);
    expect(color.name).toBe('color');
    expect(color.value).toBe('red');
    expect(backgroundColor).toBeInstanceOf(StyleExp);
    expect(backgroundColor.name).toBe('background-color');
    expect(backgroundColor.value).toBe('blue');
  });

  test('parses css correctly #13', () => {
    const style = parse(`
      :root {
        --color: red;
      }
      
      color: var(--color);
    `);

    expect(style).toBeInstanceOf(StyleSheet);
    expect(style.children.length).toBe(2);

    {
      const nse = style.children[0] as NestingExp;

      expect(nse.children.length).toBe(1);
      expect(nse.value).toBe(':root');

      const colorVar = nse.children[0] as StyleExp;

      expect(colorVar).toBeInstanceOf(StyleExp);
      expect(colorVar.name).toBe('--color');
      expect(colorVar.value).toBe('red');
    }

    const color = style.children[1] as StyleExp;

    expect(color).toBeInstanceOf(StyleExp);
    expect(color.name).toBe('color');
    expect(color.value).toBe('var(--color)');
  });

  test('parses css correctly #14', () => {
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

  test('parses css correctly #15', () => {
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

  test('parses css correctly #16', () => {
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

  test('parses css correctly #17', () => {
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

  test('parses css correctly #18', () => {
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

  test('parses css correctly #19', () => {
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

  test('parses css correctly #20', () => {
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

  test('parses css correctly #21', () => {
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

  test('parses css correctly #22', () => {
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
});
