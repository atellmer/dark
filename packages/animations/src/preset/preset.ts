import { type SpringConfig } from '../shared';

type Preset = Pick<SpringConfig, 'tension' | 'friction'>;
type PresetName = 'no-wobble' | 'gentle' | 'wobbly' | 'stiff' | 'slow' | 'molasses';

const presets: Record<PresetName, Preset> = {
  'no-wobble': { tension: 170, friction: 26 },
  gentle: { tension: 120, friction: 14 },
  wobbly: { tension: 180, friction: 12 },
  stiff: { tension: 210, friction: 20 },
  slow: { tension: 280, friction: 60 },
  molasses: { tension: 280, friction: 120 },
};

function preset(name: PresetName): Preset {
  return presets[name] || ({} as Preset);
}

export { preset };
