import { type DarkElement, h, component, forwardRef, useMemo, useEvent, detectIsFunction } from '@dark-engine/core';
import { type SyntheticEvent, type DarkJSX } from '@dark-engine/platform-browser';

import { SLASH_MARK, ACTIVE_LINK_CLASSNAME } from '../constants';
import { normalaizePathname, cm, parseURL } from '../utils';
import { useLocation } from '../use-location';
import { useHistory } from '../use-history';

export type RoutreLinkProps = {
  to: string;
  slot: DarkElement;
  activeClassName?: string;
} & Omit<DarkJSX.Elements['a'], 'href'>;

const RouterLink = forwardRef<RoutreLinkProps, HTMLAnchorElement>(
  component(
    (props, ref) => {
      const { to, activeClassName = ACTIVE_LINK_CLASSNAME, class: cl1, className: cl2, slot, onClick, ...rest } = props;
      const history = useHistory();
      const { pathname, hash } = useLocation();
      const isActive = useMemo(() => detectIsActiveLink(pathname, hash, to), [pathname, hash, to]);
      const $className = cl1 || cl2;
      const className = useMemo(
        () => cm($className, isActive ? activeClassName : ''),
        [$className, activeClassName, isActive],
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
