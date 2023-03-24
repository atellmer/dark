(()=>{"use strict";const e="type",t="key",n="ref",o="flag";var r,i;!function(e){e[e.ANIMATION=3]="ANIMATION",e[e.HIGH=2]="HIGH",e[e.NORMAL=1]="NORMAL",e[e.LOW=0]="LOW"}(r||(r={})),function(e){e.HAS_NO_MOVES="HAS_NO_MOVES"}(i||(i={}));const l=e=>"function"==typeof e,s=e=>void 0===e,a=e=>"number"==typeof e,c=e=>"string"==typeof e,u=e=>"boolean"==typeof e,f=e=>Array.isArray(e),d=e=>null===e,p=e=>d(e)||s(e),h=()=>Date.now(),m=()=>{};function E(e){const t=[],n={0:{idx:0,source:e}};let o=0;do{const{source:e,idx:r}=n[o],i=e[r];r>=e.length?(o--,n[o]||(n[o]={idx:0,source:[]}),n[o].idx++):f(i)?(o++,n[o]={idx:0,source:i}):(t.push(i),n[o].idx++)}while(o>0||n[o].idx<n[o].source.length);return t}function g(e,t,n=!1){return e.reduce(((e,o)=>(e[t(o)]=!n||o,e)),{})}function v(e,t){if(!s(e)&&!s(t)&&e.length>0&&t.length>0)for(let n=0;n<t.length;n++)if(t[n]!==e[n])return!0;return!1}var b;!function(e){e.TAG="TAG",e.TEXT="TEXT",e.COMMENT="COMMENT"}(b||(b={}));const y=Symbol("virtual-node");class k{type=null;constructor(e){this.type=e}}class T extends k{name=null;attrs={};children=[];constructor(e,t,n){super(b.TAG),this.name=e||this.name,this.attrs=t||this.attrs,this.children=n||this.children}}class w extends k{value="";constructor(e){super(b.TEXT),this.value=e}}class C extends k{value="";constructor(e){super(b.COMMENT),this.value=e}}const x=e=>e instanceof k,H=e=>e instanceof T,M=e=>e instanceof w,S=e=>l(e)&&!0===e[y],A=()=>new C("dark:matter"),I=e=>M(e)||(e=>e instanceof C)(e);function $(n){const r=()=>{const{as:e,slot:t,_void:o=!1,...r}=n,i=o?[]:f(t)?t:t?[t]:[];return new T(e,r,i)};return r[y]=!0,r[t]=n.key,r[o]=n.flag,r[e]=n.as,r}function N(e){return new w(e+"")}N.from=e=>M(e)?e.value:e+"";const P=Symbol("component");class D{type;token;props;ref;displayName;children=[];shouldUpdate;constructor(e,t,n,o,r,i){this.type=e||null,this.token=t||P,this.props=n||null,this.ref=o||null,this.shouldUpdate=r||null,this.displayName=i||""}}function O(e,t={}){const{token:n,displayName:o,shouldUpdate:r,keepRef:i=!1}=t;return(t={},l)=>(!i&&t.ref&&delete t.ref,new D(e,n,t,l,r,o))}const L=e=>e instanceof D,R=Symbol("memo"),F=(e,t)=>{const n=Object.keys(t);for(const o of n)if("slot"!==o&&t[o]!==e[o])return!0;return!1},U=e=>L(e)&&e.token===R;function B(e,t=F){return O((t=>e(t)),{token:R,keepRef:!0,shouldUpdate:t})}let W=null;const Z=new Map;class K{wipRoot=null;currentRoot=null;nextUnitOfWork=null;events=new Map;unsubscribers=[];candidates=new Set;deletions=new Set;fiberMount={level:0,navigation:{},isDeepWalking:!0};componentFiber=null;effects=[];layoutEffects=[];insertionEffects=[];isLayoutEffectsZone=!1;isInserionEffectsZone=!1;isUpdateHookZone=!1;isBatchZone=!1;isHydrateZone=!1;isHot=!1;lazy=new Set}const G=e=>{W=e,!Z.get(W)&&Z.set(W,new K)},j=()=>W,q=(e=W)=>Z.get(e),V=()=>q()?.wipRoot||null,_=e=>q().wipRoot=e,z=e=>q(e)?.currentRoot||null,X=e=>q().nextUnitOfWork=e,Y=()=>q()?.componentFiber,J=e=>q().componentFiber=e,Q=e=>q().candidates.add(e),ee=e=>q().deletions.add(e),te=()=>{q().fiberMount={level:0,navigation:{},isDeepWalking:!0}},ne=()=>q().fiberMount.isDeepWalking,oe=e=>q().fiberMount.isDeepWalking=e,re={get:()=>q().effects,reset:()=>q().effects=[],add:e=>q().effects.push(e)},ie={get:()=>q().layoutEffects,reset:()=>q().layoutEffects=[],add:e=>q().layoutEffects.push(e)},le={get:()=>q().insertionEffects,reset:()=>q().insertionEffects=[],add:e=>q().insertionEffects.push(e)},se=()=>q()?.isLayoutEffectsZone||!1,ae=e=>q().isLayoutEffectsZone=e,ce=e=>q(e)?.isInserionEffectsZone||!1,ue=e=>q().isInserionEffectsZone=e,fe=()=>q()?.isUpdateHookZone||!1,de=e=>q().isUpdateHookZone=e,pe=()=>q()?.isHydrateZone||!1,he=e=>q().isHydrateZone=e,me=Symbol("use-effect"),{useEffect:Ee,hasEffects:ge,dropEffects:ve}=be(me,re);function be(e,t){return{useEffect:function(n,o){const r=Y().hook,{idx:i,values:a}=r,c=()=>{a[i]={deps:o,token:e,value:void 0},t.add((()=>{a[i].value=n()}))};if(s(a[i]))c();else{const{deps:e,value:t}=a[i];(!o||v(o,e))&&(l(t)&&t(),c())}r.idx++},hasEffects:function(t){const{values:n}=t.hook;return n.some((t=>t?.token===e))},dropEffects:function(t){const{values:n}=t;for(const t of n)if(t.token===e){const e=t.value;l(e)&&e()}}}}const ye=Symbol("fragment"),ke=O((({slot:e})=>e||null),{token:ye}),Te=O((({slot:e})=>e),{token:R});function we(e,t=!1){return function(e,t){const n=e=>S(e)||L(e);if(f(e)?n(e[0]):n(e)){const n=Te({slot:ke({slot:e})});return n.shouldUpdate=()=>t,n}return e}(e(),t)}function Ce(e,t){const n=Y(),{hook:o}=n,{idx:r,values:i}=o;if(s(i[r])){const n=we(e);return i[r]={deps:t,value:n},o.idx++,n}const l=i[r],a=v(t,l.deps),c=a?e:()=>l.value;return l.deps=t,l.value=we(c,a),o.idx++,l.value}const xe={createNativeElement:()=>{throw new Error(He("createNativeElement"))},requestAnimationFrame:()=>{throw new Error(He("requestAnimationFrame"))},cancelAnimationFrame:()=>{throw new Error(He("cancelAnimationFrame"))},scheduleCallback:()=>{throw new Error(He("scheduleCallback"))},shouldYeildToHost:()=>{throw new Error(He("shouldYeildToHost"))},applyCommit:()=>{throw new Error(He("applyCommit"))},finishCommitWork:()=>{throw new Error(He("finishCommitWork"))},detectIsDynamic:()=>{throw new Error(He("detectIsDynamic"))},detectIsPortal:()=>{throw new Error(He("detectIsPortal"))},unmountPortal:()=>{throw new Error(He("unmountPortal"))},restart:()=>{throw new Error(He("restart"))}},He=e=>`${e} not installed by renderer`;var Me;!function(e){e.CREATE="CREATE",e.UPDATE="UPDATE",e.DELETE="DELETE",e.SKIP="SKIP"}(Me||(Me={}));const Se=Symbol("use-layout-effect"),{useEffect:Ae,hasEffects:Ie,dropEffects:$e}=be(Se,ie),Ne=Symbol("use-insertion-effect"),{useEffect:Pe,hasEffects:De,dropEffects:Oe}=be(Ne,le);function Le(e,t){let n=e,o=!0,r=!1,i=!1;const l={},s=e=>!l[e],a=()=>o=!1,c=()=>i=!0;for(;n&&(t({nextFiber:n,isReturn:r,resetIsDeepWalking:a,stop:c}),!i);)if(n.child&&o&&s(n.child.id)){const e=n.child;r=!1,n=e,l[e.id]=!0}else if(n.nextSibling&&s(n.nextSibling.id)){const e=n.nextSibling;o=!0,r=!1,n=e,l[e.id]=!0}else if(n.parent&&n.parent===e&&n.parent.nextSibling&&s(n.parent.nextSibling.id)){const e=n.parent.nextSibling;o=!0,r=!1,n=e,l[e.id]=!0}else n.parent&&n.parent!==e?(o=!1,r=!0,n=n.parent):n=null}function Re(e){(e.insertionEffectHost||e.layoutEffectHost||e.effectHost||e.portalHost)&&Le(e,(({nextFiber:t,isReturn:n,stop:o})=>{if(t===e.nextSibling)return o();!n&&L(t.instance)&&(t.insertionEffectHost&&Oe(t.hook),t.layoutEffectHost&&$e(t.hook),t.effectHost&&ve(t.hook),t.portalHost&&xe.unmountPortal(t))}))}const Fe={[Me.CREATE]:!0};class Ue{id=0;nativeElement=null;parent=null;child=null;nextSibling=null;alternate=null;move=!1;effectTag=null;instance=null;hook=null;provider=null;effectHost=!1;layoutEffectHost=!1;insertionEffectHost=!1;portalHost=!1;childrenCount=0;childrenElementsCount=0;marker="";isUsed=!1;idx=0;elementIdx=0;batched=null;catchException;static nextId=0;constructor(e=null,t=null,n=0){this.id=++Ue.nextId,this.hook=e,this.provider=t,this.idx=n}mutate(e){const t=Object.keys(e);for(const n of t)this[n]=e[n];return this}markEffectHost(){this.effectHost=!0,this.parent&&!this.parent.effectHost&&this.parent.markEffectHost()}markLayoutEffectHost(){this.layoutEffectHost=!0,this.parent&&!this.parent.layoutEffectHost&&this.parent.markLayoutEffectHost()}markInsertionEffectHost(){this.insertionEffectHost=!0,this.parent&&!this.parent.insertionEffectHost&&this.parent.markInsertionEffectHost()}markPortalHost(){this.portalHost=!0,this.parent&&!this.parent.portalHost&&this.parent.markPortalHost()}incrementChildrenElementsCount(e=1,t=!1){!function(e,t=1,n=!1){if(!e.parent)return;const o=fe(),r=V(),i=o&&r.parent===e.parent;(I(e.instance)||H(e.instance)&&0===e.instance.children.length)&&(e.childrenElementsCount=1),o&&i&&!n||(e.parent.childrenElementsCount+=t,e.parent.nativeElement||e.parent.incrementChildrenElementsCount(t))}(this,e,t)}setError(e){l(this.catchException)?this.catchException(e):this.parent&&this.parent.setError(e)}}function Be(){const e=V();let t=q()?.nextUnitOfWork||null,n=!1,o=Boolean(t);const r={fiber$$:null,fiber$:null,instance$:null};for(;t&&!n;)t=We(t,r),X(t),o=Boolean(t),n=xe.shouldYeildToHost();return!t&&e&&function(){if(pe()&&q().lazy.size>0)return rt(null);const e=V(),t=xe.detectIsDynamic(),n=q().deletions,o=q().candidates,r=fe();for(const e of n)Re(e),xe.applyCommit(e);t&&(ue(!0),le.get().forEach((e=>e())),ue(!1)),r&&function(e){const t=e.childrenElementsCount-e.alternate.childrenElementsCount;if(0===t)return;const n=function(e){let t=e;for(;t&&(t=t.parent,!t||!t.nativeElement););return t}(e);let o=!1;e.incrementChildrenElementsCount(t,!0),Le(n.child,(({nextFiber:r,resetIsDeepWalking:i,isReturn:l,stop:s})=>r===n?s():r===e?(o=!0,i()):(r.nativeElement&&i(),void(o&&!l&&(r.elementIdx+=t)))))}(e);for(const e of o)xe.applyCommit(e),e.alternate=null;e.alternate=null,xe.finishCommitWork(),t&&(ae(!0),ie.get().forEach((e=>e())),ae(!1)),t&&function(){const e=re.get();e.length>0&&setTimeout((()=>e.forEach((e=>e()))))}(),rt(e)}(),o}function We(e,t){let n=!0,o=e,r=e.instance;for(;;){if(n=ne(),o.hook&&(o.hook.idx=0),n)if(tt(r)&&r.children.length>0){if(Ze(o,r,t),o=t.fiber$,r=t.instance$,t.fiber$$=null,t.fiber$=null,t.instance$=null,o)return o}else{Ke(o,r,t);const e=t.fiber$$;if(o=t.fiber$,r=t.instance$,t.fiber$$=null,t.fiber$=null,t.instance$=null,e)return e}else{Ke(o,r,t);const e=t.fiber$$;if(o=t.fiber$,r=t.instance$,t.fiber$$=null,t.fiber$=null,t.instance$=null,e)return e}if(null===o.parent)return null}}function Ze(e,t,n){(()=>{const{fiberMount:e}=q(),t=e.level+1;e.level=t,e.navigation[t]=0})();const o=e.alternate?e.alternate.child:null,r=new Ue(ot(o,o?o.instance:null,tt(t)?t.children[0]:null),o?o.provider:null,0);J(r),r.parent=e,e.child=r,r.elementIdx=e.nativeElement?0:e.elementIdx,t=ze(t,0,r),o&&Ve(o,t),Ge(r,o,t),o&&U(r.instance)&&_e(r,o,t),Q(r),n.fiber$$=null,n.fiber$=r,n.instance$=t}function Ke(e,t,n){(()=>{const{fiberMount:e}=q(),t=e.level,n=e.navigation[t]+1;e.navigation[t]=n})();const o=e.parent.instance,r=q().fiberMount.navigation[q().fiberMount.level];if(tt(o)&&o.children[r]){oe(!0);const i=e.alternate?e.alternate.nextSibling:null,l=new Ue(ot(i,i?i.instance:null,tt(o)?o.children[r]:null),i?i.provider:null,r);return J(l),l.parent=e.parent,e.nextSibling=l,l.elementIdx=e.elementIdx+(e.nativeElement?1:e.childrenElementsCount),t=ze(o,r,l),i&&Ve(i,t),Ge(l,i,t),i&&U(l.instance)&&_e(l,i,t),Q(l),n.fiber$$=l,n.fiber$=l,void(n.instance$=t)}(()=>{const{fiberMount:e}=q(),t=e.level,n=t-1;e.navigation[t]=0,e.level=n})(),oe(!1),t=(e=e.parent).instance,tt(e.instance)&&(e.instance.children=[]),n.fiber$$=null,n.fiber$=e,n.instance$=t}function Ge(e,t,n){let o=!1;if(Fe[e.parent.effectTag]&&(e.effectTag=e.parent.effectTag),e.effectTag!==Me.CREATE){const e=Boolean(t),r=(e?Je(t.instance):null)===(e?Je(n):null);o=e&&nt(t.instance,n)&&r}e.instance=n,e.alternate=t||null,e.nativeElement=o?t.nativeElement:null,e.effectTag=o?Me.UPDATE:Me.CREATE,t&&t.move&&(e.move=t.move,t.move=!1),tt(e.instance)&&(e.childrenCount=e.instance.children.length),!e.nativeElement&&x(e.instance)&&(e.nativeElement=xe.createNativeElement(e.instance),e.effectTag=Me.CREATE),e.nativeElement&&e.incrementChildrenElementsCount()}function je(e,t,n){return 0===e||t.child&&t.child.effectTag===Me.DELETE?(t.child=n,n.parent=t):(t.nextSibling=n,n.parent=t.parent),n}function qe(e,t){return(new Ue).mutate({effectTag:Me.CREATE,instance:A(),parent:e,marker:t+""})}function Ve(e,t){const n=nt(e.instance,t),r=function(e){return L(e)?(e=>e.props[o]||null)(e):S(e)?e[o]||null:H(e)?e.attrs[o]||null:null}(t),l=r&&r[i.HAS_NO_MOVES];if(e.isUsed=!0,n){if(tt(e.instance)&&tt(t)&&(!l||e.childrenCount!==t.children.length)){const{prevKeys:n,nextKeys:o,prevKeysMap:r,nextKeysMap:i,keyedFibersMap:l}=function(e,t){let n=e,o=0;const r=[],i=[],l={},s={},a={};for(;n||o<t.length;){if(n){const e=Je(n.instance),t=p(e)?Ye(o):e;r.push(t),l[t]=!0,a[t]=n}if(t[o]){const e=Je(t[o]),n=p(e)?Ye(o):e;i.push(n),s[n]=!0}n=n?n.nextSibling:null,o++}return{prevKeys:r,nextKeys:i,prevKeysMap:l,nextKeysMap:s,keyedFibersMap:a}}(e.child,t.children);let s=[],a=Math.max(n.length,o.length),c=e,u=0,f=0,d=0;for(let t=0;t<a;t++){const s=o[t-d]??null,p=n[t-f]??null,h=l[p]||null,m=l[s]||qe(e,s);s!==p?null===s||r[s]?i[p]?i[p]&&i[s]&&(m.effectTag=Me.UPDATE,h.effectTag=Me.UPDATE,m.move=!0,c=je(t,c,m)):(h.effectTag=Me.DELETE,ee(h),d++,u--,a++):(null===p||i[p]?(m.effectTag=Me.CREATE,f++,a++):(m.effectTag=Me.CREATE,h.effectTag=Me.DELETE,ee(h)),c=je(t,c,m)):null!==s&&(m.effectTag=Me.UPDATE,c=je(t,c,m)),m.idx=u,u++}s=[]}}else(function(e){let t=e.parent;for(;t;){if(t.effectTag===Me.DELETE)return!1;t=t.parent}return!0})(e)&&(e.effectTag=Me.DELETE,ee(e))}function _e(e,t,n){const o=t.instance,r=n;if(e.move||r.type!==o.type||r.shouldUpdate(o.props,r.props))return;oe(!1),e.effectTag=Me.SKIP,e.alternate=t,e.nativeElement=t.nativeElement,e.child=t.child,e.hook=t.hook,e.provider=t.provider,e.childrenCount=t.childrenCount,e.childrenElementsCount=t.childrenElementsCount,e.catchException=t.catchException;const i=e.elementIdx-t.elementIdx,l=0!==i;Le(e.child,(({nextFiber:n,stop:o})=>{if(n===e.nextSibling||n===e.parent)return o();if(n.parent===t&&(n.parent=e),l){if(n.elementIdx+=i,n.parent!==e&&n.nativeElement)return o()}else if(n===t.child.child)return o()})),e.incrementChildrenElementsCount(t.childrenElementsCount),t.effectHost&&e.markEffectHost(),t.layoutEffectHost&&e.markLayoutEffectHost(),t.insertionEffectHost&&e.markInsertionEffectHost(),t.portalHost&&e.markPortalHost()}function ze(e,t,n){let o=null;return tt(e)&&(f(e.children[t])&&e.children.splice(t,1,...E(e.children[t])),o=Xe(n,e.children[t]),L(o)&&(ge(n)&&n.markEffectHost(),Ie(n)&&n.markLayoutEffectHost(),De(n)&&n.markInsertionEffectHost(),xe.detectIsPortal(o)&&n.markPortalHost())),o}function Xe(e,t){const n=L(t),o=t;if(n)try{let e=o.type(o.props,o.ref);f(e)&&!(e=>L(e)&&e.token===ye)(o)?e=ke({slot:e}):(c(e)||a(e))&&(e=N(e)),o.children=f(e)?E(e):[e]}catch(t){o.children=[],e.setError(t),function(...e){!s(console)&&console.error(...e)}(t)}else S(t)&&(t=t());if(tt(t)){t.children=n?t.children:f(t.children)?E(t.children):[t.children];for(let e=0;e<t.children.length;e++)t.children[e]||(t.children[e]=Qe(t.children[e]));n&&0===o.children.length&&o.children.push(A())}return t}function Ye(e){return`dark:idx:${e}`}function Je(e){var n,o;return L(e)?(e=>p(e.props[t])?null:e.props[t])(e):S(e)?p((o=e)[t])?null:o[t]:H(e)?p((n=e).attrs[t])?null:n.attrs[t]:null}function Qe(e){return d(t=e)||s(t)||!1===t?A():e;var t}function et(t){return S(t)?t[e]:H(t)?t.name:x(t)||L(t)?t.type:null}function tt(e){return H(e)||L(e)}function nt(e,t,n=!1){if(n){const n=t;return e.type===n.type}return et(e)===et(t)}function ot(e,t,n){return e&&function(e,t){return!!(e&&t&&L(e)&&L(t)&&nt(e,t,!0))&&Je(e)===Je(t)}(t,n)?e.hook:L(n)?{idx:0,values:[]}:null}function rt(e){var t;_(null),q().candidates=new Set,q().deletions=new Set,le.reset(),ie.reset(),re.reset(),fe()?de(!1):(t=e,q().currentRoot=t)}function it(e){const t=j(),n=Ce((()=>({fiber:null})),[]);return n.fiber=Y(),o=>{if(ce())return;const r=function(e){const{rootId:t,fiber:n,forceStart:o=!1,onStart:r}=e;return()=>{n.effectTag!==Me.DELETE&&(o&&r(),n.isUsed||(!o&&r(),G(t),de(!0),te(),n.alternate=(new Ue).mutate(n),n.marker="🔥",n.effectTag=Me.UPDATE,n.childrenElementsCount=0,n.child=null,_(n),J(n),n.instance=Xe(n,n.instance),X(n)))}}({rootId:t,fiber:n.fiber,forceStart:Boolean(e?.timeoutMs),onStart:o||m});se()&&(e={...e||{},forceSync:!0}),q()?.isBatchZone?function(e,t){e.batched&&clearTimeout(e.batched),e.batched=setTimeout((()=>{var n;n=!1,q().isBatchZone=n,e.batched=null,t()}))}(n.fiber,(()=>xe.scheduleCallback(r,e))):xe.scheduleCallback(r,e)}}function lt(e){const{defaultValue:t}=e,n=Y(),o=Ce((()=>function(e,t){let n=t;for(;n;){if(n.provider&&n.provider.get(e))return n.provider.get(e);n=n.parent}return null}(e,n)),[]),r=o?o.value:t,i=it(),l=Ce((()=>({value:r})),[]),s=Boolean(o);return Ee((()=>{if(!s)return;const e=o.subscribe((e=>{Object.is(l.value,e)||i()}));return()=>e()}),[s]),l.value=r,r}function st(e,t){return Ce((()=>e),t)}const at=O((e=>{const{list:t,getKey:n,slot:o}=e,r=Ce((()=>({list:t,subscribers:new Set})),[]),i=Ce((()=>({value:g(t,(e=>n(e)),!0)})),[t,n]),l=Ce((()=>{if(r.list.length!==t.length)return!1;let e=0;for(const o of t){if(n(o)!==n(r.list[e]))return!1;e++}return!0}),[t]);Ce((()=>{r.list=[...t]}),[t]),Ee((()=>{l&&r.subscribers.forEach((e=>e(i.value)))}),[t]);const s=st((e=>(r.subscribers.add(e),()=>r.subscribers.delete(e))),[]),a=Ce((()=>({subscribe:s,map:i.value})),[]);return a.map=i.value,ut.Provider({value:a,slot:ct({canSplit:l,slot:o})})})),ct=B(O((({slot:e})=>e)),((e,t)=>!1===t.canSplit)),ut=function(e,t){const{displayName:n="Context"}={},o={displayName:n,defaultValue:null,Provider:null,Consumer:null};return o.Provider=function(e,t,n){return O((({value:t=null,slot:n})=>{const o=Y();if(!o.provider){const n={value:t,subscribers:new Set,subscribe:e=>(n.subscribers.add(e),()=>n.subscribers.delete(e))};o.provider=new Map,o.provider.set(e,n)}const r=o.provider.get(e);return Ee((()=>{r.subscribers.forEach((e=>e(t)))}),[t]),r.value=t,n}),{displayName:`${n}.Provider`})}(o,0,n),o.Consumer=function(e,t){return O((({slot:t})=>{const n=lt(e);return l(t)?t(n):null}),{displayName:`${t}.Consumer`})}(o,n),o}();function ft(e){return(e=e.map((e=>c(e)||a(e)?N(e.toString()):e)))?Array.isArray(e)?[...e]:[e]:[]}function dt(e,t,...n){if(c(e))return $({...t,as:e,slot:ft(n)});if(l(e)){let o=ft(n);return o=1===o.length?o[0]:o,e({...t,slot:o})}return null}const pt=Symbol("portal");O((({slot:e,...t})=>(Ce((()=>t[pt].innerHTML=""),[]),e)),{token:pt});const ht=e=>L(e)&&e.token===pt,mt=e=>ht(e)?e.props[pt]:null;function Et(e){const t=mt(e.instance);t&&(t.innerHTML="")}class gt{type="";sourceEvent=null;target=null;propagation=!0;constructor(e){this.type=e.sourceEvent.type,this.sourceEvent=e.sourceEvent,this.target=e.target}stopPropagation(){this.propagation=!1,this.sourceEvent.stopPropagation()}preventDefault(){this.sourceEvent.preventDefault()}getPropagation(){return this.propagation}}function vt(e){const{target:t,eventName:n,handler:o}=e,r=q().events,i=r.get(n);if(i)i.set(t,o);else{const e=e=>{const t=r.get(n).get(e.target),o=e.target;let i=null;l(t)&&(i=new gt({sourceEvent:e,target:o}),t(i)),(i?i.getPropagation():o.parentElement)&&o.parentElement.dispatchEvent(new e.constructor(e.type,e))};r.set(n,new WeakMap([[t,o]])),document.addEventListener(n,e,!0),s=()=>document.removeEventListener(n,e,!0),q().unsubscribers.push(s)}var s}const bt=e=>e.startsWith("on"),yt=e=>e.slice(2,e.length).toLowerCase(),kt={[t]:!0,[n]:!0,[o]:!0},Tt={transform:!0,fill:!0};let wt=[];const Ct=g("svg,animate,animateMotion,animateTransform,circle,clipPath,defs,desc,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,image,line,linearGradient,marker,mask,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,stop,switch,symbol,text,textPath,tspan,use,view".split(","),(e=>e)),xt=g("area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr".split(","),(e=>e)),Ht={[b.TAG]:e=>{const t=e;return n=t.name,Boolean(Ct[n])?document.createElementNS("http://www.w3.org/2000/svg",t.name):document.createElement(t.name);var n},[b.TEXT]:e=>document.createTextNode(e.value),[b.COMMENT]:e=>document.createComment(e.value)};function Mt(e){return Ht[e.type](e)}function St(e,t){!function(e,t){l(e)?e(t):function(e){if("object"!=typeof e||d(e))return!1;const t=e;for(const e in t)if("current"===e&&t.hasOwnProperty(e))return!0;return!1}(e)&&(e.current=t)}(e,t)}function At(e){const{tagName:t,element:n,attrName:o,attrValue:r}=e,i=It[t];let l=!!i&&i(n,o,r);var s,a;return a=o,(s=Object.getPrototypeOf(n)).hasOwnProperty(a)&&Boolean(Object.getOwnPropertyDescriptor(s,a)?.set)&&(n[o]=r),!l&&u(r)&&(l=!o.includes("-")),l}const It={input:(e,t,n)=>("value"===t&&u(n)?e.checked=n:"autoFocus"===t&&(e.autofocus=Boolean(n)),!1),textarea:(e,t,n)=>"value"===t&&(e.innerHTML=String(n),!0)};function $t(e){let t=e;for(;t;)if(t=t.parent,ht(t.instance)&&(t.nativeElement=mt(t.instance)),t.nativeElement)return t;return t}const Nt={[Me.CREATE]:e=>{null!==e.nativeElement&&function(e){const t=$t(e),o=t.nativeElement,r=o.childNodes;if(pe()){const t=r[e.elementIdx];M(e.instance)&&t instanceof Text&&e.instance.value.length!==t.length&&t.splitText(e.instance.value.length),e.nativeElement=t}else 0===r.length||e.elementIdx>r.length-1?(i=t.instance.name,!Boolean(xt[i])&&function(e,t){t.appendChild(e.nativeElement)}(e,o)):function(e,t){t.insertBefore(e.nativeElement,t.childNodes[e.elementIdx])}(e,o);var i;H(e.instance)&&function(e,t){const o=Object.keys(t.attrs),r=e;for(const i of o){const o=t.attrs[i];i!==n?l(o)?bt(i)&&vt({target:r,handler:o,eventName:yt(i)}):s(o)||kt[i]||!At({tagName:t.name,element:r,attrValue:o,attrName:i})&&r.setAttribute(i,o):St(o,e)}}(e.nativeElement,e.instance)}(e)},[Me.UPDATE]:e=>{e.move&&(function(e){const t=function(e){const t=[];return Le(e,(({nextFiber:n,isReturn:o,resetIsDeepWalking:r,stop:i})=>n===e.nextSibling||n===e.parent?i():!o&&n.nativeElement?(!ht(n.instance)&&t.push(n.nativeElement),r()):void 0)),t}(e),n=t[0].parentElement,o=new DocumentFragment,r=e.elementIdx;let i=0;for(const e of t)n.insertBefore(document.createComment(`${r}:${i}`),e),o.appendChild(e),i++;wt.push((()=>{for(let e=1;e<t.length;e++)n.removeChild(n.childNodes[r+1]);n.replaceChild(o,n.childNodes[r])}))}(e),e.move=!1),null===e.nativeElement||L(e.instance)||function(e){const t=e.nativeElement,o=e.alternate.instance,r=e.instance;I(o)&&I(r)?o.value!==r.value&&(t.textContent=r.value):function(e,t,o){const r=Object.keys(o.attrs),i=e;for(const a of r){const r=t.attrs[a],c=o.attrs[a];a!==n?s(c)?i.removeAttribute(a):l(r)?bt(a)&&r!==c&&vt({target:i,handler:c,eventName:yt(a)}):kt[a]||r===c||(Tt[a]||!At({tagName:o.name,element:i,attrValue:c,attrName:a}))&&i.setAttribute(a,c):St(r,e)}}(t,o,r)}(e)},[Me.DELETE]:e=>function(e){const t=$t(e);Le(e,(({nextFiber:n,isReturn:o,resetIsDeepWalking:r,stop:i})=>n===e.nextSibling||n===e.parent?i():!o&&n.nativeElement?(!ht(n.instance)&&t.nativeElement.removeChild(n.nativeElement),r()):void 0))}(e),[Me.SKIP]:()=>{}};function Pt(e){Nt[e.effectTag](e)}function Dt(){for(const e of wt)e();wt=[],he(!1)}const Ot={animations:[],hight:[],normal:[],low1:[],low2:[]};let Lt=null,Rt=0,Ft=!1,Ut=null;class Bt{static nextTaskId=0;id;time;timeoutMs;priority;forceSync;callback;constructor(e){this.id=++Bt.nextTaskId,this.time=e.time,this.timeoutMs=e.timeoutMs,this.priority=e.priority,this.forceSync=e.forceSync,this.callback=e.callback}}const Wt=()=>h()>=Rt;function Zt(e,t){const{priority:n=r.NORMAL,timeoutMs:o=0,forceSync:i=!1}=t||{},l=new Bt({time:h(),timeoutMs:o,priority:n,forceSync:i,callback:e});({[r.ANIMATION]:()=>Ot.animations.push(l),[r.HIGH]:()=>Ot.hight.push(l),[r.NORMAL]:()=>Ot.normal.push(l),[r.LOW]:()=>l.timeoutMs>0?Ot.low2.push(l):Ot.low1.push(l)})[l.priority](),Gt()}function Kt(e){if(!e.length)return!1;Ut=e.shift();const t=Ut.priority===r.ANIMATION;return Ut.callback(),Ut.forceSync||t?function(e){for(;e(););Gt(),Ut=null}(Be):(Lt=Be,Ft||(Ft=!0,qt.postMessage(null))),!0}function Gt(){Boolean(V())||function(){const[e]=Ot.low2;return!!(e&&h()-e.time>e.timeoutMs)&&(Kt(Ot.low2),!0)}()||(Ot.low1.length>1e5&&(Ot.low1=[]),0)||Kt(Ot.animations)||Kt(Ot.hight)||Kt(Ot.normal)||requestIdleCallback((()=>Kt(Ot.low1)||Kt(Ot.low2)))}let jt=null,qt=null;jt=new MessageChannel,qt=jt.port2,jt.port1.onmessage=function(){if(Lt){Rt=h()+4;try{Lt()?qt.postMessage(null):(Ut=null,Ft=!1,Lt=null,Gt())}catch(e){throw qt.postMessage(null),e}}else Ft=!1};let Vt=!1;const _t=new Map;const zt=(e={})=>$({...e,as:"button"}),Xt=(()=>{let e,t;return{start:n=>{e=performance.now(),t=n},stop:()=>{const n=t;t&&setTimeout((()=>{t=null;const o=performance.now()-e;console.log(`${n}: ${o}`)}))}}})();let Yt=0;const Jt=(e,t="")=>Array(e).fill(0).map((()=>({id:++Yt,name:`item: ${Yt} ${t}`,selected:!1}))),Qt={list:[]},en=B(O((({onCreate:e,onPrepend:t,onAppend:n,onInsertDifferent:o,onUpdateAll:r,onSwap:i,onClear:l})=>((e={})=>$({...e,as:"div"}))({style:"width: 100%; height: 64px; background-color: blueviolet; display: flex; align-items: center; padding: 16px;",slot:[zt({slot:N("create 10000 rows"),onClick:e}),zt({slot:N("Prepend 1000 rows"),onClick:t}),zt({slot:N("Append 1000 rows"),onClick:n}),zt({slot:N("insert different"),onClick:o}),zt({slot:N("update every 10th row"),onClick:r}),zt({slot:N("swap rows"),onClick:i}),zt({slot:N("clear rows"),onClick:l}),zt({slot:N("unmount app"),onClick:()=>{ln.unmount()}})]})))),tn=B(O((({id:e,onRemove:t,onHighlight:n})=>{const{name:o,selected:r}=function(e,t){const{subscribe:n,map:o}=lt(ut),r=it({forceSync:!0}),i=e(o),l=t(i),s=Ce((()=>({detectedChange:l})),[]);return Ee((()=>{const o=n((n=>{const o=t(e(n));Object.is(s.detectedChange,o)||r(),s.detectedChange=o}));return()=>o()}),[]),s.detectedChange=l,i}((t=>t[e]),(e=>`${e.name}:${e.selected}`)),i=st((()=>t(e)),[]),l=st((()=>n(e)),[]);return dt("tr",{class:r?"selected":void 0},dt("td",{class:"cell"},o),dt("td",{class:"cell"},"qqq"),dt("td",{class:"cell"},"xxx"),dt("td",{class:"cell"},dt("button",{onClick:i},"remove"),dt("button",{onClick:l},"highlight")))}))),nn=B(O((({items:e,onRemove:t,onHighlight:n})=>dt("table",{class:"table"},dt("tbody",null,e.map((e=>dt(tn,{key:e.id,id:e.id,onRemove:t,onHighlight:n})))))))),on=O((()=>{const e=it({forceSync:!0}),t=st((()=>{Qt.list=Jt(1e4),Xt.start("create"),e(),Xt.stop()}),[]),n=st((()=>{Qt.list.unshift(...Jt(1e3,"!!!")),Qt.list=[...Qt.list],Xt.start("prepend"),e(),Xt.stop()}),[]),o=st((()=>{Qt.list.push(...Jt(1e3,"!!!")),Qt.list=[...Qt.list],Xt.start("append"),e(),Xt.stop()}),[]),r=st((()=>{const[t,n,o,...r]=Qt.list;Qt.list=[...Jt(5,"***"),t,n,o,...Jt(2,"***"),...r].filter(Boolean),Xt.start("insert different"),e(),Xt.stop()}),[]),i=st((()=>{Qt.list=Qt.list.map(((e,t)=>({...e,name:(t+1)%10==0?e.name+"!!!":e.name}))),Xt.start("update every 10th"),e(),Xt.stop()}),[]),l=st((t=>{Qt.list=Qt.list.filter((e=>e.id!==t)),Xt.start("remove"),e(),Xt.stop()}),[]),s=st((t=>{const n=Qt.list.findIndex((e=>e.id===t));Qt.list[n].selected=!Qt.list[n].selected,Qt.list=[...Qt.list],Xt.start("highlight"),e(),Xt.stop()}),[]),a=st((()=>{if(0===Qt.list.length)return;const t=Qt.list[1];Qt.list[1]=Qt.list[Qt.list.length-2],Qt.list[Qt.list.length-2]=t,Qt.list=[...Qt.list],Xt.start("swap"),e(),Xt.stop()}),[]),c=st((()=>{Qt.list=[],Xt.start("clear"),e(),Xt.stop()}),[]);return dt(ke,null,dt(en,{onCreate:t,onPrepend:n,onAppend:o,onInsertDifferent:r,onUpdateAll:i,onSwap:a,onClear:c}),dt(at,{list:Qt.list,getKey:rn},dt(nn,{items:Qt.list,onRemove:l,onHighlight:s})))})),rn=e=>e.id,ln=(sn=document.getElementById("root"),{render:e=>function(e,t,n=!1){if(!Vt&&function(){xe.createNativeElement=Mt,xe.requestAnimationFrame=requestAnimationFrame.bind(this),xe.cancelAnimationFrame=cancelAnimationFrame.bind(this),xe.scheduleCallback=Zt,xe.shouldYeildToHost=Wt,xe.applyCommit=Pt,xe.finishCommitWork=Dt,xe.detectIsDynamic=()=>!0,xe.detectIsPortal=ht,xe.unmountPortal=Et,xe.restart=()=>{},Vt=!0}(),!(t instanceof Element))throw new Error("[Dark]: render receives only Element as container!");const o=!s(_t.get(t));let i=null;o?i=_t.get(t):(i=_t.size,_t.set(t,i),n||(t.innerHTML="")),ce(i)||xe.scheduleCallback((()=>{G(i);const o=z(),r=Boolean(o),l=(new Ue).mutate({nativeElement:t,instance:new T("root",{},E([e||A()])),alternate:o,effectTag:r?Me.UPDATE:Me.CREATE});te(),_(l),he(n),X(l)}),{priority:r.NORMAL,forceSync:n||se()})}(e,sn),unmount:()=>function(e){!function(t,n){s(t)||(Re(z(t)),q(t).unsubscribers.forEach((e=>e())),(e=>{Z.delete(e)})(t),_t.delete(e),e.innerHTML="")}(_t.get(e))}(sn)});var sn;ln.render(dt(on,null))})();
//# sourceMappingURL=build.js.map