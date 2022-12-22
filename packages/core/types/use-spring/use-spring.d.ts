type UseSpringOptions = {
  state?: boolean;
  getAnimations: (options: AnimationOptions) => Array<Animation>;
  mount?: boolean;
  deps?: Array<any>;
  outside?: (values: Array<number>) => void;
};
declare function useSpring(
  options: UseSpringOptions,
  deps?: Array<any>,
): {
  values: number[];
  api: {
    play: (name: string, direction: Direction, sourceIdx?: number) => Promise<boolean>;
    toggle: {
      filter: typeof filterToggle;
      map: typeof mapToggle;
    };
  };
};
type AnimationOptions = {
  state: boolean;
  playingIdx: number;
};
export type Animation = {
  name: string;
  direction?: Direction;
  mass?: number;
  stiffness?: number;
  damping?: number;
  duration?: number;
  delay?: number;
  from?: number;
  to?: number;
};
type Direction = 'forward' | 'backward' | 'mirrored';
declare function filterToggle(value: number, idx: number): boolean;
declare function mapToggle(value: number, size: number, idx: number): number;
export { useSpring };
