import { type DarkElement, type Component, createContext, useContext, component } from '@dark-engine/core';

import { STYLE_TAG, STYLED_GLOBAL_ATTR, STYLED_COMPONENTS_ATTR, FUNCTION_MARK } from '../constants';

enum STYLE_LEVEL {
  GLOBAL,
  COMPONENT,
}

class Manager {
  private styles = createStyles();

  collectGlobalStyle(id: string, css: string) {
    this.styles[STYLE_LEVEL.GLOBAL].set(id, css);
  }

  collectComponentStyle(css: string) {
    this.styles[STYLE_LEVEL.COMPONENT].add(css);
  }

  getStyles() {
    return this.styles;
  }

  seal() {
    this.styles = createStyles();
  }
}

const createStyles = () => ({
  [STYLE_LEVEL.GLOBAL]: new Map<string, string>(),
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

class ServerStyleSheet {
  manager = new Manager();

  collectStyles(app: Component) {
    return ManagerProvider({ manager: this.manager, slot: app });
  }

  getStyleTags() {
    const styles = this.manager.getStyles();
    const tags: Array<string> = [];
    const tag = `<${STYLE_TAG} ${STYLED_COMPONENTS_ATTR}="true">${FUNCTION_MARK}</${STYLE_TAG}>`;
    let css = '';

    for (const [id, css] of styles[STYLE_LEVEL.GLOBAL]) {
      const tag = `<${STYLE_TAG} ${STYLED_GLOBAL_ATTR}="${id}">${css}</${STYLE_TAG}>`;

      tags.push(tag);
    }

    for (const $css of styles[STYLE_LEVEL.COMPONENT]) {
      css += $css;
    }

    css && tags.push(tag.replace(FUNCTION_MARK, css));

    return tags;
  }

  seal() {
    this.manager.seal();
  }
}

export { useManager, ServerStyleSheet };
