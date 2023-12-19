import { type DarkElement, type Component, createContext, useContext, component } from '@dark-engine/core';

import { STYLE_TAG, STYLED_GLOBAL_ATTR, STYLED_COMPONENTS_ATTR, FUNCTION_MARK } from '../constants';

enum STYLE_LEVEL {
  GLOBAL,
  COMPONENT,
}

class Manager {
  private styles = createStyles();

  collectGlobalStyle(css: string) {
    this.styles[STYLE_LEVEL.GLOBAL].add(css);
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

class ServerStyleSheet {
  manager = new Manager();

  collectStyles(app: Component) {
    return ManagerProvider({ manager: this.manager, slot: app });
  }

  getStyleTags() {
    const styles = this.manager.getStyles();
    const tags: Array<string> = [];
    const tag1 = `<${STYLE_TAG} ${STYLED_GLOBAL_ATTR}="true">${FUNCTION_MARK}</${STYLE_TAG}>`;
    const tag2 = `<${STYLE_TAG} ${STYLED_COMPONENTS_ATTR}="true">${FUNCTION_MARK}</${STYLE_TAG}>`;
    let css1 = '';
    let css2 = '';

    for (const $css of styles[STYLE_LEVEL.GLOBAL]) {
      css1 += $css;
    }

    for (const $css of styles[STYLE_LEVEL.COMPONENT]) {
      css2 += $css;
    }

    css1 && tags.push(tag1.replace(FUNCTION_MARK, css1));
    css2 && tags.push(tag2.replace(FUNCTION_MARK, css2));

    return tags;
  }

  seal() {
    this.manager.seal();
  }
}

export { useManager, ServerStyleSheet };
