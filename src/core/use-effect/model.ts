export type EffectCleanup = void | (() => void);
export type Effect = () => EffectCleanup;
