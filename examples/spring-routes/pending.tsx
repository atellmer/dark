import { component, memo } from '@dark-engine/core';
import { type DarkJSX } from '@dark-engine/platform-browser';
import { usePending } from '@dark-engine/web-router';
import { styled } from '@dark-engine/styled';

type PendingProps = {
  overlay?: boolean;
};

const Pending = memo(
  component<PendingProps>(
    ({ overlay }) => {
      const isPending = usePending();

      return (
        <span>
          {isPending ? 'PENDING...' : 'XXX'}
          {overlay && <Root $isPending={isPending} />}
        </span>
      );
    },
    { displayName: 'Pending' },
  ),
  () => false,
);

const Root = styled.div<{ $isPending: boolean } & DarkJSX.Elements['div']>`
  position: fixed;
  inset: 0;
  background-color: #fff;
  opacity: ${p => (p.$isPending ? 0.5 : 0)};
  transition: opacity 0.3s ease-in-out;
  pointer-events: none;
`;

export { Pending };
