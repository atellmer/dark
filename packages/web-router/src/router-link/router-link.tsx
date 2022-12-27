import { h, createComponent, type DarkElement } from '@dark-engine/core';
import { type SyntheticEvent } from '@dark-engine/platform-browser';
import { useHistory } from '../use-history';

type RoutreLinkProps = {
  to: string;
  active?: string;
  slot: DarkElement;
};

const RouterLink = createComponent<RoutreLinkProps>(
  ({ to, active, slot }) => {
    const history = useHistory();
    const isActive = false;

    const handleClick = (e: SyntheticEvent<MouseEvent, HTMLLinkElement>) => {
      e.preventDefault();
      history.push(to);
    };

    return (
      <a href={to} class={isActive ? active : undefined} onClick={handleClick}>
        {slot}
      </a>
    );
  },
  {
    defaultProps: {
      active: 'router-active-link',
    },
  },
);

export { RouterLink };
