import { h, component, useMemo, useEvent, detectIsFunction, type DarkElement } from '@dark-engine/core';
import { type SyntheticEvent } from '@dark-engine/platform-browser';

import { useHistory } from '../use-history';
import { useLocation } from '../use-location';
import { normalaizePathname, cm, parseURL } from '../utils';
import { SLASH_MARK } from '../constants';

export type RoutreLinkProps = {
  to: string;
  activeClassName?: string;
  className?: string;
  title?: string;
  slot: DarkElement;
  onClick?: (e: SyntheticEvent<MouseEvent, HTMLLinkElement>) => void;
};

const RouterLink = component<RoutreLinkProps>(
  ({ to, activeClassName = 'router-link-active', className: sourceClassName, slot, onClick, ...rest }) => {
    const history = useHistory();
    const { pathname, hash } = useLocation();
    const isActive = useMemo(() => detectIsActiveLink(pathname, hash, to), [pathname, hash, to]);
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
    displayName: 'RouterLink',
  },
);

function detectIsActiveLink(pathname: string, hash: string, to: string): boolean {
  const { pathname: $to, hash: $hash } = parseURL(to);
  const $pathname = normalaizePathname(pathname);

  if ($to === SLASH_MARK) return $pathname === SLASH_MARK;

  return $pathname.indexOf($to) !== -1 && hash === $hash;
}

export { RouterLink };
