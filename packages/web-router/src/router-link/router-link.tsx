import { h, createComponent, useMemo, useEvent, detectIsFunction, type DarkElement } from '@dark-engine/core';
import { type SyntheticEvent } from '@dark-engine/platform-browser';
import { useHistory } from '../use-history';
import { useMatch } from '../use-match';
import { normalaizeEnd, cm } from '../utils';

export type RoutreLinkProps = {
  to: string;
  activeClassName?: string;
  className?: string;
  title?: string;
  slot: DarkElement;
  onClick?: (e: SyntheticEvent<MouseEvent, HTMLLinkElement>) => void;
};

const RouterLink = createComponent<RoutreLinkProps>(
  ({ to, activeClassName, className: sourceClassName, slot, onClick, ...rest }) => {
    const history = useHistory();
    const { url } = useMatch();
    const isActive = useMemo(() => url.indexOf(normalaizeEnd(to)) !== -1, [url]);
    const className = useMemo(
      () => cm(sourceClassName, isActive ? activeClassName : ''),
      [sourceClassName, activeClassName, isActive],
    );

    const handleClick = useEvent((e: SyntheticEvent<MouseEvent, HTMLLinkElement>) => {
      e.preventDefault();
      history.push(to);
      detectIsFunction(onClick) && onClick(e);
    });

    return (
      <a {...rest} href={to} class={className} onClick={handleClick}>
        {slot}
      </a>
    );
  },
  {
    defaultProps: {
      activeClassName: 'router-active-link',
    },
  },
);

export { RouterLink };
