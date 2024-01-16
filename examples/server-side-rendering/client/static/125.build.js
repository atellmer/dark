"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[125],{1125:(e,t,r)=>{r.r(t),r.d(t,{default:()=>f});var i=r(2654),a=r(8903),n=r(3524),d=r(1523),s=r(2752),o=r(1169),c=r(6630),l=r(8422),u=r(5010);const h=c.zo.header`
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-template-rows: auto;
  padding: 16px 0;

  & h2 {
    margin: 0;
  }
`,g=c.zo.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`,p=c.zo.li`
  width: 100%;
  background-color: #fff;
  margin: 6px 0;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

  &:first-child {
    margin-top: 0;
  }
`,f=(0,i.wU)((({slot:e})=>{const{url:t}=(0,d.b)(),{pathname:r}=(0,s.T)(),{data:i,loading:c,error:f}=(0,a.W)((()=>l.h.fetchProductList()),{key:l.Z.PRODUCTS}),y=r.endsWith("list/"),k=t+"add/";return c?(0,n.h)(u.$j,null):f?(0,n.h)(u.jj,{value:f}):(0,n.h)(u.iK,null,(0,n.h)(h,null,(0,n.h)("div",null,y?(0,n.h)(u.zx,{as:o.r,to:k},"Add product"):(0,n.h)(u.zx,{onClick:()=>history.back()},"Back"))),(0,n.h)(u.iK,{key:r},e||(0,n.h)(g,null,i.map((e=>(0,n.h)(p,{key:e.id},(0,n.h)(o.r,{to:`${t}${e.id}`},e.name)))))))}))},8903:(e,t,r)=>{r.d(t,{W:()=>h});var i=r(5747),a=r(9812),n=r(3760),d=r(7544),s=r(6238),o=r(8047),c=r(4435),l=r(1261),u=r(3443);function h(e,t){const{variables:r={},key:h,extractId:p=(()=>i.kI)}=t||{variables:{}},f=(0,u.pj)(),y=(0,i.YT)(),k=p(r),m=(0,l.Y)((()=>f.getNextResourceId()),[]),b=(0,l.Y)((()=>function(e,t,r){const i={isFetching:!0,isLoaded:!1,data:null,error:null,cacheKey:t,cacheId:r};if(e){const a=e.read({key:t,id:r});a&&(i.isFetching=!1,i.isLoaded=!0,i.data=a.data)}return i}(y,h,k)),[]),{register:x,unregister:v}=(0,o.h)(),[w,F]=function(){const e=(0,l.Y)((()=>({isMounted:!0,isFirstTime:!0})),[]),{isFirstTime:t}=e;return(0,n.b)((()=>(e.isFirstTime=!1,()=>e.isMounted=!1)),[]),[()=>e.isMounted,()=>t]}(),L=(0,c.P)(),I=()=>w()&&L(),Y=(0,d.X)(),T=f.getIsHydrateZone(),{isLoaded:z}=b;b.cacheKey=h,b.cacheId=k;const C=async(t,i)=>{const n=t?i:r,d=p(n);try{Y||F()||(b.isFetching=!0,I());const t=await e(n);return Y?f.setResource(m,[t,null]):(v(m),b.data=t,b.isFetching=!1,b.error=null),h&&y&&t&&y.write({key:h,id:d,data:t}),t}catch(e){(0,a.vU)(e),Y?f.setResource(m,[null,String(e)]):(v(m),b.isFetching=!1,b.error=String(e))}finally{Y||(b.isLoaded=!0,I())}};if((0,s.d4)((()=>{if(!T){if(h&&y&&y.read({key:h,id:k})?.valid)return;C()}}),[...(0,a.Yl)(r)]),(0,s.d4)((()=>{let e=null;return y&&(e=y.onChange((({type:e,key:t,id:r})=>{t===b.cacheKey&&r===b.cacheId&&("invalidate"!==e&&"optimistic"!==e||C())}))),()=>{v(m),(0,a.EY)(e)&&e()}}),[]),Y||T){const e=f.getResource(m);if(Y)e?g(b,e):f.defer(C);else if(T){if(!e)throw new Error("[Dark]: can not read app state from the server!");const[t]=e;g(b,e),h&&y&&t&&y.write({key:h,id:k,data:t})}}else F()&&!z&&x(m);const K={loading:b.isFetching,data:b.data,error:b.error,refetch:e=>C(!0,e)};return K}function g(e,t){const[r,i]=t;e.isFetching=!1,e.isLoaded=!0,e.data=r,e.error=i}},1523:(e,t,r)=>{r.d(t,{b:()=>d});var i=r(1261),a=r(3113),n=r(3397);function d(){const e=(0,a.M6)();(0,a.BU)(e);const t=(0,a._L)(),{location:{pathname:r}}=e,d=(0,i.Y)((()=>t?(0,n.L7)(r,t):""),[t,r]);return{path:t,url:d}}}}]);
//# sourceMappingURL=125.build.js.map