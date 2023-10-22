import { type Config } from '../shared';

type Preset = Pick<Config, 'tension' | 'friction'>;

type PresetName = 'noWobble' | 'gentle' | 'wobbly' | 'stiff';

const presets: Record<PresetName, Preset> = {
  noWobble: { tension: 170, friction: 26 },
  gentle: { tension: 120, friction: 14 },
  wobbly: { tension: 180, friction: 12 },
  stiff: { tension: 210, friction: 20 },
};

export { presets };
