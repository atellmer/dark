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
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};


var $$component = Symbol('component');
var defaultOptions = {
    displayName: '',
    defaultProps: {},
    token: $$component,
};
var ComponentFactory = /** @class */ (function () {
    function ComponentFactory(options) {
        this.children = [];
        this.type = options.type || null;
        this.token = options.token || null;
        this.props = options.props || null;
        this.ref = options.ref || null;
        this.displayName = options.displayName || '';
        this.shouldUpdate = options.shouldUpdate || null;
    }
    return ComponentFactory;
}());
function createComponent(createElement, options) {
    if (options === void 0) { options = {}; }
    var computedOptions = __assign(__assign({}, defaultOptions), options);
    var token = computedOptions.token, defaultProps = computedOptions.defaultProps, displayName = computedOptions.displayName, shouldUpdate = computedOptions.shouldUpdate;
    return function (props, ref) {
        if (props === void 0) { props = {}; }
        var computedProps = __assign(__assign({}, defaultProps), props);
        var factory = new ComponentFactory({
            token: token,
            ref: ref,
            displayName: displayName,
            shouldUpdate: shouldUpdate,
            props: computedProps,
            type: createElement,
            children: [],
        });
        if (computedProps.ref) {
            delete computedProps.ref;
            if (true) {
                (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.error)("[Dark]: To use ref you need to wrap the createComponent with forwardRef!");
            }
        }
        return factory;
    };
}
var detectIsComponentFactory = function (factory) { return factory instanceof ComponentFactory; };
var getComponentFactoryKey = function (factory) {
    return !(0,_helpers__WEBPACK_IMPORTED_MODULE_1__.detectIsEmpty)(factory.props[_constants__WEBPACK_IMPORTED_MODULE_0__.ATTR_KEY]) ? factory.props[_constants__WEBPACK_IMPORTED_MODULE_0__.ATTR_KEY] : null;
};



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
/* harmony import */ var _model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./model */ "./src/component/model.ts");




/***/ }),

/***/ "./src/component/model.ts":
/*!********************************!*\
  !*** ./src/component/model.ts ***!
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
var ROOT = 'root';
var EMPTY_NODE = 'dark:matter';
var ATTR_KEY = 'key';
var ATTR_REF = 'ref';
var PARTIAL_UPDATE = 'partial-update';
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
var __values = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};





function createContext(defaultValue) {
    var displayName = 'Context';
    var context = {
        displayName: displayName,
        defaultValue: defaultValue,
        Provider: null,
        Consumer: null,
    };
    mutateContext(context, defaultValue, displayName);
    Object.defineProperty(context, 'displayName', {
        get: function () { return displayName; },
        set: function (newValue) {
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
    return (0,_component__WEBPACK_IMPORTED_MODULE_0__.createComponent)(function (_a) {
        var _b = _a.value, value = _b === void 0 ? defaultValue : _b, slot = _a.slot;
        var fiber = _scope__WEBPACK_IMPORTED_MODULE_2__.componentFiberHelper.get();
        if (!fiber.provider) {
            fiber.provider = new Map();
        }
        if (!fiber.provider.get(context)) {
            fiber.provider.set(context, {
                subscribers: [],
                value: value,
            });
        }
        var provider = fiber.provider.get(context);
        (0,_use_effect__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
            var e_1, _a;
            try {
                for (var _b = __values(provider.subscribers), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var subscriber = _c.value;
                    subscriber(value);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }, [value]);
        provider.value = value;
        return slot;
    }, { displayName: "".concat(displayName, ".Provider") });
}
function createConsumer(context, displayName) {
    return (0,_component__WEBPACK_IMPORTED_MODULE_0__.createComponent)(function (_a) {
        var slot = _a.slot;
        var value = (0,_use_context__WEBPACK_IMPORTED_MODULE_3__.useContext)(context);
        return (0,_helpers__WEBPACK_IMPORTED_MODULE_4__.detectIsFunction)(slot) ? slot(value) : null;
    }, { displayName: "".concat(displayName, ".Consumer") });
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
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};


function getChildren(children) {
    children = children.map(function (x) { return ((0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsString)(x) || (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsNumber)(x) ? (0,_view__WEBPACK_IMPORTED_MODULE_1__.Text)(x.toString()) : x); });
    return children ? (Array.isArray(children) ? __spreadArray([], __read(children), false) : [children]) : [];
}
function createElement(tag, props) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    if ((0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsString)(tag)) {
        return (0,_view__WEBPACK_IMPORTED_MODULE_1__.View)(__assign(__assign({}, props), { as: tag, slot: getChildren(children) }));
    }
    if ((0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsFunction)(tag)) {
        var slot = getChildren(children);
        slot = slot.length === 1 ? slot[0] : slot;
        return tag(__assign(__assign({}, props), { slot: slot }));
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
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../global */ "./src/global/index.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../scope */ "./src/scope/index.ts");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../component */ "./src/component/index.ts");
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../view */ "./src/view/index.ts");
/* harmony import */ var _memo__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../memo */ "./src/memo/index.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");
/* harmony import */ var _model__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./model */ "./src/fiber/model.ts");
/* harmony import */ var _use_effect__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../use-effect */ "./src/use-effect/index.ts");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};









var Fiber = /** @class */ (function () {
    function Fiber(options) {
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
        this.mountedToHost = !(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsUndefined)(options.mountedToHost) || false;
        this.portalHost = !(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsUndefined)(options.portalHost) ? options.portalHost : false;
        this.effectHost = !(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsUndefined)(options.effectHost) ? options.effectHost : false;
        this.childrenCount = options.childrenCount || 0;
        this.marker = options.marker || '';
        this.isUsed = options.isUsed || false;
    }
    Fiber.prototype.markPortalHost = function () {
        this.portalHost = true;
        this.parent && !this.parent.portalHost && this.parent.markPortalHost();
    };
    Fiber.prototype.markEffectHost = function () {
        this.effectHost = true;
        this.parent && !this.parent.effectHost && this.parent.markEffectHost();
    };
    Fiber.prototype.setError = function (error) {
        if (typeof this.catchException === 'function') {
            this.catchException(error);
        }
        else if (this.parent) {
            this.parent.setError(error);
        }
    };
    return Fiber;
}());
function workLoop() {
    var wipFiber = _scope__WEBPACK_IMPORTED_MODULE_2__.wipRootHelper.get();
    var nextUnitOfWork = _scope__WEBPACK_IMPORTED_MODULE_2__.nextUnitOfWorkHelper.get();
    var shouldYield = false;
    var hasMoreWork = Boolean(nextUnitOfWork);
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
        _scope__WEBPACK_IMPORTED_MODULE_2__.nextUnitOfWorkHelper.set(nextUnitOfWork);
        hasMoreWork = Boolean(nextUnitOfWork);
        shouldYield = _global__WEBPACK_IMPORTED_MODULE_1__.platform.shouldYeildToHost();
    }
    if (!nextUnitOfWork && wipFiber) {
        commitChanges();
    }
    return hasMoreWork;
}
function performUnitOfWork(fiber) {
    var isDeepWalking = true;
    var nextFiber = fiber;
    var shadow = fiber.shadow;
    var instance = fiber.instance;
    while (true) {
        isDeepWalking = _scope__WEBPACK_IMPORTED_MODULE_2__.fiberMountHelper.deepWalking.get();
        nextFiber.hook.idx = 0;
        if (isDeepWalking) {
            var hasChildren = hasChildrenProp(instance) && instance.children.length > 0;
            if (hasChildren) {
                var _a = performChild({
                    nextFiber: nextFiber,
                    shadow: shadow,
                    instance: instance,
                }), performedFiber = _a.performedFiber, performedNextFiber = _a.performedNextFiber, performedShadow = _a.performedShadow, performedInstance = _a.performedInstance;
                nextFiber = performedNextFiber;
                shadow = performedShadow;
                instance = performedInstance;
                if (performedFiber)
                    return performedFiber;
            }
            else {
                var _b = performSibling({
                    nextFiber: nextFiber,
                    shadow: shadow,
                    instance: instance,
                }), performedFiber = _b.performedFiber, performedNextFiber = _b.performedNextFiber, performedShadow = _b.performedShadow, performedInstance = _b.performedInstance;
                nextFiber = performedNextFiber;
                shadow = performedShadow;
                instance = performedInstance;
                if (performedFiber)
                    return performedFiber;
            }
        }
        else {
            var _c = performSibling({
                nextFiber: nextFiber,
                shadow: shadow,
                instance: instance,
            }), performedFiber = _c.performedFiber, performedNextFiber = _c.performedNextFiber, performedShadow = _c.performedShadow, performedInstance = _c.performedInstance;
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
    var _a;
    var _b;
    if (nextFiber.marker === _constants__WEBPACK_IMPORTED_MODULE_6__.PARTIAL_UPDATE) {
        var alternate = ((_b = nextFiber.child) === null || _b === void 0 ? void 0 : _b.alternate) || null;
        var fiber = nextFiber.child || null;
        if (alternate && fiber && alternate.nextSibling && !fiber.nextSibling) {
            var nextFiber_1 = alternate.nextSibling;
            var deletions = [];
            while (nextFiber_1) {
                nextFiber_1.effectTag = _model__WEBPACK_IMPORTED_MODULE_7__.EffectTag.DELETION;
                deletions.push(nextFiber_1);
                nextFiber_1 = nextFiber_1.nextSibling;
            }
            (_a = _scope__WEBPACK_IMPORTED_MODULE_2__.deletionsHelper.get()).push.apply(_a, __spreadArray([], __read(deletions), false));
        }
    }
}
function performChild(options) {
    _scope__WEBPACK_IMPORTED_MODULE_2__.fiberMountHelper.jumpToChild();
    var nextFiber = options.nextFiber;
    var shadow = options.shadow;
    var instance = options.instance;
    shadow = shadow ? shadow.child : null;
    var alternate = getChildAlternate(nextFiber);
    var hook = getHook({ shadow: shadow, alternate: alternate, instance: instance });
    var provider = shadow ? shadow.provider : alternate ? alternate.provider : null;
    var fiber = new Fiber({ hook: hook, provider: provider });
    _scope__WEBPACK_IMPORTED_MODULE_2__.componentFiberHelper.set(fiber);
    fiber.parent = nextFiber;
    var _a = pertformInstance({
        instance: instance,
        idx: 0,
        fiber: fiber,
        alternate: alternate,
    }), performedInstance = _a.performedInstance, performedShadow = _a.performedShadow;
    instance = performedInstance || instance;
    shadow = performedShadow || shadow;
    alternate && mutateAlternate({ fiber: fiber, alternate: alternate, instance: instance });
    mutateFiber({ fiber: fiber, alternate: alternate, instance: instance });
    fiber = alternate ? performMemo({ fiber: fiber, alternate: alternate, instance: instance }) : fiber;
    nextFiber.child = fiber;
    fiber.parent = nextFiber;
    fiber.shadow = shadow;
    nextFiber = fiber;
    _model__WEBPACK_IMPORTED_MODULE_7__.cloneTagMap[fiber.parent.effectTag] && (fiber.effectTag = fiber.parent.effectTag);
    return {
        performedFiber: nextFiber,
        performedNextFiber: nextFiber,
        performedShadow: shadow,
        performedInstance: instance,
    };
}
function performSibling(options) {
    _scope__WEBPACK_IMPORTED_MODULE_2__.fiberMountHelper.jumpToSibling();
    var nextFiber = options.nextFiber;
    var shadow = options.shadow;
    var instance = options.instance;
    var parent = nextFiber.parent.instance;
    var childrenIdx = _scope__WEBPACK_IMPORTED_MODULE_2__.fiberMountHelper.getIndex();
    var hasSibling = hasChildrenProp(parent) && parent.children[childrenIdx];
    if (hasSibling) {
        _scope__WEBPACK_IMPORTED_MODULE_2__.fiberMountHelper.deepWalking.set(true);
        shadow = shadow ? shadow.nextSibling : null;
        var alternate = getNextSiblingAlternate(nextFiber);
        var hook = getHook({ shadow: shadow, alternate: alternate, instance: instance });
        var provider = shadow ? shadow.provider : alternate ? alternate.provider : null;
        var fiber = new Fiber({ hook: hook, provider: provider });
        _scope__WEBPACK_IMPORTED_MODULE_2__.componentFiberHelper.set(fiber);
        fiber.parent = nextFiber.parent;
        var _a = pertformInstance({
            instance: parent,
            idx: childrenIdx,
            fiber: fiber,
            alternate: alternate,
        }), performedInstance = _a.performedInstance, performedShadow = _a.performedShadow;
        instance = performedInstance || instance;
        shadow = performedShadow || shadow;
        alternate && mutateAlternate({ fiber: fiber, alternate: alternate, instance: instance });
        mutateFiber({ fiber: fiber, alternate: alternate, instance: instance });
        fiber = alternate ? performMemo({ fiber: fiber, alternate: alternate, instance: instance }) : fiber;
        fiber.parent = nextFiber.parent;
        nextFiber.nextSibling = fiber;
        fiber.shadow = shadow;
        nextFiber = fiber;
        _model__WEBPACK_IMPORTED_MODULE_7__.cloneTagMap[fiber.parent.effectTag] && (fiber.effectTag = fiber.parent.effectTag);
        return {
            performedFiber: nextFiber,
            performedNextFiber: nextFiber,
            performedShadow: shadow,
            performedInstance: instance,
        };
    }
    else {
        _scope__WEBPACK_IMPORTED_MODULE_2__.fiberMountHelper.jumpToParent();
        _scope__WEBPACK_IMPORTED_MODULE_2__.fiberMountHelper.deepWalking.set(false);
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
function getHook(options) {
    var shadow = options.shadow, alternate = options.alternate, instance = options.instance;
    if (shadow)
        return shadow.hook;
    if (alternate && getElementKey(alternate.instance) === getElementKey(instance)) {
        return alternate.hook;
    }
    return createHook();
}
function mutateFiber(options) {
    var fiber = options.fiber, alternate = options.alternate, instance = options.instance;
    var key = alternate ? getElementKey(alternate.instance) : null;
    var nextKey = alternate ? getElementKey(instance) : null;
    var isDifferentKeys = key !== nextKey;
    var isSameType = Boolean(alternate) && getInstanceType(alternate.instance) === getInstanceType(instance);
    var isUpdate = isSameType && !isDifferentKeys;
    fiber.instance = instance;
    fiber.alternate = alternate || null;
    fiber.nativeElement = isUpdate ? alternate.nativeElement : null;
    fiber.effectTag = isUpdate ? _model__WEBPACK_IMPORTED_MODULE_7__.EffectTag.UPDATE : _model__WEBPACK_IMPORTED_MODULE_7__.EffectTag.PLACEMENT;
    fiber.mountedToHost = fiber.nativeElement ? isUpdate : false;
    if (hasChildrenProp(fiber.instance)) {
        fiber.childrenCount = fiber.instance.children.length;
    }
    if (fiber.alternate) {
        fiber.alternate.shadow = null;
        fiber.alternate.alternate = null;
    }
    if (!fiber.nativeElement && (0,_view__WEBPACK_IMPORTED_MODULE_4__.detectIsVirtualNode)(fiber.instance)) {
        fiber.nativeElement = _global__WEBPACK_IMPORTED_MODULE_1__.platform.createNativeElement(fiber);
    }
}
function mutateAlternate(options) {
    var fiber = options.fiber, alternate = options.alternate, instance = options.instance;
    var alternateType = getInstanceType(alternate.instance);
    var elementType = getInstanceType(instance);
    var isSameType = elementType === alternateType;
    var prevKey = getElementKey(alternate.instance);
    var nextKey = getElementKey(instance);
    var isSameKeys = prevKey === nextKey;
    alternate.isUsed = true;
    if (!isSameType || !isSameKeys) {
        alternate.effectTag = _model__WEBPACK_IMPORTED_MODULE_7__.EffectTag.DELETION;
        _scope__WEBPACK_IMPORTED_MODULE_2__.deletionsHelper.get().push(alternate);
    }
    else if (hasChildrenProp(alternate.instance) && hasChildrenProp(instance)) {
        var prevElementsCount_1 = alternate.childrenCount;
        var nextElementsCount_1 = instance.children.length;
        var isRequestedKeys = prevElementsCount_1 !== nextElementsCount_1;
        if (isRequestedKeys) {
            var isRemovingCase = nextElementsCount_1 < prevElementsCount_1;
            var isInsertingCase = nextElementsCount_1 > prevElementsCount_1;
            var children = hasChildrenProp(instance) ? instance.children : [];
            var _a = extractKeys(alternate.child, children), keys_1 = _a.keys, nextKeys_1 = _a.nextKeys;
            var hasKeys_1 = keys_1.length > 0;
            var hasAnyKeys = hasKeys_1 || nextKeys_1.length > 0;
            if (true) {
                if (!hasAnyKeys && prevElementsCount_1 !== 0 && nextElementsCount_1 !== 0) {
                    (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.error)("\n            [Dark]: Operation of inserting, adding, replacing elements into list requires to have a unique key for every node (string or number, but not array index)!\n          ");
                }
            }
            var performRemovingNodes = function () {
                var e_1, _a, e_2, _b, _c;
                var diffKeys = getDiffKeys(keys_1, nextKeys_1);
                if (diffKeys.length > 0) {
                    var fibersMap = createFibersByKeyMap(alternate.child);
                    try {
                        for (var diffKeys_1 = __values(diffKeys), diffKeys_1_1 = diffKeys_1.next(); !diffKeys_1_1.done; diffKeys_1_1 = diffKeys_1.next()) {
                            var key = diffKeys_1_1.value;
                            var childAlternate = fibersMap[key] || null;
                            if (childAlternate) {
                                childAlternate.effectTag = _model__WEBPACK_IMPORTED_MODULE_7__.EffectTag.DELETION;
                                _scope__WEBPACK_IMPORTED_MODULE_2__.deletionsHelper.get().push(childAlternate);
                                if (childAlternate.effectHost) {
                                    fiber.markEffectHost();
                                }
                                if (childAlternate.portalHost) {
                                    fiber.markPortalHost();
                                }
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (diffKeys_1_1 && !diffKeys_1_1.done && (_a = diffKeys_1.return)) _a.call(diffKeys_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                else if (!hasKeys_1) {
                    var diffCount = prevElementsCount_1 - nextElementsCount_1;
                    var childAlternates = (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.takeListFromEnd)(getSiblingFibers(alternate.child), diffCount);
                    try {
                        for (var childAlternates_1 = __values(childAlternates), childAlternates_1_1 = childAlternates_1.next(); !childAlternates_1_1.done; childAlternates_1_1 = childAlternates_1.next()) {
                            var childAlternate = childAlternates_1_1.value;
                            childAlternate.effectTag = _model__WEBPACK_IMPORTED_MODULE_7__.EffectTag.DELETION;
                            if (childAlternate.effectHost) {
                                fiber.markEffectHost();
                            }
                            if (childAlternate.portalHost) {
                                fiber.markPortalHost();
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (childAlternates_1_1 && !childAlternates_1_1.done && (_b = childAlternates_1.return)) _b.call(childAlternates_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    (_c = _scope__WEBPACK_IMPORTED_MODULE_2__.deletionsHelper.get()).push.apply(_c, __spreadArray([], __read(childAlternates), false));
                }
            };
            var performInsertingNodes = function () {
                var e_3, _a;
                var diffKeys = getDiffKeys(nextKeys_1, keys_1);
                if (diffKeys.length > 0) {
                    var diffKeyMap = (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.keyBy)(diffKeys, function (x) { return x; });
                    var fibersByPositionsMap = createFibersByPositionMap(alternate.child);
                    var usedKeyMap = {};
                    var keyIdx = 0;
                    try {
                        for (var nextKeys_2 = __values(nextKeys_1), nextKeys_2_1 = nextKeys_2.next(); !nextKeys_2_1.done; nextKeys_2_1 = nextKeys_2.next()) {
                            var nextKey_1 = nextKeys_2_1.value;
                            if (true) {
                                if (usedKeyMap[nextKey_1]) {
                                    (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.error)("Some key of node already has been used!");
                                }
                            }
                            usedKeyMap[nextKey_1] = true;
                            if (nextKey_1 !== keys_1[keyIdx] && diffKeyMap[nextKey_1]) {
                                var insertionFiber = new Fiber({
                                    instance: (0,_view__WEBPACK_IMPORTED_MODULE_4__.createEmptyVirtualNode)(),
                                    parent: alternate,
                                    effectTag: _model__WEBPACK_IMPORTED_MODULE_7__.EffectTag.PLACEMENT,
                                });
                                if (keyIdx === 0) {
                                    insertionFiber.nextSibling = alternate.child;
                                    alternate.child = insertionFiber;
                                }
                                else {
                                    var fiber_1 = fibersByPositionsMap[keyIdx] || null;
                                    if (fiber_1) {
                                        insertionFiber.nextSibling = fiber_1;
                                    }
                                }
                            }
                            keyIdx++;
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (nextKeys_2_1 && !nextKeys_2_1.done && (_a = nextKeys_2.return)) _a.call(nextKeys_2);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                }
            };
            isRemovingCase && performRemovingNodes();
            isInsertingCase && performInsertingNodes();
        }
    }
}
function performMemo(options) {
    var fiber = options.fiber, alternate = options.alternate, instance = options.instance;
    if ((0,_memo__WEBPACK_IMPORTED_MODULE_5__.detectIsMemo)(fiber.instance)) {
        var memoFiber = null;
        var factory = instance;
        var alternateFactory = alternate.instance;
        if (factory.type !== alternateFactory.type)
            return fiber;
        var props = alternateFactory.props;
        var nextProps = factory.props;
        var skip = !factory.shouldUpdate(props, nextProps);
        if (skip) {
            var nextFiber = null;
            _scope__WEBPACK_IMPORTED_MODULE_2__.fiberMountHelper.deepWalking.set(false);
            memoFiber = new Fiber(__assign(__assign({}, alternate), { alternate: alternate, effectTag: _model__WEBPACK_IMPORTED_MODULE_7__.EffectTag.SKIP, nextSibling: alternate.nextSibling
                    ? alternate.nextSibling.effectTag === _model__WEBPACK_IMPORTED_MODULE_7__.EffectTag.DELETION
                        ? null
                        : alternate.nextSibling
                    : null }));
            alternate.alternate = null;
            nextFiber = memoFiber.child;
            while (nextFiber) {
                nextFiber.parent = memoFiber;
                nextFiber = nextFiber.nextSibling;
            }
            return memoFiber;
        }
    }
    return fiber;
}
function pertformInstance(options) {
    var _a;
    var instance = options.instance, idx = options.idx, fiber = options.fiber, alternate = options.alternate;
    var performedInstance = null;
    var performedShadow = null;
    if (hasChildrenProp(instance)) {
        var elements = (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsArray)(instance.children[idx])
            ? (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.flatten)([instance.children[idx]])
            : [instance.children[idx]];
        (_a = instance.children).splice.apply(_a, __spreadArray([idx, 1], __read(elements), false));
        performedInstance = instance.children[idx];
        performedShadow = alternate
            ? getRootShadow({
                instance: performedInstance,
                fiber: fiber,
                alternate: alternate,
            })
            : performedShadow;
        performedInstance = mountInstance(fiber, performedInstance);
    }
    if ((0,_component__WEBPACK_IMPORTED_MODULE_3__.detectIsComponentFactory)(performedInstance)) {
        if ((0,_use_effect__WEBPACK_IMPORTED_MODULE_8__.hasEffects)(fiber)) {
            fiber.markEffectHost();
        }
        if (_global__WEBPACK_IMPORTED_MODULE_1__.platform.detectIsPortal(performedInstance)) {
            fiber.markPortalHost();
        }
    }
    return {
        performedInstance: performedInstance,
        performedShadow: performedShadow,
    };
}
function getRootShadow(options) {
    var instance = options.instance, fiber = options.fiber, alternate = options.alternate;
    var key = getElementKey(alternate.instance);
    var nextKey = getElementKey(instance);
    var shadow = null;
    if (key !== nextKey) {
        shadow = getAlternateByKey(nextKey, alternate.parent.child);
        if (shadow) {
            fiber.hook = shadow.hook;
            fiber.provider = shadow.provider;
        }
    }
    return shadow;
}
function mountInstance(fiber, instance) {
    var isComponentFactory = (0,_component__WEBPACK_IMPORTED_MODULE_3__.detectIsComponentFactory)(instance);
    var factory = instance;
    if (isComponentFactory) {
        try {
            var result = factory.type(factory.props, factory.ref);
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
        for (var i = 0; i < instance.children.length; i++) {
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
function createFibersByPositionMap(fiber) {
    var nextFiber = fiber;
    var position = 0;
    var map = {};
    while (nextFiber) {
        map[position] = nextFiber;
        position++;
        nextFiber = nextFiber.nextSibling;
    }
    return map;
}
function createFibersByKeyMap(fiber) {
    var nextFiber = fiber;
    var map = {};
    while (nextFiber) {
        var key = getElementKey(nextFiber.instance);
        if (!(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsEmpty)(key)) {
            map[key] = nextFiber;
        }
        nextFiber = nextFiber.nextSibling;
    }
    return map;
}
function extractKeys(alternate, children) {
    var nextFiber = alternate;
    var idx = 0;
    var keys = [];
    var nextKeys = [];
    while (nextFiber || idx < children.length) {
        var key = nextFiber && getElementKey(nextFiber.instance);
        var nextKey = children[idx] && getElementKey(children[idx]);
        if (!(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsEmpty)(key)) {
            keys.push(key);
        }
        if (!(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsEmpty)(nextKey)) {
            nextKeys.push(nextKey);
        }
        nextFiber = nextFiber ? nextFiber.nextSibling : null;
        idx++;
    }
    return {
        keys: keys,
        nextKeys: nextKeys,
    };
}
function getAlternateByKey(key, fiber) {
    if ((0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsEmpty)(key))
        return null;
    var nextFiber = fiber;
    while (nextFiber) {
        if (key === getElementKey(nextFiber.instance)) {
            return nextFiber;
        }
        nextFiber = nextFiber.nextSibling;
    }
    return null;
}
function getElementKey(instance) {
    var key = (0,_component__WEBPACK_IMPORTED_MODULE_3__.detectIsComponentFactory)(instance)
        ? (0,_component__WEBPACK_IMPORTED_MODULE_3__.getComponentFactoryKey)(instance)
        : (0,_view__WEBPACK_IMPORTED_MODULE_4__.detectIsTagVirtualNode)(instance)
            ? (0,_view__WEBPACK_IMPORTED_MODULE_4__.getVirtualNodeKey)(instance)
            : null;
    return key;
}
function getDiffKeys(keys, nextKeys) {
    var e_4, _a;
    var nextKeysMap = nextKeys.reduce(function (acc, key) { return ((acc[key] = true), acc); }, {});
    var diff = [];
    try {
        for (var keys_2 = __values(keys), keys_2_1 = keys_2.next(); !keys_2_1.done; keys_2_1 = keys_2.next()) {
            var key = keys_2_1.value;
            if (!nextKeysMap[key]) {
                diff.push(key);
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (keys_2_1 && !keys_2_1.done && (_a = keys_2.return)) _a.call(keys_2);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return diff;
}
function getChildAlternate(fiber) {
    var alternate = fiber.alternate && fiber.alternate.effectTag !== _model__WEBPACK_IMPORTED_MODULE_7__.EffectTag.DELETION ? fiber.alternate.child : null;
    while (alternate && alternate.effectTag === _model__WEBPACK_IMPORTED_MODULE_7__.EffectTag.DELETION) {
        alternate = alternate.nextSibling;
    }
    return alternate;
}
function getNextSiblingAlternate(fiber) {
    var _a;
    var alternate = ((_a = fiber.alternate) === null || _a === void 0 ? void 0 : _a.nextSibling) || null;
    while (alternate && alternate.effectTag === _model__WEBPACK_IMPORTED_MODULE_7__.EffectTag.DELETION) {
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
    var list = [];
    var nextFiber = fiber;
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
    var e_5, _a;
    var _b, _c;
    var wipFiber = _scope__WEBPACK_IMPORTED_MODULE_2__.wipRootHelper.get();
    var fromHook = _scope__WEBPACK_IMPORTED_MODULE_2__.fromHookUpdateHelper.get();
    var deletions = _scope__WEBPACK_IMPORTED_MODULE_2__.deletionsHelper.get();
    var hasEffects = Boolean((_b = wipFiber.alternate) === null || _b === void 0 ? void 0 : _b.effectHost);
    var hasPortals = Boolean((_c = wipFiber.alternate) === null || _c === void 0 ? void 0 : _c.portalHost);
    if (hasEffects || hasPortals) {
        try {
            for (var deletions_1 = __values(deletions), deletions_1_1 = deletions_1.next(); !deletions_1_1.done; deletions_1_1 = deletions_1.next()) {
                var fiber = deletions_1_1.value;
                fiber.portalHost && _global__WEBPACK_IMPORTED_MODULE_1__.platform.unmountPortal(fiber);
                if (fiber.effectHost) {
                    walkFiber({
                        fiber: fiber,
                        onLoop: function (_a) {
                            var nextFiber = _a.nextFiber, isReturn = _a.isReturn;
                            if (!isReturn && (0,_component__WEBPACK_IMPORTED_MODULE_3__.detectIsComponentFactory)(nextFiber.instance)) {
                                (0,_use_effect__WEBPACK_IMPORTED_MODULE_8__.cleanupEffects)(nextFiber.hook);
                            }
                        },
                    });
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (deletions_1_1 && !deletions_1_1.done && (_a = deletions_1.return)) _a.call(deletions_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
    }
    commitWork(wipFiber.child, function () {
        var e_6, _a;
        var effects = _scope__WEBPACK_IMPORTED_MODULE_2__.effectsHelper.get();
        try {
            for (var deletions_2 = __values(deletions), deletions_2_1 = deletions_2.next(); !deletions_2_1.done; deletions_2_1 = deletions_2.next()) {
                var fiber = deletions_2_1.value;
                _global__WEBPACK_IMPORTED_MODULE_1__.platform.applyCommits(fiber);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (deletions_2_1 && !deletions_2_1.done && (_a = deletions_2.return)) _a.call(deletions_2);
            }
            finally { if (e_6) throw e_6.error; }
        }
        _scope__WEBPACK_IMPORTED_MODULE_2__.deletionsHelper.set([]);
        _scope__WEBPACK_IMPORTED_MODULE_2__.wipRootHelper.set(null);
        setTimeout(function () {
            var e_7, _a;
            try {
                for (var effects_1 = __values(effects), effects_1_1 = effects_1.next(); !effects_1_1.done; effects_1_1 = effects_1.next()) {
                    var effect = effects_1_1.value;
                    effect();
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (effects_1_1 && !effects_1_1.done && (_a = effects_1.return)) _a.call(effects_1);
                }
                finally { if (e_7) throw e_7.error; }
            }
        });
        _scope__WEBPACK_IMPORTED_MODULE_2__.effectsHelper.reset();
        if (fromHook) {
            _scope__WEBPACK_IMPORTED_MODULE_2__.fromHookUpdateHelper.set(false);
        }
        else {
            _scope__WEBPACK_IMPORTED_MODULE_2__.currentRootHelper.set(wipFiber);
        }
    });
}
function commitWork(fiber, onComplete) {
    walkFiber({
        fiber: fiber,
        onLoop: function (_a) {
            var nextFiber = _a.nextFiber, isReturn = _a.isReturn, resetIsDeepWalking = _a.resetIsDeepWalking;
            var skip = nextFiber.effectTag === _model__WEBPACK_IMPORTED_MODULE_7__.EffectTag.SKIP;
            if (skip) {
                resetIsDeepWalking();
            }
            else if (!isReturn) {
                _global__WEBPACK_IMPORTED_MODULE_1__.platform.applyCommits(nextFiber);
            }
            if (nextFiber && nextFiber.shadow) {
                nextFiber.shadow = null;
            }
        },
    });
    onComplete();
}
function walkFiber(options) {
    var fiber = options.fiber, onLoop = options.onLoop;
    var nextFiber = fiber;
    var isDeepWalking = true;
    var isReturn = false;
    var visitedMap = new Map();
    var detectCanVisit = function (fiber) { return !visitedMap.get(fiber); };
    while (nextFiber) {
        onLoop({
            nextFiber: nextFiber,
            isReturn: isReturn,
            resetIsDeepWalking: function () { return (isDeepWalking = false); },
        });
        if (nextFiber.child && isDeepWalking && detectCanVisit(nextFiber.child)) {
            var newFiber = nextFiber.child;
            isReturn = false;
            nextFiber = newFiber;
            visitedMap.set(newFiber, true);
        }
        else if (nextFiber.nextSibling && detectCanVisit(nextFiber.nextSibling)) {
            var newFiber = nextFiber.nextSibling;
            isDeepWalking = true;
            isReturn = false;
            nextFiber = newFiber;
            visitedMap.set(newFiber, true);
        }
        else if (nextFiber.parent &&
            nextFiber.parent === fiber &&
            nextFiber.parent.nextSibling &&
            detectCanVisit(nextFiber.parent.nextSibling)) {
            var newFiber = nextFiber.parent.nextSibling;
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
function createHook() {
    return {
        idx: 0,
        values: [],
    };
}
function createUpdateCallback(options) {
    var rootId = options.rootId, fiber = options.fiber, _a = options.forceStart, forceStart = _a === void 0 ? false : _a, onStart = options.onStart;
    var callback = function () {
        forceStart && onStart();
        if (fiber.isUsed)
            return;
        !forceStart && onStart();
        _scope__WEBPACK_IMPORTED_MODULE_2__.effectStoreHelper.set(rootId); // important order!
        _scope__WEBPACK_IMPORTED_MODULE_2__.fromHookUpdateHelper.set(true);
        _scope__WEBPACK_IMPORTED_MODULE_2__.fiberMountHelper.reset();
        fiber.alternate = new Fiber(__assign(__assign({}, fiber), { alternate: null }));
        fiber.marker = _constants__WEBPACK_IMPORTED_MODULE_6__.PARTIAL_UPDATE;
        fiber.effectTag = _model__WEBPACK_IMPORTED_MODULE_7__.EffectTag.UPDATE;
        fiber.child = null;
        _scope__WEBPACK_IMPORTED_MODULE_2__.wipRootHelper.set(fiber);
        _scope__WEBPACK_IMPORTED_MODULE_2__.componentFiberHelper.set(fiber);
        fiber.instance = mountInstance(fiber, fiber.instance);
        _scope__WEBPACK_IMPORTED_MODULE_2__.nextUnitOfWorkHelper.set(fiber);
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
/* harmony export */   "EffectTag": () => (/* reexport safe */ _model__WEBPACK_IMPORTED_MODULE_1__.EffectTag),
/* harmony export */   "Fiber": () => (/* reexport safe */ _fiber__WEBPACK_IMPORTED_MODULE_0__.Fiber),
/* harmony export */   "cloneTagMap": () => (/* reexport safe */ _model__WEBPACK_IMPORTED_MODULE_1__.cloneTagMap),
/* harmony export */   "createHook": () => (/* reexport safe */ _fiber__WEBPACK_IMPORTED_MODULE_0__.createHook),
/* harmony export */   "createUpdateCallback": () => (/* reexport safe */ _fiber__WEBPACK_IMPORTED_MODULE_0__.createUpdateCallback),
/* harmony export */   "hasChildrenProp": () => (/* reexport safe */ _fiber__WEBPACK_IMPORTED_MODULE_0__.hasChildrenProp),
/* harmony export */   "workLoop": () => (/* reexport safe */ _fiber__WEBPACK_IMPORTED_MODULE_0__.workLoop)
/* harmony export */ });
/* harmony import */ var _fiber__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fiber */ "./src/fiber/fiber.ts");
/* harmony import */ var _model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./model */ "./src/fiber/model.ts");




/***/ }),

/***/ "./src/fiber/model.ts":
/*!****************************!*\
  !*** ./src/fiber/model.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EffectTag": () => (/* binding */ EffectTag),
/* harmony export */   "cloneTagMap": () => (/* binding */ cloneTagMap)
/* harmony export */ });
var _a;
var EffectTag;
(function (EffectTag) {
    EffectTag["PLACEMENT"] = "PLACEMENT";
    EffectTag["UPDATE"] = "UPDATE";
    EffectTag["DELETION"] = "DELETION";
    EffectTag["SKIP"] = "SKIP";
})(EffectTag || (EffectTag = {}));
var cloneTagMap = (_a = {},
    _a[EffectTag.PLACEMENT] = true,
    _a[EffectTag.SKIP] = true,
    _a);


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

var $$fragment = Symbol('fragment');
var Fragment = (0,_component__WEBPACK_IMPORTED_MODULE_0__.createComponent)(function (_a) {
    var slot = _a.slot;
    return slot || null;
}, {
    token: $$fragment,
});
var detectIsFragment = function (factory) { return (0,_component__WEBPACK_IMPORTED_MODULE_0__.detectIsComponentFactory)(factory) && factory.token === $$fragment; };



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

/***/ "./src/global/global.ts":
/*!******************************!*\
  !*** ./src/global/global.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "platform": () => (/* binding */ platform)
/* harmony export */ });
var platform = {
    scheduleCallback: function () {
        throw new Error('scheduleCallback not installed by renderer');
    },
    shouldYeildToHost: function () {
        throw new Error('shouldYeildToHost not installed by renderer');
    },
    createNativeElement: function () {
        throw new Error('createNativeElement not installed by renderer');
    },
    applyCommits: function () {
        throw new Error('applyCommits not installed by renderer');
    },
    detectIsPortal: function () {
        throw new Error('detectIsPortal not installed by renderer');
    },
    unmountPortal: function () {
        throw new Error('unmountPortal not installed by renderer');
    },
};


/***/ }),

/***/ "./src/global/index.ts":
/*!*****************************!*\
  !*** ./src/global/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "platform": () => (/* reexport safe */ _global__WEBPACK_IMPORTED_MODULE_0__.platform)
/* harmony export */ });
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./global */ "./src/global/global.ts");
/* harmony import */ var _model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./model */ "./src/global/model.ts");




/***/ }),

/***/ "./src/global/model.ts":
/*!*****************************!*\
  !*** ./src/global/model.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



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
/* harmony export */   "getTime": () => (/* binding */ getTime),
/* harmony export */   "keyBy": () => (/* binding */ keyBy),
/* harmony export */   "takeListFromEnd": () => (/* binding */ takeListFromEnd)
/* harmony export */ });
var detectIsFunction = function (o) { return typeof o === 'function'; };
var detectIsUndefined = function (o) { return typeof o === 'undefined'; };
var detectIsNumber = function (o) { return typeof o === 'number'; };
var detectIsString = function (o) { return typeof o === 'string'; };
var detectIsObject = function (o) { return typeof o === 'object'; };
var detectIsBoolean = function (o) { return typeof o === 'boolean'; };
var detectIsArray = function (o) { return Array.isArray(o); };
var detectIsNull = function (o) { return o === null; };
var detectIsEmpty = function (o) { return detectIsNull(o) || detectIsUndefined(o); };
function error(str) {
    !detectIsUndefined(console) && console.error(str);
}
function flatten(source) {
    var list = [];
    var levelMap = { 0: { idx: 0, source: source } };
    var level = 0;
    do {
        var _a = levelMap[level], source_1 = _a.source, idx = _a.idx;
        var item = source_1[idx];
        if (idx >= source_1.length) {
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
function keyBy(list, fn, value) {
    if (value === void 0) { value = false; }
    return list.reduce(function (acc, x) { return ((acc[fn(x)] = value ? x : true), acc); }, {});
}
function takeListFromEnd(source, count) {
    return source.slice(source.length - count, source.length);
}
var dummyFn = function () { };
function detectIsDepsDifferent(deps, prevDeps) {
    if (!detectIsUndefined(deps) && !detectIsUndefined(prevDeps) && deps.length > 0 && prevDeps.length > 0) {
        for (var i = 0; i < prevDeps.length; i++) {
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
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};






var $$lazy = Symbol('lazy');
function lazy(dynamic) {
    return (0,_ref__WEBPACK_IMPORTED_MODULE_3__.forwardRef)((0,_component__WEBPACK_IMPORTED_MODULE_0__.createComponent)(function (props, ref) {
        var _a = (0,_use_context__WEBPACK_IMPORTED_MODULE_5__.useContext)(_suspense__WEBPACK_IMPORTED_MODULE_4__.SuspenseContext), fallback = _a.fallback, trigger = _a.trigger;
        var _b = __read((0,_use_state__WEBPACK_IMPORTED_MODULE_1__.useState)({
            component: null,
        }), 2), scope = _b[0], setScope = _b[1];
        (0,_use_effect__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function () {
            fetchModule(dynamic).then(function (component) {
                setScope({ component: component });
            });
        }, []);
        (0,_use_effect__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function () {
            if (!scope.component)
                return;
            trigger();
        }, [scope.component]);
        return scope.component ? scope.component(props, ref) : fallback;
    }, { token: $$lazy }));
}
var detectIsLazy = function (factory) { return (0,_component__WEBPACK_IMPORTED_MODULE_0__.detectIsComponentFactory)(factory) && factory.token === $$lazy; };
function fetchModule(dynamic) {
    return new Promise(function (resolve) {
        dynamic().then(function (module) {
            if (!module.default) {
                throw new Error('lazy loaded component should be exported as default!');
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
var __values = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};


var $$memo = Symbol('memo');
var defaultShouldUpdate = function (props, nextProps) {
    var e_1, _a;
    var keys = Object.keys(nextProps);
    try {
        for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
            var key = keys_1_1.value;
            if (key !== 'slot' && nextProps[key] !== props[key]) {
                return true;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return false;
};
var detectIsMemo = function (factory) { return (0,_component__WEBPACK_IMPORTED_MODULE_0__.detectIsComponentFactory)(factory) && factory.token === $$memo; };
function memo(component, shouldUpdate) {
    if (shouldUpdate === void 0) { shouldUpdate = defaultShouldUpdate; }
    return (0,_ref__WEBPACK_IMPORTED_MODULE_1__.forwardRef)((0,_component__WEBPACK_IMPORTED_MODULE_0__.createComponent)(function (props, ref) {
        ref && (props.ref = ref);
        return component(props);
    }, { token: $$memo, shouldUpdate: shouldUpdate }));
}



/***/ }),

/***/ "./src/ref/index.ts":
/*!**************************!*\
  !*** ./src/ref/index.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "detectIsRef": () => (/* reexport safe */ _ref__WEBPACK_IMPORTED_MODULE_0__.detectIsRef),
/* harmony export */   "forwardRef": () => (/* reexport safe */ _ref__WEBPACK_IMPORTED_MODULE_0__.forwardRef)
/* harmony export */ });
/* harmony import */ var _ref__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ref */ "./src/ref/ref.ts");



/***/ }),

/***/ "./src/ref/ref.ts":
/*!************************!*\
  !*** ./src/ref/ref.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "detectIsRef": () => (/* binding */ detectIsRef),
/* harmony export */   "forwardRef": () => (/* binding */ forwardRef)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ "./src/helpers/index.ts");
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};

function forwardRef(component) {
    return function (_a) {
        var ref = _a.ref, rest = __rest(_a, ["ref"]);
        return component(rest, ref);
    };
}
var detectIsRef = function (ref) {
    if (!(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsObject)(ref) || (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsNull)(ref))
        return false;
    var mutableRef = ref;
    for (var key in mutableRef) {
        if (key === 'current' && mutableRef.hasOwnProperty(key)) {
            return true;
        }
    }
    return false;
};



/***/ }),

/***/ "./src/scope/index.ts":
/*!****************************!*\
  !*** ./src/scope/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "componentFiberHelper": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_0__.componentFiberHelper),
/* harmony export */   "currentRootHelper": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_0__.currentRootHelper),
/* harmony export */   "deletionsHelper": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_0__.deletionsHelper),
/* harmony export */   "effectStoreHelper": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_0__.effectStoreHelper),
/* harmony export */   "effectsHelper": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_0__.effectsHelper),
/* harmony export */   "eventsHelper": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_0__.eventsHelper),
/* harmony export */   "fiberMountHelper": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_0__.fiberMountHelper),
/* harmony export */   "fromHookUpdateHelper": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_0__.fromHookUpdateHelper),
/* harmony export */   "getRootId": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_0__.getRootId),
/* harmony export */   "nextUnitOfWorkHelper": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_0__.nextUnitOfWorkHelper),
/* harmony export */   "wipRootHelper": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_0__.wipRootHelper)
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
/* harmony export */   "componentFiberHelper": () => (/* binding */ componentFiberHelper),
/* harmony export */   "currentRootHelper": () => (/* binding */ currentRootHelper),
/* harmony export */   "deletionsHelper": () => (/* binding */ deletionsHelper),
/* harmony export */   "effectStoreHelper": () => (/* binding */ effectStoreHelper),
/* harmony export */   "effectsHelper": () => (/* binding */ effectsHelper),
/* harmony export */   "eventsHelper": () => (/* binding */ eventsHelper),
/* harmony export */   "fiberMountHelper": () => (/* binding */ fiberMountHelper),
/* harmony export */   "fromHookUpdateHelper": () => (/* binding */ fromHookUpdateHelper),
/* harmony export */   "getRootId": () => (/* binding */ getRootId),
/* harmony export */   "nextUnitOfWorkHelper": () => (/* binding */ nextUnitOfWorkHelper),
/* harmony export */   "wipRootHelper": () => (/* binding */ wipRootHelper)
/* harmony export */ });
var Store = /** @class */ (function () {
    function Store() {
        this.wipRoot = null;
        this.currentRoot = null;
        this.nextUnitOfWork = null;
        this.fromHookUpdate = false;
        this.events = new Map();
        this.deletions = [];
        this.fiberMount = {
            level: 0,
            navigation: {},
            isDeepWalking: true,
        };
        this.componentFiber = null;
        this.effects = [];
    }
    return Store;
}());
var rootId = null;
var stores = new Map();
var effectStoreHelper = {
    set: function (id) { return effectStore(id); },
};
var getRootId = function () { return rootId; };
var effectStore = function (id) {
    rootId = id;
    !stores.get(rootId) && stores.set(rootId, new Store());
};
var storeHelper = {
    get: function (id) {
        if (id === void 0) { id = rootId; }
        return stores.get(id);
    },
};
var wipRootHelper = {
    get: function () { var _a; return ((_a = storeHelper.get()) === null || _a === void 0 ? void 0 : _a.wipRoot) || null; },
    set: function (fiber) { return (storeHelper.get().wipRoot = fiber); },
};
var currentRootHelper = {
    get: function () { var _a; return ((_a = storeHelper.get()) === null || _a === void 0 ? void 0 : _a.currentRoot) || null; },
    set: function (fiber) { return (storeHelper.get().currentRoot = fiber); },
};
var nextUnitOfWorkHelper = {
    get: function () { var _a; return ((_a = storeHelper.get()) === null || _a === void 0 ? void 0 : _a.nextUnitOfWork) || null; },
    set: function (fiber) { return (storeHelper.get().nextUnitOfWork = fiber); },
};
var componentFiberHelper = {
    get: function () { var _a; return (_a = storeHelper.get()) === null || _a === void 0 ? void 0 : _a.componentFiber; },
    set: function (fiber) { return (storeHelper.get().componentFiber = fiber); },
};
var fromHookUpdateHelper = {
    get: function () { var _a; return ((_a = storeHelper.get()) === null || _a === void 0 ? void 0 : _a.fromHookUpdate) || false; },
    set: function (value) { return (storeHelper.get().fromHookUpdate = value); },
};
var eventsHelper = {
    get: function () { return storeHelper.get().events; },
};
var deletionsHelper = {
    get: function () { return storeHelper.get().deletions; },
    set: function (deletions) { return (storeHelper.get().deletions = deletions); },
};
var fiberMountHelper = {
    reset: function () {
        storeHelper.get().fiberMount = {
            level: 0,
            navigation: {},
            isDeepWalking: true,
        };
    },
    getIndex: function () { return storeHelper.get().fiberMount.navigation[storeHelper.get().fiberMount.level]; },
    jumpToChild: function () {
        var fiberMount = storeHelper.get().fiberMount;
        var level = fiberMount.level;
        var nextLevel = level + 1;
        fiberMount.level = nextLevel;
        fiberMount.navigation[nextLevel] = 0;
    },
    jumpToParent: function () {
        var fiberMount = storeHelper.get().fiberMount;
        var level = fiberMount.level;
        var nextLevel = level - 1;
        fiberMount.navigation[level] = 0;
        fiberMount.level = nextLevel;
    },
    jumpToSibling: function () {
        var fiberMount = storeHelper.get().fiberMount;
        var level = fiberMount.level;
        var idx = fiberMount.navigation[level] + 1;
        fiberMount.navigation[level] = idx;
    },
    deepWalking: {
        get: function () { return storeHelper.get().fiberMount.isDeepWalking; },
        set: function (value) { return (storeHelper.get().fiberMount.isDeepWalking = value); },
    },
};
var effectsHelper = {
    get: function () { return storeHelper.get().effects; },
    reset: function () { return (storeHelper.get().effects = []); },
    add: function (effect) { return storeHelper.get().effects.push(effect); },
};



/***/ }),

/***/ "./src/shared/index.ts":
/*!*****************************!*\
  !*** ./src/shared/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./model */ "./src/shared/model.ts");



/***/ }),

/***/ "./src/shared/model.ts":
/*!*****************************!*\
  !*** ./src/shared/model.ts ***!
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
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};






var SuspenseContext = (0,_context__WEBPACK_IMPORTED_MODULE_2__.createContext)({
    fallback: null,
    isLoaded: true,
    trigger: function () { },
});
var Suspense = (0,_component__WEBPACK_IMPORTED_MODULE_0__.createComponent)(function (_a) {
    var fallback = _a.fallback, slot = _a.slot;
    if (!fallback) {
        throw new Error("Suspense fallback not found");
    }
    var isSuspenseLoaded = (0,_use_context__WEBPACK_IMPORTED_MODULE_3__.useContext)(SuspenseContext).isLoaded;
    var _b = __read((0,_use_state__WEBPACK_IMPORTED_MODULE_1__.useState)(false), 2), isLoaded = _b[0], setIsLoaded = _b[1];
    var trigger = (0,_use_callback__WEBPACK_IMPORTED_MODULE_5__.useCallback)(function () { return setIsLoaded(true); }, []);
    var value = (0,_use_memo__WEBPACK_IMPORTED_MODULE_4__.useMemo)(function () { return ({ fallback: fallback, isLoaded: isLoaded, trigger: trigger }); }, [fallback, isLoaded]);
    return SuspenseContext.Provider({
        value: value,
        slot: isSuspenseLoaded ? slot : null,
    });
});



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
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ "./src/helpers/index.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../scope */ "./src/scope/index.ts");


function useCallback(callback, deps) {
    var fiber = _scope__WEBPACK_IMPORTED_MODULE_1__.componentFiberHelper.get();
    var hook = fiber.hook;
    var idx = hook.idx, values = hook.values;
    if ((0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsUndefined)(values[idx])) {
        values[idx] = {
            deps: deps,
            value: callback,
        };
        hook.idx++;
        return callback;
    }
    var hookValue = values[idx];
    var prevDeps = hookValue.deps;
    var isDepsDifferent = (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsDepsDifferent)(deps, prevDeps);
    if (isDepsDifferent) {
        hookValue.deps = deps;
        hookValue.value = callback;
    }
    hook.idx++;
    return hookValue.value;
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
    var defaultValue = context.defaultValue;
    var fiber = _scope__WEBPACK_IMPORTED_MODULE_2__.componentFiberHelper.get();
    var provider = getProvider(context, fiber);
    var value = provider ? provider.value : defaultValue;
    var update = (0,_use_update__WEBPACK_IMPORTED_MODULE_3__.useUpdate)();
    var scope = (0,_use_memo__WEBPACK_IMPORTED_MODULE_1__.useMemo)(function () { return ({ prevValue: value }); }, []);
    var hasProvider = Boolean(provider);
    (0,_use_effect__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        if (!hasProvider)
            return;
        var subscriber = function (newValue) {
            if (!Object.is(scope.prevValue, newValue)) {
                update();
            }
        };
        provider.subscribers.push(subscriber);
        return function () {
            var idx = provider.subscribers.findIndex(function (x) { return x === subscriber; });
            if (idx !== -1) {
                provider.subscribers.splice(idx, 1);
            }
        };
    }, [hasProvider]);
    scope.prevValue = value;
    return value;
}
function getProvider(context, fiber) {
    var nextFiber = fiber;
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
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};



function useDeferredValue(value, options) {
    var timeoutMs = (options || {}).timeoutMs;
    var _a = __read((0,_use_state__WEBPACK_IMPORTED_MODULE_0__.useState)(value, {
        priority: _constants__WEBPACK_IMPORTED_MODULE_2__.TaskPriority.LOW,
        timeoutMs: timeoutMs,
    }), 2), deferredValue = _a[0], setDeferredValue = _a[1];
    (0,_use_effect__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
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
/* harmony export */   "cleanupEffects": () => (/* reexport safe */ _use_effect__WEBPACK_IMPORTED_MODULE_0__.cleanupEffects),
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
/* harmony export */   "cleanupEffects": () => (/* binding */ cleanupEffects),
/* harmony export */   "hasEffects": () => (/* binding */ hasEffects),
/* harmony export */   "useEffect": () => (/* binding */ useEffect)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers */ "./src/helpers/index.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../scope */ "./src/scope/index.ts");
var __values = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};


var $$useEffect = Symbol('use-effect');
function useEffect(effect, deps) {
    var fiber = _scope__WEBPACK_IMPORTED_MODULE_1__.componentFiberHelper.get();
    var hook = fiber.hook;
    var idx = hook.idx, values = hook.values;
    var runEffect = function () {
        values[idx] = {
            deps: deps,
            value: undefined,
            token: $$useEffect,
        };
        _scope__WEBPACK_IMPORTED_MODULE_1__.effectsHelper.add(function () {
            values[idx].value = effect();
        });
    };
    if ((0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsUndefined)(values[idx])) {
        runEffect();
    }
    else {
        var _a = values[idx], prevDeps = _a.deps, cleanup = _a.value;
        var isDepsDifferent = deps ? (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsDepsDifferent)(deps, prevDeps) : true;
        if (isDepsDifferent) {
            (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsFunction)(cleanup) && cleanup();
            runEffect();
        }
    }
    hook.idx++;
}
function hasEffects(fiber) {
    var values = fiber.hook.values;
    var hasEffect = values.some(function (x) { return x.token === $$useEffect; });
    return hasEffect;
}
function cleanupEffects(hook) {
    var e_1, _a;
    var values = hook.values;
    try {
        for (var values_1 = __values(values), values_1_1 = values_1.next(); !values_1_1.done; values_1_1 = values_1.next()) {
            var value = values_1_1.value;
            if (value.token === $$useEffect) {
                var cleanup = value.value;
                (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsFunction)(cleanup) && cleanup();
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (values_1_1 && !values_1_1.done && (_a = values_1.return)) _a.call(values_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
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
    var fiber = _scope__WEBPACK_IMPORTED_MODULE_0__.componentFiberHelper.get();
    var update = (0,_use_update__WEBPACK_IMPORTED_MODULE_2__.useUpdate)();
    var scope = (0,_use_memo__WEBPACK_IMPORTED_MODULE_3__.useMemo)(function () { return ({ error: null }); }, []);
    fiber.catchException = function (error) {
        scope.error = error;
        update();
    };
    (0,_use_effect__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        scope.error = null;
    }, [scope.error]);
    return scope.error;
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
    var current = (0,_use_memo__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () { return createHandle(); }, deps);
    ref.current = current;
}



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






var Memo = (0,_component__WEBPACK_IMPORTED_MODULE_1__.createComponent)(function (_a) {
    var slot = _a.slot;
    return slot;
}, { token: _memo__WEBPACK_IMPORTED_MODULE_5__.$$memo });
function wrap(value, isDepsDifferent) {
    var check = function (value) { return (0,_view__WEBPACK_IMPORTED_MODULE_2__.detectIsVirtualNodeFactory)(value) || (0,_component__WEBPACK_IMPORTED_MODULE_1__.detectIsComponentFactory)(value); };
    if ((0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsArray)(value) ? check(value[0]) : check(value)) {
        var slot = value;
        var factory = Memo({
            slot: (0,_fragment__WEBPACK_IMPORTED_MODULE_4__.Fragment)({ slot: slot }),
        });
        factory.shouldUpdate = function () { return isDepsDifferent; };
        return factory;
    }
    return value;
}
function processValue(getValue, isDepsDifferent) {
    if (isDepsDifferent === void 0) { isDepsDifferent = false; }
    return wrap(getValue(), isDepsDifferent);
}
function useMemo(getValue, deps) {
    var fiber = _scope__WEBPACK_IMPORTED_MODULE_3__.componentFiberHelper.get();
    var hook = fiber.hook;
    var idx = hook.idx, values = hook.values;
    if ((0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsUndefined)(values[idx])) {
        var value = processValue(getValue);
        values[idx] = {
            deps: deps,
            value: value,
        };
        hook.idx++;
        return value;
    }
    var hookValue = values[idx];
    var prevDeps = hookValue.deps;
    var isDepsDifferent = (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsDepsDifferent)(deps, prevDeps);
    var computedGetValue = isDepsDifferent ? getValue : function () { return hookValue.value; };
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
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};




function useReducer(reducer, initialState, initializer) {
    var initialValue = (0,_use_memo__WEBPACK_IMPORTED_MODULE_2__.useMemo)(function () {
        return (0,_helpers__WEBPACK_IMPORTED_MODULE_3__.detectIsFunction)(initializer) ? initializer(initialState) : initialState;
    }, []);
    var _a = __read((0,_use_state__WEBPACK_IMPORTED_MODULE_0__.useState)(initialValue), 2), state = _a[0], setState = _a[1];
    var dispatch = (0,_use_callback__WEBPACK_IMPORTED_MODULE_1__.useCallback)(function (action) { return setState(function (state) { return reducer(state, action); }); }, []);
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

function useRef(initialValue) {
    if (initialValue === void 0) { initialValue = null; }
    var ref = (0,_use_memo__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () { return ({ current: initialValue }); }, []);
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
    var fiber = _scope__WEBPACK_IMPORTED_MODULE_1__.componentFiberHelper.get();
    var update = (0,_use_update__WEBPACK_IMPORTED_MODULE_2__.useUpdate)(options);
    var scope = (0,_use_memo__WEBPACK_IMPORTED_MODULE_3__.useMemo)(function () { return ({
        idx: fiber.hook.idx,
        values: fiber.hook.values,
    }); }, []);
    var setState = (0,_use_callback__WEBPACK_IMPORTED_MODULE_4__.useCallback)(function (sourceValue) {
        var value = scope.values[scope.idx];
        var newValue = (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsFunction)(sourceValue) ? sourceValue(value) : sourceValue;
        if (!Object.is(value, newValue)) {
            var setValue_1 = function () {
                scope.values[scope.idx] = newValue;
            };
            if ((options === null || options === void 0 ? void 0 : options.priority) === _constants__WEBPACK_IMPORTED_MODULE_5__.TaskPriority.LOW) {
                update(function () { return setValue_1(); });
            }
            else {
                setValue_1();
                update();
            }
        }
    }, []);
    var hook = fiber.hook;
    var idx = hook.idx, values = hook.values;
    var value = !(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.detectIsUndefined)(values[idx]) ? values[idx] : initialValue;
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
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../global */ "./src/global/index.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../scope */ "./src/scope/index.ts");
/* harmony import */ var _fiber__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../fiber */ "./src/fiber/index.ts");
/* harmony import */ var _use_memo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../use-memo */ "./src/use-memo/index.ts");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../helpers */ "./src/helpers/index.ts");





function useUpdate(options) {
    var rootId = (0,_scope__WEBPACK_IMPORTED_MODULE_1__.getRootId)();
    var fiber = _scope__WEBPACK_IMPORTED_MODULE_1__.componentFiberHelper.get();
    var scope = (0,_use_memo__WEBPACK_IMPORTED_MODULE_3__.useMemo)(function () { return ({ fiber: fiber }); }, []);
    scope.fiber = fiber;
    var update = function (onStart) {
        var callback = (0,_fiber__WEBPACK_IMPORTED_MODULE_2__.createUpdateCallback)({
            rootId: rootId,
            fiber: scope.fiber,
            forceStart: Boolean(options === null || options === void 0 ? void 0 : options.timeoutMs),
            onStart: onStart || _helpers__WEBPACK_IMPORTED_MODULE_4__.dummyFn,
        });
        _global__WEBPACK_IMPORTED_MODULE_0__.platform.scheduleCallback(callback, options);
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
/* harmony export */   "NodeType": () => (/* reexport safe */ _model__WEBPACK_IMPORTED_MODULE_1__.NodeType),
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
/* harmony import */ var _model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./model */ "./src/view/model.ts");




/***/ }),

/***/ "./src/view/model.ts":
/*!***************************!*\
  !*** ./src/view/model.ts ***!
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
/* harmony import */ var _model__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./model */ "./src/view/model.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};



var $$virtualNode = Symbol('virtual-node');
var VirtualNode = /** @class */ (function () {
    function VirtualNode(options) {
        this.type = null;
        this.type = options.type;
    }
    return VirtualNode;
}());
var TagVirtualNode = /** @class */ (function (_super) {
    __extends(TagVirtualNode, _super);
    function TagVirtualNode(options) {
        var _this = _super.call(this, options) || this;
        _this.type = _model__WEBPACK_IMPORTED_MODULE_2__.NodeType.TAG;
        _this.name = null;
        _this.isVoid = false;
        _this.attrs = {};
        _this.children = [];
        _this.name = options.name || _this.name;
        _this.isVoid = options.isVoid || _this.isVoid;
        _this.attrs = options.attrs || _this.attrs;
        _this.children = options.children || _this.children;
        return _this;
    }
    return TagVirtualNode;
}(VirtualNode));
var TextVirtualNode = /** @class */ (function (_super) {
    __extends(TextVirtualNode, _super);
    function TextVirtualNode(text) {
        var _this = _super.call(this, {}) || this;
        _this.type = _model__WEBPACK_IMPORTED_MODULE_2__.NodeType.TEXT;
        _this.value = '';
        _this.value = text;
        return _this;
    }
    return TextVirtualNode;
}(VirtualNode));
var CommentVirtualNode = /** @class */ (function (_super) {
    __extends(CommentVirtualNode, _super);
    function CommentVirtualNode(text) {
        var _this = _super.call(this, {}) || this;
        _this.type = _model__WEBPACK_IMPORTED_MODULE_2__.NodeType.COMMENT;
        _this.value = '';
        _this.value = text;
        return _this;
    }
    return CommentVirtualNode;
}(VirtualNode));
var detectIsVirtualNode = function (vNode) { return vNode instanceof VirtualNode; };
var detectIsTagVirtualNode = function (vNode) { return vNode instanceof TagVirtualNode; };
var detectIsCommentVirtualNode = function (vNode) { return vNode instanceof CommentVirtualNode; };
var detectIsTextVirtualNode = function (vNode) { return vNode instanceof TextVirtualNode; };
var detectIsEmptyVirtualNode = function (vNode) {
    return detectIsCommentVirtualNode(vNode) && vNode.value === _constants__WEBPACK_IMPORTED_MODULE_0__.EMPTY_NODE;
};
function getVirtualNodeKey(vNode) {
    var key = vNode && vNode.attrs[_constants__WEBPACK_IMPORTED_MODULE_0__.ATTR_KEY];
    return !(0,_helpers__WEBPACK_IMPORTED_MODULE_1__.detectIsEmpty)(key) ? key : null;
}
function Text(source) {
    var text = typeof source === 'string' ? new TextVirtualNode(source) : detectIsTextVirtualNode(source) ? source.value : '';
    return text;
}
function Comment(text) {
    var factory = function () { return new CommentVirtualNode(text); };
    factory[$$virtualNode] = true;
    return factory;
}
function View(def) {
    var factory = function () {
        var as = def.as, slot = def.slot, _a = def.isVoid, isVoid = _a === void 0 ? false : _a, rest = __rest(def, ["as", "slot", "isVoid"]);
        var children = isVoid ? [] : (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.detectIsArray)(slot) ? slot : slot ? [slot] : [];
        return new TagVirtualNode({
            name: as,
            isVoid: isVoid,
            attrs: __assign({}, rest),
            children: children,
        });
    };
    factory[$$virtualNode] = true;
    return factory;
}
var createEmptyVirtualNode = function () { return new CommentVirtualNode(_constants__WEBPACK_IMPORTED_MODULE_0__.EMPTY_NODE); };
var detectIsVirtualNodeFactory = function (factory) {
    return (0,_helpers__WEBPACK_IMPORTED_MODULE_1__.detectIsFunction)(factory) && factory[$$virtualNode] === true;
};



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
/* harmony export */   "ATTR_KEY": () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_25__.ATTR_KEY),
/* harmony export */   "ATTR_REF": () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_25__.ATTR_REF),
/* harmony export */   "Comment": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_24__.Comment),
/* harmony export */   "CommentVirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_24__.CommentVirtualNode),
/* harmony export */   "ComponentFactory": () => (/* reexport safe */ _component__WEBPACK_IMPORTED_MODULE_0__.ComponentFactory),
/* harmony export */   "EMPTY_NODE": () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_25__.EMPTY_NODE),
/* harmony export */   "EffectTag": () => (/* reexport safe */ _fiber__WEBPACK_IMPORTED_MODULE_3__.EffectTag),
/* harmony export */   "Fiber": () => (/* reexport safe */ _fiber__WEBPACK_IMPORTED_MODULE_3__.Fiber),
/* harmony export */   "Fragment": () => (/* reexport safe */ _fragment__WEBPACK_IMPORTED_MODULE_4__.Fragment),
/* harmony export */   "NodeType": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_24__.NodeType),
/* harmony export */   "PARTIAL_UPDATE": () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_25__.PARTIAL_UPDATE),
/* harmony export */   "ROOT": () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_25__.ROOT),
/* harmony export */   "Suspense": () => (/* reexport safe */ _suspense__WEBPACK_IMPORTED_MODULE_12__.Suspense),
/* harmony export */   "SuspenseContext": () => (/* reexport safe */ _suspense__WEBPACK_IMPORTED_MODULE_12__.SuspenseContext),
/* harmony export */   "TagVirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_24__.TagVirtualNode),
/* harmony export */   "TaskPriority": () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_25__.TaskPriority),
/* harmony export */   "Text": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_24__.Text),
/* harmony export */   "TextVirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_24__.TextVirtualNode),
/* harmony export */   "View": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_24__.View),
/* harmony export */   "VirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_24__.VirtualNode),
/* harmony export */   "cleanupEffects": () => (/* reexport safe */ _use_effect__WEBPACK_IMPORTED_MODULE_16__.cleanupEffects),
/* harmony export */   "cloneTagMap": () => (/* reexport safe */ _fiber__WEBPACK_IMPORTED_MODULE_3__.cloneTagMap),
/* harmony export */   "componentFiberHelper": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_10__.componentFiberHelper),
/* harmony export */   "createComponent": () => (/* reexport safe */ _component__WEBPACK_IMPORTED_MODULE_0__.createComponent),
/* harmony export */   "createContext": () => (/* reexport safe */ _context__WEBPACK_IMPORTED_MODULE_1__.createContext),
/* harmony export */   "createEmptyVirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_24__.createEmptyVirtualNode),
/* harmony export */   "createHook": () => (/* reexport safe */ _fiber__WEBPACK_IMPORTED_MODULE_3__.createHook),
/* harmony export */   "createUpdateCallback": () => (/* reexport safe */ _fiber__WEBPACK_IMPORTED_MODULE_3__.createUpdateCallback),
/* harmony export */   "currentRootHelper": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_10__.currentRootHelper),
/* harmony export */   "deletionsHelper": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_10__.deletionsHelper),
/* harmony export */   "detectIsArray": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.detectIsArray),
/* harmony export */   "detectIsBoolean": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.detectIsBoolean),
/* harmony export */   "detectIsCommentVirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_24__.detectIsCommentVirtualNode),
/* harmony export */   "detectIsComponentFactory": () => (/* reexport safe */ _component__WEBPACK_IMPORTED_MODULE_0__.detectIsComponentFactory),
/* harmony export */   "detectIsDepsDifferent": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.detectIsDepsDifferent),
/* harmony export */   "detectIsEmpty": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.detectIsEmpty),
/* harmony export */   "detectIsEmptyVirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_24__.detectIsEmptyVirtualNode),
/* harmony export */   "detectIsFragment": () => (/* reexport safe */ _fragment__WEBPACK_IMPORTED_MODULE_4__.detectIsFragment),
/* harmony export */   "detectIsFunction": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.detectIsFunction),
/* harmony export */   "detectIsLazy": () => (/* reexport safe */ _lazy__WEBPACK_IMPORTED_MODULE_7__.detectIsLazy),
/* harmony export */   "detectIsMemo": () => (/* reexport safe */ _memo__WEBPACK_IMPORTED_MODULE_8__.detectIsMemo),
/* harmony export */   "detectIsNull": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.detectIsNull),
/* harmony export */   "detectIsNumber": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.detectIsNumber),
/* harmony export */   "detectIsObject": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.detectIsObject),
/* harmony export */   "detectIsRef": () => (/* reexport safe */ _ref__WEBPACK_IMPORTED_MODULE_9__.detectIsRef),
/* harmony export */   "detectIsString": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.detectIsString),
/* harmony export */   "detectIsTagVirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_24__.detectIsTagVirtualNode),
/* harmony export */   "detectIsTextVirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_24__.detectIsTextVirtualNode),
/* harmony export */   "detectIsUndefined": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.detectIsUndefined),
/* harmony export */   "detectIsVirtualNode": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_24__.detectIsVirtualNode),
/* harmony export */   "detectIsVirtualNodeFactory": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_24__.detectIsVirtualNodeFactory),
/* harmony export */   "dummyFn": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.dummyFn),
/* harmony export */   "effectStoreHelper": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_10__.effectStoreHelper),
/* harmony export */   "effectsHelper": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_10__.effectsHelper),
/* harmony export */   "error": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.error),
/* harmony export */   "eventsHelper": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_10__.eventsHelper),
/* harmony export */   "fiberMountHelper": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_10__.fiberMountHelper),
/* harmony export */   "flatten": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.flatten),
/* harmony export */   "forwardRef": () => (/* reexport safe */ _ref__WEBPACK_IMPORTED_MODULE_9__.forwardRef),
/* harmony export */   "fromHookUpdateHelper": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_10__.fromHookUpdateHelper),
/* harmony export */   "getComponentFactoryKey": () => (/* reexport safe */ _component__WEBPACK_IMPORTED_MODULE_0__.getComponentFactoryKey),
/* harmony export */   "getRootId": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_10__.getRootId),
/* harmony export */   "getTime": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.getTime),
/* harmony export */   "getVirtualNodeKey": () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_24__.getVirtualNodeKey),
/* harmony export */   "h": () => (/* reexport safe */ _element__WEBPACK_IMPORTED_MODULE_2__.createElement),
/* harmony export */   "hasChildrenProp": () => (/* reexport safe */ _fiber__WEBPACK_IMPORTED_MODULE_3__.hasChildrenProp),
/* harmony export */   "hasEffects": () => (/* reexport safe */ _use_effect__WEBPACK_IMPORTED_MODULE_16__.hasEffects),
/* harmony export */   "keyBy": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.keyBy),
/* harmony export */   "lazy": () => (/* reexport safe */ _lazy__WEBPACK_IMPORTED_MODULE_7__.lazy),
/* harmony export */   "memo": () => (/* reexport safe */ _memo__WEBPACK_IMPORTED_MODULE_8__.memo),
/* harmony export */   "nextUnitOfWorkHelper": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_10__.nextUnitOfWorkHelper),
/* harmony export */   "platform": () => (/* reexport safe */ _global__WEBPACK_IMPORTED_MODULE_5__.platform),
/* harmony export */   "takeListFromEnd": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_6__.takeListFromEnd),
/* harmony export */   "useCallback": () => (/* reexport safe */ _use_callback__WEBPACK_IMPORTED_MODULE_13__.useCallback),
/* harmony export */   "useContext": () => (/* reexport safe */ _use_context__WEBPACK_IMPORTED_MODULE_14__.useContext),
/* harmony export */   "useDeferredValue": () => (/* reexport safe */ _use_deferred_value__WEBPACK_IMPORTED_MODULE_15__.useDeferredValue),
/* harmony export */   "useEffect": () => (/* reexport safe */ _use_effect__WEBPACK_IMPORTED_MODULE_16__.useEffect),
/* harmony export */   "useError": () => (/* reexport safe */ _use_error__WEBPACK_IMPORTED_MODULE_17__.useError),
/* harmony export */   "useImperativeHandle": () => (/* reexport safe */ _use_imperative_handle__WEBPACK_IMPORTED_MODULE_18__.useImperativeHandle),
/* harmony export */   "useMemo": () => (/* reexport safe */ _use_memo__WEBPACK_IMPORTED_MODULE_19__.useMemo),
/* harmony export */   "useReducer": () => (/* reexport safe */ _use_reducer__WEBPACK_IMPORTED_MODULE_20__.useReducer),
/* harmony export */   "useRef": () => (/* reexport safe */ _use_ref__WEBPACK_IMPORTED_MODULE_21__.useRef),
/* harmony export */   "useState": () => (/* reexport safe */ _use_state__WEBPACK_IMPORTED_MODULE_22__.useState),
/* harmony export */   "useUpdate": () => (/* reexport safe */ _use_update__WEBPACK_IMPORTED_MODULE_23__.useUpdate),
/* harmony export */   "wipRootHelper": () => (/* reexport safe */ _scope__WEBPACK_IMPORTED_MODULE_10__.wipRootHelper),
/* harmony export */   "workLoop": () => (/* reexport safe */ _fiber__WEBPACK_IMPORTED_MODULE_3__.workLoop)
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./src/component/index.ts");
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./context */ "./src/context/index.ts");
/* harmony import */ var _element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./element */ "./src/element/index.ts");
/* harmony import */ var _fiber__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./fiber */ "./src/fiber/index.ts");
/* harmony import */ var _fragment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./fragment */ "./src/fragment/index.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./global */ "./src/global/index.ts");
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
/* harmony import */ var _use_imperative_handle__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./use-imperative-handle */ "./src/use-imperative-handle/index.ts");
/* harmony import */ var _use_memo__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./use-memo */ "./src/use-memo/index.ts");
/* harmony import */ var _use_reducer__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./use-reducer */ "./src/use-reducer/index.ts");
/* harmony import */ var _use_ref__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./use-ref */ "./src/use-ref/index.ts");
/* harmony import */ var _use_state__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./use-state */ "./src/use-state/index.ts");
/* harmony import */ var _use_update__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./use-update */ "./src/use-update/index.ts");
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./view */ "./src/view/index.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./constants */ "./src/constants.ts");



























})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=dark-core.development.js.map