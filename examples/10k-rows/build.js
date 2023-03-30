(()=>{"use strict";const t="dark:idx",e="type",n="key",o="ref",s="flag";var r,l;!function(t){t[t.ANIMATION=3]="ANIMATION",t[t.HIGH=2]="HIGH",t[t.NORMAL=1]="NORMAL",t[t.LOW=0]="LOW"}(r||(r={})),function(t){t.NM="NM"}(l||(l={}));const i={createElement:()=>{throw new Error(c())},raf:()=>{throw new Error(c())},caf:()=>{throw new Error(c())},schedule:()=>{throw new Error(c())},shouldYeild:()=>{throw new Error(c())},commit:()=>{throw new Error(c())},finishCommit:()=>{throw new Error(c())},detectIsDynamic:()=>{throw new Error(c())},detectIsPortal:()=>{throw new Error(c())},unmountPortal:()=>{throw new Error(c())},restart:()=>{throw new Error(c())}},c=()=>"Function not installed by renderer!";let a=null;const u=new Map;class f{root=null;wip=null;unit=null;cur=null;events=new Map;off=[];candidates=new Set;deletions=new Set;mount={level:0,nav:{},deep:!0};effects=[];lEffects=[];iEffects=[];isLEFZone=!1;isIEFZone=!1;uZone=!1;bZone=!1;hZone=!1;isHot=!1;lazy=new Set}const d={set:t=>{a=t,!u.get(a)&&u.set(a,new f)},remove:t=>u.delete(t)},h=()=>a,p=(t=a)=>u.get(t),m={get:()=>p()?.wip||null,set:t=>p().wip=t},g={get:t=>p(t)?.root||null,set:t=>p().root=t},v={get:()=>p()?.unit||null,set:t=>p().unit=t},b={get:()=>p()?.cur,set:t=>p().cur=t},w={get:()=>p().events,addUnsubscriber:t=>p().off.push(t),unsubscribe:t=>p(t).off.forEach((t=>t()))},y={get:()=>p().candidates,add:t=>p().candidates.add(t),reset:()=>p().candidates=new Set},E={get:()=>p().deletions,add:t=>p().deletions.add(t),has:t=>p().deletions.has(t),set:t=>p().deletions=t,reset:()=>p().deletions=new Set},k={reset:()=>{p().mount={level:0,nav:{},deep:!0}},getIndex:()=>{const{mount:t}=p();return t.nav[t.level]},toChild:()=>{const{mount:t}=p();t.level=t.level+1,t.nav[t.level]=0},toParent:()=>{const{mount:t}=p();t.nav[t.level]=0,t.level=t.level-1},toSibling:()=>{const{mount:t}=p();t.nav[t.level]=t.nav[t.level]+1},deep:{get:()=>p().mount.deep,set:t=>p().mount.deep=t}},x={get:()=>p().effects,reset:()=>p().effects=[],add:t=>p().effects.push(t)},C={get:()=>p().lEffects,reset:()=>p().lEffects=[],add:t=>p().lEffects.push(t)},$={get:()=>p().iEffects,reset:()=>p().iEffects=[],add:t=>p().iEffects.push(t)},H={get:()=>p()?.isLEFZone||!1,set:t=>p().isLEFZone=t},M={get:t=>p(t)?.isIEFZone||!1,set:t=>p().isIEFZone=t},S={get:()=>p()?.uZone||!1,set:t=>p().uZone=t},I={get:()=>p()?.bZone||!1,set:t=>p().bZone=t},N={get:()=>p()?.hZone||!1,set:t=>p().hZone=t},P=()=>p().lazy.size>0,T=t=>"function"==typeof t,A=t=>void 0===t,F=t=>"number"==typeof t,O=t=>"string"==typeof t,L=t=>"object"==typeof t,D=t=>"boolean"==typeof t,B=t=>Array.isArray(t),U=t=>null===t,Z=t=>U(t)||A(t),G=t=>U(t)||A(t)||!1===t,R=()=>Date.now(),j=()=>{};function K(t){const e=[],n={0:{idx:0,source:t}};let o=0;do{const{source:t,idx:s}=n[o],r=t[s];s>=t.length?(o--,n[o]||(n[o]={idx:0,source:[]}),n[o].idx++):B(r)?(o++,n[o]={idx:0,source:r}):(e.push(r),n[o].idx++)}while(o>0||n[o].idx<n[o].source.length);return e}function q(t,e,n=!1){return t.reduce(((t,o)=>(t[e(o)]=!n||o,t)),{})}function W(t,e){if(t&&e&&t.length>0&&e.length>0)for(let n=0;n<e.length;n++)if(e[n]!==t[n])return!0;return!1}const z=Symbol("component");class X{type;token;props;ref;dn;su;children=[];constructor(t,e,n,o,s,r){this.type=t,this.token=e||z,this.props=n,o&&(this.ref=o),s&&(this.su=s),r&&(this.dn=r)}}function V(t,e={}){const{token:n,displayName:o,shouldUpdate:s,keepRef:r=!1}=e;return(e={},l)=>(!r&&e.ref&&delete e.ref,new X(t,n,e,l,s,o))}const Y=t=>t instanceof X,_=t=>Z(t.props[n])?null:t.props[n],J=t=>t.props[s]||null;var Q;!function(t){t.TAG="TAG",t.TEXT="TEXT",t.COMMENT="COMMENT"}(Q||(Q={}));const tt=Symbol("vNode");class et{type=null;constructor(t){this.type=t}}class nt extends et{name;attrs;children=[];constructor(t,e,n){super(Q.TAG),this.name=t||this.name,Object.keys(e).length>0&&(this.attrs=e),this.children=n||this.children}}class ot extends et{value="";constructor(t){super(Q.TEXT),this.value=t}}class st extends et{value="";constructor(t){super(Q.COMMENT),this.value=t}}const rt=t=>t instanceof et,lt=t=>t instanceof nt,it=t=>t instanceof ot,ct=t=>T(t)&&!0===t[tt],at=t=>t.attrs&&!Z(t.attrs[n])?t.attrs[n]:null,ut=t=>t.attrs&&t.attrs[s]||null,ft=t=>Z(t[n])?null:t[n],dt=t=>t[s]||null,ht=()=>new st("dark:matter"),pt=t=>it(t)||(t=>t instanceof st)(t);function mt(t){return new ot(t+"")}mt.from=t=>it(t)?t.value:t+"";const gt=Symbol("memo"),vt=(t,e)=>{const n=Object.keys(e);for(const o of n)if("slot"!==o&&e[o]!==t[o])return!0;return!1},bt=t=>Y(t)&&t.token===gt;function wt(t,e=vt){return V(t,{token:gt,keepRef:!0,shouldUpdate:e})}var yt;!function(t){t.C="C",t.U="U",t.D="D",t.S="S"}(yt||(yt={}));const Et=Symbol("use-effect"),{useEffect:kt,hasEffects:xt,dropEffects:Ct}=$t(Et,x);function $t(t,e){return{useEffect:function(n,o){const s=b.get().hook,{idx:r,values:l}=s,i=()=>{l[r]={deps:o,token:t,value:void 0},e.add((()=>{l[r].value=n()}))};if(A(l[r]))i();else{const{deps:t,value:e}=l[r];(!o||W(o,t))&&(T(e)&&e(),i())}s.idx++},hasEffects:function(e){const{values:n}=e.hook;return n.some((e=>e.token===t))},dropEffects:function(e){for(const n of e.values)n.token===t&&n.value&&n.value()}}}const Ht=Symbol("use-layout-effect"),{useEffect:Mt,hasEffects:St,dropEffects:It}=$t(Ht,C),Nt=Symbol("use-insertion-effect"),{useEffect:Pt,hasEffects:Tt,dropEffects:At}=$t(Nt,$);function Ft(t,e){let n=t,o=!0,s=!1,r=!1;const l={},i=t=>!l[t],c=()=>o=!1,a=()=>r=!0;for(;n&&(e(n,s,c,a),!r);)if(n.child&&o&&i(n.child.id)){const t=n.child;s=!1,n=t,l[t.id]=!0}else if(n.next&&i(n.next.id)){const t=n.next;o=!0,s=!1,n=t,l[t.id]=!0}else if(n.parent&&n.parent===t&&n.parent.next&&i(n.parent.next.id)){const t=n.parent.next;o=!0,s=!1,n=t,l[t.id]=!0}else n.parent&&n.parent!==t?(o=!1,s=!0,n=n.parent):n=null}function Ot(t){let e=t;for(;e;){if(e.element)return e;e=e.parent}return e}function Lt(t){(t.iefHost||t.lefHost||t.efHost||t.pHost)&&Ft(t,((e,n,o,s)=>{if(e===t.next)return s();if(!(e.iefHost||e.lefHost||e.efHost||e.pHost))return o();if(!n&&Y(e.inst)){const t=e.hook.values.length>0;e.iefHost&&t&&At(e.hook),e.lefHost&&t&&It(e.hook),e.efHost&&t&&Ct(e.hook),e.pHost&&i.unmountPortal(e)}}))}const Dt=Symbol("fragment"),Bt=V((({slot:t})=>t||null),{token:Dt}),Ut=t=>Y(t)&&t.token===Dt;class Zt{id=0;cc=0;cec=0;idx=0;eidx=0;element=null;parent=null;child;next;alt;move;tag=null;inst=null;hook;provider;efHost;lefHost;iefHost;pHost;marker;used;batch;flush;catch;static nextId=0;constructor(t=null,e=null,n=0){this.id=++Zt.nextId,this.idx=n,t&&(this.hook=t),e&&(this.provider=e)}mutate(t){const e=Object.keys(t);for(const n of e)this[n]=t[n];return this}markEFHost(){this.efHost=!0,this.parent&&!this.parent.efHost&&this.parent.markEFHost()}markLEFHost(){this.lefHost=!0,this.parent&&!this.parent.lefHost&&this.parent.markLEFHost()}markIEFHost(){this.iefHost=!0,this.parent&&!this.parent.iefHost&&this.parent.markIEFHost()}markPHost(){this.pHost=!0,this.parent&&!this.parent.pHost&&this.parent.markPHost()}incCEC(t=1,e=!1){!function(t,e=1,n=!1){if(!t.parent)return;const o=S.get(),s=m.get(),r=o&&s.parent===t.parent;(pt(t.inst)||lt(t.inst)&&0===t.inst.children.length)&&(t.cec=1),o&&r&&!n||(t.parent.cec+=e,t.parent.element||t.parent.incCEC(e))}(this,t,e)}setError(t){T(this.catch)?this.catch(t):this.parent&&this.parent.setError(t)}}function Gt(){const t=m.get();let e=v.get(),n=!1,o=Boolean(e);const s={fiber$$:null,fiber$:null,inst$:null};for(;e&&!n;)e=Rt(e,s),v.set(e),o=Boolean(e),n=i.shouldYeild();return!e&&t&&function(){if(N.get()&&P())return re(null);const t=m.get(),e=i.detectIsDynamic(),n=E.get(),o=y.get(),s=S.get();for(const t of n)Lt(t),i.commit(t);e&&(M.set(!0),$.get().forEach((t=>t())),M.set(!1)),s&&function(t){const e=t.cec-t.alt.cec;if(0===e)return;const n=Ot(t.parent);let o=!1;t.incCEC(e,!0),Ft(n.child,((s,r,l,i)=>s===n?i():s===t?(o=!0,l()):(s.element&&l(),void(o&&!r&&(s.eidx+=e)))))}(t);for(const t of o)t.tag!==yt.S&&i.commit(t),t.alt=null;t.alt=null,i.finishCommit(),e&&(H.set(!0),C.get().forEach((t=>t())),H.set(!1)),e&&function(){const t=x.get();t.length>0&&setTimeout((()=>t.forEach((t=>t()))))}(),re(t)}(),o}function Rt(t,e){let n=!0,o=t,s=t.inst;for(;;){if(n=k.deep.get(),o.hook&&(o.hook.idx=0),n)if(ne(s)&&s.children.length>0){if(jt(o,e),o=e.fiber$,s=e.inst$,e.fiber$$=null,e.fiber$=null,e.inst$=null,o)return o}else{Kt(o,e);const t=e.fiber$$;if(o=e.fiber$,s=e.inst$,e.fiber$$=null,e.fiber$=null,e.inst$=null,t)return t}else{Kt(o,e);const t=e.fiber$$;if(o=e.fiber$,s=e.inst$,e.fiber$$=null,e.fiber$=null,e.inst$=null,t)return t}if(null===o.parent)return null}}function jt(t,e){k.toChild();let n=t.inst;const o=t.alt?t.alt.child:null,s=new Zt(se(o,o?o.inst:null,ne(n)?n.children[0]:null),o?o.provider:null,0);b.set(s),s.parent=t,t.child=s,s.eidx=t.element?0:t.eidx,n=Yt(n,0,s),o&&Xt(o,n),qt(s,o,n),o&&bt(s.inst)&&Vt(s),y.add(s),e.fiber$$=null,e.fiber$=s,e.inst$=n}function Kt(t,e){k.toSibling();let n=t.parent.inst;const o=k.getIndex();if(ne(n)&&n.children[o]){k.deep.set(!0);const s=t.alt?t.alt.next:null,r=new Zt(se(s,s?s.inst:null,ne(n)?n.children[o]:null),s?s.provider:null,o);return b.set(r),r.parent=t.parent,t.next=r,r.eidx=t.eidx+(t.element?1:t.cec),n=Yt(n,o,r),s&&Xt(s,n),qt(r,s,n),s&&bt(r.inst)&&Vt(r),y.add(r),e.fiber$$=r,e.fiber$=r,void(e.inst$=n)}k.toParent(),k.deep.set(!1),n=(t=t.parent).inst,ne(t.inst)&&(t.inst.children=[]),e.fiber$$=null,e.fiber$=t,e.inst$=n}function qt(t,e,n){let o=!1;t.parent.tag===yt.C&&(t.tag=t.parent.tag),t.tag!==yt.C&&(o=e&&oe(e.inst,n)&&(e?Qt(e.inst):null)===Qt(n)),t.inst=n,t.alt=e||null,t.element=t.element||(o?e.element:null),t.tag=o?yt.U:yt.C,e&&e.move&&(t.move=e.move,e.move=!1),ne(t.inst)&&(t.cc=t.inst.children.length),!t.element&&rt(t.inst)&&(t.element=i.createElement(t.inst),t.tag=yt.C),t.element&&t.incCEC()}function Wt(t,e,n){return 0===t||e.child&&e.child.tag===yt.D?(e.child=n,n.parent=e):(e.next=n,n.parent=e.parent),n}function zt(t,e){return(new Zt).mutate({tag:yt.C,inst:ht(),parent:t,marker:e+""})}function Xt(t,e){const n=oe(t.inst,e),o=function(t){return Y(t)?J(t):ct(t)?dt(t):lt(t)?ut(t):null}(e),s=o&&o[l.NM];if(t.used=!0,n){if(ne(t.inst)&&ne(e)&&0!==t.cc&&(!s||t.cc!==e.children.length)){const{prevKeys:n,nextKeys:o,prevKeysMap:s,nextKeysMap:r,keyedFibersMap:l}=function(t,e){let n=t,o=0;const s=[],r=[],l={},i={},c={};for(;n||o<e.length;){if(n){const t=Qt(n.inst),e=Z(t)?Jt(o):t;s.push(e),l[e]=!0,c[e]=n}if(e[o]){const t=Qt(e[o]),n=Z(t)?Jt(o):t;r.push(n),i[n]=!0}n=n?n.next:null,o++}return{prevKeys:s,nextKeys:r,prevKeysMap:l,nextKeysMap:i,keyedFibersMap:c}}(t.child,e.children),i=0===o.length;let c=[],a=Math.max(n.length,o.length),u=t,f=0,d=0,h=0;for(let e=0;e<a;e++){const c=o[e-h]??null,p=n[e-d]??null,m=l[p]||null,g=l[c]||zt(t,c);c!==p?null===c||s[c]?r[p]?r[p]&&r[c]&&(g.tag=yt.U,m.tag=yt.U,g.move=!0,u=Wt(e,u,g)):(m.tag=yt.D,E.add(m),i&&(m.flush=!0),h++,f--,a++):(null===p||r[p]?(g.tag=yt.C,d++,a++):(g.tag=yt.C,m.tag=yt.D,E.add(m)),u=Wt(e,u,g)):null!==c&&(g.tag=yt.U,u=Wt(e,u,g)),g.idx=f,f++}c=[]}}else(function(t){let e=t.parent;for(;e;){if(e.tag===yt.D)return!1;e=e.parent}return!0})(t)&&(t.tag=yt.D,E.add(t))}function Vt(t){const e=t.alt,n=e.inst,o=t.inst;if(t.move||o.type!==n.type||o.su(n.props,o.props))return;k.deep.set(!1),t.tag=yt.S,t.alt=e,t.element=e.element,t.child=e.child,t.hook=e.hook,t.provider=e.provider,t.cc=e.cc,t.cec=e.cec,t.catch=e.catch,t.child&&(t.child.parent=t);const s=t.eidx-e.eidx;0!==s&&Ft(t.child,((e,n,o,r)=>e===t.next||e===t.parent?r():(e.eidx+=s,e.parent!==t&&e.element?r():void 0))),t.incCEC(e.cec),e.efHost&&t.markEFHost(),e.lefHost&&t.markLEFHost(),e.iefHost&&t.markIEFHost(),e.pHost&&t.markPHost()}function Yt(t,e,n){let o=null;return ne(t)&&(B(t.children[e])&&t.children.splice(e,1,...K(t.children[e])),o=_t(n,t.children[e]),Y(o)&&(xt(n)&&n.markEFHost(),St(n)&&n.markLEFHost(),Tt(n)&&n.markIEFHost(),i.detectIsPortal(o)&&n.markPHost())),o}function _t(t,e){let n=e;const o=Y(n),s=n;if(o)try{let t=s.type(s.props,s.ref);B(t)&&!Ut(s)?t=Bt({slot:t}):(O(t)||F(t))&&(t=mt(t)),s.children=B(t)?K(t):[t]}catch(e){s.children=[],t.setError(e),function(...t){!A(console)&&console.error(...t)}(e)}else ct(n)&&(n=n());if(ne(n)){n.children=o?n.children:B(n.children)?K(n.children):[n.children];for(let t=0;t<n.children.length;t++)n.children[t]||(n.children[t]=te(n.children[t]));o&&0===s.children.length&&s.children.push(ht())}return n}function Jt(e){return`${t}:${e}`}function Qt(t){return Y(t)?_(t):ct(t)?ft(t):lt(t)?at(t):null}function te(t){return G(t)?ht():t}function ee(t){return ct(t)?t[e]:lt(t)?t.name:rt(t)||Y(t)?t.type:null}function ne(t){return lt(t)||Y(t)}function oe(t,e,n=!1){if(n){const n=e;return t.type===n.type}return ee(t)===ee(e)}function se(t,e,n){return t&&function(t,e){return!!(t&&e&&Y(t)&&Y(e)&&oe(t,e,!0))&&Qt(t)===Qt(e)}(e,n)?t.hook:Y(n)?{idx:0,values:[]}:null}function re(t){m.set(null),y.reset(),E.reset(),$.reset(),C.reset(),x.reset(),S.get()?S.set(!1):g.set(t)}const le=()=>Boolean(m.get()),ie=V((({slot:t})=>t),{token:gt});function ce(t){return ct(t)||Y(t)}function ae(t,e=!1){return function(t,e){if(B(t)?ce(t[0]):ce(t)){const n=ie({slot:Bt({slot:t})});return n.su=()=>e,n}return t}(t(),e)}function ue(t,e){const n=b.get(),{hook:o}=n,{idx:s,values:r}=o;if(A(r[s])){const n=ae(t);return r[s]={deps:e,value:n},o.idx++,n}const l=r[s],i=W(e,l.deps),c=i?t:()=>l.value;return l.deps=e,l.value=ae(c,i),o.idx++,l.value}class fe{value;subs=new Set;constructor(t=undefined){this.value=t}get(){return this.value}set(t){const e=this.value;this.value=t,this.subs.forEach((([n,o=he])=>o(e,t)&&n(t)))}on(t){return this.subs.add(t),()=>this.subs.delete(t)}}const de=(t=undefined)=>new fe(t),he=()=>!0;function pe(t){const e=function(t){const e=h(),n=ue((()=>({fiber:null})),[]);return n.fiber=b.get(),o=>{if(M.get())return;const s=function(t){const{rootId:e,fiber:n,forceStart:o=!1,onStart:s}=t;return()=>{n.tag!==yt.D&&(o&&s(),n.used||(!o&&s(),d.set(e),S.set(!0),k.reset(),n.alt=(new Zt).mutate(n),n.marker="🔥",n.tag=yt.U,n.cc=0,n.cec=0,n.child=null,m.set(n),b.set(n),n.inst=_t(n,n.inst),v.set(n)))}}({rootId:e,fiber:n.fiber,forceStart:Boolean(t?.timeoutMs),onStart:o||j});H.get()&&(t={...t||{},forceSync:!0}),I.get()?function(t,e){t.batch&&clearTimeout(t.batch),t.batch=setTimeout((()=>{I.set(!1),t.batch=null,e()}))}(n.fiber,(()=>i.schedule(s,t))):i.schedule(s,t)}}({forceSync:!0});return kt((()=>{const n=[];for(const[o,s]of t)n.push(o.on([()=>e(),s]));return()=>n.forEach((t=>t()))}),[]),t.map((t=>t[0].get()))}const me=wt(V((({slot:t})=>t)),(()=>!1)),ge=t=>o=>function(t){const o=()=>{const{as:e,slot:n,_void:o=!1,...s}=t,r=o?[]:B(n)?n:n?[n]:[];return new nt(e,s,r)};return o[tt]=!0,o[e]=t.as,t.key&&(o[n]=t.key),t.flag&&(o[s]=t.flag),o}({as:t,...o||{}}),ve=ge("div"),be=ge("button"),we=ge("tr"),ye=ge("td"),Ee=ge("table"),ke=ge("tbody");const xe=Symbol("portal");V((t=>{const e=t.container,n=b.get();return ue((()=>e.textContent=""),[]),n.element=e,delete t.container,t.slot}),{token:xe});const Ce=t=>Y(t)&&t.token===xe,$e=t=>Ce(t.inst)?t.element:null;function He(t){const e=$e(t);e&&(e.textContent="")}class Me{type="";sourceEvent=null;target=null;propagation=!0;constructor(t){this.type=t.sourceEvent.type,this.sourceEvent=t.sourceEvent,this.target=t.target}stopPropagation(){this.propagation=!1,this.sourceEvent.stopPropagation()}preventDefault(){this.sourceEvent.preventDefault()}getPropagation(){return this.propagation}}function Se(t,e,n){const o=w.get(),s=o.get(e),r=B(n)?t=>n[0](...n.slice(1),t):n;if(s)s.set(t,r);else{const n=t=>{const n=o.get(e).get(t.target),s=t.target;let r=null;T(n)&&(r=new Me({sourceEvent:t,target:s}),n(r)),(r?r.getPropagation():s.parentElement)&&s.parentElement.dispatchEvent(new t.constructor(t.type,t))};o.set(e,new WeakMap([[t,r]])),document.addEventListener(e,n,!0),w.addUnsubscriber((()=>document.removeEventListener(e,n,!0)))}}const Ie=t=>t.startsWith("on"),Ne=t=>t.slice(2,t.length).toLowerCase(),Pe={[n]:!0,[o]:!0,[s]:!0},Te={transform:!0,fill:!0};let Ae=[];const Fe=q("svg,animate,animateMotion,animateTransform,circle,clipPath,defs,desc,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,image,line,linearGradient,marker,mask,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,stop,switch,symbol,text,textPath,tspan,use,view".split(","),(t=>t)),Oe=q("area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr".split(","),(t=>t)),Le={[Q.TAG]:t=>{const e=t;return n=e.name,Boolean(Fe[n])?document.createElementNS("http://www.w3.org/2000/svg",e.name):document.createElement(e.name);var n},[Q.TEXT]:t=>document.createTextNode(t.value),[Q.COMMENT]:t=>document.createComment(t.value)};function De(t){return Le[t.type](t)}function Be(t,e){!function(t,e){T(t)?t(e):function(t){if(!L(t)||U(t))return!1;const e=t;for(const t in e)if("current"===t&&e.hasOwnProperty(t))return!0;return!1}(t)&&(t.current=e)}(t,e)}function Ue(t){const{tagName:e,element:n,attrName:o,attrValue:s}=t,r=Ze[e];let l=!!r&&r(n,o,s);var i,c;return c=o,(i=Object.getPrototypeOf(n)).hasOwnProperty(c)&&Boolean(Object.getOwnPropertyDescriptor(i,c)?.set)&&(n[o]=s),!l&&D(s)&&(l=!o.includes("-")),l}const Ze={input:(t,e,n)=>("value"===e&&D(n)?t.checked=n:"autoFocus"===e&&(t.autofocus=Boolean(n)),!1),textarea:(t,e,n)=>"value"===e&&(t.innerHTML=String(n),!0)};const Ge={[yt.C]:t=>{null===t.element||Ce(t.inst)||function(t){const e=Ot(t.parent),n=e.element,s=n.childNodes;if(N.get()){const e=s[t.eidx];it(t.inst)&&e instanceof Text&&t.inst.value.length!==e.length&&e.splitText(t.inst.value.length),t.element=e}else 0===s.length||t.eidx>s.length-1?(r=e.inst.name,!Boolean(Oe[r])&&n.appendChild(t.element)):n.insertBefore(t.element,n.childNodes[t.eidx]);var r;lt(t.inst)&&function(t,e){if(!e.attrs)return;const n=Object.keys(e.attrs),s=t;for(const r of n){const n=e.attrs[r];r!==o?Ie(r)?Se(s,Ne(r),n):A(n)||Pe[r]||!Ue({tagName:e.name,element:s,attrValue:n,attrName:r})&&s.setAttribute(r,n):Be(n,t)}}(t.element,t.inst)}(t)},[yt.U]:t=>{t.move&&(function(t){const e=function(t){const e=[];return Ft(t,((n,o,s,r)=>n===t.next||n===t.parent?r():!o&&n.element?(!i.detectIsPortal(n.inst)&&e.push(n.element),s()):void 0)),e}(t),n=e[0].parentElement,o=new DocumentFragment,s=t.eidx;let r=0;for(const t of e)n.insertBefore(document.createComment(`${s}:${r}`),t),o.appendChild(t),r++;Ae.push((()=>{for(let t=1;t<e.length;t++)n.removeChild(n.childNodes[s+1]);n.replaceChild(o,n.childNodes[s])}))}(t),t.move=!1),null===t.element||Ce(t.inst)||function(t){const e=t.element,n=t.alt.inst,s=t.inst;pt(s)?n.value!==s.value&&(e.textContent=s.value):function(t,e,n){if(!n.attrs)return;const s=Object.keys(n.attrs),r=t;for(const l of s){const s=e.attrs[l],i=n.attrs[l];l!==o?A(i)?r.removeAttribute(l):Ie(l)?s!==i&&Se(r,Ne(l),i):Pe[l]||s===i||(Te[l]||!Ue({tagName:n.name,element:r,attrValue:i,attrName:l}))&&r.setAttribute(l,i):Be(s,t)}}(e,n,s)}(t)},[yt.D]:function(t){const e=Ot(t.parent);t.flush?e.element.textContent&&(e.element.textContent=""):Ft(t,((n,o,s,r)=>n===t.next||n===t.parent?r():!o&&n.element?(!Ce(n.inst)&&e.element.removeChild(n.element),s()):void 0))},[yt.S]:()=>{}};function Re(t){Ge[t.tag](t)}function je(){Ae.forEach((t=>t())),Ae=[],N.set(!1)}const Ke={animations:[],hight:[],normal:[],low1:[],low2:[]},qe=1e5;let We=null,ze=0,Xe=!1,Ve=null;class Ye{static nextTaskId=0;id;time;timeoutMs;priority;forceSync;callback;constructor(t){this.id=++Ye.nextTaskId,this.time=t.time,this.timeoutMs=t.timeoutMs,this.priority=t.priority,this.forceSync=t.forceSync,this.callback=t.callback}}const _e=()=>R()>=ze;function Je(t,e){const{priority:n=r.NORMAL,timeoutMs:o=0,forceSync:s=!1}=e||{},l=new Ye({time:R(),timeoutMs:o,priority:n,forceSync:s,callback:t});({[r.ANIMATION]:()=>Ke.animations.push(l),[r.HIGH]:()=>Ke.hight.push(l),[r.NORMAL]:()=>Ke.normal.push(l),[r.LOW]:()=>l.timeoutMs>0?Ke.low2.push(l):Ke.low1.push(l)})[l.priority](),tn()}function Qe(t){if(!t.length)return!1;Ve=t.shift();const e=Ve.priority===r.ANIMATION;return Ve.callback(),Ve.forceSync||e?function(t){for(;t(););tn(),Ve=null}(Gt):(We=Gt,Xe||(Xe=!0,nn.postMessage(null))),!0}function tn(){le()||function(){const[t]=Ke.low2;return!!(t&&R()-t.time>t.timeoutMs)&&(Qe(Ke.low2),!0)}()||(Ke.low1.length>qe&&(Ke.low1=[]),0)||Ke.animations.length>0&&Qe(Ke.animations)||Ke.hight.length>0&&Qe(Ke.hight)||Ke.normal.length>0&&Qe(Ke.normal)||Ke.low1.length>0&&requestIdleCallback((()=>Qe(Ke.low1)))||Ke.low2.length>0&&requestIdleCallback((()=>Qe(Ke.low2)))}let en=null,nn=null;en=new MessageChannel,nn=en.port2,en.port1.onmessage=function(){if(We){ze=R()+4;try{We()?nn.postMessage(null):(Ve=null,Xe=!1,We=null,tn())}catch(t){throw nn.postMessage(null),t}}else Xe=!1};let on=!1;const sn=new Map;const rn={[l.NM]:!0},ln=(()=>{let t,e;return{start:n=>{t=performance.now(),e=n},stop:()=>{const n=e;e&&setTimeout((()=>{e=null;const o=performance.now()-t;console.log(`${n}: ${o}`)}))}}})();let cn=0;const an=(t,e="")=>Array(t).fill(0).map((()=>({id:++cn,name$:de(`item: ${cn} ${e}`)}))),un=wt(V((({onCreate:t,onPrepend:e,onAppend:n,onInsertDifferent:o,onUpdateAll:s,onSwap:r,onClear:l})=>ve({style:"width: 100%; height: 64px; background-color: blueviolet; display: flex; align-items: center; padding: 16px;",slot:[be({slot:mt("create 10000 rows"),onClick:t}),be({slot:mt("Prepend 1000 rows"),onClick:e}),be({slot:mt("Append 1000 rows"),onClick:n}),be({slot:mt("insert different"),onClick:o}),be({slot:mt("update every 10th row"),onClick:s}),be({slot:mt("swap rows"),onClick:r}),be({slot:mt("clear rows"),onClick:l})]}))),(()=>!1)),fn=wt(V((({item:t,selected$:e,onRemove:n,onHighlight:o})=>{const{id:s}=t,[r,l]=pe([[t.name$],[e,(t,e)=>t===s||e===s]]);return we({class:l===s?"selected":void 0,flag:rn,slot:[ye({class:"cell",slot:mt(r)}),me({slot:[ye({class:"cell",slot:mt("qqq")}),ye({class:"cell",slot:mt("xxx")}),ye({class:"cell",slot:[be({onClick:[n,s],slot:mt("remove")}),be({onClick:[o,s],slot:mt("highlight")})]})]})]})})),(()=>!1)),dn=V((()=>{const t=ue((()=>({data$:de([]),selected$:de()})),[]),{data$:e,selected$:n}=t;pe([[t.data$]]);const o=(t,n)=>{ln.start("remove"),n.stopPropagation();const o=e.get(),s=o.findIndex((e=>e.id===t));-1!==s&&o.splice(s,1),e.set(o),ln.stop()},s=(t,e)=>{ln.start("highlight"),e.stopPropagation(),n.set(t),ln.stop()};return[un({onCreate:t=>{ln.start("create"),t.stopPropagation(),e.set(an(1e4)),ln.stop()},onPrepend:t=>{ln.start("prepend"),t.stopPropagation();const n=e.get();n.unshift(...an(1e3,"!!!")),e.set(n),ln.stop()},onAppend:t=>{ln.start("append"),t.stopPropagation();const n=e.get();n.push(...an(1e3,"!!!")),e.set(n),ln.stop()},onInsertDifferent:t=>{ln.start("insert different"),t.stopPropagation();const n=e.get();n.splice(0,0,...an(5,"***")),n.splice(8,0,...an(2,"***")),e.set(n),ln.stop()},onUpdateAll:t=>{ln.start("update every 10th"),t.stopPropagation();for(let t=0;t<e.get().length;t+=10){const n=e.get()[t];n.name$.set(n.name$.get()+"!!!")}ln.stop()},onSwap:t=>{if(0===e.get().length)return;ln.start("swap"),t.stopPropagation();const n=e.get(),o=n[1];n[1]=n[n.length-2],n[n.length-2]=o,e.set(n),ln.stop()},onClear:t=>{ln.start("clear"),t.stopPropagation(),e.set([]),n.set(void 0),ln.stop()}}),Ee({class:"table",slot:ke({slot:e.get().map((t=>fn({key:t.id,item:t,selected$:n,onRemove:o,onHighlight:s})))})})]}));var hn;(hn=document.getElementById("root"),{render:t=>function(t,e,n=!1){!on&&function(){i.createElement=De,i.raf=requestAnimationFrame.bind(this),i.caf=cancelAnimationFrame.bind(this),i.schedule=Je,i.shouldYeild=_e,i.commit=Re,i.finishCommit=je,i.detectIsDynamic=()=>!0,i.detectIsPortal=Ce,i.unmountPortal=He,i.restart=()=>{},on=!0}();const o=!A(sn.get(e));let s=null;o?s=sn.get(e):(s=sn.size,sn.set(e,s),n||(e.innerHTML="")),M.get(s)||i.schedule((()=>{d.set(s);const o=g.get(),r=Boolean(o),l=(new Zt).mutate({element:e,inst:new nt("root",{},K([t||ht()])),alt:o,tag:r?yt.U:yt.C});k.reset(),m.set(l),N.set(n),v.set(l)}),{priority:r.NORMAL,forceSync:n||H.get()})}(t,hn),unmount:()=>function(t){!function(e,n){A(e)||(Lt(g.get(e)),w.unsubscribe(e),d.remove(e),sn.delete(t),t.innerHTML="")}(sn.get(t))}(hn)}).render(dn())})();
//# sourceMappingURL=build.js.map