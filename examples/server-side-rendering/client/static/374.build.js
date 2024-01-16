"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[374],{6374:(e,t,i)=>{i.r(t),i.d(t,{default:()=>u});var a=i(2654),r=i(3524),n=i(1523),c=i(940),s=i(5450),d=i(4875),o=i(5010);const u=(0,a.wU)((()=>{const{url:e}=(0,n.b)(),t=(0,c.k)(),i=(0,s.U)(),a=Number(i.get("id")),[u,{loading:l}]=(0,d.jb)(a),h=e.replace(`${a}/remove/`,"");return(0,r.h)(o.Zb,{$loading:l},(0,r.h)("h3",null,"Do you want to remove product #",a,"? 🤔"),(0,r.h)(o.zx,{onClick:async()=>{l||(await u(),t.push(h))}},"Yes"),(0,r.h)(o.zx,{onClick:()=>t.back()},"No"))}))},4875:(e,t,i)=>{i.d(t,{N8:()=>E,oD:()=>O,iB:()=>D,rn:()=>R,jb:()=>g});var a=i(5747),r=i(9812),n=i(3760),c=i(7544),s=i(6238),d=i(8047),o=i(4435),u=i(1261),l=i(3443);function h(e,t){const{variables:i={},key:h,extractId:T=(()=>a.kI)}=t||{variables:{}},p=(0,l.pj)(),f=(0,a.YT)(),C=T(i),m=(0,u.Y)((()=>p.getNextResourceId()),[]),_=(0,u.Y)((()=>function(e,t,i){const a={isFetching:!0,isLoaded:!1,data:null,error:null,cacheKey:t,cacheId:i},r=e.read({key:t,id:i});return r&&(a.isFetching=!1,a.isLoaded=!0,a.data=r.data),a}(f,h,C)),[]),{register:k,unregister:P}=(0,d.h)(),[U,R]=function(){const e=(0,u.Y)((()=>({isMounted:!0,isFirstTime:!0})),[]),{isFirstTime:t}=e;return(0,n.b)((()=>(e.isFirstTime=!1,()=>e.isMounted=!1)),[]),[()=>e.isMounted,()=>t]}(),D=(0,o.P)(),E=()=>U()&&D(),O=(0,c.X)(),g=p.getIsHydrateZone(),{isLoaded:F}=_;_.cacheKey=h,_.cacheId=C;const w=async(t,n)=>{const c=t?n:i,s=T(c);f.__emit({type:a.VI.QUERY,phase:"start",key:h,data:c});try{O||R()||(_.isFetching=!0,E());const t=await e(c);return f.__emit({type:a.VI.QUERY,phase:"finish",key:h,data:t}),O?p.setResource(m,[t,null]):(P(m),_.data=t,_.isFetching=!1,_.error=null),t&&f.write({key:h,id:s,data:t}),t}catch(e){(0,r.vU)(e),f.__emit({type:a.VI.QUERY,phase:"error",key:h,data:e}),O?p.setResource(m,[null,String(e)]):(P(m),_.isFetching=!1,_.error=String(e))}finally{O||(_.isLoaded=!0,E())}};if((0,s.d4)((()=>{g||f.read({key:h,id:C})?.valid||w()}),[...(0,r.Yl)(i)]),(0,s.d4)((()=>{let e=null;return e=f.subscribe((({type:e,key:t,id:i})=>{t===_.cacheKey&&i===_.cacheId&&("invalidate"!==e&&"optimistic"!==e||f.__canUpdate(t)&&w())})),()=>{P(m),(0,r.EY)(e)&&e()}}),[]),O||g){const e=p.getResource(m);if(O)e?y(_,e):p.defer(w);else if(g){if(!e)throw new Error("[Dark]: can not read app state from the server!");const[t]=e;y(_,e),t&&f.write({key:h,id:C,data:t})}}else R()&&!F&&k(m);const I={loading:_.isFetching,data:_.data,error:_.error,refetch:e=>w(!0,e)};return I}function y(e,t){const[i,a]=t;e.isFetching=!1,e.isLoaded=!0,e.data=i,e.error=a}function T(e,t){const{key:i,refetchQueries:n=[],onSuccess:c}=t||{},s=(0,o.P)(),d=(0,a.YT)(),l=(0,u.Y)((()=>({isFetching:!1,data:null,error:null})),[]);return[async(...t)=>{let o=null;d.__emit({type:a.VI.MUTATION,phase:"start",key:i,data:t});try{l.isFetching=!0,l.error=null,s(),o=await e(...t),d.__emit({type:a.VI.MUTATION,phase:"finish",key:i,data:o}),(0,r.EY)(c)&&c(d,o),n.forEach((e=>d.invalidate({key:e})))}catch(e){(0,r.vU)(e),l.error=String(e),d.__emit({type:a.VI.MUTATION,phase:"error",key:i,data:e})}finally{l.isFetching=!1,s()}return o},{loading:l.isFetching,data:l.data,error:l.error}]}const p=void 0===globalThis.window?100:600,f=e=>new Promise((t=>setTimeout(t,e)));let C=0;const m=new Array(50).fill(null).map((()=>({id:++C,name:`Product #${C}`,description:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum blanditiis quia minus corrupti quidem. Ipsam quae ad velit repudiandae molestias unde".repeat(3)}))),_={fetchProducts:async()=>(await f(p),m.map((e=>({...e,description:null})))),fetchProduct:async e=>(k(e)||P(),await f(p),m.find((t=>t.id===e))||null),addProduct:async e=>(k(e.id)&&P(),await f(p),e.id=++C,m.push(e),e),async changeProduct(e){if(k(e.id)||P(),!e)return null;await f(p);const t=m.findIndex((t=>t.id===e.id));return-1!==t&&m.splice(t,1,e),e},async removeProduct(e){k(e)||P(),await f(p);const t=m.findIndex((t=>t.id===e));return-1!==t&&m.splice(t,1),!0}},k=e=>"number"==typeof e&&!Number.isNaN(e),P=()=>{throw new Error("Invalid id!")};var U;function R(){return h((()=>_.fetchProducts()),{key:U.FETCH_PRODUCTS})}function D(e){return h((({id:e})=>_.fetchProduct(e)),{key:U.FETCH_PRODUCT,variables:{id:e},extractId:e=>e.id})}function E(){return T(_.addProduct,{key:U.ADD_PRODUCT,onSuccess:(e,t)=>{const i=e.read({key:U.FETCH_PRODUCTS});if(i){const a=i.data;a.push(t),e.optimistic({key:U.FETCH_PRODUCTS,data:a})}}})}function O(){return T(_.changeProduct,{key:U.CHANGE_PRODUCT,onSuccess:(e,t)=>{const i=e.read({key:U.FETCH_PRODUCTS});if(i){const a=i.data;a.find((e=>e.id===t.id)).name=t.name,e.optimistic({key:U.FETCH_PRODUCTS,data:a}),e.optimistic({key:U.FETCH_PRODUCT,data:t,id:t.id})}}})}function g(e){return T((()=>_.removeProduct(e)),{key:U.REMOVE_PRODUCT,onSuccess:t=>{const i=t.read({key:U.FETCH_PRODUCTS});if(i){const a=i.data,r=a.findIndex((t=>t.id===e));-1!==r&&(a.splice(r,1),t.optimistic({key:U.FETCH_PRODUCTS,data:a}))}t.delete({key:U.FETCH_PRODUCT,id:e})}})}!function(e){e.FETCH_PRODUCTS="FETCH_PRODUCTS",e.FETCH_PRODUCT="FETCH_PRODUCT",e.ADD_PRODUCT="ADD_PRODUCT",e.CHANGE_PRODUCT="CHANGE_PRODUCT",e.REMOVE_PRODUCT="REMOVE_PRODUCT"}(U||(U={}))},1523:(e,t,i)=>{i.d(t,{b:()=>c});var a=i(1261),r=i(3113),n=i(3397);function c(){const e=(0,r.M6)();(0,r.BU)(e);const t=(0,r._L)(),{location:{pathname:i}}=e,c=(0,a.Y)((()=>t?(0,n.L7)(i,t):""),[t,i]);return{path:t,url:c}}},5450:(e,t,i)=>{i.d(t,{U:()=>r});var a=i(3113);function r(){const e=(0,a.M6)();return(0,a.BU)(e),e.params}}}]);
//# sourceMappingURL=374.build.js.map