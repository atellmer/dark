"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["components_product-add_tsx"],{

/***/ "./components/product-add.tsx":
/*!************************************!*\
  !*** ./components/product-add.tsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/component/component.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/element/element.ts");
/* harmony import */ var _dark_engine_web_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @dark-engine/web-router */ "../../../packages/web-router/src/use-match/use-match.ts");
/* harmony import */ var _dark_engine_web_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @dark-engine/web-router */ "../../../packages/web-router/src/use-history/use-history.ts");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../hooks */ "./hooks/index.ts");
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui */ "./components/ui.tsx");




const ProductAdd = (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.component)(() => {
    const { url } = (0,_dark_engine_web_router__WEBPACK_IMPORTED_MODULE_3__.useMatch)();
    const history = (0,_dark_engine_web_router__WEBPACK_IMPORTED_MODULE_4__.useHistory)();
    const [addProduct, { loading }] = (0,_hooks__WEBPACK_IMPORTED_MODULE_0__.useAddProductMutation)();
    const urlToList = url.replace('add/', '');
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading)
            return;
        const { elements } = e.target;
        const name = elements['name'].value;
        const description = elements['desc'].value;
        await addProduct({ name, description });
        history.push(urlToList);
    };
    return ((0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_5__.h)(_ui__WEBPACK_IMPORTED_MODULE_1__.Card, { "$loading": loading },
        (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_5__.h)("h3", null, "Add product"),
        (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_5__.h)(_ui__WEBPACK_IMPORTED_MODULE_1__.Form, { onSubmit: handleSubmit },
            (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_5__.h)("label", { for: 'name' }, "Name:"),
            (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_5__.h)(_ui__WEBPACK_IMPORTED_MODULE_1__.Input, { id: 'name', required: true }),
            (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_5__.h)("label", { for: 'desc' }, "Description:"),
            (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_5__.h)(_ui__WEBPACK_IMPORTED_MODULE_1__.Textarea, { id: 'desc', required: true, rows: 3 }),
            (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_5__.h)(_ui__WEBPACK_IMPORTED_MODULE_1__.Button, { type: 'submit' }, "Add"))));
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProductAdd);


/***/ }),

/***/ "./hooks/index.ts":
/*!************************!*\
  !*** ./hooks/index.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Key": () => (/* binding */ Key),
/* harmony export */   "useAddProductMutation": () => (/* binding */ useAddProductMutation),
/* harmony export */   "useChangeProductMutation": () => (/* binding */ useChangeProductMutation),
/* harmony export */   "useProduct": () => (/* binding */ useProduct),
/* harmony export */   "useProducts": () => (/* binding */ useProducts),
/* harmony export */   "useRemoveProductMutation": () => (/* binding */ useRemoveProductMutation)
/* harmony export */ });
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/use-query/use-query.ts");
/* harmony import */ var _dark_engine_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @dark-engine/core */ "../../../packages/core/src/use-mutation/use-mutation.ts");
/* harmony import */ var _contract__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../contract */ "../contract/index.ts");


var Key;
(function (Key) {
    Key["FETCH_PRODUCTS"] = "FETCH_PRODUCTS";
    Key["FETCH_PRODUCT"] = "FETCH_PRODUCT";
    Key["ADD_PRODUCT"] = "ADD_PRODUCT";
    Key["CHANGE_PRODUCT"] = "CHANGE_PRODUCT";
    Key["REMOVE_PRODUCT"] = "REMOVE_PRODUCT";
})(Key || (Key = {}));
function useProducts() {
    const api = (0,_contract__WEBPACK_IMPORTED_MODULE_0__.useApi)();
    return (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_1__.useQuery)(() => api.fetchProducts(), { key: Key.FETCH_PRODUCTS });
}
function useProduct(id) {
    const api = (0,_contract__WEBPACK_IMPORTED_MODULE_0__.useApi)();
    return (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_1__.useQuery)(({ id }) => api.fetchProduct(id), {
        key: Key.FETCH_PRODUCT,
        variables: { id },
        extractId: x => x.id,
    });
}
function useAddProductMutation() {
    const api = (0,_contract__WEBPACK_IMPORTED_MODULE_0__.useApi)();
    return (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.useMutation)(api.addProduct, {
        key: Key.ADD_PRODUCT,
        onSuccess: (cache, product) => {
            const record = cache.read({ key: Key.FETCH_PRODUCTS });
            if (record) {
                const products = record.data;
                products.push(product);
                cache.optimistic({ key: Key.FETCH_PRODUCTS, data: products });
            }
        },
    });
}
function useChangeProductMutation() {
    const api = (0,_contract__WEBPACK_IMPORTED_MODULE_0__.useApi)();
    return (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.useMutation)(api.changeProduct, {
        key: Key.CHANGE_PRODUCT,
        onSuccess: (cache, product) => {
            const record = cache.read({ key: Key.FETCH_PRODUCTS });
            if (record) {
                const products = record.data;
                const $product = products.find(x => x.id === product.id);
                $product.name = product.name;
                cache.optimistic({ key: Key.FETCH_PRODUCTS, data: products });
                cache.optimistic({ key: Key.FETCH_PRODUCT, data: product, id: product.id });
            }
        },
    });
}
function useRemoveProductMutation(id) {
    const api = (0,_contract__WEBPACK_IMPORTED_MODULE_0__.useApi)();
    return (0,_dark_engine_core__WEBPACK_IMPORTED_MODULE_2__.useMutation)(() => api.removeProduct(id), {
        key: Key.REMOVE_PRODUCT,
        onSuccess: cache => {
            const record = cache.read({ key: Key.FETCH_PRODUCTS });
            if (record) {
                const products = record.data;
                const idx = products.findIndex(x => x.id === id);
                if (idx !== -1) {
                    products.splice(idx, 1);
                    cache.optimistic({ key: Key.FETCH_PRODUCTS, data: products });
                }
            }
            cache.delete({ key: Key.FETCH_PRODUCT, id });
        },
    });
}



/***/ }),

/***/ "../../../packages/core/src/use-mutation/use-mutation.ts":
/*!***************************************************************!*\
  !*** ../../../packages/core/src/use-mutation/use-mutation.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useMutation": () => (/* binding */ useMutation)
/* harmony export */ });
/* harmony import */ var _cache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../cache */ "../../../packages/core/src/cache/cache.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils */ "../../../packages/core/src/utils/utils.ts");
/* harmony import */ var _use_update__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../use-update */ "../../../packages/core/src/use-update/use-update.ts");
/* harmony import */ var _use_memo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../use-memo */ "../../../packages/core/src/use-memo/use-memo.ts");




function useMutation(mutation, options) {
    const { key, refetchQueries = [], onSuccess } = options || {};
    const update = (0,_use_update__WEBPACK_IMPORTED_MODULE_0__.useUpdate)();
    const cache = (0,_cache__WEBPACK_IMPORTED_MODULE_1__.useCache)();
    (0,_cache__WEBPACK_IMPORTED_MODULE_1__.checkCache)(cache);
    const state = (0,_use_memo__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => ({ isFetching: false, data: null, error: null }), []);
    const make = async (...args) => {
        let data = null;
        cache.__emit({ type: _cache__WEBPACK_IMPORTED_MODULE_1__.MonitorEventType.MUTATION, phase: 'start', key, data: args });
        try {
            state.isFetching = true;
            state.error = null;
            update();
            data = (await mutation(...args));
            cache.__emit({ type: _cache__WEBPACK_IMPORTED_MODULE_1__.MonitorEventType.MUTATION, phase: 'finish', key, data });
            (0,_utils__WEBPACK_IMPORTED_MODULE_3__.detectIsFunction)(onSuccess) && onSuccess(cache, data);
            refetchQueries.forEach(x => cache.invalidate({ key: x }));
        }
        catch (err) {
            (0,_utils__WEBPACK_IMPORTED_MODULE_3__.error)(err);
            state.error = String(err);
            cache.__emit({ type: _cache__WEBPACK_IMPORTED_MODULE_1__.MonitorEventType.MUTATION, phase: 'error', key, data: err });
        }
        finally {
            state.isFetching = false;
            update();
        }
        return data;
    };
    const result = {
        loading: state.isFetching,
        data: state.data,
        error: state.error,
    };
    return [make, result];
}



/***/ }),

/***/ "../../../packages/core/src/use-query/use-query.ts":
/*!*********************************************************!*\
  !*** ../../../packages/core/src/use-query/use-query.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useQuery": () => (/* binding */ useQuery)
/* harmony export */ });
/* harmony import */ var _cache__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../cache */ "../../../packages/core/src/cache/cache.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils */ "../../../packages/core/src/utils/utils.ts");
/* harmony import */ var _use_layout_effect__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../use-layout-effect */ "../../../packages/core/src/use-layout-effect/use-layout-effect.ts");
/* harmony import */ var _platform__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../platform */ "../../../packages/core/src/platform/platform.ts");
/* harmony import */ var _use_effect__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../use-effect */ "../../../packages/core/src/use-effect/use-effect.ts");
/* harmony import */ var _suspense__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../suspense */ "../../../packages/core/src/suspense/suspense.ts");
/* harmony import */ var _use_update__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../use-update */ "../../../packages/core/src/use-update/use-update.ts");
/* harmony import */ var _use_memo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../use-memo */ "../../../packages/core/src/use-memo/use-memo.ts");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../scope */ "../../../packages/core/src/scope/scope.ts");









function useQuery(query, options) {
    const { variables = {}, key: cacheKey, extractId = () => _cache__WEBPACK_IMPORTED_MODULE_0__.CACHE_ROOT_ID, lazy = false, } = options || { variables: {} };
    const $scope = (0,_scope__WEBPACK_IMPORTED_MODULE_1__.$$scope)();
    const cache = (0,_cache__WEBPACK_IMPORTED_MODULE_0__.useCache)();
    (0,_cache__WEBPACK_IMPORTED_MODULE_0__.checkCache)(cache);
    const cacheId = extractId(variables);
    const id = (0,_use_memo__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => $scope.getNextResourceId(), []);
    const state = (0,_use_memo__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => createState(cache, cacheKey, cacheId, lazy), []);
    const { register, unregister } = (0,_suspense__WEBPACK_IMPORTED_MODULE_3__.useSuspense)();
    const [mounted, firstTime] = useMounted();
    const update = (0,_use_update__WEBPACK_IMPORTED_MODULE_4__.useUpdate)();
    const $update = () => mounted() && update();
    const isServer = (0,_platform__WEBPACK_IMPORTED_MODULE_5__.detectIsServer)();
    const isHydrateZone = $scope.getIsHydrateZone();
    const { isLoaded } = state;
    state.cacheKey = cacheKey;
    state.cacheId = cacheId;
    const make = async ($variables) => {
        const $$variables = $variables || variables;
        const $cacheId = extractId($$variables);
        cache.__emit({ type: _cache__WEBPACK_IMPORTED_MODULE_0__.MonitorEventType.QUERY, phase: 'start', key: cacheKey, data: $$variables });
        try {
            if (!isServer && !firstTime()) {
                state.isFetching = true;
                $update();
            }
            const data = await query($$variables);
            cache.__emit({ type: _cache__WEBPACK_IMPORTED_MODULE_0__.MonitorEventType.QUERY, phase: 'finish', key: cacheKey, data });
            if (isServer) {
                $scope.setResource(id, [data, null]);
            }
            else {
                unregister(id);
                state.data = data;
                state.isFetching = false;
                state.error = null;
            }
            if (data) {
                cache.write({ key: cacheKey, id: $cacheId, data });
            }
            return data;
        }
        catch (err) {
            (0,_utils__WEBPACK_IMPORTED_MODULE_6__.error)(err);
            cache.__emit({ type: _cache__WEBPACK_IMPORTED_MODULE_0__.MonitorEventType.QUERY, phase: 'error', key: cacheKey, data: err });
            if (isServer) {
                $scope.setResource(id, [null, String(err)]);
            }
            else {
                unregister(id);
                state.isFetching = false;
                state.error = String(err);
            }
        }
        finally {
            if (!isServer) {
                state.isLoaded = true;
                $update();
            }
        }
    };
    (0,_use_effect__WEBPACK_IMPORTED_MODULE_7__.useEffect)(() => {
        if (isHydrateZone)
            return;
        if (lazy)
            return;
        const record = cache.read({ key: cacheKey, id: cacheId });
        if (record?.valid)
            return;
        make();
    }, [...(0,_utils__WEBPACK_IMPORTED_MODULE_6__.mapRecord)(variables)]);
    (0,_use_effect__WEBPACK_IMPORTED_MODULE_7__.useEffect)(() => {
        let off = null;
        off = cache.subscribe(({ type, key, id }) => {
            if (key === state.cacheKey && id === state.cacheId) {
                if (type === 'invalidate' || type === 'optimistic') {
                    if (cache.__canUpdate(key)) {
                        make();
                    }
                }
            }
        });
        return () => {
            unregister(id);
            (0,_utils__WEBPACK_IMPORTED_MODULE_6__.detectIsFunction)(off) && off();
        };
    }, []);
    if (isServer || isHydrateZone) {
        const res = $scope.getResource(id);
        if (isServer) {
            if (res) {
                mutate(state, res);
            }
            else {
                $scope.defer(make);
            }
        }
        else if (isHydrateZone) {
            if (!res)
                throw new Error('[Dark]: can not read app state from the server!');
            const [data] = res;
            mutate(state, res);
            if (data) {
                cache.write({ key: cacheKey, id: cacheId, data });
            }
        }
    }
    else {
        firstTime() && !isLoaded && !lazy && register(id);
    }
    const result = {
        loading: state.isFetching,
        data: state.data,
        error: state.error,
        refetch: make,
    };
    return result;
}
function createState(cache, cacheKey, cacheId, lazy) {
    const state = {
        isFetching: !lazy,
        isLoaded: false,
        data: null,
        error: null,
        cacheKey,
        cacheId,
    };
    const record = cache.read({ key: cacheKey, id: cacheId });
    if (record) {
        state.isFetching = false;
        state.isLoaded = true;
        state.data = record.data;
    }
    return state;
}
function mutate(state, res) {
    const [data, error] = res;
    state.isFetching = false;
    state.isLoaded = true;
    state.data = data;
    state.error = error;
}
function useMounted() {
    const scope = (0,_use_memo__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => ({ isMounted: true, isFirstTime: true }), []);
    const { isFirstTime } = scope;
    (0,_use_layout_effect__WEBPACK_IMPORTED_MODULE_8__.useLayoutEffect)(() => {
        scope.isFirstTime = false;
        return () => (scope.isMounted = false);
    }, []);
    return [() => scope.isMounted, () => isFirstTime];
}



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
//# sourceMappingURL=components_product-add_tsx.build.js.map