import { type Config } from '../shared';

const MAX_DISTANCE = 10 ** -2;

type StepperOptions = {
  position: number;
  velocity: number;
  destination: number;
  step: number;
  config: Partial<Config>;
};

function stepper(options: StepperOptions) {
  const {
    destination,
    step,
    position,
    velocity,
    config: { tension, friction, mass },
  } = options;
  const [newPosition, newVelocity] = spring(destination, step, position, velocity, tension, friction, mass);

  if (Math.abs(newPosition - destination) < MAX_DISTANCE) return [destination, 0];

  return [newPosition, newVelocity];
}

function spring(
  destination: number,
  step: number,
  position: number,
  velocity: number,
  tension: number,
  friction: number,
  mass: number,
) {
  const displacement = position - destination;
  const springForce = -1 * tension * displacement;
  const dampingForce = -1 * friction * velocity;
  const acceleration = (springForce + dampingForce) / mass;
  const newVelocity = velocity + acceleration * step;
  const newPosition = position + newVelocity * step;

  return [newPosition, newVelocity];
}

export { stepper };
