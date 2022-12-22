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

/***/ "./src/constants.ts":
/*!**************************!*\
  !*** ./src/constants.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SVG_TAG_NAMES": () => (/* binding */ SVG_TAG_NAMES),
/* harmony export */   "VOID_TAG_NAMES": () => (/* binding */ VOID_TAG_NAMES)
/* harmony export */ });
const SVG_TAG_NAMES = 'svg,animate,animateMotion,animateTransform,circle,clipPath,defs,desc,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,image,line,linearGradient,marker,mask,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,stop,switch,symbol,text,textPath,tspan,use,view';
const VOID_TAG_NAMES = 'area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr';


/***/ }),

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
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants */ "./src/constants.ts");




const attrBlackListMap = {
    [_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.ATTR_KEY]: true,
    [_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.ATTR_REF]: true,
    [_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.ATTR_FLAG]: true,
};
let fragmentsMap = new Map();
let moves = [];
let trackUpdate = null;
const svgTagNamesMap = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.keyBy)(_constants__WEBPACK_IMPORTED_MODULE_3__.SVG_TAG_NAMES.split(','), x => x);
const voidTagNamesMap = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.keyBy)(_constants__WEBPACK_IMPORTED_MODULE_3__.VOID_TAG_NAMES.split(','), x => x);
const createNativeElementMap = {
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
function createNativeElement(vNode) {
    return createNativeElementMap[vNode.type](vNode);
}
function detectIsSvgElement(tagName) {
    return Boolean(svgTagNamesMap[tagName]);
}
function detectIsVoidElement(tagName) {
    return Boolean(voidTagNamesMap[tagName]);
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
            const stop = patchProperties({
                tagName: vNode.name,
                attrValue,
                attrName,
                element,
            });
            !stop && element.setAttribute(attrName, attrValue);
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
                const stop = patchProperties({
                    tagName: nextVNode.name,
                    attrValue: nextAttrValue,
                    attrName,
                    element,
                });
                !stop && element.setAttribute(attrName, nextAttrValue);
            }
        }
        else {
            element.removeAttribute(attrName);
        }
    }
}
function patchProperties(options) {
    const { tagName, element, attrName, attrValue } = options;
    const fn = patchPropertiesSpecialCasesMap[tagName];
    let stop = fn ? fn(element, attrName, attrValue) : false;
    if (canSetProperty(Object.getPrototypeOf(element), attrName)) {
        element[attrName] = attrValue;
    }
    if (!stop && (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsBoolean)(attrValue)) {
        stop = !attrName.includes('-');
    }
    return stop;
}
function canSetProperty(prototype, key) {
    var _a;
    return prototype.hasOwnProperty(key) && Boolean((_a = Object.getOwnPropertyDescriptor(prototype, key)) === null || _a === void 0 ? void 0 : _a.set);
}
const patchPropertiesSpecialCasesMap = {
    input: (element, attrName, attrValue) => {
        if (attrName === 'value' && (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsBoolean)(attrValue)) {
            element.checked = attrValue;
        }
        else if (attrName === 'autoFocus') {
            element.autofocus = Boolean(attrValue);
        }
        return false;
    },
    textarea: (element, attrName, attrValue) => {
        if (attrName === 'value') {
            element.innerHTML = String(attrValue);
            return true;
        }
        return false;
    },
};
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
function append(fiber, parentElement) {
    const { fragment } = fragmentsMap.get(parentElement) ||
        {
            fragment: document.createDocumentFragment(),
            callback: () => { },
        };
    fragmentsMap.set(parentElement, {
        fragment,
        callback: () => {
            parentElement.appendChild(fragment);
        },
    });
    fragment.appendChild(fiber.nativeElement);
}
function insert(fiber, parentElement, idx) {
    parentElement.insertBefore(fiber.nativeElement, parentElement.childNodes[idx]);
}
function commitCreation(fiber) {
    const parentFiber = getParentFiberWithNativeElement(fiber);
    const parentElement = parentFiber.nativeElement;
    const childNodes = parentElement.childNodes;
    const hasNoChildNodes = childNodes.length === 0;
    const idx = hasNoChildNodes ? 0 : fiber.elementIdx;
    if (hasNoChildNodes || idx > childNodes.length - 1) {
        const vNode = parentFiber.instance;
        !detectIsVoidElement(vNode.name) && append(fiber, parentElement);
    }
    else {
        insert(fiber, parentElement, idx);
    }
    addAttributes(fiber.nativeElement, fiber.instance);
}
function commitUpdate(fiber) {
    const element = fiber.nativeElement;
    const prevInstance = fiber.alternate.instance;
    const nextInstance = fiber.instance;
    if ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsTextVirtualNode)(prevInstance) &&
        (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsTextVirtualNode)(nextInstance) &&
        prevInstance.value !== nextInstance.value) {
        return (element.textContent = nextInstance.value);
    }
    if ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsTagVirtualNode)(prevInstance) && (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsTagVirtualNode)(nextInstance)) {
        return updateAttributes(element, prevInstance, nextInstance);
    }
}
function commitDeletion(fiber) {
    const parentFiber = getParentFiberWithNativeElement(fiber);
    (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.walkFiber)(fiber, ({ nextFiber, isReturn, resetIsDeepWalking, stop }) => {
        if (nextFiber === fiber.nextSibling || nextFiber === fiber.parent) {
            return stop();
        }
        if (!isReturn && nextFiber.nativeElement) {
            !(0,_portal__WEBPACK_IMPORTED_MODULE_1__.detectIsPortal)(nextFiber.instance) && parentFiber.nativeElement.removeChild(nextFiber.nativeElement);
            return resetIsDeepWalking();
        }
    });
}
function move(fiber) {
    const sourceNodes = collectElements(fiber);
    const sourceNode = sourceNodes[0];
    const parentElement = sourceNode.parentElement;
    const sourceFragment = new DocumentFragment();
    const elementIdx = fiber.elementIdx;
    let idx = 0;
    const move = () => {
        for (let i = 1; i < sourceNodes.length; i++) {
            parentElement.removeChild(parentElement.childNodes[elementIdx + 1]);
        }
        parentElement.replaceChild(sourceFragment, parentElement.childNodes[elementIdx]);
    };
    for (const node of sourceNodes) {
        parentElement.insertBefore(document.createComment(`${elementIdx}:${idx}`), node);
        sourceFragment.appendChild(node);
        idx++;
    }
    moves.push(move);
}
function collectElements(fiber) {
    const store = [];
    (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.walkFiber)(fiber, ({ nextFiber, isReturn, resetIsDeepWalking, stop }) => {
        if (nextFiber === fiber.nextSibling || nextFiber === fiber.parent) {
            return stop();
        }
        if (!isReturn && nextFiber.nativeElement) {
            !(0,_portal__WEBPACK_IMPORTED_MODULE_1__.detectIsPortal)(nextFiber.instance) && store.push(nextFiber.nativeElement);
            return resetIsDeepWalking();
        }
    });
    return store;
}
const applyCommitMap = {
    [_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.EffectTag.CREATE]: (fiber) => {
        if (fiber.nativeElement === null)
            return;
        trackUpdate && trackUpdate(fiber.nativeElement);
        commitCreation(fiber);
    },
    [_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.EffectTag.UPDATE]: (fiber) => {
        if (fiber.move) {
            move(fiber);
            fiber.move = false;
        }
        if (fiber.nativeElement === null ||
            !(0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsVirtualNode)(fiber.alternate.instance) ||
            !(0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsVirtualNode)(fiber.instance)) {
            return;
        }
        trackUpdate && trackUpdate(fiber.nativeElement);
        commitUpdate(fiber);
    },
    [_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.EffectTag.DELETE]: (fiber) => commitDeletion(fiber),
    [_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.EffectTag.SKIP]: () => { },
};
function applyCommit(fiber) {
    applyCommitMap[fiber.effectTag](fiber);
}
function finishCommitWork() {
    for (const { callback } of fragmentsMap.values()) {
        callback();
    }
    for (const move of moves) {
        move();
    }
    fragmentsMap = new Map();
    moves = [];
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

/***/ "./src/factory/factory.ts":
/*!********************************!*\
  !*** ./src/factory/factory.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_switch": () => (/* binding */ _switch),
/* harmony export */   "_var": () => (/* binding */ _var),
/* harmony export */   "a": () => (/* binding */ a),
/* harmony export */   "abbr": () => (/* binding */ abbr),
/* harmony export */   "address": () => (/* binding */ address),
/* harmony export */   "animate": () => (/* binding */ animate),
/* harmony export */   "animateMotion": () => (/* binding */ animateMotion),
/* harmony export */   "animateTransform": () => (/* binding */ animateTransform),
/* harmony export */   "area": () => (/* binding */ area),
/* harmony export */   "article": () => (/* binding */ article),
/* harmony export */   "aside": () => (/* binding */ aside),
/* harmony export */   "audio": () => (/* binding */ audio),
/* harmony export */   "b": () => (/* binding */ b),
/* harmony export */   "base": () => (/* binding */ base),
/* harmony export */   "bdi": () => (/* binding */ bdi),
/* harmony export */   "bdo": () => (/* binding */ bdo),
/* harmony export */   "blockquote": () => (/* binding */ blockquote),
/* harmony export */   "body": () => (/* binding */ body),
/* harmony export */   "br": () => (/* binding */ br),
/* harmony export */   "button": () => (/* binding */ button),
/* harmony export */   "canvas": () => (/* binding */ canvas),
/* harmony export */   "caption": () => (/* binding */ caption),
/* harmony export */   "circle": () => (/* binding */ circle),
/* harmony export */   "cite": () => (/* binding */ cite),
/* harmony export */   "clipPath": () => (/* binding */ clipPath),
/* harmony export */   "code": () => (/* binding */ code),
/* harmony export */   "col": () => (/* binding */ col),
/* harmony export */   "colgroup": () => (/* binding */ colgroup),
/* harmony export */   "data": () => (/* binding */ data),
/* harmony export */   "datalist": () => (/* binding */ datalist),
/* harmony export */   "dd": () => (/* binding */ dd),
/* harmony export */   "defs": () => (/* binding */ defs),
/* harmony export */   "del": () => (/* binding */ del),
/* harmony export */   "desc": () => (/* binding */ desc),
/* harmony export */   "details": () => (/* binding */ details),
/* harmony export */   "dfn": () => (/* binding */ dfn),
/* harmony export */   "dialog": () => (/* binding */ dialog),
/* harmony export */   "div": () => (/* binding */ div),
/* harmony export */   "dl": () => (/* binding */ dl),
/* harmony export */   "ellipse": () => (/* binding */ ellipse),
/* harmony export */   "em": () => (/* binding */ em),
/* harmony export */   "embed": () => (/* binding */ embed),
/* harmony export */   "factory": () => (/* binding */ factory),
/* harmony export */   "feBlend": () => (/* binding */ feBlend),
/* harmony export */   "feColorMatrix": () => (/* binding */ feColorMatrix),
/* harmony export */   "feComponentTransfer": () => (/* binding */ feComponentTransfer),
/* harmony export */   "feComposite": () => (/* binding */ feComposite),
/* harmony export */   "feConvolveMatrix": () => (/* binding */ feConvolveMatrix),
/* harmony export */   "feDiffuseLighting": () => (/* binding */ feDiffuseLighting),
/* harmony export */   "feDisplacementMap": () => (/* binding */ feDisplacementMap),
/* harmony export */   "feDistantLight": () => (/* binding */ feDistantLight),
/* harmony export */   "feDropShadow": () => (/* binding */ feDropShadow),
/* harmony export */   "feFlood": () => (/* binding */ feFlood),
/* harmony export */   "feFuncA": () => (/* binding */ feFuncA),
/* harmony export */   "feFuncB": () => (/* binding */ feFuncB),
/* harmony export */   "feFuncG": () => (/* binding */ feFuncG),
/* harmony export */   "feFuncR": () => (/* binding */ feFuncR),
/* harmony export */   "feGaussianBlur": () => (/* binding */ feGaussianBlur),
/* harmony export */   "feImage": () => (/* binding */ feImage),
/* harmony export */   "feMerge": () => (/* binding */ feMerge),
/* harmony export */   "feMergeNode": () => (/* binding */ feMergeNode),
/* harmony export */   "feMorphology": () => (/* binding */ feMorphology),
/* harmony export */   "feOffset": () => (/* binding */ feOffset),
/* harmony export */   "fePointLight": () => (/* binding */ fePointLight),
/* harmony export */   "feSpecularLighting": () => (/* binding */ feSpecularLighting),
/* harmony export */   "feSpotLight": () => (/* binding */ feSpotLight),
/* harmony export */   "feTile": () => (/* binding */ feTile),
/* harmony export */   "feTurbulence": () => (/* binding */ feTurbulence),
/* harmony export */   "fieldset": () => (/* binding */ fieldset),
/* harmony export */   "figcaption": () => (/* binding */ figcaption),
/* harmony export */   "figure": () => (/* binding */ figure),
/* harmony export */   "filter": () => (/* binding */ filter),
/* harmony export */   "footer": () => (/* binding */ footer),
/* harmony export */   "foreignObject": () => (/* binding */ foreignObject),
/* harmony export */   "form": () => (/* binding */ form),
/* harmony export */   "g": () => (/* binding */ g),
/* harmony export */   "h1": () => (/* binding */ h1),
/* harmony export */   "h2": () => (/* binding */ h2),
/* harmony export */   "h3": () => (/* binding */ h3),
/* harmony export */   "h4": () => (/* binding */ h4),
/* harmony export */   "h5": () => (/* binding */ h5),
/* harmony export */   "h6": () => (/* binding */ h6),
/* harmony export */   "head": () => (/* binding */ head),
/* harmony export */   "header": () => (/* binding */ header),
/* harmony export */   "hr": () => (/* binding */ hr),
/* harmony export */   "html": () => (/* binding */ html),
/* harmony export */   "i": () => (/* binding */ i),
/* harmony export */   "iframe": () => (/* binding */ iframe),
/* harmony export */   "image": () => (/* binding */ image),
/* harmony export */   "img": () => (/* binding */ img),
/* harmony export */   "input": () => (/* binding */ input),
/* harmony export */   "ins": () => (/* binding */ ins),
/* harmony export */   "kbd": () => (/* binding */ kbd),
/* harmony export */   "label": () => (/* binding */ label),
/* harmony export */   "legend": () => (/* binding */ legend),
/* harmony export */   "li": () => (/* binding */ li),
/* harmony export */   "line": () => (/* binding */ line),
/* harmony export */   "linearGradient": () => (/* binding */ linearGradient),
/* harmony export */   "link": () => (/* binding */ link),
/* harmony export */   "main": () => (/* binding */ main),
/* harmony export */   "map": () => (/* binding */ map),
/* harmony export */   "mark": () => (/* binding */ mark),
/* harmony export */   "marker": () => (/* binding */ marker),
/* harmony export */   "mask": () => (/* binding */ mask),
/* harmony export */   "menu": () => (/* binding */ menu),
/* harmony export */   "meta": () => (/* binding */ meta),
/* harmony export */   "metadata": () => (/* binding */ metadata),
/* harmony export */   "meter": () => (/* binding */ meter),
/* harmony export */   "mpath": () => (/* binding */ mpath),
/* harmony export */   "nav": () => (/* binding */ nav),
/* harmony export */   "noscript": () => (/* binding */ noscript),
/* harmony export */   "object": () => (/* binding */ object),
/* harmony export */   "ol": () => (/* binding */ ol),
/* harmony export */   "optgroup": () => (/* binding */ optgroup),
/* harmony export */   "option": () => (/* binding */ option),
/* harmony export */   "output": () => (/* binding */ output),
/* harmony export */   "p": () => (/* binding */ p),
/* harmony export */   "param": () => (/* binding */ param),
/* harmony export */   "path": () => (/* binding */ path),
/* harmony export */   "pattern": () => (/* binding */ pattern),
/* harmony export */   "picture": () => (/* binding */ picture),
/* harmony export */   "polygon": () => (/* binding */ polygon),
/* harmony export */   "polyline": () => (/* binding */ polyline),
/* harmony export */   "pre": () => (/* binding */ pre),
/* harmony export */   "progress": () => (/* binding */ progress),
/* harmony export */   "q": () => (/* binding */ q),
/* harmony export */   "radialGradient": () => (/* binding */ radialGradient),
/* harmony export */   "rect": () => (/* binding */ rect),
/* harmony export */   "rp": () => (/* binding */ rp),
/* harmony export */   "rt": () => (/* binding */ rt),
/* harmony export */   "ruby": () => (/* binding */ ruby),
/* harmony export */   "s": () => (/* binding */ s),
/* harmony export */   "samp": () => (/* binding */ samp),
/* harmony export */   "script": () => (/* binding */ script),
/* harmony export */   "section": () => (/* binding */ section),
/* harmony export */   "select": () => (/* binding */ select),
/* harmony export */   "small": () => (/* binding */ small),
/* harmony export */   "source": () => (/* binding */ source),
/* harmony export */   "span": () => (/* binding */ span),
/* harmony export */   "stop": () => (/* binding */ stop),
/* harmony export */   "strong": () => (/* binding */ strong),
/* harmony export */   "style": () => (/* binding */ style),
/* harmony export */   "sub": () => (/* binding */ sub),
/* harmony export */   "summary": () => (/* binding */ summary),
/* harmony export */   "sup": () => (/* binding */ sup),
/* harmony export */   "svg": () => (/* binding */ svg),
/* harmony export */   "symbol": () => (/* binding */ symbol),
/* harmony export */   "table": () => (/* binding */ table),
/* harmony export */   "tbody": () => (/* binding */ tbody),
/* harmony export */   "td": () => (/* binding */ td),
/* harmony export */   "template": () => (/* binding */ template),
/* harmony export */   "text": () => (/* binding */ text),
/* harmony export */   "textPath": () => (/* binding */ textPath),
/* harmony export */   "textarea": () => (/* binding */ textarea),
/* harmony export */   "tfoot": () => (/* binding */ tfoot),
/* harmony export */   "th": () => (/* binding */ th),
/* harmony export */   "thead": () => (/* binding */ thead),
/* harmony export */   "time": () => (/* binding */ time),
/* harmony export */   "title": () => (/* binding */ title),
/* harmony export */   "tr": () => (/* binding */ tr),
/* harmony export */   "track": () => (/* binding */ track),
/* harmony export */   "tspan": () => (/* binding */ tspan),
/* harmony export */   "u": () => (/* binding */ u),
/* harmony export */   "ul": () => (/* binding */ ul),
/* harmony export */   "use": () => (/* binding */ use),
/* harmony export */   "video": () => (/* binding */ video),
/* harmony export */   "view": () => (/* binding */ view),
/* harmony export */   "wbr": () => (/* binding */ wbr)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dark-engine/core */ "@dark-engine/core");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__);

const factory = (as) => (props) => (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.View)(Object.assign({ as }, (props || {})));
const html = factory('html');
const body = factory('body');
const base = factory('base');
const head = factory('head');
const link = factory('link');
const meta = factory('meta');
const style = factory('style');
const title = factory('title');
const address = factory('address');
const article = factory('article');
const aside = factory('aside');
const footer = factory('footer');
const header = factory('header');
const h1 = factory('h1');
const h2 = factory('h2');
const h3 = factory('h3');
const h4 = factory('h4');
const h5 = factory('h5');
const h6 = factory('h6');
const nav = factory('nav');
const section = factory('section');
const div = factory('div');
const dd = factory('dd');
const dl = factory('dl');
const figcaption = factory('figcaption');
const figure = factory('figure');
const picture = factory('picture');
const hr = factory('hr');
const img = factory('img');
const li = factory('li');
const main = factory('main');
const ol = factory('ol');
const p = factory('p');
const pre = factory('pre');
const ul = factory('ul');
const a = factory('a');
const b = factory('b');
const abbr = factory('abbr');
const bdi = factory('bdi');
const bdo = factory('bdo');
const br = factory('br');
const cite = factory('cite');
const code = factory('code');
const data = factory('data');
const dfn = factory('dfn');
const em = factory('em');
const i = factory('i');
const kbd = factory('kbd');
const mark = factory('mark');
const q = factory('q');
const rp = factory('rp');
const rt = factory('rt');
const ruby = factory('ruby');
const s = factory('s');
const samp = factory('samp');
const small = factory('small');
const span = factory('span');
const strong = factory('strong');
const sub = factory('sub');
const sup = factory('sup');
const time = factory('time');
const u = factory('u');
const _var = factory('var');
const wbr = factory('wbr');
const area = factory('area');
const audio = factory('audio');
const map = factory('map');
const track = factory('track');
const video = factory('video');
const embed = factory('embed');
const object = factory('object');
const param = factory('param');
const source = factory('source');
const canvas = factory('canvas');
const script = factory('script');
const noscript = factory('noscript');
const del = factory('del');
const ins = factory('ins');
const caption = factory('caption');
const col = factory('col');
const colgroup = factory('colgroup');
const table = factory('table');
const thead = factory('thead');
const tbody = factory('tbody');
const td = factory('td');
const th = factory('th');
const tr = factory('tr');
const button = factory('button');
const datalist = factory('datalist');
const fieldset = factory('fieldset');
const form = factory('form');
const input = factory('input');
const label = factory('label');
const legend = factory('legend');
const meter = factory('meter');
const optgroup = factory('optgroup');
const option = factory('option');
const output = factory('output');
const progress = factory('progress');
const select = factory('select');
const textarea = factory('textarea');
const details = factory('details');
const dialog = factory('dialog');
const menu = factory('menu');
const summary = factory('summary');
const template = factory('template');
const blockquote = factory('blockquote');
const iframe = factory('iframe');
const tfoot = factory('tfoot');
const svg = factory('svg');
const animate = factory('animate');
const animateMotion = factory('animateMotion');
const animateTransform = factory('animateTransform');
const circle = factory('circle');
const clipPath = factory('clipPath');
const defs = factory('defs');
const desc = factory('desc');
const ellipse = factory('ellipse');
const feBlend = factory('feBlend');
const feColorMatrix = factory('feColorMatrix');
const feComponentTransfer = factory('feComponentTransfer');
const feComposite = factory('feComposite');
const feConvolveMatrix = factory('feConvolveMatrix');
const feDiffuseLighting = factory('feDiffuseLighting');
const feDisplacementMap = factory('feDisplacementMap');
const feDistantLight = factory('feDistantLight');
const feDropShadow = factory('feDropShadow');
const feFlood = factory('feFlood');
const feFuncA = factory('feFuncA');
const feFuncB = factory('feFuncB');
const feFuncG = factory('feFuncG');
const feFuncR = factory('feFuncR');
const feGaussianBlur = factory('feGaussianBlur');
const feImage = factory('feImage');
const feMerge = factory('feMerge');
const feMergeNode = factory('feMergeNode');
const feMorphology = factory('feMorphology');
const feOffset = factory('feOffset');
const fePointLight = factory('fePointLight');
const feSpecularLighting = factory('feSpecularLighting');
const feSpotLight = factory('feSpotLight');
const feTile = factory('feTile');
const feTurbulence = factory('feTurbulence');
const filter = factory('filter');
const foreignObject = factory('foreignObject');
const g = factory('g');
const image = factory('image');
const line = factory('line');
const linearGradient = factory('linearGradient');
const marker = factory('marker');
const mask = factory('mask');
const metadata = factory('metadata');
const mpath = factory('mpath');
const path = factory('path');
const pattern = factory('pattern');
const polygon = factory('polygon');
const polyline = factory('polyline');
const radialGradient = factory('radialGradient');
const rect = factory('rect');
const stop = factory('stop');
const _switch = factory('switch');
const symbol = factory('symbol');
const text = factory('text');
const textPath = factory('textPath');
const tspan = factory('tspan');
const use = factory('use');
const view = factory('view');



/***/ }),

/***/ "./src/factory/index.ts":
/*!******************************!*\
  !*** ./src/factory/index.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_switch": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__._switch),
/* harmony export */   "_var": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__._var),
/* harmony export */   "a": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.a),
/* harmony export */   "abbr": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.abbr),
/* harmony export */   "address": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.address),
/* harmony export */   "animate": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.animate),
/* harmony export */   "animateMotion": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.animateMotion),
/* harmony export */   "animateTransform": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.animateTransform),
/* harmony export */   "area": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.area),
/* harmony export */   "article": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.article),
/* harmony export */   "aside": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.aside),
/* harmony export */   "audio": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.audio),
/* harmony export */   "b": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.b),
/* harmony export */   "base": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.base),
/* harmony export */   "bdi": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.bdi),
/* harmony export */   "bdo": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.bdo),
/* harmony export */   "blockquote": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.blockquote),
/* harmony export */   "body": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.body),
/* harmony export */   "br": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.br),
/* harmony export */   "button": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.button),
/* harmony export */   "canvas": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.canvas),
/* harmony export */   "caption": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.caption),
/* harmony export */   "circle": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.circle),
/* harmony export */   "cite": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.cite),
/* harmony export */   "clipPath": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.clipPath),
/* harmony export */   "code": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.code),
/* harmony export */   "col": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.col),
/* harmony export */   "colgroup": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.colgroup),
/* harmony export */   "data": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.data),
/* harmony export */   "datalist": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.datalist),
/* harmony export */   "dd": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.dd),
/* harmony export */   "defs": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.defs),
/* harmony export */   "del": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.del),
/* harmony export */   "desc": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.desc),
/* harmony export */   "details": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.details),
/* harmony export */   "dfn": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.dfn),
/* harmony export */   "dialog": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.dialog),
/* harmony export */   "div": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.div),
/* harmony export */   "dl": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.dl),
/* harmony export */   "ellipse": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.ellipse),
/* harmony export */   "em": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.em),
/* harmony export */   "embed": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.embed),
/* harmony export */   "factory": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.factory),
/* harmony export */   "feBlend": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.feBlend),
/* harmony export */   "feColorMatrix": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.feColorMatrix),
/* harmony export */   "feComponentTransfer": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.feComponentTransfer),
/* harmony export */   "feComposite": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.feComposite),
/* harmony export */   "feConvolveMatrix": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.feConvolveMatrix),
/* harmony export */   "feDiffuseLighting": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.feDiffuseLighting),
/* harmony export */   "feDisplacementMap": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.feDisplacementMap),
/* harmony export */   "feDistantLight": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.feDistantLight),
/* harmony export */   "feDropShadow": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.feDropShadow),
/* harmony export */   "feFlood": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.feFlood),
/* harmony export */   "feFuncA": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.feFuncA),
/* harmony export */   "feFuncB": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.feFuncB),
/* harmony export */   "feFuncG": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.feFuncG),
/* harmony export */   "feFuncR": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.feFuncR),
/* harmony export */   "feGaussianBlur": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.feGaussianBlur),
/* harmony export */   "feImage": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.feImage),
/* harmony export */   "feMerge": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.feMerge),
/* harmony export */   "feMergeNode": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.feMergeNode),
/* harmony export */   "feMorphology": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.feMorphology),
/* harmony export */   "feOffset": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.feOffset),
/* harmony export */   "fePointLight": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.fePointLight),
/* harmony export */   "feSpecularLighting": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.feSpecularLighting),
/* harmony export */   "feSpotLight": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.feSpotLight),
/* harmony export */   "feTile": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.feTile),
/* harmony export */   "feTurbulence": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.feTurbulence),
/* harmony export */   "fieldset": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.fieldset),
/* harmony export */   "figcaption": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.figcaption),
/* harmony export */   "figure": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.figure),
/* harmony export */   "filter": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.filter),
/* harmony export */   "footer": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.footer),
/* harmony export */   "foreignObject": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.foreignObject),
/* harmony export */   "form": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.form),
/* harmony export */   "g": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.g),
/* harmony export */   "h1": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.h1),
/* harmony export */   "h2": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.h2),
/* harmony export */   "h3": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.h3),
/* harmony export */   "h4": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.h4),
/* harmony export */   "h5": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.h5),
/* harmony export */   "h6": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.h6),
/* harmony export */   "head": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.head),
/* harmony export */   "header": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.header),
/* harmony export */   "hr": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.hr),
/* harmony export */   "html": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.html),
/* harmony export */   "i": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.i),
/* harmony export */   "iframe": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.iframe),
/* harmony export */   "image": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.image),
/* harmony export */   "img": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.img),
/* harmony export */   "input": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.input),
/* harmony export */   "ins": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.ins),
/* harmony export */   "kbd": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.kbd),
/* harmony export */   "label": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.label),
/* harmony export */   "legend": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.legend),
/* harmony export */   "li": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.li),
/* harmony export */   "line": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.line),
/* harmony export */   "linearGradient": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.linearGradient),
/* harmony export */   "link": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.link),
/* harmony export */   "main": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.main),
/* harmony export */   "map": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.map),
/* harmony export */   "mark": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.mark),
/* harmony export */   "marker": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.marker),
/* harmony export */   "mask": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.mask),
/* harmony export */   "menu": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.menu),
/* harmony export */   "meta": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.meta),
/* harmony export */   "metadata": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.metadata),
/* harmony export */   "meter": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.meter),
/* harmony export */   "mpath": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.mpath),
/* harmony export */   "nav": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.nav),
/* harmony export */   "noscript": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.noscript),
/* harmony export */   "object": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.object),
/* harmony export */   "ol": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.ol),
/* harmony export */   "optgroup": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.optgroup),
/* harmony export */   "option": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.option),
/* harmony export */   "output": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.output),
/* harmony export */   "p": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.p),
/* harmony export */   "param": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.param),
/* harmony export */   "path": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.path),
/* harmony export */   "pattern": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.pattern),
/* harmony export */   "picture": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.picture),
/* harmony export */   "polygon": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.polygon),
/* harmony export */   "polyline": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.polyline),
/* harmony export */   "pre": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.pre),
/* harmony export */   "progress": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.progress),
/* harmony export */   "q": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.q),
/* harmony export */   "radialGradient": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.radialGradient),
/* harmony export */   "rect": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.rect),
/* harmony export */   "rp": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.rp),
/* harmony export */   "rt": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.rt),
/* harmony export */   "ruby": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.ruby),
/* harmony export */   "s": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.s),
/* harmony export */   "samp": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.samp),
/* harmony export */   "script": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.script),
/* harmony export */   "section": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.section),
/* harmony export */   "select": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.select),
/* harmony export */   "small": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.small),
/* harmony export */   "source": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.source),
/* harmony export */   "span": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.span),
/* harmony export */   "stop": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.stop),
/* harmony export */   "strong": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.strong),
/* harmony export */   "style": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.style),
/* harmony export */   "sub": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.sub),
/* harmony export */   "summary": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.summary),
/* harmony export */   "sup": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.sup),
/* harmony export */   "svg": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.svg),
/* harmony export */   "symbol": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.symbol),
/* harmony export */   "table": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.table),
/* harmony export */   "tbody": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.tbody),
/* harmony export */   "td": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.td),
/* harmony export */   "template": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.template),
/* harmony export */   "text": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.text),
/* harmony export */   "textPath": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.textPath),
/* harmony export */   "textarea": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.textarea),
/* harmony export */   "tfoot": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.tfoot),
/* harmony export */   "th": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.th),
/* harmony export */   "thead": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.thead),
/* harmony export */   "time": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.time),
/* harmony export */   "title": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.title),
/* harmony export */   "tr": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.tr),
/* harmony export */   "track": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.track),
/* harmony export */   "tspan": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.tspan),
/* harmony export */   "u": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.u),
/* harmony export */   "ul": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.ul),
/* harmony export */   "use": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.use),
/* harmony export */   "video": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.video),
/* harmony export */   "view": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.view),
/* harmony export */   "wbr": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_0__.wbr)
/* harmony export */ });
/* harmony import */ var _factory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./factory */ "./src/factory/factory.ts");



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
_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.cancelAnimationFrame = cancelAnimationFrame.bind(undefined);
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
    // insertion effect can't schedule renders
    if (_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.isInsertionEffectsZone.get(rootId))
        return;
    const callback = () => {
        _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.rootStore.set(rootId); // important order!
        const currentRoot = _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.currentRootStore.get();
        const fiber = new _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.Fiber().mutate({
            nativeElement: container,
            instance: new _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.TagVirtualNode({
                name: _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.ROOT,
                children: (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.flatten)([element || (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.createReplacer)()]),
            }),
            alternate: currentRoot,
            effectTag: isMounted ? _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.EffectTag.UPDATE : _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.EffectTag.CREATE,
        });
        currentRoot && (currentRoot.alternate = null);
        _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.fiberMountStore.reset();
        _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.wipRootStore.set(fiber);
        _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.nextUnitOfWorkStore.set(fiber);
    };
    _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.scheduleCallback(callback, {
        priority: _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.TaskPriority.NORMAL,
        forceSync: _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.isLayoutEffectsZone.get(),
    });
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
    animations: [],
    hight: [],
    normal: [],
    low1: [],
    low2: [],
};
const YEILD_INTERVAL = 4;
const MAX_LOW_PRIORITY_TASKS_LIMIT = 100000;
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
        [_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.TaskPriority.ANIMATION]: () => queueByPriority.animations.push(task),
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
    const isAnimation = currentTask.priority === _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.TaskPriority.ANIMATION;
    currentTask.callback();
    if (currentTask.forceSync || isAnimation) {
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
            gc() ||
            pick(queueByPriority.animations) ||
            pick(queueByPriority.hight) ||
            pick(queueByPriority.normal) ||
            requestIdleCallback(() => pick(queueByPriority.low1) || pick(queueByPriority.low2));
    }
}
function gc() {
    if (queueByPriority.low1.length > MAX_LOW_PRIORITY_TASKS_LIMIT) {
        queueByPriority.low1 = [];
    }
    return false;
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
/* harmony export */   "_switch": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__._switch),
/* harmony export */   "_var": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__._var),
/* harmony export */   "a": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.a),
/* harmony export */   "abbr": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.abbr),
/* harmony export */   "address": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.address),
/* harmony export */   "animate": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.animate),
/* harmony export */   "animateMotion": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.animateMotion),
/* harmony export */   "animateTransform": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.animateTransform),
/* harmony export */   "area": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.area),
/* harmony export */   "article": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.article),
/* harmony export */   "aside": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.aside),
/* harmony export */   "audio": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.audio),
/* harmony export */   "b": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.b),
/* harmony export */   "base": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.base),
/* harmony export */   "bdi": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.bdi),
/* harmony export */   "bdo": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.bdo),
/* harmony export */   "blockquote": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.blockquote),
/* harmony export */   "body": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.body),
/* harmony export */   "br": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.br),
/* harmony export */   "button": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.button),
/* harmony export */   "canvas": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.canvas),
/* harmony export */   "caption": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.caption),
/* harmony export */   "circle": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.circle),
/* harmony export */   "cite": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.cite),
/* harmony export */   "clipPath": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.clipPath),
/* harmony export */   "code": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.code),
/* harmony export */   "col": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.col),
/* harmony export */   "colgroup": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.colgroup),
/* harmony export */   "createPortal": () => (/* reexport safe */ _portal__WEBPACK_IMPORTED_MODULE_2__.createPortal),
/* harmony export */   "createRoot": () => (/* reexport safe */ _create_root__WEBPACK_IMPORTED_MODULE_1__.createRoot),
/* harmony export */   "data": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.data),
/* harmony export */   "datalist": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.datalist),
/* harmony export */   "dd": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.dd),
/* harmony export */   "defs": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.defs),
/* harmony export */   "del": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.del),
/* harmony export */   "desc": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.desc),
/* harmony export */   "details": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.details),
/* harmony export */   "dfn": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.dfn),
/* harmony export */   "dialog": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.dialog),
/* harmony export */   "div": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.div),
/* harmony export */   "dl": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.dl),
/* harmony export */   "ellipse": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.ellipse),
/* harmony export */   "em": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.em),
/* harmony export */   "embed": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.embed),
/* harmony export */   "factory": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.factory),
/* harmony export */   "feBlend": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.feBlend),
/* harmony export */   "feColorMatrix": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.feColorMatrix),
/* harmony export */   "feComponentTransfer": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.feComponentTransfer),
/* harmony export */   "feComposite": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.feComposite),
/* harmony export */   "feConvolveMatrix": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.feConvolveMatrix),
/* harmony export */   "feDiffuseLighting": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.feDiffuseLighting),
/* harmony export */   "feDisplacementMap": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.feDisplacementMap),
/* harmony export */   "feDistantLight": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.feDistantLight),
/* harmony export */   "feDropShadow": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.feDropShadow),
/* harmony export */   "feFlood": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.feFlood),
/* harmony export */   "feFuncA": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.feFuncA),
/* harmony export */   "feFuncB": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.feFuncB),
/* harmony export */   "feFuncG": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.feFuncG),
/* harmony export */   "feFuncR": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.feFuncR),
/* harmony export */   "feGaussianBlur": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.feGaussianBlur),
/* harmony export */   "feImage": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.feImage),
/* harmony export */   "feMerge": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.feMerge),
/* harmony export */   "feMergeNode": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.feMergeNode),
/* harmony export */   "feMorphology": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.feMorphology),
/* harmony export */   "feOffset": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.feOffset),
/* harmony export */   "fePointLight": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.fePointLight),
/* harmony export */   "feSpecularLighting": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.feSpecularLighting),
/* harmony export */   "feSpotLight": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.feSpotLight),
/* harmony export */   "feTile": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.feTile),
/* harmony export */   "feTurbulence": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.feTurbulence),
/* harmony export */   "fieldset": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.fieldset),
/* harmony export */   "figcaption": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.figcaption),
/* harmony export */   "figure": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.figure),
/* harmony export */   "filter": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.filter),
/* harmony export */   "footer": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.footer),
/* harmony export */   "foreignObject": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.foreignObject),
/* harmony export */   "form": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.form),
/* harmony export */   "g": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.g),
/* harmony export */   "h1": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.h1),
/* harmony export */   "h2": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.h2),
/* harmony export */   "h3": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.h3),
/* harmony export */   "h4": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.h4),
/* harmony export */   "h5": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.h5),
/* harmony export */   "h6": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.h6),
/* harmony export */   "head": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.head),
/* harmony export */   "header": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.header),
/* harmony export */   "hr": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.hr),
/* harmony export */   "html": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.html),
/* harmony export */   "i": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.i),
/* harmony export */   "iframe": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.iframe),
/* harmony export */   "image": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.image),
/* harmony export */   "img": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.img),
/* harmony export */   "input": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.input),
/* harmony export */   "ins": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.ins),
/* harmony export */   "kbd": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.kbd),
/* harmony export */   "label": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.label),
/* harmony export */   "legend": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.legend),
/* harmony export */   "li": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.li),
/* harmony export */   "line": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.line),
/* harmony export */   "linearGradient": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.linearGradient),
/* harmony export */   "link": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.link),
/* harmony export */   "main": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.main),
/* harmony export */   "map": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.map),
/* harmony export */   "mark": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.mark),
/* harmony export */   "marker": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.marker),
/* harmony export */   "mask": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.mask),
/* harmony export */   "menu": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.menu),
/* harmony export */   "meta": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.meta),
/* harmony export */   "metadata": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.metadata),
/* harmony export */   "meter": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.meter),
/* harmony export */   "mpath": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.mpath),
/* harmony export */   "nav": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.nav),
/* harmony export */   "noscript": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.noscript),
/* harmony export */   "object": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.object),
/* harmony export */   "ol": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.ol),
/* harmony export */   "optgroup": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.optgroup),
/* harmony export */   "option": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.option),
/* harmony export */   "output": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.output),
/* harmony export */   "p": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.p),
/* harmony export */   "param": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.param),
/* harmony export */   "path": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.path),
/* harmony export */   "pattern": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.pattern),
/* harmony export */   "picture": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.picture),
/* harmony export */   "polygon": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.polygon),
/* harmony export */   "polyline": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.polyline),
/* harmony export */   "pre": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.pre),
/* harmony export */   "progress": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.progress),
/* harmony export */   "q": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.q),
/* harmony export */   "radialGradient": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.radialGradient),
/* harmony export */   "rect": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.rect),
/* harmony export */   "render": () => (/* reexport safe */ _render__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "rp": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.rp),
/* harmony export */   "rt": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.rt),
/* harmony export */   "ruby": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.ruby),
/* harmony export */   "s": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.s),
/* harmony export */   "samp": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.samp),
/* harmony export */   "script": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.script),
/* harmony export */   "section": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.section),
/* harmony export */   "select": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.select),
/* harmony export */   "setTrackUpdate": () => (/* reexport safe */ _dom__WEBPACK_IMPORTED_MODULE_4__.setTrackUpdate),
/* harmony export */   "small": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.small),
/* harmony export */   "source": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.source),
/* harmony export */   "span": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.span),
/* harmony export */   "stop": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.stop),
/* harmony export */   "strong": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.strong),
/* harmony export */   "style": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.style),
/* harmony export */   "sub": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.sub),
/* harmony export */   "summary": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.summary),
/* harmony export */   "sup": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.sup),
/* harmony export */   "svg": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.svg),
/* harmony export */   "symbol": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.symbol),
/* harmony export */   "table": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.table),
/* harmony export */   "tbody": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.tbody),
/* harmony export */   "td": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.td),
/* harmony export */   "template": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.template),
/* harmony export */   "text": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.text),
/* harmony export */   "textPath": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.textPath),
/* harmony export */   "textarea": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.textarea),
/* harmony export */   "tfoot": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.tfoot),
/* harmony export */   "th": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.th),
/* harmony export */   "thead": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.thead),
/* harmony export */   "time": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.time),
/* harmony export */   "title": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.title),
/* harmony export */   "tr": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.tr),
/* harmony export */   "track": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.track),
/* harmony export */   "tspan": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.tspan),
/* harmony export */   "u": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.u),
/* harmony export */   "ul": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.ul),
/* harmony export */   "use": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.use),
/* harmony export */   "useStyle": () => (/* reexport safe */ _use_style__WEBPACK_IMPORTED_MODULE_3__.useStyle),
/* harmony export */   "version": () => (/* binding */ version),
/* harmony export */   "video": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.video),
/* harmony export */   "view": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.view),
/* harmony export */   "wbr": () => (/* reexport safe */ _factory__WEBPACK_IMPORTED_MODULE_5__.wbr)
/* harmony export */ });
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./render */ "./src/render/index.ts");
/* harmony import */ var _create_root__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./create-root */ "./src/create-root/index.ts");
/* harmony import */ var _portal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./portal */ "./src/portal/index.ts");
/* harmony import */ var _use_style__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./use-style */ "./src/use-style/index.ts");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dom */ "./src/dom/index.ts");
/* harmony import */ var _factory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./factory */ "./src/factory/index.ts");






const version = "0.15.4";

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=dark-platform-browser.development.js.map