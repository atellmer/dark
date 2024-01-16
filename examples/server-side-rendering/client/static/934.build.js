"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[934],{7934:(e,t,i)=>{i.r(t),i.d(t,{default:()=>o});var a=i(2654),r=i(3524),n=i(1523),d=i(940),s=i(9041),c=i(5010);const o=(0,a.wU)((()=>{const{url:e}=(0,n.b)(),t=(0,d.k)(),[i,{loading:a}]=(0,s.N8)(),o=e.replace("add/","");return(0,r.h)(c.Zb,{$loading:a},(0,r.h)("h3",null,"Add product"),(0,r.h)(c.l0,{onSubmit:async e=>{if(e.preventDefault(),a)return;const{elements:r}=e.target,n=r.name.value,d=r.desc.value;await i({name:n,description:d}),t.push(o)}},(0,r.h)("label",{for:"name"},"Name:"),(0,r.h)(c.II,{id:"name",required:!0}),(0,r.h)("label",{for:"desc"},"Description:"),(0,r.h)(c.gx,{id:"desc",required:!0,rows:3}),(0,r.h)(c.zx,{type:"submit"},"Add")))}))},9041:(e,t,i)=>{i.d(t,{N8:()=>E,oD:()=>g,iB:()=>R,rn:()=>D,jb:()=>O});var a=i(5747),r=i(9812),n=i(3760),d=i(7544),s=i(6238),c=i(8047),o=i(4435),u=i(1261),l=i(3443);function h(e,t){const{variables:i={},key:h,extractId:p=(()=>a.kI)}=t||{variables:{}},T=(0,l.pj)(),f=(0,a.YT)(),m=p(i),C=(0,u.Y)((()=>T.getNextResourceId()),[]),_=(0,u.Y)((()=>function(e,t,i){const a={isFetching:!0,isLoaded:!1,data:null,error:null,cacheKey:t,cacheId:i},r=e.read({key:t,id:i});return r&&(a.isFetching=!1,a.isLoaded=!0,a.data=r.data),a}(f,h,m)),[]),{register:P,unregister:k}=(0,c.h)(),[U,D]=function(){const e=(0,u.Y)((()=>({isMounted:!0,isFirstTime:!0})),[]),{isFirstTime:t}=e;return(0,n.b)((()=>(e.isFirstTime=!1,()=>e.isMounted=!1)),[]),[()=>e.isMounted,()=>t]}(),R=(0,o.P)(),E=()=>U()&&R(),g=(0,d.X)(),O=T.getIsHydrateZone(),{isLoaded:F}=_;_.cacheKey=h,_.cacheId=m;const I=async(t,n)=>{const d=t?n:i,s=p(d);f.__emit({type:a.VI.QUERY,phase:"start",key:h,data:d});try{g||D()||(_.isFetching=!0,E());const t=await e(d);return f.__emit({type:a.VI.QUERY,phase:"finish",key:h,data:t}),g?T.setResource(C,[t,null]):(k(C),_.data=t,_.isFetching=!1,_.error=null),t&&f.write({key:h,id:s,data:t}),t}catch(e){(0,r.vU)(e),f.__emit({type:a.VI.QUERY,phase:"error",key:h,data:e}),g?T.setResource(C,[null,String(e)]):(k(C),_.isFetching=!1,_.error=String(e))}finally{g||(_.isLoaded=!0,E())}};if((0,s.d4)((()=>{O||f.read({key:h,id:m})?.valid||I()}),[...(0,r.Yl)(i)]),(0,s.d4)((()=>{let e=null;return e=f.subscribe((({type:e,key:t,id:i})=>{t===_.cacheKey&&i===_.cacheId&&("invalidate"!==e&&"optimistic"!==e||f.__canUpdate(t)&&I())})),()=>{k(C),(0,r.EY)(e)&&e()}}),[]),g||O){const e=T.getResource(C);if(g)e?y(_,e):T.defer(I);else if(O){if(!e)throw new Error("[Dark]: can not read app state from the server!");const[t]=e;y(_,e),t&&f.write({key:h,id:m,data:t})}}else D()&&!F&&P(C);const w={loading:_.isFetching,data:_.data,error:_.error,refetch:e=>I(!0,e)};return w}function y(e,t){const[i,a]=t;e.isFetching=!1,e.isLoaded=!0,e.data=i,e.error=a}function p(e,t){const{key:i,refetchQueries:n=[],onSuccess:d}=t||{},s=(0,o.P)(),c=(0,a.YT)(),l=(0,u.Y)((()=>({isFetching:!1,data:null,error:null})),[]);return[async(...t)=>{let o=null;c.__emit({type:a.VI.MUTATION,phase:"start",key:i,data:t});try{l.isFetching=!0,l.error=null,s(),o=await e(...t),c.__emit({type:a.VI.MUTATION,phase:"finish",key:i,data:o}),(0,r.EY)(d)&&d(c,o),n.forEach((e=>c.invalidate({key:e})))}catch(e){(0,r.vU)(e),l.error=String(e),c.__emit({type:a.VI.MUTATION,phase:"error",key:i,data:e})}finally{l.isFetching=!1,s()}return o},{loading:l.isFetching,data:l.data,error:l.error}]}const T=void 0===globalThis.window?100:600,f=e=>new Promise((t=>setTimeout(t,e)));let m=0;const C=new Array(50).fill(null).map((()=>({id:++m,name:`Product #${m}`,description:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum blanditiis quia minus corrupti quidem. Ipsam quae ad velit repudiandae molestias unde".repeat(3)}))),_={fetchProducts:async()=>(await f(T),C.map((e=>({...e,description:null})))),fetchProduct:async e=>(P(e)||k(),await f(T),C.find((t=>t.id===e))||null),addProduct:async e=>(P(e.id)&&k(),await f(T),e.id=++m,C.push(e),e),async changeProduct(e){if(P(e.id)||k(),!e)return null;await f(T);const t=C.findIndex((t=>t.id===e.id));return-1!==t&&C.splice(t,1,e),e},async removeProduct(e){P(e)||k(),await f(T);const t=C.findIndex((t=>t.id===e));return-1!==t&&C.splice(t,1),!0}},P=e=>"number"==typeof e&&!Number.isNaN(e),k=()=>{throw new Error("Invalid id!")};var U;function D(){return h((()=>_.fetchProducts()),{key:U.FETCH_PRODUCTS})}function R(e){return h((({id:e})=>_.fetchProduct(e)),{key:U.FETCH_PRODUCT,variables:{id:e},extractId:e=>e.id})}function E(){return p(_.addProduct,{key:U.ADD_PRODUCT,onSuccess:(e,t)=>{const i=e.read({key:U.FETCH_PRODUCTS});if(i){const a=i.data;a.push(t),e.optimistic({key:U.FETCH_PRODUCTS,data:a})}}})}function g(){return p(_.changeProduct,{key:U.CHANGE_PRODUCT,onSuccess:(e,t)=>{const i=e.read({key:U.FETCH_PRODUCTS});if(i){const a=i.data;a.find((e=>e.id===t.id)).name=t.name,e.optimistic({key:U.FETCH_PRODUCTS,data:a}),e.optimistic({key:U.FETCH_PRODUCT,data:t,id:t.id})}}})}function O(e){return p((()=>_.removeProduct(e)),{key:U.REMOVE_PRODUCT,onSuccess:t=>{const i=t.read({key:U.FETCH_PRODUCTS});if(i){const a=i.data,r=a.findIndex((t=>t.id===e));-1!==r&&(a.splice(r,1),t.optimistic({key:U.FETCH_PRODUCTS,data:a}))}t.delete({key:U.FETCH_PRODUCT,id:e})}})}!function(e){e.FETCH_PRODUCTS="FETCH_PRODUCTS",e.FETCH_PRODUCT="FETCH_PRODUCT",e.ADD_PRODUCT="ADD_PRODUCT",e.CHANGE_PRODUCT="CHANGE_PRODUCT",e.REMOVE_PRODUCT="REMOVE_PRODUCT"}(U||(U={}))},1523:(e,t,i)=>{i.d(t,{b:()=>d});var a=i(1261),r=i(3113),n=i(3397);function d(){const e=(0,r.M6)();(0,r.BU)(e);const t=(0,r._L)(),{location:{pathname:i}}=e,d=(0,a.Y)((()=>t?(0,n.L7)(i,t):""),[t,i]);return{path:t,url:d}}}}]);
//# sourceMappingURL=934.build.js.map