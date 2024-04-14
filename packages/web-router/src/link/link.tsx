import { type DarkElement, component, forwardRef, useEvent, detectIsFunction } from '@dark-engine/core';
import { type SyntheticEvent, type DarkJSX } from '@dark-engine/platform-browser';

import { useHistory } from '../use-history';

export type LinkProps = {
  to: string;
  slot: DarkElement;
} & Omit<DarkJSX.Elements['a'], 'href'>;

const Link = forwardRef<LinkProps, HTMLAnchorElement>(
  component(
    (props, ref) => {
      const { to, class: cn1, className: cn2, slot, onClick, ...rest } = props;
      const history = useHistory();
      const className = cn1 || cn2;
      const handleClick = useEvent((e: SyntheticEvent<MouseEvent, HTMLAnchorElement>) => {
        e.preventDefault();
        history.push(to);
        detectIsFunction(onClick) && onClick(e);
      });

      return (
        <a ref={ref} {...rest} href={to} class={className} onClick={handleClick}>
          {slot}
        </a>
      );
    },
    {
      displayName: 'Link',
    },
  ),
);

export { Link };
