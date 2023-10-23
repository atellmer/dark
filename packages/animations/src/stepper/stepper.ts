import { type Config } from '../shared';

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
  const displacement = newPosition - destination;

  if (Math.abs(displacement) < 10 ** -2) {
    return [destination, 0];
  }

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
  const springForce = -tension * displacement;
  const dampingForce = -friction * velocity;
  const acceleration = (springForce + dampingForce) / mass;
  const newVelocity = velocity + acceleration * step;
  const newPosition = position + newVelocity * step;

  return [newPosition, newVelocity];
}

export { stepper };
