(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("DarkCore", [], factory);
	else if(typeof exports === 'object')
		exports["DarkCore"] = factory();
	else
		root["DarkCore"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/batch/batch.ts":
/*!****************************!*\
  !*** ./src/batch/batch.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "batch": () => (/* binding */ batch),
/* harmony export */   "runBatch": () => (/* binding */ runBatch)
/* harmony export */ });
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scope */ "./src/scope/index.ts");
/* harmony import */ var _platform__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../platform */ "./src/platform/index.ts");


function batch(callback) {
    _scope__WEBPACK_IMPORTED_MODULE_0__.isBatchZone.set(true);
    callback();
}
function runBatch(fiber, callback) {
    fiber.batched.push(callback);
    const update = () => {
        const size = fiber.batched.length;
        _platform__WEBPACK_IMPORTED_MODULE_1__.platform.requestAnimationFrame(() => {
            if (size === fiber.batched.length) {
                const fn = fiber.batched[fiber.batched.length - 1];
                _scope__WEBPACK_IMPORTED_MODULE_0__.isBatchZone.set(false);
                fiber.batched = [];
                fn && fn();
            }
            else {
                update();
            }
        });
    };
    update();
}



/***/ }),

/***/ "./src/batch/index.ts":
/*!****************************!*\
  !*** ./src/batch/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "batch": () => (/* reexport safe */ _batch__WEBPACK_IMPORTED_MODULE_0__.batch),
/* harmony export */   "runBatch": () => (/* reexport safe */ _batch__WEBPACK_IMPORTED_MODULE_0__.runBatch)
/* harmony export */ });
/* harmony import */ var _batch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./batch */ "./src/batch/batch.ts");



/***/ }),

/***/ "./src/component/component.ts":
/*!************************************!*\
  !*** ./src/component/component.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ComponentFactory": () => (/* binding */ ComponentFactory),
/* harmony export */   "createComponent": () => (/* binding */ createComponent),
/* harmony export */   "detectIsComponentFactory": () => (/* binding */ detectIsComponentFactory),
/* harmony export */   "getComponentFactoryKey": () => (/* binding */ getComponentFactoryKey)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers */ "./src/helpers/index.ts");


const $$component = Symbol('component');
const defaultOptions = {
    displayName: '',
    defaultProps: {},
    token: $$component,
};
class ComponentFactory {
    type;
    token;
    props;
    ref;
    displayName;
    children = [];
    shouldUpdate;
    constructor(options) {
        this.type = options.type || null;
        this.token = options.token || null;
        this.props = options.props || null;
        this.ref = options.ref || null;
        this.displayName = options.displayName || '';
        this.shouldUpdate = options.shouldUpdate || null;
    }
}
function createComponent(createElement, options = {}) {
    const computedOptions = { ...defaultOptions, ...options };
    const { token, defaultProps, displayName, shouldUpdate } = computedOptions;
    return (props = {}, ref) => {
        const computedProps = { ...defaultProps, ...props };
        const factory = new ComponentFactory({
            token,
            ref,
            displayName,
            shouldUpdate,
            props: computedProps,
            type: createElement,
            children: [],
        });
        if (computedProps.ref) {
            delete computedProps.ref;
            if (true) {
                (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.error)(`[Dark]: To use ref you need to wrap the createComponent with forwardRef!`);
            }
        }
        return factory;
    };
}
const detectIsComponentFactory = (factory) => factory instanceof ComponentFactory;
const getComponentFactoryKey = (factory) => !(0,_helpers__WEBPACK_IMPORTED_MODULE_1__.detectIsEmpty)(factory.props[_constants__WEBPACK_IMPORTED_MODULE_0__.ATTR_KEY]) ? factory.props[_constants__WEBPACK_IMPORTED_MODULE_0__.ATTR_KEY] : null;



/***/ }),

/***/ "./src/component/index.ts":
/*!********************************!*\
  !*** ./src/component/index.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ComponentFactory": () => (/* reexport safe */ _component__WEBPACK_IMPORTED_MODULE_0__.ComponentFactory),
/* harmony export */   "createComponent": () => (/* reexport safe */ _component__WEBPACK_IMPORTED_MODULE_0__.createComponent),
/* harmony export */   "detectIsComponentFactory": () => (/* reexport safe */ _component__WEBPACK_IMPORTED_MODULE_0__.detectIsComponentFactory),
/* harmony export */   "getComponentFactoryKey": () => (/* reexport safe */ _component__WEBPACK_IMPORTED_MODULE_0__.getComponentFactoryKey)
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./src/component/component.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ "./src/component/types.ts");




/***/ }),

/***/ "./src/component/types.ts":
/*!********************************!*\
  !*** ./src/component/types.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "./src/constants.ts":
/*!**************************!*\
  !*** ./src/constants.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ATTR_KEY": () => (/* binding */ ATTR_KEY),
/* harmony export */   "ATTR_REF": () => (/* binding */ ATTR_REF),
/* harmony export */   "EMPTY_NODE": () => (/* binding */ EMPTY_NODE),
/* harmony export */   "PARTIAL_UPDATE": () => (/* binding */ PARTIAL_UPDATE),
/* harmony export */   "ROOT": () => (/* binding */ ROOT),
/* harmony export */   "TaskPriority": () => (/* binding */ TaskPriority)
/* harmony export */ });
const ROOT = 'root';
const EMPTY_NODE = 'dark:matter';
const ATTR_KEY = 'key';
const ATTR_REF = 'ref';
const PARTIAL_UPDATE = 'partial-update';
var TaskPriority;
(function (TaskPriority) {
    TaskPriority[TaskPriority["HIGH"] = 2] = "HIGH";
    TaskPriority[TaskPriority["NORMAL"] = 1] = "NORMAL";
    TaskPriority[TaskPriority["LOW"] = 0] = "LOW";
})(TaskPriority || (TaskPriority = {}));


/***/ }),

/***/ "./src/context/context.ts":
/*!********************************!*\
  !*** ./src/context/context.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createContext": () => (/* binding */ createContext)
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component */ "./src/component/index.ts");
/* harmony import */ var _use_effect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../use-effect */ "./src/use-effect/index.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../scope */ "./src/scope/index.ts");
/* harmony import */ var _use_context__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../use-context */ "./src/use-context/index.ts");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../helpers */ "./src/helpers/index.ts");





function createContext(defaultValue) {
    let displayName = 'Context';
    const context = {
        displayName,
        defaultValue,
        Provider: null,
        Consumer: null,
    };
    mutateContext(context, defaultValue, displayName);
    Object.defineProperty(context, 'displayName', {
        get: () => displayName,
        set: (newValue) => {
            displayName = newValue;
            mutateContext(context, defaultValue, displayName);
        },
    });
    return context;
}
function mutateContext(context, defaultValue, displayName) {
    context.Provider = createProvider(context, defaultValue, displayName);
    context.Consumer = createConsumer(context, displayName);
}
function createProvider(context, defaultValue, displayName) {
    return (0,_component__WEBPACK_IMPORTED_MODULE_0__.createComponent)(({ value = defaultValue, slot }) => {
        const fiber = _scope__WEBPACK_IMPORTED_MODULE_2__.currentFiberStore.get();
        if (!fiber.provider) {
            fiber.provider = new Map();
        }
        if (!fiber.provider.get(context)) {
            fiber.provider.set(context, {
                subscribers: [],
                value,
            });
        }
        const provider = fiber.provider.get(context);
        (0,_use_effect__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
            for (const subscriber of provider.subscribers) {
                subscriber(value);
            }
        }, [value]);
        provider.value = value;
        return slot;
    }, { displayName: `${displayName}.Provider` });
}
function createConsumer(context, displayName) {
    return (0,_component__WEBPACK_IMPORTED_MODULE_0__.createComponent)(({ slot }) => {
        const value = (0,_use_context__WEBPACK_IMPORTED_MODULE_3__.useContext)(context);
        return (0,_helpers__WEBPACK_IMPORTED_MODULE_4__.detectIsFunction)(slot) ? slot(value) : null;
    }, { displayName: `${displayName}.Consumer` });
}



/***/ }),

/***/ "./src/context/index.ts":
/*!******************************!*\
  !*** ./src/context/index.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createContext": () => (/* reexport safe */ _context__WEBPACK_IMPORTED_MODULE_0__.createContext)
/* harmony export */ });
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./context */ "./src/context/context.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ "./src/context/types.ts");




/***/ }),

/***/ "./src/context/types.ts":
/*!******************************!*\
  !*** ./src/context/types.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "./src/element/element.ts":
/*!********************************!*\
  !*** ./src/element/element.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createElement": () => (/* binding */ createElement)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ "./src/helpers/index.ts");
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../view */ "./src/view/index.ts");


function getChildren(children) {
    children = children.map(x => ((0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsString)(x) || (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsNumber)(x) ? (0,_view__WEBPACK_IMPORTED_MODULE_1__.Text)(x.toString()) : x));
    return children ? (Array.isArray(children) ? [...children] : [children]) : [];
}
function createElement(tag, props, ...children) {
    if ((0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsString)(tag)) {
        return (0,_view__WEBPACK_IMPORTED_MODULE_1__.View)({
            ...props,
            as: tag,
            slot: getChildren(children),
        });
    }
    if ((0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsFunction)(tag)) {
        let slot = getChildren(children);
        slot = slot.length === 1 ? slot[0] : slot;
        return tag({ ...props, slot });
    }
    return null;
}



/***/ }),

/***/ "./src/element/index.ts":
/*!******************************!*\
  !*** ./src/element/index.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createElement": () => (/* reexport safe */ _element__WEBPACK_IMPORTED_MODULE_0__.createElement)
/* harmony export */ });
/* harmony import */ var _element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./element */ "./src/element/element.ts");



/***/ }),

/***/ "./src/fiber/fiber.ts":
/*!****************************!*\
  !*** ./src/fiber/fiber.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Fiber": () => (/* binding */ Fiber),
/* harmony export */   "createHook": () => (/* binding */ createHook),
/* harmony export */   "createUpdateCallback": () => (/* binding */ createUpdateCallback),
/* harmony export */   "hasChildrenProp": () => (/* binding */ hasChildrenProp),
/* harmony export */   "workLoop": () => (/* binding */ workLoop)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ "./src/helpers/index.ts");
/* harmony import */ var _platform__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../platform */ "./src/platform/index.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../scope */ "./src/scope/index.ts");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../component */ "./src/component/index.ts");
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../view */ "./src/view/index.ts");
/* harmony import */ var _memo__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../memo */ "./src/memo/index.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./types */ "./src/fiber/types.ts");
/* harmony import */ var _use_effect__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../use-effect */ "./src/use-effect/index.ts");
/* harmony import */ var _use_layout_effect__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../use-layout-effect */ "./src/use-layout-effect/index.ts");
/* harmony import */ var _walk__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../walk */ "./src/walk/index.ts");
/* harmony import */ var _unmount__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../unmount */ "./src/unmount/index.ts");












class Fiber {
    nativeElement;
    parent;
    child;
    nextSibling;
    alternate;
    effectTag;
    instance;
    hook;
    shadow;
    provider;
    transposition;
    mountedToHost;
    portalHost;
    effectHost;
    layoutEffectHost;
    childrenCount;
    marker;
    isUsed;
    idx;
    batched;
    catchException;
    constructor(options) {
        this.nativeElement = options.nativeElement || null;
        this.parent = options.parent || null;
        this.child = options.child || null;
        this.nextSibling = options.nextSibling || null;
        this.alternate = options.alternate || null;
        this.effectTag = options.effectTag || null;
        this.instance = options.instance || null;
        this.hook = options.hook || createHook();
        this.shadow = options.shadow || null;
        this.provider = options.provider || null;
        this.transposition = !(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsUndefined)(options.transposition) ? options.transposition : false;
        this.mountedToHost = !(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsUndefined)(options.mountedToHost) || false;
        this.portalHost = !(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsUndefined)(options.portalHost) ? options.portalHost : false;
        this.effectHost = !(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsUndefined)(options.effectHost) ? options.effectHost : false;
        this.layoutEffectHost = !(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsUndefined)(options.layoutEffectHost) ? options.layoutEffectHost : false;
        this.childrenCount = options.childrenCount || 0;
        this.marker = options.marker || '';
        this.idx = options.idx || 0;
        this.isUsed = options.isUsed || false;
        this.batched = options.batched || [];
    }
    markPortalHost() {
        this.portalHost = true;
        this.parent && !this.parent.portalHost && this.parent.markPortalHost();
    }
    markEffectHost() {
        this.effectHost = true;
        this.parent && !this.parent.effectHost && this.parent.markEffectHost();
    }
    markLayoutEffectHost() {
        this.layoutEffectHost = true;
        this.parent && !this.parent.layoutEffectHost && this.parent.markLayoutEffectHost();
    }
    markMountedToHost() {
        this.mountedToHost = true;
        this.parent && !this.parent.mountedToHost && this.parent.markMountedToHost();
    }
    setError(error) {
        if (typeof this.catchException === 'function') {
            this.catchException(error);
        }
        else if (this.parent) {
            this.parent.setError(error);
        }
    }
}
function workLoop() {
    const wipFiber = _scope__WEBPACK_IMPORTED_MODULE_2__.wipRootStore.get();
    let nextUnitOfWork = _scope__WEBPACK_IMPORTED_MODULE_2__.nextUnitOfWorkStore.get();
    let shouldYield = false;
    let hasMoreWork = Boolean(nextUnitOfWork);
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
        _scope__WEBPACK_IMPORTED_MODULE_2__.nextUnitOfWorkStore.set(nextUnitOfWork);
        hasMoreWork = Boolean(nextUnitOfWork);
        shouldYield = _platform__WEBPACK_IMPORTED_MODULE_1__.platform.shouldYeildToHost();
    }
    if (!nextUnitOfWork && wipFiber) {
        commitChanges();
    }
    return hasMoreWork;
}
function performUnitOfWork(fiber) {
    let isDeepWalking = true;
    let nextFiber = fiber;
    let shadow = fiber.shadow;
    let instance = fiber.instance;
    while (true) {
        isDeepWalking = _scope__WEBPACK_IMPORTED_MODULE_2__.fiberMountStore.deepWalking.get();
        nextFiber.hook.idx = 0;
        if (isDeepWalking) {
            const hasChildren = hasChildrenProp(instance) && instance.children.length > 0;
            if (hasChildren) {
                const { performedFiber, performedNextFiber, performedShadow, performedInstance } = performChild({
                    nextFiber,
                    shadow,
                    instance,
                });
                nextFiber = performedNextFiber;
                shadow = performedShadow;
                instance = performedInstance;
                if (performedFiber)
                    return performedFiber;
            }
            else {
                const { performedFiber, performedNextFiber, performedShadow, performedInstance } = performSibling({
                    nextFiber,
                    shadow,
                    instance,
                });
                nextFiber = performedNextFiber;
                shadow = performedShadow;
                instance = performedInstance;
                if (performedFiber)
                    return performedFiber;
            }
        }
        else {
            const { performedFiber, performedNextFiber, performedShadow, performedInstance } = performSibling({
                nextFiber,
                shadow,
                instance,
            });
            nextFiber = performedNextFiber;
            shadow = performedShadow;
            instance = performedInstance;
            if (performedFiber)
                return performedFiber;
        }
        performPartialUpdateEffects(nextFiber);
        if (nextFiber.parent === null)
            return null;
    }
}
function performPartialUpdateEffects(nextFiber) {
    if (nextFiber.marker !== _constants__WEBPACK_IMPORTED_MODULE_6__.PARTIAL_UPDATE)
        return;
    const alternate = nextFiber.child?.alternate || null;
    const fiber = nextFiber.child || null;
    if (alternate && fiber && alternate.nextSibling && !fiber.nextSibling) {
        let nextFiber = alternate.nextSibling;
        const deletions = [];
        while (nextFiber) {
            nextFiber.effectTag = _types__WEBPACK_IMPORTED_MODULE_7__.EffectTag.DELETE;
            deletions.push(nextFiber);
            nextFiber = nextFiber.nextSibling;
        }
        _scope__WEBPACK_IMPORTED_MODULE_2__.deletionsStore.get().push(...deletions);
    }
}
function performChild(options) {
    _scope__WEBPACK_IMPORTED_MODULE_2__.fiberMountStore.jumpToChild();
    let nextFiber = options.nextFiber;
    let shadow = options.shadow;
    let instance = options.instance;
    const childrenIdx = 0;
    shadow = shadow ? shadow.child : null;
    const alternate = getChildAlternate(nextFiber);
    const sourceInstance = hasChildrenProp(instance) ? instance.children[childrenIdx] || null : null;
    const prevKey = alternate ? getElementKey(alternate.instance) : null;
    const nextKey = sourceInstance ? getElementKey(sourceInstance) : null;
    shadow = prevKey !== null && nextKey !== null && prevKey === nextKey ? null : shadow;
    const hook = getHook({ shadow, alternate, prevKey, nextKey });
    const provider = shadow ? shadow.provider : alternate ? alternate.provider : null;
    let fiber = new Fiber({ hook, provider });
    _scope__WEBPACK_IMPORTED_MODULE_2__.currentFiberStore.set(fiber);
    fiber.parent = nextFiber;
    const { performedInstance, performedShadow } = pertformInstance({
        instance,
        idx: childrenIdx,
        fiber,
        alternate,
    });
    instance = performedInstance || instance;
    shadow = performedShadow || shadow;
    alternate && mutateAlternate({ alternate, instance });
    mutateFiber({ fiber, alternate, instance });
    fiber = alternate ? performMemo({ fiber, alternate, instance }) : fiber;
    fiber.idx = childrenIdx;
    nextFiber.child = fiber;
    fiber.parent = nextFiber;
    fiber.shadow = shadow;
    nextFiber = fiber;
    _types__WEBPACK_IMPORTED_MODULE_7__.cloneTagMap[fiber.parent.effectTag] && (fiber.effectTag = fiber.parent.effectTag);
    return {
        performedFiber: nextFiber,
        performedNextFiber: nextFiber,
        performedShadow: shadow,
        performedInstance: instance,
    };
}
function performSibling(options) {
    _scope__WEBPACK_IMPORTED_MODULE_2__.fiberMountStore.jumpToSibling();
    let nextFiber = options.nextFiber;
    let shadow = options.shadow;
    let instance = options.instance;
    const parent = nextFiber.parent.instance;
    const childrenIdx = _scope__WEBPACK_IMPORTED_MODULE_2__.fiberMountStore.getIndex();
    const hasSibling = hasChildrenProp(parent) && parent.children[childrenIdx];
    if (hasSibling) {
        _scope__WEBPACK_IMPORTED_MODULE_2__.fiberMountStore.deepWalking.set(true);
        shadow = shadow ? shadow.nextSibling : null;
        const alternate = getNextSiblingAlternate(nextFiber);
        const sourceInstance = hasChildrenProp(nextFiber.parent.instance)
            ? nextFiber.parent.instance.children[childrenIdx] || null
            : null;
        const prevKey = alternate ? getElementKey(alternate.instance) : null;
        const nextKey = sourceInstance ? getElementKey(sourceInstance) : null;
        shadow = prevKey !== null && nextKey !== null && prevKey === nextKey ? null : shadow;
        const hook = getHook({ shadow, alternate, prevKey, nextKey });
        const provider = shadow ? shadow.provider : alternate ? alternate.provider : null;
        let fiber = new Fiber({ hook, provider });
        _scope__WEBPACK_IMPORTED_MODULE_2__.currentFiberStore.set(fiber);
        fiber.parent = nextFiber.parent;
        const { performedInstance, performedShadow } = pertformInstance({
            instance: parent,
            idx: childrenIdx,
            fiber,
            alternate,
        });
        instance = performedInstance || instance;
        shadow = performedShadow || shadow;
        alternate && mutateAlternate({ alternate, instance });
        mutateFiber({ fiber, alternate, instance });
        fiber = alternate ? performMemo({ fiber, alternate, instance }) : fiber;
        fiber.idx = childrenIdx;
        fiber.parent = nextFiber.parent;
        nextFiber.nextSibling = fiber;
        fiber.shadow = shadow;
        nextFiber = fiber;
        _types__WEBPACK_IMPORTED_MODULE_7__.cloneTagMap[fiber.parent.effectTag] && (fiber.effectTag = fiber.parent.effectTag);
        return {
            performedFiber: nextFiber,
            performedNextFiber: nextFiber,
            performedShadow: shadow,
            performedInstance: instance,
        };
    }
    else {
        _scope__WEBPACK_IMPORTED_MODULE_2__.fiberMountStore.jumpToParent();
        _scope__WEBPACK_IMPORTED_MODULE_2__.fiberMountStore.deepWalking.set(false);
        shadow = shadow ? shadow.parent : null;
        nextFiber = nextFiber.parent;
        instance = nextFiber.instance;
        if (hasChildrenProp(nextFiber.instance)) {
            nextFiber.instance.children = [];
        }
    }
    return {
        performedFiber: null,
        performedNextFiber: nextFiber,
        performedShadow: shadow,
        performedInstance: instance,
    };
}
function mutateFiber(options) {
    const { fiber, alternate, instance } = options;
    const key = alternate ? getElementKey(alternate.instance) : null;
    const nextKey = alternate ? getElementKey(instance) : null;
    const isDifferentKeys = key !== nextKey;
    const isSameType = Boolean(alternate) && getInstanceType(alternate.instance) === getInstanceType(instance);
    const isUpdate = isSameType && !isDifferentKeys;
    fiber.instance = instance;
    fiber.alternate = alternate || null;
    fiber.nativeElement = isUpdate ? alternate.nativeElement : null;
    fiber.effectTag = isUpdate ? _types__WEBPACK_IMPORTED_MODULE_7__.EffectTag.UPDATE : _types__WEBPACK_IMPORTED_MODULE_7__.EffectTag.CREATE;
    fiber.mountedToHost = isUpdate;
    if (hasChildrenProp(fiber.instance)) {
        fiber.childrenCount = fiber.instance.children.length;
    }
    if (fiber.alternate) {
        fiber.alternate.shadow = null;
        fiber.alternate.alternate = null;
    }
    if (!fiber.nativeElement && (0,_view__WEBPACK_IMPORTED_MODULE_4__.detectIsVirtualNode)(fiber.instance)) {
        fiber.nativeElement = _platform__WEBPACK_IMPORTED_MODULE_1__.platform.createNativeElement(fiber.instance);
    }
}
function mutateAlternate(options) {
    const { alternate, instance } = options;
    const alternateType = getInstanceType(alternate.instance);
    const elementType = getInstanceType(instance);
    const isSameType = elementType === alternateType;
    const prevKey = getElementKey(alternate.instance);
    const nextKey = getElementKey(instance);
    const isSameKeys = prevKey === nextKey;
    alternate.isUsed = true;
    if (!isSameType || !isSameKeys) {
        alternate.effectTag = _types__WEBPACK_IMPORTED_MODULE_7__.EffectTag.DELETE;
        _scope__WEBPACK_IMPORTED_MODULE_2__.deletionsStore.get().push(alternate);
    }
    else if (hasChildrenProp(alternate.instance) && hasChildrenProp(instance)) {
        const prevElementsCount = alternate.childrenCount;
        const nextElementsCount = instance.children.length;
        if (prevElementsCount !== nextElementsCount) {
            const children = hasChildrenProp(instance) ? instance.children : [];
            const { prevKeys, nextKeys } = extractKeys(alternate.child, children);
            const hasPrevKeys = prevKeys.length > 0;
            const hasNextKeys = nextKeys.length > 0;
            const hasAnyKeys = hasPrevKeys || hasNextKeys;
            if (true) {
                if (!hasAnyKeys && prevElementsCount !== 0 && nextElementsCount !== 0) {
                    (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.error)(`
            [Dark]: Operation of inserting, adding, replacing elements into list requires to have a unique key for every node (string or number, but not array index)!
          `);
                }
            }
            const performRemoving = () => {
                const diffKeys = getDiffKeys(prevKeys, nextKeys);
                if (diffKeys.length > 0) {
                    const fibersMap = createFibersByKeyMap(alternate.child);
                    for (const key of diffKeys) {
                        const fiber = fibersMap[key] || null;
                        if (fiber) {
                            fiber.effectTag = _types__WEBPACK_IMPORTED_MODULE_7__.EffectTag.DELETE;
                            _scope__WEBPACK_IMPORTED_MODULE_2__.deletionsStore.get().push(fiber);
                        }
                    }
                }
                else {
                    const diffCount = prevElementsCount - nextElementsCount;
                    if (diffCount <= 0)
                        return;
                    const fibers = (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.fromEnd)(getSiblingFibers(alternate.child), diffCount);
                    for (const fiber of fibers) {
                        fiber.effectTag = _types__WEBPACK_IMPORTED_MODULE_7__.EffectTag.DELETE;
                    }
                    _scope__WEBPACK_IMPORTED_MODULE_2__.deletionsStore.get().push(...fibers);
                }
            };
            const performInserting = () => {
                const diffKeys = getDiffKeys(nextKeys, prevKeys);
                if (diffKeys.length === 0 || diffKeys.length === nextKeys.length)
                    return;
                const diffKeyMap = (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.keyBy)(diffKeys, x => x);
                const usedKeyMap = {};
                let keyIdx = 0;
                for (const nextKey of nextKeys) {
                    if (true) {
                        if (usedKeyMap[nextKey]) {
                            (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.error)(`Some key of node already has been used!`);
                        }
                    }
                    usedKeyMap[nextKey] = true;
                    if (nextKey !== prevKeys[keyIdx] && diffKeyMap[nextKey]) {
                        const insertionFiber = new Fiber({
                            instance: (0,_view__WEBPACK_IMPORTED_MODULE_4__.createEmptyVirtualNode)(),
                            parent: alternate,
                            effectTag: _types__WEBPACK_IMPORTED_MODULE_7__.EffectTag.CREATE,
                        });
                        if (keyIdx === 0) {
                            insertionFiber.nextSibling = alternate.child;
                            alternate.child = insertionFiber;
                        }
                        else {
                            const [fiber, prevFiber] = getFibersByIdx(alternate.child, keyIdx);
                            if (fiber && prevFiber) {
                                insertionFiber.nextSibling = fiber;
                                prevFiber.nextSibling = insertionFiber;
                            }
                        }
                    }
                    keyIdx++;
                }
            };
            performRemoving();
            performInserting();
        }
    }
}
function performMemo(options) {
    const { fiber, alternate, instance } = options;
    if ((0,_memo__WEBPACK_IMPORTED_MODULE_5__.detectIsMemo)(fiber.instance)) {
        let memoFiber = null;
        const factory = instance;
        const alternateFactory = alternate.instance;
        if (factory.type !== alternateFactory.type)
            return fiber;
        const props = alternateFactory.props;
        const nextProps = factory.props;
        const skip = !factory.shouldUpdate(props, nextProps);
        if (skip) {
            let nextFiber = null;
            _scope__WEBPACK_IMPORTED_MODULE_2__.fiberMountStore.deepWalking.set(false);
            memoFiber = new Fiber({
                ...alternate,
                alternate,
                effectTag: _types__WEBPACK_IMPORTED_MODULE_7__.EffectTag.SKIP,
                nextSibling: alternate.nextSibling
                    ? alternate.nextSibling.effectTag === _types__WEBPACK_IMPORTED_MODULE_7__.EffectTag.DELETE
                        ? null
                        : alternate.nextSibling
                    : null,
            });
            alternate.alternate = null;
            nextFiber = memoFiber.child;
            while (nextFiber) {
                nextFiber.parent = memoFiber;
                nextFiber = nextFiber.nextSibling;
            }
            if (memoFiber.effectHost) {
                fiber.markEffectHost();
            }
            if (memoFiber.layoutEffectHost) {
                fiber.markLayoutEffectHost();
            }
            if (memoFiber.mountedToHost) {
                fiber.markMountedToHost();
            }
            if (memoFiber.portalHost) {
                fiber.markPortalHost();
            }
            return memoFiber;
        }
    }
    return fiber;
}
function pertformInstance(options) {
    const { instance, idx, fiber, alternate } = options;
    let performedInstance = null;
    let performedShadow = null;
    if (hasChildrenProp(instance)) {
        const elements = (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsArray)(instance.children[idx])
            ? (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.flatten)([instance.children[idx]])
            : [instance.children[idx]];
        instance.children.splice(idx, 1, ...elements);
        performedInstance = instance.children[idx];
        performedShadow = alternate
            ? getRootShadow({
                instance: performedInstance,
                fiber,
                alternate,
            })
            : performedShadow;
        performedInstance = mountInstance(fiber, performedInstance);
    }
    if ((0,_component__WEBPACK_IMPORTED_MODULE_3__.detectIsComponentFactory)(performedInstance)) {
        if ((0,_use_effect__WEBPACK_IMPORTED_MODULE_8__.hasEffects)(fiber)) {
            fiber.markEffectHost();
        }
        if ((0,_use_layout_effect__WEBPACK_IMPORTED_MODULE_9__.hasLayoutEffects)(fiber)) {
            fiber.markLayoutEffectHost();
        }
        if (_platform__WEBPACK_IMPORTED_MODULE_1__.platform.detectIsPortal(performedInstance)) {
            fiber.markPortalHost();
        }
    }
    return {
        performedInstance,
        performedShadow,
    };
}
function getRootShadow(options) {
    const { instance, fiber, alternate } = options;
    const key = getElementKey(alternate.instance);
    const nextKey = getElementKey(instance);
    let shadow = null;
    if (key !== nextKey) {
        shadow = getAlternateByKey(nextKey, alternate.parent.child);
        if (shadow) {
            fiber.hook = shadow.hook;
            fiber.provider = shadow.provider;
            alternate.transposition = true;
        }
    }
    return shadow;
}
function mountInstance(fiber, instance) {
    const isComponentFactory = (0,_component__WEBPACK_IMPORTED_MODULE_3__.detectIsComponentFactory)(instance);
    const factory = instance;
    if (isComponentFactory) {
        try {
            const result = factory.type(factory.props, factory.ref);
            factory.children = (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsArray)(result)
                ? (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.flatten)([result])
                : [result];
        }
        catch (err) {
            factory.children = [];
            fiber.setError(err);
            (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.error)(err);
        }
    }
    else if ((0,_view__WEBPACK_IMPORTED_MODULE_4__.detectIsVirtualNodeFactory)(instance)) {
        instance = instance();
    }
    if (hasChildrenProp(instance)) {
        for (let i = 0; i < instance.children.length; i++) {
            if (!instance.children[i]) {
                instance.children[i] = transformElementInstance(instance.children[i]);
            }
        }
        instance.children = isComponentFactory
            ? instance.children
            : (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsArray)(instance.children)
                ? (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.flatten)([instance.children])
                : [instance.children];
        if (isComponentFactory && factory.children.length === 0) {
            factory.children.push((0,_view__WEBPACK_IMPORTED_MODULE_4__.createEmptyVirtualNode)());
        }
    }
    return instance;
}
function getFibersByIdx(fiber, idx) {
    const map = {};
    let nextFiber = fiber;
    let position = 0;
    while (nextFiber) {
        map[position] = nextFiber;
        if (position === idx) {
            return [map[position] || null, map[position - 1] || null];
        }
        position++;
        nextFiber = nextFiber.nextSibling;
    }
    return [null, null];
}
function createFibersByKeyMap(fiber) {
    let nextFiber = fiber;
    const map = {};
    while (nextFiber) {
        const key = getElementKey(nextFiber.instance);
        if (!(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsEmpty)(key)) {
            map[key] = nextFiber;
        }
        nextFiber = nextFiber.nextSibling;
    }
    return map;
}
function extractKeys(alternate, children) {
    let nextFiber = alternate;
    let idx = 0;
    const prevKeys = [];
    const nextKeys = [];
    while (nextFiber || idx < children.length) {
        const key = nextFiber && getElementKey(nextFiber.instance);
        const nextKey = children[idx] && getElementKey(children[idx]);
        if (!(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsEmpty)(key)) {
            prevKeys.push(key);
        }
        if (!(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsEmpty)(nextKey)) {
            nextKeys.push(nextKey);
        }
        nextFiber = nextFiber ? nextFiber.nextSibling : null;
        idx++;
    }
    return {
        prevKeys,
        nextKeys,
    };
}
function getAlternateByKey(key, fiber) {
    if ((0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsEmpty)(key))
        return null;
    let nextFiber = fiber;
    while (nextFiber) {
        if (key === getElementKey(nextFiber.instance)) {
            return nextFiber;
        }
        nextFiber = nextFiber.nextSibling;
    }
    return null;
}
function getElementKey(instance) {
    const key = (0,_component__WEBPACK_IMPORTED_MODULE_3__.detectIsComponentFactory)(instance)
        ? (0,_component__WEBPACK_IMPORTED_MODULE_3__.getComponentFactoryKey)(instance)
        : (0,_view__WEBPACK_IMPORTED_MODULE_4__.detectIsTagVirtualNode)(instance)
            ? (0,_view__WEBPACK_IMPORTED_MODULE_4__.getVirtualNodeKey)(instance)
            : null;
    return key;
}
function getDiffKeys(keys, nextKeys) {
    const nextKeysMap = nextKeys.reduce((acc, key) => ((acc[key] = true), acc), {});
    const diff = [];
    for (const key of keys) {
        if (!nextKeysMap[key]) {
            diff.push(key);
        }
    }
    return diff;
}
function getChildAlternate(fiber) {
    let alternate = fiber.alternate && fiber.alternate.effectTag !== _types__WEBPACK_IMPORTED_MODULE_7__.EffectTag.DELETE ? fiber.alternate.child : null;
    while (alternate && alternate.effectTag === _types__WEBPACK_IMPORTED_MODULE_7__.EffectTag.DELETE) {
        alternate = alternate.nextSibling;
    }
    return alternate;
}
function getNextSiblingAlternate(fiber) {
    let alternate = fiber.alternate?.nextSibling || null;
    while (alternate && alternate.effectTag === _types__WEBPACK_IMPORTED_MODULE_7__.EffectTag.DELETE) {
        alternate = alternate.nextSibling;
    }
    return alternate;
}
function transformElementInstance(instance) {
    return (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsEmpty)(instance) || instance === false ? (0,_view__WEBPACK_IMPORTED_MODULE_4__.createEmptyVirtualNode)() : instance;
}
function getInstanceType(instance) {
    return (0,_view__WEBPACK_IMPORTED_MODULE_4__.detectIsTagVirtualNode)(instance)
        ? instance.name
        : (0,_view__WEBPACK_IMPORTED_MODULE_4__.detectIsVirtualNode)(instance)
            ? instance.type
            : (0,_component__WEBPACK_IMPORTED_MODULE_3__.detectIsComponentFactory)(instance)
                ? instance.type
                : null;
}
function getSiblingFibers(fiber) {
    const list = [];
    let nextFiber = fiber;
    while (nextFiber) {
        list.push(nextFiber);
        nextFiber = nextFiber.nextSibling;
    }
    return list;
}
function hasChildrenProp(element) {
    return (0,_view__WEBPACK_IMPORTED_MODULE_4__.detectIsTagVirtualNode)(element) || (0,_component__WEBPACK_IMPORTED_MODULE_3__.detectIsComponentFactory)(element);
}
function commitChanges() {
    const wipFiber = _scope__WEBPACK_IMPORTED_MODULE_2__.wipRootStore.get();
    commitWork(wipFiber.child, () => {
        const layoutEffects = _scope__WEBPACK_IMPORTED_MODULE_2__.layoutEffectsStore.get();
        const effects = _scope__WEBPACK_IMPORTED_MODULE_2__.effectsStore.get();
        _scope__WEBPACK_IMPORTED_MODULE_2__.isLayoutEffectsZone.set(true);
        layoutEffects.forEach(fn => fn());
        _scope__WEBPACK_IMPORTED_MODULE_2__.isLayoutEffectsZone.set(false);
        setTimeout(() => {
            effects.forEach(fn => fn());
        });
        _scope__WEBPACK_IMPORTED_MODULE_2__.wipRootStore.set(null); // important order
        _scope__WEBPACK_IMPORTED_MODULE_2__.layoutEffectsStore.reset();
        _scope__WEBPACK_IMPORTED_MODULE_2__.effectsStore.reset();
        if (_scope__WEBPACK_IMPORTED_MODULE_2__.isUpdateHookZone.get()) {
            _scope__WEBPACK_IMPORTED_MODULE_2__.isUpdateHookZone.set(false);
        }
        else {
            _scope__WEBPACK_IMPORTED_MODULE_2__.currentRootStore.set(wipFiber);
        }
    });
}
function commitWork(fiber, onComplete) {
    const deletions = _scope__WEBPACK_IMPORTED_MODULE_2__.deletionsStore.get();
    // important order
    for (const fiber of deletions) {
        (0,_unmount__WEBPACK_IMPORTED_MODULE_11__.unmountFiber)(fiber);
        _platform__WEBPACK_IMPORTED_MODULE_1__.platform.applyCommit(fiber);
    }
    (0,_walk__WEBPACK_IMPORTED_MODULE_10__.walkFiber)({
        fiber,
        onLoop: ({ nextFiber, isReturn, resetIsDeepWalking }) => {
            const skip = nextFiber.effectTag === _types__WEBPACK_IMPORTED_MODULE_7__.EffectTag.SKIP;
            if (skip) {
                resetIsDeepWalking();
            }
            else if (!isReturn) {
                _platform__WEBPACK_IMPORTED_MODULE_1__.platform.applyCommit(nextFiber);
            }
            if (nextFiber && nextFiber.shadow) {
                nextFiber.shadow = null;
            }
        },
    });
    _platform__WEBPACK_IMPORTED_MODULE_1__.platform.finishCommitWork();
    _scope__WEBPACK_IMPORTED_MODULE_2__.deletionsStore.set([]);
    onComplete();
}
function createHook() {
    return {
        idx: 0,
        values: [],
    };
}
function getHook(options) {
    const { shadow, alternate, prevKey, nextKey } = options;
    if (shadow)
        return shadow.hook;
    if (alternate && prevKey === nextKey)
        return alternate.hook;
    return createHook();
}
function createUpdateCallback(options) {
    const { rootId, fiber, forceStart = false, onStart } = options;
    const callback = () => {
        forceStart && onStart();
        if (fiber.isUsed)
            return;
        !forceStart && onStart();
        _scope__WEBPACK_IMPORTED_MODULE_2__.rootStore.set(rootId); // important order!
        _scope__WEBPACK_IMPORTED_MODULE_2__.isUpdateHookZone.set(true);
        _scope__WEBPACK_IMPORTED_MODULE_2__.fiberMountStore.reset();
        fiber.alternate = new Fiber({
            ...fiber,
            alternate: null,
        });
        fiber.marker = _constants__WEBPACK_IMPORTED_MODULE_6__.PARTIAL_UPDATE;
        fiber.effectTag = _types__WEBPACK_IMPORTED_MODULE_7__.EffectTag.UPDATE;
        fiber.child = null;
        _scope__WEBPACK_IMPORTED_MODULE_2__.wipRootStore.set(fiber);
        _scope__WEBPACK_IMPORTED_MODULE_2__.currentFiberStore.set(fiber);
        fiber.instance = mountInstance(fiber, fiber.instance);
        _scope__WEBPACK_IMPORTED_MODULE_2__.nextUnitOfWorkStore.set(fiber);
    };
    return callback;
}



/***/ }),

/***/ "./src/fiber/index.ts":
/*!****************************!*\
  !*** ./src/fiber/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EffectTag": () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_1__.EffectTag),
/* harmony export */   "Fiber": () => (/* reexport safe */ _fiber__WEBPACK_IMPORTED_MODULE_0__.Fiber),
/* harmony export */   "cloneTagMap": () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_1__.cloneTagMap),
/* harmony export */   "createHook": () => (/* reexport safe */ _fiber__WEBPACK_IMPORTED_MODULE_0__.createHook),
/* harmony export */   "createUpdateCallback": () => (/* reexport safe */ _fiber__WEBPACK_IMPORTED_MODULE_0__.createUpdateCallback),
/* harmony export */   "hasChildrenProp": () => (/* reexport safe */ _fiber__WEBPACK_IMPORTED_MODULE_0__.hasChildrenProp),
/* harmony export */   "workLoop": () => (/* reexport safe */ _fiber__WEBPACK_IMPORTED_MODULE_0__.workLoop)
/* harmony export */ });
/* harmony import */ var _fiber__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fiber */ "./src/fiber/fiber.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ "./src/fiber/types.ts");




/***/ }),

/***/ "./src/fiber/types.ts":
/*!****************************!*\
  !*** ./src/fiber/types.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EffectTag": () => (/* binding */ EffectTag),
/* harmony export */   "cloneTagMap": () => (/* binding */ cloneTagMap)
/* harmony export */ });
var EffectTag;
(function (EffectTag) {
    EffectTag["CREATE"] = "CREATE";
    EffectTag["UPDATE"] = "UPDATE";
    EffectTag["DELETE"] = "DELETE";
    EffectTag["SKIP"] = "SKIP";
})(EffectTag || (EffectTag = {}));
const cloneTagMap = {
    [EffectTag.CREATE]: true,
    [EffectTag.SKIP]: true,
};


/***/ }),

/***/ "./src/fragment/fragment.ts":
/*!**********************************!*\
  !*** ./src/fragment/fragment.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Fragment": () => (/* binding */ Fragment),
/* harmony export */   "detectIsFragment": () => (/* binding */ detectIsFragment)
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component */ "./src/component/index.ts");

const $$fragment = Symbol('fragment');
const Fragment = (0,_component__WEBPACK_IMPORTED_MODULE_0__.createComponent)(({ slot }) => slot || null, {
    token: $$fragment,
});
const detectIsFragment = (factory) => (0,_component__WEBPACK_IMPORTED_MODULE_0__.detectIsComponentFactory)(factory) && factory.token === $$fragment;



/***/ }),

/***/ "./src/fragment/index.ts":
/*!*******************************!*\
  !*** ./src/fragment/index.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Fragment": () => (/* reexport safe */ _fragment__WEBPACK_IMPORTED_MODULE_0__.Fragment),
/* harmony export */   "detectIsFragment": () => (/* reexport safe */ _fragment__WEBPACK_IMPORTED_MODULE_0__.detectIsFragment)
/* harmony export */ });
/* harmony import */ var _fragment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fragment */ "./src/fragment/fragment.ts");



/***/ }),

/***/ "./src/helpers/index.ts":
/*!******************************!*\
  !*** ./src/helpers/index.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "detectIsArray": () => (/* binding */ detectIsArray),
/* harmony export */   "detectIsBoolean": () => (/* binding */ detectIsBoolean),
/* harmony export */   "detectIsDepsDifferent": () => (/* binding */ detectIsDepsDifferent),
/* harmony export */   "detectIsEmpty": () => (/* binding */ detectIsEmpty),
/* harmony export */   "detectIsFunction": () => (/* binding */ detectIsFunction),
/* harmony export */   "detectIsNull": () => (/* binding */ detectIsNull),
/* harmony export */   "detectIsNumber": () => (/* binding */ detectIsNumber),
/* harmony export */   "detectIsObject": () => (/* binding */ detectIsObject),
/* harmony export */   "detectIsString": () => (/* binding */ detectIsString),
/* harmony export */   "detectIsUndefined": () => (/* binding */ detectIsUndefined),
/* harmony export */   "dummyFn": () => (/* binding */ dummyFn),
/* harmony export */   "error": () => (/* binding */ error),
/* harmony export */   "flatten": () => (/* binding */ flatten),
/* harmony export */   "fromEnd": () => (/* binding */ fromEnd),
/* harmony export */   "getTime": () => (/* binding */ getTime),
/* harmony export */   "keyBy": () => (/* binding */ keyBy)
/* harmony export */ });
const detectIsFunction = (o) => typeof o === 'function';
const detectIsUndefined = (o) => typeof o === 'undefined';
const detectIsNumber = (o) => typeof o === 'number';
const detectIsString = (o) => typeof o === 'string';
const detectIsObject = (o) => typeof o === 'object';
const detectIsBoolean = (o) => typeof o === 'boolean';
const detectIsArray = (o) => Array.isArray(o);
const detectIsNull = (o) => o === null;
const detectIsEmpty = (o) => detectIsNull(o) || detectIsUndefined(o);
function error(str) {
    !detectIsUndefined(console) && console.error(str);
}
function flatten(source) {
    const list = [];
    const levelMap = { 0: { idx: 0, source } };
    let level = 0;
    do {
        const { source, idx } = levelMap[level];
        const item = source[idx];
        if (idx >= source.length) {
            level--;
            levelMap[level].idx++;
            continue;
        }
        if (detectIsArray(item)) {
            level++;
            levelMap[level] = {
                idx: 0,
                source: item,
            };
        }
        else {
            list.push(item);
            levelMap[level].idx++;
        }
    } while (level > 0 || levelMap[level].idx < levelMap[level].source.length);
    return list;
}
function getTime() {
    return Date.now();
}
function keyBy(list, fn, value = false) {
    return list.reduce((acc, x) => ((acc[fn(x)] = value ? x : true), acc), {});
}
function fromEnd(source, count) {
    return source.slice(source.length - count, source.length);
}
const dummyFn = () => { };
function detectIsDepsDifferent(deps, prevDeps) {
    if (!detectIsUndefined(deps) && !detectIsUndefined(prevDeps) && deps.length > 0 && prevDeps.length > 0) {
        for (let i = 0; i < prevDeps.length; i++) {
            if (prevDeps[i] !== deps[i]) {
                return true;
            }
        }
    }
    return false;
}



/***/ }),

/***/ "./src/lazy/index.ts":
/*!***************************!*\
  !*** ./src/lazy/index.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "detectIsLazy": () => (/* reexport safe */ _lazy__WEBPACK_IMPORTED_MODULE_0__.detectIsLazy),
/* harmony export */   "lazy": () => (/* reexport safe */ _lazy__WEBPACK_IMPORTED_MODULE_0__.lazy)
/* harmony export */ });
/* harmony import */ var _lazy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lazy */ "./src/lazy/lazy.ts");



/***/ }),

/***/ "./src/lazy/lazy.ts":
/*!**************************!*\
  !*** ./src/lazy/lazy.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "detectIsLazy": () => (/* binding */ detectIsLazy),
/* harmony export */   "lazy": () => (/* binding */ lazy)
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component */ "./src/component/index.ts");
/* harmony import */ var _use_state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../use-state */ "./src/use-state/index.ts");
/* harmony import */ var _use_effect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../use-effect */ "./src/use-effect/index.ts");
/* harmony import */ var _ref__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../ref */ "./src/ref/index.ts");
/* harmony import */ var _suspense__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../suspense */ "./src/suspense/index.ts");
/* harmony import */ var _use_context__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../use-context */ "./src/use-context/index.ts");






const $$lazy = Symbol('lazy');
function lazy(dynamic) {
    return (0,_ref__WEBPACK_IMPORTED_MODULE_3__.forwardRef)((0,_component__WEBPACK_IMPORTED_MODULE_0__.createComponent)((props, ref) => {
        const { fallback, trigger } = (0,_use_context__WEBPACK_IMPORTED_MODULE_5__.useContext)(_suspense__WEBPACK_IMPORTED_MODULE_4__.SuspenseContext);
        const [scope, setScope] = (0,_use_state__WEBPACK_IMPORTED_MODULE_1__.useState)({
            component: null,
        });
        (0,_use_effect__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
            fetchModule(dynamic).then(component => {
                setScope({ component });
            });
        }, []);
        (0,_use_effect__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
            if (!scope.component)
                return;
            trigger();
        }, [scope.component]);
        return scope.component ? scope.component(props, ref) : fallback;
    }, { token: $$lazy }));
}
const detectIsLazy = (factory) => (0,_component__WEBPACK_IMPORTED_MODULE_0__.detectIsComponentFactory)(factory) && factory.token === $$lazy;
function fetchModule(dynamic) {
    return new Promise(resolve => {
        dynamic().then(module => {
            if (!module.default) {
                throw new Error('[Dark]: lazy loaded component should be exported as default!');
            }
            resolve(module.default);
        });
    });
}



/***/ }),

/***/ "./src/memo/index.ts":
/*!***************************!*\
  !*** ./src/memo/index.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$$memo": () => (/* reexport safe */ _memo__WEBPACK_IMPORTED_MODULE_0__.$$memo),
/* harmony export */   "detectIsMemo": () => (/* reexport safe */ _memo__WEBPACK_IMPORTED_MODULE_0__.detectIsMemo),
/* harmony export */   "memo": () => (/* reexport safe */ _memo__WEBPACK_IMPORTED_MODULE_0__.memo)
/* harmony export */ });
/* harmony import */ var _memo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./memo */ "./src/memo/memo.ts");



/***/ }),

/***/ "./src/memo/memo.ts":
/*!**************************!*\
  !*** ./src/memo/memo.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$$memo": () => (/* binding */ $$memo),
/* harmony export */   "detectIsMemo": () => (/* binding */ detectIsMemo),
/* harmony export */   "memo": () => (/* binding */ memo)
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component */ "./src/component/index.ts");
/* harmony import */ var _ref__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ref */ "./src/ref/index.ts");


const $$memo = Symbol('memo');
const defaultShouldUpdate = (props, nextProps) => {
    const keys = Object.keys(nextProps);
    for (const key of keys) {
        if (key !== 'slot' && nextProps[key] !== props[key]) {
            return true;
        }
    }
    return false;
};
const detectIsMemo = (factory) => (0,_component__WEBPACK_IMPORTED_MODULE_0__.detectIsComponentFactory)(factory) && factory.token === $$memo;
function memo(component, shouldUpdate = defaultShouldUpdate) {
    return (0,_ref__WEBPACK_IMPORTED_MODULE_1__.forwardRef)((0,_component__WEBPACK_IMPORTED_MODULE_0__.createComponent)((props, ref) => {
        ref && (props.ref = ref);
        return component(props);
    }, { token: $$memo, shouldUpdate }));
}



/***/ }),

/***/ "./src/platform/index.ts":
/*!*******************************!*\
  !*** ./src/platform/index.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "platform": () => (/* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.platform)
/* harmony export */ });
/* harmony import */ var _platform__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./platform */ "./src/platform/platform.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ "./src/platform/types.ts");




/***/ }),

/***/ "./src/platform/platform.ts":
/*!**********************************!*\
  !*** ./src/platform/platform.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "platform": () => (/* binding */ platform)
/* harmony export */ });
const platform = {
    createNativeElement: () => {
        throw new Error('createNativeElement not installed by renderer');
    },
    requestAnimationFrame: () => {
        throw new Error('requestAnimationFrame not installed by renderer');
    },
    scheduleCallback: () => {
        throw new Error('scheduleCallback not installed by renderer');
    },
    shouldYeildToHost: () => {
        throw new Error('shouldYeildToHost not installed by renderer');
    },
    applyCommit: () => {
        throw new Error('applyCommit not installed by renderer');
    },
    finishCommitWork: () => {
        throw new Error('finishCommitWork not installed by renderer');
    },
    detectIsPortal: () => {
        throw new Error('detectIsPortal not installed by renderer');
    },
    unmountPortal: () => {
        throw new Error('unmountPortal not installed by renderer');
    },
};


/***/ }),

/***/ "./src/platform/types.ts":
/*!*******************************!*\
  !*** ./src/platform/types.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "./src/ref/index.ts":
/*!**************************!*\
  !*** ./src/ref/index.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "detectIsMutableRef": () => (/* reexport safe */ _ref__WEBPACK_IMPORTED_MODULE_0__.detectIsMutableRef),
/* harmony export */   "forwardRef": () => (/* reexport safe */ _ref__WEBPACK_IMPORTED_MODULE_0__.forwardRef)
/* harmony export */ });
/* harmony import */ var _ref__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ref */ "./src/ref/ref.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ "./src/ref/types.ts");




/***/ }),

/***/ "./src/ref/ref.ts":
/*!************************!*\
  !*** ./src/ref/ref.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "detectIsMutableRef": () => (/* binding */ detectIsMutableRef),
/* harmony export */   "forwardRef": () => (/* binding */ forwardRef)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ "./src/helpers/index.ts");

function forwardRef(component) {
    return ({ ref, ...rest }) => {
        return component(rest, ref);
    };
}
const detectIsMutableRef = (ref) => {
    if (!(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsObject)(ref) || (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsNull)(ref))
        return false;
    const mutableRef = ref;
    for (const key in mutableRef) {
        if (key === 'current' && mutableRef.hasOwnProperty(key)) {
            return true;
        }
    }
    return false;
};



/***/ }),

/***/ "./src/ref/types.ts":
/*!**************************!*\
  !*** ./src/ref/types.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "./src/scope/index.ts":
/*!****************************!*\
  !*** ./src/scope/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "currentFiberStore": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_0__.currentFiberStore),
/* harmony export */   "currentRootStore": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_0__.currentRootStore),
/* harmony export */   "deletionsStore": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_0__.deletionsStore),
/* harmony export */   "effectsStore": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_0__.effectsStore),
/* harmony export */   "eventsStore": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_0__.eventsStore),
/* harmony export */   "fiberMountStore": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_0__.fiberMountStore),
/* harmony export */   "getRootId": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_0__.getRootId),
/* harmony export */   "isBatchZone": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_0__.isBatchZone),
/* harmony export */   "isLayoutEffectsZone": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_0__.isLayoutEffectsZone),
/* harmony export */   "isUpdateHookZone": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_0__.isUpdateHookZone),
/* harmony export */   "layoutEffectsStore": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_0__.layoutEffectsStore),
/* harmony export */   "nextUnitOfWorkStore": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_0__.nextUnitOfWorkStore),
/* harmony export */   "rootStore": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_0__.rootStore),
/* harmony export */   "wipRootStore": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_0__.wipRootStore)
/* harmony export */ });
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scope */ "./src/scope/scope.ts");



/***/ }),

/***/ "./src/scope/scope.ts":
/*!****************************!*\
  !*** ./src/scope/scope.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "currentFiberStore": () => (/* binding */ currentFiberStore),
/* harmony export */   "currentRootStore": () => (/* binding */ currentRootStore),
/* harmony export */   "deletionsStore": () => (/* binding */ deletionsStore),
/* harmony export */   "effectsStore": () => (/* binding */ effectsStore),
/* harmony export */   "eventsStore": () => (/* binding */ eventsStore),
/* harmony export */   "fiberMountStore": () => (/* binding */ fiberMountStore),
/* harmony export */   "getRootId": () => (/* binding */ getRootId),
/* harmony export */   "isBatchZone": () => (/* binding */ isBatchZone),
/* harmony export */   "isLayoutEffectsZone": () => (/* binding */ isLayoutEffectsZone),
/* harmony export */   "isUpdateHookZone": () => (/* binding */ isUpdateHookZone),
/* harmony export */   "layoutEffectsStore": () => (/* binding */ layoutEffectsStore),
/* harmony export */   "nextUnitOfWorkStore": () => (/* binding */ nextUnitOfWorkStore),
/* harmony export */   "rootStore": () => (/* binding */ rootStore),
/* harmony export */   "wipRootStore": () => (/* binding */ wipRootStore)
/* harmony export */ });
let rootId = null;
const stores = new Map();
class Store {
    wipRoot = null;
    currentRoot = null;
    nextUnitOfWork = null;
    events = new Map();
    unsubscribers = [];
    deletions = [];
    fiberMount = {
        level: 0,
        navigation: {},
        isDeepWalking: true,
    };
    componentFiber = null;
    effects = [];
    layoutEffects = [];
    isLayoutEffectsZone = false;
    isUpdateHookZone = false;
    isBatchZone = false;
    trackUpdate;
}
const rootStore = {
    set: (id) => {
        rootId = id;
        !stores.get(rootId) && stores.set(rootId, new Store());
    },
    remove: (id) => stores.delete(id),
};
const getRootId = () => rootId;
const store = {
    get: (id = rootId) => stores.get(id),
};
const wipRootStore = {
    get: () => store.get()?.wipRoot || null,
    set: (fiber) => (store.get().wipRoot = fiber),
};
const currentRootStore = {
    get: (id) => store.get(id)?.currentRoot || null,
    set: (fiber) => (store.get().currentRoot = fiber),
};
const nextUnitOfWorkStore = {
    get: () => store.get()?.nextUnitOfWork || null,
    set: (fiber) => (store.get().nextUnitOfWork = fiber),
};
const currentFiberStore = {
    get: () => store.get()?.componentFiber,
    set: (fiber) => (store.get().componentFiber = fiber),
};
const eventsStore = {
    get: () => store.get().events,
    addUnsubscriber: (fn) => store.get().unsubscribers.push(fn),
    unsubscribe: (id) => store.get(id).unsubscribers.forEach(fn => fn()),
};
const deletionsStore = {
    get: () => store.get().deletions,
    set: (deletions) => (store.get().deletions = deletions),
};
const fiberMountStore = {
    reset: () => {
        store.get().fiberMount = {
            level: 0,
            navigation: {},
            isDeepWalking: true,
        };
    },
    getIndex: () => store.get().fiberMount.navigation[store.get().fiberMount.level],
    jumpToChild: () => {
        const { fiberMount } = store.get();
        const level = fiberMount.level;
        const nextLevel = level + 1;
        fiberMount.level = nextLevel;
        fiberMount.navigation[nextLevel] = 0;
    },
    jumpToParent: () => {
        const { fiberMount } = store.get();
        const level = fiberMount.level;
        const nextLevel = level - 1;
        fiberMount.navigation[level] = 0;
        fiberMount.level = nextLevel;
    },
    jumpToSibling: () => {
        const { fiberMount } = store.get();
        const level = fiberMount.level;
        const idx = fiberMount.navigation[level] + 1;
        fiberMount.navigation[level] = idx;
    },
    deepWalking: {
        get: () => store.get().fiberMount.isDeepWalking,
        set: (value) => (store.get().fiberMount.isDeepWalking = value),
    },
};
const effectsStore = {
    get: () => store.get().effects,
    reset: () => (store.get().effects = []),
    add: (effect) => store.get().effects.push(effect),
};
const layoutEffectsStore = {
    get: () => store.get().layoutEffects,
    reset: () => (store.get().layoutEffects = []),
    add: (effect) => store.get().layoutEffects.push(effect),
};
const isLayoutEffectsZone = {
    get: () => store.get()?.isLayoutEffectsZone || false,
    set: (value) => (store.get().isLayoutEffectsZone = value),
};
const isUpdateHookZone = {
    get: () => store.get()?.isUpdateHookZone || false,
    set: (value) => (store.get().isUpdateHookZone = value),
};
const isBatchZone = {
    get: () => store.get()?.isBatchZone || false,
    set: (value) => (store.get().isBatchZone = value),
};



/***/ }),

/***/ "./src/shared/index.ts":
/*!*****************************!*\
  !*** ./src/shared/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./src/shared/types.ts");



/***/ }),

/***/ "./src/shared/types.ts":
/*!*****************************!*\
  !*** ./src/shared/types.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "./src/suspense/index.ts":
/*!*******************************!*\
  !*** ./src/suspense/index.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Suspense": () => (/* reexport safe */ _suspense__WEBPACK_IMPORTED_MODULE_0__.Suspense),
/* harmony export */   "SuspenseContext": () => (/* reexport safe */ _suspense__WEBPACK_IMPORTED_MODULE_0__.SuspenseContext)
/* harmony export */ });
/* harmony import */ var _suspense__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./suspense */ "./src/suspense/suspense.ts");



/***/ }),

/***/ "./src/suspense/suspense.ts":
/*!**********************************!*\
  !*** ./src/suspense/suspense.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Suspense": () => (/* binding */ Suspense),
/* harmony export */   "SuspenseContext": () => (/* binding */ SuspenseContext)
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component */ "./src/component/index.ts");
/* harmony import */ var _use_state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../use-state */ "./src/use-state/index.ts");
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../context */ "./src/context/index.ts");
/* harmony import */ var _use_context__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../use-context */ "./src/use-context/index.ts");
/* harmony import */ var _use_memo__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../use-memo */ "./src/use-memo/index.ts");
/* harmony import */ var _use_callback__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../use-callback */ "./src/use-callback/index.ts");






const SuspenseContext = (0,_context__WEBPACK_IMPORTED_MODULE_2__.createContext)({
    fallback: null,
    isLoaded: true,
    trigger: () => { },
});
const Suspense = (0,_component__WEBPACK_IMPORTED_MODULE_0__.createComponent)(({ fallback, slot }) => {
    if (!fallback) {
        throw new Error(`[Dark]: Suspense fallback not found`);
    }
    const { isLoaded: isSuspenseLoaded } = (0,_use_context__WEBPACK_IMPORTED_MODULE_3__.useContext)(SuspenseContext);
    const [isLoaded, setIsLoaded] = (0,_use_state__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const trigger = (0,_use_callback__WEBPACK_IMPORTED_MODULE_5__.useCallback)(() => setIsLoaded(true), []);
    const value = (0,_use_memo__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => ({ fallback, isLoaded, trigger }), [fallback, isLoaded]);
    return SuspenseContext.Provider({
        value,
        slot: isSuspenseLoaded ? slot : null,
    });
});



/***/ }),

/***/ "./src/unmount/index.ts":
/*!******************************!*\
  !*** ./src/unmount/index.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "unmountFiber": () => (/* reexport safe */ _unmount__WEBPACK_IMPORTED_MODULE_0__.unmountFiber),
/* harmony export */   "unmountRoot": () => (/* reexport safe */ _unmount__WEBPACK_IMPORTED_MODULE_0__.unmountRoot)
/* harmony export */ });
/* harmony import */ var _unmount__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./unmount */ "./src/unmount/unmount.ts");



/***/ }),

/***/ "./src/unmount/unmount.ts":
/*!********************************!*\
  !*** ./src/unmount/unmount.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "unmountFiber": () => (/* binding */ unmountFiber),
/* harmony export */   "unmountRoot": () => (/* binding */ unmountRoot)
/* harmony export */ });
/* harmony import */ var _platform__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../platform */ "./src/platform/index.ts");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../component */ "./src/component/index.ts");
/* harmony import */ var _use_effect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../use-effect */ "./src/use-effect/index.ts");
/* harmony import */ var _use_layout_effect__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../use-layout-effect */ "./src/use-layout-effect/index.ts");
/* harmony import */ var _walk__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../walk */ "./src/walk/index.ts");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../helpers */ "./src/helpers/index.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../scope */ "./src/scope/index.ts");







function unmountFiber(fiber) {
    if (!fiber.effectHost && !fiber.layoutEffectHost && !fiber.portalHost)
        return;
    (0,_walk__WEBPACK_IMPORTED_MODULE_4__.walkFiber)({
        fiber,
        onLoop: ({ nextFiber, isReturn, stop }) => {
            if (nextFiber === fiber.nextSibling || fiber.transposition)
                return stop();
            if (!isReturn && (0,_component__WEBPACK_IMPORTED_MODULE_1__.detectIsComponentFactory)(nextFiber.instance)) {
                nextFiber.layoutEffectHost && (0,_use_layout_effect__WEBPACK_IMPORTED_MODULE_3__.dropLayoutEffects)(nextFiber.hook);
                nextFiber.effectHost && (0,_use_effect__WEBPACK_IMPORTED_MODULE_2__.dropEffects)(nextFiber.hook);
                nextFiber.portalHost && _platform__WEBPACK_IMPORTED_MODULE_0__.platform.unmountPortal(nextFiber);
            }
        },
    });
}
function unmountRoot(rootId, onComplete) {
    if ((0,_helpers__WEBPACK_IMPORTED_MODULE_5__.detectIsUndefined)(rootId))
        return;
    unmountFiber(_scope__WEBPACK_IMPORTED_MODULE_6__.currentRootStore.get(rootId));
    _scope__WEBPACK_IMPORTED_MODULE_6__.eventsStore.unsubscribe(rootId);
    _scope__WEBPACK_IMPORTED_MODULE_6__.rootStore.remove(rootId);
    onComplete();
}



/***/ }),

/***/ "./src/use-callback/index.ts":
/*!***********************************!*\
  !*** ./src/use-callback/index.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useCallback": () => (/* reexport safe */ _use_callback__WEBPACK_IMPORTED_MODULE_0__.useCallback)
/* harmony export */ });
/* harmony import */ var _use_callback__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./use-callback */ "./src/use-callback/use-callback.ts");



/***/ }),

/***/ "./src/use-callback/use-callback.ts":
/*!******************************************!*\
  !*** ./src/use-callback/use-callback.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useCallback": () => (/* binding */ useCallback)
/* harmony export */ });
/* harmony import */ var _use_memo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../use-memo */ "./src/use-memo/index.ts");

function useCallback(callback, deps) {
    const value = (0,_use_memo__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => callback, deps);
    return value;
}



/***/ }),

/***/ "./src/use-context/index.ts":
/*!**********************************!*\
  !*** ./src/use-context/index.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useContext": () => (/* reexport safe */ _use_context__WEBPACK_IMPORTED_MODULE_0__.useContext)
/* harmony export */ });
/* harmony import */ var _use_context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./use-context */ "./src/use-context/use-context.ts");



/***/ }),

/***/ "./src/use-context/use-context.ts":
/*!****************************************!*\
  !*** ./src/use-context/use-context.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useContext": () => (/* binding */ useContext)
/* harmony export */ });
/* harmony import */ var _use_effect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../use-effect */ "./src/use-effect/index.ts");
/* harmony import */ var _use_memo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../use-memo */ "./src/use-memo/index.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../scope */ "./src/scope/index.ts");
/* harmony import */ var _use_update__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../use-update */ "./src/use-update/index.ts");




function useContext(context) {
    const { defaultValue } = context;
    const fiber = _scope__WEBPACK_IMPORTED_MODULE_2__.currentFiberStore.get();
    const provider = getProvider(context, fiber);
    const value = provider ? provider.value : defaultValue;
    const update = (0,_use_update__WEBPACK_IMPORTED_MODULE_3__.useUpdate)();
    const scope = (0,_use_memo__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => ({ prevValue: value }), []);
    const hasProvider = Boolean(provider);
    (0,_use_effect__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        if (!hasProvider)
            return;
        const subscriber = (newValue) => {
            if (!Object.is(scope.prevValue, newValue)) {
                update();
            }
        };
        provider.subscribers.push(subscriber);
        return () => {
            const idx = provider.subscribers.findIndex(x => x === subscriber);
            if (idx !== -1) {
                provider.subscribers.splice(idx, 1);
            }
        };
    }, [hasProvider]);
    scope.prevValue = value;
    return value;
}
function getProvider(context, fiber) {
    let nextFiber = fiber;
    while (nextFiber) {
        if (nextFiber.provider && nextFiber.provider.get(context)) {
            return nextFiber.provider.get(context);
        }
        nextFiber = nextFiber.parent;
    }
    return null;
}



/***/ }),

/***/ "./src/use-deferred-value/index.ts":
/*!*****************************************!*\
  !*** ./src/use-deferred-value/index.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useDeferredValue": () => (/* reexport safe */ _use_deferred_value__WEBPACK_IMPORTED_MODULE_0__.useDeferredValue)
/* harmony export */ });
/* harmony import */ var _use_deferred_value__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./use-deferred-value */ "./src/use-deferred-value/use-deferred-value.ts");



/***/ }),

/***/ "./src/use-deferred-value/use-deferred-value.ts":
/*!******************************************************!*\
  !*** ./src/use-deferred-value/use-deferred-value.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useDeferredValue": () => (/* binding */ useDeferredValue)
/* harmony export */ });
/* harmony import */ var _use_state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../use-state */ "./src/use-state/index.ts");
/* harmony import */ var _use_effect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../use-effect */ "./src/use-effect/index.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");



function useDeferredValue(value, options) {
    const { timeoutMs } = options || {};
    const [deferredValue, setDeferredValue] = (0,_use_state__WEBPACK_IMPORTED_MODULE_0__.useState)(value, {
        priority: _constants__WEBPACK_IMPORTED_MODULE_2__.TaskPriority.LOW,
        timeoutMs,
    });
    (0,_use_effect__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        setDeferredValue(value);
    }, [value]);
    return deferredValue;
}



/***/ }),

/***/ "./src/use-effect/index.ts":
/*!*********************************!*\
  !*** ./src/use-effect/index.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createEffect": () => (/* reexport safe */ _use_effect__WEBPACK_IMPORTED_MODULE_0__.createEffect),
/* harmony export */   "dropEffects": () => (/* reexport safe */ _use_effect__WEBPACK_IMPORTED_MODULE_0__.dropEffects),
/* harmony export */   "hasEffects": () => (/* reexport safe */ _use_effect__WEBPACK_IMPORTED_MODULE_0__.hasEffects),
/* harmony export */   "useEffect": () => (/* reexport safe */ _use_effect__WEBPACK_IMPORTED_MODULE_0__.useEffect)
/* harmony export */ });
/* harmony import */ var _use_effect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./use-effect */ "./src/use-effect/use-effect.ts");



/***/ }),

/***/ "./src/use-effect/use-effect.ts":
/*!**************************************!*\
  !*** ./src/use-effect/use-effect.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createEffect": () => (/* binding */ createEffect),
/* harmony export */   "dropEffects": () => (/* binding */ dropEffects),
/* harmony export */   "hasEffects": () => (/* binding */ hasEffects),
/* harmony export */   "useEffect": () => (/* binding */ useEffect)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ "./src/helpers/index.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../scope */ "./src/scope/index.ts");


const $$useEffect = Symbol('use-effect');
const { useEffect, hasEffects, dropEffects } = createEffect($$useEffect, _scope__WEBPACK_IMPORTED_MODULE_1__.effectsStore);
function createEffect(token, store) {
    function useEffect(effect, deps) {
        const fiber = _scope__WEBPACK_IMPORTED_MODULE_1__.currentFiberStore.get();
        const hook = fiber.hook;
        const { idx, values } = hook;
        const runEffect = () => {
            values[idx] = {
                deps,
                token,
                value: undefined,
            };
            store.add(() => {
                values[idx].value = effect();
            });
        };
        if ((0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsUndefined)(values[idx])) {
            runEffect();
        }
        else {
            const { deps: prevDeps, value: cleanup } = values[idx];
            const isDepsDifferent = deps ? (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsDepsDifferent)(deps, prevDeps) : true;
            if (isDepsDifferent) {
                (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsFunction)(cleanup) && cleanup();
                runEffect();
            }
        }
        hook.idx++;
    }
    function hasEffects(fiber) {
        const { values } = fiber.hook;
        const hasEffect = values.some(x => x?.token === token);
        return hasEffect;
    }
    function dropEffects(hook) {
        const { values } = hook;
        for (const value of values) {
            if (value.token === token) {
                const cleanup = value.value;
                (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsFunction)(cleanup) && cleanup();
            }
        }
    }
    return {
        useEffect,
        hasEffects,
        dropEffects,
    };
}



/***/ }),

/***/ "./src/use-error/index.ts":
/*!********************************!*\
  !*** ./src/use-error/index.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useError": () => (/* reexport safe */ _use_error__WEBPACK_IMPORTED_MODULE_0__.useError)
/* harmony export */ });
/* harmony import */ var _use_error__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./use-error */ "./src/use-error/use-error.ts");



/***/ }),

/***/ "./src/use-error/use-error.ts":
/*!************************************!*\
  !*** ./src/use-error/use-error.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useError": () => (/* binding */ useError)
/* harmony export */ });
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scope */ "./src/scope/index.ts");
/* harmony import */ var _use_effect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../use-effect */ "./src/use-effect/index.ts");
/* harmony import */ var _use_update__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../use-update */ "./src/use-update/index.ts");
/* harmony import */ var _use_memo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../use-memo */ "./src/use-memo/index.ts");




function useError() {
    const fiber = _scope__WEBPACK_IMPORTED_MODULE_0__.currentFiberStore.get();
    const update = (0,_use_update__WEBPACK_IMPORTED_MODULE_2__.useUpdate)();
    const scope = (0,_use_memo__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => ({ error: null }), []);
    fiber.catchException = (error) => {
        scope.error = error;
        update();
    };
    (0,_use_effect__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        scope.error = null;
    }, [scope.error]);
    return scope.error;
}



/***/ }),

/***/ "./src/use-event/index.ts":
/*!********************************!*\
  !*** ./src/use-event/index.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useEvent": () => (/* reexport safe */ _use_event__WEBPACK_IMPORTED_MODULE_0__.useEvent)
/* harmony export */ });
/* harmony import */ var _use_event__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./use-event */ "./src/use-event/use-event.ts");



/***/ }),

/***/ "./src/use-event/use-event.ts":
/*!************************************!*\
  !*** ./src/use-event/use-event.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useEvent": () => (/* binding */ useEvent)
/* harmony export */ });
/* harmony import */ var _use_memo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../use-memo */ "./src/use-memo/index.ts");
/* harmony import */ var _use_callback__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../use-callback */ "./src/use-callback/index.ts");


function useEvent(fn) {
    const scope = (0,_use_memo__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({ fn }), []);
    scope.fn = fn;
    const callback = (0,_use_callback__WEBPACK_IMPORTED_MODULE_1__.useCallback)((...args) => {
        return scope.fn(...args);
    }, []);
    return callback;
}



/***/ }),

/***/ "./src/use-imperative-handle/index.ts":
/*!********************************************!*\
  !*** ./src/use-imperative-handle/index.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useImperativeHandle": () => (/* reexport safe */ _use_imperative_handle__WEBPACK_IMPORTED_MODULE_0__.useImperativeHandle)
/* harmony export */ });
/* harmony import */ var _use_imperative_handle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./use-imperative-handle */ "./src/use-imperative-handle/use-imperative-handle.ts");



/***/ }),

/***/ "./src/use-imperative-handle/use-imperative-handle.ts":
/*!************************************************************!*\
  !*** ./src/use-imperative-handle/use-imperative-handle.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useImperativeHandle": () => (/* binding */ useImperativeHandle)
/* harmony export */ });
/* harmony import */ var _use_memo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../use-memo */ "./src/use-memo/index.ts");

function useImperativeHandle(ref, createHandle, deps) {
    const current = (0,_use_memo__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => createHandle(), deps);
    ref.current = current;
}



/***/ }),

/***/ "./src/use-layout-effect/index.ts":
/*!****************************************!*\
  !*** ./src/use-layout-effect/index.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "dropLayoutEffects": () => (/* reexport safe */ _use_layout_effect__WEBPACK_IMPORTED_MODULE_0__.dropLayoutEffects),
/* harmony export */   "hasLayoutEffects": () => (/* reexport safe */ _use_layout_effect__WEBPACK_IMPORTED_MODULE_0__.hasLayoutEffects),
/* harmony export */   "useLayoutEffect": () => (/* reexport safe */ _use_layout_effect__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)
/* harmony export */ });
/* harmony import */ var _use_layout_effect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./use-layout-effect */ "./src/use-layout-effect/use-layout-effect.ts");



/***/ }),

/***/ "./src/use-layout-effect/use-layout-effect.ts":
/*!****************************************************!*\
  !*** ./src/use-layout-effect/use-layout-effect.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "dropLayoutEffects": () => (/* binding */ dropLayoutEffects),
/* harmony export */   "hasLayoutEffects": () => (/* binding */ hasLayoutEffects),
/* harmony export */   "useLayoutEffect": () => (/* binding */ useLayoutEffect)
/* harmony export */ });
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scope */ "./src/scope/index.ts");
/* harmony import */ var _use_effect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../use-effect */ "./src/use-effect/index.ts");


const $$useLayoutEffect = Symbol('use-layout-effect');
const { useEffect: useLayoutEffect, hasEffects: hasLayoutEffects, dropEffects: dropLayoutEffects, } = (0,_use_effect__WEBPACK_IMPORTED_MODULE_1__.createEffect)($$useLayoutEffect, _scope__WEBPACK_IMPORTED_MODULE_0__.layoutEffectsStore);



/***/ }),

/***/ "./src/use-memo/index.ts":
/*!*******************************!*\
  !*** ./src/use-memo/index.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useMemo": () => (/* reexport safe */ _use_memo__WEBPACK_IMPORTED_MODULE_0__.useMemo)
/* harmony export */ });
/* harmony import */ var _use_memo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./use-memo */ "./src/use-memo/use-memo.ts");



/***/ }),

/***/ "./src/use-memo/use-memo.ts":
/*!**********************************!*\
  !*** ./src/use-memo/use-memo.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useMemo": () => (/* binding */ useMemo)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ "./src/helpers/index.ts");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../component */ "./src/component/index.ts");
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../view */ "./src/view/index.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../scope */ "./src/scope/index.ts");
/* harmony import */ var _fragment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../fragment */ "./src/fragment/index.ts");
/* harmony import */ var _memo__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../memo */ "./src/memo/index.ts");






const Memo = (0,_component__WEBPACK_IMPORTED_MODULE_1__.createComponent)(({ slot }) => slot, { token: _memo__WEBPACK_IMPORTED_MODULE_5__.$$memo });
function wrap(value, isDepsDifferent) {
    const check = (value) => (0,_view__WEBPACK_IMPORTED_MODULE_2__.detectIsVirtualNodeFactory)(value) || (0,_component__WEBPACK_IMPORTED_MODULE_1__.detectIsComponentFactory)(value);
    if ((0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsArray)(value) ? check(value[0]) : check(value)) {
        const slot = value;
        const factory = Memo({
            slot: (0,_fragment__WEBPACK_IMPORTED_MODULE_4__.Fragment)({ slot }),
        });
        factory.shouldUpdate = () => isDepsDifferent;
        return factory;
    }
    return value;
}
function processValue(getValue, isDepsDifferent = false) {
    return wrap(getValue(), isDepsDifferent);
}
function useMemo(getValue, deps) {
    const fiber = _scope__WEBPACK_IMPORTED_MODULE_3__.currentFiberStore.get();
    const { hook } = fiber;
    const { idx, values } = hook;
    if ((0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsUndefined)(values[idx])) {
        const value = processValue(getValue);
        values[idx] = {
            deps,
            value,
        };
        hook.idx++;
        return value;
    }
    const hookValue = values[idx];
    const prevDeps = hookValue.deps;
    const isDepsDifferent = (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsDepsDifferent)(deps, prevDeps);
    const computedGetValue = isDepsDifferent ? getValue : () => hookValue.value;
    hookValue.deps = deps;
    hookValue.value = processValue(computedGetValue, isDepsDifferent);
    hook.idx++;
    return hookValue.value;
}



/***/ }),

/***/ "./src/use-reducer/index.ts":
/*!**********************************!*\
  !*** ./src/use-reducer/index.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useReducer": () => (/* reexport safe */ _use_reducer__WEBPACK_IMPORTED_MODULE_0__.useReducer)
/* harmony export */ });
/* harmony import */ var _use_reducer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./use-reducer */ "./src/use-reducer/use-reducer.ts");



/***/ }),

/***/ "./src/use-reducer/use-reducer.ts":
/*!****************************************!*\
  !*** ./src/use-reducer/use-reducer.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useReducer": () => (/* binding */ useReducer)
/* harmony export */ });
/* harmony import */ var _use_state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../use-state */ "./src/use-state/index.ts");
/* harmony import */ var _use_callback__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../use-callback */ "./src/use-callback/index.ts");
/* harmony import */ var _use_memo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../use-memo */ "./src/use-memo/index.ts");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helpers */ "./src/helpers/index.ts");




function useReducer(reducer, initialState, initializer) {
    const initialValue = (0,_use_memo__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
        return (0,_helpers__WEBPACK_IMPORTED_MODULE_3__.detectIsFunction)(initializer) ? initializer(initialState) : initialState;
    }, []);
    const [state, setState] = (0,_use_state__WEBPACK_IMPORTED_MODULE_0__.useState)(initialValue);
    const dispatch = (0,_use_callback__WEBPACK_IMPORTED_MODULE_1__.useCallback)((action) => setState(state => reducer(state, action)), []);
    return [state, dispatch];
}



/***/ }),

/***/ "./src/use-ref/index.ts":
/*!******************************!*\
  !*** ./src/use-ref/index.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useRef": () => (/* reexport safe */ _use_ref__WEBPACK_IMPORTED_MODULE_0__.useRef)
/* harmony export */ });
/* harmony import */ var _use_ref__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./use-ref */ "./src/use-ref/use-ref.ts");



/***/ }),

/***/ "./src/use-ref/use-ref.ts":
/*!********************************!*\
  !*** ./src/use-ref/use-ref.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useRef": () => (/* binding */ useRef)
/* harmony export */ });
/* harmony import */ var _use_memo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../use-memo */ "./src/use-memo/index.ts");

function useRef(initialValue = null) {
    const ref = (0,_use_memo__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({ current: initialValue }), []);
    return ref;
}



/***/ }),

/***/ "./src/use-state/index.ts":
/*!********************************!*\
  !*** ./src/use-state/index.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useState": () => (/* reexport safe */ _use_state__WEBPACK_IMPORTED_MODULE_0__.useState)
/* harmony export */ });
/* harmony import */ var _use_state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./use-state */ "./src/use-state/use-state.ts");



/***/ }),

/***/ "./src/use-state/use-state.ts":
/*!************************************!*\
  !*** ./src/use-state/use-state.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useState": () => (/* binding */ useState)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ "./src/helpers/index.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../scope */ "./src/scope/index.ts");
/* harmony import */ var _use_update__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../use-update */ "./src/use-update/index.ts");
/* harmony import */ var _use_memo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../use-memo */ "./src/use-memo/index.ts");
/* harmony import */ var _use_callback__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../use-callback */ "./src/use-callback/index.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");






function useState(initialValue, options) {
    const fiber = _scope__WEBPACK_IMPORTED_MODULE_1__.currentFiberStore.get();
    const update = (0,_use_update__WEBPACK_IMPORTED_MODULE_2__.useUpdate)(options);
    const scope = (0,_use_memo__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => ({
        idx: fiber.hook.idx,
        values: fiber.hook.values,
    }), []);
    const setState = (0,_use_callback__WEBPACK_IMPORTED_MODULE_4__.useCallback)((sourceValue) => {
        const value = scope.values[scope.idx];
        const newValue = (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsFunction)(sourceValue) ? sourceValue(value) : sourceValue;
        if (!Object.is(value, newValue)) {
            const setValue = () => {
                scope.values[scope.idx] = newValue;
            };
            if (options?.priority === _constants__WEBPACK_IMPORTED_MODULE_5__.TaskPriority.LOW) {
                update(() => setValue());
            }
            else {
                setValue();
                update();
            }
        }
    }, []);
    const { hook } = fiber;
    const { idx, values } = hook;
    const value = !(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsUndefined)(values[idx]) ? values[idx] : initialValue;
    values[idx] = value;
    scope.idx = idx;
    scope.values = values;
    hook.idx++;
    return [value, setState];
}



/***/ }),

/***/ "./src/use-update/index.ts":
/*!*********************************!*\
  !*** ./src/use-update/index.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useUpdate": () => (/* reexport safe */ _use_update__WEBPACK_IMPORTED_MODULE_0__.useUpdate)
/* harmony export */ });
/* harmony import */ var _use_update__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./use-update */ "./src/use-update/use-update.ts");



/***/ }),

/***/ "./src/use-update/use-update.ts":
/*!**************************************!*\
  !*** ./src/use-update/use-update.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useUpdate": () => (/* binding */ useUpdate)
/* harmony export */ });
/* harmony import */ var _platform__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../platform */ "./src/platform/index.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../scope */ "./src/scope/index.ts");
/* harmony import */ var _fiber__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../fiber */ "./src/fiber/index.ts");
/* harmony import */ var _use_memo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../use-memo */ "./src/use-memo/index.ts");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../helpers */ "./src/helpers/index.ts");
/* harmony import */ var _batch__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../batch */ "./src/batch/index.ts");






function useUpdate(options) {
    const rootId = (0,_scope__WEBPACK_IMPORTED_MODULE_1__.getRootId)();
    const fiber = _scope__WEBPACK_IMPORTED_MODULE_1__.currentFiberStore.get();
    const scope = (0,_use_memo__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => ({ fiber }), []);
    scope.fiber = fiber;
    const update = (onStart) => {
        const callback = (0,_fiber__WEBPACK_IMPORTED_MODULE_2__.createUpdateCallback)({
            rootId,
            fiber: scope.fiber,
            forceStart: Boolean(options?.timeoutMs),
            onStart: onStart || _helpers__WEBPACK_IMPORTED_MODULE_4__.dummyFn,
        });
        if (_scope__WEBPACK_IMPORTED_MODULE_1__.isLayoutEffectsZone.get()) {
            options = {
                ...(options || {}),
                forceSync: true,
            };
        }
        if (_scope__WEBPACK_IMPORTED_MODULE_1__.isBatchZone.get()) {
            (0,_batch__WEBPACK_IMPORTED_MODULE_5__.runBatch)(scope.fiber, () => _platform__WEBPACK_IMPORTED_MODULE_0__.platform.scheduleCallback(callback, options));
        }
        else {
            _platform__WEBPACK_IMPORTED_MODULE_0__.platform.scheduleCallback(callback, options);
        }
    };
    return update;
}



/***/ }),

/***/ "./src/view/index.ts":
/*!***************************!*\
  !*** ./src/view/index.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Comment": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_0__.Comment),
/* harmony export */   "CommentVirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_0__.CommentVirtualNode),
/* harmony export */   "NodeType": () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_1__.NodeType),
/* harmony export */   "TagVirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_0__.TagVirtualNode),
/* harmony export */   "Text": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_0__.Text),
/* harmony export */   "TextVirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_0__.TextVirtualNode),
/* harmony export */   "View": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_0__.View),
/* harmony export */   "VirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_0__.VirtualNode),
/* harmony export */   "createEmptyVirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_0__.createEmptyVirtualNode),
/* harmony export */   "detectIsCommentVirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_0__.detectIsCommentVirtualNode),
/* harmony export */   "detectIsEmptyVirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_0__.detectIsEmptyVirtualNode),
/* harmony export */   "detectIsTagVirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_0__.detectIsTagVirtualNode),
/* harmony export */   "detectIsTextVirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_0__.detectIsTextVirtualNode),
/* harmony export */   "detectIsVirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_0__.detectIsVirtualNode),
/* harmony export */   "detectIsVirtualNodeFactory": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_0__.detectIsVirtualNodeFactory),
/* harmony export */   "getVirtualNodeKey": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_0__.getVirtualNodeKey)
/* harmony export */ });
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./view */ "./src/view/view.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ "./src/view/types.ts");




/***/ }),

/***/ "./src/view/types.ts":
/*!***************************!*\
  !*** ./src/view/types.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NodeType": () => (/* binding */ NodeType)
/* harmony export */ });
var NodeType;
(function (NodeType) {
    NodeType["TAG"] = "TAG";
    NodeType["TEXT"] = "TEXT";
    NodeType["COMMENT"] = "COMMENT";
})(NodeType || (NodeType = {}));


/***/ }),

/***/ "./src/view/view.ts":
/*!**************************!*\
  !*** ./src/view/view.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Comment": () => (/* binding */ Comment),
/* harmony export */   "CommentVirtualNode": () => (/* binding */ CommentVirtualNode),
/* harmony export */   "TagVirtualNode": () => (/* binding */ TagVirtualNode),
/* harmony export */   "Text": () => (/* binding */ Text),
/* harmony export */   "TextVirtualNode": () => (/* binding */ TextVirtualNode),
/* harmony export */   "View": () => (/* binding */ View),
/* harmony export */   "VirtualNode": () => (/* binding */ VirtualNode),
/* harmony export */   "createEmptyVirtualNode": () => (/* binding */ createEmptyVirtualNode),
/* harmony export */   "detectIsCommentVirtualNode": () => (/* binding */ detectIsCommentVirtualNode),
/* harmony export */   "detectIsEmptyVirtualNode": () => (/* binding */ detectIsEmptyVirtualNode),
/* harmony export */   "detectIsTagVirtualNode": () => (/* binding */ detectIsTagVirtualNode),
/* harmony export */   "detectIsTextVirtualNode": () => (/* binding */ detectIsTextVirtualNode),
/* harmony export */   "detectIsVirtualNode": () => (/* binding */ detectIsVirtualNode),
/* harmony export */   "detectIsVirtualNodeFactory": () => (/* binding */ detectIsVirtualNodeFactory),
/* harmony export */   "getVirtualNodeKey": () => (/* binding */ getVirtualNodeKey)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers */ "./src/helpers/index.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./types */ "./src/view/types.ts");



const $$virtualNode = Symbol('virtual-node');
class VirtualNode {
    type = null;
    constructor(options) {
        this.type = options.type;
    }
}
class TagVirtualNode extends VirtualNode {
    type = _types__WEBPACK_IMPORTED_MODULE_2__.NodeType.TAG;
    name = null;
    isVoid = false;
    attrs = {};
    children = [];
    constructor(options) {
        super(options);
        this.name = options.name || this.name;
        this.isVoid = options.isVoid || this.isVoid;
        this.attrs = options.attrs || this.attrs;
        this.children = options.children || this.children;
    }
}
class TextVirtualNode extends VirtualNode {
    type = _types__WEBPACK_IMPORTED_MODULE_2__.NodeType.TEXT;
    value = '';
    constructor(text) {
        super({});
        this.value = text;
    }
}
class CommentVirtualNode extends VirtualNode {
    type = _types__WEBPACK_IMPORTED_MODULE_2__.NodeType.COMMENT;
    value = '';
    constructor(text) {
        super({});
        this.value = text;
    }
}
const detectIsVirtualNode = (vNode) => vNode instanceof VirtualNode;
const detectIsTagVirtualNode = (vNode) => vNode instanceof TagVirtualNode;
const detectIsCommentVirtualNode = (vNode) => vNode instanceof CommentVirtualNode;
const detectIsTextVirtualNode = (vNode) => vNode instanceof TextVirtualNode;
const detectIsEmptyVirtualNode = (vNode) => detectIsCommentVirtualNode(vNode) && vNode.value === _constants__WEBPACK_IMPORTED_MODULE_0__.EMPTY_NODE;
function getVirtualNodeKey(vNode) {
    const key = vNode && vNode.attrs[_constants__WEBPACK_IMPORTED_MODULE_0__.ATTR_KEY];
    return !(0,_helpers__WEBPACK_IMPORTED_MODULE_1__.detectIsEmpty)(key) ? key : null;
}
const createEmptyVirtualNode = () => new CommentVirtualNode(_constants__WEBPACK_IMPORTED_MODULE_0__.EMPTY_NODE);
const detectIsVirtualNodeFactory = (factory) => (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.detectIsFunction)(factory) && factory[$$virtualNode] === true;
function View(def) {
    const factory = () => {
        const { as, slot, isVoid = false, ...rest } = def;
        const children = isVoid ? [] : (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.detectIsArray)(slot) ? slot : slot ? [slot] : [];
        return new TagVirtualNode({
            name: as,
            isVoid,
            attrs: { ...rest },
            children: children,
        });
    };
    factory[$$virtualNode] = true;
    return factory;
}
function Text(source) {
    const text = (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.detectIsString)(source)
        ? new TextVirtualNode(source)
        : detectIsTextVirtualNode(source)
            ? source.value
            : '';
    return text;
}
function Comment(text) {
    const factory = () => new CommentVirtualNode(text);
    factory[$$virtualNode] = true;
    return factory;
}



/***/ }),

/***/ "./src/walk/index.ts":
/*!***************************!*\
  !*** ./src/walk/index.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "walkFiber": () => (/* reexport safe */ _walk__WEBPACK_IMPORTED_MODULE_0__.walkFiber)
/* harmony export */ });
/* harmony import */ var _walk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./walk */ "./src/walk/walk.ts");



/***/ }),

/***/ "./src/walk/walk.ts":
/*!**************************!*\
  !*** ./src/walk/walk.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "walkFiber": () => (/* binding */ walkFiber)
/* harmony export */ });
function walkFiber(options) {
    const { fiber, onLoop } = options;
    let nextFiber = fiber;
    let isDeepWalking = true;
    let isReturn = false;
    let isStopped = false;
    const visitedMap = new Map();
    const detectCanVisit = (fiber) => !visitedMap.get(fiber);
    while (nextFiber) {
        onLoop({
            nextFiber: nextFiber,
            isReturn,
            resetIsDeepWalking: () => (isDeepWalking = false),
            stop: () => (isStopped = true),
        });
        if (isStopped) {
            break;
        }
        if (nextFiber.child && isDeepWalking && detectCanVisit(nextFiber.child)) {
            const newFiber = nextFiber.child;
            isReturn = false;
            nextFiber = newFiber;
            visitedMap.set(newFiber, true);
        }
        else if (nextFiber.nextSibling && detectCanVisit(nextFiber.nextSibling)) {
            const newFiber = nextFiber.nextSibling;
            isDeepWalking = true;
            isReturn = false;
            nextFiber = newFiber;
            visitedMap.set(newFiber, true);
        }
        else if (nextFiber.parent &&
            nextFiber.parent === fiber &&
            nextFiber.parent.nextSibling &&
            detectCanVisit(nextFiber.parent.nextSibling)) {
            const newFiber = nextFiber.parent.nextSibling;
            isDeepWalking = true;
            isReturn = false;
            nextFiber = newFiber;
            visitedMap.set(newFiber, true);
        }
        else if (nextFiber.parent && nextFiber.parent !== fiber) {
            isDeepWalking = false;
            isReturn = true;
            nextFiber = nextFiber.parent;
        }
        else {
            nextFiber = null;
        }
    }
}



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$$memo": () => (/* reexport safe */ _memo__WEBPACK_IMPORTED_MODULE_8__.$$memo),
/* harmony export */   "ATTR_KEY": () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_27__.ATTR_KEY),
/* harmony export */   "ATTR_REF": () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_27__.ATTR_REF),
/* harmony export */   "Comment": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_26__.Comment),
/* harmony export */   "CommentVirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_26__.CommentVirtualNode),
/* harmony export */   "ComponentFactory": () => (/* reexport safe */ _component__WEBPACK_IMPORTED_MODULE_0__.ComponentFactory),
/* harmony export */   "EMPTY_NODE": () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_27__.EMPTY_NODE),
/* harmony export */   "EffectTag": () => (/* reexport safe */ _fiber__WEBPACK_IMPORTED_MODULE_3__.EffectTag),
/* harmony export */   "Fiber": () => (/* reexport safe */ _fiber__WEBPACK_IMPORTED_MODULE_3__.Fiber),
/* harmony export */   "Fragment": () => (/* reexport safe */ _fragment__WEBPACK_IMPORTED_MODULE_4__.Fragment),
/* harmony export */   "NodeType": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_26__.NodeType),
/* harmony export */   "PARTIAL_UPDATE": () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_27__.PARTIAL_UPDATE),
/* harmony export */   "ROOT": () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_27__.ROOT),
/* harmony export */   "Suspense": () => (/* reexport safe */ _suspense__WEBPACK_IMPORTED_MODULE_12__.Suspense),
/* harmony export */   "SuspenseContext": () => (/* reexport safe */ _suspense__WEBPACK_IMPORTED_MODULE_12__.SuspenseContext),
/* harmony export */   "TagVirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_26__.TagVirtualNode),
/* harmony export */   "TaskPriority": () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_27__.TaskPriority),
/* harmony export */   "Text": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_26__.Text),
/* harmony export */   "TextVirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_26__.TextVirtualNode),
/* harmony export */   "View": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_26__.View),
/* harmony export */   "VirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_26__.VirtualNode),
/* harmony export */   "batch": () => (/* reexport safe */ _batch__WEBPACK_IMPORTED_MODULE_30__.batch),
/* harmony export */   "cloneTagMap": () => (/* reexport safe */ _fiber__WEBPACK_IMPORTED_MODULE_3__.cloneTagMap),
/* harmony export */   "createComponent": () => (/* reexport safe */ _component__WEBPACK_IMPORTED_MODULE_0__.createComponent),
/* harmony export */   "createContext": () => (/* reexport safe */ _context__WEBPACK_IMPORTED_MODULE_1__.createContext),
/* harmony export */   "createEmptyVirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_26__.createEmptyVirtualNode),
/* harmony export */   "createHook": () => (/* reexport safe */ _fiber__WEBPACK_IMPORTED_MODULE_3__.createHook),
/* harmony export */   "createUpdateCallback": () => (/* reexport safe */ _fiber__WEBPACK_IMPORTED_MODULE_3__.createUpdateCallback),
/* harmony export */   "currentFiberStore": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_10__.currentFiberStore),
/* harmony export */   "currentRootStore": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_10__.currentRootStore),
/* harmony export */   "deletionsStore": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_10__.deletionsStore),
/* harmony export */   "detectIsArray": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.detectIsArray),
/* harmony export */   "detectIsBoolean": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.detectIsBoolean),
/* harmony export */   "detectIsCommentVirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_26__.detectIsCommentVirtualNode),
/* harmony export */   "detectIsComponentFactory": () => (/* reexport safe */ _component__WEBPACK_IMPORTED_MODULE_0__.detectIsComponentFactory),
/* harmony export */   "detectIsDepsDifferent": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.detectIsDepsDifferent),
/* harmony export */   "detectIsEmpty": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.detectIsEmpty),
/* harmony export */   "detectIsEmptyVirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_26__.detectIsEmptyVirtualNode),
/* harmony export */   "detectIsFragment": () => (/* reexport safe */ _fragment__WEBPACK_IMPORTED_MODULE_4__.detectIsFragment),
/* harmony export */   "detectIsFunction": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.detectIsFunction),
/* harmony export */   "detectIsLazy": () => (/* reexport safe */ _lazy__WEBPACK_IMPORTED_MODULE_7__.detectIsLazy),
/* harmony export */   "detectIsMemo": () => (/* reexport safe */ _memo__WEBPACK_IMPORTED_MODULE_8__.detectIsMemo),
/* harmony export */   "detectIsMutableRef": () => (/* reexport safe */ _ref__WEBPACK_IMPORTED_MODULE_9__.detectIsMutableRef),
/* harmony export */   "detectIsNull": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.detectIsNull),
/* harmony export */   "detectIsNumber": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.detectIsNumber),
/* harmony export */   "detectIsObject": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.detectIsObject),
/* harmony export */   "detectIsString": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.detectIsString),
/* harmony export */   "detectIsTagVirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_26__.detectIsTagVirtualNode),
/* harmony export */   "detectIsTextVirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_26__.detectIsTextVirtualNode),
/* harmony export */   "detectIsUndefined": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.detectIsUndefined),
/* harmony export */   "detectIsVirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_26__.detectIsVirtualNode),
/* harmony export */   "detectIsVirtualNodeFactory": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_26__.detectIsVirtualNodeFactory),
/* harmony export */   "dummyFn": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.dummyFn),
/* harmony export */   "effectsStore": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_10__.effectsStore),
/* harmony export */   "error": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.error),
/* harmony export */   "eventsStore": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_10__.eventsStore),
/* harmony export */   "fiberMountStore": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_10__.fiberMountStore),
/* harmony export */   "flatten": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.flatten),
/* harmony export */   "forwardRef": () => (/* reexport safe */ _ref__WEBPACK_IMPORTED_MODULE_9__.forwardRef),
/* harmony export */   "fromEnd": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.fromEnd),
/* harmony export */   "getComponentFactoryKey": () => (/* reexport safe */ _component__WEBPACK_IMPORTED_MODULE_0__.getComponentFactoryKey),
/* harmony export */   "getRootId": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_10__.getRootId),
/* harmony export */   "getTime": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.getTime),
/* harmony export */   "getVirtualNodeKey": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_26__.getVirtualNodeKey),
/* harmony export */   "h": () => (/* reexport safe */ _element__WEBPACK_IMPORTED_MODULE_2__.createElement),
/* harmony export */   "hasChildrenProp": () => (/* reexport safe */ _fiber__WEBPACK_IMPORTED_MODULE_3__.hasChildrenProp),
/* harmony export */   "isBatchZone": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_10__.isBatchZone),
/* harmony export */   "isLayoutEffectsZone": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_10__.isLayoutEffectsZone),
/* harmony export */   "isUpdateHookZone": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_10__.isUpdateHookZone),
/* harmony export */   "keyBy": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.keyBy),
/* harmony export */   "layoutEffectsStore": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_10__.layoutEffectsStore),
/* harmony export */   "lazy": () => (/* reexport safe */ _lazy__WEBPACK_IMPORTED_MODULE_7__.lazy),
/* harmony export */   "memo": () => (/* reexport safe */ _memo__WEBPACK_IMPORTED_MODULE_8__.memo),
/* harmony export */   "nextUnitOfWorkStore": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_10__.nextUnitOfWorkStore),
/* harmony export */   "platform": () => (/* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_5__.platform),
/* harmony export */   "rootStore": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_10__.rootStore),
/* harmony export */   "unmountRoot": () => (/* reexport safe */ _unmount__WEBPACK_IMPORTED_MODULE_29__.unmountRoot),
/* harmony export */   "useCallback": () => (/* reexport safe */ _use_callback__WEBPACK_IMPORTED_MODULE_13__.useCallback),
/* harmony export */   "useContext": () => (/* reexport safe */ _use_context__WEBPACK_IMPORTED_MODULE_14__.useContext),
/* harmony export */   "useDeferredValue": () => (/* reexport safe */ _use_deferred_value__WEBPACK_IMPORTED_MODULE_15__.useDeferredValue),
/* harmony export */   "useEffect": () => (/* reexport safe */ _use_effect__WEBPACK_IMPORTED_MODULE_16__.useEffect),
/* harmony export */   "useError": () => (/* reexport safe */ _use_error__WEBPACK_IMPORTED_MODULE_17__.useError),
/* harmony export */   "useEvent": () => (/* reexport safe */ _use_event__WEBPACK_IMPORTED_MODULE_18__.useEvent),
/* harmony export */   "useImperativeHandle": () => (/* reexport safe */ _use_imperative_handle__WEBPACK_IMPORTED_MODULE_19__.useImperativeHandle),
/* harmony export */   "useLayoutEffect": () => (/* reexport safe */ _use_layout_effect__WEBPACK_IMPORTED_MODULE_20__.useLayoutEffect),
/* harmony export */   "useMemo": () => (/* reexport safe */ _use_memo__WEBPACK_IMPORTED_MODULE_21__.useMemo),
/* harmony export */   "useReducer": () => (/* reexport safe */ _use_reducer__WEBPACK_IMPORTED_MODULE_22__.useReducer),
/* harmony export */   "useRef": () => (/* reexport safe */ _use_ref__WEBPACK_IMPORTED_MODULE_23__.useRef),
/* harmony export */   "useState": () => (/* reexport safe */ _use_state__WEBPACK_IMPORTED_MODULE_24__.useState),
/* harmony export */   "useUpdate": () => (/* reexport safe */ _use_update__WEBPACK_IMPORTED_MODULE_25__.useUpdate),
/* harmony export */   "version": () => (/* binding */ version),
/* harmony export */   "walkFiber": () => (/* reexport safe */ _walk__WEBPACK_IMPORTED_MODULE_28__.walkFiber),
/* harmony export */   "wipRootStore": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_10__.wipRootStore),
/* harmony export */   "workLoop": () => (/* reexport safe */ _fiber__WEBPACK_IMPORTED_MODULE_3__.workLoop)
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./src/component/index.ts");
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./context */ "./src/context/index.ts");
/* harmony import */ var _element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./element */ "./src/element/index.ts");
/* harmony import */ var _fiber__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./fiber */ "./src/fiber/index.ts");
/* harmony import */ var _fragment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./fragment */ "./src/fragment/index.ts");
/* harmony import */ var _platform__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./platform */ "./src/platform/index.ts");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./helpers */ "./src/helpers/index.ts");
/* harmony import */ var _lazy__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./lazy */ "./src/lazy/index.ts");
/* harmony import */ var _memo__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./memo */ "./src/memo/index.ts");
/* harmony import */ var _ref__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ref */ "./src/ref/index.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./scope */ "./src/scope/index.ts");
/* harmony import */ var _shared__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./shared */ "./src/shared/index.ts");
/* harmony import */ var _suspense__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./suspense */ "./src/suspense/index.ts");
/* harmony import */ var _use_callback__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./use-callback */ "./src/use-callback/index.ts");
/* harmony import */ var _use_context__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./use-context */ "./src/use-context/index.ts");
/* harmony import */ var _use_deferred_value__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./use-deferred-value */ "./src/use-deferred-value/index.ts");
/* harmony import */ var _use_effect__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./use-effect */ "./src/use-effect/index.ts");
/* harmony import */ var _use_error__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./use-error */ "./src/use-error/index.ts");
/* harmony import */ var _use_event__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./use-event */ "./src/use-event/index.ts");
/* harmony import */ var _use_imperative_handle__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./use-imperative-handle */ "./src/use-imperative-handle/index.ts");
/* harmony import */ var _use_layout_effect__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./use-layout-effect */ "./src/use-layout-effect/index.ts");
/* harmony import */ var _use_memo__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./use-memo */ "./src/use-memo/index.ts");
/* harmony import */ var _use_reducer__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./use-reducer */ "./src/use-reducer/index.ts");
/* harmony import */ var _use_ref__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./use-ref */ "./src/use-ref/index.ts");
/* harmony import */ var _use_state__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./use-state */ "./src/use-state/index.ts");
/* harmony import */ var _use_update__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./use-update */ "./src/use-update/index.ts");
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./view */ "./src/view/index.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./constants */ "./src/constants.ts");
/* harmony import */ var _walk__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./walk */ "./src/walk/index.ts");
/* harmony import */ var _unmount__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./unmount */ "./src/unmount/index.ts");
/* harmony import */ var _batch__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./batch */ "./src/batch/index.ts");
/* eslint-disable @typescript-eslint/no-namespace */































const version = "0.9.4";

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=dark-core.development.js.map