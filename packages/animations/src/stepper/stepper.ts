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
    config: { tension, friction, mass, precision },
  } = options;
  const displacement = position - destination;
  const springForce = -tension * displacement;
  const dampingForce = -friction * velocity;
  const acceleration = (springForce + dampingForce) / mass;
  const newVelocity = velocity + acceleration * step;
  const newPosition = position + newVelocity * step;

  if (Math.abs(displacement) < 10 ** -precision) {
    return [destination, 0];
  }

  return [newPosition, newVelocity];
}

export { stepper };
