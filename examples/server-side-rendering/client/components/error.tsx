import { h, component } from '@dark-engine/core';

const Error = component<{ value: string }>(({ value }) => <div>{value} 🫠</div>);

export { Error };
