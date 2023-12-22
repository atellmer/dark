/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  h,
  component,
  Fragment,
  View,
  useMemo,
  useEffect,
  useInsertionEffect,
  useState,
  type DarkElement,
  type Ref,
  type Component,
  type ComponentFactory,
  type TagVirtualNodeFactory,
} from '@dark-engine/core';
import { createRoot, SyntheticEvent } from '@dark-engine/platform-browser';

let staticClassNameId = 0;
let dynamicClassNameId = 0;

function injectStyle(className: string, css: string) {
  const styleElement = document.createElement('style');

  styleElement.textContent = `.${className}{${css}}`;
  document.head.appendChild(styleElement);

  return () => document.head.removeChild(styleElement);
}

function createStyledComponent<P extends object>(tag: ComponentFactory | ((props: P) => TagVirtualNodeFactory)) {
  return (literals: TemplateStringsArray, ...args: Array<(p: P) => string | false>) => {
    const staticArgs = args.filter(x => typeof x !== 'function');
    const dynamicArgs = args.filter(x => typeof x === 'function');
    const css = literals
      .map((x, idx) => x + (staticArgs[idx] || ''))
      .join('')
      .trim();
    const staticClassName = `dx-${++staticClassNameId}`;
    const dynamicClassNamesMap: Record<string, string> = {};

    injectStyle(staticClassName, css);

    const StyledComponent = component<P>(props => {
      const css = dynamicArgs.map(fn => fn(props) || '').join('');
      const dynamicClassName = useMemo(() => {
        return css ? dynamicClassNamesMap[css] || `dxx-${++dynamicClassNameId}` : '';
      }, [css]);
      const className = `${staticClassName} ${dynamicClassName}`.trim();

      dynamicClassNamesMap[css] = dynamicClassName;

      useInsertionEffect(() => {
        if (!css) return;
        const dispose = injectStyle(dynamicClassName, css);

        return () => dispose();
      }, [css, dynamicClassName]);

      return [
        tag({
          ...props,
          class: `${className} ${(props as any).class || ''}`.trim(),
        }),
      ];
    });

    type UnionProps = P & { slot?: DarkElement; ref?: Ref<HTMLElement> };

    return StyledComponent as unknown as (props?: UnionProps, ref?: Ref<any>) => Component<P, Ref<any>>;
  };
}

function styled<P extends object>(component: ComponentFactory<P>) {
  return createStyledComponent<P>(component);
}

const div = (props: any) => View({ ...props, as: 'div' });
styled.div = function anonymous<P extends object>(
  literals: TemplateStringsArray,
  ...args: Array<(p: P) => string | false>
) {
  return createStyledComponent<P>(div)(literals, ...args);
};

const input = (props: any) => View({ ...props, void: true, as: 'input' });
styled.input = function anonymous<P extends object>(
  literals: TemplateStringsArray,
  ...args: Array<(p: P) => string | false>
) {
  return createStyledComponent<P>(input)(literals, ...args);
};

// using
const Layout = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

type ColorVariant = 'red' | 'yellow' | 'green';

type ColoredContainerProps = {
  variant: ColorVariant;
};

const ColoredContainer = styled.div<ColoredContainerProps>`
  width: 100px;
  height: 100px;
  font-size: 2rem;
  padding: 6px;
  color: #fff;
  transition: all 0.2s ease-in-out;
  ${p =>
    p.variant === 'red' &&
    `
    background-color: #ef5350;
  `}
  ${p =>
    p.variant === 'yellow' &&
    `
    background-color: #ffeb3b;
    color: #000;
  `}
  ${p =>
    p.variant === 'green' &&
    `
    background-color: #8bc34a;
  `}
`;

type InputProps = {
  value: string;
  onInput: (e: SyntheticEvent<InputEvent, HTMLInputElement>) => void;
};

const Input = styled.input<InputProps>`
  width: 100%;
  border: 2px solid #6f74dd;
`;

const App = component(() => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('Hello');
  const colors = ['red', 'yellow', 'green'] as Array<ColorVariant>;
  const colorOne = colors[(count + 1) % 3];
  const colorTwo = colors[(count + 2) % 3];
  const colorThree = colors[(count + 3) % 3];

  const handleInput = (e: SyntheticEvent<InputEvent, HTMLInputElement>) => setText(e.target.value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setCount(count + 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [count]);

  return (
    <>
      <Layout>
        <ColoredContainer variant={colorOne}>a</ColoredContainer>
        <ColoredContainer variant={colorTwo}>b</ColoredContainer>
        <ColoredContainer variant={colorThree}>c</ColoredContainer>
      </Layout>
      {text}
      <br />
      <Input value={text} onInput={handleInput} />
    </>
  );
});

createRoot(document.getElementById('root')!).render(<App />);
