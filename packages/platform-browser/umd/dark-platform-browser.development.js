(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@dark-engine/core"));
	else if(typeof define === 'function' && define.amd)
		define("DarkPlatformBrowser", ["@dark-engine/core"], factory);
	else if(typeof exports === 'object')
		exports["DarkPlatformBrowser"] = factory(require("@dark-engine/core"));
	else
		root["DarkPlatformBrowser"] = factory(root["DarkCore"]);
})(self, (__WEBPACK_EXTERNAL_MODULE__dark_engine_core__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/create-root/create-root.tsx":
/*!*****************************************!*\
  !*** ./src/create-root/create-root.tsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createRoot": () => (/* binding */ createRoot)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dark-engine/core */ "@dark-engine/core");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../render */ "./src/render/index.ts");


function createRoot(container) {
    return {
        render: (element) => (0,_render__WEBPACK_IMPORTED_MODULE_1__.render)(element, container),
        unmount: () => {
            const rootId = _render__WEBPACK_IMPORTED_MODULE_1__.roots.get(container);
            (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.unmountRoot)(rootId, () => {
                _render__WEBPACK_IMPORTED_MODULE_1__.roots["delete"](container);
                container.innerHTML = '';
            });
        },
    };
}



/***/ }),

/***/ "./src/create-root/index.ts":
/*!**********************************!*\
  !*** ./src/create-root/index.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createRoot": () => (/* reexport safe */ _create_root__WEBPACK_IMPORTED_MODULE_0__.createRoot)
/* harmony export */ });
/* harmony import */ var _create_root__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./create-root */ "./src/create-root/create-root.tsx");



/***/ }),

/***/ "./src/dom/dom.ts":
/*!************************!*\
  !*** ./src/dom/dom.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "applyCommit": () => (/* binding */ applyCommit),
/* harmony export */   "createNativeElement": () => (/* binding */ createNativeElement),
/* harmony export */   "finishCommitWork": () => (/* binding */ finishCommitWork),
/* harmony export */   "setTrackUpdate": () => (/* binding */ setTrackUpdate)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dark-engine/core */ "@dark-engine/core");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _portal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../portal */ "./src/portal/index.ts");
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../events */ "./src/events/index.ts");



const attrBlackListMap = {
    [_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.ATTR_KEY]: true,
    [_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.ATTR_REF]: true,
    void: true,
};
let fragmentsMap = new Map();
let trackUpdate = null;
function createNativeElement(vNode) {
    const map = {
        [_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.NodeType.TAG]: (vNode) => {
            const tagNode = vNode;
            const node = detectIsSvgElement(tagNode.name)
                ? document.createElementNS('http://www.w3.org/2000/svg', tagNode.name)
                : document.createElement(tagNode.name);
            return node;
        },
        [_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.NodeType.TEXT]: (vNode) => {
            const textNode = vNode;
            const node = document.createTextNode(textNode.value);
            return node;
        },
        [_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.NodeType.COMMENT]: (vNode) => {
            const commentNode = vNode;
            const node = document.createComment(commentNode.value);
            return node;
        },
    };
    return map[vNode.type](vNode);
}
function detectIsSvgElement(tagName) {
    const tagMap = {
        svg: true,
        circle: true,
        ellipse: true,
        g: true,
        text: true,
        tspan: true,
        textPath: true,
        path: true,
        polygon: true,
        polyline: true,
        line: true,
        rect: true,
        use: true,
        image: true,
        symbol: true,
        defs: true,
        linearGradient: true,
        radialGradient: true,
        stop: true,
        clipPath: true,
        pattern: true,
        mask: true,
        marker: true,
    };
    return Boolean(tagMap[tagName]);
}
function applyRef(ref, element) {
    if ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsFunction)(ref)) {
        ref(element);
    }
    else if ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsMutableRef)(ref)) {
        ref.current = element;
    }
}
function addAttributes(element, vNode) {
    if (!(0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsTagVirtualNode)(vNode))
        return;
    const attrNames = Object.keys(vNode.attrs);
    for (const attrName of attrNames) {
        const attrValue = vNode.attrs[attrName];
        if (attrName === _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.ATTR_REF) {
            applyRef(attrValue, element);
            continue;
        }
        if ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsFunction)(attrValue)) {
            if ((0,_events__WEBPACK_IMPORTED_MODULE_2__.detectIsEvent)(attrName)) {
                (0,_events__WEBPACK_IMPORTED_MODULE_2__.delegateEvent)({
                    target: element,
                    handler: attrValue,
                    eventName: (0,_events__WEBPACK_IMPORTED_MODULE_2__.getEventName)(attrName),
                });
            }
        }
        else if (!(0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsUndefined)(attrValue) && !attrBlackListMap[attrName]) {
            const stopAttrsMap = upgradeInputAttributes({
                tagName: vNode.name,
                value: attrValue,
                attrName,
                element,
            });
            !stopAttrsMap[attrName] && element.setAttribute(attrName, attrValue);
        }
    }
}
function updateAttributes(element, vNode, nextVNode) {
    const attrNames = new Set([...Object.keys(vNode.attrs), ...Object.keys(nextVNode.attrs)]);
    for (const attrName of attrNames) {
        const prevAttrValue = vNode.attrs[attrName];
        const nextAttrValue = nextVNode.attrs[attrName];
        if (attrName === _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.ATTR_REF) {
            applyRef(prevAttrValue, element);
            continue;
        }
        if (!(0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsUndefined)(nextAttrValue)) {
            if ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsFunction)(prevAttrValue)) {
                if ((0,_events__WEBPACK_IMPORTED_MODULE_2__.detectIsEvent)(attrName) && prevAttrValue !== nextAttrValue) {
                    (0,_events__WEBPACK_IMPORTED_MODULE_2__.delegateEvent)({
                        target: element,
                        handler: nextAttrValue,
                        eventName: (0,_events__WEBPACK_IMPORTED_MODULE_2__.getEventName)(attrName),
                    });
                }
            }
            else if (!attrBlackListMap[attrName] && prevAttrValue !== nextAttrValue) {
                const stopAttrsMap = upgradeInputAttributes({
                    tagName: nextVNode.name,
                    value: nextAttrValue,
                    attrName,
                    element,
                });
                !stopAttrsMap[attrName] && element.setAttribute(attrName, nextAttrValue);
            }
        }
        else {
            element.removeAttribute(attrName);
        }
    }
}
const INPUT_STOP_ATTRS_MAP = {
    value: true,
    checked: true,
};
const TEXTAREA_STOP_ATTRS_MAP = {
    value: true,
};
const OPTIONS_STOP_ATTRS_MAP = {
    selected: true,
};
const DEFAULT_STOP_ATTRS_MAP = {};
function upgradeInputAttributes(options) {
    const { tagName, element, attrName, value } = options;
    const map = {
        input: () => {
            if (INPUT_STOP_ATTRS_MAP[attrName]) {
                element[attrName] = value;
            }
            return INPUT_STOP_ATTRS_MAP;
        },
        textarea: () => {
            if (TEXTAREA_STOP_ATTRS_MAP[attrName]) {
                element[attrName] = value;
            }
            return TEXTAREA_STOP_ATTRS_MAP;
        },
        option: () => {
            if (OPTIONS_STOP_ATTRS_MAP[attrName]) {
                element[attrName] = value;
            }
            return OPTIONS_STOP_ATTRS_MAP;
        },
    };
    return map[tagName] ? map[tagName]() : DEFAULT_STOP_ATTRS_MAP;
}
function getParentFiberWithNativeElement(fiber) {
    let nextFiber = fiber;
    while (nextFiber) {
        nextFiber = nextFiber.parent;
        if ((0,_portal__WEBPACK_IMPORTED_MODULE_1__.detectIsPortal)(nextFiber.instance)) {
            nextFiber.nativeElement = (0,_portal__WEBPACK_IMPORTED_MODULE_1__.getPortalContainer)(nextFiber.instance);
        }
        if (nextFiber.nativeElement)
            return nextFiber;
    }
    return nextFiber;
}
function getNodeOnTheRight(fiber, parentElement) {
    let node = null;
    (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.walkFiber)({
        fiber,
        onLoop: ({ nextFiber, stop, resetIsDeepWalking }) => {
            if (nextFiber.nativeElement && nextFiber.nativeElement.parentElement === parentElement) {
                node = nextFiber.nativeElement;
                return stop();
            }
            if (!nextFiber.mountedToHost) {
                return resetIsDeepWalking();
            }
        },
    });
    return node;
}
function getChildIndex(fiber, parentNativeElement) {
    var _a;
    let nextFiber = fiber;
    while (nextFiber) {
        if (((_a = nextFiber === null || nextFiber === void 0 ? void 0 : nextFiber.parent) === null || _a === void 0 ? void 0 : _a.nativeElement) === parentNativeElement) {
            return nextFiber.idx;
        }
        nextFiber = nextFiber.parent;
    }
    return -1;
}
function commitCreation(fiber) {
    const parentFiber = getParentFiberWithNativeElement(fiber);
    const parentNativeElement = parentFiber.nativeElement;
    const childNodes = parentNativeElement.childNodes;
    const append = () => {
        const { fragment } = fragmentsMap.get(parentNativeElement) ||
            {
                fragment: document.createDocumentFragment(),
                callback: () => { },
            };
        fragmentsMap.set(parentNativeElement, {
            fragment,
            callback: () => {
                parentNativeElement.appendChild(fragment);
            },
        });
        fragment.appendChild(fiber.nativeElement);
        fiber.markMountedToHost();
    };
    const insert = () => {
        parentNativeElement.insertBefore(fiber.nativeElement, getNodeOnTheRight(fiber, parentNativeElement));
        fiber.markMountedToHost();
    };
    if (childNodes.length === 0 || getChildIndex(fiber, parentNativeElement) > childNodes.length - 1) {
        append();
    }
    else {
        insert();
    }
    addAttributes(fiber.nativeElement, fiber.instance);
}
function commitUpdate(nativeElement, instance, nextInstance) {
    if ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsTextVirtualNode)(instance) &&
        (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsTextVirtualNode)(nextInstance) &&
        instance.value !== nextInstance.value) {
        return (nativeElement.textContent = nextInstance.value);
    }
    if ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsTagVirtualNode)(instance) && (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsTagVirtualNode)(nextInstance)) {
        return updateAttributes(nativeElement, instance, nextInstance);
    }
}
function commitDeletion(fiber) {
    const parentFiber = getParentFiberWithNativeElement(fiber);
    (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.walkFiber)({
        fiber,
        onLoop: ({ nextFiber, isReturn, resetIsDeepWalking, stop }) => {
            if (nextFiber === fiber.nextSibling || nextFiber === fiber.parent) {
                return stop();
            }
            if (!isReturn && nextFiber.nativeElement) {
                !(0,_portal__WEBPACK_IMPORTED_MODULE_1__.detectIsPortal)(nextFiber.instance) && parentFiber.nativeElement.removeChild(nextFiber.nativeElement);
                return resetIsDeepWalking();
            }
        },
    });
}
function applyCommit(fiber) {
    const map = {
        [_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.EffectTag.CREATE]: () => {
            if (fiber.nativeElement === null)
                return;
            trackUpdate && trackUpdate(fiber.nativeElement);
            commitCreation(fiber);
        },
        [_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.EffectTag.UPDATE]: () => {
            if (fiber.nativeElement === null ||
                !(0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsVirtualNode)(fiber.alternate.instance) ||
                !(0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsVirtualNode)(fiber.instance)) {
                return;
            }
            trackUpdate && trackUpdate(fiber.nativeElement);
            commitUpdate(fiber.nativeElement, fiber.alternate.instance, fiber.instance);
        },
        [_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.EffectTag.DELETE]: () => commitDeletion(fiber),
        [_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.EffectTag.SKIP]: () => { },
    };
    map[fiber.effectTag]();
}
function finishCommitWork() {
    for (const { callback } of fragmentsMap.values()) {
        callback();
    }
    fragmentsMap = new Map();
}
function setTrackUpdate(fn) {
    trackUpdate = fn;
}



/***/ }),

/***/ "./src/dom/index.ts":
/*!**************************!*\
  !*** ./src/dom/index.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "applyCommit": () => (/* reexport safe */ _dom__WEBPACK_IMPORTED_MODULE_0__.applyCommit),
/* harmony export */   "createNativeElement": () => (/* reexport safe */ _dom__WEBPACK_IMPORTED_MODULE_0__.createNativeElement),
/* harmony export */   "finishCommitWork": () => (/* reexport safe */ _dom__WEBPACK_IMPORTED_MODULE_0__.finishCommitWork),
/* harmony export */   "setTrackUpdate": () => (/* reexport safe */ _dom__WEBPACK_IMPORTED_MODULE_0__.setTrackUpdate)
/* harmony export */ });
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom */ "./src/dom/dom.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ "./src/dom/types.ts");




/***/ }),

/***/ "./src/dom/types.ts":
/*!**************************!*\
  !*** ./src/dom/types.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "./src/events/events.ts":
/*!******************************!*\
  !*** ./src/events/events.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SyntheticEvent": () => (/* binding */ SyntheticEvent),
/* harmony export */   "delegateEvent": () => (/* binding */ delegateEvent),
/* harmony export */   "detectIsEvent": () => (/* binding */ detectIsEvent),
/* harmony export */   "getEventName": () => (/* binding */ getEventName)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dark-engine/core */ "@dark-engine/core");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__);

class SyntheticEvent {
    constructor(options) {
        this.type = '';
        this.sourceEvent = null;
        this.target = null;
        this.propagation = true;
        this.type = options.sourceEvent.type;
        this.sourceEvent = options.sourceEvent;
        this.target = options.target;
    }
    stopPropagation() {
        this.propagation = false;
        this.sourceEvent.stopPropagation();
    }
    preventDefault() {
        this.sourceEvent.preventDefault();
    }
    getPropagation() {
        return this.propagation;
    }
}
function delegateEvent(options) {
    const { target, eventName, handler } = options;
    const eventsMap = _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.eventsStore.get();
    const handlerMap = eventsMap.get(eventName);
    if (!handlerMap) {
        const rootHandler = (event) => {
            const fireEvent = eventsMap.get(eventName).get(event.target);
            const target = event.target;
            let syntheticEvent = null;
            if ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsFunction)(fireEvent)) {
                syntheticEvent = new SyntheticEvent({
                    sourceEvent: event,
                    target,
                });
                fireEvent(syntheticEvent);
            }
            if (syntheticEvent ? syntheticEvent.getPropagation() : target.parentElement) {
                target.parentElement.dispatchEvent(new event.constructor(event.type, event));
            }
        };
        eventsMap.set(eventName, new WeakMap([[target, handler]]));
        document.addEventListener(eventName, rootHandler, true);
        _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.eventsStore.addUnsubscriber(() => document.removeEventListener(eventName, rootHandler, true));
    }
    else {
        handlerMap.set(target, handler);
    }
}
const detectIsEvent = (attrName) => attrName.startsWith('on');
const getEventName = (attrName) => attrName.slice(2, attrName.length).toLowerCase();



/***/ }),

/***/ "./src/events/index.ts":
/*!*****************************!*\
  !*** ./src/events/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SyntheticEvent": () => (/* reexport safe */ _events__WEBPACK_IMPORTED_MODULE_0__.SyntheticEvent),
/* harmony export */   "delegateEvent": () => (/* reexport safe */ _events__WEBPACK_IMPORTED_MODULE_0__.delegateEvent),
/* harmony export */   "detectIsEvent": () => (/* reexport safe */ _events__WEBPACK_IMPORTED_MODULE_0__.detectIsEvent),
/* harmony export */   "getEventName": () => (/* reexport safe */ _events__WEBPACK_IMPORTED_MODULE_0__.getEventName)
/* harmony export */ });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./events */ "./src/events/events.ts");



/***/ }),

/***/ "./src/portal/index.ts":
/*!*****************************!*\
  !*** ./src/portal/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createPortal": () => (/* reexport safe */ _portal__WEBPACK_IMPORTED_MODULE_0__.createPortal),
/* harmony export */   "detectIsPortal": () => (/* reexport safe */ _portal__WEBPACK_IMPORTED_MODULE_0__.detectIsPortal),
/* harmony export */   "getPortalContainer": () => (/* reexport safe */ _portal__WEBPACK_IMPORTED_MODULE_0__.getPortalContainer),
/* harmony export */   "unmountPortal": () => (/* reexport safe */ _portal__WEBPACK_IMPORTED_MODULE_0__.unmountPortal)
/* harmony export */ });
/* harmony import */ var _portal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./portal */ "./src/portal/portal.tsx");



/***/ }),

/***/ "./src/portal/portal.tsx":
/*!*******************************!*\
  !*** ./src/portal/portal.tsx ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createPortal": () => (/* binding */ createPortal),
/* harmony export */   "detectIsPortal": () => (/* binding */ detectIsPortal),
/* harmony export */   "getPortalContainer": () => (/* binding */ getPortalContainer),
/* harmony export */   "unmountPortal": () => (/* binding */ unmountPortal)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dark-engine/core */ "@dark-engine/core");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__);
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

const $$portal = Symbol('portal');
function createPortal(slot, container) {
    if (!(container instanceof Element)) {
        throw new Error(`[Dark]: createPortal receives only Element as container!`);
    }
    return Portal({ [$$portal]: container, slot });
}
const Portal = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.createComponent)((_a) => {
    var { slot } = _a, rest = __rest(_a, ["slot"]);
    (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (rest[$$portal].innerHTML = ''), []);
    return slot;
}, { token: $$portal });
const detectIsPortal = (factory) => (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsComponentFactory)(factory) && factory.token === $$portal;
const getPortalContainer = (factory) => detectIsPortal(factory) ? factory.props[$$portal] : null;
function unmountPortal(fiber) {
    const container = getPortalContainer(fiber.instance);
    if (container) {
        container.innerHTML = '';
    }
}



/***/ }),

/***/ "./src/render/index.ts":
/*!*****************************!*\
  !*** ./src/render/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _render__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "roots": () => (/* reexport safe */ _render__WEBPACK_IMPORTED_MODULE_0__.roots)
/* harmony export */ });
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./render */ "./src/render/render.ts");



/***/ }),

/***/ "./src/render/render.ts":
/*!******************************!*\
  !*** ./src/render/render.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "roots": () => (/* binding */ roots)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dark-engine/core */ "@dark-engine/core");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dom */ "./src/dom/index.ts");
/* harmony import */ var _portal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../portal */ "./src/portal/index.ts");
/* harmony import */ var _scheduler__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../scheduler */ "./src/scheduler/index.ts");




_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.createNativeElement = _dom__WEBPACK_IMPORTED_MODULE_1__.createNativeElement;
_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.requestAnimationFrame = requestAnimationFrame.bind(undefined);
_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.scheduleCallback = _scheduler__WEBPACK_IMPORTED_MODULE_3__.scheduleCallback;
_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.shouldYeildToHost = _scheduler__WEBPACK_IMPORTED_MODULE_3__.shouldYeildToHost;
_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.applyCommit = _dom__WEBPACK_IMPORTED_MODULE_1__.applyCommit;
_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.finishCommitWork = _dom__WEBPACK_IMPORTED_MODULE_1__.finishCommitWork;
_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.detectIsPortal = _portal__WEBPACK_IMPORTED_MODULE_2__.detectIsPortal;
_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.unmountPortal = _portal__WEBPACK_IMPORTED_MODULE_2__.unmountPortal;
const roots = new Map();
function render(element, container) {
    if (!(container instanceof Element)) {
        throw new Error(`[Dark]: render receives only Element as container!`);
    }
    const isMounted = !(0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsUndefined)(roots.get(container));
    let rootId = null;
    if (!isMounted) {
        rootId = roots.size;
        roots.set(container, rootId);
        container.innerHTML = '';
    }
    else {
        rootId = roots.get(container);
    }
    const callback = () => {
        _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.rootStore.set(rootId); // important order!
        const currentRoot = _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.currentRootStore.get();
        const fiber = new _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.Fiber({
            nativeElement: container,
            instance: new _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.TagVirtualNode({
                name: _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.ROOT,
                children: (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.flatten)([element || (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.createEmptyVirtualNode)()]),
            }),
            alternate: currentRoot,
            effectTag: isMounted ? _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.EffectTag.UPDATE : _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.EffectTag.CREATE,
        });
        currentRoot && (currentRoot.alternate = null);
        _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.fiberMountStore.reset();
        _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.wipRootStore.set(fiber);
        _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.nextUnitOfWorkStore.set(fiber);
    };
    _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.scheduleCallback(callback, { priority: _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.TaskPriority.NORMAL, forceSync: _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.isLayoutEffectsZone.get() });
}



/***/ }),

/***/ "./src/scheduler/index.ts":
/*!********************************!*\
  !*** ./src/scheduler/index.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "scheduleCallback": () => (/* reexport safe */ _scheduler__WEBPACK_IMPORTED_MODULE_0__.scheduleCallback),
/* harmony export */   "shouldYeildToHost": () => (/* reexport safe */ _scheduler__WEBPACK_IMPORTED_MODULE_0__.shouldYeildToHost)
/* harmony export */ });
/* harmony import */ var _scheduler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scheduler */ "./src/scheduler/scheduler.ts");



/***/ }),

/***/ "./src/scheduler/scheduler.ts":
/*!************************************!*\
  !*** ./src/scheduler/scheduler.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "scheduleCallback": () => (/* binding */ scheduleCallback),
/* harmony export */   "shouldYeildToHost": () => (/* binding */ shouldYeildToHost)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dark-engine/core */ "@dark-engine/core");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__);

const queueByPriority = {
    hight: [],
    normal: [],
    low1: [],
    low2: [],
};
const YEILD_INTERVAL = 10;
let scheduledCallback = null;
let deadline = 0;
let isMessageLoopRunning = false;
let currentTask = null;
class Task {
    constructor(options) {
        this.id = ++Task.nextTaskId;
        this.time = options.time;
        this.timeoutMs = options.timeoutMs;
        this.priority = options.priority;
        this.forceSync = options.forceSync;
        this.callback = options.callback;
    }
}
Task.nextTaskId = 0;
const shouldYeildToHost = () => (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.getTime)() >= deadline;
function scheduleCallback(callback, options) {
    const { priority = _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.TaskPriority.NORMAL, timeoutMs = 0, forceSync = false } = options || {};
    const task = new Task({ time: (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.getTime)(), timeoutMs, priority, forceSync, callback });
    const map = {
        [_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.TaskPriority.HIGH]: () => queueByPriority.hight.push(task),
        [_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.TaskPriority.NORMAL]: () => queueByPriority.normal.push(task),
        [_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.TaskPriority.LOW]: () => (task.timeoutMs > 0 ? queueByPriority.low2.push(task) : queueByPriority.low1.push(task)),
    };
    map[task.priority]();
    executeTasks();
}
function pick(queue) {
    if (!queue.length)
        return false;
    currentTask = queue.shift();
    currentTask.callback();
    if (currentTask.forceSync) {
        requestCallbackSync(_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.workLoop);
    }
    else {
        requestCallback(_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.workLoop);
    }
    return true;
}
function executeTasks() {
    const isBusy = Boolean(_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.wipRootStore.get());
    if (!isBusy) {
        checkOverdueTasks() ||
            pick(queueByPriority.hight) ||
            pick(queueByPriority.normal) ||
            requestIdleCallback(() => pick(queueByPriority.low1) || pick(queueByPriority.low2));
    }
}
function checkOverdueTasks() {
    const [task] = queueByPriority.low2;
    if (task && (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.getTime)() - task.time > task.timeoutMs) {
        pick(queueByPriority.low2);
        return true;
    }
    return false;
}
function performWorkUntilDeadline() {
    if (scheduledCallback) {
        deadline = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.getTime)() + YEILD_INTERVAL;
        try {
            const hasMoreWork = scheduledCallback();
            if (!hasMoreWork) {
                currentTask = null;
                isMessageLoopRunning = false;
                scheduledCallback = null;
                executeTasks();
            }
            else {
                port.postMessage(null);
            }
        }
        catch (error) {
            port.postMessage(null);
            throw error;
        }
    }
    else {
        isMessageLoopRunning = false;
    }
}
function requestCallback(callback) {
    if (false) {}
    scheduledCallback = callback;
    if (!isMessageLoopRunning) {
        isMessageLoopRunning = true;
        port.postMessage(null);
    }
}
function requestCallbackSync(callback) {
    while (callback()) {
        //
    }
    executeTasks();
    currentTask = null;
}
let channel = null;
let port = null;
function setup() {
    if (false) {}
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = performWorkUntilDeadline;
}
setup();



/***/ }),

/***/ "./src/use-style/index.ts":
/*!********************************!*\
  !*** ./src/use-style/index.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useStyle": () => (/* reexport safe */ _use_style__WEBPACK_IMPORTED_MODULE_0__.useStyle)
/* harmony export */ });
/* harmony import */ var _use_style__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./use-style */ "./src/use-style/use-style.ts");



/***/ }),

/***/ "./src/use-style/use-style.ts":
/*!************************************!*\
  !*** ./src/use-style/use-style.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useStyle": () => (/* binding */ useStyle)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dark-engine/core */ "@dark-engine/core");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__);

function styled(strings, ...args) {
    const style = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
        return strings
            .map((x, idx) => x + (!(0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsUndefined)(args[idx]) ? args[idx] : ''))
            .join('')
            .replace(/;\s*/gm, ';')
            .replace(/:\s*/gm, ':')
            .trim();
    }, [strings, ...args]);
    return style;
}
function useStyle(config) {
    return config(styled);
}



/***/ }),

/***/ "@dark-engine/core":
/*!*****************************************************************************************************************************!*\
  !*** external {"root":"DarkCore","commonjs2":"@dark-engine/core","commonjs":"@dark-engine/core","amd":"@dark-engine/core"} ***!
  \*****************************************************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__dark_engine_core__;

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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/* harmony export */   "createPortal": () => (/* reexport safe */ _portal__WEBPACK_IMPORTED_MODULE_2__.createPortal),
/* harmony export */   "createRoot": () => (/* reexport safe */ _create_root__WEBPACK_IMPORTED_MODULE_1__.createRoot),
/* harmony export */   "render": () => (/* reexport safe */ _render__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "setTrackUpdate": () => (/* reexport safe */ _dom__WEBPACK_IMPORTED_MODULE_4__.setTrackUpdate),
/* harmony export */   "useStyle": () => (/* reexport safe */ _use_style__WEBPACK_IMPORTED_MODULE_3__.useStyle)
/* harmony export */ });
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./render */ "./src/render/index.ts");
/* harmony import */ var _create_root__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./create-root */ "./src/create-root/index.ts");
/* harmony import */ var _portal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./portal */ "./src/portal/index.ts");
/* harmony import */ var _use_style__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./use-style */ "./src/use-style/index.ts");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dom */ "./src/dom/index.ts");






})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=dark-platform-browser.development.js.map