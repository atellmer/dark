"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["components_product-edit_tsx"],{

/***/ "./components/product-edit.tsx":
/*!*************************************!*\
  !*** ./components/product-edit.tsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/component/component.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/element/element.ts");
/* harmony import */ var _dark_engine_web_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @dark-engine/web-router */ "../../../packages/web-router/src/use-params/use-params.ts");
/* harmony import */ var _dark_engine_web_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @dark-engine/web-router */ "../../../packages/web-router/src/use-match/use-match.ts");
/* harmony import */ var _dark_engine_web_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @dark-engine/web-router */ "../../../packages/web-router/src/use-history/use-history.ts");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../hooks */ "./hooks/index.ts");
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui */ "./components/ui.tsx");




const ProductEdit = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.component)(() => {
    const params = (0,_dark_engine_web_router__WEBPACK_IMPORTED_MODULE_3__.useParams)();
    const { url } = (0,_dark_engine_web_router__WEBPACK_IMPORTED_MODULE_4__.useMatch)();
    const history = (0,_dark_engine_web_router__WEBPACK_IMPORTED_MODULE_5__.useHistory)();
    const id = Number(params.get('id'));
    const { data: product } = (0,_hooks__WEBPACK_IMPORTED_MODULE_0__.useProduct)(id);
    const [changeProduct, { loading }] = (0,_hooks__WEBPACK_IMPORTED_MODULE_0__.useChangeProductMutation)();
    const urlToList = url.replace(`${id}/edit/`, '');
    const handleSubmit = async (e) => {
        e.preventDefault();
        const name = e.target.elements['name'].value;
        const description = e.target.elements['desc'].value;
        if (loading)
            return;
        await changeProduct({ ...product, name, description });
        history.push(urlToList);
    };
    return ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_6__.h)(_ui__WEBPACK_IMPORTED_MODULE_1__.Card, { "$loading": loading },
        (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_6__.h)("h3", null, "Edit product"),
        (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_6__.h)(_ui__WEBPACK_IMPORTED_MODULE_1__.Form, { onSubmit: handleSubmit },
            (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_6__.h)("label", { for: 'name' }, "Name:"),
            (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_6__.h)(_ui__WEBPACK_IMPORTED_MODULE_1__.Input, { id: 'name', required: true, value: product.name }),
            (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_6__.h)("label", { for: 'desc' }, "Description:"),
            (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_6__.h)(_ui__WEBPACK_IMPORTED_MODULE_1__.Textarea, { id: 'desc', required: true, rows: 5, value: product.description }),
            (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_6__.h)(_ui__WEBPACK_IMPORTED_MODULE_1__.Button, { type: 'submit' }, "Edit"))));
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProductEdit);


/***/ })

}]);
//# sourceMappingURL=components_product-edit_tsx.build.js.map