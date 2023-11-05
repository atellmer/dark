import { type PhysicConfig } from '../shared';

const MAX_DISTANCE = 10 ** -2;

function stepper(pos: number, vel: number, dest: number, step: number, config: PhysicConfig) {
  const { tension, friction, mass } = config;
  const [nPos, nVel] = spring(pos, vel, dest, step, tension, friction, mass);

  if (Math.abs(nPos - dest) < MAX_DISTANCE) return [dest, 0];

  return [nPos, nVel];
}

function spring(pos: number, vel: number, dest: number, step: number, tension: number, friction: number, mass: number) {
  const disp = pos - dest;
  const sf = -1 * tension * disp;
  const df = -1 * friction * vel;
  const a = (sf + df) / mass;
  const nVel = vel + a * step;
  const nPos = pos + nVel * step;

  return [nPos, nVel];
}

export { stepper };
