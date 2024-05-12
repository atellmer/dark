import { component } from '@dark-engine/core';
import { type DarkJSX } from '@dark-engine/platform-browser';
import { usePending } from '@dark-engine/web-router';
import { styled } from '@dark-engine/styled';

const Pending = component(() => {
  const isPending = usePending();

  return (
    <>
      <span>{isPending ? 'PENDING...' : ''}</span>
      <Overlay isPending={isPending} />
    </>
  );
});

const Overlay = styled.div<{ isPending: boolean } & DarkJSX.Elements['div']>`
  opacity: ${p => (p.isPending ? 0.5 : 0)};
  will-change: opacity;
  transition: opacity 0.3s ease-in-out;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-color: #fff;
`;

export { Pending };
