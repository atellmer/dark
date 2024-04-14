import { component, forwardRef, useMemo } from '@dark-engine/core';

import { SLASH_MARK, ACTIVE_LINK_CLASSNAME } from '../constants';
import { type LinkProps, Link } from '../link';
import { useLocation } from '../use-location';
import { cm, parseURL } from '../utils';

export type NavLinkProps = LinkProps;

const NavLink = forwardRef<NavLinkProps, HTMLAnchorElement>(
  component(
    (props, ref) => {
      const { to, class: cn1, className: cn2, slot, ...rest } = props;
      const { pathname: url, hash } = useLocation();
      const className = useMemo(() => {
        const isMatch = detectIsMatch(url, to, hash);

        return cm(cn1 || cn2, isMatch ? ACTIVE_LINK_CLASSNAME : '');
      }, [cn1, cn2, url, hash, to]);

      return (
        <Link ref={ref} {...rest} to={to} class={className}>
          {slot}
        </Link>
      );
    },
    {
      displayName: 'NavLink',
    },
  ),
);

function detectIsMatch(url: string, to: string, hash: string) {
  const { pathname: $to, hash: $hash } = parseURL(to);
  const isMatch = ($to === url && hash === $hash) || (hash === $hash && $to !== SLASH_MARK && url.indexOf($to) === 0);

  return isMatch;
}

export { NavLink };
