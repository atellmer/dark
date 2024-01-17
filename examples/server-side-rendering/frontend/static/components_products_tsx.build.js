"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["components_products_tsx"],{

/***/ "./components/products.tsx":
/*!*********************************!*\
  !*** ./components/products.tsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/component/component.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/element/element.ts");
/* harmony import */ var _dark_engine_web_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @dark-engine/web-router */ "../../../packages/web-router/src/use-match/use-match.ts");
/* harmony import */ var _dark_engine_web_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @dark-engine/web-router */ "../../../packages/web-router/src/router-link/router-link.tsx");
/* harmony import */ var _dark_engine_styled__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @dark-engine/styled */ "../../../packages/styled/src/styled/styled.ts");
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui */ "./components/ui.tsx");




const Root = _dark_engine_styled__WEBPACK_IMPORTED_MODULE_1__.styled.div `
  position: sticky;
  top: 0;
  background-color: #fff8e1;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  margin: 0 -16px;

  & h1 {
    margin: 0;
  }
`;
const Products = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.component)(({ slot }) => {
    const { url } = (0,_dark_engine_web_router__WEBPACK_IMPORTED_MODULE_3__.useMatch)();
    return ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_4__.h)(_ui__WEBPACK_IMPORTED_MODULE_0__.AnimationFade, null,
        (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_4__.h)(Root, null,
            (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_4__.h)("h1", null, "Products \uD83E\uDD13"),
            (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_4__.h)(_ui__WEBPACK_IMPORTED_MODULE_0__.Header, { "$nested": true },
                (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_4__.h)(_dark_engine_web_router__WEBPACK_IMPORTED_MODULE_5__.RouterLink, { to: `${url}list` }, "List"),
                (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_4__.h)(_dark_engine_web_router__WEBPACK_IMPORTED_MODULE_5__.RouterLink, { to: `${url}analytics` }, "Analytics"),
                (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_4__.h)(_dark_engine_web_router__WEBPACK_IMPORTED_MODULE_5__.RouterLink, { to: `${url}balance` }, "Balance"))),
        slot));
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Products);


/***/ }),

/***/ "../../../packages/web-router/src/use-match/use-match.ts":
/*!***************************************************************!*\
  !*** ../../../packages/web-router/src/use-match/use-match.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useMatch": () => (/* binding */ useMatch)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/use-memo/use-memo.ts");
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../context */ "../../../packages/web-router/src/context/context.tsx");
/* harmony import */ var _create_routes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../create-routes */ "../../../packages/web-router/src/create-routes/create-routes.ts");



function useMatch() {
    const activeRoute = (0,_context__WEBPACK_IMPORTED_MODULE_0__.useActiveRouteContext)();
    (0,_context__WEBPACK_IMPORTED_MODULE_0__.checkContextValue)(activeRoute);
    const path = (0,_context__WEBPACK_IMPORTED_MODULE_0__.useCurrentPathContext)();
    const { location: { pathname }, } = activeRoute;
    const url = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => (path ? (0,_create_routes__WEBPACK_IMPORTED_MODULE_2__.createPathname)(pathname, path) : ''), [path, pathname]);
    const value = { path, url };
    return value;
}



/***/ })

}]);
//# sourceMappingURL=components_products_tsx.build.js.map