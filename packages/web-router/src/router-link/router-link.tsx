import { h, createComponent, useMemo, useEvent, type DarkElement } from '@dark-engine/core';
import { type SyntheticEvent } from '@dark-engine/platform-browser';
import { useHistory } from '../use-history';
import { useMatch } from '../use-match';
import { normalaizeEnd } from '../utils';

export type RoutreLinkProps = {
  to: string;
  activeClassName?: string;
  className?: string;
  title?: string;
  slot: DarkElement;
};

const RouterLink = createComponent<RoutreLinkProps>(
  ({ to, activeClassName, className: _className, slot, ...rest }) => {
    const history = useHistory();
    const { path } = useMatch();
    const isActive = useMemo(() => path.indexOf(normalaizeEnd(to)) !== -1, [path]);
    const className = useMemo(
      () => [_className, isActive ? activeClassName : ''].filter(Boolean).join(' ') || undefined,
      [_className, activeClassName, isActive],
    );

    const handleClick = useEvent((e: SyntheticEvent<MouseEvent, HTMLLinkElement>) => {
      e.preventDefault();
      history.push(to);
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
