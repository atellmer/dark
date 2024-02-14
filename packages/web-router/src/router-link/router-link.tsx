import { h, component, forwardRef, useMemo, useEvent, detectIsFunction, type DarkElement } from '@dark-engine/core';
import { type SyntheticEvent, type DarkJSX } from '@dark-engine/platform-browser';

import { useHistory } from '../use-history';
import { useLocation } from '../use-location';
import { normalaizePathname, cm, parseURL } from '../utils';
import { SLASH_MARK } from '../constants';

export type RoutreLinkProps = {
  to: string;
  activeClassName?: string;
  slot: DarkElement;
} & DarkJSX.HTMLTags['a'];

const RouterLink = forwardRef<RoutreLinkProps, HTMLAnchorElement>(
  component(
    (props, ref) => {
      const { to, activeClassName = 'router-link-active', class: cl1, className: cl2, slot, onClick, ...rest } = props;
      const history = useHistory();
      const { pathname, hash } = useLocation();
      const isActive = useMemo(() => detectIsActiveLink(pathname, hash, to), [pathname, hash, to]);
      const className = useMemo(
        () => cm(cl1, cl2, isActive ? activeClassName : ''),
        [cl1, cl2, activeClassName, isActive],
      );

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
      displayName: 'RouterLink',
    },
  ),
);

function detectIsActiveLink(pathname: string, hash: string, to: string): boolean {
  const { pathname: $to, hash: $hash } = parseURL(to);
  const $pathname = normalaizePathname(pathname);

  if ($to === SLASH_MARK) return $pathname === SLASH_MARK;

  return $pathname.indexOf($to) !== -1 && hash === $hash;
}

export { RouterLink };
