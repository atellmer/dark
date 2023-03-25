(()=>{"use strict";const e=!1,t="dark:idx",n="type",o="key",r="ref",s="flag";var i,l;!function(e){e[e.ANIMATION=3]="ANIMATION",e[e.HIGH=2]="HIGH",e[e.NORMAL=1]="NORMAL",e[e.LOW=0]="LOW"}(i||(i={})),function(e){e.HAS_NO_MOVES="HAS_NO_MOVES"}(l||(l={}));const a=e=>"function"==typeof e,c=e=>void 0===e,u=e=>"number"==typeof e,f=e=>"string"==typeof e,d=e=>"object"==typeof e,p=e=>"boolean"==typeof e,h=e=>Array.isArray(e),m=e=>null===e,g=e=>m(e)||c(e),E=e=>m(e)||c(e)||!1===e,v=()=>Date.now(),b=()=>{};function y(...e){!c(console)&&console.error(...e)}function k(e){const t=[],n={0:{idx:0,source:e}};let o=0;do{const{source:e,idx:r}=n[o],s=e[r];r>=e.length?(o--,n[o]||(n[o]={idx:0,source:[]}),n[o].idx++):h(s)?(o++,n[o]={idx:0,source:s}):(t.push(s),n[o].idx++)}while(o>0||n[o].idx<n[o].source.length);return t}function T(e,t,n=!1){return e.reduce(((e,o)=>(e[t(o)]=!n||o,e)),{})}function w(e,t){if(e&&t&&e.length>0&&t.length>0)for(let n=0;n<t.length;n++)if(t[n]!==e[n])return!0;return!1}var C;!function(e){e.TAG="TAG",e.TEXT="TEXT",e.COMMENT="COMMENT"}(C||(C={}));const x=Symbol("virtual-node");class H{type=null;constructor(e){this.type=e}}class S extends H{name=null;attrs={};children=[];constructor(e,t,n){super(C.TAG),this.name=e||this.name,this.attrs=t||this.attrs,this.children=n||this.children}}class M extends H{value="";constructor(e){super(C.TEXT),this.value=e}}class A extends H{value="";constructor(e){super(C.COMMENT),this.value=e}}const I=e=>e instanceof H,$=e=>e instanceof S,N=e=>e instanceof M,P=e=>a(e)&&!0===e[x],D=e=>g(e.attrs[o])?null:e.attrs[o],L=e=>e.attrs[s]||null,O=e=>g(e[o])?null:e[o],R=e=>e[s]||null,U=()=>new A("dark:matter"),F=e=>N(e)||(e=>e instanceof A)(e);function W(e){const t=()=>{const{as:t,slot:n,_void:o=!1,...r}=e,s=o?[]:h(n)?n:n?[n]:[];return new S(t,r,s)};return t[x]=!0,t[o]=e.key,t[s]=e.flag,t[n]=e.as,t}function B(e){return new M(e+"")}B.from=e=>N(e)?e.value:e+"";const j=Symbol("component");class K{type;token;props;ref;displayName;children=[];shouldUpdate;constructor(e,t,n,o,r,s){this.type=e||null,this.token=t||j,this.props=n||null,this.ref=o||null,this.shouldUpdate=r||null,this.displayName=s||""}}function Z(t,n={}){const{token:o,displayName:r,shouldUpdate:s,keepRef:i=!1}=n;return(n={},l)=>(!i&&n.ref&&(delete n.ref,e&&y("[Dark]: To use ref you need to wrap the component with forwardRef!")),new K(t,o,n,l,s,r))}const G=e=>e instanceof K,q=e=>g(e.props[o])?null:e.props[o],V=e=>e.props[s]||null,_=Symbol("memo"),z=(e,t)=>{const n=Object.keys(t);for(const o of n)if("slot"!==o&&t[o]!==e[o])return!0;return!1},X=e=>G(e)&&e.token===_;function Y(e,t=z){return Z(e,{token:_,keepRef:!0,shouldUpdate:t})}let J=null;const Q=new Map;class ee{wipRoot=null;currentRoot=null;nextUnitOfWork=null;events=new Map;unsubscribers=[];candidates=new Set;deletions=new Set;fiberMount={level:0,navigation:{},isDeepWalking:!0};componentFiber=null;effects=[];layoutEffects=[];insertionEffects=[];isLayoutEffectsZone=!1;isInserionEffectsZone=!1;isUpdateHookZone=!1;isBatchZone=!1;isHydrateZone=!1;isHot=!1;lazy=new Set}const te={set:e=>{J=e,!Q.get(J)&&Q.set(J,new ee)},remove:e=>Q.delete(e)},ne=()=>J,oe=(e=J)=>Q.get(e),re={get:()=>oe()?.wipRoot||null,set:e=>oe().wipRoot=e},se={get:e=>oe(e)?.currentRoot||null,set:e=>oe().currentRoot=e},ie={get:()=>oe()?.nextUnitOfWork||null,set:e=>oe().nextUnitOfWork=e},le={get:()=>oe()?.componentFiber,set:e=>oe().componentFiber=e},ae={get:()=>oe().events,addUnsubscriber:e=>oe().unsubscribers.push(e),unsubscribe:e=>oe(e).unsubscribers.forEach((e=>e()))},ce={get:()=>oe().candidates,add:e=>oe().candidates.add(e),reset:()=>oe().candidates=new Set},ue={get:()=>oe().deletions,add:e=>oe().deletions.add(e),has:e=>oe().deletions.has(e),set:e=>oe().deletions=e,reset:()=>oe().deletions=new Set},fe={reset:()=>{oe().fiberMount={level:0,navigation:{},isDeepWalking:!0}},getIndex:()=>{const{fiberMount:e}=oe();return e.navigation[e.level]},jumpToChild:()=>{const{fiberMount:e}=oe();e.level=e.level+1,e.navigation[e.level]=0},jumpToParent:()=>{const{fiberMount:e}=oe();e.navigation[e.level]=0,e.level=e.level-1},jumpToSibling:()=>{const{fiberMount:e}=oe();e.navigation[e.level]=e.navigation[e.level]+1},deepWalking:{get:()=>oe().fiberMount.isDeepWalking,set:e=>oe().fiberMount.isDeepWalking=e}},de={get:()=>oe().effects,reset:()=>oe().effects=[],add:e=>oe().effects.push(e)},pe={get:()=>oe().layoutEffects,reset:()=>oe().layoutEffects=[],add:e=>oe().layoutEffects.push(e)},he={get:()=>oe().insertionEffects,reset:()=>oe().insertionEffects=[],add:e=>oe().insertionEffects.push(e)},me={get:()=>oe()?.isLayoutEffectsZone||!1,set:e=>oe().isLayoutEffectsZone=e},ge={get:e=>oe(e)?.isInserionEffectsZone||!1,set:e=>oe().isInserionEffectsZone=e},Ee={get:()=>oe()?.isUpdateHookZone||!1,set:e=>oe().isUpdateHookZone=e},ve={get:()=>oe()?.isBatchZone||!1,set:e=>oe().isBatchZone=e},be={get:()=>oe()?.isHydrateZone||!1,set:e=>oe().isHydrateZone=e},ye={get:()=>oe()?.isHot||!1,set:e=>oe().isHot=e},ke=()=>oe().lazy.size>0,Te=Symbol("use-effect"),{useEffect:we,hasEffects:Ce,dropEffects:xe}=He(Te,de);function He(e,t){return{useEffect:function(n,o){const r=le.get().hook,{idx:s,values:i}=r,l=()=>{i[s]={deps:o,token:e,value:void 0},t.add((()=>{i[s].value=n()}))};if(c(i[s]))l();else{const{deps:e,value:t}=i[s];(!o||w(o,e))&&(a(t)&&t(),l())}r.idx++},hasEffects:function(t){const{values:n}=t.hook;return n.some((t=>t?.token===e))},dropEffects:function(t){const{values:n}=t;for(const t of n)if(t.token===e){const e=t.value;a(e)&&e()}}}}const Se=Symbol("fragment"),Me=Z((({slot:e})=>e||null),{token:Se}),Ae=e=>G(e)&&e.token===Se,Ie=Z((({slot:e})=>e),{token:_});function $e(e){return P(e)||G(e)}function Ne(e,t=!1){return function(e,t){if(h(e)?$e(e[0]):$e(e)){const n=Ie({slot:Me({slot:e})});return n.shouldUpdate=()=>t,n}return e}(e(),t)}function Pe(e,t){const n=le.get(),{hook:o}=n,{idx:r,values:s}=o;if(c(s[r])){const n=Ne(e);return s[r]={deps:t,value:n},o.idx++,n}const i=s[r],l=w(t,i.deps),a=l?e:()=>i.value;return i.deps=t,i.value=Ne(a,l),o.idx++,i.value}const De={createNativeElement:()=>{throw new Error(Le("createNativeElement"))},requestAnimationFrame:()=>{throw new Error(Le("requestAnimationFrame"))},cancelAnimationFrame:()=>{throw new Error(Le("cancelAnimationFrame"))},scheduleCallback:()=>{throw new Error(Le("scheduleCallback"))},shouldYeildToHost:()=>{throw new Error(Le("shouldYeildToHost"))},applyCommit:()=>{throw new Error(Le("applyCommit"))},finishCommitWork:()=>{throw new Error(Le("finishCommitWork"))},detectIsDynamic:()=>{throw new Error(Le("detectIsDynamic"))},detectIsPortal:()=>{throw new Error(Le("detectIsPortal"))},unmountPortal:()=>{throw new Error(Le("unmountPortal"))},restart:()=>{throw new Error(Le("restart"))}},Le=e=>`${e} not installed by renderer`;var Oe;!function(e){e.CREATE="CREATE",e.UPDATE="UPDATE",e.DELETE="DELETE",e.SKIP="SKIP"}(Oe||(Oe={}));const Re=Symbol("use-layout-effect"),{useEffect:Ue,hasEffects:Fe,dropEffects:We}=He(Re,pe),Be=Symbol("use-insertion-effect"),{useEffect:je,hasEffects:Ke,dropEffects:Ze}=He(Be,he);function Ge(e,t){let n=e,o=!0,r=!1,s=!1;const i={},l=e=>!i[e],a=()=>o=!1,c=()=>s=!0;for(;n&&(t({nextFiber:n,isReturn:r,resetIsDeepWalking:a,stop:c}),!s);)if(n.child&&o&&l(n.child.id)){const e=n.child;r=!1,n=e,i[e.id]=!0}else if(n.nextSibling&&l(n.nextSibling.id)){const e=n.nextSibling;o=!0,r=!1,n=e,i[e.id]=!0}else if(n.parent&&n.parent===e&&n.parent.nextSibling&&l(n.parent.nextSibling.id)){const e=n.parent.nextSibling;o=!0,r=!1,n=e,i[e.id]=!0}else n.parent&&n.parent!==e?(o=!1,r=!0,n=n.parent):n=null}function qe(e){(e.insertionEffectHost||e.layoutEffectHost||e.effectHost||e.portalHost)&&Ge(e,(({nextFiber:t,isReturn:n,stop:o})=>{if(t===e.nextSibling)return o();!n&&G(t.instance)&&(t.insertionEffectHost&&Ze(t.hook),t.layoutEffectHost&&We(t.hook),t.effectHost&&xe(t.hook),t.portalHost&&De.unmountPortal(t))}))}const Ve={[Oe.CREATE]:!0};class _e{id=0;nativeElement=null;parent=null;child=null;nextSibling=null;alternate=null;move=!1;effectTag=null;instance=null;hook=null;provider=null;effectHost=!1;layoutEffectHost=!1;insertionEffectHost=!1;portalHost=!1;childrenCount=0;childrenElementsCount=0;marker="";isUsed=!1;idx=0;elementIdx=0;batched=null;catchException;static nextId=0;constructor(e=null,t=null,n=0){this.id=++_e.nextId,this.hook=e,this.provider=t,this.idx=n}mutate(e){const t=Object.keys(e);for(const n of t)this[n]=e[n];return this}markEffectHost(){this.effectHost=!0,this.parent&&!this.parent.effectHost&&this.parent.markEffectHost()}markLayoutEffectHost(){this.layoutEffectHost=!0,this.parent&&!this.parent.layoutEffectHost&&this.parent.markLayoutEffectHost()}markInsertionEffectHost(){this.insertionEffectHost=!0,this.parent&&!this.parent.insertionEffectHost&&this.parent.markInsertionEffectHost()}markPortalHost(){this.portalHost=!0,this.parent&&!this.parent.portalHost&&this.parent.markPortalHost()}incrementChildrenElementsCount(e=1,t=!1){!function(e,t=1,n=!1){if(!e.parent)return;const o=Ee.get(),r=re.get(),s=o&&r.parent===e.parent;(F(e.instance)||$(e.instance)&&0===e.instance.children.length)&&(e.childrenElementsCount=1),o&&s&&!n||(e.parent.childrenElementsCount+=t,e.parent.nativeElement||e.parent.incrementChildrenElementsCount(t))}(this,e,t)}setError(e){a(this.catchException)?this.catchException(e):this.parent&&this.parent.setError(e)}}function ze(){const t=re.get();let n=ie.get(),o=!1,r=Boolean(n);const s={fiber$$:null,fiber$:null,instance$:null};for(;n&&!o;)n=Xe(n,s),ie.set(n),r=Boolean(n),o=De.shouldYeildToHost();return!n&&t&&function(){if(e&&ye.set(!1),be.get()&&ke())return pt(null);const t=re.get(),n=De.detectIsDynamic(),o=ue.get(),r=ce.get(),s=Ee.get();for(const e of o)qe(e),De.applyCommit(e);n&&(ge.set(!0),he.get().forEach((e=>e())),ge.set(!1)),s&&function(e){const t=e.childrenElementsCount-e.alternate.childrenElementsCount;if(0===t)return;const n=function(e){let t=e;for(;t&&(t=t.parent,!t||!t.nativeElement););return t}(e);let o=!1;e.incrementChildrenElementsCount(t,!0),Ge(n.child,(({nextFiber:r,resetIsDeepWalking:s,isReturn:i,stop:l})=>r===n?l():r===e?(o=!0,s()):(r.nativeElement&&s(),void(o&&!i&&(r.elementIdx+=t)))))}(t);for(const e of r)e.effectTag!==Oe.SKIP&&De.applyCommit(e),e.alternate=null;t.alternate=null,De.finishCommitWork(),n&&(me.set(!0),pe.get().forEach((e=>e())),me.set(!1)),n&&function(){const e=de.get();e.length>0&&setTimeout((()=>e.forEach((e=>e()))))}(),pt(t)}(),r}function Xe(e,t){let n=!0,o=e,r=e.instance;for(;;){if(n=fe.deepWalking.get(),o.hook&&(o.hook.idx=0),n)if(ut(r)&&r.children.length>0){if(Ye(o,t),o=t.fiber$,r=t.instance$,t.fiber$$=null,t.fiber$=null,t.instance$=null,o)return o}else{Je(o,t);const e=t.fiber$$;if(o=t.fiber$,r=t.instance$,t.fiber$$=null,t.fiber$=null,t.instance$=null,e)return e}else{Je(o,t);const e=t.fiber$$;if(o=t.fiber$,r=t.instance$,t.fiber$$=null,t.fiber$=null,t.instance$=null,e)return e}if(null===o.parent)return null}}function Ye(e,t){fe.jumpToChild();let n=e.instance;const o=e.alternate?e.alternate.child:null,r=new _e(dt(o,o?o.instance:null,ut(n)?n.children[0]:null),o?o.provider:null,0);le.set(r),r.parent=e,e.child=r,r.elementIdx=e.nativeElement?0:e.elementIdx,n=rt(n,0,r),o&&nt(o,n),Qe(r,o,n),o&&X(r.instance)&&ot(r),ce.add(r),t.fiber$$=null,t.fiber$=r,t.instance$=n}function Je(e,t){fe.jumpToSibling();let n=e.parent.instance;const o=fe.getIndex();if(ut(n)&&n.children[o]){fe.deepWalking.set(!0);const r=e.alternate?e.alternate.nextSibling:null,s=new _e(dt(r,r?r.instance:null,ut(n)?n.children[o]:null),r?r.provider:null,o);return le.set(s),s.parent=e.parent,e.nextSibling=s,s.elementIdx=e.elementIdx+(e.nativeElement?1:e.childrenElementsCount),n=rt(n,o,s),r&&nt(r,n),Qe(s,r,n),r&&X(s.instance)&&ot(s),ce.add(s),t.fiber$$=s,t.fiber$=s,void(t.instance$=n)}fe.jumpToParent(),fe.deepWalking.set(!1),n=(e=e.parent).instance,ut(e.instance)&&(e.instance.children=[]),t.fiber$$=null,t.fiber$=e,t.instance$=n}function Qe(e,t,n){let o=!1;Ve[e.parent.effectTag]&&(e.effectTag=e.parent.effectTag),e.effectTag!==Oe.CREATE&&(o=t&&ft(t.instance,n)&&(t?lt(t.instance):null)===lt(n)),e.instance=n,e.alternate=t||null,e.nativeElement=o?t.nativeElement:null,e.effectTag=o?Oe.UPDATE:Oe.CREATE,t&&t.move&&(e.move=t.move,t.move=!1),ut(e.instance)&&(e.childrenCount=e.instance.children.length),!e.nativeElement&&I(e.instance)&&(e.nativeElement=De.createNativeElement(e.instance),e.effectTag=Oe.CREATE),e.nativeElement&&e.incrementChildrenElementsCount()}function et(e,t,n){return 0===e||t.child&&t.child.effectTag===Oe.DELETE?(t.child=n,n.parent=t):(t.nextSibling=n,n.parent=t.parent),n}function tt(e,t){return(new _e).mutate({effectTag:Oe.CREATE,instance:U(),parent:e,marker:t+""})}function nt(t,n){const o=ft(t.instance,n),r=function(e){return G(e)?V(e):P(e)?R(e):$(e)?L(e):null}(n),s=r&&r[l.HAS_NO_MOVES];if(t.isUsed=!0,o){if(ut(t.instance)&&ut(n)&&0!==t.childrenCount&&(!s||t.childrenCount!==n.children.length)){const{prevKeys:o,nextKeys:r,prevKeysMap:s,nextKeysMap:i,keyedFibersMap:l}=function(t,n){let o=t,r=0;const s=[],i=[],l={},a={},c={},u={};for(;o||r<n.length;){if(o){const e=lt(o.instance),t=g(e)?it(r):e;s.push(t),l[t]=!0,c[t]=o}if(n[r]){const t=n[r],o=lt(t),s=g(o)?it(r):o;e&&(u[s]&&y(`[Dark]: The key of node [${s}] already has been used!`,[t]),u[s]=!0),i.push(s),a[s]=!0}o=o?o.nextSibling:null,r++}return{prevKeys:s,nextKeys:i,prevKeysMap:l,nextKeysMap:a,keyedFibersMap:c}}(t.child,n.children);let a=[],c=Math.max(o.length,r.length),u=t,f=0,d=0,p=0;for(let n=0;n<c;n++){const h=r[n-p]??null,m=o[n-d]??null,g=l[m]||null,E=l[h]||tt(t,h);h!==m?null===h||s[h]?i[m]?i[m]&&i[h]&&(e&&a.push([[h,m],"move"]),E.effectTag=Oe.UPDATE,g.effectTag=Oe.UPDATE,E.move=!0,u=et(n,u,E)):(e&&a.push([m,"remove"]),g.effectTag=Oe.DELETE,ue.add(g),p++,f--,c++):(null===m||i[m]?(e&&a.push([h,"insert"]),E.effectTag=Oe.CREATE,d++,c++):(e&&a.push([[h,m],"replace"]),E.effectTag=Oe.CREATE,g.effectTag=Oe.DELETE,ue.add(g)),u=et(n,u,E)):null!==h&&(e&&a.push([h,"stable"]),E.effectTag=Oe.UPDATE,u=et(n,u,E)),E.idx=f,f++}a=[]}}else(function(e){let t=e.parent;for(;t;){if(t.effectTag===Oe.DELETE)return!1;t=t.parent}return!0})(t)&&(t.effectTag=Oe.DELETE,ue.add(t))}function ot(t){if(e&&ye.get())return;const n=t.alternate,o=n.instance,r=t.instance;if(t.move||r.type!==o.type||r.shouldUpdate(o.props,r.props))return;fe.deepWalking.set(!1),t.effectTag=Oe.SKIP,t.alternate=n,t.nativeElement=n.nativeElement,t.child=n.child,t.hook=n.hook,t.provider=n.provider,t.childrenCount=n.childrenCount,t.childrenElementsCount=n.childrenElementsCount,t.catchException=n.catchException,t.child&&(t.child.parent=t);const s=t.elementIdx-n.elementIdx;0!==s&&Ge(t.child,(({nextFiber:e,stop:n})=>e===t.nextSibling||e===t.parent?n():(e.elementIdx+=s,e.parent!==t&&e.nativeElement?n():void 0))),t.incrementChildrenElementsCount(n.childrenElementsCount),n.effectHost&&t.markEffectHost(),n.layoutEffectHost&&t.markLayoutEffectHost(),n.insertionEffectHost&&t.markInsertionEffectHost(),n.portalHost&&t.markPortalHost()}function rt(e,t,n){let o=null;return ut(e)&&(h(e.children[t])&&e.children.splice(t,1,...k(e.children[t])),o=st(n,e.children[t]),G(o)&&(Ce(n)&&n.markEffectHost(),Fe(n)&&n.markLayoutEffectHost(),Ke(n)&&n.markInsertionEffectHost(),De.detectIsPortal(o)&&n.markPortalHost())),o}function st(e,t){let n=t;const o=G(n),r=n;if(o)try{let e=r.type(r.props,r.ref);h(e)&&!Ae(r)?e=Me({slot:e}):(f(e)||u(e))&&(e=B(e)),r.children=h(e)?k(e):[e]}catch(t){r.children=[],e.setError(t),y(t)}else P(n)&&(n=n());if(ut(n)){n.children=o?n.children:h(n.children)?k(n.children):[n.children];for(let e=0;e<n.children.length;e++)n.children[e]||(n.children[e]=at(n.children[e]));o&&0===r.children.length&&r.children.push(U())}return n}function it(e){return`${t}:${e}`}function lt(e){return G(e)?q(e):P(e)?O(e):$(e)?D(e):null}function at(e){return E(e)?U():e}function ct(e){return P(e)?e[n]:$(e)?e.name:I(e)||G(e)?e.type:null}function ut(e){return $(e)||G(e)}function ft(t,n,o=!1){if(e&&ye.get()&&G(t)&&G(n))return t.displayName===n.displayName;if(o){const e=n;return t.type===e.type}return ct(t)===ct(n)}function dt(e,t,n){return e&&function(e,t){return!!(e&&t&&G(e)&&G(t)&&ft(e,t,!0))&&lt(e)===lt(t)}(t,n)?e.hook:G(n)?{idx:0,values:[]}:null}function pt(e){re.set(null),ce.reset(),ue.reset(),he.reset(),pe.reset(),de.reset(),Ee.get()?Ee.set(!1):se.set(e)}const ht=()=>Boolean(re.get());function mt(e){const t=ne(),n=Pe((()=>({fiber:null})),[]);return n.fiber=le.get(),o=>{if(ge.get())return;const r=function(e){const{rootId:t,fiber:n,forceStart:o=!1,onStart:r}=e;return()=>{n.effectTag!==Oe.DELETE&&(o&&r(),n.isUsed||(!o&&r(),te.set(t),Ee.set(!0),fe.reset(),n.alternate=(new _e).mutate(n),n.marker="🔥",n.effectTag=Oe.UPDATE,n.childrenElementsCount=0,n.child=null,re.set(n),le.set(n),n.instance=st(n,n.instance),ie.set(n)))}}({rootId:t,fiber:n.fiber,forceStart:Boolean(e?.timeoutMs),onStart:o||b});me.get()&&(e={...e||{},forceSync:!0}),ve.get()?function(e,t){e.batched&&clearTimeout(e.batched),e.batched=setTimeout((()=>{ve.set(!1),e.batched=null,t()}))}(n.fiber,(()=>De.scheduleCallback(r,e))):De.scheduleCallback(r,e)}}function gt(e){const{defaultValue:t}=e,n=le.get(),o=Pe((()=>function(e,t){let n=t;for(;n;){if(n.provider&&n.provider.get(e))return n.provider.get(e);n=n.parent}return null}(e,n)),[]),r=o?o.value:t,s=mt(),i=Pe((()=>({value:r})),[]),l=Boolean(o);return we((()=>{if(!l)return;const e=o.subscribe((e=>{Object.is(i.value,e)||s()}));return e}),[l]),i.value=r,r}function Et(e,t){return Pe((()=>e),t)}const vt=Z((e=>{const{list:t,getKey:n,slot:o}=e,r=Pe((()=>({list:t,subscribers:new Set})),[]),s=Pe((()=>({value:T(t,(e=>n(e)),!0)})),[t,n]),i=Pe((()=>{if(r.list.length!==t.length)return!1;let e=0;for(const o of t){if(n(o)!==n(r.list[e]))return!1;e++}return!0}),[t]);Pe((()=>{r.list=[...t]}),[t]),Ue((()=>{if(i)for(const e of r.subscribers)e(s.value)}),[t]);const l=Et((e=>(r.subscribers.add(e),()=>r.subscribers.delete(e))),[]),a=Pe((()=>({subscribe:l,map:s.value})),[]);return a.map=s.value,yt.Provider({value:a,slot:bt({canSplit:i,slot:o})})})),bt=Y(Z((({slot:e})=>e)),((e,t)=>!1===t.canSplit)),yt=function(e,t){const{displayName:n="Context"}={},o={displayName:n,defaultValue:null,Provider:null,Consumer:null};return o.Provider=function(e,t,n){return Z((({value:t=null,slot:n})=>{const o=le.get();if(!o.provider){const n={value:t,subscribers:new Set,subscribe:e=>(n.subscribers.add(e),()=>n.subscribers.delete(e))};o.provider=new Map,o.provider.set(e,n)}const r=o.provider.get(e);return we((()=>{r.subscribers.forEach((e=>e(t)))}),[t]),r.value=t,n}),{displayName:`${n}.Provider`})}(o,0,n),o.Consumer=function(e,t){return Z((({slot:t})=>{const n=gt(e);return a(t)?t(n):null}),{displayName:`${t}.Consumer`})}(o,n),o}();function kt(e){return(e=e.map((e=>f(e)||u(e)?B(e.toString()):e)))?Array.isArray(e)?[...e]:[e]:[]}function Tt(e,t,...n){if(f(e))return W({...t,as:e,slot:kt(n)});if(a(e)){let o=kt(n);return o=1===o.length?o[0]:o,e({...t,slot:o})}return null}const wt=Symbol("portal");Z((({slot:e,...t})=>(Pe((()=>t[wt].innerHTML=""),[]),e)),{token:wt});const Ct=e=>G(e)&&e.token===wt,xt=e=>Ct(e)?e.props[wt]:null;function Ht(e){const t=xt(e.instance);t&&(t.innerHTML="")}class St{type="";sourceEvent=null;target=null;propagation=!0;constructor(e){this.type=e.sourceEvent.type,this.sourceEvent=e.sourceEvent,this.target=e.target}stopPropagation(){this.propagation=!1,this.sourceEvent.stopPropagation()}preventDefault(){this.sourceEvent.preventDefault()}getPropagation(){return this.propagation}}function Mt(e){const{target:t,eventName:n,handler:o}=e,r=ae.get(),s=r.get(n);if(s)s.set(t,o);else{const e=e=>{const t=r.get(n).get(e.target),o=e.target;let s=null;a(t)&&(s=new St({sourceEvent:e,target:o}),t(s)),(s?s.getPropagation():o.parentElement)&&o.parentElement.dispatchEvent(new e.constructor(e.type,e))};r.set(n,new WeakMap([[t,o]])),document.addEventListener(n,e,!0),ae.addUnsubscriber((()=>document.removeEventListener(n,e,!0)))}}const At=e=>e.startsWith("on"),It=e=>e.slice(2,e.length).toLowerCase(),$t={[o]:!0,[r]:!0,[s]:!0},Nt={transform:!0,fill:!0};let Pt=[],Dt=null;const Lt=T("svg,animate,animateMotion,animateTransform,circle,clipPath,defs,desc,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,image,line,linearGradient,marker,mask,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,stop,switch,symbol,text,textPath,tspan,use,view".split(","),(e=>e)),Ot=T("area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr".split(","),(e=>e)),Rt={[C.TAG]:e=>{const t=e;return n=t.name,Boolean(Lt[n])?document.createElementNS("http://www.w3.org/2000/svg",t.name):document.createElement(t.name);var n},[C.TEXT]:e=>document.createTextNode(e.value),[C.COMMENT]:e=>document.createComment(e.value)};function Ut(e){return Rt[e.type](e)}function Ft(e,t){!function(e,t){a(e)?e(t):function(e){if(!d(e)||m(e))return!1;const t=e;for(const e in t)if("current"===e&&t.hasOwnProperty(e))return!0;return!1}(e)&&(e.current=t)}(e,t)}function Wt(e){const{tagName:t,element:n,attrName:o,attrValue:r}=e,s=Bt[t];let i=!!s&&s(n,o,r);var l,a;return a=o,(l=Object.getPrototypeOf(n)).hasOwnProperty(a)&&Boolean(Object.getOwnPropertyDescriptor(l,a)?.set)&&(n[o]=r),!i&&p(r)&&(i=!o.includes("-")),i}const Bt={input:(e,t,n)=>("value"===t&&p(n)?e.checked=n:"autoFocus"===t&&(e.autofocus=Boolean(n)),!1),textarea:(e,t,n)=>"value"===t&&(e.innerHTML=String(n),!0)};function jt(e){let t=e;for(;t;)if(t=t.parent,Ct(t.instance)&&(t.nativeElement=xt(t.instance)),t.nativeElement)return t;return t}const Kt={[Oe.CREATE]:e=>{null!==e.nativeElement&&(Dt&&Dt(e.nativeElement),function(e){const t=jt(e),n=t.nativeElement,o=n.childNodes;if(be.get()){const t=o[e.elementIdx];N(e.instance)&&t instanceof Text&&e.instance.value.length!==t.length&&t.splitText(e.instance.value.length),e.nativeElement=t}else 0===o.length||e.elementIdx>o.length-1?(s=t.instance.name,!Boolean(Ot[s])&&function(e,t){t.appendChild(e.nativeElement)}(e,n)):function(e,t){t.insertBefore(e.nativeElement,t.childNodes[e.elementIdx])}(e,n);var s;$(e.instance)&&function(e,t){const n=Object.keys(t.attrs),o=e;for(const s of n){const n=t.attrs[s];s!==r?a(n)?At(s)&&Mt({target:o,handler:n,eventName:It(s)}):c(n)||$t[s]||!Wt({tagName:t.name,element:o,attrValue:n,attrName:s})&&o.setAttribute(s,n):Ft(n,e)}}(e.nativeElement,e.instance)}(e))},[Oe.UPDATE]:e=>{e.move&&(function(e){const t=function(e){const t=[];return Ge(e,(({nextFiber:n,isReturn:o,resetIsDeepWalking:r,stop:s})=>n===e.nextSibling||n===e.parent?s():!o&&n.nativeElement?(!Ct(n.instance)&&t.push(n.nativeElement),r()):void 0)),t}(e),n=t[0].parentElement,o=new DocumentFragment,r=e.elementIdx;let s=0;for(const e of t)n.insertBefore(document.createComment(`${r}:${s}`),e),o.appendChild(e),s++;Pt.push((()=>{for(let e=1;e<t.length;e++)n.removeChild(n.childNodes[r+1]);n.replaceChild(o,n.childNodes[r])}))}(e),e.move=!1),null===e.nativeElement||G(e.instance)||(Dt&&Dt(e.nativeElement),function(e){const t=e.nativeElement,n=e.alternate.instance,o=e.instance;F(n)&&F(o)?n.value!==o.value&&(t.textContent=o.value):function(e,t,n){const o=Object.keys(n.attrs),s=e;for(const i of o){const o=t.attrs[i],l=n.attrs[i];i!==r?c(l)?s.removeAttribute(i):a(o)?At(i)&&o!==l&&Mt({target:s,handler:l,eventName:It(i)}):$t[i]||o===l||(Nt[i]||!Wt({tagName:n.name,element:s,attrValue:l,attrName:i}))&&s.setAttribute(i,l):Ft(o,e)}}(t,n,o)}(e))},[Oe.DELETE]:e=>function(e){const t=jt(e);Ge(e,(({nextFiber:n,isReturn:o,resetIsDeepWalking:r,stop:s})=>n===e.nextSibling||n===e.parent?s():!o&&n.nativeElement?(!Ct(n.instance)&&t.nativeElement.removeChild(n.nativeElement),r()):void 0))}(e),[Oe.SKIP]:()=>{}};function Zt(e){Kt[e.effectTag](e)}function Gt(){for(const e of Pt)e();Pt=[],be.set(!1)}const qt={animations:[],hight:[],normal:[],low1:[],low2:[]},Vt=1e5;let _t=null,zt=0,Xt=!1,Yt=null;class Jt{static nextTaskId=0;id;time;timeoutMs;priority;forceSync;callback;constructor(e){this.id=++Jt.nextTaskId,this.time=e.time,this.timeoutMs=e.timeoutMs,this.priority=e.priority,this.forceSync=e.forceSync,this.callback=e.callback}}const Qt=()=>v()>=zt;function en(e,t){const{priority:n=i.NORMAL,timeoutMs:o=0,forceSync:r=!1}=t||{},s=new Jt({time:v(),timeoutMs:o,priority:n,forceSync:r,callback:e});({[i.ANIMATION]:()=>qt.animations.push(s),[i.HIGH]:()=>qt.hight.push(s),[i.NORMAL]:()=>qt.normal.push(s),[i.LOW]:()=>s.timeoutMs>0?qt.low2.push(s):qt.low1.push(s)})[s.priority](),nn()}function tn(e){if(!e.length)return!1;Yt=e.shift();const t=Yt.priority===i.ANIMATION;return Yt.callback(),Yt.forceSync||t?function(e){for(;e(););nn(),Yt=null}(ze):(_t=ze,Xt||(Xt=!0,rn.postMessage(null))),!0}function nn(){ht()||function(){const[e]=qt.low2;return!!(e&&v()-e.time>e.timeoutMs)&&(tn(qt.low2),!0)}()||(qt.low1.length>Vt&&(qt.low1=[]),0)||qt.animations.length>0&&tn(qt.animations)||qt.hight.length>0&&tn(qt.hight)||qt.normal.length>0&&tn(qt.normal)||qt.low1.length>0&&requestIdleCallback((()=>tn(qt.low1)))||qt.low2.length>0&&requestIdleCallback((()=>tn(qt.low2)))}let on=null,rn=null;on=new MessageChannel,rn=on.port2,on.port1.onmessage=function(){if(_t){zt=v()+4;try{_t()?rn.postMessage(null):(Yt=null,Xt=!1,_t=null,nn())}catch(e){throw rn.postMessage(null),e}}else Xt=!1};let sn=!1;const ln=new Map;const an=(e={})=>W({...e,as:"button"}),cn=(()=>{let e,t;return{start:n=>{e=performance.now(),t=n},stop:()=>{const n=t;t&&setTimeout((()=>{t=null;const o=performance.now()-e;console.log(`${n}: ${o}`)}))}}})();let un=0;const fn=(e,t="")=>Array(e).fill(0).map((()=>({id:++un,name:`item: ${un} ${t}`,selected:!1}))),dn={list:[]},pn=Y(Z((({onCreate:e,onPrepend:t,onAppend:n,onInsertDifferent:o,onUpdateAll:r,onSwap:s,onClear:i})=>((e={})=>W({...e,as:"div"}))({style:"width: 100%; height: 64px; background-color: blueviolet; display: flex; align-items: center; padding: 16px;",slot:[an({slot:B("create 10 rows"),onClick:e}),an({slot:B("Prepend 2 rows"),onClick:t}),an({slot:B("Append 2 rows"),onClick:n}),an({slot:B("insert different"),onClick:o}),an({slot:B("update every 5th row"),onClick:r}),an({slot:B("swap rows"),onClick:s}),an({slot:B("clear rows"),onClick:i}),an({slot:B("unmount app"),onClick:()=>{vn.unmount()}})]})))),hn=Y(Z((({id:e,onRemove:t,onHighlight:n})=>{const{name:o,selected:r}=function(e,t){const{subscribe:n,map:o}=gt(yt),r=mt({forceSync:!0}),s=e(o),i=t(s),l=Pe((()=>({detectedChange:i})),[]);return we((()=>{const o=n((n=>{const o=t(e(n));Object.is(l.detectedChange,o)||r(),l.detectedChange=o}));return o}),[]),l.detectedChange=i,s}((t=>t[e]),(e=>`${e.name}:${e.selected}`)),s=Et((()=>t(e)),[]),i=Et((()=>n(e)),[]);return Tt("tr",{class:r?"selected":void 0},Tt("td",{class:"cell"},o),Tt("td",{class:"cell"},"qqq"),Tt("td",{class:"cell"},"xxx"),Tt("td",{class:"cell"},Tt("button",{onClick:s},"remove"),Tt("button",{onClick:i},"highlight")))}))),mn=Y(Z((({items:e,onRemove:t,onHighlight:n})=>Tt("table",{class:"table"},Tt("tbody",null,e.map((e=>Tt(hn,{key:e.id,id:e.id,onRemove:t,onHighlight:n})))))))),gn=Z((()=>{const e=Et((()=>{dn.list=fn(10),cn.start("create"),yn(),cn.stop()}),[]),t=Et((()=>{dn.list.unshift(...fn(2,"!!!")),dn.list=[...dn.list],cn.start("prepend"),yn(),cn.stop()}),[]),n=Et((()=>{dn.list.push(...fn(2,"!!!")),dn.list=[...dn.list],cn.start("append"),yn(),cn.stop()}),[]),o=Et((()=>{const[e,t,n,...o]=dn.list;dn.list=[...fn(5,"***"),e,t,n,...fn(2,"***"),...o].filter(Boolean),cn.start("insert different"),yn(),cn.stop()}),[]),r=Et((()=>{dn.list=dn.list.map(((e,t)=>({...e,name:(t+1)%5==0?e.name+"!!!":e.name}))),cn.start("update every 5th"),yn(),cn.stop()}),[]),s=Et((e=>{dn.list=dn.list.filter((t=>t.id!==e)),cn.start("remove"),yn(),cn.stop()}),[]),i=Et((e=>{const t=dn.list.findIndex((t=>t.id===e));dn.list[t].selected=!dn.list[t].selected,dn.list=[...dn.list],cn.start("highlight"),yn(),cn.stop()}),[]),l=Et((()=>{if(0===dn.list.length)return;const e=dn.list[1];dn.list[1]=dn.list[dn.list.length-2],dn.list[dn.list.length-2]=e,dn.list=[...dn.list],cn.start("swap"),yn(),cn.stop()}),[]),a=Et((()=>{dn.list=[],cn.start("clear"),yn(),cn.stop()}),[]);return Tt(Me,null,Tt(pn,{onCreate:e,onPrepend:t,onAppend:n,onInsertDifferent:o,onUpdateAll:r,onSwap:l,onClear:a}),Tt(vt,{list:dn.list,getKey:En},Tt(mn,{items:dn.list,onRemove:s,onHighlight:i})))})),En=e=>e.id,vn=(bn=document.getElementById("root"),{render:e=>function(e,t,n=!1){if(!sn&&function(){De.createNativeElement=Ut,De.requestAnimationFrame=requestAnimationFrame.bind(this),De.cancelAnimationFrame=cancelAnimationFrame.bind(this),De.scheduleCallback=en,De.shouldYeildToHost=Qt,De.applyCommit=Zt,De.finishCommitWork=Gt,De.detectIsDynamic=()=>!0,De.detectIsPortal=Ct,De.unmountPortal=Ht,De.restart=()=>{},sn=!0}(),!(t instanceof Element))throw new Error("[Dark]: render receives only Element as container!");const o=!c(ln.get(t));let r=null;o?r=ln.get(t):(r=ln.size,ln.set(t,r),n||(t.innerHTML="")),ge.get(r)||De.scheduleCallback((()=>{te.set(r);const o=se.get(),s=Boolean(o),i=(new _e).mutate({nativeElement:t,instance:new S("root",{},k([e||U()])),alternate:o,effectTag:s?Oe.UPDATE:Oe.CREATE});fe.reset(),re.set(i),be.set(n),ie.set(i)}),{priority:i.NORMAL,forceSync:n||me.get()})}(e,bn),unmount:()=>function(e){!function(t,n){c(t)||(qe(se.get(t)),ae.unsubscribe(t),te.remove(t),ln.delete(e),e.innerHTML="")}(ln.get(e))}(bn)});var bn;function yn(){vn.render(Tt(gn,null))}Dt=e=>{e.tagName&&requestAnimationFrame((()=>{e.classList.add("updated-node"),setTimeout((()=>{e.classList.remove("updated-node")}),300)}))},yn()})();
//# sourceMappingURL=build.js.map