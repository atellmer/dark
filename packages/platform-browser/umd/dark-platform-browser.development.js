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
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dom */ "./src/dom/index.ts");



function createRoot(container) {
    return {
        render: function (element) { return (0,_render__WEBPACK_IMPORTED_MODULE_1__.render)(element, container); },
        unmount: function () {
            var rootId = _render__WEBPACK_IMPORTED_MODULE_1__.roots.get(container);
            (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.unmountRoot)(rootId, function () {
                (0,_dom__WEBPACK_IMPORTED_MODULE_2__.resetNodeCache)();
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
/* harmony export */   "createDomElement": () => (/* binding */ createDomElement),
/* harmony export */   "finishCommitWork": () => (/* binding */ finishCommitWork),
/* harmony export */   "resetNodeCache": () => (/* binding */ resetNodeCache)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dark-engine/core */ "@dark-engine/core");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _portal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../portal */ "./src/portal/index.ts");
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../events */ "./src/events/index.ts");
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
var _a;



var attrBlackListMap = (_a = {},
    _a[_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.ATTR_KEY] = true,
    _a[_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.ATTR_REF] = true,
    _a);
var fragmentsMap = new Map();
var fragmentsCallbacks = [];
var nodeCacheMap = new Map();
function createElement(vNode) {
    var _a;
    var map = (_a = {},
        _a[_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.NodeType.TAG] = function (vNode) {
            var tagNode = vNode;
            var node = detectIsSvgElement(tagNode.name)
                ? document.createElementNS('http://www.w3.org/2000/svg', tagNode.name)
                : document.createElement(tagNode.name);
            return node;
        },
        _a[_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.NodeType.TEXT] = function (vNode) {
            var textNode = vNode;
            var node = document.createTextNode(textNode.value);
            return node;
        },
        _a[_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.NodeType.COMMENT] = function (vNode) {
            var commentNode = vNode;
            var node = document.createComment(commentNode.value);
            return node;
        },
        _a);
    return map[vNode.type](vNode);
}
function createDomElement(fiber) {
    if (!(0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsVirtualNode)(fiber.instance)) {
        throw new Error('[Dark]: createDomElement receives only virtual node!');
    }
    var vNode = fiber.instance;
    return createElement(vNode);
}
function applyRef(ref, element) {
    if ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsRef)(ref)) {
        ref.current = element;
    }
}
function addAttributes(element, vNode) {
    var e_1, _a;
    if (!(0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsTagVirtualNode)(vNode))
        return;
    var attrNames = Object.keys(vNode.attrs);
    try {
        for (var attrNames_1 = __values(attrNames), attrNames_1_1 = attrNames_1.next(); !attrNames_1_1.done; attrNames_1_1 = attrNames_1.next()) {
            var attrName = attrNames_1_1.value;
            var attrValue = vNode.attrs[attrName];
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
                upgradeInputAttributes({
                    tagName: vNode.name,
                    value: attrValue,
                    attrName: attrName,
                    element: element,
                });
                element.setAttribute(attrName, attrValue);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (attrNames_1_1 && !attrNames_1_1.done && (_a = attrNames_1.return)) _a.call(attrNames_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
function updateAttributes(element, vNode, nextVNode) {
    var e_2, _a;
    var attrNames = new Set(__spreadArray(__spreadArray([], __read(Object.keys(vNode.attrs)), false), __read(Object.keys(nextVNode.attrs)), false));
    try {
        for (var attrNames_2 = __values(attrNames), attrNames_2_1 = attrNames_2.next(); !attrNames_2_1.done; attrNames_2_1 = attrNames_2.next()) {
            var attrName = attrNames_2_1.value;
            var prevAttrValue = vNode.attrs[attrName];
            var nextAttrValue = nextVNode.attrs[attrName];
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
                    upgradeInputAttributes({
                        tagName: nextVNode.name,
                        value: nextAttrValue,
                        attrName: attrName,
                        element: element,
                    });
                    element.setAttribute(attrName, nextAttrValue);
                }
            }
            else {
                element.removeAttribute(attrName);
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (attrNames_2_1 && !attrNames_2_1.done && (_a = attrNames_2.return)) _a.call(attrNames_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
}
function upgradeInputAttributes(options) {
    var tagName = options.tagName, element = options.element, attrName = options.attrName, value = options.value;
    var map = {
        input: function () {
            var attrsMap = {
                value: true,
                checked: true,
            };
            if (attrsMap[attrName]) {
                element[attrName] = value;
            }
        },
        option: function () {
            var attrsMap = {
                selected: true,
            };
            if (attrsMap[attrName]) {
                element[attrName] = value;
            }
        },
    };
    map[tagName] && map[tagName]();
}
function getParentFiberWithNativeElement(fiber) {
    var nextFiber = fiber.parent;
    if ((0,_portal__WEBPACK_IMPORTED_MODULE_1__.detectIsPortal)(fiber.instance))
        return fiber;
    while (nextFiber && !nextFiber.nativeElement) {
        if ((0,_portal__WEBPACK_IMPORTED_MODULE_1__.detectIsPortal)(nextFiber.instance)) {
            nextFiber.nativeElement = (0,_portal__WEBPACK_IMPORTED_MODULE_1__.getPortalContainer)(nextFiber.instance);
        }
        else {
            nextFiber = nextFiber.parent;
        }
    }
    return nextFiber;
}
function canTakeNodeFromCache(fiber, parentFiber) {
    var nextFiber = fiber;
    while (nextFiber) {
        if (nextFiber.alternate) {
            var alternate = nextFiber.alternate;
            var isEmptyNode = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsCommentVirtualNode)(alternate.instance) && alternate.instance.value === _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.EMPTY_NODE;
            return isEmptyNode;
        }
        nextFiber = nextFiber.parent;
        if (nextFiber === parentFiber)
            return false;
    }
    return false;
}
function isEndOfInsertion(fiber, parentFiber) {
    var nextFiber = fiber;
    do {
        if (!nextFiber)
            return false;
        nextFiber = nextFiber.nextSibling || nextFiber.parent.nextSibling;
        if (nextFiber && nextFiber.parent === parentFiber)
            break;
    } while (!nextFiber);
    if (nextFiber.effectTag === _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.EffectTag.UPDATE) {
        return true;
    }
    return false;
}
function getNodeOnTheRight(fiber, parentElement) {
    var nextFiber = fiber;
    var isDeepWalking = true;
    while (nextFiber) {
        if (nextFiber.nativeElement && nextFiber.nativeElement.parentElement === parentElement) {
            return nextFiber.nativeElement;
        }
        if (nextFiber.nativeElement && !nextFiber.mountedToHost) {
            isDeepWalking = false;
        }
        if (nextFiber.child && isDeepWalking) {
            nextFiber = nextFiber.child;
        }
        else if (nextFiber.nextSibling) {
            isDeepWalking = true;
            nextFiber = nextFiber.nextSibling;
        }
        else if (nextFiber.parent && nextFiber.parent.nativeElement !== parentElement) {
            isDeepWalking = false;
            nextFiber = nextFiber.parent;
        }
        else {
            nextFiber = null;
        }
    }
    return null;
}
function detectIsSvgElement(tagName) {
    var tagMap = {
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
function commitPlacement(fiber, parentFiber) {
    var fromHookUpdate = _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.fromHookUpdateHelper.get();
    var parentNativeElement = parentFiber.nativeElement;
    var cachedNode = nodeCacheMap.get(parentNativeElement);
    var node = parentFiber.alternate
        ? !(0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsUndefined)(cachedNode) && canTakeNodeFromCache(fiber, parentFiber)
            ? cachedNode
            : cachedNode === null
                ? null
                : getNodeOnTheRight(fiber, parentNativeElement)
        : fromHookUpdate
            ? getNodeOnTheRight(fiber, parentNativeElement)
            : null;
    nodeCacheMap.set(parentNativeElement, node);
    if (node) {
        parentNativeElement.insertBefore(fiber.nativeElement, node);
        fiber.mountedToHost = true;
        if (isEndOfInsertion(fiber, parentFiber)) {
            nodeCacheMap.delete(parentNativeElement);
        }
    }
    else {
        var fragment_1 = fragmentsMap.get(parentNativeElement);
        if ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsUndefined)(fragment_1)) {
            fragment_1 = document.createDocumentFragment();
            fragmentsMap.set(parentNativeElement, fragment_1);
        }
        fragment_1.appendChild(fiber.nativeElement);
        fiber.mountedToHost = true;
        fragmentsCallbacks.push(function () {
            parentNativeElement.appendChild(fragment_1);
            fragmentsMap.delete(parentNativeElement);
            nodeCacheMap.delete(parentNativeElement);
        });
    }
    addAttributes(fiber.nativeElement, fiber.instance);
}
function commitUpdate(element, instance, nextInstance) {
    if ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsTextVirtualNode)(instance) &&
        (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsTextVirtualNode)(nextInstance) &&
        instance.value !== nextInstance.value) {
        return (element.textContent = nextInstance.value);
    }
    if ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsTagVirtualNode)(instance) && (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsTagVirtualNode)(nextInstance)) {
        return updateAttributes(element, instance, nextInstance);
    }
}
function commitDeletion(fiber, parentFiber) {
    var parentElement = parentFiber.nativeElement;
    var nextFiber = fiber;
    var isDeepWalking = true;
    var isReturn = false;
    while (nextFiber) {
        if (!isReturn) {
            if (nextFiber.nativeElement) {
                var isPortal = (0,_portal__WEBPACK_IMPORTED_MODULE_1__.detectIsPortal)(nextFiber.instance);
                !isPortal && parentElement.removeChild(nextFiber.nativeElement);
                isDeepWalking = false;
            }
        }
        if (nextFiber.child && isDeepWalking) {
            nextFiber = nextFiber.child;
            isReturn = false;
        }
        else if (nextFiber.nextSibling && nextFiber.nextSibling !== fiber.nextSibling) {
            if (nextFiber.nextSibling.effectTag === _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.EffectTag.DELETION)
                return;
            isDeepWalking = true;
            isReturn = false;
            nextFiber = nextFiber.nextSibling;
        }
        else if (nextFiber.parent &&
            nextFiber !== fiber &&
            nextFiber.parent !== fiber &&
            nextFiber.parent !== fiber.parent) {
            isDeepWalking = false;
            isReturn = true;
            nextFiber = nextFiber.parent;
        }
        else {
            nextFiber = null;
        }
    }
}
function applyCommit(fiber) {
    var parentFiber = getParentFiberWithNativeElement(fiber);
    if (fiber.nativeElement !== null && fiber.effectTag === _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.EffectTag.PLACEMENT) {
        commitPlacement(fiber, parentFiber);
    }
    else if (fiber.nativeElement !== null && fiber.effectTag === _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.EffectTag.UPDATE) {
        if (!(0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsVirtualNode)(fiber.alternate.instance) || !(0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsVirtualNode)(fiber.instance))
            return;
        var vNode = fiber.alternate.instance;
        var nextVNode = fiber.instance;
        commitUpdate(fiber.nativeElement, vNode, nextVNode);
    }
    else if (fiber.effectTag === _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.EffectTag.DELETION) {
        commitDeletion(fiber, parentFiber);
    }
}
function finishCommitWork() {
    fragmentsCallbacks.forEach(function (fn) { return fn(); });
    fragmentsCallbacks = [];
}
function resetNodeCache() {
    nodeCacheMap = new Map();
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
/* harmony export */   "createDomElement": () => (/* reexport safe */ _dom__WEBPACK_IMPORTED_MODULE_0__.createDomElement),
/* harmony export */   "finishCommitWork": () => (/* reexport safe */ _dom__WEBPACK_IMPORTED_MODULE_0__.finishCommitWork),
/* harmony export */   "resetNodeCache": () => (/* reexport safe */ _dom__WEBPACK_IMPORTED_MODULE_0__.resetNodeCache)
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

var SyntheticEvent = /** @class */ (function () {
    function SyntheticEvent(options) {
        this.type = '';
        this.sourceEvent = null;
        this.target = null;
        this.propagation = true;
        this.type = options.sourceEvent.type;
        this.sourceEvent = options.sourceEvent;
        this.target = options.target;
    }
    SyntheticEvent.prototype.stopPropagation = function () {
        this.propagation = false;
        this.sourceEvent.stopPropagation();
    };
    SyntheticEvent.prototype.preventDefault = function () {
        this.sourceEvent.preventDefault();
    };
    SyntheticEvent.prototype.getPropagation = function () {
        return this.propagation;
    };
    return SyntheticEvent;
}());
function delegateEvent(options) {
    var target = options.target, eventName = options.eventName, handler = options.handler;
    var eventsStore = _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.eventsHelper.get();
    var handlerMap = eventsStore.get(eventName);
    if (!handlerMap) {
        var rootHandler_1 = function (event) {
            var fireEvent = eventsStore.get(eventName).get(event.target);
            var target = event.target;
            var syntheticEvent = null;
            if ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsFunction)(fireEvent)) {
                syntheticEvent = new SyntheticEvent({
                    sourceEvent: event,
                    target: target,
                });
                fireEvent(syntheticEvent);
            }
            if (syntheticEvent ? syntheticEvent.getPropagation() : target.parentElement) {
                target.parentElement.dispatchEvent(new event.constructor(event.type, event));
            }
        };
        eventsStore.set(eventName, new WeakMap([[target, handler]]));
        document.addEventListener(eventName, rootHandler_1, true);
        _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.eventsHelper.addUnsubscriber(function () { return document.removeEventListener(eventName, rootHandler_1, true); });
    }
    else {
        handlerMap.set(target, handler);
    }
}
var detectIsEvent = function (attrName) { return attrName.startsWith('on'); };
var getEventName = function (attrName) { return attrName.slice(2, attrName.length).toLowerCase(); };



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

var $$portal = Symbol('portal');
function createPortal(slot, container) {
    var _a;
    if (!(container instanceof Element)) {
        throw new Error("[Dark]: createPortal receives only Element as container!");
    }
    return Portal((_a = {}, _a[$$portal] = container, _a.slot = slot, _a));
}
var Portal = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.createComponent)(function (_a) {
    var slot = _a.slot, rest = __rest(_a, ["slot"]);
    (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () { return (rest[$$portal].innerHTML = ''); }, []);
    return slot;
}, { token: $$portal });
var detectIsPortal = function (factory) {
    return (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsComponentFactory)(factory) && factory.token === $$portal;
};
var getPortalContainer = function (factory) {
    return detectIsPortal(factory) ? factory.props[$$portal] : null;
};
function unmountPortal(fiber) {
    var container = getPortalContainer(fiber.instance);
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
/* harmony import */ var _scheduling__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../scheduling */ "./src/scheduling/index.ts");




_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.scheduleCallback = _scheduling__WEBPACK_IMPORTED_MODULE_3__.scheduleCallback;
_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.shouldYeildToHost = _scheduling__WEBPACK_IMPORTED_MODULE_3__.shouldYeildToHost;
_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.createNativeElement = _dom__WEBPACK_IMPORTED_MODULE_1__.createDomElement;
_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.applyCommit = _dom__WEBPACK_IMPORTED_MODULE_1__.applyCommit;
_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.finishCommitWork = _dom__WEBPACK_IMPORTED_MODULE_1__.finishCommitWork;
_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.detectIsPortal = _portal__WEBPACK_IMPORTED_MODULE_2__.detectIsPortal;
_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.unmountPortal = _portal__WEBPACK_IMPORTED_MODULE_2__.unmountPortal;
var roots = new Map();
function render(element, container) {
    if (!(container instanceof Element)) {
        throw new Error("[Dark]: render receives only Element as container!");
    }
    var isMounted = !(0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsUndefined)(roots.get(container));
    var rootId = null;
    if (!isMounted) {
        rootId = roots.size;
        roots.set(container, rootId);
        container.innerHTML = '';
    }
    else {
        rootId = roots.get(container);
    }
    var callback = function () {
        _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.effectStoreHelper.set(rootId); // important order!
        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.resetNodeCache)();
        var currentRootFiber = _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.currentRootHelper.get();
        var fiber = new _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.Fiber({
            nativeElement: container,
            instance: new _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.TagVirtualNode({
                name: _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.ROOT,
                children: (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.flatten)([element || (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.createEmptyVirtualNode)()]),
            }),
            alternate: currentRootFiber,
            effectTag: isMounted ? _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.EffectTag.UPDATE : _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.EffectTag.PLACEMENT,
        });
        currentRootFiber && (currentRootFiber.alternate = null);
        _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.fiberMountHelper.reset();
        _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.wipRootHelper.set(fiber);
        _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.nextUnitOfWorkHelper.set(fiber);
    };
    _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.scheduleCallback(callback, { priority: _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.TaskPriority.NORMAL });
}



/***/ }),

/***/ "./src/scheduling/index.ts":
/*!*********************************!*\
  !*** ./src/scheduling/index.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TaskPriority": () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_1__.TaskPriority),
/* harmony export */   "scheduleCallback": () => (/* reexport safe */ _scheduling__WEBPACK_IMPORTED_MODULE_0__.scheduleCallback),
/* harmony export */   "shouldYeildToHost": () => (/* reexport safe */ _scheduling__WEBPACK_IMPORTED_MODULE_0__.shouldYeildToHost)
/* harmony export */ });
/* harmony import */ var _scheduling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scheduling */ "./src/scheduling/scheduling.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ "./src/scheduling/types.ts");




/***/ }),

/***/ "./src/scheduling/scheduling.ts":
/*!**************************************!*\
  !*** ./src/scheduling/scheduling.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "scheduleCallback": () => (/* binding */ scheduleCallback),
/* harmony export */   "shouldYeildToHost": () => (/* binding */ shouldYeildToHost)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dark-engine/core */ "@dark-engine/core");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__);
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

var queueByPriority = {
    hight: [],
    normal: [],
    low: [],
};
var YEILD_INTERVAL = 10;
var scheduledCallback = null;
var deadline = 0;
var isMessageLoopRunning = false;
var currentTask = null;
var Task = /** @class */ (function () {
    function Task(options) {
        this.id = ++Task.nextTaskId;
        this.time = options.time;
        this.timeoutMs = options.timeoutMs;
        this.priority = options.priority;
        this.callback = options.callback;
    }
    Task.nextTaskId = 0;
    return Task;
}());
var shouldYeildToHost = function () { return (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.getTime)() >= deadline; };
function scheduleCallback(callback, options) {
    var _a;
    var _b = options || {}, _c = _b.priority, priority = _c === void 0 ? _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.TaskPriority.NORMAL : _c, timeoutMs = _b.timeoutMs;
    var task = new Task({ time: (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.getTime)(), timeoutMs: timeoutMs, priority: priority, callback: callback });
    var map = (_a = {},
        _a[_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.TaskPriority.HIGH] = function () { return queueByPriority.hight.push(task); },
        _a[_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.TaskPriority.NORMAL] = function () { return queueByPriority.normal.push(task); },
        _a[_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.TaskPriority.LOW] = function () { return queueByPriority.low.push(task); },
        _a);
    map[task.priority]();
    executeTasks();
}
function pick(queue) {
    if (!queue.length)
        return false;
    currentTask = queue.shift();
    currentTask.callback();
    requestCallback(_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.workLoop);
    return true;
}
function executeTasks() {
    var isBusy = Boolean(_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.wipRootHelper.get());
    if (!isBusy) {
        checkOverdueTasks() ||
            pick(queueByPriority.hight) ||
            pick(queueByPriority.normal) ||
            requestIdleCallback(function () { return pick(queueByPriority.low); });
    }
}
function checkOverdueTasks() {
    var _a = __read(queueByPriority.low, 1), task = _a[0];
    if (task && task.timeoutMs > 0 && (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.getTime)() - task.time > task.timeoutMs) {
        pick(queueByPriority.low);
        return true;
    }
    return false;
}
function performWorkUntilDeadline() {
    if (scheduledCallback) {
        deadline = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.getTime)() + YEILD_INTERVAL;
        try {
            var hasMoreWork = scheduledCallback();
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
var channel = null;
var port = null;
function setup() {
    if (false) {}
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = performWorkUntilDeadline;
}
setup();



/***/ }),

/***/ "./src/scheduling/types.ts":
/*!*********************************!*\
  !*** ./src/scheduling/types.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TaskPriority": () => (/* binding */ TaskPriority)
/* harmony export */ });
var TaskPriority;
(function (TaskPriority) {
    TaskPriority[TaskPriority["HIGH"] = 2] = "HIGH";
    TaskPriority[TaskPriority["NORMAL"] = 1] = "NORMAL";
})(TaskPriority || (TaskPriority = {}));


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

function styled(strings) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var style = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
        return strings
            .map(function (x, idx) { return x + (!(0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsUndefined)(args[idx]) ? args[idx] : ''); })
            .join('')
            .replace(/;\s*/gm, ';')
            .replace(/:\s*/gm, ':')
            .trim();
    }, __spreadArray([strings], __read(args), false));
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
/* harmony export */   "useStyle": () => (/* reexport safe */ _use_style__WEBPACK_IMPORTED_MODULE_3__.useStyle)
/* harmony export */ });
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./render */ "./src/render/index.ts");
/* harmony import */ var _create_root__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./create-root */ "./src/create-root/index.ts");
/* harmony import */ var _portal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./portal */ "./src/portal/index.ts");
/* harmony import */ var _use_style__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./use-style */ "./src/use-style/index.ts");





})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=dark-platform-browser.development.js.map