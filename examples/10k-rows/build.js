!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=2)}([function(e,t,n){"use strict";e.exports=n(3)},function(e,t,n){"use strict";e.exports=n(4)},function(e,t,n){"use strict";n.r(t);var o=n(0),r=n(1);const i=(e={})=>Object(o.View)(Object.assign(Object.assign({},e),{as:"button"})),s=(()=>{let e,t;return{start:n=>{e=performance.now(),t=n},stop:()=>{const n=t;t&&setTimeout(()=>{t=null;const o=performance.now()-e;console.log(`${n}: ${o}`)})}}})();let l=0;const a=(e,t="")=>Array(e).fill(0).map(()=>({id:++l,name:`item: ${l} ${t}`,select:!1})),c={list:[]},u=Object(o.createComponent)(({onCreate:e,onPrepend:t,onAppend:n,onInsertDifferent:r,onUpdateAll:s,onSwap:l,onClear:a})=>((e={})=>Object(o.View)(Object.assign(Object.assign({},e),{as:"div"})))({style:"width: 100%; height: 64px; background-color: blueviolet; display: flex; align-items: center; padding: 16px;",slot:[i({slot:Object(o.Text)("create 10000 rows"),onClick:e}),i({slot:Object(o.Text)("Prepend 1000 rows"),onClick:t}),i({slot:Object(o.Text)("Append 1000 rows"),onClick:n}),i({slot:Object(o.Text)("insert different"),onClick:r}),i({slot:Object(o.Text)("update every 10th row"),onClick:s}),i({slot:Object(o.Text)("swap rows"),onClick:l}),i({slot:Object(o.Text)("clear rows"),onClick:a}),i({slot:Object(o.Text)("unmount app"),onClick:()=>{g.unmount()}})]})),f=Object(o.memo)(u),d=Object(o.createComponent)(({id:e,name:t,selected:n,onRemove:r,onHighlight:i})=>{const s=Object(o.useCallback)(()=>r(e),[]),l=Object(o.useCallback)(()=>i(e),[]);return Object(o.h)("tr",{class:n?"selected":void 0},Object(o.h)("td",{class:"cell"},t),Object(o.h)("td",{class:"cell"},"qqq"),Object(o.h)("td",{class:"cell"},"xxx"),Object(o.h)("td",{class:"cell"},Object(o.h)("button",{onClick:s},"remove"),Object(o.h)("button",{onClick:l},"highlight")))}),p=Object(o.memo)(d,(e,t)=>e.name!==t.name||e.selected!==t.selected),h=Object(o.createComponent)(({items:e,onRemove:t,onHighlight:n})=>Object(o.h)("table",{class:"table"},Object(o.h)("tbody",null,e.map(e=>Object(o.h)(p,{key:e.id,id:e.id,name:e.name,selected:e.select,onRemove:t,onHighlight:n}))))),m=Object(o.memo)(h),b=Object(o.createComponent)(()=>{const e=Object(o.useCallback)(()=>{c.list=a(1e4),s.start("create"),v(),s.stop()},[]),t=Object(o.useCallback)(()=>{c.list.unshift(...a(1e3,"!!!")),c.list=[...c.list],s.start("prepend"),v(),s.stop()},[]),n=Object(o.useCallback)(()=>{c.list.push(...a(1e3,"!!!")),c.list=[...c.list],s.start("append"),v(),s.stop()},[]),r=Object(o.useCallback)(()=>{const[e,t,n,...o]=c.list;c.list=[...a(5,"***"),e,t,n,...a(2,"***"),...o].filter(Boolean),s.start("insert different"),v(),s.stop()},[]),i=Object(o.useCallback)(()=>{c.list=c.list.map((e,t)=>Object.assign(Object.assign({},e),{name:(t+1)%10==0?e.name+"!!!":e.name})),s.start("update every 10th"),v(),s.stop()},[]),l=Object(o.useCallback)(e=>{c.list=c.list.filter(t=>t.id!==e),s.start("remove"),v(),s.stop()},[]),u=Object(o.useCallback)(e=>{const t=c.list.findIndex(t=>t.id===e);c.list[t].select=!c.list[t].select,c.list=[...c.list],s.start("highlight"),v(),s.stop()},[]),d=Object(o.useCallback)(()=>{if(0===c.list.length)return;const e=c.list[1];c.list[1]=c.list[c.list.length-2],c.list[c.list.length-2]=e,c.list=[...c.list],s.start("swap"),v(),s.stop()},[]),p=Object(o.useCallback)(()=>{c.list=[],s.start("clear"),v(),s.stop()},[]);return Object(o.h)(o.Fragment,null,Object(o.h)(f,{onCreate:e,onPrepend:t,onAppend:n,onInsertDifferent:r,onUpdateAll:i,onSwap:d,onClear:p}),Object(o.h)(m,{items:c.list,onRemove:l,onHighlight:u}))}),g=Object(r.createRoot)(document.getElementById("root"));function v(){g.render(b())}v(),document.querySelector("#button").addEventListener("click",()=>{v()})},function(e,t,n){!function(t,n){e.exports=n()}(self,()=>(()=>{"use strict";var e={d:(t,n)=>{for(var o in n)e.o(n,o)&&!e.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:n[o]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{$$memo:()=>ge,ATTR_KEY:()=>r,ATTR_REF:()=>i,Comment:()=>(function(e){const t=()=>new te(e);return t[X]=!0,t}),CommentVirtualNode:()=>te,ComponentFactory:()=>O,EMPTY_NODE:()=>o,EffectTag:()=>Oe,Fiber:()=>He,Fragment:()=>pe,NodeType:()=>z,PARTIAL_UPDATE:()=>s,ROOT:()=>n,Suspense:()=>rt,SuspenseContext:()=>ot,TagVirtualNode:()=>Q,TaskPriority:()=>l,Text:()=>fe,TextVirtualNode:()=>ee,View:()=>ue,VirtualNode:()=>J,batch:()=>(function(e){_.set(!0),e()}),cloneTagMap:()=>we,createComponent:()=>w,createContext:()=>Je,createEmptyVirtualNode:()=>ae,createHook:()=>(function(){return{idx:0,values:[]}}),createUpdateCallback:()=>Ye,currentFiberStore:()=>R,currentRootStore:()=>F,deletionsStore:()=>D,detectIsArray:()=>h,detectIsBoolean:()=>p,detectIsCommentVirtualNode:()=>re,detectIsComponentFactory:()=>S,detectIsDepsDifferent:()=>k,detectIsEmpty:()=>b,detectIsEmptyVirtualNode:()=>se,detectIsFragment:()=>he,detectIsFunction:()=>a,detectIsLazy:()=>st,detectIsMemo:()=>ye,detectIsMutableRef:()=>be,detectIsNull:()=>m,detectIsNumber:()=>u,detectIsObject:()=>d,detectIsString:()=>f,detectIsTagVirtualNode:()=>oe,detectIsTextVirtualNode:()=>ie,detectIsUndefined:()=>c,detectIsVirtualNode:()=>ne,detectIsVirtualNodeFactory:()=>ce,dummyFn:()=>T,effectsStore:()=>V,error:()=>g,eventsStore:()=>A,fiberMountStore:()=>U,flatten:()=>v,forwardRef:()=>me,fromEnd:()=>E,getComponentFactoryKey:()=>j,getRootId:()=>M,getTime:()=>(function(){return Date.now()}),getVirtualNodeKey:()=>le,h:()=>(function(e,t,...n){if(f(e))return ue(Object.assign(Object.assign({},t),{as:e,slot:et(n)}));if(a(e)){let o=et(n);return o=1===o.length?o[0]:o,e(Object.assign(Object.assign({},t),{slot:o}))}return null}),hasChildrenProp:()=>qe,isBatchZone:()=>_,isLayoutEffectsZone:()=>K,isUpdateHookZone:()=>B,keyBy:()=>y,layoutEffectsStore:()=>W,lazy:()=>(function(e){return me(w((t,n)=>{const{fallback:o,trigger:r}=Xe(ot),[i,s]=nt({component:null});return G(()=>{(function(e){return new Promise(t=>{e().then(e=>{if(!e.default)throw new Error("[Dark]: lazy loaded component should be exported as default!");t(e.default)})})})(e).then(e=>{s({component:e})})},[]),G(()=>{i.component&&r()},[i.component]),i.component?i.component(t,n):o},{token:it}))}),memo:()=>(function(e,t=ve){return me(w((t,n)=>(n&&(t.ref=n),e(t)),{token:ge,shouldUpdate:t}))}),nextUnitOfWorkStore:()=>L,platform:()=>xe,rootStore:()=>P,unmountRoot:()=>(function(e,t){c(e)||(Me(F.get(e)),A.unsubscribe(e),P.remove(e),t())}),useCallback:()=>tt,useContext:()=>Xe,useDeferredValue:()=>(function(e,t){const{timeoutMs:n}=t||{},[o,r]=nt(e,{priority:l.LOW,timeoutMs:n});return G(()=>{r(e)},[e]),o}),useEffect:()=>G,useError:()=>(function(){const e=R.get(),t=ze(),n=ke(()=>({error:null}),[]);return e.catchException=(e=>{n.error=e,t()}),G(()=>{n.error=null},[n.error]),n.error}),useEvent:()=>(function(e){const t=ke(()=>({fn:e}),[]);return t.fn=e,tt((...e)=>t.fn(...e),[])}),useImperativeHandle:()=>(function(e,t,n){const o=ke(()=>t(),n);e.current=o}),useLayoutEffect:()=>je,useMemo:()=>ke,useReducer:()=>(function(e,t,n){const o=ke(()=>a(n)?n(t):t,[]),[r,i]=nt(o),s=tt(t=>i(n=>e(n,t)),[]);return[r,s]}),useRef:()=>(function(e=null){return ke(()=>({current:e}),[])}),useState:()=>nt,useUpdate:()=>ze,version:()=>lt,walkFiber:()=>Pe,wipRootStore:()=>N,workLoop:()=>(function(){const e=N.get();let t=L.get(),n=!1,o=Boolean(t);for(;t&&!n;)t=Ne(t),L.set(t),o=Boolean(t),n=xe.shouldYeildToHost();return!t&&e&&function(){const e=N.get();!function(t,n){const o=D.get();for(const e of o)Me(e),xe.applyCommit(e);Pe({fiber:t,onLoop:({nextFiber:e,isReturn:t,resetIsDeepWalking:n})=>{e.effectTag===Oe.SKIP?n():t||xe.applyCommit(e),e&&e.shadow&&(e.shadow=null)}}),xe.finishCommitWork(),D.set([]),(()=>{const t=W.get(),n=V.get();K.set(!0),t.forEach(e=>e()),K.set(!1),setTimeout(()=>{n.forEach(e=>e())}),N.set(null),W.reset(),V.reset(),B.get()?B.set(!1):F.set(e)})()}(e.child)}(),o})});const n="root",o="dark:matter",r="key",i="ref",s="partial-update";var l;!function(e){e[e.HIGH=2]="HIGH",e[e.NORMAL=1]="NORMAL",e[e.LOW=0]="LOW"}(l||(l={}));const a=e=>"function"==typeof e,c=e=>void 0===e,u=e=>"number"==typeof e,f=e=>"string"==typeof e,d=e=>"object"==typeof e,p=e=>"boolean"==typeof e,h=e=>Array.isArray(e),m=e=>null===e,b=e=>m(e)||c(e);function g(e){!c(console)&&console.error(e)}function v(e){const t=[],n={0:{idx:0,source:e}};let o=0;do{const{source:e,idx:r}=n[o],i=e[r];r>=e.length?n[--o].idx++:h(i)?n[++o]={idx:0,source:i}:(t.push(i),n[o].idx++)}while(o>0||n[o].idx<n[o].source.length);return t}function y(e,t,n=!1){return e.reduce((e,o)=>(e[t(o)]=!n||o,e),{})}function E(e,t){return e.slice(e.length-t,e.length)}const T=()=>{};function k(e,t){if(!c(e)&&!c(t)&&e.length>0&&t.length>0)for(let n=0;n<t.length;n++)if(t[n]!==e[n])return!0;return!1}const x={displayName:"",defaultProps:{},token:Symbol("component")};class O{constructor(e){this.children=[],this.type=e.type||null,this.token=e.token||null,this.props=e.props||null,this.ref=e.ref||null,this.displayName=e.displayName||"",this.shouldUpdate=e.shouldUpdate||null}}function w(e,t={}){const n=Object.assign(Object.assign({},x),t),{token:o,defaultProps:r,displayName:i,shouldUpdate:s}=n;return(t={},n)=>{const l=Object.assign(Object.assign({},r),t),a=new O({token:o,ref:n,displayName:i,shouldUpdate:s,props:l,type:e,children:[]});return l.ref&&delete l.ref,a}}const S=e=>e instanceof O,j=e=>b(e.props[r])?null:e.props[r];let C=null;const I=new Map;const P={set:e=>{C=e,!I.get(C)&&I.set(C,new class{constructor(){this.wipRoot=null,this.currentRoot=null,this.nextUnitOfWork=null,this.events=new Map,this.unsubscribers=[],this.deletions=[],this.fiberMount={level:0,navigation:{},isDeepWalking:!0},this.componentFiber=null,this.effects=[],this.layoutEffects=[],this.isLayoutEffectsZone=!1,this.isUpdateHookZone=!1,this.isBatchZone=!1}})},remove:e=>I.delete(e)},M=()=>C,H=(e=C)=>I.get(e),N={get:()=>{var e;return(null===(e=H())||void 0===e?void 0:e.wipRoot)||null},set:e=>H().wipRoot=e},F={get:e=>{var t;return(null===(t=H(e))||void 0===t?void 0:t.currentRoot)||null},set:e=>H().currentRoot=e},L={get:()=>{var e;return(null===(e=H())||void 0===e?void 0:e.nextUnitOfWork)||null},set:e=>H().nextUnitOfWork=e},R={get:()=>{var e;return null===(e=H())||void 0===e?void 0:e.componentFiber},set:e=>H().componentFiber=e},A={get:()=>H().events,addUnsubscriber:e=>H().unsubscribers.push(e),unsubscribe:e=>H(e).unsubscribers.forEach(e=>e())},D={get:()=>H().deletions,set:e=>H().deletions=e},U={reset:()=>{H().fiberMount={level:0,navigation:{},isDeepWalking:!0}},getIndex:()=>H().fiberMount.navigation[H().fiberMount.level],jumpToChild:()=>{const{fiberMount:e}=H(),t=e.level+1;e.level=t,e.navigation[t]=0},jumpToParent:()=>{const{fiberMount:e}=H(),t=e.level,n=t-1;e.navigation[t]=0,e.level=n},jumpToSibling:()=>{const{fiberMount:e}=H(),t=e.level,n=e.navigation[t]+1;e.navigation[t]=n},deepWalking:{get:()=>H().fiberMount.isDeepWalking,set:e=>H().fiberMount.isDeepWalking=e}},V={get:()=>H().effects,reset:()=>H().effects=[],add:e=>H().effects.push(e)},W={get:()=>H().layoutEffects,reset:()=>H().layoutEffects=[],add:e=>H().layoutEffects.push(e)},K={get:()=>{var e;return(null===(e=H())||void 0===e?void 0:e.isLayoutEffectsZone)||!1},set:e=>H().isLayoutEffectsZone=e},B={get:()=>{var e;return(null===(e=H())||void 0===e?void 0:e.isUpdateHookZone)||!1},set:e=>H().isUpdateHookZone=e},_={get:()=>{var e;return(null===(e=H())||void 0===e?void 0:e.isBatchZone)||!1},set:e=>H().isBatchZone=e},Z=Symbol("use-effect"),{useEffect:G,hasEffects:q,dropEffects:$}=Y(Z,V);function Y(e,t){return{useEffect:function(n,o){const r=R.get().hook,{idx:i,values:s}=r,l=()=>{s[i]={deps:o,token:e,value:void 0},t.add(()=>{s[i].value=n()})};if(c(s[i]))l();else{const{deps:e,value:t}=s[i];(!o||k(o,e))&&(a(t)&&t(),l())}r.idx++},hasEffects:function(t){const{values:n}=t.hook;return n.some(t=>(null==t?void 0:t.token)===e)},dropEffects:function(t){const{values:n}=t;for(const t of n)if(t.token===e){const e=t.value;a(e)&&e()}}}}var z;!function(e){e.TAG="TAG",e.TEXT="TEXT",e.COMMENT="COMMENT"}(z||(z={}));const X=Symbol("virtual-node");class J{constructor(e){this.type=null,this.type=e.type}}class Q extends J{constructor(e){super(e),this.type=z.TAG,this.name=null,this.isVoid=!1,this.attrs={},this.children=[],this.name=e.name||this.name,this.isVoid=e.isVoid||this.isVoid,this.attrs=e.attrs||this.attrs,this.children=e.children||this.children}}class ee extends J{constructor(e){super({}),this.type=z.TEXT,this.value="",this.value=e}}class te extends J{constructor(e){super({}),this.type=z.COMMENT,this.value="",this.value=e}}const ne=e=>e instanceof J,oe=e=>e instanceof Q,re=e=>e instanceof te,ie=e=>e instanceof ee,se=e=>re(e)&&e.value===o;function le(e){const t=e&&e.attrs[r];return b(t)?null:t}const ae=()=>new te(o),ce=e=>a(e)&&!0===e[X];function ue(e){const t=()=>{const{as:t,slot:n,isVoid:o=!1}=e,r=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(n[o[r]]=e[o[r]])}return n}(e,["as","slot","isVoid"]),i=o?[]:h(n)?n:n?[n]:[];return new Q({name:t,isVoid:o,attrs:Object.assign({},r),children:i})};return t[X]=!0,t}function fe(e){return f(e)?new ee(e):ie(e)?e.value:""}const de=Symbol("fragment"),pe=w(({slot:e})=>e||null,{token:de}),he=e=>S(e)&&e.token===de;function me(e){return t=>{var{ref:n}=t,o=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(n[o[r]]=e[o[r]])}return n}(t,["ref"]);return e(o,n)}}const be=e=>{if(!d(e)||m(e))return!1;const t=e;for(const e in t)if("current"===e&&t.hasOwnProperty(e))return!0;return!1},ge=Symbol("memo"),ve=(e,t)=>{const n=Object.keys(t);for(const o of n)if("slot"!==o&&t[o]!==e[o])return!0;return!1},ye=e=>S(e)&&e.token===ge;const Ee=w(({slot:e})=>e,{token:ge});function Te(e,t=!1){return function(e,t){const n=e=>ce(e)||S(e);if(h(e)?n(e[0]):n(e)){const n=Ee({slot:pe({slot:e})});return n.shouldUpdate=(()=>t),n}return e}(e(),t)}function ke(e,t){const n=R.get(),{hook:o}=n,{idx:r,values:i}=o;if(c(i[r])){const n=Te(e);return i[r]={deps:t,value:n},o.idx++,n}const s=i[r],l=k(t,s.deps),a=l?e:()=>s.value;return s.deps=t,s.value=Te(a,l),o.idx++,s.value}const xe={createNativeElement:()=>{throw new Error("createNativeElement not installed by renderer")},requestAnimationFrame:()=>{throw new Error("requestAnimationFrame not installed by renderer")},scheduleCallback:()=>{throw new Error("scheduleCallback not installed by renderer")},shouldYeildToHost:()=>{throw new Error("shouldYeildToHost not installed by renderer")},applyCommit:()=>{throw new Error("applyCommit not installed by renderer")},finishCommitWork:()=>{throw new Error("finishCommitWork not installed by renderer")},detectIsPortal:()=>{throw new Error("detectIsPortal not installed by renderer")},unmountPortal:()=>{throw new Error("unmountPortal not installed by renderer")}};var Oe;!function(e){e.CREATE="CREATE",e.UPDATE="UPDATE",e.DELETE="DELETE",e.SKIP="SKIP"}(Oe||(Oe={}));const we={[Oe.CREATE]:!0,[Oe.SKIP]:!0},Se=Symbol("use-layout-effect"),{useEffect:je,hasEffects:Ce,dropEffects:Ie}=Y(Se,W);function Pe(e){const{fiber:t,onLoop:n}=e;let o=t,r=!0,i=!1,s=!1;const l=new Map,a=e=>!l.get(e);for(;o&&(n({nextFiber:o,isReturn:i,resetIsDeepWalking:()=>r=!1,stop:()=>s=!0}),!s);)if(o.child&&r&&a(o.child)){const e=o.child;i=!1,o=e,l.set(e,!0)}else if(o.nextSibling&&a(o.nextSibling)){const e=o.nextSibling;r=!0,i=!1,o=e,l.set(e,!0)}else if(o.parent&&o.parent===t&&o.parent.nextSibling&&a(o.parent.nextSibling)){const e=o.parent.nextSibling;r=!0,i=!1,o=e,l.set(e,!0)}else o.parent&&o.parent!==t?(r=!1,i=!0,o=o.parent):o=null}function Me(e){(e.effectHost||e.layoutEffectHost||e.portalHost)&&Pe({fiber:e,onLoop:({nextFiber:t,isReturn:n,stop:o})=>{if(t===e.nextSibling||e.transposition)return o();!n&&S(t.instance)&&(t.layoutEffectHost&&Ie(t.hook),t.effectHost&&$(t.hook),t.portalHost&&xe.unmountPortal(t))}})}class He{constructor(e){this.nativeElement=e.nativeElement||null,this.parent=e.parent||null,this.child=e.child||null,this.nextSibling=e.nextSibling||null,this.alternate=e.alternate||null,this.effectTag=e.effectTag||null,this.instance=e.instance||null,this.hook=e.hook||{idx:0,values:[]},this.shadow=e.shadow||null,this.provider=e.provider||null,this.transposition=!c(e.transposition)&&e.transposition,this.mountedToHost=!c(e.mountedToHost)||!1,this.portalHost=!c(e.portalHost)&&e.portalHost,this.effectHost=!c(e.effectHost)&&e.effectHost,this.layoutEffectHost=!c(e.layoutEffectHost)&&e.layoutEffectHost,this.childrenCount=e.childrenCount||0,this.marker=e.marker||"",this.idx=e.idx||0,this.isUsed=e.isUsed||!1,this.batched=e.batched||[]}markPortalHost(){this.portalHost=!0,this.parent&&!this.parent.portalHost&&this.parent.markPortalHost()}markEffectHost(){this.effectHost=!0,this.parent&&!this.parent.effectHost&&this.parent.markEffectHost()}markLayoutEffectHost(){this.layoutEffectHost=!0,this.parent&&!this.parent.layoutEffectHost&&this.parent.markLayoutEffectHost()}markMountedToHost(){this.mountedToHost=!0,this.parent&&!this.parent.mountedToHost&&this.parent.markMountedToHost()}setError(e){"function"==typeof this.catchException?this.catchException(e):this.parent&&this.parent.setError(e)}}function Ne(e){let t=!0,n=e,o=e.shadow,r=e.instance;for(;;){if(t=U.deepWalking.get(),n.hook.idx=0,t)if(qe(r)&&r.children.length>0){const{performedFiber:e,performedNextFiber:t,performedShadow:i,performedInstance:s}=Le({nextFiber:n,shadow:o,instance:r});if(n=t,o=i,r=s,e)return e}else{const{performedFiber:e,performedNextFiber:t,performedShadow:i,performedInstance:s}=Re({nextFiber:n,shadow:o,instance:r});if(n=t,o=i,r=s,e)return e}else{const{performedFiber:e,performedNextFiber:t,performedShadow:i,performedInstance:s}=Re({nextFiber:n,shadow:o,instance:r});if(n=t,o=i,r=s,e)return e}if(Fe(n),null===n.parent)return null}}function Fe(e){var t;if(e.marker!==s)return;const n=(null===(t=e.child)||void 0===t?void 0:t.alternate)||null,o=e.child||null;if(n&&o&&n.nextSibling&&!o.nextSibling){let e=n.nextSibling;const t=[];for(;e;)e.effectTag=Oe.DELETE,t.push(e),e=e.nextSibling;D.get().push(...t)}}function Le(e){U.jumpToChild();let t=e.nextFiber,n=e.shadow,o=e.instance;n=n?n.child:null;const r=function(e){let t=e.alternate&&e.alternate.effectTag!==Oe.DELETE?e.alternate.child:null;for(;t&&t.effectTag===Oe.DELETE;)t=t.nextSibling;return t}(t),i=qe(o)&&o.children[0]||null,s=r?Be(r.instance):null,l=i?Be(i):null,a=$e({shadow:n=null!==s&&null!==l&&s===l?null:n,alternate:r,prevKey:s,nextKey:l}),c=n?n.provider:r?r.provider:null;let u=new He({hook:a,provider:c});R.set(u),u.parent=t;const{performedInstance:f,performedShadow:d}=Ve({instance:o,idx:0,fiber:u,alternate:r});return o=f||o,n=d||n,r&&De({alternate:r,instance:o}),Ae({fiber:u,alternate:r,instance:o}),(u=r?Ue({fiber:u,alternate:r,instance:o}):u).idx=0,t.child=u,u.parent=t,u.shadow=n,t=u,we[u.parent.effectTag]&&(u.effectTag=u.parent.effectTag),{performedFiber:t,performedNextFiber:t,performedShadow:n,performedInstance:o}}function Re(e){U.jumpToSibling();let t=e.nextFiber,n=e.shadow,o=e.instance;const r=t.parent.instance,i=U.getIndex();if(qe(r)&&r.children[i]){U.deepWalking.set(!0),n=n?n.nextSibling:null;const e=function(e){var t;let n=(null===(t=e.alternate)||void 0===t?void 0:t.nextSibling)||null;for(;n&&n.effectTag===Oe.DELETE;)n=n.nextSibling;return n}(t),s=qe(t.parent.instance)&&t.parent.instance.children[i]||null,l=e?Be(e.instance):null,a=s?Be(s):null,c=$e({shadow:n=null!==l&&null!==a&&l===a?null:n,alternate:e,prevKey:l,nextKey:a}),u=n?n.provider:e?e.provider:null;let f=new He({hook:c,provider:u});R.set(f),f.parent=t.parent;const{performedInstance:d,performedShadow:p}=Ve({instance:r,idx:i,fiber:f,alternate:e});return o=d||o,n=p||n,e&&De({alternate:e,instance:o}),Ae({fiber:f,alternate:e,instance:o}),(f=e?Ue({fiber:f,alternate:e,instance:o}):f).idx=i,f.parent=t.parent,t.nextSibling=f,f.shadow=n,t=f,we[f.parent.effectTag]&&(f.effectTag=f.parent.effectTag),{performedFiber:t,performedNextFiber:t,performedShadow:n,performedInstance:o}}return U.jumpToParent(),U.deepWalking.set(!1),n=n?n.parent:null,o=(t=t.parent).instance,qe(t.instance)&&(t.instance.children=[]),{performedFiber:null,performedNextFiber:t,performedShadow:n,performedInstance:o}}function Ae(e){const{fiber:t,alternate:n,instance:o}=e,r=(n?Be(n.instance):null)!==(n?Be(o):null),i=Boolean(n)&&Ge(n.instance)===Ge(o)&&!r;t.instance=o,t.alternate=n||null,t.nativeElement=i?n.nativeElement:null,t.effectTag=i?Oe.UPDATE:Oe.CREATE,t.mountedToHost=i,qe(t.instance)&&(t.childrenCount=t.instance.children.length),t.alternate&&(t.alternate.shadow=null,t.alternate.alternate=null),!t.nativeElement&&ne(t.instance)&&(t.nativeElement=xe.createNativeElement(t.instance))}function De(e){const{alternate:t,instance:n}=e,o=Ge(t.instance),r=Ge(n)===o,i=Be(t.instance)===Be(n);if(t.isUsed=!0,r&&i){if(qe(t.instance)&&qe(n)){const e=t.childrenCount,o=n.children.length;if(e!==o){const r=qe(n)?n.children:[],{prevKeys:i,nextKeys:s}=function(e,t){let n=e,o=0;const r=[],i=[];for(;n||o<t.length;){const e=n&&Be(n.instance),s=t[o]&&Be(t[o]);b(e)||r.push(e),b(s)||i.push(s),n=n?n.nextSibling:null,o++}return{prevKeys:r,nextKeys:i}}(t.child,r);i.length,s.length;const l=()=>{const e=_e(s,i);if(0===e.length||e.length===s.length)return;const n=y(e,e=>e),o={};let r=0;for(const e of s){if(o[e]=!0,e!==i[r]&&n[e]){const e=new He({instance:ae(),parent:t,effectTag:Oe.CREATE});if(0===r)e.nextSibling=t.child,t.child=e;else{const[n,o]=Ke(t.child,r);n&&o&&(e.nextSibling=n,o.nextSibling=e)}}r++}};(()=>{const n=_e(i,s);if(n.length>0){const e=function(e){let t=e;const n={};for(;t;){const e=Be(t.instance);b(e)||(n[e]=t),t=t.nextSibling}return n}(t.child);for(const t of n){const n=e[t]||null;n&&(n.effectTag=Oe.DELETE,D.get().push(n))}}else{const n=e-o;if(n<=0)return;const r=E(function(e){const t=[];let n=e;for(;n;)t.push(n),n=n.nextSibling;return t}(t.child),n);for(const e of r)e.effectTag=Oe.DELETE;D.get().push(...r)}})(),l()}}}else t.effectTag=Oe.DELETE,D.get().push(t)}function Ue(e){const{fiber:t,alternate:n,instance:o}=e;if(ye(t.instance)){let e=null;const r=o,i=n.instance;if(r.type!==i.type)return t;const s=i.props,l=r.props;if(!r.shouldUpdate(s,l)){let o=null;for(U.deepWalking.set(!1),e=new He(Object.assign(Object.assign({},n),{alternate:n,effectTag:Oe.SKIP,nextSibling:n.nextSibling?n.nextSibling.effectTag===Oe.DELETE?null:n.nextSibling:null})),n.alternate=null,o=e.child;o;)o.parent=e,o=o.nextSibling;return e.effectHost&&t.markEffectHost(),e.layoutEffectHost&&t.markLayoutEffectHost(),e.mountedToHost&&t.markMountedToHost(),e.portalHost&&t.markPortalHost(),e}}return t}function Ve(e){const{instance:t,idx:n,fiber:o,alternate:r}=e;let i=null,s=null;if(qe(t)){const e=h(t.children[n])?v([t.children[n]]):[t.children[n]];t.children.splice(n,1,...e),i=t.children[n],s=r?function(e){const{instance:t,fiber:n,alternate:o}=e,r=Be(o.instance),i=Be(t);let s=null;return r!==i&&((s=function(e,t){if(b(e))return null;let n=t;for(;n;){if(e===Be(n.instance))return n;n=n.nextSibling}return null}(i,o.parent.child))&&(n.hook=s.hook,n.provider=s.provider,o.transposition=!0)),s}({instance:i,fiber:o,alternate:r}):s,i=We(o,i)}return S(i)&&(q(o)&&o.markEffectHost(),Ce(o)&&o.markLayoutEffectHost(),xe.detectIsPortal(i)&&o.markPortalHost()),{performedInstance:i,performedShadow:s}}function We(e,t){const n=S(t),o=t;if(n)try{const e=o.type(o.props,o.ref);o.children=h(e)?v([e]):[e]}catch(t){o.children=[],e.setError(t),g(t)}else ce(t)&&(t=t());if(qe(t)){for(let e=0;e<t.children.length;e++)t.children[e]||(t.children[e]=Ze(t.children[e]));t.children=n?t.children:h(t.children)?v([t.children]):[t.children],n&&0===o.children.length&&o.children.push(ae())}return t}function Ke(e,t){const n={};let o=e,r=0;for(;o;){if(n[r]=o,r===t)return[n[r]||null,n[r-1]||null];r++,o=o.nextSibling}return[null,null]}function Be(e){return S(e)?j(e):oe(e)?le(e):null}function _e(e,t){const n=t.reduce((e,t)=>(e[t]=!0,e),{}),o=[];for(const t of e)n[t]||o.push(t);return o}function Ze(e){return b(e)||!1===e?ae():e}function Ge(e){return oe(e)?e.name:ne(e)||S(e)?e.type:null}function qe(e){return oe(e)||S(e)}function $e(e){const{shadow:t,alternate:n,prevKey:o,nextKey:r}=e;return t?t.hook:n&&o===r?n.hook:{idx:0,values:[]}}function Ye(e){const{rootId:t,fiber:n,forceStart:o=!1,onStart:r}=e;return()=>{o&&r(),n.isUsed||(!o&&r(),P.set(t),B.set(!0),U.reset(),n.alternate=new He(Object.assign(Object.assign({},n),{alternate:null})),n.marker=s,n.effectTag=Oe.UPDATE,n.child=null,N.set(n),R.set(n),n.instance=We(0,n.instance),L.set(n))}}function ze(e){const t=M(),n=R.get(),o=ke(()=>({fiber:n}),[]);return o.fiber=n,n=>{const r=Ye({rootId:t,fiber:o.fiber,forceStart:Boolean(null==e?void 0:e.timeoutMs),onStart:n||T});K.get()&&(e=Object.assign(Object.assign({},e||{}),{forceSync:!0})),_.get()?function(e,t){e.batched.push(t);const n=()=>{const t=e.batched.length;xe.requestAnimationFrame(()=>{if(t===e.batched.length){const t=e.batched[e.batched.length-1];_.set(!1),e.batched=[],t&&t()}else n()})};n()}(o.fiber,()=>xe.scheduleCallback(r,e)):xe.scheduleCallback(r,e)}}function Xe(e){const{defaultValue:t}=e,n=function(e,t){let n=R.get();for(;n;){if(n.provider&&n.provider.get(e))return n.provider.get(e);n=n.parent}return null}(e),o=n?n.value:t,r=ze(),i=ke(()=>({prevValue:o}),[]),s=Boolean(n);return G(()=>{if(!s)return;const e=e=>{Object.is(i.prevValue,e)||r()};return n.subscribers.push(e),()=>{const t=n.subscribers.findIndex(t=>t===e);-1!==t&&n.subscribers.splice(t,1)}},[s]),i.prevValue=o,o}function Je(e){let t="Context";const n={displayName:t,defaultValue:e,Provider:null,Consumer:null};return Qe(n,e,t),Object.defineProperty(n,"displayName",{get:()=>t,set:o=>{Qe(n,e,t=o)}}),n}function Qe(e,t,n){e.Provider=function(e,t,n){return w(({value:n=t,slot:o})=>{const r=R.get();r.provider||(r.provider=new Map),r.provider.get(e)||r.provider.set(e,{subscribers:[],value:n});const i=r.provider.get(e);return G(()=>{for(const e of i.subscribers)e(n)},[n]),i.value=n,o},{displayName:`${n}.Provider`})}(e,t,n),e.Consumer=function(e,t){return w(({slot:t})=>{const n=Xe(e);return a(t)?t(n):null},{displayName:`${n}.Consumer`})}(e)}function et(e){return(e=e.map(e=>f(e)||u(e)?fe(e.toString()):e))?Array.isArray(e)?[...e]:[e]:[]}function tt(e,t){return ke(()=>e,t)}function nt(e,t){const n=R.get(),o=ze(t),r=ke(()=>({idx:n.hook.idx,values:n.hook.values}),[]),i=tt(e=>{const n=r.values[r.idx],i=a(e)?e(n):e;if(!Object.is(n,i)){const e=()=>{r.values[r.idx]=i};(null==t?void 0:t.priority)===l.LOW?o(()=>e()):(e(),o())}},[]),{hook:s}=n,{idx:u,values:f}=s,d=c(f[u])?e:f[u];return f[u]=d,r.idx=u,r.values=f,s.idx++,[d,i]}const ot=Je({fallback:null,isLoaded:!0,trigger:()=>{}}),rt=w(({fallback:e,slot:t})=>{if(!e)throw new Error("[Dark]: Suspense fallback not found");const{isLoaded:n}=Xe(ot),[o,r]=nt(!1),i=tt(()=>r(!0),[]),s=ke(()=>({fallback:e,isLoaded:o,trigger:i}),[e,o]);return ot.Provider({value:s,slot:n?t:null})}),it=Symbol("lazy");const st=e=>S(e)&&e.token===it;const lt="0.9.6";return t})())},function(e,t,n){!function(t,o){e.exports=o(n(0))}(self,e=>(()=>{"use strict";var t={317:t=>{t.exports=e}},n={};function o(e){var r=n[e];if(void 0!==r)return r.exports;var i=n[e]={exports:{}};return t[e](i,i.exports,o),i.exports}o.d=((e,t)=>{for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}),o.o=((e,t)=>Object.prototype.hasOwnProperty.call(e,t)),o.r=(e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})});var r={};return(()=>{o.r(r),o.d(r,{createPortal:()=>(function(e,o){if(!(o instanceof Element))throw new Error("[Dark]: createPortal receives only Element as container!");return n({[t]:o,slot:e})}),createRoot:()=>(function(t){return{render:e=>N(e,t),unmount:()=>{const n=H.get(t);(0,e.unmountRoot)(n,()=>{H.delete(t),t.innerHTML=""})}}}),render:()=>N,setTrackUpdate:()=>(function(e){h=e}),useStyle:()=>(function(e){return e(F)}),version:()=>L});var e=o(317);const t=Symbol("portal");const n=(0,e.createComponent)(n=>{var{slot:o}=n,r=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(n[o[r]]=e[o[r]])}return n}(n,["slot"]);return(0,e.useMemo)(()=>r[t].innerHTML="",[]),o},{token:t}),i=n=>(0,e.detectIsComponentFactory)(n)&&n.token===t,s=e=>i(e)?e.props[t]:null;class l{constructor(e){this.type="",this.sourceEvent=null,this.target=null,this.propagation=!0,this.type=e.sourceEvent.type,this.sourceEvent=e.sourceEvent,this.target=e.target}stopPropagation(){this.propagation=!1,this.sourceEvent.stopPropagation()}preventDefault(){this.sourceEvent.preventDefault()}getPropagation(){return this.propagation}}function a(t){const{target:n,eventName:o,handler:r}=t,i=e.eventsStore.get(),s=i.get(o);if(s)s.set(n,r);else{const t=t=>{const n=i.get(o).get(t.target),r=t.target;let s=null;(0,e.detectIsFunction)(n)&&n(s=new l({sourceEvent:t,target:r})),(s?s.getPropagation():r.parentElement)&&r.parentElement.dispatchEvent(new t.constructor(t.type,t))};i.set(o,new WeakMap([[n,r]])),document.addEventListener(o,t,!0),e.eventsStore.addUnsubscriber(()=>document.removeEventListener(o,t,!0))}}const c=e=>e.startsWith("on"),u=e=>e.slice(2,e.length).toLowerCase(),f={[e.ATTR_KEY]:!0,[e.ATTR_REF]:!0,void:!0},d={svg:!0,animate:!0,animateMotion:!0,animateTransform:!0,circle:!0,clipPath:!0,defs:!0,desc:!0,ellipse:!0,feBlend:!0,feColorMatrix:!0,feComponentTransfer:!0,feComposite:!0,feConvolveMatrix:!0,feDiffuseLighting:!0,feDisplacementMap:!0,feDistantLight:!0,feDropShadow:!0,feFlood:!0,feFuncA:!0,feFuncB:!0,feFuncG:!0,feFuncR:!0,feGaussianBlur:!0,feImage:!0,feMerge:!0,feMergeNode:!0,feMorphology:!0,feOffset:!0,fePointLight:!0,feSpecularLighting:!0,feSpotLight:!0,feTile:!0,feTurbulence:!0,filter:!0,foreignObject:!0,g:!0,image:!0,line:!0,linearGradient:!0,marker:!0,mask:!0,metadata:!0,mpath:!0,path:!0,pattern:!0,polygon:!0,polyline:!0,radialGradient:!0,rect:!0,stop:!0,switch:!0,symbol:!0,text:!0,textPath:!0,tspan:!0,use:!0,view:!0};let p=new Map,h=null;function m(t,n){(0,e.detectIsFunction)(t)?t(n):(0,e.detectIsMutableRef)(t)&&(t.current=n)}const b={value:!0,checked:!0},g={value:!0},v={selected:!0},y={};function E(e){const{tagName:t,element:n,attrName:o,value:r}=e,i={input:()=>(b[o]&&(n[o]=r),b),textarea:()=>(g[o]&&(n[o]=r),g),option:()=>(v[o]&&(n[o]=r),v)};return i[t]?i[t]():y}function T(e){let t=e;for(;t;)if(t=t.parent,i(t.instance)&&(t.nativeElement=s(t.instance)),t.nativeElement)return t;return t}const k={hight:[],normal:[],low1:[],low2:[]};let x=null,O=0,w=!1,S=null;class j{constructor(e){this.id=++j.nextTaskId,this.time=e.time,this.timeoutMs=e.timeoutMs,this.priority=e.priority,this.forceSync=e.forceSync,this.callback=e.callback}}function C(t){return!!t.length&&((S=t.shift()).callback(),S.forceSync?function(e){for(;e(););I(),S=null}(e.workLoop):(n=e.workLoop,x=n,w||(w=!0,M.postMessage(null))),!0);var n}function I(){Boolean(e.wipRootStore.get())||function(){const[t]=k.low2;return!!(t&&(0,e.getTime)()-t.time>t.timeoutMs)&&(C(k.low2),!0)}()||C(k.hight)||C(k.normal)||requestIdleCallback(()=>C(k.low1)||C(k.low2))}j.nextTaskId=0;let P=null,M=null;P=new MessageChannel,M=P.port2,P.port1.onmessage=function(){if(x){O=(0,e.getTime)()+10;try{x()?M.postMessage(null):(S=null,w=!1,x=null,I())}catch(e){throw M.postMessage(null),e}}else w=!1},e.platform.createNativeElement=function(t){return{[e.NodeType.TAG]:e=>{const t=e;var n;return n=t.name,Boolean(d[n])?document.createElementNS("http://www.w3.org/2000/svg",t.name):document.createElement(t.name)},[e.NodeType.TEXT]:e=>{const t=e;return document.createTextNode(t.value)},[e.NodeType.COMMENT]:e=>{const t=e;return document.createComment(t.value)}}[t.type](t)},e.platform.requestAnimationFrame=requestAnimationFrame.bind(void 0),e.platform.scheduleCallback=function(t,n){const{priority:o=e.TaskPriority.NORMAL,timeoutMs:r=0,forceSync:i=!1}=n||{},s=new j({time:(0,e.getTime)(),timeoutMs:r,priority:o,forceSync:i,callback:t});({[e.TaskPriority.HIGH]:()=>k.hight.push(s),[e.TaskPriority.NORMAL]:()=>k.normal.push(s),[e.TaskPriority.LOW]:()=>s.timeoutMs>0?k.low2.push(s):k.low1.push(s)})[s.priority](),I()},e.platform.shouldYeildToHost=(()=>(0,e.getTime)()>=O),e.platform.applyCommit=function(t){({[e.EffectTag.CREATE]:()=>{null!==t.nativeElement&&(h&&h(t.nativeElement),function(t){const n=T(t).nativeElement,o=n.childNodes;0===o.length||function(e,t){var n;let o=e;for(;o;){if((null===(n=null==o?void 0:o.parent)||void 0===n?void 0:n.nativeElement)===t)return o.idx;o=o.parent}return-1}(t,n)>o.length-1?(()=>{const{fragment:e}=p.get(n)||{fragment:document.createDocumentFragment(),callback:()=>{}};p.set(n,{fragment:e,callback:()=>{n.appendChild(e)}}),e.appendChild(t.nativeElement),t.markMountedToHost()})():(n.insertBefore(t.nativeElement,function(t,n){let o=null;return(0,e.walkFiber)({fiber:t,onLoop:({nextFiber:e,stop:t,resetIsDeepWalking:r})=>e.nativeElement&&e.nativeElement.parentElement===n?(o=e.nativeElement,t()):e.mountedToHost?void 0:r()}),o}(t,n)),t.markMountedToHost()),function(t,n){if(!(0,e.detectIsTagVirtualNode)(n))return;const o=Object.keys(n.attrs);for(const r of o){const o=n.attrs[r];r!==e.ATTR_REF?(0,e.detectIsFunction)(o)?c(r)&&a({target:t,handler:o,eventName:u(r)}):(0,e.detectIsUndefined)(o)||f[r]||!E({tagName:n.name,value:o,attrName:r,element:t})[r]&&t.setAttribute(r,o):m(o,t)}}(t.nativeElement,t.instance)}(t))},[e.EffectTag.UPDATE]:()=>{var n,o,r;null!==t.nativeElement&&(0,e.detectIsVirtualNode)(t.alternate.instance)&&(0,e.detectIsVirtualNode)(t.instance)&&(h&&h(t.nativeElement),n=t.nativeElement,o=t.alternate.instance,r=t.instance,(0,e.detectIsTextVirtualNode)(o)&&(0,e.detectIsTextVirtualNode)(r)&&o.value!==r.value?n.textContent=r.value:(0,e.detectIsTagVirtualNode)(o)&&(0,e.detectIsTagVirtualNode)(r)&&function(t,n,o){const r=new Set([...Object.keys(n.attrs),...Object.keys(o.attrs)]);for(const i of r){const r=n.attrs[i],s=o.attrs[i];i!==e.ATTR_REF?(0,e.detectIsUndefined)(s)?t.removeAttribute(i):(0,e.detectIsFunction)(r)?c(i)&&r!==s&&a({target:t,handler:s,eventName:u(i)}):f[i]||r===s||!E({tagName:o.name,value:s,attrName:i,element:t})[i]&&t.setAttribute(i,s):m(r,t)}}(n,o,r))},[e.EffectTag.DELETE]:()=>(function(t){const n=T(t);(0,e.walkFiber)({fiber:t,onLoop:({nextFiber:e,isReturn:o,resetIsDeepWalking:r,stop:s})=>e===t.nextSibling||e===t.parent?s():!o&&e.nativeElement?(!i(e.instance)&&n.nativeElement.removeChild(e.nativeElement),r()):void 0})})(t),[e.EffectTag.SKIP]:()=>{}})[t.effectTag]()},e.platform.finishCommitWork=function(){for(const{callback:e}of p.values())e();p=new Map},e.platform.detectIsPortal=i,e.platform.unmountPortal=function(e){const t=s(e.instance);t&&(t.innerHTML="")};const H=new Map;function N(t,n){if(!(n instanceof Element))throw new Error("[Dark]: render receives only Element as container!");const o=!(0,e.detectIsUndefined)(H.get(n));let r=null;o?r=H.get(n):(r=H.size,H.set(n,r),n.innerHTML=""),e.platform.scheduleCallback(()=>{e.rootStore.set(r);const i=e.currentRootStore.get(),s=new e.Fiber({nativeElement:n,instance:new e.TagVirtualNode({name:e.ROOT,children:(0,e.flatten)([t||(0,e.createEmptyVirtualNode)()])}),alternate:i,effectTag:o?e.EffectTag.UPDATE:e.EffectTag.CREATE});i&&(i.alternate=null),e.fiberMountStore.reset(),e.wipRootStore.set(s),e.nextUnitOfWorkStore.set(s)},{priority:e.TaskPriority.NORMAL,forceSync:e.isLayoutEffectsZone.get()})}function F(t,...n){return(0,e.useMemo)(()=>t.map((t,o)=>t+((0,e.detectIsUndefined)(n[o])?"":n[o])).join("").replace(/;\s*/gm,";").replace(/:\s*/gm,":").trim(),[t,...n])}const L="0.9.6"})(),r})())}]);
//# sourceMappingURL=build.js.map