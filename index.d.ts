declare namespace Spider {
	interface SpiderComponentDef<P,S> {
		name: string;
		getInitialState?: () => S;
		getDefaultProps?: () => P;
		createChildComponents?: () => void;
		willMount?: () => void;
		didMount?: () => void;
		willReceiveProps?: (nextProps: P) => void;
		willUpdate?: (nextProps: P, nextState: S) => void;
		didUpdate?: (nextProps: P, nextState: S) => void;
		willUnmount?: () => void;
		render: () => string | null;
	}
	
	interface SpiderComponent<P,S> extends SpiderComponentDef<P,S> {
		getState: () => S;
		getProps: () => P;
		setState: (newState: Partial<S>, cb?: (newState: S) => any) => void;
		forceUpdate: () => void;
		wire: (props: Partial<P>, parentCtx: SpiderComponent<any,any>) => string | null;
	}
	function createComponent<P,S,T>(cmpDef: SpiderComponentDef<P,S> & T): SpiderComponent<P,S> & T;
	function render(selector: string, cmp: SpiderComponent<any,any>): void;
}

export = Spider;
export as namespace Spider;
