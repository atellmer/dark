/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../contract/index.ts":
/*!****************************!*\
  !*** ../contract/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ApiProvider": () => (/* binding */ ApiProvider),
/* harmony export */   "useApi": () => (/* binding */ useApi)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/context/context.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/component/component.ts");

const ApiContext = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.createContext)(null, { displayName: 'Api' });
const useApi = () => (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.useContext)(ApiContext);
const ApiProvider = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_1__.component)(({ api, slot }) => {
    return ApiContext.Provider({ value: api, slot });
});



/***/ }),

/***/ "./api/index.ts":
/*!**********************!*\
  !*** ./api/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "api": () => (/* binding */ api)
/* harmony export */ });
const HEADERS = { 'Content-Type': 'application/json' };
const api = {
    marker: 'frontend',
    async fetchProducts() {
        const response = await fetch('/api/products');
        checkResponse(response);
        const data = (await response.json());
        return data;
    },
    async addProduct(product) {
        const response = await fetch(`/api/products`, {
            method: 'post',
            headers: HEADERS,
            body: JSON.stringify({ ...product, id: undefined }),
        });
        checkResponse(response);
        const data = (await response.json());
        return data;
    },
    async fetchProduct(id) {
        checkId(id);
        const response = await fetch(`/api/products/${id}`);
        checkResponse(response);
        const data = (await response.json());
        return data;
    },
    async changeProduct(id, product) {
        checkId(id);
        if (!product)
            return null;
        const response = await fetch(`/api/products/${id}`, {
            method: 'put',
            headers: HEADERS,
            body: JSON.stringify(product),
        });
        checkResponse(response);
        const data = (await response.json());
        return data;
    },
    async removeProduct(id) {
        checkId(id);
        const response = await fetch(`/api/products/${id}`, { method: 'delete' });
        checkResponse(response);
        const data = (await response.json());
        return data;
    },
};
function checkId(id) {
    const isValid = typeof id === 'number' && !Number.isNaN(id);
    if (!isValid) {
        throw new Error('Invalid id!');
    }
}
function checkResponse(response) {
    if (!response.ok)
        throw new Error(`${response.status}`);
}



/***/ }),

/***/ "./bootstrap.tsx":
/*!***********************!*\
  !*** ./bootstrap.tsx ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bootstrap": () => (/* binding */ bootstrap)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/element/element.ts");
/* harmony import */ var _dark_engine_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @dark-engine/platform-browser */ "../../../packages/platform-browser/src/hydrate-root/hydrate-root.tsx");
/* harmony import */ var _components_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/app */ "./components/app.tsx");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./api */ "./api/index.ts");




function bootstrap() {
    (0,_dark_engine_platform_browser__WEBPACK_IMPORTED_MODULE_2__.hydrateRoot)(document.getElementById('root'), (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_3__.h)(_components_app__WEBPACK_IMPORTED_MODULE_0__.App, { api: _api__WEBPACK_IMPORTED_MODULE_1__.api }));
}



/***/ }),

/***/ "./components/app.tsx":
/*!****************************!*\
  !*** ./components/app.tsx ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "App": () => (/* binding */ App)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/lazy/lazy.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/component/component.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/use-memo/use-memo.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/cache/cache.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/use-effect/use-effect.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/element/element.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/fragment/fragment.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/suspense/suspense.ts");
/* harmony import */ var _dark_engine_web_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @dark-engine/web-router */ "../../../packages/web-router/src/router/router.tsx");
/* harmony import */ var _dark_engine_web_router__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @dark-engine/web-router */ "../../../packages/web-router/src/router-link/router-link.tsx");
/* harmony import */ var _contract__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../contract */ "../contract/index.ts");
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui */ "./components/ui.tsx");




const Products = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.lazy)(() => __webpack_require__.e(/*! import() */ "components_products_tsx").then(__webpack_require__.bind(__webpack_require__, /*! ./products */ "./components/products.tsx")));
const ProductList = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.lazy)(() => __webpack_require__.e(/*! import() */ "components_product-list_tsx").then(__webpack_require__.bind(__webpack_require__, /*! ./product-list */ "./components/product-list.tsx")));
const ProductAdd = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.lazy)(() => __webpack_require__.e(/*! import() */ "components_product-add_tsx").then(__webpack_require__.bind(__webpack_require__, /*! ./product-add */ "./components/product-add.tsx")));
const ProductEdit = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.lazy)(() => Promise.all(/*! import() */[__webpack_require__.e("hooks_index_ts-packages_web-router_src_use-match_use-match_ts-packages_web-router_src_use-par-e1d4d3"), __webpack_require__.e("components_product-edit_tsx")]).then(__webpack_require__.bind(__webpack_require__, /*! ./product-edit */ "./components/product-edit.tsx")));
const ProductRemove = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.lazy)(() => Promise.all(/*! import() */[__webpack_require__.e("hooks_index_ts-packages_web-router_src_use-match_use-match_ts-packages_web-router_src_use-par-e1d4d3"), __webpack_require__.e("components_product-remove_tsx")]).then(__webpack_require__.bind(__webpack_require__, /*! ./product-remove */ "./components/product-remove.tsx")));
const ProductCard = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.lazy)(() => Promise.all(/*! import() */[__webpack_require__.e("hooks_index_ts-packages_web-router_src_use-match_use-match_ts-packages_web-router_src_use-par-e1d4d3"), __webpack_require__.e("components_product-card_tsx")]).then(__webpack_require__.bind(__webpack_require__, /*! ./product-card */ "./components/product-card.tsx")));
const ProductAnalytics = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.lazy)(() => __webpack_require__.e(/*! import() */ "components_product-analytics_tsx").then(__webpack_require__.bind(__webpack_require__, /*! ./product-analytics */ "./components/product-analytics.tsx")));
const ProductBalance = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.lazy)(() => __webpack_require__.e(/*! import() */ "components_product-balance_tsx").then(__webpack_require__.bind(__webpack_require__, /*! ./product-balance */ "./components/product-balance.tsx")));
const Operations = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.lazy)(() => __webpack_require__.e(/*! import() */ "components_operations_tsx").then(__webpack_require__.bind(__webpack_require__, /*! ./operations */ "./components/operations.tsx")));
const Invoices = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.lazy)(() => __webpack_require__.e(/*! import() */ "components_invoices_tsx").then(__webpack_require__.bind(__webpack_require__, /*! ./invoices */ "./components/invoices.tsx")));
const routes = [
    {
        path: 'products',
        component: Products,
        children: [
            {
                path: 'list',
                component: ProductList,
                children: [
                    {
                        path: 'add',
                        component: ProductAdd,
                    },
                    {
                        path: ':id',
                        component: ProductCard,
                        children: [
                            {
                                path: 'edit',
                                component: ProductEdit,
                            },
                            {
                                path: 'remove',
                                component: ProductRemove,
                            },
                        ],
                    },
                ],
            },
            {
                path: 'analytics',
                component: ProductAnalytics,
            },
            {
                path: 'balance',
                component: ProductBalance,
            },
            {
                path: '',
                redirectTo: 'list',
            },
            {
                path: '**',
                redirectTo: 'list',
            },
        ],
    },
    {
        path: 'operations',
        component: Operations,
    },
    {
        path: 'invoices',
        component: Invoices,
    },
    {
        path: '',
        redirectTo: 'products',
    },
    {
        path: '**',
        redirectTo: 'products',
    },
];
const App = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_3__.component)(({ url, api }) => {
    const cache = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => new _dark_engine_core__WEBPACK_IMPORTED_MODULE_5__.InMemoryCache(), []);
    (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_6__.useEffect)(() => {
        cache.monitor(x => console.log(x));
    }, []);
    return ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_7__.h)(_dark_engine_core__WEBPACK_IMPORTED_MODULE_8__.Fragment, null,
        (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_7__.h)(_ui__WEBPACK_IMPORTED_MODULE_1__.GlobalStyle, null),
        (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_7__.h)(_contract__WEBPACK_IMPORTED_MODULE_0__.ApiProvider, { api: api },
            (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_7__.h)(_dark_engine_core__WEBPACK_IMPORTED_MODULE_5__.CacheProvider, { cache: cache },
                (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_7__.h)(_dark_engine_web_router__WEBPACK_IMPORTED_MODULE_9__.Router, { routes: routes, url: url }, slot => {
                    return ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_7__.h)(_dark_engine_core__WEBPACK_IMPORTED_MODULE_10__.Suspense, { fallback: (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_7__.h)(_ui__WEBPACK_IMPORTED_MODULE_1__.Spinner, null) },
                        (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_7__.h)(_ui__WEBPACK_IMPORTED_MODULE_1__.Root, null,
                            (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_7__.h)(_ui__WEBPACK_IMPORTED_MODULE_1__.Header, null,
                                (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_7__.h)(_dark_engine_web_router__WEBPACK_IMPORTED_MODULE_11__.RouterLink, { to: '/products' }, "Products"),
                                (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_7__.h)(_dark_engine_web_router__WEBPACK_IMPORTED_MODULE_11__.RouterLink, { to: '/operations' }, "Operations"),
                                (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_7__.h)(_dark_engine_web_router__WEBPACK_IMPORTED_MODULE_11__.RouterLink, { to: '/invoices' }, "Invoices")),
                            (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_7__.h)(_ui__WEBPACK_IMPORTED_MODULE_1__.Content, null, slot),
                            (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_7__.h)(_ui__WEBPACK_IMPORTED_MODULE_1__.Footer, null,
                                "\u00A9 ",
                                new Date().getFullYear(),
                                " Some Cool Company Ltd."))));
                })))));
});



/***/ }),

/***/ "./components/ui.tsx":
/*!***************************!*\
  !*** ./components/ui.tsx ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AnimationFade": () => (/* binding */ AnimationFade),
/* harmony export */   "Button": () => (/* binding */ Button),
/* harmony export */   "Card": () => (/* binding */ Card),
/* harmony export */   "Content": () => (/* binding */ Content),
/* harmony export */   "Error": () => (/* binding */ Error),
/* harmony export */   "Footer": () => (/* binding */ Footer),
/* harmony export */   "Form": () => (/* binding */ Form),
/* harmony export */   "GlobalStyle": () => (/* binding */ GlobalStyle),
/* harmony export */   "Header": () => (/* binding */ Header),
/* harmony export */   "Input": () => (/* binding */ Input),
/* harmony export */   "List": () => (/* binding */ List),
/* harmony export */   "ListItem": () => (/* binding */ ListItem),
/* harmony export */   "Root": () => (/* binding */ Root),
/* harmony export */   "Spinner": () => (/* binding */ Spinner),
/* harmony export */   "Textarea": () => (/* binding */ Textarea)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/component/component.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/element/element.ts");
/* harmony import */ var _dark_engine_styled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dark-engine/styled */ "../../../packages/styled/src/global/global.ts");
/* harmony import */ var _dark_engine_styled__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @dark-engine/styled */ "../../../packages/styled/src/keyframes/keyframes.ts");
/* harmony import */ var _dark_engine_styled__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @dark-engine/styled */ "../../../packages/styled/src/styled/styled.ts");


const GlobalStyle = _dark_engine_styled__WEBPACK_IMPORTED_MODULE_0__.createGlobalStyle `
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
  }

  body {
    font-family: sans-serif;
    line-height: 1.4;
    background-color: #1A237E;
    overflow-y: scroll;
  }

  a {
    margin: 4px;
    color: blue;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  .router-link-active, .router-link-active:hover {
    color: #ffeb3b;
    text-decoration: underline;
  }

  .router-back-link, .router-back-link:hover {
    color: #fff;
  }
`;
const Error = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_1__.component)(({ value }) => (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.h)("div", null,
    value,
    " \uD83E\uDEE0"));
const rotate = _dark_engine_styled__WEBPACK_IMPORTED_MODULE_3__.keyframes `
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;
const SpinnerRoot = _dark_engine_styled__WEBPACK_IMPORTED_MODULE_4__.styled.div `
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const SpinnerHydrogen = _dark_engine_styled__WEBPACK_IMPORTED_MODULE_4__.styled.div `
  width: 64px;
  height: 64px;
  clear: both;
  margin: 20px auto;
  position: relative;
  border: 1px #000 solid;
  border-radius: 50%;
  animation: ${rotate} 0.6s infinite linear;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: #000;
    border-radius: 50%;
  }

  &::before {
    top: calc(50% - 5px);
    left: calc(50% - 5px);
  }

  &::after {
    top: -1px;
    left: -1px;
  }
`;
const Spinner = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_1__.component)(() => ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.h)(SpinnerRoot, null,
    (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.h)(SpinnerHydrogen, null))));
const fade = _dark_engine_styled__WEBPACK_IMPORTED_MODULE_3__.keyframes `
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;
const AnimationFade = _dark_engine_styled__WEBPACK_IMPORTED_MODULE_4__.styled.div `
  animation-name: ${fade};
  animation-iteration-count: 1;
  animation-duration: 300ms;
  animation-fill-mode: both;
  animation-timing-function: ease-in-out;
`;
const Root = _dark_engine_styled__WEBPACK_IMPORTED_MODULE_4__.styled.div `
  height: 100vh;
  width: 1200px;
  max-width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 64px minmax(max-content, 1fr) 64px;
`;
const Header = _dark_engine_styled__WEBPACK_IMPORTED_MODULE_4__.styled.header `
  width: 100%;
  background-color: ${p => (p.$nested ? '#673ab7' : '#03a9f4')};
  padding: 16px;
  color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  display: flex;
  align-items: center;

  & a {
    text-transform: uppercase;
    font-size: 0.9rem;
  }

  & a:not(.router-link-active) {
    color: #fff;
  }

  & a:hover {
    text-decoration: underline;
  }
`;
const Content = _dark_engine_styled__WEBPACK_IMPORTED_MODULE_4__.styled.main `
  padding: 0 16px 16px;
  background-color: #fff8e1;
`;
const Footer = _dark_engine_styled__WEBPACK_IMPORTED_MODULE_4__.styled.footer `
  padding: 16px;
  background-color: #880e4f;
  color: #fff;
`;
const Card = _dark_engine_styled__WEBPACK_IMPORTED_MODULE_4__.styled.article `
  padding: 16px;
  opacity: ${p => (p.$loading ? 0.2 : 1)};
  transition: opacity 0.2s ease-in-out;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`;
const Input = _dark_engine_styled__WEBPACK_IMPORTED_MODULE_4__.styled.input `
  border: 1px solid blue;
  height: 30px;
  padding: 6px;
`;
const Textarea = _dark_engine_styled__WEBPACK_IMPORTED_MODULE_4__.styled.textarea `
  border: 1px solid blue;
  resize: none;
  min-height: 30px;
  padding: 6px;
`;
const Form = _dark_engine_styled__WEBPACK_IMPORTED_MODULE_4__.styled.form `
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(5, auto);
  grid-gap: 8px;
  margin-bottom: 10px;
`;
const Button = _dark_engine_styled__WEBPACK_IMPORTED_MODULE_4__.styled.button `
  padding: 6px 8px;
  background-color: #2196f3;
  color: #fff;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  display: inline-block;
  text-decoration: none;
  line-height: 1.7;
  font-size: 0.9rem;
  margin: 0;

  &:hover {
    text-decoration: none;
  }

  ${Card} &:not(:last-child) {
    margin-right: 6px;
  }
`;
const List = _dark_engine_styled__WEBPACK_IMPORTED_MODULE_4__.styled.ul `
  list-style: none;
  padding: 0;
  margin: 0;
`;
const ListItem = _dark_engine_styled__WEBPACK_IMPORTED_MODULE_4__.styled.li `
  width: 100%;
  background-color: #fff;
  margin: 6px 0;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

  &:first-child {
    margin-top: 0;
  }
`;



/***/ }),

/***/ "../../../packages/core/src/batch/batch.ts":
/*!*************************************************!*\
  !*** ../../../packages/core/src/batch/batch.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addBatch": () => (/* binding */ addBatch),
/* harmony export */   "batch": () => (/* binding */ batch)
/* harmony export */ });
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scope */ "../../../packages/core/src/scope/scope.ts");

function batch(callback) {
    const $scope = (0,_scope__WEBPACK_IMPORTED_MODULE_0__.$$scope)();
    $scope.setIsBatchZone(true);
    callback();
    $scope.setIsBatchZone(false);
}
function addBatch(fiber, callback, change) {
    const $scope = (0,_scope__WEBPACK_IMPORTED_MODULE_0__.$$scope)();
    if ($scope.getIsTransitionZone()) {
        callback();
    }
    else {
        const batch = fiber.batch || { timer: null, changes: [] };
        fiber.batch = batch;
        batch.changes.push(change);
        batch.timer && clearTimeout(batch.timer);
        batch.timer = setTimeout(() => {
            batch.changes.splice(-1);
            batch.changes.forEach(x => x());
            fiber.batch = null;
            callback();
        });
    }
}



/***/ }),

/***/ "../../../packages/core/src/cache/cache.ts":
/*!*************************************************!*\
  !*** ../../../packages/core/src/cache/cache.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CACHE_ROOT_ID": () => (/* binding */ CACHE_ROOT_ID),
/* harmony export */   "CacheProvider": () => (/* binding */ CacheProvider),
/* harmony export */   "InMemoryCache": () => (/* binding */ InMemoryCache),
/* harmony export */   "MonitorEventType": () => (/* binding */ MonitorEventType),
/* harmony export */   "checkCache": () => (/* binding */ checkCache),
/* harmony export */   "useCache": () => (/* binding */ useCache)
/* harmony export */ });
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../context */ "../../../packages/core/src/context/context.ts");
/* harmony import */ var _emitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../emitter */ "../../../packages/core/src/emitter/emitter.ts");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../component */ "../../../packages/core/src/component/component.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "../../../packages/core/src/utils/utils.ts");




class InMemoryCache {
    state;
    emitter1 = new _emitter__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    emitter2 = new _emitter__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    keys = new Set();
    constructor(state) {
        this.state = state || {};
    }
    getState() {
        return this.state;
    }
    read({ key, id = CACHE_ROOT_ID }) {
        const map = this.state[key];
        const record = (map?.[id] || null);
        return record;
    }
    write({ key, id = CACHE_ROOT_ID, data }) {
        if (!this.state[key])
            this.state[key] = {};
        const map = this.state[key];
        const record = { id, valid: true, modifiedAt: (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getTime)(), data };
        map[id] = record;
        this.emitter1.emit('change', { type: 'write', key, id, record });
    }
    optimistic({ key, id = CACHE_ROOT_ID, data }) {
        if (!this.state[key])
            this.state[key] = {};
        const map = this.state[key];
        const record = { id, valid: false, modifiedAt: (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getTime)(), data };
        map[id] = record;
        this.emitter1.emit('change', { type: 'optimistic', key, id, record });
    }
    invalidate({ key, id = CACHE_ROOT_ID }) {
        const map = this.state[key];
        if (!map)
            return;
        const record = map[id];
        if (!record)
            return;
        record.valid = false;
        this.emitter1.emit('change', { type: 'invalidate', key, id, record });
    }
    delete({ key, id = CACHE_ROOT_ID }) {
        if (!this.state[key])
            return;
        const map = this.state[key];
        delete map[id];
        this.emitter1.emit('change', { type: 'delete', key, id });
    }
    subscribe(subscriber) {
        return this.emitter1.on('change', subscriber);
    }
    monitor(subscriber) {
        return this.emitter2.on('change', subscriber);
    }
    __emit(data) {
        this.emitter2.emit('change', data);
    }
    __canUpdate(key) {
        if (!this.keys.has(key)) {
            this.keys.add(key);
            (0,_utils__WEBPACK_IMPORTED_MODULE_1__.nextTick)(() => this.keys.delete(key));
            return true;
        }
        return false;
    }
}
const CacheContext = (0,_context__WEBPACK_IMPORTED_MODULE_2__.createContext)(null, { displayName: 'InMemoryCache' });
const useCache = () => (0,_context__WEBPACK_IMPORTED_MODULE_2__.useContext)(CacheContext);
const CacheProvider = (0,_component__WEBPACK_IMPORTED_MODULE_3__.component)(({ cache, slot }) => {
    if (useCache())
        throw new Error('[Dark]: illegal cache provider!');
    return CacheContext.Provider({ value: cache, slot });
});
var MonitorEventType;
(function (MonitorEventType) {
    MonitorEventType["QUERY"] = "QUERY";
    MonitorEventType["MUTATION"] = "MUTATION";
})(MonitorEventType || (MonitorEventType = {}));
function checkCache(cache) {
    if (!cache)
        throw new Error('[Dark]: the hook requires a cache provider with a cache!');
}
const CACHE_ROOT_ID = '__ROOT__';



/***/ }),

/***/ "../../../packages/core/src/component/component.ts":
/*!*********************************************************!*\
  !*** ../../../packages/core/src/component/component.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$$inject": () => (/* binding */ $$inject),
/* harmony export */   "Component": () => (/* binding */ Component),
/* harmony export */   "component": () => (/* binding */ component),
/* harmony export */   "detectIsComponent": () => (/* binding */ detectIsComponent),
/* harmony export */   "getComponentKey": () => (/* binding */ getComponentKey),
/* harmony export */   "hasComponentFlag": () => (/* binding */ hasComponentFlag)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "../../../packages/core/src/constants.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "../../../packages/core/src/utils/utils.ts");


const $$inject = Symbol('inject');
class Component {
    type;
    props;
    ref;
    token;
    displayName;
    shouldUpdate;
    children = [];
    constructor(type, token, props, ref, shouldUpdate, displayName) {
        this.type = type;
        this.props = props;
        ref && (this.ref = ref);
        token && (this.token = token);
        shouldUpdate && (this.shouldUpdate = shouldUpdate);
        displayName && (this.displayName = displayName);
    }
}
function component(type, options = {}) {
    const { token: $token, displayName } = options;
    const factory = (props = {}, ref) => {
        const { token = $token, shouldUpdate } = factory[$$inject] || defaultInject;
        if (props.ref) {
            delete props.ref;
            if (true) {
                 true &&
                    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.error)(`[Dark]: to use ref you need to wrap the component with forwardRef!`);
            }
        }
        return new Component(type, token, props, ref, shouldUpdate, displayName);
    };
    return factory;
}
const defaultInject = {};
const detectIsComponent = (x) => x instanceof Component;
const getComponentKey = (x) => x.props[_constants__WEBPACK_IMPORTED_MODULE_1__.KEY_ATTR] ?? null;
const hasComponentFlag = (inst, flag) => Boolean(inst.props[flag]);



/***/ }),

/***/ "../../../packages/core/src/constants.ts":
/*!***********************************************!*\
  !*** ../../../packages/core/src/constants.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "APP_STATE_ATTR": () => (/* binding */ APP_STATE_ATTR),
/* harmony export */   "ASYNC_EFFECT_HOST_MASK": () => (/* binding */ ASYNC_EFFECT_HOST_MASK),
/* harmony export */   "ATOM_HOST_MASK": () => (/* binding */ ATOM_HOST_MASK),
/* harmony export */   "ATTR_BLACK_LIST": () => (/* binding */ ATTR_BLACK_LIST),
/* harmony export */   "CREATE_EFFECT_TAG": () => (/* binding */ CREATE_EFFECT_TAG),
/* harmony export */   "DELETE_EFFECT_TAG": () => (/* binding */ DELETE_EFFECT_TAG),
/* harmony export */   "FLAGS": () => (/* binding */ FLAGS),
/* harmony export */   "FLUSH_MASK": () => (/* binding */ FLUSH_MASK),
/* harmony export */   "Flag": () => (/* binding */ Flag),
/* harmony export */   "HOOK_DELIMETER": () => (/* binding */ HOOK_DELIMETER),
/* harmony export */   "INDEX_KEY": () => (/* binding */ INDEX_KEY),
/* harmony export */   "INSERTION_EFFECT_HOST_MASK": () => (/* binding */ INSERTION_EFFECT_HOST_MASK),
/* harmony export */   "KEY_ATTR": () => (/* binding */ KEY_ATTR),
/* harmony export */   "LAYOUT_EFFECT_HOST_MASK": () => (/* binding */ LAYOUT_EFFECT_HOST_MASK),
/* harmony export */   "MOVE_MASK": () => (/* binding */ MOVE_MASK),
/* harmony export */   "PORTAL_HOST_MASK": () => (/* binding */ PORTAL_HOST_MASK),
/* harmony export */   "REF_ATTR": () => (/* binding */ REF_ATTR),
/* harmony export */   "REPLACER": () => (/* binding */ REPLACER),
/* harmony export */   "ROOT": () => (/* binding */ ROOT),
/* harmony export */   "SHADOW_MASK": () => (/* binding */ SHADOW_MASK),
/* harmony export */   "SKIP_EFFECT_TAG": () => (/* binding */ SKIP_EFFECT_TAG),
/* harmony export */   "TaskPriority": () => (/* binding */ TaskPriority),
/* harmony export */   "UPDATE_EFFECT_TAG": () => (/* binding */ UPDATE_EFFECT_TAG),
/* harmony export */   "VERSION": () => (/* binding */ VERSION),
/* harmony export */   "YIELD_INTERVAL": () => (/* binding */ YIELD_INTERVAL)
/* harmony export */ });
const VERSION = '0.25.1';
const ROOT = 'dark:root';
const REPLACER = 'dark:matter';
const INDEX_KEY = 'dark:idx';
const KEY_ATTR = 'key';
const REF_ATTR = 'ref';
const CREATE_EFFECT_TAG = 'C';
const UPDATE_EFFECT_TAG = 'U';
const DELETE_EFFECT_TAG = 'D';
const SKIP_EFFECT_TAG = 'S';
const INSERTION_EFFECT_HOST_MASK = 1;
const LAYOUT_EFFECT_HOST_MASK = 2;
const ASYNC_EFFECT_HOST_MASK = 4;
const ATOM_HOST_MASK = 8;
const PORTAL_HOST_MASK = 16;
const SHADOW_MASK = 32;
const FLUSH_MASK = 64;
const MOVE_MASK = 128;
const HOOK_DELIMETER = ':';
const YIELD_INTERVAL = 6;
const APP_STATE_ATTR = 'dark-app-state';
var TaskPriority;
(function (TaskPriority) {
    TaskPriority[TaskPriority["LOW"] = 0] = "LOW";
    TaskPriority[TaskPriority["NORMAL"] = 1] = "NORMAL";
    TaskPriority[TaskPriority["HIGH"] = 2] = "HIGH";
})(TaskPriority || (TaskPriority = {}));
var Flag;
(function (Flag) {
    Flag["SKIP_SCAN_OPT"] = "__skipScanOpt";
    Flag["MEMO_SLOT_OPT"] = "__memoSlotOpt";
    Flag["STATIC_SLOT_OPT"] = "__staticSlotOpt";
})(Flag || (Flag = {}));
const FLAGS = {
    __skipScanOpt: true,
    __memoSlotOpt: true,
    __staticSlotOpt: true,
};
const ATTR_BLACK_LIST = {
    [KEY_ATTR]: true,
    [REF_ATTR]: true,
    [Flag.SKIP_SCAN_OPT]: true,
    [Flag.MEMO_SLOT_OPT]: true,
    [Flag.STATIC_SLOT_OPT]: true,
};


/***/ }),

/***/ "../../../packages/core/src/context/context.ts":
/*!*****************************************************!*\
  !*** ../../../packages/core/src/context/context.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createContext": () => (/* binding */ createContext),
/* harmony export */   "useContext": () => (/* binding */ useContext)
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component */ "../../../packages/core/src/component/component.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils */ "../../../packages/core/src/utils/utils.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../scope */ "../../../packages/core/src/scope/scope.ts");
/* harmony import */ var _use_effect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../use-effect */ "../../../packages/core/src/use-effect/use-effect.ts");
/* harmony import */ var _use_memo__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../use-memo */ "../../../packages/core/src/use-memo/use-memo.ts");
/* harmony import */ var _use_update__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../use-update */ "../../../packages/core/src/use-update/use-update.ts");






function createContext(defaultValue, options) {
    const { displayName = 'Context' } = options || {};
    const context = {
        displayName,
        defaultValue,
        Provider: null,
        Consumer: null,
    };
    context.Provider = createProvider(context, defaultValue, displayName);
    context.Consumer = createConsumer(context, displayName);
    return context;
}
function createProvider(context, defaultValue, displayName) {
    return (0,_component__WEBPACK_IMPORTED_MODULE_0__.component)(({ value = defaultValue, slot }) => {
        const fiber = (0,_scope__WEBPACK_IMPORTED_MODULE_1__.$$scope)().getCursorFiber();
        if (!fiber.provider) {
            const providerValue = {
                value,
                subscribers: new Set(),
                subscribe: (subscriber) => {
                    providerValue.subscribers.add(subscriber);
                    return () => providerValue.subscribers.delete(subscriber);
                },
            };
            fiber.provider = new Map();
            fiber.provider.set(context, providerValue);
        }
        const provider = fiber.provider.get(context);
        (0,_use_effect__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
            provider.subscribers.forEach(fn => fn(value));
        }, [value]);
        provider.value = value;
        return slot;
    }, { displayName: `${displayName}.Provider` });
}
function createConsumer(context, displayName) {
    return (0,_component__WEBPACK_IMPORTED_MODULE_0__.component)(({ slot }) => {
        const value = useContext(context);
        return (0,_utils__WEBPACK_IMPORTED_MODULE_3__.detectIsFunction)(slot) ? slot(value) : null;
    }, { displayName: `${displayName}.Consumer` });
}
function useContext(context) {
    const { defaultValue } = context;
    const fiber = (0,_scope__WEBPACK_IMPORTED_MODULE_1__.$$scope)().getCursorFiber();
    const provider = (0,_use_memo__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => getProvider(context, fiber), []);
    const value = provider ? provider.value : defaultValue;
    const update = (0,_use_update__WEBPACK_IMPORTED_MODULE_5__.useUpdate)();
    const scope = (0,_use_memo__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => ({ value }), []);
    const hasProvider = Boolean(provider);
    (0,_use_effect__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
        if (!hasProvider)
            return;
        const unsubscribe = provider.subscribe((value) => {
            if (!Object.is(scope.value, value)) {
                update();
            }
        });
        return unsubscribe;
    }, [hasProvider]);
    scope.value = value;
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

/***/ "../../../packages/core/src/element/element.ts":
/*!*****************************************************!*\
  !*** ../../../packages/core/src/element/element.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createElement": () => (/* binding */ createElement),
/* harmony export */   "h": () => (/* binding */ createElement)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "../../../packages/core/src/utils/utils.ts");
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../view */ "../../../packages/core/src/view/view.ts");


function createElement(element, props, ...slot) {
    if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.detectIsString)(element)) {
        const options = (props || {});
        options.as = element;
        options.slot = slot;
        return (0,_view__WEBPACK_IMPORTED_MODULE_1__.View)(options);
    }
    if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.detectIsFunction)(element)) {
        const options = (props || {});
        options.slot = slot.length === 1 ? slot[0] : slot;
        return element(options);
    }
    return null;
}



/***/ }),

/***/ "../../../packages/core/src/emitter/emitter.ts":
/*!*****************************************************!*\
  !*** ../../../packages/core/src/emitter/emitter.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EventEmitter": () => (/* binding */ EventEmitter)
/* harmony export */ });
class EventEmitter {
    subscribers = new Map();
    on(e, fn) {
        !this.subscribers.has(e) && this.subscribers.set(e, new Set());
        this.subscribers.get(e).add(fn);
        return () => this.subscribers.has(e) && this.subscribers.get(e).delete(fn);
    }
    emit(e, data) {
        this.subscribers.has(e) && this.subscribers.get(e).forEach(x => x(data));
    }
    kill() {
        this.subscribers = new Map();
    }
    __getSize() {
        return this.subscribers.size;
    }
}



/***/ }),

/***/ "../../../packages/core/src/fiber/fiber.ts":
/*!*************************************************!*\
  !*** ../../../packages/core/src/fiber/fiber.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Fiber": () => (/* binding */ Fiber),
/* harmony export */   "Hook": () => (/* binding */ Hook),
/* harmony export */   "getHook": () => (/* binding */ getHook)
/* harmony export */ });
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../view */ "../../../packages/core/src/view/view.ts");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../component */ "../../../packages/core/src/component/component.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "../../../packages/core/src/utils/utils.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scope */ "../../../packages/core/src/scope/scope.ts");




class Fiber {
    id = 0;
    cc = 0;
    cec = 0;
    idx = 0;
    eidx = 0;
    mask = 0;
    element = null;
    tag = null;
    parent = null;
    child = null;
    next = null;
    alt = null;
    inst = null;
    hook = null;
    provider = null;
    atoms = null;
    marker;
    batch;
    catch;
    constructor(hook = null, provider = null, idx = 0) {
        this.id = ++Fiber.nextId;
        this.idx = idx;
        hook && (this.hook = hook);
        provider && (this.provider = provider);
    }
    mutate(fiber) {
        const keys = Object.keys(fiber);
        for (const key of keys) {
            this[key] = fiber[key];
        }
        return this;
    }
    markHost(mask) {
        this.mask |= mask;
        this.parent && !(this.parent.mask & mask) && this.parent.markHost(mask);
    }
    increment(count = 1, force = false) {
        if (!this.parent)
            return;
        const $scope = (0,_scope__WEBPACK_IMPORTED_MODULE_0__.$$scope)();
        const isUpdateZone = $scope.getIsUpdateZone();
        const wipFiber = $scope.getWorkInProgress();
        const stop = isUpdateZone && wipFiber.parent === this.parent;
        if ((0,_view__WEBPACK_IMPORTED_MODULE_1__.detectIsPlainVirtualNode)(this.inst) ||
            ((0,_view__WEBPACK_IMPORTED_MODULE_1__.detectIsTagVirtualNode)(this.inst) && this.inst.children?.length === 0)) {
            this.cec = 1;
        }
        if (isUpdateZone && stop && !force)
            return;
        this.parent.cec += count;
        if (!this.parent.element) {
            this.parent.increment(count);
        }
    }
    setError(error) {
        if ((0,_utils__WEBPACK_IMPORTED_MODULE_2__.detectIsFunction)(this.catch)) {
            this.catch(error);
        }
        else if (this.parent) {
            this.parent.setError(error);
        }
    }
    static setNextId(id) {
        Fiber.nextId = id;
    }
    static nextId = 0;
}
class Hook {
    id = 0;
    idx = 0;
    values = [];
    owner = null;
    static nextId = 0;
    constructor() {
        this.id = ++Hook.nextId;
    }
}
function getHook(alt, prevInst, nextInst) {
    if (alt && (0,_view__WEBPACK_IMPORTED_MODULE_1__.detectAreSameComponentTypesWithSameKeys)(prevInst, nextInst))
        return alt.hook;
    if ((0,_component__WEBPACK_IMPORTED_MODULE_3__.detectIsComponent)(nextInst))
        return new Hook();
    return null;
}



/***/ }),

/***/ "../../../packages/core/src/fragment/fragment.ts":
/*!*******************************************************!*\
  !*** ../../../packages/core/src/fragment/fragment.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Fragment": () => (/* binding */ Fragment),
/* harmony export */   "detectIsFragment": () => (/* binding */ detectIsFragment)
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component */ "../../../packages/core/src/component/component.ts");

const $$fragment = Symbol('fragment');
const Fragment = (0,_component__WEBPACK_IMPORTED_MODULE_0__.component)(({ slot }) => slot || null, { token: $$fragment });
const detectIsFragment = (instance) => (0,_component__WEBPACK_IMPORTED_MODULE_0__.detectIsComponent)(instance) && instance.token === $$fragment;



/***/ }),

/***/ "../../../packages/core/src/lazy/lazy.ts":
/*!***********************************************!*\
  !*** ../../../packages/core/src/lazy/lazy.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "lazy": () => (/* binding */ lazy)
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../component */ "../../../packages/core/src/component/component.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "../../../packages/core/src/utils/utils.ts");
/* harmony import */ var _platform__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../platform */ "../../../packages/core/src/platform/platform.ts");
/* harmony import */ var _suspense__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../suspense */ "../../../packages/core/src/suspense/suspense.ts");
/* harmony import */ var _use_update__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../use-update */ "../../../packages/core/src/use-update/use-update.ts");
/* harmony import */ var _use_effect__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../use-effect */ "../../../packages/core/src/use-effect/use-effect.ts");
/* harmony import */ var _ref__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ref */ "../../../packages/core/src/ref/ref.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../scope */ "../../../packages/core/src/scope/scope.ts");
/* harmony import */ var _use_id__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../use-id */ "../../../packages/core/src/use-id/use-id.ts");









const $$lazy = Symbol('lazy');
const factories = new Map();
function lazy(module, done = _utils__WEBPACK_IMPORTED_MODULE_0__.dummyFn) {
    return (0,_ref__WEBPACK_IMPORTED_MODULE_1__.forwardRef)((0,_component__WEBPACK_IMPORTED_MODULE_2__.component)(function type(props, ref) {
        const { isLoaded, fallback, register, unregister } = (0,_suspense__WEBPACK_IMPORTED_MODULE_3__.useSuspense)();
        const $scope = (0,_scope__WEBPACK_IMPORTED_MODULE_4__.$$scope)();
        const update = (0,_use_update__WEBPACK_IMPORTED_MODULE_5__.useUpdate)();
        const id = (0,_use_id__WEBPACK_IMPORTED_MODULE_6__.useId)();
        const factory = factories.get(module);
        if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.detectIsUndefined)(factory)) {
            const isServer = (0,_platform__WEBPACK_IMPORTED_MODULE_7__.detectIsServer)();
            const isHydrateZone = $scope.getIsHydrateZone();
            const make = async () => {
                factories.set(module, await load(module));
                unregister(id);
                done();
            };
            register(id);
            factories.set(module, null);
            if (isServer || isHydrateZone) {
                $scope.defer(make);
            }
            else {
                make().then(() => update());
            }
        }
        (0,_use_effect__WEBPACK_IMPORTED_MODULE_8__.useEffect)(() => () => unregister(id), []);
        return factory ? factory(props, ref) : isLoaded ? fallback : null;
    }, { token: $$lazy }));
}
function load(module) {
    return new Promise(resolve => {
        module().then(module => {
            if (true) {
                if (!module.default) {
                    throw new Error('[Dark]: the lazy loaded component should be exported as default!');
                }
            }
            resolve(module.default);
        });
    });
}



/***/ }),

/***/ "../../../packages/core/src/memo/memo.ts":
/*!***********************************************!*\
  !*** ../../../packages/core/src/memo/memo.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "detectIsMemo": () => (/* binding */ detectIsMemo),
/* harmony export */   "memo": () => (/* binding */ memo)
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component */ "../../../packages/core/src/component/component.ts");

const $$memo = Symbol('memo');
const defaultShouldUpdate = (props, nextProps) => {
    const keys = Object.keys(nextProps);
    for (const key of keys) {
        if (key !== 'slot' && nextProps[key] !== props[key])
            return true;
    }
    return false;
};
function memo(factory, shouldUpdate = defaultShouldUpdate) {
    factory[_component__WEBPACK_IMPORTED_MODULE_0__.$$inject] = {
        token: $$memo,
        shouldUpdate,
    };
    return factory;
}
const detectIsMemo = (instance) => (0,_component__WEBPACK_IMPORTED_MODULE_0__.detectIsComponent)(instance) && instance.token === $$memo;



/***/ }),

/***/ "../../../packages/core/src/platform/platform.ts":
/*!*******************************************************!*\
  !*** ../../../packages/core/src/platform/platform.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "detectIsServer": () => (/* binding */ detectIsServer),
/* harmony export */   "platform": () => (/* binding */ platform)
/* harmony export */ });
const defaultRealisation = () => {
    throw new Error('Function not installed by renderer!');
};
const platform = {
    createElement: defaultRealisation,
    insertElement: defaultRealisation,
    raf: defaultRealisation,
    caf: defaultRealisation,
    spawn: defaultRealisation,
    commit: defaultRealisation,
    finishCommit: defaultRealisation,
    detectIsDynamic: defaultRealisation,
    detectIsPortal: defaultRealisation,
    unmountPortal: defaultRealisation,
    chunk: defaultRealisation,
};
const detectIsServer = () => !platform.detectIsDynamic();



/***/ }),

/***/ "../../../packages/core/src/ref/ref.ts":
/*!*********************************************!*\
  !*** ../../../packages/core/src/ref/ref.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "applyRef": () => (/* binding */ applyRef),
/* harmony export */   "detectIsMutableRef": () => (/* binding */ detectIsMutableRef),
/* harmony export */   "forwardRef": () => (/* binding */ forwardRef),
/* harmony export */   "useRef": () => (/* binding */ useRef)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "../../../packages/core/src/utils/utils.ts");
/* harmony import */ var _use_memo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../use-memo */ "../../../packages/core/src/use-memo/use-memo.ts");


function forwardRef(component) {
    return (props) => {
        const { ref, ...rest } = (props || {});
        return component(rest, ref);
    };
}
function detectIsMutableRef(ref) {
    if (!(0,_utils__WEBPACK_IMPORTED_MODULE_0__.detectIsObject)(ref) || (0,_utils__WEBPACK_IMPORTED_MODULE_0__.detectIsNull)(ref))
        return false;
    const mutableRef = ref;
    for (const key in mutableRef) {
        if (key === 'current' && mutableRef.hasOwnProperty(key)) {
            return true;
        }
    }
    return false;
}
function applyRef(ref, current) {
    if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.detectIsFunction)(ref)) {
        ref(current);
    }
    else if (detectIsMutableRef(ref)) {
        ref.current = current;
    }
}
function useRef(initialValue = null) {
    const ref = (0,_use_memo__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => ({ current: initialValue }), []);
    return ref;
}



/***/ }),

/***/ "../../../packages/core/src/scheduler/scheduler.ts":
/*!*********************************************************!*\
  !*** ../../../packages/core/src/scheduler/scheduler.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "scheduler": () => (/* binding */ scheduler)
/* harmony export */ });
/* harmony import */ var _workloop__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../workloop */ "../../../packages/core/src/workloop/workloop.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants */ "../../../packages/core/src/constants.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils */ "../../../packages/core/src/utils/utils.ts");
/* harmony import */ var _emitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../emitter */ "../../../packages/core/src/emitter/emitter.ts");
/* harmony import */ var _platform__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../platform */ "../../../packages/core/src/platform/platform.ts");





class MessageChannel extends _emitter__WEBPACK_IMPORTED_MODULE_0__.EventEmitter {
    port1 = null;
    port2 = null;
    constructor() {
        super();
        this.port1 = new MessagePort(this);
        this.port2 = new MessagePort(this);
    }
}
class MessagePort {
    channel;
    offs = [];
    constructor(channel) {
        this.channel = channel;
    }
    on(event, callback) {
        const off = this.channel.on(event, callback);
        this.offs.push(off);
    }
    postMessage(value) {
        _platform__WEBPACK_IMPORTED_MODULE_1__.platform.spawn(() => {
            this.channel.emit('message', value);
        });
    }
    unref() {
        this.offs.forEach(x => x());
    }
}
class Scheduler {
    queue = {
        [_constants__WEBPACK_IMPORTED_MODULE_2__.TaskPriority.HIGH]: [],
        [_constants__WEBPACK_IMPORTED_MODULE_2__.TaskPriority.NORMAL]: [],
        [_constants__WEBPACK_IMPORTED_MODULE_2__.TaskPriority.LOW]: [],
    };
    deadline = 0;
    task = null;
    scheduledCallback = null;
    isMessageLoopRunning = false;
    channel = null;
    port = null;
    constructor() {
        this.channel = new MessageChannel();
        this.port = this.channel.port2;
        this.channel.port1.on('message', this.performWorkUntilDeadline.bind(this));
    }
    reset() {
        this.deadline = 0;
        this.task = null;
        this.scheduledCallback = null;
        this.isMessageLoopRunning = false;
    }
    shouldYield() {
        return (0,_utils__WEBPACK_IMPORTED_MODULE_3__.getTime)() >= this.deadline;
    }
    schedule(callback, options) {
        const { priority = _constants__WEBPACK_IMPORTED_MODULE_2__.TaskPriority.NORMAL, forceAsync = false, isTransition = false, createLocation, setPendingStatus, } = options || {};
        const task = new Task(callback, priority, forceAsync);
        task.setIsTransition(isTransition);
        task.setPendingSetter(setPendingStatus);
        task.setLocationCreator(createLocation || createRootLocation);
        this.put(task);
        this.execute();
    }
    hasPrimaryTask() {
        if (!this.task.getIsTransition())
            return false;
        const { high, normal, low } = this.getQueues();
        const hasPrimary = high.length > 0 || normal.length > 0;
        const hasLow = low.length > 0;
        if (hasPrimary || hasLow) {
            const loc = this.task.createLocation();
            if (hasPrimary) {
                const has = Task.detectHasRelatedUpdate(loc, high, true) || Task.detectHasRelatedUpdate(loc, normal, true);
                if (has) {
                    this.task.markAsUnnecessary();
                }
                return true;
            }
            if (hasLow) {
                const has = Task.detectHasRelatedUpdate(loc, low);
                if (has) {
                    this.task.markAsUnnecessary();
                    return true;
                }
            }
        }
        return false;
    }
    cancelTask(fn) {
        if (this.task.getIsUnnecessary())
            return this.complete(this.task);
        this.task.setTaskRestorer(fn);
        this.defer(this.task);
    }
    complete(task) {
        task.pending(false);
    }
    put(task) {
        const queue = this.queue[task.getPriority()];
        if (task.getIsTransition()) {
            const loc = task.createLocation();
            const tasks = queue.filter(x => x.createLocation() !== loc);
            queue.splice(0, queue.length, ...tasks);
        }
        queue.push(task);
    }
    pick(queue) {
        if (queue.length === 0)
            return false;
        this.task = queue.shift();
        if (this.task.getIsTransition() && this.task.canPending()) {
            const task = this.task;
            task.markAsPending();
            this.defer(this.task);
            this.task = null;
            (0,_utils__WEBPACK_IMPORTED_MODULE_3__.nextTick)(() => task.pending(true));
            return true;
        }
        this.task.run();
        this.task.getForceAsync() ? this.requestCallbackAsync(_workloop__WEBPACK_IMPORTED_MODULE_4__.workLoop) : this.requestCallback(_workloop__WEBPACK_IMPORTED_MODULE_4__.workLoop);
        return true;
    }
    execute() {
        const isBusy = (0,_workloop__WEBPACK_IMPORTED_MODULE_4__.detectIsBusy)();
        const { high, normal, low } = this.getQueues();
        if (!isBusy && !this.isMessageLoopRunning) {
            this.pick(high) || this.pick(normal) || this.pick(low);
        }
    }
    requestCallbackAsync(callback) {
        this.scheduledCallback = callback;
        if (!this.isMessageLoopRunning) {
            this.isMessageLoopRunning = true;
            this.port.postMessage(null);
        }
    }
    requestCallback(callback) {
        callback(false);
        this.task = null;
        this.execute();
    }
    performWorkUntilDeadline() {
        if (this.scheduledCallback) {
            this.deadline = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.getTime)() + _constants__WEBPACK_IMPORTED_MODULE_2__.YIELD_INTERVAL;
            const hasMoreWork = this.scheduledCallback(true);
            if (hasMoreWork) {
                this.port.postMessage(null);
            }
            else {
                if (hasMoreWork === null) {
                    setTimeout(() => this.port.postMessage(null));
                }
                else {
                    this.complete(this.task);
                    this.reset();
                    this.execute();
                }
            }
        }
        else {
            this.isMessageLoopRunning = false;
        }
    }
    defer(task) {
        const { low } = this.getQueues();
        low.unshift(task);
    }
    getQueues() {
        const high = this.queue[_constants__WEBPACK_IMPORTED_MODULE_2__.TaskPriority.HIGH];
        const normal = this.queue[_constants__WEBPACK_IMPORTED_MODULE_2__.TaskPriority.NORMAL];
        const low = this.queue[_constants__WEBPACK_IMPORTED_MODULE_2__.TaskPriority.LOW];
        return {
            high,
            normal,
            low,
        };
    }
}
class Task {
    id;
    priority;
    forceAsync;
    isTransition;
    isPending;
    isUnnecessary;
    callback;
    taskRestorer = null;
    locationCreator;
    pendingSetter = null;
    static nextTaskId = 0;
    constructor(callback, priority, forceAsync) {
        this.id = ++Task.nextTaskId;
        this.callback = callback;
        this.priority = priority;
        this.forceAsync = forceAsync;
    }
    getPriority() {
        return this.priority;
    }
    getForceAsync() {
        return this.forceAsync;
    }
    setIsTransition(value) {
        this.isTransition = value;
    }
    getIsTransition() {
        return this.isTransition;
    }
    run() {
        this.callback(this.taskRestorer);
        this.taskRestorer = null;
    }
    pending(value) {
        this.isTransition && this.pendingSetter && this.pendingSetter(value);
    }
    markAsPending() {
        this.isPending = true;
    }
    canPending() {
        return !this.isPending && (0,_utils__WEBPACK_IMPORTED_MODULE_3__.detectIsFunction)(this.pendingSetter);
    }
    markAsUnnecessary() {
        this.isUnnecessary = true;
    }
    getIsUnnecessary() {
        return this.isUnnecessary;
    }
    setTaskRestorer(fn) {
        this.taskRestorer = fn;
    }
    setLocationCreator(fn) {
        this.locationCreator = fn;
    }
    createLocation() {
        return this.locationCreator();
    }
    setPendingSetter(fn) {
        this.pendingSetter = fn;
    }
    static detectHasRelatedUpdate(loc, tasks, deep = false) {
        const [$loc] = loc.split(_constants__WEBPACK_IMPORTED_MODULE_2__.HOOK_DELIMETER);
        return tasks.some(x => {
            const $$loc = x.createLocation();
            const has = $$loc === loc || (deep && $$loc.length > loc.length && $$loc.indexOf($loc) !== -1);
            return has;
        });
    }
}
const createRootLocation = () => _constants__WEBPACK_IMPORTED_MODULE_2__.ROOT;
const scheduler = new Scheduler();



/***/ }),

/***/ "../../../packages/core/src/scope/scope.ts":
/*!*************************************************!*\
  !*** ../../../packages/core/src/scope/scope.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$$scope": () => (/* binding */ $$scope),
/* harmony export */   "getRootId": () => (/* binding */ getRootId),
/* harmony export */   "removeScope": () => (/* binding */ removeScope),
/* harmony export */   "replaceScope": () => (/* binding */ replaceScope),
/* harmony export */   "setRootId": () => (/* binding */ setRootId)
/* harmony export */ });
/* harmony import */ var _platform__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../platform */ "../../../packages/core/src/platform/platform.ts");
/* harmony import */ var _emitter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../emitter */ "../../../packages/core/src/emitter/emitter.ts");


class Scope {
    root = null;
    wip = null;
    cursor = null;
    unit = null;
    mountDeep = true;
    mountLevel = 0;
    mountNav = {};
    events = new Map();
    unsubs = new Set();
    actions = {};
    candidates = new Set();
    deletions = new Set();
    cancels = [];
    asyncEffects = new Set();
    layoutEffects = new Set();
    insertionEffects = new Set();
    resourceId = 0;
    resources = new Map();
    defers = [];
    setPendingStatus = null;
    isLayoutEffectsZone = false;
    isInsertionEffectsZone = false;
    isUpdateZone = false;
    isBatchZone = false;
    isHydrateZone = false;
    isStreamZone = false;
    isTransitionZone = false;
    isEventZone = false;
    isHot = false;
    isDynamic = _platform__WEBPACK_IMPORTED_MODULE_0__.platform.detectIsDynamic();
    isServer = (0,_platform__WEBPACK_IMPORTED_MODULE_0__.detectIsServer)();
    emitter = new _emitter__WEBPACK_IMPORTED_MODULE_1__.EventEmitter();
    resetActions() {
        this.actions = {};
    }
    getActionsById(id) {
        return this.actions[id];
    }
    addActionMap(id, map) {
        this.actions[id] = {
            map,
            replace: null,
            insert: null,
            remove: null,
            move: null,
            stable: null,
        };
    }
    addReplaceAction(id, nextKey) {
        !this.actions[id].replace && (this.actions[id].replace = {});
        this.actions[id].replace[nextKey] = true;
    }
    addInsertAction(id, nextKey) {
        !this.actions[id].insert && (this.actions[id].insert = {});
        this.actions[id].insert[nextKey] = true;
    }
    addRemoveAction(id, prevKey) {
        !this.actions[id].remove && (this.actions[id].remove = {});
        this.actions[id].remove[prevKey] = true;
    }
    addMoveAction(id, nextKey) {
        !this.actions[id].move && (this.actions[id].move = {});
        this.actions[id].move[nextKey] = true;
    }
    addStableAction(id, nextKey) {
        !this.actions[id].stable && (this.actions[id].stable = {});
        this.actions[id].stable[nextKey] = true;
    }
    copy() {
        const scope = new Scope();
        scope.root = null;
        scope.wip = null;
        scope.cursor = null;
        scope.unit = this.unit;
        scope.mountDeep = this.mountDeep;
        scope.mountLevel = this.mountLevel;
        scope.mountNav = { ...this.mountNav };
        scope.events = this.events;
        scope.unsubs = this.unsubs;
        scope.actions = { ...this.actions };
        scope.candidates = new Set([...this.candidates]);
        scope.deletions = new Set([...this.deletions]);
        scope.asyncEffects = new Set([...this.asyncEffects]);
        scope.layoutEffects = new Set([...this.layoutEffects]);
        scope.isUpdateZone = this.isUpdateZone;
        scope.emitter = this.emitter;
        return scope;
    }
    getRoot() {
        return this.root;
    }
    setRoot(fiber) {
        this.root = fiber;
    }
    getWorkInProgress() {
        return this.wip;
    }
    setWorkInProgress(fiber) {
        this.wip = fiber;
    }
    getNextUnitOfWork() {
        return this.unit;
    }
    setNextUnitOfWork(fiber) {
        this.unit = fiber;
    }
    getCursorFiber() {
        return this.cursor;
    }
    setCursorFiber(fiber) {
        this.cursor = fiber;
    }
    navToChild() {
        this.mountLevel = this.mountLevel + 1;
        this.mountNav[this.mountLevel] = 0;
    }
    navToSibling() {
        this.mountNav[this.mountLevel] = this.mountNav[this.mountLevel] + 1;
    }
    navToParent() {
        this.mountLevel = this.mountLevel - 1;
    }
    navToPrev() {
        const idx = this.getMountIndex();
        if (idx === 0) {
            this.navToParent();
            this.setMountDeep(true);
        }
        else {
            this.mountNav[this.mountLevel] = this.mountNav[this.mountLevel] - 1;
            this.setMountDeep(false);
        }
    }
    getMountIndex() {
        return this.mountNav[this.mountLevel];
    }
    getMountDeep() {
        return this.mountDeep;
    }
    setMountDeep(value) {
        this.mountDeep = value;
    }
    resetMount() {
        this.mountLevel = 0;
        this.mountNav = {};
        this.mountDeep = true;
    }
    getEvents() {
        return this.events;
    }
    addEventUnsubscriber(fn) {
        this.unsubs.add(fn);
    }
    unsubscribeEvents() {
        this.unsubs.forEach(x => x());
        this.unsubs = new Set();
    }
    getCandidates() {
        return this.candidates;
    }
    addCandidate(fiber) {
        this.candidates.add(fiber);
    }
    resetCandidates() {
        this.candidates = new Set();
    }
    getDeletions() {
        return this.deletions;
    }
    hasDeletion(fiber) {
        let nextFiber = fiber;
        while (nextFiber) {
            if (this.deletions.has(nextFiber))
                return true;
            nextFiber = nextFiber.parent;
        }
        return false;
    }
    addDeletion(fiber) {
        !this.hasDeletion(fiber) && this.deletions.add(fiber);
    }
    resetDeletions() {
        this.deletions = new Set();
    }
    addAsyncEffect(fn) {
        this.asyncEffects.add(fn);
    }
    resetAsyncEffects() {
        this.asyncEffects = new Set();
    }
    runAsyncEffects() {
        if (!this.isDynamic)
            return;
        const effects = this.asyncEffects;
        effects.size > 0 && setTimeout(() => effects.forEach(fn => fn()));
    }
    addLayoutEffect(fn) {
        this.layoutEffects.add(fn);
    }
    resetLayoutEffects() {
        this.layoutEffects = new Set();
    }
    runLayoutEffects() {
        if (!this.isDynamic)
            return;
        this.setIsLayoutEffectsZone(true);
        this.layoutEffects.forEach(fn => fn());
        this.setIsLayoutEffectsZone(false);
    }
    addInsertionEffect(fn) {
        this.insertionEffects.add(fn);
    }
    resetInsertionEffects() {
        this.insertionEffects = new Set();
    }
    runInsertionEffects() {
        if (!this.isDynamic)
            return;
        this.setIsInsertionEffectsZone(true);
        this.insertionEffects.forEach(fn => fn());
        this.setIsInsertionEffectsZone(false);
    }
    addCancel(fn) {
        this.cancels.push(fn);
    }
    applyCancels() {
        for (let i = this.cancels.length - 1; i >= 0; i--) {
            this.cancels[i]();
        }
    }
    resetCancels() {
        this.cancels = [];
    }
    getIsLayoutEffectsZone() {
        return this.isLayoutEffectsZone;
    }
    setIsLayoutEffectsZone(value) {
        this.isLayoutEffectsZone = value;
    }
    getIsInsertionEffectsZone() {
        return this.isInsertionEffectsZone;
    }
    setIsInsertionEffectsZone(value) {
        this.isInsertionEffectsZone = value;
    }
    getIsUpdateZone() {
        return this.isUpdateZone;
    }
    setIsUpdateZone(value) {
        this.isUpdateZone = value;
    }
    getIsBatchZone() {
        return this.isBatchZone;
    }
    setIsBatchZone(value) {
        this.isBatchZone = value;
    }
    getIsHydrateZone() {
        return this.isHydrateZone;
    }
    setIsHydrateZone(value) {
        this.isHydrateZone = value;
    }
    getIsStreamZone() {
        return this.isStreamZone;
    }
    setIsStreamZone(value) {
        this.isStreamZone = value;
    }
    getIsTransitionZone() {
        return this.isTransitionZone;
    }
    setIsTransitionZone(value) {
        this.isTransitionZone = value;
    }
    getIsEventZone() {
        return this.isEventZone;
    }
    setIsEventZone(value) {
        this.isEventZone = value;
    }
    getIsHot() {
        return this.isHot;
    }
    setIsHot(value) {
        this.isHot = value;
    }
    getPendingStatusSetter() {
        return this.setPendingStatus;
    }
    setPendingStatusSetter(fn) {
        this.setPendingStatus = fn;
    }
    flush() {
        !this.isUpdateZone && this.setRoot(this.wip);
        this.setWorkInProgress(null);
        this.setNextUnitOfWork(null);
        this.setCursorFiber(null);
        this.resetMount();
        this.resetCandidates();
        this.resetDeletions();
        this.resetCancels();
        this.resetInsertionEffects();
        this.resetLayoutEffects();
        this.resetAsyncEffects();
        this.setIsHydrateZone(false);
        this.setIsUpdateZone(false);
        this.resetActions();
    }
    getEmitter() {
        return this.emitter;
    }
    defer(fn) {
        this.defers.push(fn);
    }
    getDefers() {
        return this.defers;
    }
    resetDefers() {
        this.defers = [];
    }
    getResource(id) {
        return this.resources.get(id);
    }
    setResource(id, res) {
        this.resources.set(id, res);
    }
    getResources() {
        return this.resources;
    }
    getResourceId() {
        return this.resourceId;
    }
    setResourceId(id) {
        this.resourceId = id;
    }
    getNextResourceId() {
        return ++this.resourceId;
    }
    runAfterCommit() {
        this.resources = new Map();
        this.isServer && (this.resourceId = 0);
    }
}
let rootId = null;
const scopes = new Map();
const getRootId = () => rootId;
const setRootId = (id) => {
    rootId = id;
    !scopes.has(rootId) && scopes.set(rootId, new Scope());
};
const removeScope = (id) => scopes.delete(id);
const replaceScope = (scope, id = rootId) => {
    Object.assign(scopes.get(id), scope);
};
const $$scope = (id = rootId) => scopes.get(id);



/***/ }),

/***/ "../../../packages/core/src/shadow/shadow.ts":
/*!***************************************************!*\
  !*** ../../../packages/core/src/shadow/shadow.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Shadow": () => (/* binding */ Shadow)
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component */ "../../../packages/core/src/component/component.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants */ "../../../packages/core/src/constants.ts");
/* harmony import */ var _use_layout_effect__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../use-layout-effect */ "../../../packages/core/src/use-layout-effect/use-layout-effect.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../scope */ "../../../packages/core/src/scope/scope.ts");
/* harmony import */ var _walk__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../walk */ "../../../packages/core/src/walk/walk.ts");
/* harmony import */ var _platform__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../platform */ "../../../packages/core/src/platform/platform.ts");






const $$shadow = Symbol('shadow');
const Shadow = (0,_component__WEBPACK_IMPORTED_MODULE_0__.component)(({ isInserted, slot }) => {
    const isEnabled = !(0,_platform__WEBPACK_IMPORTED_MODULE_1__.detectIsServer)() && !(0,_scope__WEBPACK_IMPORTED_MODULE_2__.$$scope)().getIsHydrateZone();
    const fiber = (0,_scope__WEBPACK_IMPORTED_MODULE_2__.$$scope)().getCursorFiber();
    if (isEnabled) {
        if (isInserted) {
            fiber.mask &= ~_constants__WEBPACK_IMPORTED_MODULE_3__.SHADOW_MASK;
        }
        else {
            !(fiber.mask & _constants__WEBPACK_IMPORTED_MODULE_3__.SHADOW_MASK) && (fiber.mask |= _constants__WEBPACK_IMPORTED_MODULE_3__.SHADOW_MASK);
        }
    }
    (0,_use_layout_effect__WEBPACK_IMPORTED_MODULE_4__.useLayoutEffect)(() => {
        if (!isEnabled || !isInserted)
            return;
        const $fiber = (0,_walk__WEBPACK_IMPORTED_MODULE_5__.getFiberWithElement)(fiber);
        const fibers = (0,_walk__WEBPACK_IMPORTED_MODULE_5__.collectElements)(fiber, x => x);
        for (const fiber of fibers) {
            _platform__WEBPACK_IMPORTED_MODULE_1__.platform.insertElement(fiber.element, fiber.eidx, $fiber.element);
        }
    }, [isInserted]);
    return slot || null;
}, { token: $$shadow });



/***/ }),

/***/ "../../../packages/core/src/suspense/suspense.ts":
/*!*******************************************************!*\
  !*** ../../../packages/core/src/suspense/suspense.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Suspense": () => (/* binding */ Suspense),
/* harmony export */   "useSuspense": () => (/* binding */ useSuspense)
/* harmony export */ });
/* harmony import */ var _use_layout_effect__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../use-layout-effect */ "../../../packages/core/src/use-layout-effect/use-layout-effect.ts");
/* harmony import */ var _platform__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../platform */ "../../../packages/core/src/platform/platform.ts");
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../context */ "../../../packages/core/src/context/context.ts");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../component */ "../../../packages/core/src/component/component.ts");
/* harmony import */ var _use_state__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../use-state */ "../../../packages/core/src/use-state/use-state.ts");
/* harmony import */ var _fragment__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../fragment */ "../../../packages/core/src/fragment/fragment.ts");
/* harmony import */ var _use_memo__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../use-memo */ "../../../packages/core/src/use-memo/use-memo.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../scope */ "../../../packages/core/src/scope/scope.ts");
/* harmony import */ var _shadow__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../shadow */ "../../../packages/core/src/shadow/shadow.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "../../../packages/core/src/utils/utils.ts");










const SuspenseContext = (0,_context__WEBPACK_IMPORTED_MODULE_0__.createContext)({
    isLoaded: false,
    fallback: null,
    register: _utils__WEBPACK_IMPORTED_MODULE_1__.dummyFn,
    unregister: _utils__WEBPACK_IMPORTED_MODULE_1__.dummyFn,
});
const Suspense = (0,_component__WEBPACK_IMPORTED_MODULE_2__.component)(({ fallback, slot }) => {
    if (true) {
        if (!fallback) {
            throw new Error(`[Dark]: Suspense fallback not found!`);
        }
    }
    const $scope = (0,_scope__WEBPACK_IMPORTED_MODULE_3__.$$scope)();
    const emitter = $scope.getEmitter();
    const [isLoaded, setIsLoaded] = (0,_use_state__WEBPACK_IMPORTED_MODULE_4__.useState)(() => (0,_platform__WEBPACK_IMPORTED_MODULE_5__.detectIsServer)() || $scope.getIsHydrateZone());
    const scope = (0,_use_memo__WEBPACK_IMPORTED_MODULE_6__.useMemo)(() => ({ store: new Set(), isLoaded }), []);
    const value = (0,_use_memo__WEBPACK_IMPORTED_MODULE_6__.useMemo)(() => ({ isLoaded, fallback, register: null, unregister: null }), []);
    const content = [
        (0,_shadow__WEBPACK_IMPORTED_MODULE_7__.Shadow)({ key: CONTENT, isInserted: isLoaded, slot }),
        isLoaded ? null : (0,_fragment__WEBPACK_IMPORTED_MODULE_8__.Fragment)({ key: FALLBACK, slot: fallback }),
    ].filter(Boolean);
    (0,_use_layout_effect__WEBPACK_IMPORTED_MODULE_9__.useLayoutEffect)(() => {
        const off = emitter.on('finish', () => {
            const { store, isLoaded } = scope;
            if (store.size === 0 && !isLoaded) {
                setIsLoaded(true);
                off();
            }
        });
        return off;
    }, []);
    scope.isLoaded = isLoaded;
    value.isLoaded = isLoaded;
    value.fallback = fallback;
    value.register = (id) => scope.store.add(id);
    value.unregister = (id) => scope.store.delete(id);
    return SuspenseContext.Provider({ value, slot: content });
});
const CONTENT = 1;
const FALLBACK = 2;
const useSuspense = () => (0,_context__WEBPACK_IMPORTED_MODULE_0__.useContext)(SuspenseContext);



/***/ }),

/***/ "../../../packages/core/src/unmount/unmount.ts":
/*!*****************************************************!*\
  !*** ../../../packages/core/src/unmount/unmount.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "unmountFiber": () => (/* binding */ unmountFiber),
/* harmony export */   "unmountRoot": () => (/* binding */ unmountRoot)
/* harmony export */ });
/* harmony import */ var _platform__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../platform */ "../../../packages/core/src/platform/platform.ts");
/* harmony import */ var _use_effect__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../use-effect */ "../../../packages/core/src/use-effect/use-effect.ts");
/* harmony import */ var _use_layout_effect__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../use-layout-effect */ "../../../packages/core/src/use-layout-effect/use-layout-effect.ts");
/* harmony import */ var _use_insertion_effect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../use-insertion-effect */ "../../../packages/core/src/use-insertion-effect/use-insertion-effect.ts");
/* harmony import */ var _walk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../walk */ "../../../packages/core/src/walk/walk.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils */ "../../../packages/core/src/utils/utils.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../scope */ "../../../packages/core/src/scope/scope.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "../../../packages/core/src/constants.ts");








const combinedMask = _constants__WEBPACK_IMPORTED_MODULE_0__.INSERTION_EFFECT_HOST_MASK | _constants__WEBPACK_IMPORTED_MODULE_0__.LAYOUT_EFFECT_HOST_MASK | _constants__WEBPACK_IMPORTED_MODULE_0__.ASYNC_EFFECT_HOST_MASK | _constants__WEBPACK_IMPORTED_MODULE_0__.ATOM_HOST_MASK | _constants__WEBPACK_IMPORTED_MODULE_0__.PORTAL_HOST_MASK;
const shouldUnmountFiber = (fiber) => fiber.mask & combinedMask;
function unmountFiber(fiber) {
    if (!shouldUnmountFiber(fiber))
        return;
    (0,_walk__WEBPACK_IMPORTED_MODULE_1__.walk)(fiber, (fiber, skip) => {
        if (!shouldUnmountFiber(fiber))
            return skip();
        if (fiber.hook && fiber.hook.values.length > 0) {
            fiber.mask & _constants__WEBPACK_IMPORTED_MODULE_0__.INSERTION_EFFECT_HOST_MASK && (0,_use_insertion_effect__WEBPACK_IMPORTED_MODULE_2__.dropInsertionEffects)(fiber.hook);
            fiber.mask & _constants__WEBPACK_IMPORTED_MODULE_0__.LAYOUT_EFFECT_HOST_MASK && (0,_use_layout_effect__WEBPACK_IMPORTED_MODULE_3__.dropLayoutEffects)(fiber.hook);
            fiber.mask & _constants__WEBPACK_IMPORTED_MODULE_0__.ASYNC_EFFECT_HOST_MASK && (0,_use_effect__WEBPACK_IMPORTED_MODULE_4__.dropEffects)(fiber.hook);
        }
        if (fiber.atoms) {
            for (const [_, cleanup] of fiber.atoms) {
                cleanup();
            }
            fiber.atoms = null;
        }
        fiber.mask & _constants__WEBPACK_IMPORTED_MODULE_0__.PORTAL_HOST_MASK && _platform__WEBPACK_IMPORTED_MODULE_5__.platform.unmountPortal(fiber);
    });
}
function unmountRoot(rootId, onCompleted) {
    if ((0,_utils__WEBPACK_IMPORTED_MODULE_6__.detectIsUndefined)(rootId))
        return;
    const $scope = (0,_scope__WEBPACK_IMPORTED_MODULE_7__.$$scope)(rootId);
    unmountFiber($scope.getRoot());
    $scope.unsubscribeEvents();
    (0,_scope__WEBPACK_IMPORTED_MODULE_7__.removeScope)(rootId);
    onCompleted();
}



/***/ }),

/***/ "../../../packages/core/src/use-callback/use-callback.ts":
/*!***************************************************************!*\
  !*** ../../../packages/core/src/use-callback/use-callback.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useCallback": () => (/* binding */ useCallback)
/* harmony export */ });
/* harmony import */ var _use_memo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../use-memo */ "../../../packages/core/src/use-memo/use-memo.ts");

function useCallback(callback, deps) {
    const value = (0,_use_memo__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => callback, deps);
    return value;
}



/***/ }),

/***/ "../../../packages/core/src/use-effect/use-effect.ts":
/*!***********************************************************!*\
  !*** ../../../packages/core/src/use-effect/use-effect.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EffectType": () => (/* binding */ EffectType),
/* harmony export */   "createEffect": () => (/* binding */ createEffect),
/* harmony export */   "dropEffects": () => (/* binding */ dropEffects),
/* harmony export */   "useEffect": () => (/* binding */ useEffect)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils */ "../../../packages/core/src/utils/utils.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants */ "../../../packages/core/src/constants.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scope */ "../../../packages/core/src/scope/scope.ts");
/* harmony import */ var _use_memo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../use-memo */ "../../../packages/core/src/use-memo/use-memo.ts");




const $$useEffect = Symbol('use-effect');
function createEffect(token, type) {
    function useEffect(effect, deps = [{}]) {
        const $scope = (0,_scope__WEBPACK_IMPORTED_MODULE_0__.$$scope)();
        const fiber = $scope.getCursorFiber();
        const scope = (0,_use_memo__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => ({ token, cleanup: undefined }), []);
        const isInsertionEffect = type === EffectType.INSERTION;
        const isLayoutEffect = type === EffectType.LAYOUT;
        const isAsyncEffect = type === EffectType.ASYNC;
        isInsertionEffect && fiber.markHost(_constants__WEBPACK_IMPORTED_MODULE_2__.INSERTION_EFFECT_HOST_MASK);
        isLayoutEffect && fiber.markHost(_constants__WEBPACK_IMPORTED_MODULE_2__.LAYOUT_EFFECT_HOST_MASK);
        isAsyncEffect && fiber.markHost(_constants__WEBPACK_IMPORTED_MODULE_2__.ASYNC_EFFECT_HOST_MASK);
        (0,_use_memo__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
            const runEffect = () => (scope.cleanup = effect());
            isInsertionEffect && $scope.addInsertionEffect(runEffect);
            isLayoutEffect && $scope.addLayoutEffect(runEffect);
            isAsyncEffect && $scope.addAsyncEffect(runEffect);
            (0,_utils__WEBPACK_IMPORTED_MODULE_3__.detectIsFunction)(scope.cleanup) && scope.cleanup();
            return null;
        }, deps);
    }
    function dropEffects(hook) {
        for (const { value: effect } of hook.values) {
            effect && effect.token === token && (0,_utils__WEBPACK_IMPORTED_MODULE_3__.detectIsFunction)(effect.cleanup) && effect.cleanup();
        }
    }
    return {
        useEffect,
        dropEffects,
    };
}
var EffectType;
(function (EffectType) {
    EffectType["ASYNC"] = "ASYNC";
    EffectType["LAYOUT"] = "LAYOUT";
    EffectType["INSERTION"] = "INSERTION";
})(EffectType || (EffectType = {}));
const { useEffect, dropEffects } = createEffect($$useEffect, EffectType.ASYNC);



/***/ }),

/***/ "../../../packages/core/src/use-event/use-event.ts":
/*!*********************************************************!*\
  !*** ../../../packages/core/src/use-event/use-event.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useEvent": () => (/* binding */ useEvent)
/* harmony export */ });
/* harmony import */ var _use_memo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../use-memo */ "../../../packages/core/src/use-memo/use-memo.ts");
/* harmony import */ var _use_callback__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../use-callback */ "../../../packages/core/src/use-callback/use-callback.ts");


function useEvent(fn) {
    const scope = (0,_use_memo__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({ fn }), []);
    scope.fn = fn;
    const callback = (0,_use_callback__WEBPACK_IMPORTED_MODULE_1__.useCallback)((...args) => {
        return scope.fn(...args);
    }, []);
    return callback;
}



/***/ }),

/***/ "../../../packages/core/src/use-id/use-id.ts":
/*!***************************************************!*\
  !*** ../../../packages/core/src/use-id/use-id.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useId": () => (/* binding */ useId)
/* harmony export */ });
/* harmony import */ var _use_memo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../use-memo */ "../../../packages/core/src/use-memo/use-memo.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../scope */ "../../../packages/core/src/scope/scope.ts");


function useId() {
    const id = (0,_use_memo__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => getNextId((0,_scope__WEBPACK_IMPORTED_MODULE_1__.getRootId)()), []);
    return id;
}
let nextId = 1000000;
const getNextId = (rootId) => `dark:${rootId}:${(++nextId).toString(36)}`;



/***/ }),

/***/ "../../../packages/core/src/use-imperative-handle/use-imperative-handle.ts":
/*!*********************************************************************************!*\
  !*** ../../../packages/core/src/use-imperative-handle/use-imperative-handle.ts ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useImperativeHandle": () => (/* binding */ useImperativeHandle)
/* harmony export */ });
/* harmony import */ var _use_memo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../use-memo */ "../../../packages/core/src/use-memo/use-memo.ts");
/* harmony import */ var _ref__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ref */ "../../../packages/core/src/ref/ref.ts");


function useImperativeHandle(ref, createHandle, deps) {
    const current = (0,_use_memo__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => createHandle(), deps || [{}]);
    ref && (0,_ref__WEBPACK_IMPORTED_MODULE_1__.applyRef)(ref, current);
}



/***/ }),

/***/ "../../../packages/core/src/use-insertion-effect/use-insertion-effect.ts":
/*!*******************************************************************************!*\
  !*** ../../../packages/core/src/use-insertion-effect/use-insertion-effect.ts ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "dropInsertionEffects": () => (/* binding */ dropInsertionEffects),
/* harmony export */   "useInsertionEffect": () => (/* binding */ useInsertionEffect)
/* harmony export */ });
/* harmony import */ var _use_effect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../use-effect */ "../../../packages/core/src/use-effect/use-effect.ts");

const $$useInsertionEffect = Symbol('use-insertion-effect');
const { useEffect: useInsertionEffect, dropEffects: dropInsertionEffects } = (0,_use_effect__WEBPACK_IMPORTED_MODULE_0__.createEffect)($$useInsertionEffect, _use_effect__WEBPACK_IMPORTED_MODULE_0__.EffectType.INSERTION);



/***/ }),

/***/ "../../../packages/core/src/use-layout-effect/use-layout-effect.ts":
/*!*************************************************************************!*\
  !*** ../../../packages/core/src/use-layout-effect/use-layout-effect.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "dropLayoutEffects": () => (/* binding */ dropLayoutEffects),
/* harmony export */   "useLayoutEffect": () => (/* binding */ useLayoutEffect)
/* harmony export */ });
/* harmony import */ var _use_effect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../use-effect */ "../../../packages/core/src/use-effect/use-effect.ts");

const $$useLayoutEffect = Symbol('use-layout-effect');
const { useEffect: useLayoutEffect, dropEffects: dropLayoutEffects } = (0,_use_effect__WEBPACK_IMPORTED_MODULE_0__.createEffect)($$useLayoutEffect, _use_effect__WEBPACK_IMPORTED_MODULE_0__.EffectType.LAYOUT);



/***/ }),

/***/ "../../../packages/core/src/use-memo/use-memo.ts":
/*!*******************************************************!*\
  !*** ../../../packages/core/src/use-memo/use-memo.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useMemo": () => (/* binding */ useMemo)
/* harmony export */ });
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../view */ "../../../packages/core/src/view/view.ts");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../component */ "../../../packages/core/src/component/component.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "../../../packages/core/src/utils/utils.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../scope */ "../../../packages/core/src/scope/scope.ts");
/* harmony import */ var _memo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../memo */ "../../../packages/core/src/memo/memo.ts");





const Memo = (0,_memo__WEBPACK_IMPORTED_MODULE_0__.memo)((0,_component__WEBPACK_IMPORTED_MODULE_1__.component)(({ getValue }) => getValue()), (p, n) => (0,_utils__WEBPACK_IMPORTED_MODULE_2__.detectAreDepsDifferent)(p.deps, n.deps));
function detectIsElement(value) {
    return (0,_component__WEBPACK_IMPORTED_MODULE_1__.detectIsComponent)(value) || (0,_view__WEBPACK_IMPORTED_MODULE_3__.detectIsVirtualNodeFactory)(value);
}
function useMemo(getValue, deps) {
    const fiber = (0,_scope__WEBPACK_IMPORTED_MODULE_4__.$$scope)().getCursorFiber();
    const { hook } = fiber;
    const { idx, values } = hook;
    const state = values[idx] ||
        (values[idx] = {
            deps,
            value: getValue(),
        });
    let value = null;
    let $value = null;
    if (detectIsElement(state.value)) {
        value = state.value;
        $value = Memo({ getValue: getValue, deps });
    }
    else {
        value = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.detectAreDepsDifferent)(state.deps, deps) ? getValue() : state.value;
        $value = value;
    }
    state.deps = deps;
    state.value = value;
    hook.idx++;
    return $value;
}



/***/ }),

/***/ "../../../packages/core/src/use-state/use-state.ts":
/*!*********************************************************!*\
  !*** ../../../packages/core/src/use-state/use-state.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createTools": () => (/* binding */ createTools),
/* harmony export */   "useState": () => (/* binding */ useState)
/* harmony export */ });
/* harmony import */ var _use_callback__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../use-callback */ "../../../packages/core/src/use-callback/use-callback.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "../../../packages/core/src/utils/utils.ts");
/* harmony import */ var _use_update__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../use-update */ "../../../packages/core/src/use-update/use-update.ts");
/* harmony import */ var _use_memo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../use-memo */ "../../../packages/core/src/use-memo/use-memo.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../scope */ "../../../packages/core/src/scope/scope.ts");






function createTools(options) {
    const { get, set, reset, next, shouldUpdate: $shouldUpdate = _utils__WEBPACK_IMPORTED_MODULE_0__.trueFn } = options;
    const $scope = (0,_scope__WEBPACK_IMPORTED_MODULE_1__.$$scope)();
    const isBatch = $scope.getIsBatchZone();
    const tools = () => {
        const prevValue = get();
        const newValue = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.detectIsFunction)(next) ? next(prevValue) : next;
        const shouldUpdate = () => isBatch || $shouldUpdate(prevValue, newValue);
        const setValue = () => set(newValue);
        const resetValue = () => reset(prevValue);
        return { shouldUpdate, setValue, resetValue };
    };
    return tools;
}
function useState(initialValue) {
    const update = (0,_use_update__WEBPACK_IMPORTED_MODULE_2__.useUpdate)();
    const scope = (0,_use_memo__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => ({
        value: (0,_utils__WEBPACK_IMPORTED_MODULE_0__.detectIsFunction)(initialValue) ? initialValue() : initialValue,
    }), []);
    const setState = (0,_use_callback__WEBPACK_IMPORTED_MODULE_4__.useCallback)((next) => {
        const tools = createTools({
            next,
            get: () => scope.value,
            set: (x) => (scope.value = x),
            reset: (x) => (scope.value = x),
            shouldUpdate: (p, n) => !Object.is(p, n),
        });
        update(tools);
    }, []);
    return [scope.value, setState];
}



/***/ }),

/***/ "../../../packages/core/src/use-update/use-update.ts":
/*!***********************************************************!*\
  !*** ../../../packages/core/src/use-update/use-update.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createUpdate": () => (/* binding */ createUpdate),
/* harmony export */   "useUpdate": () => (/* binding */ useUpdate)
/* harmony export */ });
/* harmony import */ var _scheduler__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../scheduler */ "../../../packages/core/src/scheduler/scheduler.ts");
/* harmony import */ var _workloop__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../workloop */ "../../../packages/core/src/workloop/workloop.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scope */ "../../../packages/core/src/scope/scope.ts");
/* harmony import */ var _walk__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../walk */ "../../../packages/core/src/walk/walk.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "../../../packages/core/src/utils/utils.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants */ "../../../packages/core/src/constants.ts");
/* harmony import */ var _batch__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../batch */ "../../../packages/core/src/batch/batch.ts");







function createUpdate(rootId, hook) {
    const { idx } = hook;
    const update = (tools) => {
        const $scope = (0,_scope__WEBPACK_IMPORTED_MODULE_0__.$$scope)();
        if ($scope.getIsInsertionEffectsZone())
            return;
        const { owner } = hook;
        const hasTools = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.detectIsFunction)(tools);
        const isTransition = $scope.getIsTransitionZone();
        const isBatch = $scope.getIsBatchZone();
        const isEvent = $scope.getIsEventZone();
        const priority = isTransition ? _constants__WEBPACK_IMPORTED_MODULE_2__.TaskPriority.LOW : isEvent ? _constants__WEBPACK_IMPORTED_MODULE_2__.TaskPriority.HIGH : _constants__WEBPACK_IMPORTED_MODULE_2__.TaskPriority.NORMAL;
        const forceAsync = isTransition;
        const setPendingStatus = $scope.getPendingStatusSetter();
        const callback = (0,_workloop__WEBPACK_IMPORTED_MODULE_3__.createCallback)({
            rootId,
            hook,
            isTransition,
            tools: hasTools ? tools : undefined,
        });
        const createLocation = () => (0,_walk__WEBPACK_IMPORTED_MODULE_4__.createHookLocation)(rootId, idx, owner);
        const callbackOptions = {
            priority,
            forceAsync,
            isTransition,
            createLocation,
            setPendingStatus,
        };
        if (isBatch) {
            (0,_batch__WEBPACK_IMPORTED_MODULE_5__.addBatch)(owner, () => _scheduler__WEBPACK_IMPORTED_MODULE_6__.scheduler.schedule(callback, callbackOptions), () => hasTools && tools().setValue());
        }
        else {
            _scheduler__WEBPACK_IMPORTED_MODULE_6__.scheduler.schedule(callback, callbackOptions);
        }
    };
    return update;
}
function useUpdate() {
    const rootId = (0,_scope__WEBPACK_IMPORTED_MODULE_0__.getRootId)();
    const fiber = (0,_scope__WEBPACK_IMPORTED_MODULE_0__.$$scope)().getCursorFiber();
    return createUpdate(rootId, fiber.hook);
}



/***/ }),

/***/ "../../../packages/core/src/utils/utils.ts":
/*!*************************************************!*\
  !*** ../../../packages/core/src/utils/utils.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createIndexKey": () => (/* binding */ createIndexKey),
/* harmony export */   "detectAreDepsDifferent": () => (/* binding */ detectAreDepsDifferent),
/* harmony export */   "detectIsArray": () => (/* binding */ detectIsArray),
/* harmony export */   "detectIsBoolean": () => (/* binding */ detectIsBoolean),
/* harmony export */   "detectIsEmpty": () => (/* binding */ detectIsEmpty),
/* harmony export */   "detectIsFalsy": () => (/* binding */ detectIsFalsy),
/* harmony export */   "detectIsFunction": () => (/* binding */ detectIsFunction),
/* harmony export */   "detectIsNull": () => (/* binding */ detectIsNull),
/* harmony export */   "detectIsNumber": () => (/* binding */ detectIsNumber),
/* harmony export */   "detectIsObject": () => (/* binding */ detectIsObject),
/* harmony export */   "detectIsString": () => (/* binding */ detectIsString),
/* harmony export */   "detectIsTextBased": () => (/* binding */ detectIsTextBased),
/* harmony export */   "detectIsUndefined": () => (/* binding */ detectIsUndefined),
/* harmony export */   "dummyFn": () => (/* binding */ dummyFn),
/* harmony export */   "error": () => (/* binding */ error),
/* harmony export */   "falseFn": () => (/* binding */ falseFn),
/* harmony export */   "flatten": () => (/* binding */ flatten),
/* harmony export */   "getTime": () => (/* binding */ getTime),
/* harmony export */   "keyBy": () => (/* binding */ keyBy),
/* harmony export */   "mapRecord": () => (/* binding */ mapRecord),
/* harmony export */   "nextTick": () => (/* binding */ nextTick),
/* harmony export */   "trueFn": () => (/* binding */ trueFn)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "../../../packages/core/src/constants.ts");

const detectIsFunction = (o) => typeof o === 'function';
const detectIsUndefined = (o) => typeof o === 'undefined';
const detectIsNumber = (o) => typeof o === 'number';
const detectIsString = (o) => typeof o === 'string';
const detectIsTextBased = (o) => typeof o === 'string' || typeof o === 'number';
const detectIsObject = (o) => typeof o === 'object';
const detectIsBoolean = (o) => typeof o === 'boolean';
const detectIsArray = (o) => Array.isArray(o);
const detectIsNull = (o) => o === null;
const detectIsEmpty = (o) => detectIsNull(o) || detectIsUndefined(o);
const detectIsFalsy = (o) => detectIsEmpty(o) || o === false;
const getTime = () => Date.now();
const dummyFn = () => { };
const trueFn = () => true;
const falseFn = () => false;
const sameFn = (x) => x;
const error = (...args) => !detectIsUndefined(console) && console.error(...args);
function flatten(source, transform = sameFn) {
    if (detectIsArray(source)) {
        if (source.length === 0)
            return [];
    }
    else {
        return [transform(source)];
    }
    const list = [];
    const stack = [source[0]];
    let idx = 0;
    while (stack.length > 0) {
        const x = stack.pop();
        if (detectIsArray(x)) {
            for (let i = x.length - 1; i >= 0; i--) {
                stack.push(x[i]);
            }
        }
        else {
            list.push(transform(x));
            if (stack.length === 0 && idx < source.length - 1) {
                idx++;
                stack.push(source[idx]);
            }
        }
    }
    return list;
}
function keyBy(list, fn, value = false) {
    return list.reduce((acc, x) => ((acc[fn(x)] = value ? x : true), acc), {});
}
function detectAreDepsDifferent(prevDeps, nextDeps) {
    if (prevDeps === nextDeps)
        return false;
    const max = Math.max(prevDeps.length, nextDeps.length);
    for (let i = 0; i < max; i++) {
        if (!Object.is(prevDeps[i], nextDeps[i]))
            return true;
    }
    return false;
}
function nextTick(callback) {
    Promise.resolve().then(callback);
}
const createIndexKey = (idx) => `${_constants__WEBPACK_IMPORTED_MODULE_0__.INDEX_KEY}:${idx}`;
const mapRecord = (record) => Object.keys(record).map(x => record[x]);



/***/ }),

/***/ "../../../packages/core/src/view/view.ts":
/*!***********************************************!*\
  !*** ../../../packages/core/src/view/view.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Comment": () => (/* binding */ Comment),
/* harmony export */   "CommentVirtualNode": () => (/* binding */ CommentVirtualNode),
/* harmony export */   "NodeType": () => (/* binding */ NodeType),
/* harmony export */   "TagVirtualNode": () => (/* binding */ TagVirtualNode),
/* harmony export */   "Text": () => (/* binding */ Text),
/* harmony export */   "TextVirtualNode": () => (/* binding */ TextVirtualNode),
/* harmony export */   "View": () => (/* binding */ View),
/* harmony export */   "VirtualNode": () => (/* binding */ VirtualNode),
/* harmony export */   "createReplacer": () => (/* binding */ createReplacer),
/* harmony export */   "detectAreSameComponentTypesWithSameKeys": () => (/* binding */ detectAreSameComponentTypesWithSameKeys),
/* harmony export */   "detectAreSameInstanceTypes": () => (/* binding */ detectAreSameInstanceTypes),
/* harmony export */   "detectIsCommentVirtualNode": () => (/* binding */ detectIsCommentVirtualNode),
/* harmony export */   "detectIsPlainVirtualNode": () => (/* binding */ detectIsPlainVirtualNode),
/* harmony export */   "detectIsReplacer": () => (/* binding */ detectIsReplacer),
/* harmony export */   "detectIsTagVirtualNode": () => (/* binding */ detectIsTagVirtualNode),
/* harmony export */   "detectIsTextVirtualNode": () => (/* binding */ detectIsTextVirtualNode),
/* harmony export */   "detectIsVirtualNode": () => (/* binding */ detectIsVirtualNode),
/* harmony export */   "detectIsVirtualNodeFactory": () => (/* binding */ detectIsVirtualNodeFactory),
/* harmony export */   "getElementKey": () => (/* binding */ getElementKey),
/* harmony export */   "getElementType": () => (/* binding */ getElementType),
/* harmony export */   "hasChildrenProp": () => (/* binding */ hasChildrenProp),
/* harmony export */   "hasElementFlag": () => (/* binding */ hasElementFlag)
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../component */ "../../../packages/core/src/component/component.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "../../../packages/core/src/utils/utils.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "../../../packages/core/src/constants.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../scope */ "../../../packages/core/src/scope/scope.ts");




const $$vNode = Symbol('vNode');
const ATTR_TYPE = 'type';
class VirtualNode {
    type = null;
    constructor(type) {
        this.type = type;
    }
}
class TagVirtualNode extends VirtualNode {
    name;
    attrs;
    children;
    constructor(name, attrs, children) {
        super(NodeType.TAG);
        this.name = name;
        this.attrs = attrs;
        this.children = children;
    }
}
class TextVirtualNode extends VirtualNode {
    value;
    constructor(source) {
        super(NodeType.TEXT);
        this.value = String(source);
    }
}
class CommentVirtualNode extends VirtualNode {
    value = '';
    constructor(text) {
        super(NodeType.COMMENT);
        this.value = text;
    }
}
function View(options) {
    const factory = () => {
        const { as: name, slot, _void = false, ...attrs } = options;
        const children = (_void ? [] : (0,_utils__WEBPACK_IMPORTED_MODULE_0__.detectIsArray)(slot) ? slot : slot ? [slot] : []);
        return new TagVirtualNode(name, attrs, children);
    };
    factory[$$vNode] = true;
    factory[ATTR_TYPE] = options.as;
    factory[_constants__WEBPACK_IMPORTED_MODULE_1__.KEY_ATTR] = options.key;
    return factory;
}
const Text = (source) => new TextVirtualNode(source);
Text.from = (source) => (detectIsTextVirtualNode(source) ? source.value : String(source));
const Comment = (text) => new CommentVirtualNode(text);
const detectIsVirtualNode = (vNode) => vNode instanceof VirtualNode;
const detectIsTagVirtualNode = (vNode) => vNode instanceof TagVirtualNode;
const detectIsCommentVirtualNode = (vNode) => vNode instanceof CommentVirtualNode;
const detectIsTextVirtualNode = (vNode) => vNode instanceof TextVirtualNode;
const detectIsVirtualNodeFactory = (factory) => (0,_utils__WEBPACK_IMPORTED_MODULE_0__.detectIsFunction)(factory) && factory[$$vNode] === true;
const getTagVirtualNodeKey = (vNode) => vNode.attrs ? vNode.attrs[_constants__WEBPACK_IMPORTED_MODULE_1__.KEY_ATTR] ?? null : null;
const hasTagVirtualNodeFlag = (vNode, flag) => Boolean(vNode.attrs && vNode.attrs[flag]);
const getVirtualNodeFactoryKey = (factory) => factory[_constants__WEBPACK_IMPORTED_MODULE_1__.KEY_ATTR] ?? null;
const hasVirtualNodeFactoryFlag = (factory, flag) => Boolean(factory[flag]);
const detectIsPlainVirtualNode = (vNode) => detectIsTextVirtualNode(vNode) || detectIsCommentVirtualNode(vNode);
const createReplacer = () => new CommentVirtualNode(_constants__WEBPACK_IMPORTED_MODULE_1__.REPLACER);
const detectIsReplacer = (vNode) => detectIsCommentVirtualNode(vNode) && vNode.value === _constants__WEBPACK_IMPORTED_MODULE_1__.REPLACER;
function getElementKey(inst) {
    return (0,_component__WEBPACK_IMPORTED_MODULE_2__.detectIsComponent)(inst)
        ? (0,_component__WEBPACK_IMPORTED_MODULE_2__.getComponentKey)(inst)
        : detectIsVirtualNodeFactory(inst)
            ? getVirtualNodeFactoryKey(inst)
            : detectIsTagVirtualNode(inst)
                ? getTagVirtualNodeKey(inst)
                : null;
}
function hasElementFlag(inst, flag) {
    return (0,_component__WEBPACK_IMPORTED_MODULE_2__.detectIsComponent)(inst)
        ? (0,_component__WEBPACK_IMPORTED_MODULE_2__.hasComponentFlag)(inst, flag)
        : detectIsVirtualNodeFactory(inst)
            ? hasVirtualNodeFactoryFlag(inst, flag)
            : detectIsTagVirtualNode(inst)
                ? hasTagVirtualNodeFlag(inst, flag)
                : false;
}
function getElementType(inst) {
    return (0,_component__WEBPACK_IMPORTED_MODULE_2__.detectIsComponent)(inst)
        ? inst.type
        : detectIsVirtualNodeFactory(inst)
            ? inst[ATTR_TYPE]
            : detectIsTagVirtualNode(inst)
                ? inst.name
                : detectIsVirtualNode(inst)
                    ? inst.type
                    : null;
}
function hasChildrenProp(inst) {
    return detectIsTagVirtualNode(inst) || (0,_component__WEBPACK_IMPORTED_MODULE_2__.detectIsComponent)(inst);
}
function detectAreSameInstanceTypes(prevInst, nextInst, isComponentFactories = false) {
    if (true) {
        if ( true && (0,_scope__WEBPACK_IMPORTED_MODULE_3__.$$scope)().getIsHot()) {
            if ((0,_component__WEBPACK_IMPORTED_MODULE_2__.detectIsComponent)(prevInst) && (0,_component__WEBPACK_IMPORTED_MODULE_2__.detectIsComponent)(nextInst)) {
                return prevInst.displayName === nextInst.displayName;
            }
        }
    }
    if (isComponentFactories) {
        const pc = prevInst;
        const nc = nextInst;
        return pc.type === nc.type;
    }
    return getElementType(prevInst) === getElementType(nextInst);
}
function detectAreSameComponentTypesWithSameKeys(prevInst, nextInst) {
    if (prevInst &&
        nextInst &&
        (0,_component__WEBPACK_IMPORTED_MODULE_2__.detectIsComponent)(prevInst) &&
        (0,_component__WEBPACK_IMPORTED_MODULE_2__.detectIsComponent)(nextInst) &&
        detectAreSameInstanceTypes(prevInst, nextInst, true)) {
        return getElementKey(prevInst) === getElementKey(nextInst);
    }
    return false;
}
var NodeType;
(function (NodeType) {
    NodeType["TAG"] = "TAG";
    NodeType["TEXT"] = "TEXT";
    NodeType["COMMENT"] = "COMMENT";
})(NodeType || (NodeType = {}));



/***/ }),

/***/ "../../../packages/core/src/walk/walk.ts":
/*!***********************************************!*\
  !*** ../../../packages/core/src/walk/walk.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "collectElements": () => (/* binding */ collectElements),
/* harmony export */   "createHookLocation": () => (/* binding */ createHookLocation),
/* harmony export */   "detectIsFiberAlive": () => (/* binding */ detectIsFiberAlive),
/* harmony export */   "getFiberWithElement": () => (/* binding */ getFiberWithElement),
/* harmony export */   "notifyParents": () => (/* binding */ notifyParents),
/* harmony export */   "tryOptMemoSlot": () => (/* binding */ tryOptMemoSlot),
/* harmony export */   "tryOptStaticSlot": () => (/* binding */ tryOptStaticSlot),
/* harmony export */   "walk": () => (/* binding */ walk)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "../../../packages/core/src/constants.ts");
/* harmony import */ var _fiber__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../fiber */ "../../../packages/core/src/fiber/fiber.ts");
/* harmony import */ var _platform__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../platform */ "../../../packages/core/src/platform/platform.ts");
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../view */ "../../../packages/core/src/view/view.ts");
/* harmony import */ var _memo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../memo */ "../../../packages/core/src/memo/memo.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils */ "../../../packages/core/src/utils/utils.ts");






function walk(fiber, onWalk) {
    let shouldDeep = true;
    let shouldStop = false;
    const skip = () => (shouldDeep = false);
    const stop = () => (shouldStop = true);
    const stack = [fiber];
    while (stack.length !== 0) {
        const unit = stack.pop();
        onWalk(unit, skip, stop);
        if (shouldStop)
            break;
        unit !== fiber && unit.next && stack.push(unit.next);
        shouldDeep && unit.child && stack.push(unit.child);
        shouldDeep = true;
    }
}
function collectElements(fiber, transform) {
    const elements = [];
    walk(fiber, (fiber, skip) => {
        if (fiber.element) {
            !_platform__WEBPACK_IMPORTED_MODULE_0__.platform.detectIsPortal(fiber.inst) && elements.push(transform(fiber));
            return skip();
        }
    });
    return elements;
}
function getFiberWithElement(fiber) {
    let $fiber = fiber;
    while ($fiber) {
        if ($fiber.element)
            return $fiber;
        $fiber = $fiber.parent;
    }
    return $fiber;
}
function detectIsFiberAlive(fiber) {
    let $fiber = fiber;
    while ($fiber) {
        if ($fiber.tag === _constants__WEBPACK_IMPORTED_MODULE_1__.DELETE_EFFECT_TAG)
            return false;
        $fiber = $fiber.parent;
    }
    return Boolean(fiber);
}
function createHookLocation(rootId, idx, fiber) {
    let $fiber = fiber;
    let loc = `${fiber.idx}${_constants__WEBPACK_IMPORTED_MODULE_1__.HOOK_DELIMETER}${idx}`;
    while ($fiber) {
        $fiber = $fiber.parent;
        $fiber && (loc = `${$fiber.idx}.${loc}`);
    }
    loc = `[${rootId}]${loc}`;
    return loc;
}
function detectIsStableMemoTree(fiber, $scope) {
    if (!(0,_view__WEBPACK_IMPORTED_MODULE_2__.hasChildrenProp)(fiber.inst))
        return;
    const actions = $scope.getActionsById(fiber.id);
    const children = fiber.inst.children;
    for (let i = 0; i < children.length; i++) {
        const inst = children[i];
        const key = (0,_view__WEBPACK_IMPORTED_MODULE_2__.getElementKey)(inst);
        if (key === null)
            return false;
        const alt = actions.map[key];
        if (!alt)
            return false;
        const pc = alt.inst;
        const nc = inst;
        const isStable = (0,_memo__WEBPACK_IMPORTED_MODULE_3__.detectIsMemo)(nc) && (0,_memo__WEBPACK_IMPORTED_MODULE_3__.detectIsMemo)(pc) && nc.type === pc.type && !nc.shouldUpdate(pc.props, nc.props);
        if (!isStable)
            return false;
    }
    return true;
}
function tryOptStaticSlot(fiber, alt, $scope) {
    const actions = $scope.getActionsById(fiber.id);
    const inst = fiber.inst;
    alt.element && (fiber.element = alt.element);
    for (let i = 0; i < inst.children.length; i++) {
        buildChildNode(inst.children, fiber, actions.map, i, fiber.eidx);
    }
    fiber.cc = inst.children.length;
    $scope.setMountDeep(false);
}
function tryOptMemoSlot(fiber, alt, $scope) {
    const actions = $scope.getActionsById(fiber.id);
    const hasMove = Boolean(actions.move);
    const hasRemove = Boolean(actions.remove);
    const hasInsert = Boolean(actions.insert);
    const hasReplace = Boolean(actions.insert);
    const canOptimize = ((hasMove && !hasRemove) || (hasRemove && !hasMove)) && !hasInsert && !hasReplace;
    if (!canOptimize || !detectIsStableMemoTree(fiber, $scope))
        return;
    hasMove && tryOptMov(fiber, alt, $scope);
    hasRemove && tryOptRem(fiber, alt, $scope);
}
function tryOptMov(fiber, alt, $scope) {
    const actions = $scope.getActionsById(fiber.id);
    buildChildNodes(fiber, alt, $scope, (fiber, key) => {
        if (!actions.move[key])
            return;
        fiber.alt = new _fiber__WEBPACK_IMPORTED_MODULE_4__.Fiber().mutate(fiber);
        fiber.tag = _constants__WEBPACK_IMPORTED_MODULE_1__.UPDATE_EFFECT_TAG;
        fiber.mask |= _constants__WEBPACK_IMPORTED_MODULE_1__.MOVE_MASK;
        $scope.addCandidate(fiber);
    });
}
function tryOptRem(fiber, alt, $scope) {
    buildChildNodes(fiber, alt, $scope);
}
function buildChildNodes(fiber, alt, $scope, onNode) {
    const actions = $scope.getActionsById(fiber.id);
    const inst = fiber.inst;
    const children = inst.children;
    alt.element && (fiber.element = alt.element);
    for (let i = 0; i < children.length; i++) {
        const key = getKey(children[i], i);
        const $fiber = actions.map[key];
        buildChildNode(children, fiber, actions.map, i, fiber.eidx);
        onNode && onNode($fiber, key);
    }
    fiber.cc = children.length;
    $scope.setMountDeep(false);
}
function buildChildNode(children, parent, altMap, idx, startEidx) {
    const prevIdx = idx - 1;
    const nextIdx = idx + 1;
    const key = getKey(children[idx], idx);
    const prevKey = getKey(children[prevIdx], prevIdx);
    const nextKey = getKey(children[nextIdx], nextIdx);
    const fiber = altMap[key];
    const left = altMap[prevKey];
    const right = altMap[nextKey];
    const isFirst = idx === 0;
    const isLast = idx === children.length - 1;
    isFirst && (parent.child = fiber);
    fiber.alt = null;
    fiber.parent = parent;
    fiber.tag = _constants__WEBPACK_IMPORTED_MODULE_1__.SKIP_EFFECT_TAG;
    fiber.idx = idx;
    left ? (fiber.eidx = left.eidx + (left.element ? 1 : left.cec)) : (fiber.eidx = startEidx);
    right && (fiber.next = right);
    isLast && (fiber.next = null);
    notifyParents(fiber);
}
function getKey(inst, idx) {
    const key = (0,_view__WEBPACK_IMPORTED_MODULE_2__.getElementKey)(inst);
    return key !== null ? key : (0,_utils__WEBPACK_IMPORTED_MODULE_5__.createIndexKey)(idx);
}
function notifyParents(fiber, alt = fiber) {
    fiber.increment(alt.element ? 1 : alt.cec);
    alt.mask & _constants__WEBPACK_IMPORTED_MODULE_1__.INSERTION_EFFECT_HOST_MASK && fiber.markHost(_constants__WEBPACK_IMPORTED_MODULE_1__.INSERTION_EFFECT_HOST_MASK);
    alt.mask & _constants__WEBPACK_IMPORTED_MODULE_1__.LAYOUT_EFFECT_HOST_MASK && fiber.markHost(_constants__WEBPACK_IMPORTED_MODULE_1__.LAYOUT_EFFECT_HOST_MASK);
    alt.mask & _constants__WEBPACK_IMPORTED_MODULE_1__.ASYNC_EFFECT_HOST_MASK && fiber.markHost(_constants__WEBPACK_IMPORTED_MODULE_1__.ASYNC_EFFECT_HOST_MASK);
    alt.mask & _constants__WEBPACK_IMPORTED_MODULE_1__.ATOM_HOST_MASK && fiber.markHost(_constants__WEBPACK_IMPORTED_MODULE_1__.ATOM_HOST_MASK);
    alt.mask & _constants__WEBPACK_IMPORTED_MODULE_1__.PORTAL_HOST_MASK && fiber.markHost(_constants__WEBPACK_IMPORTED_MODULE_1__.PORTAL_HOST_MASK);
}



/***/ }),

/***/ "../../../packages/core/src/workloop/workloop.ts":
/*!*******************************************************!*\
  !*** ../../../packages/core/src/workloop/workloop.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Fiber": () => (/* reexport safe */ _fiber__WEBPACK_IMPORTED_MODULE_6__.Fiber),
/* harmony export */   "createCallback": () => (/* binding */ createCallback),
/* harmony export */   "detectIsBusy": () => (/* binding */ detectIsBusy),
/* harmony export */   "workLoop": () => (/* binding */ workLoop)
/* harmony export */ });
/* harmony import */ var _platform__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../platform */ "../../../packages/core/src/platform/platform.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../constants */ "../../../packages/core/src/constants.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../utils */ "../../../packages/core/src/utils/utils.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scope */ "../../../packages/core/src/scope/scope.ts");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../component */ "../../../packages/core/src/component/component.ts");
/* harmony import */ var _fiber__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../fiber */ "../../../packages/core/src/fiber/fiber.ts");
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../view */ "../../../packages/core/src/view/view.ts");
/* harmony import */ var _memo__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../memo */ "../../../packages/core/src/memo/memo.ts");
/* harmony import */ var _walk__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../walk */ "../../../packages/core/src/walk/walk.ts");
/* harmony import */ var _scheduler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../scheduler */ "../../../packages/core/src/scheduler/scheduler.ts");
/* harmony import */ var _fragment__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../fragment */ "../../../packages/core/src/fragment/fragment.ts");
/* harmony import */ var _unmount__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../unmount */ "../../../packages/core/src/unmount/unmount.ts");












let hasPendingPromise = false;
let hasRenderError = false;
function workLoop(isAsync) {
    if (hasPendingPromise)
        return null;
    if (hasRenderError)
        return false;
    const $scope = (0,_scope__WEBPACK_IMPORTED_MODULE_0__.$$scope)();
    const wipFiber = $scope.getWorkInProgress();
    let unit = $scope.getNextUnitOfWork();
    let shouldYield = false;
    let hasMoreWork = Boolean(unit);
    try {
        while (unit && !shouldYield) {
            unit = performUnitOfWork(unit, $scope);
            $scope.setNextUnitOfWork(unit);
            hasMoreWork = Boolean(unit);
            shouldYield = isAsync && _scheduler__WEBPACK_IMPORTED_MODULE_1__.scheduler.shouldYield();
            if (shouldYield && _scheduler__WEBPACK_IMPORTED_MODULE_1__.scheduler.hasPrimaryTask())
                return fork($scope);
        }
        if (!unit && wipFiber) {
            commit($scope);
        }
    }
    catch (err) {
        if (err instanceof Promise) {
            hasPendingPromise = true;
            err.finally(() => {
                hasPendingPromise = false;
                !isAsync && workLoop(false);
            });
        }
        else {
            hasRenderError = true;
            throw err;
        }
    }
    return hasMoreWork;
}
function performUnitOfWork(fiber, $scope) {
    const wipFiber = $scope.getWorkInProgress();
    const isDeepWalking = $scope.getMountDeep();
    const isStream = $scope.getIsStreamZone();
    const hasChildren = isDeepWalking && (0,_view__WEBPACK_IMPORTED_MODULE_2__.hasChildrenProp)(fiber.inst) && fiber.inst.children.length > 0;
    fiber.hook && (fiber.hook.idx = 0);
    if (hasChildren) {
        const child = mountChild(fiber, $scope);
        isStream && _platform__WEBPACK_IMPORTED_MODULE_3__.platform.chunk(child);
        return child;
    }
    else {
        while (fiber.parent && fiber !== wipFiber) {
            const next = mountSibling(fiber, $scope);
            isStream && _platform__WEBPACK_IMPORTED_MODULE_3__.platform.chunk(fiber);
            if (next) {
                isStream && _platform__WEBPACK_IMPORTED_MODULE_3__.platform.chunk(next);
                return next;
            }
            fiber = fiber.parent;
        }
    }
    return null;
}
function mountChild(parent, $scope) {
    $scope.navToChild();
    const $inst = parent.inst;
    const idx = 0;
    const inst = (0,_view__WEBPACK_IMPORTED_MODULE_2__.hasChildrenProp)($inst) ? $inst.children[idx] : null;
    const alt = getAlternate(parent, inst, true, $scope);
    const fiber = createFiber(alt, inst, idx);
    fiber.parent = parent;
    parent.child = fiber;
    fiber.eidx = parent.element ? 0 : parent.eidx;
    share(fiber, parent, inst, $scope);
    return fiber;
}
function mountSibling(left, $scope) {
    $scope.navToSibling();
    const $inst = left.parent.inst;
    const idx = $scope.getMountIndex();
    const inst = (0,_view__WEBPACK_IMPORTED_MODULE_2__.hasChildrenProp)($inst) && $inst.children ? $inst.children[idx] : null;
    const hasSibling = Boolean(inst);
    if (!hasSibling) {
        $scope.navToParent();
        $scope.setMountDeep(false);
        return null;
    }
    $scope.setMountDeep(true);
    const alt = getAlternate(left, inst, false, $scope);
    const fiber = createFiber(alt, inst, idx);
    fiber.parent = left.parent;
    left.next = fiber;
    fiber.eidx = left.eidx + (left.element ? 1 : left.cec);
    share(fiber, left, inst, $scope);
    return fiber;
}
function share(fiber, prev, inst, $scope) {
    const { alt } = fiber;
    const shouldMount = alt && (0,_memo__WEBPACK_IMPORTED_MODULE_4__.detectIsMemo)(inst) ? shouldUpdate(fiber, inst, $scope) : true;
    $scope.setCursorFiber(fiber);
    fiber.inst = inst;
    if (alt && alt.mask & _constants__WEBPACK_IMPORTED_MODULE_5__.MOVE_MASK) {
        fiber.mask |= _constants__WEBPACK_IMPORTED_MODULE_5__.MOVE_MASK;
        alt.mask &= ~_constants__WEBPACK_IMPORTED_MODULE_5__.MOVE_MASK;
    }
    fiber.hook && (fiber.hook.owner = fiber);
    if (shouldMount) {
        fiber.inst = mount(fiber, prev, $scope);
        alt && reconcile(fiber, alt, $scope);
        setup(fiber, alt);
    }
    else if (fiber.mask & _constants__WEBPACK_IMPORTED_MODULE_5__.MOVE_MASK) {
        fiber.tag = _constants__WEBPACK_IMPORTED_MODULE_5__.UPDATE_EFFECT_TAG;
    }
    $scope.addCandidate(fiber);
}
function createFiber(alt, inst, idx) {
    const fiber = new _fiber__WEBPACK_IMPORTED_MODULE_6__.Fiber((0,_fiber__WEBPACK_IMPORTED_MODULE_6__.getHook)(alt, alt ? alt.inst : null, inst), alt ? alt.provider : null, idx);
    fiber.alt = alt || null;
    return fiber;
}
function getAlternate(fiber, inst, fromChild, $scope) {
    const key = (0,_view__WEBPACK_IMPORTED_MODULE_2__.getElementKey)(inst);
    if (key !== null) {
        const parentId = fromChild ? fiber.id : fiber.parent.id;
        const actions = $scope.getActionsById(parentId);
        if (actions) {
            const isMove = actions.move && Boolean(actions.move[key]);
            const isStable = actions.stable && Boolean(actions.stable[key]);
            if (isMove || isStable) {
                const alt = actions.map[key];
                isMove && (alt.mask |= _constants__WEBPACK_IMPORTED_MODULE_5__.MOVE_MASK);
                return alt;
            }
            return null;
        }
    }
    const alt = fiber.alt ? (fromChild ? fiber.alt.child || null : fiber.alt.next || null) : null;
    return alt;
}
function reconcile(fiber, alt, $scope) {
    const { id, inst } = fiber;
    const areSameTypes = (0,_view__WEBPACK_IMPORTED_MODULE_2__.detectAreSameInstanceTypes)(alt.inst, inst);
    if (!areSameTypes) {
        $scope.addDeletion(alt);
    }
    else if ((0,_view__WEBPACK_IMPORTED_MODULE_2__.hasChildrenProp)(alt.inst) && (0,_view__WEBPACK_IMPORTED_MODULE_2__.hasChildrenProp)(inst) && alt.cc !== 0) {
        const hasSameCount = alt.cc === inst.children.length;
        const check = (0,_view__WEBPACK_IMPORTED_MODULE_2__.hasElementFlag)(inst, _constants__WEBPACK_IMPORTED_MODULE_5__.Flag.SKIP_SCAN_OPT) ? !hasSameCount : true;
        if (check) {
            const { prevKeys, nextKeys, prevKeysMap, nextKeysMap, keyedFibersMap } = extractKeys(alt.child, inst.children);
            const flush = nextKeys.length === 0;
            let size = Math.max(prevKeys.length, nextKeys.length);
            let p = 0;
            let n = 0;
            $scope.addActionMap(id, keyedFibersMap);
            for (let i = 0; i < size; i++) {
                const nextKey = nextKeys[i - n] ?? null;
                const prevKey = prevKeys[i - p] ?? null;
                const prevKeyFiber = keyedFibersMap[prevKey] || null;
                if (nextKey !== prevKey) {
                    if (nextKey !== null && !prevKeysMap[nextKey]) {
                        if (prevKey !== null && !nextKeysMap[prevKey]) {
                            $scope.addReplaceAction(id, nextKey);
                            $scope.addDeletion(prevKeyFiber);
                        }
                        else {
                            $scope.addInsertAction(id, nextKey);
                            p++;
                            size++;
                        }
                    }
                    else if (!nextKeysMap[prevKey]) {
                        $scope.addRemoveAction(id, prevKey);
                        $scope.addDeletion(prevKeyFiber);
                        flush && (prevKeyFiber.mask |= _constants__WEBPACK_IMPORTED_MODULE_5__.FLUSH_MASK);
                        n++;
                        size++;
                    }
                    else if (nextKeysMap[prevKey] && nextKeysMap[nextKey]) {
                        $scope.addMoveAction(id, nextKey);
                    }
                }
                else if (nextKey !== null) {
                    $scope.addStableAction(id, nextKey);
                }
            }
            (0,_view__WEBPACK_IMPORTED_MODULE_2__.hasElementFlag)(inst, _constants__WEBPACK_IMPORTED_MODULE_5__.Flag.STATIC_SLOT_OPT) && (0,_walk__WEBPACK_IMPORTED_MODULE_7__.tryOptStaticSlot)(fiber, alt, $scope);
            (0,_view__WEBPACK_IMPORTED_MODULE_2__.hasElementFlag)(inst, _constants__WEBPACK_IMPORTED_MODULE_5__.Flag.MEMO_SLOT_OPT) && (0,_walk__WEBPACK_IMPORTED_MODULE_7__.tryOptMemoSlot)(fiber, alt, $scope);
        }
    }
}
function setup(fiber, alt) {
    const inst = fiber.inst;
    let isUpdate = false;
    fiber.parent.tag === _constants__WEBPACK_IMPORTED_MODULE_5__.CREATE_EFFECT_TAG && (fiber.tag = fiber.parent.tag);
    fiber.parent.mask & _constants__WEBPACK_IMPORTED_MODULE_5__.SHADOW_MASK && !fiber.parent.element && !(0,_view__WEBPACK_IMPORTED_MODULE_2__.detectIsReplacer)(inst) && (fiber.mask |= _constants__WEBPACK_IMPORTED_MODULE_5__.SHADOW_MASK);
    isUpdate =
        alt &&
            fiber.tag !== _constants__WEBPACK_IMPORTED_MODULE_5__.CREATE_EFFECT_TAG &&
            (0,_view__WEBPACK_IMPORTED_MODULE_2__.detectAreSameInstanceTypes)(alt.inst, inst) &&
            (0,_view__WEBPACK_IMPORTED_MODULE_2__.getElementKey)(alt.inst) === (0,_view__WEBPACK_IMPORTED_MODULE_2__.getElementKey)(inst);
    isUpdate && !fiber.element && alt.element && (fiber.element = alt.element);
    fiber.tag = isUpdate ? _constants__WEBPACK_IMPORTED_MODULE_5__.UPDATE_EFFECT_TAG : _constants__WEBPACK_IMPORTED_MODULE_5__.CREATE_EFFECT_TAG;
    (0,_view__WEBPACK_IMPORTED_MODULE_2__.hasChildrenProp)(fiber.inst) && (fiber.cc = fiber.inst.children.length);
    !fiber.element && (0,_view__WEBPACK_IMPORTED_MODULE_2__.detectIsVirtualNode)(fiber.inst) && (fiber.element = _platform__WEBPACK_IMPORTED_MODULE_3__.platform.createElement(fiber.inst));
    fiber.element && fiber.increment();
}
function shouldUpdate(fiber, inst, $scope) {
    if (true) {
        if ($scope.getIsHot())
            return true;
    }
    const alt = fiber.alt;
    const pc = alt.inst;
    const nc = inst;
    if (nc.type !== pc.type || nc.shouldUpdate(pc.props, nc.props))
        return true;
    $scope.setMountDeep(false);
    fiber.tag = _constants__WEBPACK_IMPORTED_MODULE_5__.SKIP_EFFECT_TAG;
    fiber.child = alt.child;
    fiber.child.parent = fiber;
    fiber.hook = alt.hook;
    fiber.cc = alt.cc;
    fiber.cec = alt.cec;
    alt.element && (fiber.element = alt.element);
    alt.provider && (fiber.provider = alt.provider);
    alt.catch && (fiber.catch = alt.catch);
    alt.atoms && (fiber.atoms = alt.atoms);
    const diff = fiber.eidx - alt.eidx;
    const deep = diff !== 0;
    if (deep) {
        (0,_walk__WEBPACK_IMPORTED_MODULE_7__.walk)(fiber.child, ($fiber, skip) => {
            $fiber.eidx += diff;
            if ($fiber.element)
                return skip();
        });
    }
    (0,_walk__WEBPACK_IMPORTED_MODULE_7__.notifyParents)(fiber, alt);
    return false;
}
function mount(fiber, prev, $scope) {
    let inst = fiber.inst;
    const isComponent = (0,_component__WEBPACK_IMPORTED_MODULE_8__.detectIsComponent)(inst);
    const component = inst;
    if (isComponent) {
        try {
            const id = $scope.getResourceId();
            let result = component.type(component.props, component.ref);
            const defers = $scope.getDefers();
            if (defers.length > 0) {
                const promise = Promise.all(defers.map(x => x()));
                $scope.setResourceId(id);
                $scope.resetDefers();
                $scope.navToPrev();
                $scope.setNextUnitOfWork(prev);
                _fiber__WEBPACK_IMPORTED_MODULE_6__.Fiber.setNextId(prev.id);
                throw promise;
            }
            if ((0,_utils__WEBPACK_IMPORTED_MODULE_9__.detectIsArray)(result)) {
                !(0,_fragment__WEBPACK_IMPORTED_MODULE_10__.detectIsFragment)(component) && (result = (0,_fragment__WEBPACK_IMPORTED_MODULE_10__.Fragment)({ slot: result }));
            }
            else if ((0,_utils__WEBPACK_IMPORTED_MODULE_9__.detectIsTextBased)(result)) {
                result = (0,_view__WEBPACK_IMPORTED_MODULE_2__.Text)(result);
            }
            component.children = result;
            _platform__WEBPACK_IMPORTED_MODULE_3__.platform.detectIsPortal(inst) && fiber.markHost(_constants__WEBPACK_IMPORTED_MODULE_5__.PORTAL_HOST_MASK);
        }
        catch (err) {
            if (err instanceof Promise)
                throw err;
            component.children = [];
            fiber.setError(err);
            (0,_utils__WEBPACK_IMPORTED_MODULE_9__.error)(err);
        }
    }
    else if ((0,_view__WEBPACK_IMPORTED_MODULE_2__.detectIsVirtualNodeFactory)(inst)) {
        inst = inst();
    }
    if ((0,_view__WEBPACK_IMPORTED_MODULE_2__.hasChildrenProp)(inst)) {
        inst.children = (0,_utils__WEBPACK_IMPORTED_MODULE_9__.flatten)(inst.children, x => ((0,_utils__WEBPACK_IMPORTED_MODULE_9__.detectIsTextBased)(x) ? (0,_view__WEBPACK_IMPORTED_MODULE_2__.Text)(x) : x || supportConditional(x)));
        isComponent && component.children.length === 0 && component.children.push((0,_view__WEBPACK_IMPORTED_MODULE_2__.createReplacer)());
    }
    return inst;
}
function extractKeys(alt, children) {
    let nextFiber = alt;
    let idx = 0;
    const prevKeys = [];
    const nextKeys = [];
    const prevKeysMap = {};
    const nextKeysMap = {};
    const keyedFibersMap = {};
    const usedKeysMap = {};
    while (nextFiber || idx < children.length) {
        if (nextFiber) {
            const key = (0,_view__WEBPACK_IMPORTED_MODULE_2__.getElementKey)(nextFiber.inst);
            const prevKey = (0,_utils__WEBPACK_IMPORTED_MODULE_9__.detectIsEmpty)(key) ? (0,_utils__WEBPACK_IMPORTED_MODULE_9__.createIndexKey)(idx) : key;
            if (!prevKeysMap[prevKey]) {
                prevKeysMap[prevKey] = true;
                prevKeys.push(prevKey);
            }
            keyedFibersMap[prevKey] = nextFiber;
        }
        if (children[idx]) {
            const inst = children[idx];
            const key = (0,_view__WEBPACK_IMPORTED_MODULE_2__.getElementKey)(inst);
            const nextKey = (0,_utils__WEBPACK_IMPORTED_MODULE_9__.detectIsEmpty)(key) ? (0,_utils__WEBPACK_IMPORTED_MODULE_9__.createIndexKey)(idx) : key;
            if (true) {
                if (usedKeysMap[nextKey]) {
                    (0,_utils__WEBPACK_IMPORTED_MODULE_9__.error)(`[Dark]: the key of node [${nextKey}] already has been used!`, [inst]);
                }
            }
            if (!nextKeysMap[nextKey]) {
                nextKeysMap[nextKey] = true;
                nextKeys.push(nextKey);
            }
            usedKeysMap[nextKey] = true;
        }
        nextFiber = nextFiber ? nextFiber.next : null;
        idx++;
    }
    return {
        prevKeys,
        nextKeys,
        prevKeysMap,
        nextKeysMap,
        keyedFibersMap,
    };
}
function supportConditional(inst) {
    return (0,_utils__WEBPACK_IMPORTED_MODULE_9__.detectIsFalsy)(inst) ? (0,_view__WEBPACK_IMPORTED_MODULE_2__.createReplacer)() : inst;
}
function commit($scope) {
    if (true) {
         true && $scope.setIsHot(false);
    }
    const wipFiber = $scope.getWorkInProgress();
    const deletions = $scope.getDeletions();
    const candidates = $scope.getCandidates();
    const isUpdateZone = $scope.getIsUpdateZone();
    const unmounts = [];
    const combinedMask = _constants__WEBPACK_IMPORTED_MODULE_5__.INSERTION_EFFECT_HOST_MASK | _constants__WEBPACK_IMPORTED_MODULE_5__.LAYOUT_EFFECT_HOST_MASK | _constants__WEBPACK_IMPORTED_MODULE_5__.ASYNC_EFFECT_HOST_MASK | _constants__WEBPACK_IMPORTED_MODULE_5__.PORTAL_HOST_MASK;
    for (const fiber of deletions) {
        const withNextTick = fiber.mask & _constants__WEBPACK_IMPORTED_MODULE_5__.ATOM_HOST_MASK && !(fiber.mask & combinedMask);
        withNextTick ? unmounts.push(fiber) : (0,_unmount__WEBPACK_IMPORTED_MODULE_11__.unmountFiber)(fiber);
        fiber.tag = _constants__WEBPACK_IMPORTED_MODULE_5__.DELETE_EFFECT_TAG;
        _platform__WEBPACK_IMPORTED_MODULE_3__.platform.commit(fiber);
    }
    isUpdateZone && sync(wipFiber);
    $scope.runInsertionEffects();
    for (const fiber of candidates) {
        fiber.tag !== _constants__WEBPACK_IMPORTED_MODULE_5__.SKIP_EFFECT_TAG && _platform__WEBPACK_IMPORTED_MODULE_3__.platform.commit(fiber);
        fiber.alt = null;
        (0,_view__WEBPACK_IMPORTED_MODULE_2__.hasChildrenProp)(fiber.inst) && (fiber.inst.children = null);
    }
    wipFiber.alt = null;
    _platform__WEBPACK_IMPORTED_MODULE_3__.platform.finishCommit();
    $scope.runLayoutEffects();
    $scope.runAsyncEffects();
    unmounts.length > 0 && setTimeout(() => unmounts.forEach(x => (0,_unmount__WEBPACK_IMPORTED_MODULE_11__.unmountFiber)(x)));
    flush($scope);
}
function flush($scope, cancel = false) {
    $scope.flush();
    !cancel && $scope.getEmitter().emit('finish');
    $scope.runAfterCommit();
}
function sync(fiber) {
    const diff = fiber.cec - fiber.alt.cec;
    if (diff === 0)
        return;
    const parentFiber = (0,_walk__WEBPACK_IMPORTED_MODULE_7__.getFiberWithElement)(fiber.parent);
    let isRight = false;
    fiber.increment(diff, true);
    (0,_walk__WEBPACK_IMPORTED_MODULE_7__.walk)(parentFiber.child, ($fiber, skip) => {
        if ($fiber === fiber) {
            isRight = true;
            return skip();
        }
        $fiber.element && skip();
        isRight && ($fiber.eidx += diff);
    });
}
function fork($scope) {
    const $$scope$ = $scope.copy();
    const wipFiber = $scope.getWorkInProgress();
    const child = wipFiber.child;
    child && (child.parent = null);
    const restore = (options) => {
        const { fiber: wipFiber, setValue, resetValue } = options;
        const $scope = (0,_scope__WEBPACK_IMPORTED_MODULE_0__.$$scope)();
        (0,_utils__WEBPACK_IMPORTED_MODULE_9__.detectIsFunction)(setValue) && setValue();
        (0,_utils__WEBPACK_IMPORTED_MODULE_9__.detectIsFunction)(resetValue) && $$scope$.addCancel(resetValue);
        wipFiber.alt = new _fiber__WEBPACK_IMPORTED_MODULE_6__.Fiber().mutate(wipFiber);
        wipFiber.tag = _constants__WEBPACK_IMPORTED_MODULE_5__.UPDATE_EFFECT_TAG;
        wipFiber.child = child;
        child && (child.parent = wipFiber);
        if (true) {
            wipFiber.marker = '✌️';
        }
        $$scope$.setRoot($scope.getRoot());
        $$scope$.setWorkInProgress(wipFiber);
        (0,_scope__WEBPACK_IMPORTED_MODULE_0__.replaceScope)($$scope$);
    };
    wipFiber.child = wipFiber.alt.child;
    wipFiber.alt = null;
    $scope.runInsertionEffects();
    $scope.applyCancels();
    flush($scope, true);
    _scheduler__WEBPACK_IMPORTED_MODULE_1__.scheduler.cancelTask(restore);
    return false;
}
function createCallback(options) {
    const { rootId, hook, isTransition, tools = $tools } = options;
    const callback = (restore) => {
        (0,_scope__WEBPACK_IMPORTED_MODULE_0__.setRootId)(rootId);
        const fromRestore = (0,_utils__WEBPACK_IMPORTED_MODULE_9__.detectIsFunction)(restore);
        const { shouldUpdate, setValue, resetValue } = tools();
        const $scope = (0,_scope__WEBPACK_IMPORTED_MODULE_0__.$$scope)();
        const owner = hook.owner;
        const fiber = owner.alt || owner;
        if (!shouldUpdate() || !(0,_walk__WEBPACK_IMPORTED_MODULE_7__.detectIsFiberAlive)(fiber) || fromRestore) {
            fromRestore && restore({ fiber, setValue, resetValue });
            return;
        }
        (0,_utils__WEBPACK_IMPORTED_MODULE_9__.detectIsFunction)(setValue) && setValue();
        (0,_utils__WEBPACK_IMPORTED_MODULE_9__.detectIsFunction)(resetValue) && isTransition && $scope.addCancel(resetValue);
        fiber.alt = new _fiber__WEBPACK_IMPORTED_MODULE_6__.Fiber().mutate(fiber);
        fiber.tag = _constants__WEBPACK_IMPORTED_MODULE_5__.UPDATE_EFFECT_TAG;
        fiber.cc = 0;
        fiber.cec = 0;
        fiber.child = null;
        if (true) {
            fiber.marker = '🔥';
        }
        $scope.setIsUpdateZone(true);
        $scope.resetMount();
        $scope.setWorkInProgress(fiber);
        $scope.setCursorFiber(fiber);
        fiber.inst = mount(fiber, null, $scope);
        $scope.setNextUnitOfWork(fiber);
    };
    return callback;
}
const $tools = () => ({
    shouldUpdate: _utils__WEBPACK_IMPORTED_MODULE_9__.trueFn,
    setValue: null,
    resetValue: null,
});
const detectIsBusy = () => Boolean((0,_scope__WEBPACK_IMPORTED_MODULE_0__.$$scope)()?.getWorkInProgress());



/***/ }),

/***/ "../../../packages/platform-browser/src/constants.ts":
/*!***********************************************************!*\
  !*** ../../../packages/platform-browser/src/constants.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CLASS_ATTR": () => (/* binding */ CLASS_ATTR),
/* harmony export */   "CLASS_NAME_ATTR": () => (/* binding */ CLASS_NAME_ATTR),
/* harmony export */   "EXCLUDE_ATTR_MARK": () => (/* binding */ EXCLUDE_ATTR_MARK),
/* harmony export */   "INPUT_TAG": () => (/* binding */ INPUT_TAG),
/* harmony export */   "STYLE_ATTR": () => (/* binding */ STYLE_ATTR),
/* harmony export */   "TEXTAREA_TAG": () => (/* binding */ TEXTAREA_TAG),
/* harmony export */   "VALUE_ATTR": () => (/* binding */ VALUE_ATTR),
/* harmony export */   "VERSION": () => (/* binding */ VERSION)
/* harmony export */ });
const VERSION = '0.25.1';
const INPUT_TAG = 'input';
const TEXTAREA_TAG = 'textarea';
const CLASS_NAME_ATTR = 'className';
const CLASS_ATTR = 'class';
const STYLE_ATTR = 'style';
const VALUE_ATTR = 'value';
const EXCLUDE_ATTR_MARK = '$';


/***/ }),

/***/ "../../../packages/platform-browser/src/create-root/create-root.tsx":
/*!**************************************************************************!*\
  !*** ../../../packages/platform-browser/src/create-root/create-root.tsx ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createRoot": () => (/* binding */ createRoot),
/* harmony export */   "unmount": () => (/* binding */ unmount)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/unmount/unmount.ts");
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../render */ "../../../packages/platform-browser/src/render/render.ts");


function createRoot(container) {
    return {
        render: (element) => (0,_render__WEBPACK_IMPORTED_MODULE_0__.render)(element, container),
        unmount: () => unmount(container),
    };
}
function unmount(container) {
    const rootId = _render__WEBPACK_IMPORTED_MODULE_0__.roots.get(container);
    (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_1__.unmountRoot)(rootId, () => {
        _render__WEBPACK_IMPORTED_MODULE_0__.roots["delete"](container);
        container.innerHTML = '';
    });
}



/***/ }),

/***/ "../../../packages/platform-browser/src/dom/dom.ts":
/*!*********************************************************!*\
  !*** ../../../packages/platform-browser/src/dom/dom.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "commit": () => (/* binding */ commit),
/* harmony export */   "createNativeElement": () => (/* binding */ createNativeElement),
/* harmony export */   "finishCommit": () => (/* binding */ finishCommit),
/* harmony export */   "insertNativeElementByIndex": () => (/* binding */ insertNativeElementByIndex),
/* harmony export */   "setTrackUpdate": () => (/* binding */ setTrackUpdate)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/view/view.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/constants.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/ref/ref.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/utils/utils.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/walk/walk.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/scope/scope.ts");
/* harmony import */ var _portal__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../portal */ "../../../packages/platform-browser/src/portal/portal.ts");
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../events */ "../../../packages/platform-browser/src/events/events.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "../../../packages/platform-browser/src/constants.ts");




let moves = [];
let patches = [];
let trackUpdate = null;
const svgTagNames = new Set([
    'svg',
    'animate',
    'animateMotion',
    'animateTransform',
    'circle',
    'clipPath',
    'defs',
    'desc',
    'ellipse',
    'feBlend',
    'feColorMatrix',
    'feComponentTransfer',
    'feComposite',
    'feConvolveMatrix',
    'feDiffuseLighting',
    'feDisplacementMap',
    'feDistantLight',
    'feDropShadow',
    'feFlood',
    'feFuncA',
    'feFuncB',
    'feFuncG',
    'feFuncR',
    'feGaussianBlur',
    'feImage',
    'feMerge',
    'feMergeNode',
    'feMorphology',
    'feOffset',
    'fePointLight',
    'feSpecularLighting',
    'feSpotLight',
    'feTile',
    'feTurbulence',
    'filter',
    'foreignObject',
    'g',
    'image',
    'line',
    'linearGradient',
    'marker',
    'mask',
    'metadata',
    'mpath',
    'path',
    'pattern',
    'polygon',
    'polyline',
    'radialGradient',
    'rect',
    'stop',
    'switch',
    'symbol',
    'text',
    'textPath',
    'tspan',
    'use',
    'view',
]);
const voidTagNames = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
]);
const createNativeElementMap = {
    [_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.NodeType.TAG]: (vNode) => {
        const tagNode = vNode;
        const name = tagNode.name;
        return detectIsSvgElement(name)
            ? document.createElementNS('http://www.w3.org/2000/svg', name)
            : document.createElement(name);
    },
    [_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.NodeType.TEXT]: (vNode) => {
        return document.createTextNode(vNode.value);
    },
    [_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.NodeType.COMMENT]: (vNode) => {
        return document.createComment(vNode.value);
    },
};
function createNativeElement(node) {
    return createNativeElementMap[node.type](node);
}
function detectIsSvgElement(name) {
    return svgTagNames.has(name);
}
function detectIsVoidElement(name) {
    return voidTagNames.has(name);
}
function setObjectStyle(element, style) {
    const keys = Object.keys(style);
    for (const key of keys) {
        element.style.setProperty(key, String(style[key]));
    }
}
function addAttributes(element, node, isHydrateZone) {
    const attrNames = Object.keys(node.attrs);
    const tagElement = element;
    for (const attrName of attrNames) {
        const attrValue = node.attrs[attrName];
        if (attrName[0] === _constants__WEBPACK_IMPORTED_MODULE_1__.EXCLUDE_ATTR_MARK)
            continue;
        if (attrName === _dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.REF_ATTR) {
            (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_3__.applyRef)(attrValue, element);
            continue;
        }
        if (attrName === _constants__WEBPACK_IMPORTED_MODULE_1__.CLASS_ATTR || attrName === _constants__WEBPACK_IMPORTED_MODULE_1__.CLASS_NAME_ATTR) {
            toggleAttribute(tagElement, _constants__WEBPACK_IMPORTED_MODULE_1__.CLASS_ATTR, attrValue);
            continue;
        }
        if (attrName === _constants__WEBPACK_IMPORTED_MODULE_1__.STYLE_ATTR && attrValue && (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_4__.detectIsObject)(attrValue)) {
            setObjectStyle(tagElement, attrValue);
            continue;
        }
        if ((0,_events__WEBPACK_IMPORTED_MODULE_5__.detectIsEvent)(attrName)) {
            (0,_events__WEBPACK_IMPORTED_MODULE_5__.delegateEvent)(tagElement, (0,_events__WEBPACK_IMPORTED_MODULE_5__.getEventName)(attrName), attrValue);
        }
        else if (!isHydrateZone && !(0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_4__.detectIsUndefined)(attrValue) && !_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.ATTR_BLACK_LIST[attrName]) {
            const stop = patchProperties({
                tagName: node.name,
                element: tagElement,
                attrValue,
                attrName,
            });
            !stop && tagElement.setAttribute(attrName, attrValue);
        }
    }
}
function updateAttributes(element, prevNode, nextNode) {
    const attrNames = getAttributeNames(prevNode, nextNode);
    const tagElement = element;
    for (const attrName of attrNames) {
        const prevAttrValue = prevNode.attrs[attrName];
        const nextAttrValue = nextNode.attrs[attrName];
        if (attrName[0] === _constants__WEBPACK_IMPORTED_MODULE_1__.EXCLUDE_ATTR_MARK)
            continue;
        if (attrName === _dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.REF_ATTR) {
            (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_3__.applyRef)(prevAttrValue, element);
            continue;
        }
        if ((attrName === _constants__WEBPACK_IMPORTED_MODULE_1__.CLASS_ATTR || attrName === _constants__WEBPACK_IMPORTED_MODULE_1__.CLASS_NAME_ATTR) && prevAttrValue !== nextAttrValue) {
            toggleAttribute(tagElement, _constants__WEBPACK_IMPORTED_MODULE_1__.CLASS_ATTR, nextAttrValue);
            continue;
        }
        if (attrName === _constants__WEBPACK_IMPORTED_MODULE_1__.STYLE_ATTR && nextAttrValue && prevAttrValue !== nextAttrValue && (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_4__.detectIsObject)(nextAttrValue)) {
            setObjectStyle(tagElement, nextAttrValue);
            continue;
        }
        if (!(0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_4__.detectIsUndefined)(nextAttrValue)) {
            if ((0,_events__WEBPACK_IMPORTED_MODULE_5__.detectIsEvent)(attrName)) {
                prevAttrValue !== nextAttrValue && (0,_events__WEBPACK_IMPORTED_MODULE_5__.delegateEvent)(tagElement, (0,_events__WEBPACK_IMPORTED_MODULE_5__.getEventName)(attrName), nextAttrValue);
            }
            else if (!_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.ATTR_BLACK_LIST[attrName] && prevAttrValue !== nextAttrValue) {
                const stop = patchProperties({
                    tagName: nextNode.name,
                    element: tagElement,
                    attrValue: nextAttrValue,
                    attrName,
                });
                !stop && tagElement.setAttribute(attrName, nextAttrValue);
            }
        }
        else {
            tagElement.removeAttribute(attrName);
        }
    }
}
function toggleAttribute(element, name, value) {
    value ? element.setAttribute(name, value) : element.removeAttribute(name);
}
function getAttributeNames(prevNode, nextNode) {
    const attrNames = new Set();
    const prevAttrs = Object.keys(prevNode.attrs);
    const nextAttrs = Object.keys(nextNode.attrs);
    const size = Math.max(prevAttrs.length, nextAttrs.length);
    for (let i = 0; i < size; i++) {
        attrNames.add(prevAttrs[i] || nextAttrs[i]);
    }
    return attrNames;
}
function patchProperties(options) {
    const { tagName, element, attrName, attrValue } = options;
    const fn = specialCasesMap[tagName];
    let stop = fn ? fn(element, attrName, attrValue) : false;
    if (canSetProperty(element, attrName)) {
        element[attrName] = attrValue;
    }
    if (!stop && (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_4__.detectIsBoolean)(attrValue)) {
        stop = !attrName.includes('-');
    }
    return stop;
}
function canSetProperty(element, key) {
    const prototype = Object.getPrototypeOf(element);
    const descriptor = Object.getOwnPropertyDescriptor(prototype, key);
    return Boolean(descriptor?.set);
}
const specialCasesMap = {
    [_constants__WEBPACK_IMPORTED_MODULE_1__.INPUT_TAG]: (element, attrName, attrValue) => {
        if (attrName === _constants__WEBPACK_IMPORTED_MODULE_1__.VALUE_ATTR) {
            patches.push(() => {
                (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_4__.detectIsBoolean)(attrValue) ? (element.checked = attrValue) : (element.value = String(attrValue));
            });
        }
        return false;
    },
    [_constants__WEBPACK_IMPORTED_MODULE_1__.TEXTAREA_TAG]: (element, attrName, attrValue) => {
        if (attrName === _constants__WEBPACK_IMPORTED_MODULE_1__.VALUE_ATTR) {
            element.innerText = String(attrValue);
            return true;
        }
        return false;
    },
};
function commitCreation(fiber) {
    const parentFiber = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_6__.getFiberWithElement)(fiber.parent);
    const parentElement = parentFiber.element;
    const childNodes = parentElement.childNodes;
    const isHydrateZone = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_7__.$$scope)().getIsHydrateZone();
    if (isHydrateZone) {
        const nativeElement = childNodes[fiber.eidx];
        if ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsTextVirtualNode)(fiber.inst) &&
            nativeElement instanceof Text &&
            fiber.inst.value.length !== nativeElement.length) {
            nativeElement.splitText(fiber.inst.value.length);
        }
        fiber.element = nativeElement;
    }
    else {
        if (!(fiber.mask & _dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.SHADOW_MASK)) {
            if (childNodes.length === 0 || fiber.eidx > childNodes.length - 1) {
                !detectIsVoidElement(parentFiber.inst.name) &&
                    appendNativeElement(fiber.element, parentElement);
            }
            else {
                insertNativeElement(fiber.element, parentElement.childNodes[fiber.eidx], parentElement);
            }
        }
    }
    (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsTagVirtualNode)(fiber.inst) && addAttributes(fiber.element, fiber.inst, isHydrateZone);
}
function commitUpdate(fiber) {
    const element = fiber.element;
    const prevInstance = fiber.alt.inst;
    const nextInstance = fiber.inst;
    (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsPlainVirtualNode)(nextInstance)
        ? prevInstance.value !== nextInstance.value && (element.textContent = nextInstance.value)
        : updateAttributes(element, prevInstance, nextInstance);
}
function commitDeletion(fiber) {
    const parentFiber = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_6__.getFiberWithElement)(fiber.parent);
    if (fiber.mask & _dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.FLUSH_MASK) {
        parentFiber.element.innerHTML && (parentFiber.element.innerHTML = '');
        return;
    }
    (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_6__.walk)(fiber, (fiber, skip) => {
        if (fiber.element) {
            !(0,_portal__WEBPACK_IMPORTED_MODULE_8__.detectIsPortal)(fiber.inst) &&
                canRemoveNativeElement(fiber.element, parentFiber.element) &&
                removeNativeElement(fiber.element, parentFiber.element);
            return skip();
        }
    });
}
function move(fiber) {
    const sourceNodes = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_6__.collectElements)(fiber, x => x.element);
    const sourceNode = sourceNodes[0];
    const parentElement = sourceNode.parentElement;
    const sourceFragment = new DocumentFragment();
    const elementIdx = fiber.eidx;
    let idx = 0;
    const move = () => {
        for (let i = 1; i < sourceNodes.length; i++) {
            removeNativeElement(parentElement.childNodes[elementIdx + 1], parentElement);
        }
        replaceNativeElement(sourceFragment, parentElement.childNodes[elementIdx], parentElement);
    };
    for (const node of sourceNodes) {
        insertNativeElement(document.createComment(`${elementIdx}:${idx}`), node, parentElement);
        appendNativeElement(node, sourceFragment);
        idx++;
    }
    moves.push(move);
}
const commitMap = {
    [_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.CREATE_EFFECT_TAG]: (fiber) => {
        if (!fiber.element || (0,_portal__WEBPACK_IMPORTED_MODULE_8__.detectIsPortal)(fiber.inst))
            return;
        trackUpdate && trackUpdate(fiber.element);
        commitCreation(fiber);
    },
    [_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.UPDATE_EFFECT_TAG]: (fiber) => {
        fiber.mask & _dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.MOVE_MASK && (move(fiber), (fiber.mask &= ~_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.MOVE_MASK));
        if (!fiber.element || (0,_portal__WEBPACK_IMPORTED_MODULE_8__.detectIsPortal)(fiber.inst))
            return;
        trackUpdate && trackUpdate(fiber.element);
        commitUpdate(fiber);
    },
    [_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.DELETE_EFFECT_TAG]: commitDeletion,
    [_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.SKIP_EFFECT_TAG]: _dark_engine_core__WEBPACK_IMPORTED_MODULE_4__.dummyFn,
};
function finishCommit() {
    moves.forEach(x => x());
    patches.forEach(x => x());
    moves = [];
    patches = [];
}
const commit = (fiber) => commitMap[fiber.tag](fiber);
const setTrackUpdate = (fn) => (trackUpdate = fn);
const appendNativeElement = (element, parent) => parent.appendChild(element);
const insertNativeElement = (element, sibling, parent) => parent.insertBefore(element, sibling);
const insertNativeElementByIndex = (element, idx, parent) => parent.insertBefore(element, parent.childNodes[idx]);
const replaceNativeElement = (element, candidate, parent) => parent.replaceChild(element, candidate);
const canRemoveNativeElement = (element, parent) => element.parentElement === parent;
const removeNativeElement = (element, parent) => parent.removeChild(element);



/***/ }),

/***/ "../../../packages/platform-browser/src/events/events.ts":
/*!***************************************************************!*\
  !*** ../../../packages/platform-browser/src/events/events.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SyntheticEvent": () => (/* binding */ SyntheticEvent),
/* harmony export */   "delegateEvent": () => (/* binding */ delegateEvent),
/* harmony export */   "detectIsEvent": () => (/* binding */ detectIsEvent),
/* harmony export */   "getEventName": () => (/* binding */ getEventName)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/scope/scope.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/utils/utils.ts");

class SyntheticEvent {
    type = '';
    sourceEvent = null;
    target = null;
    propagation = true;
    constructor(options) {
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
function delegateEvent(target, eventName, handler) {
    const $scope = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.$$scope)();
    const eventsMap = $scope.getEvents();
    const handlersMap = eventsMap.get(eventName);
    const $handler = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_1__.detectIsArray)(handler) ? (e) => handler[0](...handler.slice(1), e) : handler;
    if (!handlersMap) {
        const rootHandler = (event) => {
            const handler = eventsMap.get(eventName).get(event.target);
            const target = event.target;
            let $event = null;
            if ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_1__.detectIsFunction)(handler)) {
                $event = new SyntheticEvent({ sourceEvent: event, target });
                $scope.setIsEventZone(true);
                handler($event);
                $scope.setIsEventZone(false);
            }
            if (target.parentElement) {
                const shouldPropagate = $event ? $event.getPropagation() : true;
                if (shouldPropagate) {
                    const constructor = event.constructor;
                    target.parentElement.dispatchEvent(new constructor(event.type, event));
                }
            }
        };
        eventsMap.set(eventName, new WeakMap([[target, $handler]]));
        document.addEventListener(eventName, rootHandler, true);
        $scope.addEventUnsubscriber(() => document.removeEventListener(eventName, rootHandler, true));
    }
    else {
        handlersMap.set(target, $handler);
    }
}
const detectIsEvent = (attrName) => attrName.startsWith('on');
const getEventName = (attrName) => attrName.slice(2, attrName.length).toLowerCase();



/***/ }),

/***/ "../../../packages/platform-browser/src/hydrate-root/hydrate-root.tsx":
/*!****************************************************************************!*\
  !*** ../../../packages/platform-browser/src/hydrate-root/hydrate-root.tsx ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "hydrateRoot": () => (/* binding */ hydrateRoot)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/constants.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/scope/scope.ts");
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../render */ "../../../packages/platform-browser/src/render/render.ts");
/* harmony import */ var _create_root__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../create-root */ "../../../packages/platform-browser/src/create-root/create-root.tsx");



function hydrateRoot(container, element) {
    (0,_render__WEBPACK_IMPORTED_MODULE_0__.render)(element, container, hydrate);
    return {
        unmount: () => (0,_create_root__WEBPACK_IMPORTED_MODULE_1__.unmount)(container),
    };
}
function hydrate() {
    const element = document.querySelector(`[${_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.APP_STATE_ATTR}]`);
    if (!element)
        return;
    try {
        const resources = parse(element.textContent);
        const $scope = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_3__.$$scope)();
        for (const key of Object.keys(resources)) {
            $scope.setResource(Number(key), resources[key]);
        }
        element.remove();
    }
    catch (error) {
        throw Error('[Dark]: can not hydrate app state from the server!');
    }
}
const parse = (x) => JSON.parse(window.atob(x.replaceAll('"', '')));



/***/ }),

/***/ "../../../packages/platform-browser/src/portal/portal.ts":
/*!***************************************************************!*\
  !*** ../../../packages/platform-browser/src/portal/portal.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createPortal": () => (/* binding */ createPortal),
/* harmony export */   "detectIsPortal": () => (/* binding */ detectIsPortal),
/* harmony export */   "unmountPortal": () => (/* binding */ unmountPortal)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/component/component.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/scope/scope.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/use-memo/use-memo.ts");

const $$portal = Symbol('portal');
function createPortal(slot, container) {
    if (true) {
        if (!(container instanceof Element)) {
            throw new Error(`[Dark]: createPortal only gets an Element as container!`);
        }
    }
    return Portal({ container, slot });
}
const Portal = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.component)(props => {
    const element = props.container;
    const fiber = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_1__.$$scope)().getCursorFiber();
    (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => (element.innerHTML = ''), []);
    fiber.element = element;
    props.container = null;
    return props.slot;
}, { token: $$portal });
const detectIsPortal = (instance) => (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsComponent)(instance) && instance.token === $$portal;
const getPortalContainer = (fiber) => detectIsPortal(fiber.inst) ? fiber.element : null;
function unmountPortal(fiber) {
    const element = getPortalContainer(fiber);
    element && (element.innerHTML = '');
}



/***/ }),

/***/ "../../../packages/platform-browser/src/render/render.ts":
/*!***************************************************************!*\
  !*** ../../../packages/platform-browser/src/render/render.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "inject": () => (/* binding */ inject),
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "roots": () => (/* binding */ roots)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/platform/platform.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/utils/utils.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/scope/scope.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/fiber/fiber.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/view/view.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/constants.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/scheduler/scheduler.ts");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dom */ "../../../packages/platform-browser/src/dom/dom.ts");
/* harmony import */ var _portal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../portal */ "../../../packages/platform-browser/src/portal/portal.ts");



const roots = new Map();
const raf = requestAnimationFrame.bind(undefined);
const caf = cancelAnimationFrame.bind(undefined);
const spawn = raf;
let isInjected = false;
function inject() {
    _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.createElement = _dom__WEBPACK_IMPORTED_MODULE_1__.createNativeElement;
    _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.insertElement = _dom__WEBPACK_IMPORTED_MODULE_1__.insertNativeElementByIndex;
    _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.raf = raf;
    _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.caf = caf;
    _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.spawn = spawn;
    _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.commit = _dom__WEBPACK_IMPORTED_MODULE_1__.commit;
    _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.finishCommit = _dom__WEBPACK_IMPORTED_MODULE_1__.finishCommit;
    _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.detectIsDynamic = _dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.trueFn;
    _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.detectIsPortal = _portal__WEBPACK_IMPORTED_MODULE_3__.detectIsPortal;
    _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.unmountPortal = _portal__WEBPACK_IMPORTED_MODULE_3__.unmountPortal;
    _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.platform.chunk = _dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.dummyFn;
    isInjected = true;
}
function render(element, container, hydrate) {
    !isInjected && inject();
    if (true) {
        if (!(container instanceof Element)) {
            throw new Error(`[Dark]: render receives only Element as container!`);
        }
    }
    const isMounted = !(0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.detectIsUndefined)(roots.get(container));
    const isHydrate = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.detectIsFunction)(hydrate);
    let rootId = null;
    if (!isMounted) {
        rootId = roots.size;
        roots.set(container, rootId);
        !isHydrate && (container.innerHTML = '');
    }
    else {
        rootId = roots.get(container);
    }
    const $scope = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_4__.$$scope)(rootId);
    if ($scope?.getIsInsertionEffectsZone())
        return;
    const callback = () => {
        (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_4__.setRootId)(rootId);
        const $scope = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_4__.$$scope)();
        const rootFiber = $scope.getRoot();
        const isUpdate = Boolean(rootFiber);
        const fiber = new _dark_engine_core__WEBPACK_IMPORTED_MODULE_5__.Fiber().mutate({
            element: container,
            inst: new _dark_engine_core__WEBPACK_IMPORTED_MODULE_6__.TagVirtualNode(_dark_engine_core__WEBPACK_IMPORTED_MODULE_7__.ROOT, {}, (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.flatten)([element || (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_6__.createReplacer)()])),
            alt: rootFiber,
            tag: isUpdate ? _dark_engine_core__WEBPACK_IMPORTED_MODULE_7__.UPDATE_EFFECT_TAG : _dark_engine_core__WEBPACK_IMPORTED_MODULE_7__.CREATE_EFFECT_TAG,
        });
        $scope.resetMount();
        $scope.setWorkInProgress(fiber);
        $scope.setIsHydrateZone(isHydrate);
        $scope.setNextUnitOfWork(fiber);
        isHydrate && hydrate();
    };
    _dark_engine_core__WEBPACK_IMPORTED_MODULE_8__.scheduler.schedule(callback, { priority: _dark_engine_core__WEBPACK_IMPORTED_MODULE_7__.TaskPriority.NORMAL });
}



/***/ }),

/***/ "../../../packages/styled/src/constants.ts":
/*!*************************************************!*\
  !*** ../../../packages/styled/src/constants.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ANIMATION_NAME_PREFIX": () => (/* binding */ ANIMATION_NAME_PREFIX),
/* harmony export */   "BLANK_SPACE": () => (/* binding */ BLANK_SPACE),
/* harmony export */   "CLASS_NAME_PREFIX": () => (/* binding */ CLASS_NAME_PREFIX),
/* harmony export */   "CLOSING_CURLY_BRACE_MARK": () => (/* binding */ CLOSING_CURLY_BRACE_MARK),
/* harmony export */   "CLOSING_PARENTHESIS_MARK": () => (/* binding */ CLOSING_PARENTHESIS_MARK),
/* harmony export */   "COLON_MARK": () => (/* binding */ COLON_MARK),
/* harmony export */   "COMPONENTS_ATTR_VALUE": () => (/* binding */ COMPONENTS_ATTR_VALUE),
/* harmony export */   "CONTAINER_QUERY_MARK": () => (/* binding */ CONTAINER_QUERY_MARK),
/* harmony export */   "DOT_MARK": () => (/* binding */ DOT_MARK),
/* harmony export */   "FUNCTION_MARK": () => (/* binding */ FUNCTION_MARK),
/* harmony export */   "GLOBAL_ATTR_VALUE": () => (/* binding */ GLOBAL_ATTR_VALUE),
/* harmony export */   "INTERLEAVE_COMPONENTS_ATTR_VALUE": () => (/* binding */ INTERLEAVE_COMPONENTS_ATTR_VALUE),
/* harmony export */   "INTERLEAVE_GLOBAL_ATTR_VALUE": () => (/* binding */ INTERLEAVE_GLOBAL_ATTR_VALUE),
/* harmony export */   "KEYFRAMES_MARK": () => (/* binding */ KEYFRAMES_MARK),
/* harmony export */   "MEDIA_QUERY_MARK": () => (/* binding */ MEDIA_QUERY_MARK),
/* harmony export */   "MULTI_LINE_COMMENT_END_MARK": () => (/* binding */ MULTI_LINE_COMMENT_END_MARK),
/* harmony export */   "MULTI_LINE_COMMENT_START_MARK": () => (/* binding */ MULTI_LINE_COMMENT_START_MARK),
/* harmony export */   "NESTING_MARK": () => (/* binding */ NESTING_MARK),
/* harmony export */   "OPENING_CURLY_BRACE_MARK": () => (/* binding */ OPENING_CURLY_BRACE_MARK),
/* harmony export */   "OPENING_PARENTHESIS_MARK": () => (/* binding */ OPENING_PARENTHESIS_MARK),
/* harmony export */   "SELF_MARK": () => (/* binding */ SELF_MARK),
/* harmony export */   "SEMICOLON_MARK": () => (/* binding */ SEMICOLON_MARK),
/* harmony export */   "SINGLE_LINE_COMMENT_END_MARK": () => (/* binding */ SINGLE_LINE_COMMENT_END_MARK),
/* harmony export */   "SINGLE_LINE_COMMENT_START_MARK": () => (/* binding */ SINGLE_LINE_COMMENT_START_MARK),
/* harmony export */   "STYLED_ATTR": () => (/* binding */ STYLED_ATTR),
/* harmony export */   "STYLE_TAG": () => (/* binding */ STYLE_TAG),
/* harmony export */   "URL_FN_MARK": () => (/* binding */ URL_FN_MARK),
/* harmony export */   "VERSION": () => (/* binding */ VERSION)
/* harmony export */ });
const VERSION = '0.25.1';
const STYLE_TAG = 'style';
const STYLED_ATTR = 'dark-styled';
const GLOBAL_ATTR_VALUE = 'global';
const COMPONENTS_ATTR_VALUE = 'components';
const INTERLEAVE_GLOBAL_ATTR_VALUE = 'interleave-global';
const INTERLEAVE_COMPONENTS_ATTR_VALUE = 'interleave-components';
const CLASS_NAME_PREFIX = 'dk';
const ANIMATION_NAME_PREFIX = 'dka';
const OPENING_CURLY_BRACE_MARK = '{';
const CLOSING_CURLY_BRACE_MARK = '}';
const OPENING_PARENTHESIS_MARK = '(';
const CLOSING_PARENTHESIS_MARK = ')';
const COLON_MARK = ':';
const SEMICOLON_MARK = ';';
const DOT_MARK = '.';
const BLANK_SPACE = ' ';
const MEDIA_QUERY_MARK = '@media';
const CONTAINER_QUERY_MARK = '@container';
const KEYFRAMES_MARK = '@keyframes';
const NESTING_MARK = '>';
const SELF_MARK = '&';
const FUNCTION_MARK = '[$]';
const SINGLE_LINE_COMMENT_START_MARK = '//';
const SINGLE_LINE_COMMENT_END_MARK = '\n';
const MULTI_LINE_COMMENT_START_MARK = '/*';
const MULTI_LINE_COMMENT_END_MARK = '*/';
const URL_FN_MARK = 'url';


/***/ }),

/***/ "../../../packages/styled/src/global/global.ts":
/*!*****************************************************!*\
  !*** ../../../packages/styled/src/global/global.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createGlobalStyle": () => (/* binding */ createGlobalStyle),
/* harmony export */   "setupGlobal": () => (/* binding */ setupGlobal)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/ref/ref.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/component/component.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/use-id/use-id.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/use-memo/use-memo.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/utils/utils.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/use-insertion-effect/use-insertion-effect.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/platform/platform.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "../../../packages/styled/src/utils/utils.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../constants */ "../../../packages/styled/src/constants.ts");
/* harmony import */ var _styled__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styled */ "../../../packages/styled/src/styled/styled.ts");
/* harmony import */ var _theme__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../theme */ "../../../packages/styled/src/theme/theme.ts");
/* harmony import */ var _server_manager__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../server/manager */ "../../../packages/styled/src/server/manager.ts");






let cache = null;
let tag = null;
let isLoaded = false;
setupGlobal();
function createGlobalStyle(source, ...args) {
    if (!isLoaded && (0,_utils__WEBPACK_IMPORTED_MODULE_0__.detectIsBrowser)()) {
        (0,_styled__WEBPACK_IMPORTED_MODULE_1__.reuse)(getInterleavedElements(), createTag);
        isLoaded = true;
    }
    const fns = (0,_styled__WEBPACK_IMPORTED_MODULE_1__.filterArgs)(args);
    const sheet = (0,_styled__WEBPACK_IMPORTED_MODULE_1__.css)(source, ...args);
    const factory = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.forwardRef)((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_3__.component)(props => {
        const theme = (0,_theme__WEBPACK_IMPORTED_MODULE_4__.useTheme)();
        const id = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_5__.useId)();
        const css = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_6__.useMemo)(() => sheet.generate({ props: { ...props, theme }, fns }), [...(0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_7__.mapRecord)(props), theme]);
        (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_8__.useInsertionEffect)(() => {
            if (!tag) {
                tag = getTag() || createTag();
            }
            cache.set(id, css);
            reinject(tag, cache);
        }, [css]);
        (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_8__.useInsertionEffect)(() => {
            return () => {
                cache.delete(id);
                reinject(tag, cache);
            };
        }, []);
        if ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_9__.detectIsServer)()) {
            const manager = (0,_server_manager__WEBPACK_IMPORTED_MODULE_10__.useManager)();
            manager.collectGlobalStyle(css);
            manager.reset(setupGlobal);
        }
        return null;
    }));
    return factory;
}
function setupGlobal() {
    cache = new Map();
    tag = null;
    isLoaded = false;
}
function createTag() {
    const tag1 = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.createStyleElement)();
    const tag2 = (0,_styled__WEBPACK_IMPORTED_MODULE_1__.getTag)();
    (0,_utils__WEBPACK_IMPORTED_MODULE_0__.setAttr)(tag1, _constants__WEBPACK_IMPORTED_MODULE_11__.STYLED_ATTR, _constants__WEBPACK_IMPORTED_MODULE_11__.GLOBAL_ATTR_VALUE);
    if (tag2) {
        (0,_utils__WEBPACK_IMPORTED_MODULE_0__.insertBefore)(document.head, tag1, tag2);
    }
    else {
        (0,_utils__WEBPACK_IMPORTED_MODULE_0__.append)(document.head, tag1);
    }
    return tag1;
}
function getInterleavedElements() {
    return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getElements)(`[${_constants__WEBPACK_IMPORTED_MODULE_11__.STYLED_ATTR}="${_constants__WEBPACK_IMPORTED_MODULE_11__.INTERLEAVE_GLOBAL_ATTR_VALUE}"]`);
}
const getTag = () => (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getElement)(`[${_constants__WEBPACK_IMPORTED_MODULE_11__.STYLED_ATTR}="${_constants__WEBPACK_IMPORTED_MODULE_11__.GLOBAL_ATTR_VALUE}"]`);
const reinject = (tag, stylesMap) => {
    tag.textContent = '';
    stylesMap.forEach(css => (0,_styled__WEBPACK_IMPORTED_MODULE_1__.inject)(css, tag));
};



/***/ }),

/***/ "../../../packages/styled/src/hash/hash.ts":
/*!*************************************************!*\
  !*** ../../../packages/styled/src/hash/hash.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "hash": () => (/* binding */ hash)
/* harmony export */ });
const SEED = 5381;
const SIZE = 6;
const map = { 0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e', 5: 'f', 6: 'g', 7: 'h', 8: 'i', 9: 'j' };
function phash(h, x) {
    let i = x.length;
    while (i) {
        h = (h * 33) ^ x.charCodeAt(--i);
    }
    return h;
}
function hash(x) {
    const source = phash(SEED, x);
    const hash = String(Math.abs(source))
        .slice(0, SIZE)
        .split('')
        .map(x => map[x])
        .join('');
    return hash;
}



/***/ }),

/***/ "../../../packages/styled/src/keyframes/keyframes.ts":
/*!***********************************************************!*\
  !*** ../../../packages/styled/src/keyframes/keyframes.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Keyframes": () => (/* binding */ Keyframes),
/* harmony export */   "detectIsKeyframes": () => (/* binding */ detectIsKeyframes),
/* harmony export */   "keyframes": () => (/* binding */ keyframes)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/utils/utils.ts");
/* harmony import */ var _hash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hash */ "../../../packages/styled/src/hash/hash.ts");
/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../parse */ "../../../packages/styled/src/parse/parse.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "../../../packages/styled/src/constants.ts");




class Keyframes {
    name;
    token;
    constructor(name, token) {
        this.name = name;
        this.token = token;
    }
    getName() {
        return this.name;
    }
    getToken() {
        return this.token;
    }
}
function keyframes(source, ...args) {
    const joined = join(pad(source), args);
    const name = genAnimationName(joined);
    const [token] = (0,_parse__WEBPACK_IMPORTED_MODULE_0__.parse)(joined.replace(_constants__WEBPACK_IMPORTED_MODULE_1__.FUNCTION_MARK, name)).children;
    const keyframes = new Keyframes(name, token);
    return keyframes;
}
function pad(source) {
    const start = `${_constants__WEBPACK_IMPORTED_MODULE_1__.KEYFRAMES_MARK} ${_constants__WEBPACK_IMPORTED_MODULE_1__.FUNCTION_MARK} ${_constants__WEBPACK_IMPORTED_MODULE_1__.OPENING_CURLY_BRACE_MARK}`;
    const end = _constants__WEBPACK_IMPORTED_MODULE_1__.CLOSING_CURLY_BRACE_MARK;
    const strings = [];
    for (let i = 0; i < source.length; i++) {
        const isStart = i === 0;
        const isEnd = i === source.length - 1;
        if (isStart) {
            strings.push(start + source[i]);
        }
        else if (isEnd) {
            strings.push(source[i] + end);
        }
        else {
            strings.push(source[i]);
        }
    }
    return strings;
}
function join(source, args) {
    let joined = '';
    for (let i = 0; i < source.length; i++) {
        joined += source[i];
        if ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.detectIsTextBased)(args[i])) {
            joined += args[i];
        }
    }
    return joined;
}
const genAnimationName = (key) => `${_constants__WEBPACK_IMPORTED_MODULE_1__.ANIMATION_NAME_PREFIX}-${(0,_hash__WEBPACK_IMPORTED_MODULE_3__.hash)(key)}`;
const detectIsKeyframes = (x) => x instanceof Keyframes;



/***/ }),

/***/ "../../../packages/styled/src/parse/parse.ts":
/*!***************************************************!*\
  !*** ../../../packages/styled/src/parse/parse.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "parse": () => (/* binding */ parse)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "../../../packages/styled/src/constants.ts");
/* harmony import */ var _tokens__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../tokens */ "../../../packages/styled/src/tokens/tokens.ts");


function parse(css) {
    const stylesheet = new _tokens__WEBPACK_IMPORTED_MODULE_0__.StyleSheet();
    const stack = [];
    let buffer = '';
    let end = '';
    let fnIdx = -1;
    let isSingleLineComment = false;
    let isMultiLineComment = false;
    let isPropValue = false;
    let isUrl = false;
    for (let i = 0; i < css.length; i++) {
        const char = css[i];
        const parent = stack[stack.length - 1] || stylesheet;
        const last = parent.children[parent.children.length - 1];
        buffer += char;
        if (!isSingleLineComment && detectHasSingleLineCommentStartMark(buffer)) {
            isSingleLineComment = !isUrl;
        }
        else if (isSingleLineComment && detectHasSingleLineCommentEndMark(buffer)) {
            isSingleLineComment = false;
            buffer = '';
        }
        if (!isMultiLineComment && detectHasMultiLineCommentStartMark(buffer)) {
            isMultiLineComment = true;
            end = (0,_tokens__WEBPACK_IMPORTED_MODULE_0__.detectIsStyleRule)(last) ? createEnd(buffer) : '';
        }
        else if (isMultiLineComment && detectHasMultiLineCommentEndMark(buffer)) {
            isMultiLineComment = false;
            buffer = '';
        }
        if (isSingleLineComment || isMultiLineComment)
            continue;
        if (detectHasFunctionMark(buffer)) {
            const token = new _tokens__WEBPACK_IMPORTED_MODULE_0__.FunctionRule();
            if ((0,_tokens__WEBPACK_IMPORTED_MODULE_0__.detectIsFunctionRule)(last) && !last.getIsSealed() && last.style) {
                last.add(++fnIdx);
                buffer = '';
                continue;
            }
            token.add(++fnIdx);
            token.parent = parent;
            token.markAsDynamic();
            if ((0,_tokens__WEBPACK_IMPORTED_MODULE_0__.detectIsStyleRule)(last) && !last.value) {
                token.style = last;
                token.name = buffer.trim();
                last.normalize();
                last.isDynamic = true;
                parent.children[parent.children.length - 1] = token;
            }
            else {
                parent.children.push(token);
            }
            buffer = '';
            continue;
        }
        switch (char) {
            case _constants__WEBPACK_IMPORTED_MODULE_1__.OPENING_CURLY_BRACE_MARK:
                {
                    const token = detectHasMediaQueryMark(buffer)
                        ? new _tokens__WEBPACK_IMPORTED_MODULE_0__.MediaQueryRule()
                        : detectHasContainerQueryMark(buffer)
                            ? new _tokens__WEBPACK_IMPORTED_MODULE_0__.ContainerQueryRule()
                            : detectHasKeyframesMark(buffer)
                                ? new _tokens__WEBPACK_IMPORTED_MODULE_0__.KeyframesRule()
                                : new _tokens__WEBPACK_IMPORTED_MODULE_0__.NestingRule();
                    const canNest = (0,_tokens__WEBPACK_IMPORTED_MODULE_0__.detectIsMediaQueryRule)(token) || (0,_tokens__WEBPACK_IMPORTED_MODULE_0__.detectIsContainerQueryRule)(token) || (0,_tokens__WEBPACK_IMPORTED_MODULE_0__.detectIsKeyframesRule)(token)
                        ? (0,_tokens__WEBPACK_IMPORTED_MODULE_0__.detectIsStyleSheet)(parent)
                        : (0,_tokens__WEBPACK_IMPORTED_MODULE_0__.detectIsNestingRule)(token)
                            ? (0,_tokens__WEBPACK_IMPORTED_MODULE_0__.detectIsStyleSheet)(parent) ||
                                (0,_tokens__WEBPACK_IMPORTED_MODULE_0__.detectIsMediaQueryRule)(parent) ||
                                (0,_tokens__WEBPACK_IMPORTED_MODULE_0__.detectIsContainerQueryRule)(parent) ||
                                (0,_tokens__WEBPACK_IMPORTED_MODULE_0__.detectIsKeyframesRule)(parent)
                            : false;
                    if (!canNest) {
                        throw new Error('Illegal style nesting!');
                    }
                    token.value = sub(buffer);
                    token.normalize();
                    token.parent = parent;
                    if (!token.value) {
                        throw new Error('Empty style nesting!');
                    }
                    parent.children.push(token);
                    stack.push(token);
                    buffer = '';
                }
                break;
            case _constants__WEBPACK_IMPORTED_MODULE_1__.CLOSING_CURLY_BRACE_MARK:
                stack.pop();
                buffer = '';
                break;
            case _constants__WEBPACK_IMPORTED_MODULE_1__.COLON_MARK:
                {
                    if (!detectIsPropName(buffer, i, css, parent.children))
                        continue;
                    const token = new _tokens__WEBPACK_IMPORTED_MODULE_0__.StyleRule();
                    token.name = sub(buffer);
                    token.parent = parent;
                    parent.children.push(token);
                }
                buffer = '';
                isPropValue = true;
                break;
            case _constants__WEBPACK_IMPORTED_MODULE_1__.SEMICOLON_MARK:
                if (!last) {
                    throw new Error('Incorrect style!');
                }
                if ((0,_tokens__WEBPACK_IMPORTED_MODULE_0__.detectIsFunctionRule)(last)) {
                    last.seal(sub(buffer));
                    buffer = '';
                    continue;
                }
                last.value = end || sub(buffer);
                last.normalize();
                buffer = '';
                end = '';
                isPropValue = false;
                break;
            case _constants__WEBPACK_IMPORTED_MODULE_1__.OPENING_PARENTHESIS_MARK:
                if (isPropValue && detectHasUrlFnMark(buffer)) {
                    isUrl = true;
                }
                break;
            case _constants__WEBPACK_IMPORTED_MODULE_1__.CLOSING_PARENTHESIS_MARK:
                isUrl = false;
                break;
            default:
                break;
        }
    }
    return stylesheet;
}
function detectIsPropName(name, idx, css, children) {
    const last = children[children.length - 1];
    if (detectHasMediaQueryMark(name) || detectHasContainerQueryMark(name))
        return false;
    if ((0,_tokens__WEBPACK_IMPORTED_MODULE_0__.detectIsStyleRule)(last) && !last.value)
        return false;
    for (let i = idx; i < css.length; i++) {
        const char = css[i];
        if (char === _constants__WEBPACK_IMPORTED_MODULE_1__.OPENING_CURLY_BRACE_MARK)
            return false;
        if (char === _constants__WEBPACK_IMPORTED_MODULE_1__.SEMICOLON_MARK)
            return true;
    }
    return true;
}
const detectHasSingleLineCommentStartMark = (x) => x.endsWith(_constants__WEBPACK_IMPORTED_MODULE_1__.SINGLE_LINE_COMMENT_START_MARK);
const detectHasSingleLineCommentEndMark = (x) => x.endsWith(_constants__WEBPACK_IMPORTED_MODULE_1__.SINGLE_LINE_COMMENT_END_MARK);
const detectHasMultiLineCommentStartMark = (x) => x.endsWith(_constants__WEBPACK_IMPORTED_MODULE_1__.MULTI_LINE_COMMENT_START_MARK);
const detectHasMultiLineCommentEndMark = (x) => x.endsWith(_constants__WEBPACK_IMPORTED_MODULE_1__.MULTI_LINE_COMMENT_END_MARK);
const detectHasFunctionMark = (x) => x.endsWith(_constants__WEBPACK_IMPORTED_MODULE_1__.FUNCTION_MARK);
const detectHasUrlFnMark = (x) => x.endsWith(_constants__WEBPACK_IMPORTED_MODULE_1__.URL_FN_MARK + _constants__WEBPACK_IMPORTED_MODULE_1__.OPENING_PARENTHESIS_MARK);
const detectHasMediaQueryMark = (x) => x.trim().startsWith(_constants__WEBPACK_IMPORTED_MODULE_1__.MEDIA_QUERY_MARK);
const detectHasContainerQueryMark = (x) => x.trim().startsWith(_constants__WEBPACK_IMPORTED_MODULE_1__.CONTAINER_QUERY_MARK);
const detectHasKeyframesMark = (x) => x.trim().startsWith(_constants__WEBPACK_IMPORTED_MODULE_1__.KEYFRAMES_MARK);
const sub = (x) => x.substring(0, x.length - 1);
const createEnd = (x) => x.replace(_constants__WEBPACK_IMPORTED_MODULE_1__.MULTI_LINE_COMMENT_START_MARK, '').trim();



/***/ }),

/***/ "../../../packages/styled/src/server/manager.ts":
/*!******************************************************!*\
  !*** ../../../packages/styled/src/server/manager.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Manager": () => (/* binding */ Manager),
/* harmony export */   "ManagerProvider": () => (/* binding */ ManagerProvider),
/* harmony export */   "STYLE_LEVEL": () => (/* binding */ STYLE_LEVEL),
/* harmony export */   "useManager": () => (/* binding */ useManager)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/context/context.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/component/component.ts");

var STYLE_LEVEL;
(function (STYLE_LEVEL) {
    STYLE_LEVEL[STYLE_LEVEL["GLOBAL"] = 0] = "GLOBAL";
    STYLE_LEVEL[STYLE_LEVEL["COMPONENT"] = 1] = "COMPONENT";
})(STYLE_LEVEL || (STYLE_LEVEL = {}));
class Manager {
    styles = createStyles();
    resets = new Set();
    collectGlobalStyle(css) {
        this.styles[STYLE_LEVEL.GLOBAL].add(css);
    }
    collectComponentStyle(css) {
        this.styles[STYLE_LEVEL.COMPONENT].add(css);
    }
    getStyles() {
        return this.styles;
    }
    reset(fn) {
        this.resets.add(fn);
    }
    seal() {
        this.styles = createStyles();
        this.resets.forEach(x => x());
        this.resets = new Set();
    }
}
const createStyles = () => ({
    [STYLE_LEVEL.GLOBAL]: new Set(),
    [STYLE_LEVEL.COMPONENT]: new Set(),
});
const ManagerContext = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.createContext)(null, { displayName: 'Manager' });
function useManager() {
    return (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.useContext)(ManagerContext);
}
const ManagerProvider = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_1__.component)(({ manager, slot }) => {
    return ManagerContext.Provider({ value: manager, slot });
});



/***/ }),

/***/ "../../../packages/styled/src/styled/styled.ts":
/*!*****************************************************!*\
  !*** ../../../packages/styled/src/styled/styled.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "css": () => (/* binding */ css),
/* harmony export */   "detectIsStyled": () => (/* binding */ detectIsStyled),
/* harmony export */   "filterArgs": () => (/* binding */ filterArgs),
/* harmony export */   "getTag": () => (/* binding */ getTag),
/* harmony export */   "inject": () => (/* binding */ inject),
/* harmony export */   "reuse": () => (/* binding */ reuse),
/* harmony export */   "setupGlobal": () => (/* binding */ setupGlobal),
/* harmony export */   "styled": () => (/* binding */ styled)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/utils/utils.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/view/view.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/ref/ref.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/component/component.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/use-memo/use-memo.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/use-insertion-effect/use-insertion-effect.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/platform/platform.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../constants */ "../../../packages/styled/src/constants.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "../../../packages/styled/src/utils/utils.ts");
/* harmony import */ var _tokens__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../tokens */ "../../../packages/styled/src/tokens/tokens.ts");
/* harmony import */ var _keyframes__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../keyframes */ "../../../packages/styled/src/keyframes/keyframes.ts");
/* harmony import */ var _theme__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../theme */ "../../../packages/styled/src/theme/theme.ts");
/* harmony import */ var _server_manager__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../server/manager */ "../../../packages/styled/src/server/manager.ts");
/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../parse */ "../../../packages/styled/src/parse/parse.ts");
/* harmony import */ var _hash__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../hash */ "../../../packages/styled/src/hash/hash.ts");









let cache = null;
let injections = null;
let tag = null;
let isLoaded = false;
const $$styled = Symbol('styled');
setupGlobal();
function styled(tagName) {
    const factory = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsString)(tagName) ? (props) => (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_1__.View)({ as: tagName, ...props }) : tagName;
    if (!isLoaded && (0,_utils__WEBPACK_IMPORTED_MODULE_2__.detectIsBrowser)()) {
        reuse(getInterleavedElements(), createTag);
        isLoaded = true;
    }
    return createStyledComponent(factory);
}
function createStyledComponent(factory) {
    let transform = x => x;
    const isExtending = detectIsStyled(factory);
    const config = isExtending ? getExtendingConfig(factory) : null;
    const fn = (source, ...args) => {
        const $source = isExtending ? (0,_utils__WEBPACK_IMPORTED_MODULE_2__.mergeTemplates)(config.source, source) : source;
        const $args = isExtending ? [...config.args, ...args] : args;
        const $transform = isExtending ? (p) => transform(config.transform(p)) : transform;
        const fns = filterArgs($args);
        const [sheet, sheets] = slice(css($source, ...$args));
        const [baseName, baseStyle, baseKeyframes] = generate({ sheet, cache });
        const styled = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_3__.forwardRef)((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_4__.component)((props, ref) => {
            const { as: component, ...rest } = props;
            const theme = (0,_theme__WEBPACK_IMPORTED_MODULE_5__.useTheme)();
            const isSwap = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsFunction)(component);
            const $props = (isSwap ? rest : props);
            const $factory = isSwap ? component : isExtending ? config.factory : factory;
            const [className, styles, keyframes] = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_6__.useMemo)(() => {
                const [names, styles, keyframes] = sheets.reduce((acc, sheet) => {
                    const [className, style, keyframes] = generate({ sheet, cache, props: { ...props, theme }, fns });
                    const [names, styles, keyframesList] = acc;
                    names.push(className);
                    styles.push(style);
                    keyframesList.push(keyframes);
                    return acc;
                }, [[], [baseStyle], [baseKeyframes]]);
                const className = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.mergeClassNames)([...getClassNamesFrom(props), baseName, ...names]);
                return [className, filter(styles, injections), filter(keyframes, injections)];
            }, [...(0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.mapRecord)(props), theme]);
            (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_7__.useInsertionEffect)(() => {
                if (!tag) {
                    const $tag = getTag();
                    if ($tag) {
                        tag = $tag;
                        return;
                    }
                    else {
                        tag = createTag();
                    }
                }
                styles.forEach(css => inject(css, tag));
                keyframes.forEach(css => inject(css, tag));
            }, [...styles, ...keyframes]);
            if ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_8__.detectIsServer)()) {
                const manager = (0,_server_manager__WEBPACK_IMPORTED_MODULE_9__.useManager)();
                styles.forEach(css => manager.collectComponentStyle(css));
                keyframes.forEach(css => manager.collectComponentStyle(css));
                manager.reset(setupGlobal);
            }
            if ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsFunction)($props.slot)) {
                $props.slot = $props.slot((x) => `${className}_${x}`);
            }
            return $factory({ ...$transform($props), ref, className });
        }));
        styled[$$styled] = {
            className: baseName,
            source: $source,
            args: $args,
            factory: (config?.factory || factory),
            transform: config ? p => transform(config.transform(p)) : transform,
        };
        return styled;
    };
    fn.attrs = (t) => {
        transform = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsFunction)(t) ? t : transform;
        return fn;
    };
    return fn;
}
function filter(styles, injections) {
    const $styles = [];
    for (const css of styles) {
        if (!injections.has(css)) {
            $styles.push(css);
            injections.add(css);
        }
    }
    return $styles;
}
function setupGlobal() {
    cache = new Map();
    injections = new Set();
    tag = null;
    isLoaded = false;
}
function getExtendingConfig(factory) {
    const { className, ...rest } = factory[$$styled];
    const config = rest;
    return config;
}
function generate(options) {
    const { sheet: $sheet, cache, props, fns } = options;
    const [sheet, rules] = split($sheet);
    const key = sheet.generate({ className: _constants__WEBPACK_IMPORTED_MODULE_10__.FUNCTION_MARK, props, fns });
    const item = cache.get(key);
    const className = item ? item[0] : genClassName(key);
    const css = item ? item[1] : key.replaceAll(_constants__WEBPACK_IMPORTED_MODULE_10__.FUNCTION_MARK, className);
    let style = '';
    let keyframes = '';
    style += css;
    cache.set(key, [className, css]);
    for (const rule of rules) {
        keyframes += rule.generate();
    }
    return [className, style, keyframes];
}
function split(source) {
    const sheet = new _tokens__WEBPACK_IMPORTED_MODULE_11__.StyleSheet();
    const rules = [];
    for (const token of source.children) {
        if ((0,_tokens__WEBPACK_IMPORTED_MODULE_11__.detectIsKeyframesRule)(token)) {
            rules.push(token);
        }
        else {
            sheet.children.push(token);
        }
    }
    return [sheet, rules];
}
function slice(source) {
    const sheet = new _tokens__WEBPACK_IMPORTED_MODULE_11__.StyleSheet();
    const sheets = [];
    for (const token of source.children) {
        if (token.isDynamic) {
            const style = new _tokens__WEBPACK_IMPORTED_MODULE_11__.StyleSheet();
            style.children.push(token);
            sheets.push(style);
        }
        else {
            sheet.children.push(token);
        }
    }
    return [sheet, sheets];
}
function join(strings, args) {
    let joined = '';
    let keyframes = '';
    for (let i = 0; i < strings.length; i++) {
        const arg = args[i];
        joined += strings[i];
        if (detectIsStyled(arg)) {
            joined += `${_constants__WEBPACK_IMPORTED_MODULE_10__.DOT_MARK}${arg[$$styled].className}`;
        }
        else if ((0,_tokens__WEBPACK_IMPORTED_MODULE_11__.detectIsStyleSheet)(arg)) {
            joined += arg.generate();
        }
        else if ((0,_keyframes__WEBPACK_IMPORTED_MODULE_12__.detectIsKeyframes)(arg)) {
            joined += arg.getName();
            keyframes += arg.getToken().generate();
        }
        else if ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsFunction)(arg)) {
            joined += _constants__WEBPACK_IMPORTED_MODULE_10__.FUNCTION_MARK;
        }
        else if ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsTextBased)(arg)) {
            joined += arg;
        }
    }
    joined += keyframes;
    return joined;
}
function createTag() {
    const tag = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.createStyleElement)();
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.setAttr)(tag, _constants__WEBPACK_IMPORTED_MODULE_10__.STYLED_ATTR, _constants__WEBPACK_IMPORTED_MODULE_10__.COMPONENTS_ATTR_VALUE);
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__.append)(document.head, tag);
    return tag;
}
function inject(css, tag) {
    tag.textContent = `${tag.textContent}${css}`;
}
function reuse(elements, createTag) {
    if (elements.length === 0)
        return;
    const tag = createTag();
    let content = '';
    for (const element of elements) {
        content += element.textContent;
        element.remove();
    }
    tag.textContent = content;
}
function getInterleavedElements() {
    return (0,_utils__WEBPACK_IMPORTED_MODULE_2__.getElements)(`[${_constants__WEBPACK_IMPORTED_MODULE_10__.STYLED_ATTR}="${_constants__WEBPACK_IMPORTED_MODULE_10__.INTERLEAVE_COMPONENTS_ATTR_VALUE}"]`);
}
const getTag = () => (0,_utils__WEBPACK_IMPORTED_MODULE_2__.getElement)(`[${_constants__WEBPACK_IMPORTED_MODULE_10__.STYLED_ATTR}="${_constants__WEBPACK_IMPORTED_MODULE_10__.COMPONENTS_ATTR_VALUE}"]`);
const css = (strings, ...args) => (0,_parse__WEBPACK_IMPORTED_MODULE_13__.parse)(join(strings, args));
const getClassNamesFrom = (props) => (props.class || props.className || '').split(_constants__WEBPACK_IMPORTED_MODULE_10__.BLANK_SPACE);
const genClassName = (key) => `${_constants__WEBPACK_IMPORTED_MODULE_10__.CLASS_NAME_PREFIX}-${(0,_hash__WEBPACK_IMPORTED_MODULE_14__.hash)(key)}`;
const detectIsStyled = (x) => (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsFunction)(x) && Boolean(x[$$styled]);
const filterArgs = (args) => args.filter(x => (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsFunction)(x) && !detectIsStyled(x));
styled.a = styled('a');
styled.abbr = styled('abbr');
styled.address = styled('address');
styled.area = styled('area');
styled.article = styled('article');
styled.aside = styled('aside');
styled.audio = styled('audio');
styled.b = styled('b');
styled.base = styled('base');
styled.bdi = styled('bdi');
styled.bdo = styled('bdo');
styled.blockquote = styled('blockquote');
styled.body = styled('body');
styled.br = styled('br');
styled.button = styled('button');
styled.canvas = styled('canvas');
styled.caption = styled('caption');
styled.cite = styled('cite');
styled.code = styled('code');
styled.col = styled('col');
styled.colgroup = styled('colgroup');
styled.data = styled('data');
styled.datalist = styled('datalist');
styled.dd = styled('dd');
styled.del = styled('del');
styled.details = styled('details');
styled.dfn = styled('dfn');
styled.dialog = styled('dialog');
styled.div = styled('div');
styled.dl = styled('dl');
styled.dt = styled('dt');
styled.em = styled('em');
styled.embed = styled('embed');
styled.fieldset = styled('fieldset');
styled.figcaption = styled('figcaption');
styled.figure = styled('figure');
styled.footer = styled('footer');
styled.form = styled('form');
styled.h1 = styled('h1');
styled.h2 = styled('h2');
styled.h3 = styled('h3');
styled.h4 = styled('h4');
styled.h5 = styled('h5');
styled.h6 = styled('h6');
styled.head = styled('head');
styled.header = styled('header');
styled.hgroup = styled('hgroup');
styled.hr = styled('hr');
styled.html = styled('html');
styled.i = styled('i');
styled.iframe = styled('iframe');
styled.img = styled('img');
styled.input = styled('input');
styled.ins = styled('ins');
styled.kbd = styled('kbd');
styled.label = styled('label');
styled.legend = styled('legend');
styled.li = styled('li');
styled.link = styled('link');
styled.main = styled('main');
styled.map = styled('map');
styled.mark = styled('mark');
styled.menu = styled('menu');
styled.meta = styled('meta');
styled.meter = styled('meter');
styled.nav = styled('nav');
styled.noscript = styled('noscript');
styled.object = styled('object');
styled.ol = styled('ol');
styled.optgroup = styled('optgroup');
styled.option = styled('option');
styled.output = styled('output');
styled.p = styled('p');
styled.param = styled('param');
styled.picture = styled('picture');
styled.pre = styled('pre');
styled.progress = styled('progress');
styled.q = styled('q');
styled.rp = styled('rp');
styled.rt = styled('rt');
styled.ruby = styled('ruby');
styled.s = styled('s');
styled.samp = styled('samp');
styled.script = styled('script');
styled.section = styled('section');
styled.select = styled('select');
styled.small = styled('small');
styled.source = styled('source');
styled.span = styled('span');
styled.strong = styled('strong');
styled.style = styled('style');
styled.sub = styled('sub');
styled.summary = styled('summary');
styled.sup = styled('sup');
styled.table = styled('table');
styled.tbody = styled('tbody');
styled.td = styled('td');
styled.template = styled('template');
styled.textarea = styled('textarea');
styled.tfoot = styled('tfoot');
styled.th = styled('th');
styled.thead = styled('thead');
styled.time = styled('time');
styled.title = styled('title');
styled.tr = styled('tr');
styled.track = styled('track');
styled.u = styled('u');
styled.ul = styled('ul');
styled.var = styled('var');
styled.video = styled('video');
styled.wbr = styled('wbr');
styled.circle = styled('circle');
styled.clipPath = styled('clipPath');
styled.defs = styled('defs');
styled.desc = styled('desc');
styled.ellipse = styled('ellipse');
styled.feBlend = styled('feBlend');
styled.feColorMatrix = styled('feColorMatrix');
styled.feComponentTransfer = styled('feComponentTransfer');
styled.feComposite = styled('feComposite');
styled.feConvolveMatrix = styled('feConvolveMatrix');
styled.feDiffuseLighting = styled('feDiffuseLighting');
styled.feDisplacementMap = styled('feDisplacementMap');
styled.feDistantLight = styled('feDistantLight');
styled.feFlood = styled('feFlood');
styled.feFuncA = styled('feFuncA');
styled.feFuncB = styled('feFuncB');
styled.feFuncG = styled('feFuncG');
styled.feFuncR = styled('feFuncR');
styled.feGaussianBlur = styled('feGaussianBlur');
styled.feImage = styled('feImage');
styled.feMerge = styled('feMerge');
styled.feMergeNode = styled('feMergeNode');
styled.feMorphology = styled('feMorphology');
styled.feOffset = styled('feOffset');
styled.fePointLight = styled('fePointLight');
styled.feSpecularLighting = styled('feSpecularLighting');
styled.feSpotLight = styled('feSpotLight');
styled.feTile = styled('feTile');
styled.feTurbulence = styled('feTurbulence');
styled.filter = styled('filter');
styled.g = styled('g');
styled.image = styled('image');
styled.line = styled('line');
styled.linearGradient = styled('linearGradient');
styled.marker = styled('marker');
styled.mask = styled('mask');
styled.path = styled('path');
styled.pattern = styled('pattern');
styled.polygon = styled('polygon');
styled.polyline = styled('polyline');
styled.radialGradient = styled('radialGradient');
styled.rect = styled('rect');
styled.stop = styled('stop');
styled.svg = styled('svg');
styled.switch = styled('switch');
styled.symbol = styled('symbol');
styled.text = styled('text');
styled.textPath = styled('textPath');
styled.tspan = styled('tspan');
styled.use = styled('use');
styled.view = styled('view');



/***/ }),

/***/ "../../../packages/styled/src/theme/theme.ts":
/*!***************************************************!*\
  !*** ../../../packages/styled/src/theme/theme.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ThemeProvider": () => (/* binding */ ThemeProvider),
/* harmony export */   "useTheme": () => (/* binding */ useTheme)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/context/context.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/component/component.ts");

const ThemeContext = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.createContext)(null, { displayName: 'Theme' });
const useTheme = () => (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.useContext)(ThemeContext);
const ThemeProvider = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_1__.component)(({ theme, slot }) => {
    return ThemeContext.Provider({ value: theme, slot });
});



/***/ }),

/***/ "../../../packages/styled/src/tokens/tokens.ts":
/*!*****************************************************!*\
  !*** ../../../packages/styled/src/tokens/tokens.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ContainerQueryRule": () => (/* binding */ ContainerQueryRule),
/* harmony export */   "FunctionRule": () => (/* binding */ FunctionRule),
/* harmony export */   "KeyframesRule": () => (/* binding */ KeyframesRule),
/* harmony export */   "MediaQueryRule": () => (/* binding */ MediaQueryRule),
/* harmony export */   "NestingRule": () => (/* binding */ NestingRule),
/* harmony export */   "StyleRule": () => (/* binding */ StyleRule),
/* harmony export */   "StyleSheet": () => (/* binding */ StyleSheet),
/* harmony export */   "detectIsContainerQueryRule": () => (/* binding */ detectIsContainerQueryRule),
/* harmony export */   "detectIsFunctionRule": () => (/* binding */ detectIsFunctionRule),
/* harmony export */   "detectIsKeyframesRule": () => (/* binding */ detectIsKeyframesRule),
/* harmony export */   "detectIsMediaQueryRule": () => (/* binding */ detectIsMediaQueryRule),
/* harmony export */   "detectIsNestingRule": () => (/* binding */ detectIsNestingRule),
/* harmony export */   "detectIsStyleRule": () => (/* binding */ detectIsStyleRule),
/* harmony export */   "detectIsStyleSheet": () => (/* binding */ detectIsStyleSheet)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "../../../packages/styled/src/constants.ts");
/* harmony import */ var _keyframes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../keyframes */ "../../../packages/styled/src/keyframes/keyframes.ts");


class Token {
    name = '';
    value = '';
    parent;
    isDynamic = false;
    normalize() {
        this.name = this.name.trim();
        this.value = this.value.trim();
    }
    markAsDynamic() {
        this.isDynamic = true;
        detectIsToken(this.parent) && !this.parent.isDynamic && this.parent.markAsDynamic();
    }
}
class StyleRule extends Token {
    generate() {
        return `${this.name}${_constants__WEBPACK_IMPORTED_MODULE_0__.COLON_MARK}${this.value}${_constants__WEBPACK_IMPORTED_MODULE_0__.SEMICOLON_MARK}`;
    }
}
class NestingRule extends Token {
    name = _constants__WEBPACK_IMPORTED_MODULE_0__.NESTING_MARK;
    children = [];
    generate(...args) {
        const className = args[0];
        const props = args[1];
        const fns = args[2];
        let styles = `${this.value.replaceAll(_constants__WEBPACK_IMPORTED_MODULE_0__.SELF_MARK, `${_constants__WEBPACK_IMPORTED_MODULE_0__.DOT_MARK}${className}`)}${_constants__WEBPACK_IMPORTED_MODULE_0__.OPENING_CURLY_BRACE_MARK}`;
        let keyframes = '';
        for (const token of this.children) {
            const [$styles, _, __, ___, $keyframes] = generate({ token, className, props, fns });
            styles += $styles;
            keyframes += $keyframes;
        }
        styles += `${_constants__WEBPACK_IMPORTED_MODULE_0__.CLOSING_CURLY_BRACE_MARK}${keyframes}`;
        return styles;
    }
}
class MediaQueryRule extends Token {
    name = _constants__WEBPACK_IMPORTED_MODULE_0__.MEDIA_QUERY_MARK;
    children = [];
    generate(...args) {
        const className = args[0];
        const props = args[1];
        const fns = args[2];
        let styles = className
            ? `${this.value}${_constants__WEBPACK_IMPORTED_MODULE_0__.OPENING_CURLY_BRACE_MARK}${_constants__WEBPACK_IMPORTED_MODULE_0__.DOT_MARK}${className}${_constants__WEBPACK_IMPORTED_MODULE_0__.OPENING_CURLY_BRACE_MARK}`
            : `${this.value}${_constants__WEBPACK_IMPORTED_MODULE_0__.OPENING_CURLY_BRACE_MARK}`;
        let nesting = '';
        for (const token of this.children) {
            const [$styles, $nesting] = generate({ token, className, props, fns });
            styles += $styles;
            nesting += $nesting;
        }
        if (className) {
            styles += `${_constants__WEBPACK_IMPORTED_MODULE_0__.CLOSING_CURLY_BRACE_MARK}${nesting}${_constants__WEBPACK_IMPORTED_MODULE_0__.CLOSING_CURLY_BRACE_MARK}`;
        }
        else {
            styles += `${nesting}${_constants__WEBPACK_IMPORTED_MODULE_0__.CLOSING_CURLY_BRACE_MARK}`;
        }
        return styles;
    }
}
class ContainerQueryRule extends Token {
    name = _constants__WEBPACK_IMPORTED_MODULE_0__.CONTAINER_QUERY_MARK;
    children = [];
    generate(...args) {
        const className = args[0];
        const props = args[1];
        const fns = args[2];
        let styles = className
            ? `${this.value}${_constants__WEBPACK_IMPORTED_MODULE_0__.OPENING_CURLY_BRACE_MARK}${_constants__WEBPACK_IMPORTED_MODULE_0__.DOT_MARK}${className}${_constants__WEBPACK_IMPORTED_MODULE_0__.OPENING_CURLY_BRACE_MARK}`
            : `${this.value}${_constants__WEBPACK_IMPORTED_MODULE_0__.OPENING_CURLY_BRACE_MARK}`;
        let nesting = '';
        for (const token of this.children) {
            const [$styles, $nesting] = generate({ token, className, props, fns });
            styles += $styles;
            nesting += $nesting;
        }
        if (className) {
            styles += `${_constants__WEBPACK_IMPORTED_MODULE_0__.CLOSING_CURLY_BRACE_MARK}${nesting}${_constants__WEBPACK_IMPORTED_MODULE_0__.CLOSING_CURLY_BRACE_MARK}`;
        }
        else {
            styles += `${nesting}${_constants__WEBPACK_IMPORTED_MODULE_0__.CLOSING_CURLY_BRACE_MARK}`;
        }
        return styles;
    }
}
class KeyframesRule extends Token {
    name = _constants__WEBPACK_IMPORTED_MODULE_0__.KEYFRAMES_MARK;
    children = [];
    generate(...args) {
        const props = args[0];
        const fns = args[1];
        let keyframes = `${this.value}${_constants__WEBPACK_IMPORTED_MODULE_0__.OPENING_CURLY_BRACE_MARK}`;
        for (const token of this.children) {
            const [$styles, $nesting] = generate({ token, props, fns });
            keyframes += $styles;
            keyframes += $nesting;
        }
        keyframes += `${_constants__WEBPACK_IMPORTED_MODULE_0__.CLOSING_CURLY_BRACE_MARK}`;
        return keyframes;
    }
}
class FunctionRule extends Token {
    name = _constants__WEBPACK_IMPORTED_MODULE_0__.FUNCTION_MARK;
    args = [];
    style = null;
    end = '';
    isSealed = false;
    add(idx) {
        this.args.push(idx);
    }
    seal(end) {
        this.isSealed = true;
        this.end = end;
    }
    getIsSealed() {
        return this.isSealed;
    }
    getEnd() {
        return this.end;
    }
    generate(...args) {
        const className = args[0];
        const props = args[1];
        const fns = args[2];
        const styleExp = this.style;
        const [idx, ...rest] = this.args;
        const value = fns[idx](props);
        let styles = '';
        let nesting = '';
        let media = '';
        let container = '';
        let keyframes = '';
        if (detectIsStyleSheet(value)) {
            for (const token of value.children) {
                const [$styles, $nesting, $media, $container, $keyframes] = generate({ token, className, props, fns });
                styles += $styles;
                nesting += $nesting;
                media += $media;
                container += $container;
                keyframes += $keyframes;
            }
        }
        else if (styleExp) {
            const end = rest.reduce((acc, x) => (acc += _constants__WEBPACK_IMPORTED_MODULE_0__.BLANK_SPACE + fns[x](props)), '') + this.end;
            if ((0,_keyframes__WEBPACK_IMPORTED_MODULE_1__.detectIsKeyframes)(value)) {
                styleExp.value = replace(this.name, value.getName()) + end;
                styles += styleExp.generate();
                keyframes += value.getToken().generate(props, fns);
            }
            else {
                styleExp.value = replace(this.name, value) + end;
                styles += styleExp.generate();
            }
        }
        return [styles, nesting, media, container, keyframes];
    }
}
class StyleSheet {
    children = [];
    generate(options = {}) {
        const { className = null, props, fns } = options;
        let styles = className ? `${_constants__WEBPACK_IMPORTED_MODULE_0__.DOT_MARK}${className}${_constants__WEBPACK_IMPORTED_MODULE_0__.OPENING_CURLY_BRACE_MARK}` : '';
        let nesting = '';
        let media = '';
        let container = '';
        let keyframes = '';
        for (const token of this.children) {
            const [$styles, $nesting, $media, $container, $keyframes] = generate({ token, className, props, fns });
            styles += $styles;
            nesting += $nesting;
            media += $media;
            container += $container;
            keyframes += $keyframes;
        }
        if (className) {
            styles += `${_constants__WEBPACK_IMPORTED_MODULE_0__.CLOSING_CURLY_BRACE_MARK}${nesting}${media}${container}${keyframes}`;
        }
        else {
            styles += `${nesting}${media}${container}${keyframes}`;
        }
        return styles;
    }
}
function generate(options) {
    const { token, className = null, props, fns } = options;
    let styles = '';
    let nesting = '';
    let media = '';
    let container = '';
    let keyframes = '';
    if (detectIsStyleRule(token)) {
        styles += token.generate();
    }
    else if (detectIsNestingRule(token)) {
        nesting += token.generate(className, props, fns);
    }
    else if (detectIsMediaQueryRule(token)) {
        media += token.generate(className, props, fns);
    }
    else if (detectIsContainerQueryRule(token)) {
        container += token.generate(className, props, fns);
    }
    else if (detectIsKeyframesRule(token)) {
        keyframes += token.generate(props, fns);
    }
    else if (detectIsFunctionRule(token)) {
        const [$styles, $nesting, $media, $container, $keyframes] = token.generate(className, props, fns);
        styles += $styles;
        nesting += $nesting;
        media += $media;
        container += $container;
        keyframes += $keyframes;
    }
    return [styles, nesting, media, container, keyframes];
}
const detectIsToken = (x) => x instanceof Token;
const detectIsStyleRule = (x) => x instanceof StyleRule;
const detectIsMediaQueryRule = (x) => x instanceof MediaQueryRule;
const detectIsContainerQueryRule = (x) => x instanceof ContainerQueryRule;
const detectIsKeyframesRule = (x) => x instanceof KeyframesRule;
const detectIsNestingRule = (x) => x instanceof NestingRule;
const detectIsFunctionRule = (x) => x instanceof FunctionRule;
const detectIsStyleSheet = (x) => x instanceof StyleSheet;
const replace = (target, x) => target.replace(_constants__WEBPACK_IMPORTED_MODULE_0__.FUNCTION_MARK, x);



/***/ }),

/***/ "../../../packages/styled/src/utils/utils.ts":
/*!***************************************************!*\
  !*** ../../../packages/styled/src/utils/utils.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "append": () => (/* binding */ append),
/* harmony export */   "createStyleElement": () => (/* binding */ createStyleElement),
/* harmony export */   "detectIsBrowser": () => (/* binding */ detectIsBrowser),
/* harmony export */   "getElement": () => (/* binding */ getElement),
/* harmony export */   "getElements": () => (/* binding */ getElements),
/* harmony export */   "insertBefore": () => (/* binding */ insertBefore),
/* harmony export */   "mapProps": () => (/* binding */ mapProps),
/* harmony export */   "mergeClassNames": () => (/* binding */ mergeClassNames),
/* harmony export */   "mergeTemplates": () => (/* binding */ mergeTemplates),
/* harmony export */   "setAttr": () => (/* binding */ setAttr),
/* harmony export */   "uniq": () => (/* binding */ uniq)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "../../../packages/styled/src/constants.ts");

const uniq = (items, selector = x => x) => {
    const arr = [];
    const set = new Set();
    for (const item of items) {
        const key = selector(item);
        !set.has(key) && arr.push(item);
        set.add(key);
    }
    return arr;
};
const mapProps = (props) => Object.keys(props).map(key => props[key]);
const mergeClassNames = (classNames) => uniq(classNames.filter(Boolean)).join(_constants__WEBPACK_IMPORTED_MODULE_0__.BLANK_SPACE);
const getElement = (selector) => document.querySelector(selector);
const getElements = (selector) => Array.from(document.querySelectorAll(selector));
const createStyleElement = () => document.createElement(_constants__WEBPACK_IMPORTED_MODULE_0__.STYLE_TAG);
const setAttr = (element, attrName, attrValue) => element.setAttribute(attrName, attrValue);
const append = (parent, element) => parent.appendChild(element);
const insertBefore = (parent, element, sibling) => parent.insertBefore(element, sibling);
const mergeTemplates = (t1, t2) => {
    const [first] = t2;
    const $t1 = [...t1];
    const $t2 = [];
    let result = null;
    for (let i = 0; i < t2.length; i++) {
        if (i > 0) {
            $t2.push(t2[i]);
        }
    }
    $t1[$t1.length - 1] = $t1[$t1.length - 1] + first;
    result = [...$t1, ...$t2];
    Object.assign(result, { raw: result });
    return result;
};
const detectIsBrowser = () => typeof globalThis.window !== 'undefined';



/***/ }),

/***/ "../../../packages/web-router/src/constants.ts":
/*!*****************************************************!*\
  !*** ../../../packages/web-router/src/constants.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HASH_MARK": () => (/* binding */ HASH_MARK),
/* harmony export */   "PARAMETER_MARK": () => (/* binding */ PARAMETER_MARK),
/* harmony export */   "PROTOCOL_MARK": () => (/* binding */ PROTOCOL_MARK),
/* harmony export */   "ROOT_MARK": () => (/* binding */ ROOT_MARK),
/* harmony export */   "SEARCH_MARK": () => (/* binding */ SEARCH_MARK),
/* harmony export */   "SLASH_MARK": () => (/* binding */ SLASH_MARK),
/* harmony export */   "VERSION": () => (/* binding */ VERSION),
/* harmony export */   "WILDCARD_MARK": () => (/* binding */ WILDCARD_MARK)
/* harmony export */ });
const VERSION = '0.25.1';
const SLASH_MARK = '/';
const PARAMETER_MARK = ':';
const WILDCARD_MARK = '**';
const PROTOCOL_MARK = '://';
const SEARCH_MARK = '?';
const HASH_MARK = '#';
const ROOT_MARK = '_ROOT_';


/***/ }),

/***/ "../../../packages/web-router/src/context/context.tsx":
/*!************************************************************!*\
  !*** ../../../packages/web-router/src/context/context.tsx ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActiveRouteContext": () => (/* binding */ ActiveRouteContext),
/* harmony export */   "CurrentPathContext": () => (/* binding */ CurrentPathContext),
/* harmony export */   "RouterHistoryContext": () => (/* binding */ RouterHistoryContext),
/* harmony export */   "checkContextValue": () => (/* binding */ checkContextValue),
/* harmony export */   "useActiveRouteContext": () => (/* binding */ useActiveRouteContext),
/* harmony export */   "useCurrentPathContext": () => (/* binding */ useCurrentPathContext),
/* harmony export */   "useRouterHistoryContext": () => (/* binding */ useRouterHistoryContext)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/context/context.ts");

const ActiveRouteContext = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.createContext)(null, { displayName: 'ActiveRoute' });
function useActiveRouteContext() {
    const value = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.useContext)(ActiveRouteContext);
    return value;
}
const RouterHistoryContext = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.createContext)(null, { displayName: 'RouterHistory' });
function useRouterHistoryContext() {
    const value = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.useContext)(RouterHistoryContext);
    return value;
}
const CurrentPathContext = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.createContext)(null, { displayName: 'CurrentPath' });
function useCurrentPathContext() {
    const value = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.useContext)(CurrentPathContext);
    return value;
}
function checkContextValue(value) {
    if (!value) {
        throw new Error('[web-router]: illegal invoke hook outside router!');
    }
}



/***/ }),

/***/ "../../../packages/web-router/src/create-routes/create-routes.ts":
/*!***********************************************************************!*\
  !*** ../../../packages/web-router/src/create-routes/create-routes.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createPathname": () => (/* binding */ createPathname),
/* harmony export */   "createRoutes": () => (/* binding */ createRoutes),
/* harmony export */   "resolve": () => (/* binding */ resolve),
/* harmony export */   "resolveRoute": () => (/* binding */ resolveRoute)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/utils/utils.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "../../../packages/web-router/src/constants.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils */ "../../../packages/web-router/src/utils/utils.ts");
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../context */ "../../../packages/web-router/src/context/context.tsx");




class Route {
    path = '';
    pathMatch;
    parent = null;
    children = [];
    level = null;
    marker = '';
    redirectTo;
    component;
    constructor(options) {
        const { prefix, path, redirectTo, pathMatch = 'prefix', children = [], parent, component } = options;
        const rootPath = createRootPath(path);
        const $path = createPath(pathMatch, prefix, rootPath);
        this.path = $path;
        this.pathMatch = pathMatch;
        this.parent = parent;
        this.children = createRoutes(children, $path, this);
        this.level = parent ? parent.level + 1 : 0;
        this.marker = rootPath;
        this.redirectTo = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsString)(redirectTo)
            ? {
                path: createPath(pathMatch, prefix, createRootPath(redirectTo)),
                route: null,
            }
            : null;
        this.component = component || null;
    }
    getRoute() {
        return this;
    }
    getPath() {
        return this.path.replaceAll(_constants__WEBPACK_IMPORTED_MODULE_1__.ROOT_MARK + _constants__WEBPACK_IMPORTED_MODULE_1__.SLASH_MARK, '');
    }
    render() {
        let slot = null;
        let nextRoute = this.getRoute();
        while (nextRoute) {
            const value = nextRoute.getPath();
            const component = nextRoute.component;
            slot = _context__WEBPACK_IMPORTED_MODULE_2__.CurrentPathContext.Provider({ value, slot: [component({ slot })] });
            nextRoute = nextRoute.parent;
        }
        return slot;
    }
}
function createRoutes(routes, prefix = _constants__WEBPACK_IMPORTED_MODULE_1__.SLASH_MARK, parent = null) {
    const $routes = [];
    for (const route of routes) {
        const $route = new Route({ ...route, prefix, parent });
        $routes.push($route, ...$route.children);
    }
    if (!parent) {
        const map = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.keyBy)($routes, x => x.path, true);
        for (const $route of $routes) {
            if ($route.redirectTo) {
                $route.redirectTo.route = map[$route.redirectTo.path] || null;
            }
        }
    }
    return $routes;
}
function resolve(pathname, routes) {
    const route = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.pipe)(match(pathname, routes), redirect(), wildcard(pathname, routes), redirect(), root(), redirect(), canRender())();
    return route;
}
function match(pathname, routes) {
    return () => {
        const [route] = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.pipe)((routes) => routes.filter(x => detectIsMatchByFirstStrategy(pathname, x.path)), (routes) => routes.filter(x => detectIsMatchBySecondStrategy(pathname, x.path)))(routes);
        return pick(route);
    };
}
function redirect() {
    return (route) => {
        if (route?.redirectTo)
            return redirect()(route.redirectTo.route);
        if (route?.parent?.redirectTo)
            return redirect()(route.parent.redirectTo.route);
        return pick(route);
    };
}
function wildcard(pathname, routes) {
    return ($route) => {
        if ($route)
            return $route;
        const [route] = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.pipe)((routes) => routes.filter(x => x.marker === _constants__WEBPACK_IMPORTED_MODULE_1__.WILDCARD_MARK), (routes) => routes.filter(x => detectIsMatchAsWildcard(pathname, x.path)) || null, (routes) => (0,_utils__WEBPACK_IMPORTED_MODULE_3__.sort)('desc', routes, x => x.level))(routes);
        return pick(route);
    };
}
function root() {
    return (route) => {
        const root = route?.children.find(x => x.marker === _constants__WEBPACK_IMPORTED_MODULE_1__.ROOT_MARK) || route;
        return pick(root);
    };
}
function canRender() {
    return (route) => {
        if (route?.component)
            return route;
        if (true) {
            throw new Error('[web-router]: the route not found or it has no component!');
        }
        return null;
    };
}
const pick = (route) => route || null;
function detectIsMatchByFirstStrategy(urlPath, routePath) {
    const matcher = createMatcher({
        space: (_, b) => b,
        skip: ({ isRoot, isParam }) => isRoot || isParam,
    });
    return matcher(urlPath, routePath);
}
function detectIsMatchBySecondStrategy(urlPath, routePath) {
    const matcher = createMatcher({
        space: a => a,
        skip: ({ isParam }) => isParam,
    });
    return matcher(urlPath, routePath);
}
function detectIsMatchAsWildcard(urlPath, routePath) {
    const matcher = createMatcher({
        space: (_, b) => b,
        skip: ({ isRoot, isParam, isWildcard }) => isRoot || isParam || isWildcard,
    });
    return matcher(urlPath, routePath);
}
function createMatcher(options) {
    const { space, skip } = options;
    return (urlPath, routePath) => {
        const sUrlPath = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.splitPath)(urlPath);
        const sRoutePath = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.splitPath)(routePath);
        for (let i = 0; i < space(sUrlPath, sRoutePath).length; i++) {
            const segment = sRoutePath[i];
            const isRoot = segment === _constants__WEBPACK_IMPORTED_MODULE_1__.ROOT_MARK;
            const isWildcard = segment === _constants__WEBPACK_IMPORTED_MODULE_1__.WILDCARD_MARK;
            const isParam = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.detectIsParam)(segment);
            if (segment !== sUrlPath[i] && !skip({ isRoot, isWildcard, isParam }))
                return false;
        }
        return true;
    };
}
function createPathname(urlPath, routePath) {
    const sUrlPath = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.splitPath)(urlPath);
    const sRoutePath = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.splitPath)(routePath);
    const parts = [];
    for (let i = 0; i < sRoutePath.length; i++) {
        const isParam = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.detectIsParam)(sRoutePath[i]);
        if (isParam) {
            const param = sUrlPath[i] || 'null';
            parts.push(param);
        }
        else {
            parts.push(sRoutePath[i]);
        }
    }
    let newPathname = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.normalaizePathname)(parts.join(_constants__WEBPACK_IMPORTED_MODULE_1__.SLASH_MARK));
    if (newPathname[0] !== _constants__WEBPACK_IMPORTED_MODULE_1__.SLASH_MARK) {
        newPathname = _constants__WEBPACK_IMPORTED_MODULE_1__.SLASH_MARK + newPathname;
    }
    return newPathname;
}
function createPath(pathMatch, prefix, path) {
    const $prefix = pathMatch === 'prefix' ? (0,_utils__WEBPACK_IMPORTED_MODULE_3__.normalaizePathname)(prefix) : '';
    return (0,_utils__WEBPACK_IMPORTED_MODULE_3__.normalaizePathname)($prefix ? `${$prefix}${path}` : path);
}
function createRootPath(path) {
    return path === _constants__WEBPACK_IMPORTED_MODULE_1__.SLASH_MARK || path === '' ? _constants__WEBPACK_IMPORTED_MODULE_1__.ROOT_MARK : path;
}
const getParamsMap = (pathname, route) => {
    const sPathname = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.splitPath)(pathname);
    const sPath = (0,_utils__WEBPACK_IMPORTED_MODULE_3__.splitPath)(route.path);
    const map = new Map();
    for (let i = 0; i < sPath.length; i++) {
        if ((0,_utils__WEBPACK_IMPORTED_MODULE_3__.detectIsParam)(sPath[i])) {
            map.set((0,_utils__WEBPACK_IMPORTED_MODULE_3__.getParamName)(sPath[i]), sPathname[i]);
        }
    }
    return map;
};
function resolveRoute(pathname, routes) {
    const activeRoute = resolve(pathname, routes);
    const slot = activeRoute ? activeRoute.render() : null;
    const params = activeRoute ? getParamsMap(pathname, activeRoute) : null;
    const value = { activeRoute, slot, params };
    return value;
}



/***/ }),

/***/ "../../../packages/web-router/src/history/history.ts":
/*!***********************************************************!*\
  !*** ../../../packages/web-router/src/history/history.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RouterHistory": () => (/* binding */ RouterHistory),
/* harmony export */   "createRouterHistory": () => (/* binding */ createRouterHistory)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/utils/utils.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "../../../packages/web-router/src/utils/utils.ts");


const history = globalThis.history;
class RouterHistory {
    stack = [];
    cursor = -1;
    subscribers = new Set();
    fromHistory = false;
    dispose = null;
    constructor(url) {
        if ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsFalsy)(url)) {
            throw new Error('[web-router]: RouterHistory must have an initial url!');
        }
        const { pathname, search } = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.parseURL)(url);
        const spathname = pathname + search;
        this.stack.push(spathname);
        this.cursor = this.stack.length - 1;
        if (history) {
            const state = this.getState();
            if (!state) {
                history.replaceState(this.createStateBox(), '');
            }
            else {
                this.stack = state.stack;
                this.cursor = state.cursor;
            }
            const handleEvent = () => {
                const state = this.getState();
                if (state) {
                    this.stack = state.stack;
                    this.cursor = state.cursor;
                }
                if (!this.fromHistory) {
                    this.mapSubscribers();
                }
                this.fromHistory = false;
            };
            window.addEventListener('popstate', handleEvent);
            this.dispose = () => {
                window.removeEventListener('popstate', handleEvent);
                this.subscribers.clear();
                this.stack = [];
                this.cursor = -1;
            };
        }
    }
    mapSubscribers() {
        for (const subscriber of this.subscribers) {
            subscriber(this.getValue());
        }
    }
    getValue = () => {
        return (0,_utils__WEBPACK_IMPORTED_MODULE_1__.normalaizePathname)(this.stack[this.cursor]);
    };
    getState() {
        return (history.state && history.state[STATE_KEY]) || null;
    }
    createStateBox() {
        const state = history.state || {};
        return { ...state, [STATE_KEY]: { cursor: this.cursor, stack: this.stack } };
    }
    syncHistory(action, spathname) {
        if (!history)
            return;
        const stateBox = this.createStateBox();
        const $spathname = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.normalaizePathname)(spathname);
        switch (action) {
            case HistoryAction.PUSH:
                return history.pushState(stateBox, '', $spathname);
            case HistoryAction.REPLACE:
                return history.replaceState(stateBox, '', $spathname);
        }
    }
    subscribe = (subscriber) => {
        this.subscribers.add(subscriber);
        return () => this.subscribers.delete(subscriber);
    };
    push(spathname) {
        this.stack.splice(this.cursor + 1, this.stack.length, spathname);
        this.cursor = this.stack.length - 1;
        this.syncHistory(HistoryAction.PUSH, spathname);
        this.mapSubscribers();
    }
    replace(spathname) {
        this.stack[this.stack.length - 1] = spathname;
        this.syncHistory(HistoryAction.REPLACE, spathname);
        this.mapSubscribers();
    }
    forward() {
        this.go(1);
    }
    back() {
        this.go(-1);
    }
    go(delta) {
        const max = this.stack.length - 1;
        let $delta = delta;
        this.fromHistory = true;
        this.cursor += delta;
        if (this.cursor > max) {
            this.cursor = max;
            $delta = max;
        }
        else if (this.cursor < 0) {
            this.cursor = 0;
            $delta = -max;
        }
        history?.go($delta);
        this.mapSubscribers();
    }
}
var HistoryAction;
(function (HistoryAction) {
    HistoryAction["PUSH"] = "PUSH";
    HistoryAction["REPLACE"] = "REPLACE";
})(HistoryAction || (HistoryAction = {}));
const STATE_KEY = 'web-router';
const createRouterHistory = (url) => new RouterHistory(url);



/***/ }),

/***/ "../../../packages/web-router/src/location/location.ts":
/*!*************************************************************!*\
  !*** ../../../packages/web-router/src/location/location.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RouterLocation": () => (/* binding */ RouterLocation),
/* harmony export */   "createRouterLocation": () => (/* binding */ createRouterLocation)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/utils/utils.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "../../../packages/web-router/src/utils/utils.ts");


class RouterLocation {
    url;
    protocol;
    host;
    pathname;
    hash;
    search;
    key;
    constructor(url) {
        if ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.detectIsFalsy)(url)) {
            throw new Error('[web-router]: RouterLocation must have an initial url!');
        }
        const { protocol, host, pathname, hash, search } = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.parseURL)(url);
        this.url = url;
        this.protocol = protocol;
        this.host = host;
        this.pathname = pathname;
        this.hash = hash;
        this.search = search;
        this.key = createKey(pathname);
        Object.freeze(this);
    }
}
function createKey(pathname) {
    return pathname
        .split('')
        .map(x => x.charCodeAt(0))
        .reduce((acc, x) => ((acc += x), acc), 200000)
        .toString(32);
}
const createRouterLocation = (url) => new RouterLocation(url);



/***/ }),

/***/ "../../../packages/web-router/src/router-link/router-link.tsx":
/*!********************************************************************!*\
  !*** ../../../packages/web-router/src/router-link/router-link.tsx ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RouterLink": () => (/* binding */ RouterLink)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/component/component.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/use-memo/use-memo.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/use-event/use-event.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/utils/utils.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/element/element.ts");
/* harmony import */ var _use_history__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../use-history */ "../../../packages/web-router/src/use-history/use-history.ts");
/* harmony import */ var _use_location__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../use-location */ "../../../packages/web-router/src/use-location/use-location.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils */ "../../../packages/web-router/src/utils/utils.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../constants */ "../../../packages/web-router/src/constants.ts");





const RouterLink = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.component)(({ to, activeClassName = 'router-link-active', className: sourceClassName, slot, onClick, ...rest }) => {
    const history = (0,_use_history__WEBPACK_IMPORTED_MODULE_1__.useHistory)();
    const { pathname, hash } = (0,_use_location__WEBPACK_IMPORTED_MODULE_2__.useLocation)();
    const isActive = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => detectIsActiveLink(pathname, hash, to), [pathname, hash, to]);
    const className = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => (0,_utils__WEBPACK_IMPORTED_MODULE_4__.cm)(sourceClassName, isActive ? activeClassName : ''), [sourceClassName, activeClassName, isActive]);
    const handleClick = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_5__.useEvent)((e) => {
        e.preventDefault();
        history.push(to);
        (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_6__.detectIsFunction)(onClick) && onClick(e);
    });
    return ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_7__.h)("a", { ...rest, href: to, class: className, onClick: handleClick }, slot));
}, {
    displayName: 'RouterLink',
});
function detectIsActiveLink(pathname, hash, to) {
    const { pathname: $to, hash: $hash } = (0,_utils__WEBPACK_IMPORTED_MODULE_4__.parseURL)(to);
    const $pathname = (0,_utils__WEBPACK_IMPORTED_MODULE_4__.normalaizePathname)(pathname);
    if ($to === _constants__WEBPACK_IMPORTED_MODULE_8__.SLASH_MARK)
        return $pathname === _constants__WEBPACK_IMPORTED_MODULE_8__.SLASH_MARK;
    return $pathname.indexOf($to) !== -1 && hash === $hash;
}



/***/ }),

/***/ "../../../packages/web-router/src/router/router.tsx":
/*!**********************************************************!*\
  !*** ../../../packages/web-router/src/router/router.tsx ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Router": () => (/* binding */ Router)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/ref/ref.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/component/component.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/use-state/use-state.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/use-memo/use-memo.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/use-layout-effect/use-layout-effect.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/use-effect/use-effect.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/use-imperative-handle/use-imperative-handle.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/utils/utils.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/element/element.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants */ "../../../packages/web-router/src/constants.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../utils */ "../../../packages/web-router/src/utils/utils.ts");
/* harmony import */ var _history__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../history */ "../../../packages/web-router/src/history/history.ts");
/* harmony import */ var _location__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../location */ "../../../packages/web-router/src/location/location.ts");
/* harmony import */ var _create_routes__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../create-routes */ "../../../packages/web-router/src/create-routes/create-routes.ts");
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../context */ "../../../packages/web-router/src/context/context.tsx");







const Router = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_0__.forwardRef)((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_1__.component)(({ url, baseURL = _constants__WEBPACK_IMPORTED_MODULE_2__.SLASH_MARK, routes: sourceRoutes, slot }, ref) => {
    if ((0,_context__WEBPACK_IMPORTED_MODULE_3__.useActiveRouteContext)()) {
        throw new Error(`[web-router]: the parent active route's context detected!`);
    }
    const sourceURL = url || window.location.href;
    const [location, setLocation] = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_4__.useState)(() => (0,_location__WEBPACK_IMPORTED_MODULE_5__.createRouterLocation)(sourceURL));
    const history = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_6__.useMemo)(() => (0,_history__WEBPACK_IMPORTED_MODULE_7__.createRouterHistory)(sourceURL), []);
    const routes = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_6__.useMemo)(() => (0,_create_routes__WEBPACK_IMPORTED_MODULE_8__.createRoutes)(sourceRoutes, (0,_utils__WEBPACK_IMPORTED_MODULE_9__.normalaizePathname)(baseURL)), []);
    const { protocol, host, pathname, search, hash } = location;
    const { activeRoute, slot: $slot, params } = (0,_create_routes__WEBPACK_IMPORTED_MODULE_8__.resolveRoute)(pathname, routes);
    const scope = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_6__.useMemo)(() => ({ location }), []);
    const historyContext = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_6__.useMemo)(() => ({ history }), []);
    const routerContext = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_6__.useMemo)(() => ({ location, activeRoute, params }), [pathname, search, hash]);
    scope.location = location;
    (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_10__.useLayoutEffect)(() => {
        if (sourceURL !== scope.location.url) {
            setLocation((0,_location__WEBPACK_IMPORTED_MODULE_5__.createRouterLocation)(sourceURL));
        }
    }, [sourceURL]);
    (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_10__.useLayoutEffect)(() => {
        const unsubscribe = history.subscribe(spathname => {
            const url = `${protocol}${_constants__WEBPACK_IMPORTED_MODULE_2__.PROTOCOL_MARK}${host}${spathname}`;
            setLocation((0,_location__WEBPACK_IMPORTED_MODULE_5__.createRouterLocation)(url));
        });
        return () => {
            unsubscribe();
            history.dispose();
        };
    }, []);
    (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_11__.useEffect)(() => {
        if (!activeRoute || activeRoute.marker === _constants__WEBPACK_IMPORTED_MODULE_2__.WILDCARD_MARK)
            return;
        const spathname = pathname + search + hash;
        const newSpathname = (0,_create_routes__WEBPACK_IMPORTED_MODULE_8__.createPathname)(pathname, activeRoute.getPath()) + search + hash;
        if (spathname !== newSpathname) {
            history.replace(newSpathname);
        }
    }, [pathname, search, hash]);
    (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_12__.useImperativeHandle)(ref, () => ({
        navigateTo: (pathname) => (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_13__.nextTick)(() => history.push(pathname)),
        location,
    }));
    return ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_14__.h)(_context__WEBPACK_IMPORTED_MODULE_3__.RouterHistoryContext.Provider, { value: historyContext },
        (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_14__.h)(_context__WEBPACK_IMPORTED_MODULE_3__.ActiveRouteContext.Provider, { value: routerContext }, slot($slot))));
}, { displayName: 'Router' }));



/***/ }),

/***/ "../../../packages/web-router/src/use-history/use-history.ts":
/*!*******************************************************************!*\
  !*** ../../../packages/web-router/src/use-history/use-history.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useHistory": () => (/* binding */ useHistory)
/* harmony export */ });
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../context */ "../../../packages/web-router/src/context/context.tsx");

function useHistory() {
    const value = (0,_context__WEBPACK_IMPORTED_MODULE_0__.useRouterHistoryContext)();
    (0,_context__WEBPACK_IMPORTED_MODULE_0__.checkContextValue)(value);
    return value.history;
}



/***/ }),

/***/ "../../../packages/web-router/src/use-location/use-location.ts":
/*!*********************************************************************!*\
  !*** ../../../packages/web-router/src/use-location/use-location.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useLocation": () => (/* binding */ useLocation)
/* harmony export */ });
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../context */ "../../../packages/web-router/src/context/context.tsx");

function useLocation() {
    const activeRoute = (0,_context__WEBPACK_IMPORTED_MODULE_0__.useActiveRouteContext)();
    (0,_context__WEBPACK_IMPORTED_MODULE_0__.checkContextValue)(activeRoute);
    return activeRoute.location;
}



/***/ }),

/***/ "../../../packages/web-router/src/utils/utils.ts":
/*!*******************************************************!*\
  !*** ../../../packages/web-router/src/utils/utils.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "cm": () => (/* binding */ cm),
/* harmony export */   "detectIsParam": () => (/* binding */ detectIsParam),
/* harmony export */   "getParamName": () => (/* binding */ getParamName),
/* harmony export */   "normalaizePathname": () => (/* binding */ normalaizePathname),
/* harmony export */   "parseURL": () => (/* binding */ parseURL),
/* harmony export */   "pipe": () => (/* binding */ pipe),
/* harmony export */   "sort": () => (/* binding */ sort),
/* harmony export */   "splitPath": () => (/* binding */ splitPath)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "../../../packages/web-router/src/constants.ts");

function pipe(...fns) {
    const [fn, ...rest] = fns;
    return (...args) => {
        return rest.reduce((fn1, fn2) => () => fn2(fn1()), () => fn(...args))();
    };
}
function parseURL(url) {
    let body = url;
    let protocol = '';
    let host = '';
    let pathname = '';
    let hash = '';
    let search = '';
    if (body.indexOf(_constants__WEBPACK_IMPORTED_MODULE_0__.PROTOCOL_MARK) !== -1) {
        [protocol, body] = body.split(_constants__WEBPACK_IMPORTED_MODULE_0__.PROTOCOL_MARK).filter((x, _, arr) => (arr.length > 2 ? Boolean(x) : true));
    }
    const splitted = body.split('');
    const idx = splitted.findIndex(x => x === _constants__WEBPACK_IMPORTED_MODULE_0__.SLASH_MARK);
    if (idx !== -1) {
        host = splitted.filter((_, idx1) => idx1 < idx).join('');
        pathname = splitted.filter((_, idx1) => idx1 >= idx).join('');
    }
    else {
        host = body;
        pathname = pathname || _constants__WEBPACK_IMPORTED_MODULE_0__.SLASH_MARK;
    }
    if (pathname.indexOf(_constants__WEBPACK_IMPORTED_MODULE_0__.SEARCH_MARK) !== -1) {
        [pathname, search] = split(pathname, _constants__WEBPACK_IMPORTED_MODULE_0__.SEARCH_MARK);
    }
    if (body.indexOf(_constants__WEBPACK_IMPORTED_MODULE_0__.HASH_MARK) !== -1) {
        if (search) {
            [search, hash] = split(search, _constants__WEBPACK_IMPORTED_MODULE_0__.HASH_MARK);
        }
        else {
            [pathname, hash] = split(pathname, _constants__WEBPACK_IMPORTED_MODULE_0__.HASH_MARK);
        }
    }
    return {
        protocol,
        host,
        pathname: addSlashToEnd(pathname),
        search: createSearch(search),
        hash: createHash(hash),
    };
}
const createSearch = (value) => (value ? `${_constants__WEBPACK_IMPORTED_MODULE_0__.SEARCH_MARK}${value}` : '');
const createHash = (value) => (value ? `${_constants__WEBPACK_IMPORTED_MODULE_0__.HASH_MARK}${value}` : '');
const detectIsParam = (value) => value && value.startsWith(_constants__WEBPACK_IMPORTED_MODULE_0__.PARAMETER_MARK);
const getParamName = (value) => (detectIsParam(value) ? value.slice(1, value.length) : null);
const split = (value, token) => value.split(token).filter(Boolean);
const splitPath = (path) => split(path, _constants__WEBPACK_IMPORTED_MODULE_0__.SLASH_MARK);
const addSlashToStart = (path) => (path.startsWith(_constants__WEBPACK_IMPORTED_MODULE_0__.SLASH_MARK) ? path : _constants__WEBPACK_IMPORTED_MODULE_0__.SLASH_MARK + path);
const addSlashToEnd = (path) => (path.endsWith(_constants__WEBPACK_IMPORTED_MODULE_0__.SLASH_MARK) ? path : path + _constants__WEBPACK_IMPORTED_MODULE_0__.SLASH_MARK);
function normalaizePathname(spath) {
    const { pathname, search, hash } = parseURL(addSlashToStart(spath));
    const newSpath = pathname + search + hash;
    return newSpath;
}
function sort(type, list, selector) {
    const asc = (a, b) => selector(a) - selector(b);
    const desc = (a, b) => selector(b) - selector(a);
    const compare = type === 'asc' ? asc : desc;
    return list.sort(compare);
}
const cm = (...args) => [...args].filter(Boolean).join(' ').trim() || undefined;



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
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
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
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".build.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		// data-webpack is not used as build has no uniqueName
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			};
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
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
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						} else installedChunks[chunkId] = 0;
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*******************!*\
  !*** ./index.tsx ***!
  \*******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _bootstrap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bootstrap */ "./bootstrap.tsx");

(0,_bootstrap__WEBPACK_IMPORTED_MODULE_0__.bootstrap)();

})();

/******/ })()
;
//# sourceMappingURL=build.js.map