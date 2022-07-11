import { createComponent, View, useMemo, useEffect, useState } from '@dark-engine/core';
import { render } from '@dark-engine/platform-browser';

const div = props => View({ ...props, as: 'div' });
let staticClassNameId = 0;
let dynamicClassNameId = 0;

function injectStyle(className, css) {
  const styleElement = document.createElement('style');

  styleElement.textContent = `.${className}{${css}}`;
  document.head.appendChild(styleElement);

  return () => document.head.removeChild(styleElement);
}

function createStyledComponent<P>(tag) {
  return (literals: TemplateStringsArray, ...args) => {
    const staticArgs = args.filter(x => typeof x !== 'function');
    const dynamicArgs = args.filter(x => typeof x === 'function');
    const css = literals
      .map((x, idx) => x + (staticArgs[idx] || ''))
      .join('')
      .trim();
    const staticClassName = `dx-${++staticClassNameId}`;
    const dynamicClassNamesMap = {};

    injectStyle(staticClassName, css);

    const StyledComponent = createComponent<P>(props => {
      const { slot } = props;
      const css = dynamicArgs.map(fn => fn(props) || '').join('');
      const dynamicClassName = useMemo(() => {
        return css ? dynamicClassNamesMap[css] || `dxx-${++dynamicClassNameId}` : '';
      }, [css]);
      const className = `${staticClassName} ${dynamicClassName} ${props['class'] || ''}`.trim();

      dynamicClassNamesMap[css] = dynamicClassName;

      useEffect(() => {
        if (!css) return;
        const dispose = injectStyle(dynamicClassName, css);

        return () => dispose();
      }, [dynamicClassName]);

      return [
        tag({
          slot,
          class: className,
        }),
      ];
    });

    return StyledComponent;
  };
}

function styled<P>(component?) {
  return createStyledComponent<P>(component);
}

styled.div = function anonymous<P>(literals: TemplateStringsArray, ...args) {
  return createStyledComponent<P>(div)(literals, ...args);
};

type DivStyledProps = {
  variant: 'red' | 'yellow' | 'green';
};

const DivStyled = styled.div<DivStyledProps>`
  width: 100px;
  height: 100px;
  font-size: 60px;
  transition: background-color 0.2s ease-in-out;

  ${(p: DivStyledProps) =>
    p.variant === 'red' &&
    `
    background-color: red;
  `}

  ${(p: DivStyledProps) =>
    p.variant === 'yellow' &&
    `
    background-color: yellow;
  `}

  ${(p: DivStyledProps) =>
    p.variant === 'green' &&
    `
    background-color: green;
  `}
`;

const App = createComponent(() => {
  const [count, setCount] = useState(0);
  const colors = ['red', 'yellow', 'green'];
  const colorOne = colors[(count + 1) % 3] as DivStyledProps['variant'];
  const colorTwo = colors[(count + 2) % 3] as DivStyledProps['variant'];
  const colorThree = colors[(count + 3) % 3] as DivStyledProps['variant'];

  useEffect(() => {
    const timerId = setTimeout(() => {
      setCount(count + 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [count]);

  return [DivStyled({ variant: colorOne }), DivStyled({ variant: colorTwo }), DivStyled({ variant: colorThree })];
});

render(App(), document.getElementById('root'));
