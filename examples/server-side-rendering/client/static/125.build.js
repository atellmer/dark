"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[125],{1125:(e,t,r)=>{r.r(t),r.d(t,{default:()=>f});var i=r(2654),a=r(8903),n=r(3524),s=r(1523),o=r(2752),d=r(1169),l=r(6630),c=r(8422),u=r(5010);const h=l.zo.header`
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-template-rows: auto;
  padding: 16px 0;

  & h2 {
    margin: 0;
  }
`,g=l.zo.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`,p=l.zo.li`
  width: 100%;
  background-color: #fff;
  margin: 6px 0;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

  &:first-child {
    margin-top: 0;
  }
`,f=(0,i.wU)((({slot:e})=>{const{url:t}=(0,s.b)(),{pathname:r}=(0,o.T)(),{data:i,loading:l,error:f}=(0,a.W)((()=>c.h.fetchProductList()),{key:c.Z.PRODUCTS}),k=r.endsWith("list/"),m=t+"add/";return l?(0,n.h)(u.$j,null):f?(0,n.h)(u.jj,{value:f}):(0,n.h)(u.iK,null,(0,n.h)(h,null,(0,n.h)("div",null,k?(0,n.h)(u.zx,{as:d.r,to:m},"Add product"):(0,n.h)(u.zx,{onClick:()=>history.back()},"Back"))),(0,n.h)(u.iK,{key:r},e||(0,n.h)(g,null,i.map((e=>(0,n.h)(p,{key:e.id},(0,n.h)(d.r,{to:`${t}${e.id}`},e.name)))))))}))},8903:(e,t,r)=>{r.d(t,{W:()=>h});var i=r(5747),a=r(3760),n=r(9812),s=r(7544),o=r(6238),d=r(8047),l=r(4435),c=r(1261),u=r(3443);function h(e,t){const{variables:r={},key:h,extractId:f=(()=>i.kI)}=t||{variables:{}},k=(0,i.YT)(),m=f(r),y=(0,c.Y)((()=>function(e,t,r){const i={isFetching:!0,isLoaded:!1,data:null,error:null,variables:null};if(e){const a=e.read({key:t,id:r});a&&(i.isFetching=!1,i.isLoaded=!0,i.data=a.data)}return i}(k,h,m)),[]),{register:b,unregister:v}=(0,d.h)(),[x,w]=function(){const e=(0,c.Y)((()=>({isMounted:!0,isFirstTime:!0})),[]),{isFirstTime:t}=e;return(0,a.b)((()=>(e.isFirstTime=!1,()=>e.isMounted=!1)),[]),[()=>e.isMounted,()=>t]}(),F=(0,l.P)(),L=()=>x()&&F(),T=(0,u.pj)(),Y=(0,c.Y)((()=>T.getNextResourceId()),[]),j=String(Y),z=(0,s.X)(),C=T.getIsHydrateZone(),{isLoaded:R}=y;y.variables=r;const I=async(t,i)=>{const a=t?i:r;try{z||w()||(y.isFetching=!0,L());const t=await e(a);return z?T.setResource(Y,[t,null]):(v(j),y.data=t,y.isFetching=!1,y.error=null,h&&t&&k?.write({key:h,id:f(a),data:t})),t}catch(e){(0,n.vU)(e),z?T.setResource(Y,[null,String(e)]):(v(j),y.isFetching=!1,y.error=String(e))}finally{z||(y.isLoaded=!0,L())}};if((0,o.d4)((()=>{if(!C){if(h&&k&&k.read({key:h,id:m})?.isValid)return;I()}}),[...p(r)]),(0,o.d4)((()=>{let e=null;return k&&(e=k.onChange((({type:e,key:t,id:r})=>{t===h&&r===f(y.variables)&&("invalidate"!==e&&"optimistic"!==e||I())}))),()=>{v(j),(0,n.EY)(e)&&e()}}),[]),z||C){const e=T.getResource(Y);if(z)e?g(y,e):T.defer(I);else if(C){if(!e)throw new Error("[Dark]: can not read app state from the server!");g(y,e)}}else w()&&!R&&b(j);const M={loading:y.isFetching,data:y.data,error:y.error,refetch:e=>I(!0,e)};return M}function g(e,t){const[r,i]=t;e.isFetching=!1,e.isLoaded=!0,e.data=r,e.error=i}const p=e=>Object.keys(e).map((t=>e[t]))},1523:(e,t,r)=>{r.d(t,{b:()=>s});var i=r(1261),a=r(3113),n=r(3397);function s(){const e=(0,a.M6)();(0,a.BU)(e);const t=(0,a._L)(),{location:{pathname:r}}=e,s=(0,i.Y)((()=>t?(0,n.L7)(r,t):""),[t,r]);return{path:t,url:s}}}}]);
//# sourceMappingURL=125.build.js.map