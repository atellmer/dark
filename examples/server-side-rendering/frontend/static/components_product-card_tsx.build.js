"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["components_product-card_tsx"],{

/***/ "./components/product-card.tsx":
/*!*************************************!*\
  !*** ./components/product-card.tsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/component/component.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/element/element.ts");
/* harmony import */ var _dark_engine_web_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @dark-engine/web-router */ "../../../packages/web-router/src/use-params/use-params.ts");
/* harmony import */ var _dark_engine_web_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @dark-engine/web-router */ "../../../packages/web-router/src/use-match/use-match.ts");
/* harmony import */ var _dark_engine_web_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @dark-engine/web-router */ "../../../packages/web-router/src/router-link/router-link.tsx");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../hooks */ "./hooks/index.ts");
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui */ "./components/ui.tsx");




const ProductCard = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.component)(({ slot }) => {
    const params = (0,_dark_engine_web_router__WEBPACK_IMPORTED_MODULE_3__.useParams)();
    const id = Number(params.get('id'));
    const { data, loading, error } = (0,_hooks__WEBPACK_IMPORTED_MODULE_0__.useProduct)(id);
    const { url } = (0,_dark_engine_web_router__WEBPACK_IMPORTED_MODULE_4__.useMatch)();
    const urlToEdit = url + 'edit/';
    const urlToRemove = url + 'remove/';
    if (loading)
        return (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_5__.h)(_ui__WEBPACK_IMPORTED_MODULE_1__.Spinner, null);
    if (error)
        return (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_5__.h)(_ui__WEBPACK_IMPORTED_MODULE_1__.Error, { value: error });
    if (!data) {
        return ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_5__.h)(_ui__WEBPACK_IMPORTED_MODULE_1__.Card, null,
            (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_5__.h)("h3", null,
                "It seems there is no product with #",
                id,
                " \uD83E\uDD2B")));
    }
    if (slot)
        return slot;
    return ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_5__.h)(_ui__WEBPACK_IMPORTED_MODULE_1__.Card, null,
        (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_5__.h)("h3", null, data.name),
        (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_5__.h)("p", null, data.description),
        (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_5__.h)(_ui__WEBPACK_IMPORTED_MODULE_1__.Button, { as: _dark_engine_web_router__WEBPACK_IMPORTED_MODULE_6__.RouterLink, to: urlToEdit }, "Edit"),
        (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_5__.h)(_ui__WEBPACK_IMPORTED_MODULE_1__.Button, { as: _dark_engine_web_router__WEBPACK_IMPORTED_MODULE_6__.RouterLink, to: urlToRemove }, "Remove")));
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProductCard);


/***/ })

}]);
//# sourceMappingURL=components_product-card_tsx.build.js.map