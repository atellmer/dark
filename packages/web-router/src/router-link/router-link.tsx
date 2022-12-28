import { h, createComponent, useMemo, useEvent, detectIsFunction, type DarkElement } from '@dark-engine/core';
import { type SyntheticEvent } from '@dark-engine/platform-browser';
import { SLASH } from '../constants';
import { useHistory } from '../use-history';
import { useLocation } from '../use-location';
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
    const { pathname } = useLocation();
    const isActive = useMemo(() => detectIsActiveLink(pathname, to), [pathname]);
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

function detectIsActiveLink(pathname: string, to: string): boolean {
  const pathname$ = normalaizeEnd(pathname);
  const to$ = normalaizeEnd(to);

  return pathname$.indexOf(to$) !== -1;
}

export { RouterLink };
