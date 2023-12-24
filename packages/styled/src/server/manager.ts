import { type DarkElement, type Callback, createContext, useContext, component } from '@dark-engine/core';

export enum STYLE_LEVEL {
  GLOBAL,
  COMPONENT,
}

class Manager {
  private styles = createStyles();
  private resets = new Set<Callback>();

  collectGlobalStyle(css: string) {
    this.styles[STYLE_LEVEL.GLOBAL].add(css);
  }

  collectComponentStyle(css: string) {
    this.styles[STYLE_LEVEL.COMPONENT].add(css);
  }

  getStyles() {
    return this.styles;
  }

  reset(fn: Callback) {
    this.resets.add(fn);
  }

  seal() {
    this.styles = createStyles();
    this.resets.forEach(x => x());
    this.resets = new Set();
  }
}

const createStyles = () => ({
  [STYLE_LEVEL.GLOBAL]: new Set<string>(),
  [STYLE_LEVEL.COMPONENT]: new Set<string>(),
});

const ManagerContext = createContext<Manager>(null, { displayName: 'Manager' });

function useManager() {
  return useContext(ManagerContext);
}

type ThemeProviderProps = {
  manager: Manager;
  slot: DarkElement;
};

const ManagerProvider = component<ThemeProviderProps>(({ manager, slot }) => {
  return ManagerContext.Provider({ value: manager, slot });
});

export { Manager, useManager, ManagerProvider };
