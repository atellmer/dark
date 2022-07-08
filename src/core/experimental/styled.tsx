import { createComponent } from '../component';
import { View } from '../view';
import { useMemo } from '../use-memo';
import { useEffect } from '../use-effect';

// just for fun)))
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
    const staticClassName = `ss-${++staticClassNameId}`;
    const dynamicClassNamesMap = {};

    injectStyle(staticClassName, css);

    const StyledComponent = createComponent<P>(props => {
      const { slot } = props;
      const css = dynamicArgs.map(fn => fn(props) || '').join('');
      const dynamicClassName = useMemo(() => {
        return css ? dynamicClassNamesMap[css] || `sd-${++dynamicClassNameId}` : '';
      }, [css]);
      const className = `${staticClassName} ${dynamicClassName} ${props['class'] || ''}`.trim();
      const fromMap = dynamicClassNamesMap[css] === dynamicClassName;

      dynamicClassNamesMap[css] = dynamicClassName;

      useEffect(() => {
        if (!css || fromMap) return;
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
  appearance: 'red' | 'yellow' | 'pink';
};

const DivStyled = styled.div<DivStyledProps>`
  font-size: 60px;

  ${(p: DivStyledProps) =>
    p.appearance === 'red' &&
    `
    color: red;
  `}

  ${(p: DivStyledProps) =>
    p.appearance === 'yellow' &&
    `
    color: yellow;
  `}

  ${(p: DivStyledProps) =>
    p.appearance === 'pink' &&
    `
    color: pink;
  `}
`;
