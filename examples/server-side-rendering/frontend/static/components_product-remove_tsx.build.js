"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["components_product-remove_tsx"],{

/***/ "./components/product-remove.tsx":
/*!***************************************!*\
  !*** ./components/product-remove.tsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/component/component.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/element/element.ts");
/* harmony import */ var _dark_engine_web_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @dark-engine/web-router */ "../../../packages/web-router/src/use-match/use-match.ts");
/* harmony import */ var _dark_engine_web_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @dark-engine/web-router */ "../../../packages/web-router/src/use-history/use-history.ts");
/* harmony import */ var _dark_engine_web_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @dark-engine/web-router */ "../../../packages/web-router/src/use-params/use-params.ts");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../hooks */ "./hooks/index.ts");
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui */ "./components/ui.tsx");




const ProductRemove = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.component)(() => {
    const { url } = (0,_dark_engine_web_router__WEBPACK_IMPORTED_MODULE_3__.useMatch)();
    const history = (0,_dark_engine_web_router__WEBPACK_IMPORTED_MODULE_4__.useHistory)();
    const params = (0,_dark_engine_web_router__WEBPACK_IMPORTED_MODULE_5__.useParams)();
    const id = Number(params.get('id'));
    const [removeProduct, { loading }] = (0,_hooks__WEBPACK_IMPORTED_MODULE_0__.useRemoveProductMutation)(id);
    const urlToList = url.replace(`${id}/remove/`, '');
    const handleRemove = async () => {
        if (loading)
            return;
        await removeProduct();
        history.push(urlToList);
    };
    return ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_6__.h)(_ui__WEBPACK_IMPORTED_MODULE_1__.Card, { "$loading": loading },
        (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_6__.h)("h3", null,
            "Do you want to remove product #",
            id,
            "? \uD83E\uDD14"),
        (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_6__.h)(_ui__WEBPACK_IMPORTED_MODULE_1__.Button, { onClick: handleRemove }, "Yes"),
        (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_6__.h)(_ui__WEBPACK_IMPORTED_MODULE_1__.Button, { onClick: () => history.back() }, "No")));
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProductRemove);


/***/ })

}]);
//# sourceMappingURL=components_product-remove_tsx.build.js.map