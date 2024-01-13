(()=>{"use strict";const t="dark:root",e="dark:matter",n="key",s="ref",i="C",o="U",r="S",a=128;var c,l;!function(t){t[t.LOW=0]="LOW",t[t.NORMAL=1]="NORMAL",t[t.HIGH=2]="HIGH"}(c||(c={})),function(t){t.SKIP_SCAN_OPT="__skipScanOpt",t.MEMO_SLOT_OPT="__memoSlotOpt",t.STATIC_SLOT_OPT="__staticSlotOpt"}(l||(l={}));const u={[n]:!0,[s]:!0,[l.SKIP_SCAN_OPT]:!0,[l.MEMO_SLOT_OPT]:!0,[l.STATIC_SLOT_OPT]:!0},h=Symbol("inject");class d{constructor(t,e,n,s,i,o){this.children=[],this.type=t,this.props=n,s&&(this.ref=s),e&&(this.token=e),i&&(this.shouldUpdate=i),o&&(this.displayName=o)}}function f(t,e={}){const{token:n,displayName:s}=e,i=(e={},o)=>{const{token:r=n,shouldUpdate:a}=i[h]||m;return e.ref&&delete e.ref,new d(t,r,e,o,a,s)};return i}const m={},p=t=>t instanceof d,g=t=>"function"==typeof t,y=t=>void 0===t,k=t=>"string"==typeof t||"number"==typeof t,v=t=>"object"==typeof t,I=t=>"boolean"==typeof t,E=t=>Array.isArray(t),b=t=>null===t,T=t=>b(t)||y(t),w=()=>Date.now(),S=()=>{},x=()=>!0,M=t=>t;function P(t,e=M){if(!E(t))return[e(t)];if(0===t.length)return[];const n=[],s=[t[0]];let i=0;for(;s.length>0;){const o=s.pop();if(E(o))for(let t=o.length-1;t>=0;t--)s.push(o[t]);else n.push(e(o)),0===s.length&&i<t.length-1&&(i++,s.push(t[i]))}return n}function A(t,e){if(t===e)return!1;const n=Math.max(t.length,e.length);for(let s=0;s<n;s++)if(!Object.is(t[s],e[s]))return!0;return!1}const L=t=>`dark:idx:${t}`,C=Symbol("vNode"),O="type";class N{constructor(t){this.type=null,this.type=t}}class Z extends N{constructor(t,e,n){super(z.TAG),this.name=t,this.attrs=e,this.children=n}}class R extends N{constructor(t){super(z.TEXT),this.value=String(t)}}class D extends N{constructor(t){super(z.COMMENT),this.value="",this.value=t}}const U=t=>new R(t);U.from=t=>_(t)?t.value:String(t);const H=t=>t instanceof N,B=t=>t instanceof Z,W=t=>t instanceof D,_=t=>t instanceof R,F=t=>g(t)&&!0===t[C],$=t=>_(t)||W(t),V=()=>new D(e);function j(t){return p(t)?t.props[n]??null:F(t)?t[n]??null:B(t)&&(e=t).attrs?e.attrs[n]??null:null;var e}function G(t,e){return p(t)?((t,e)=>Boolean(t.props[e]))(t,e):F(t)?((t,e)=>Boolean(t[e]))(t,e):!!B(t)&&((t,e)=>Boolean(t.attrs&&t.attrs[e]))(t,e)}function K(t){return p(t)?t.type:F(t)?t[O]:B(t)?t.name:H(t)?t.type:null}function q(t){return B(t)||p(t)}function Y(t,e,n=!1){if(n){const n=e;return t.type===n.type}return K(t)===K(e)}var z;!function(t){t.TAG="TAG",t.TEXT="TEXT",t.COMMENT="COMMENT"}(z||(z={}));const Q=()=>{throw new Error("Function not installed by renderer!")},X={createElement:Q,insertElement:Q,raf:Q,caf:Q,spawn:Q,commit:Q,finishCommit:Q,detectIsDynamic:Q,detectIsPortal:Q,unmountPortal:Q,chunk:Q};class J{constructor(){this.subscribers=new Map}on(t,e){return!this.subscribers.has(t)&&this.subscribers.set(t,new Set),this.subscribers.get(t).add(e),()=>this.subscribers.has(t)&&this.subscribers.get(t).delete(e)}emit(t,e){this.subscribers.has(t)&&this.subscribers.get(t).forEach((t=>t(e)))}kill(){this.subscribers=new Map}__getSize(){return this.subscribers.size}}class tt{constructor(){this.root=null,this.wip=null,this.cursor=null,this.unit=null,this.mountDeep=!0,this.mountLevel=0,this.mountNav={},this.events=new Map,this.unsubs=new Set,this.actions={},this.candidates=new Set,this.deletions=new Set,this.cancels=[],this.asyncEffects=new Set,this.layoutEffects=new Set,this.insertionEffects=new Set,this.resourceId=0,this.resources=new Map,this.defers=[],this.setPendingStatus=null,this.isLayoutEffectsZone=!1,this.isInsertionEffectsZone=!1,this.isUpdateZone=!1,this.isBatchZone=!1,this.isHydrateZone=!1,this.isStreamZone=!1,this.isTransitionZone=!1,this.isEventZone=!1,this.isHot=!1,this.isDynamic=X.detectIsDynamic(),this.isServer=!X.detectIsDynamic(),this.emitter=new J}resetActions(){this.actions={}}getActionsById(t){return this.actions[t]}addActionMap(t,e){this.actions[t]={map:e,replace:null,insert:null,remove:null,move:null,stable:null}}addReplaceAction(t,e){!this.actions[t].replace&&(this.actions[t].replace={}),this.actions[t].replace[e]=!0}addInsertAction(t,e){!this.actions[t].insert&&(this.actions[t].insert={}),this.actions[t].insert[e]=!0}addRemoveAction(t,e){!this.actions[t].remove&&(this.actions[t].remove={}),this.actions[t].remove[e]=!0}addMoveAction(t,e){!this.actions[t].move&&(this.actions[t].move={}),this.actions[t].move[e]=!0}addStableAction(t,e){!this.actions[t].stable&&(this.actions[t].stable={}),this.actions[t].stable[e]=!0}copy(){const t=new tt;return t.root=null,t.wip=null,t.cursor=null,t.unit=this.unit,t.mountDeep=this.mountDeep,t.mountLevel=this.mountLevel,t.mountNav={...this.mountNav},t.events=this.events,t.unsubs=this.unsubs,t.actions={...this.actions},t.candidates=new Set([...this.candidates]),t.deletions=new Set([...this.deletions]),t.asyncEffects=new Set([...this.asyncEffects]),t.layoutEffects=new Set([...this.layoutEffects]),t.insertionEffects=new Set([...this.insertionEffects]),t.isUpdateZone=this.isUpdateZone,t.emitter=this.emitter,t}getRoot(){return this.root}setRoot(t){this.root=t}getWorkInProgress(){return this.wip}setWorkInProgress(t){this.wip=t}getNextUnitOfWork(){return this.unit}setNextUnitOfWork(t){this.unit=t}getCursorFiber(){return this.cursor}setCursorFiber(t){this.cursor=t}navToChild(){this.mountLevel=this.mountLevel+1,this.mountNav[this.mountLevel]=0}navToSibling(){this.mountNav[this.mountLevel]=this.mountNav[this.mountLevel]+1}navToParent(){this.mountLevel=this.mountLevel-1}navToPrev(){0===this.getMountIndex()?(this.navToParent(),this.setMountDeep(!0)):(this.mountNav[this.mountLevel]=this.mountNav[this.mountLevel]-1,this.setMountDeep(!1))}getMountIndex(){return this.mountNav[this.mountLevel]}getMountDeep(){return this.mountDeep}setMountDeep(t){this.mountDeep=t}resetMount(){this.mountLevel=0,this.mountNav={},this.mountDeep=!0}getEvents(){return this.events}addEventUnsubscriber(t){this.unsubs.add(t)}unsubscribeEvents(){this.unsubs.forEach((t=>t())),this.unsubs=new Set}getCandidates(){return this.candidates}addCandidate(t){this.candidates.add(t)}resetCandidates(){this.candidates=new Set}getDeletions(){return this.deletions}hasDeletion(t){let e=t;for(;e;){if(this.deletions.has(e))return!0;e=e.parent}return!1}addDeletion(t){!this.hasDeletion(t)&&this.deletions.add(t)}resetDeletions(){this.deletions=new Set}addAsyncEffect(t){this.asyncEffects.add(t)}resetAsyncEffects(){this.asyncEffects=new Set}runAsyncEffects(){if(!this.isDynamic)return;const t=this.asyncEffects;t.size>0&&setTimeout((()=>t.forEach((t=>t()))))}addLayoutEffect(t){this.layoutEffects.add(t)}resetLayoutEffects(){this.layoutEffects=new Set}runLayoutEffects(){this.isDynamic&&(this.setIsLayoutEffectsZone(!0),this.layoutEffects.forEach((t=>t())),this.setIsLayoutEffectsZone(!1))}addInsertionEffect(t){this.insertionEffects.add(t)}resetInsertionEffects(){this.insertionEffects=new Set}runInsertionEffects(){this.isDynamic&&(this.setIsInsertionEffectsZone(!0),this.insertionEffects.forEach((t=>t())),this.setIsInsertionEffectsZone(!1))}addCancel(t){this.cancels.push(t)}applyCancels(){for(let t=this.cancels.length-1;t>=0;t--)this.cancels[t]()}resetCancels(){this.cancels=[]}getIsLayoutEffectsZone(){return this.isLayoutEffectsZone}setIsLayoutEffectsZone(t){this.isLayoutEffectsZone=t}getIsInsertionEffectsZone(){return this.isInsertionEffectsZone}setIsInsertionEffectsZone(t){this.isInsertionEffectsZone=t}getIsUpdateZone(){return this.isUpdateZone}setIsUpdateZone(t){this.isUpdateZone=t}getIsBatchZone(){return this.isBatchZone}setIsBatchZone(t){this.isBatchZone=t}getIsHydrateZone(){return this.isHydrateZone}setIsHydrateZone(t){this.isHydrateZone=t}getIsStreamZone(){return this.isStreamZone}setIsStreamZone(t){this.isStreamZone=t}getIsTransitionZone(){return this.isTransitionZone}setIsTransitionZone(t){this.isTransitionZone=t}getIsEventZone(){return this.isEventZone}setIsEventZone(t){this.isEventZone=t}getIsHot(){return this.isHot}setIsHot(t){this.isHot=t}getPendingStatusSetter(){return this.setPendingStatus}setPendingStatusSetter(t){this.setPendingStatus=t}flush(){!this.isUpdateZone&&this.setRoot(this.wip),this.setWorkInProgress(null),this.setNextUnitOfWork(null),this.setCursorFiber(null),this.resetMount(),this.resetCandidates(),this.resetDeletions(),this.resetCancels(),this.resetInsertionEffects(),this.resetLayoutEffects(),this.resetAsyncEffects(),this.setIsHydrateZone(!1),this.setIsUpdateZone(!1),this.resetActions()}getEmitter(){return this.emitter}defer(t){this.defers.push(t)}getDefers(){return this.defers}resetDefers(){this.defers=[]}getResource(t){return this.resources.get(t)}setResource(t,e){this.resources.set(t,e)}getResources(){return this.resources}getResourceId(){return this.resourceId}setResourceId(t){this.resourceId=t}getNextResourceId(){return++this.resourceId}runAfterCommit(){this.resources=new Map,this.isServer&&(this.resourceId=0)}}let et=null;const nt=new Map,st=t=>{et=t,!nt.has(et)&&nt.set(et,new tt)},it=(t=et)=>nt.get(t),ot=Symbol("memo"),rt=(t,e)=>{const n=Object.keys(e);for(const s of n)if("slot"!==s&&e[s]!==t[s])return!0;return!1},at=t=>p(t)&&t.token===ot,ct=function(t,e=rt){return t[h]={token:ot,shouldUpdate:e},t}(f((({getValue:t})=>t())),((t,e)=>A(t.deps,e.deps)));function lt(t,e){const n=it().getCursorFiber(),{hook:s}=n,{idx:i,values:o}=s,r=o[i]||(o[i]={deps:e,value:t()});let a=null,c=null;return function(t){return p(t)||F(t)}(r.value)?(a=r.value,c=ct({getValue:t,deps:e})):(a=A(r.deps,e)?t():r.value,c=a),r.deps=e,r.value=a,s.idx++,c}class ut{constructor(t=null,e=null,n=0){this.id=0,this.cc=0,this.cec=0,this.idx=0,this.eidx=0,this.mask=0,this.element=null,this.tag=null,this.parent=null,this.child=null,this.next=null,this.alt=null,this.inst=null,this.hook=null,this.provider=null,this.atoms=null,this.id=++ut.nextId,this.idx=n,t&&(this.hook=t),e&&(this.provider=e)}mutate(t){const e=Object.keys(t);for(const n of e)this[n]=t[n];return this}markHost(t){this.mask|=t,this.parent&&!(this.parent.mask&t)&&this.parent.markHost(t)}increment(t=1,e=!1){if(!this.parent)return;const n=it(),s=n.getIsUpdateZone(),i=n.getWorkInProgress(),o=s&&i.parent===this.parent;($(this.inst)||B(this.inst)&&0===this.inst.children?.length)&&(this.cec=1),s&&o&&!e||(this.parent.cec+=t,this.parent.element||this.parent.increment(t))}setError(t){g(this.catch)?this.catch(t):this.parent&&this.parent.setError(t)}static setNextId(t){ut.nextId=t}}ut.nextId=0;class ht{constructor(){this.id=0,this.idx=0,this.values=[],this.owner=null,this.id=++ht.nextId}}function dt(t,e){let n=!0,s=!1;const i=()=>n=!1,o=()=>s=!0,r=[t];for(;0!==r.length;){const a=r.pop();if(e(a,i,o),s)break;a!==t&&a.next&&r.push(a.next),n&&a.child&&r.push(a.child),n=!0}}function ft(t){let e=t;for(;e;){if(e.element)return e;e=e.parent}return e}function mt(t,e,n,s){const i=n.getActionsById(t.id),o=t.inst.children;e.element&&(t.element=e.element);for(let e=0;e<o.length;e++){const n=gt(o[e],e),r=i.map[n];pt(o,t,i.map,e,t.eidx),s&&s(r,n)}t.cc=o.length,n.setMountDeep(!1)}function pt(t,e,n,s,i){const o=s-1,a=s+1,c=gt(t[s],s),l=gt(t[o],o),u=gt(t[a],a),h=n[c],d=n[l],f=n[u],m=0===s,p=s===t.length-1;m&&(e.child=h),h.alt=null,h.parent=e,h.tag=r,h.idx=s,h.eidx=d?d.eidx+(d.element?1:d.cec):i,f&&(h.next=f),p&&(h.next=null),yt(h)}function gt(t,e){const n=j(t);return null!==n?n:L(e)}function yt(t,e=t){t.increment(e.element?1:e.cec),1&e.mask&&t.markHost(1),2&e.mask&&t.markHost(2),4&e.mask&&t.markHost(4),8&e.mask&&t.markHost(8),16&e.mask&&t.markHost(16)}ht.nextId=0;const kt=Symbol("fragment"),vt=f((({slot:t})=>t||null),{token:kt}),It=Symbol("use-effect");function Et(t,e){return{useEffect:function(n,s=[{}]){const i=it(),o=i.getCursorFiber(),r=lt((()=>({token:t,cleanup:void 0})),[]),a=e===bt.INSERTION,c=e===bt.LAYOUT,l=e===bt.ASYNC;a&&o.markHost(1),c&&o.markHost(2),l&&o.markHost(4),lt((()=>{const t=()=>r.cleanup=n();return a&&i.addInsertionEffect(t),c&&i.addLayoutEffect(t),l&&i.addAsyncEffect(t),g(r.cleanup)&&r.cleanup(),null}),s)},dropEffects:function(e){for(const{value:n}of e.values)n&&n.token===t&&g(n.cleanup)&&n.cleanup()}}}var bt;!function(t){t.ASYNC="ASYNC",t.LAYOUT="LAYOUT",t.INSERTION="INSERTION"}(bt||(bt={}));const{useEffect:Tt,dropEffects:wt}=Et(It,bt.ASYNC),St=Symbol("use-layout-effect"),{useEffect:xt,dropEffects:Mt}=Et(St,bt.LAYOUT),Pt=Symbol("use-insertion-effect"),{useEffect:At,dropEffects:Lt}=Et(Pt,bt.INSERTION),Ct=t=>31&t.mask;function Ot(t){Ct(t)&&dt(t,((t,e)=>{if(!Ct(t))return e();if(t.hook&&t.hook.values.length>0&&(1&t.mask&&Lt(t.hook),2&t.mask&&Mt(t.hook),4&t.mask&&wt(t.hook)),t.atoms){for(const[e,n]of t.atoms)n();t.atoms=null}16&t.mask&&X.unmountPortal(t)}))}let Nt=!1,Zt=!1;function Rt(t){if(Nt)return null;if(Zt)return!1;const e=it(),n=e.getWorkInProgress();let s=e.getNextUnitOfWork(),i=!1,o=Boolean(s);try{for(;s&&!i;)if(s=Dt(s,e),e.setNextUnitOfWork(s),o=Boolean(s),i=t&&Yt.shouldYield(),i&&Yt.hasPrimaryTask())return $t(e);!s&&n&&function(t){const e=t.getWorkInProgress(),n=t.getDeletions(),s=t.getCandidates(),i=t.getIsUpdateZone(),o=[];for(const t of n)8&t.mask&&!(23&t.mask)?o.push(t):Ot(t),t.tag="D",X.commit(t);i&&function(t){const e=t.cec-t.alt.cec;if(0===e)return;const n=ft(t.parent);let s=!1;t.increment(e,!0),dt(n.child,((n,i)=>{if(n===t)return s=!0,i();n.element&&i(),s&&(n.eidx+=e)}))}(e),t.runInsertionEffects();for(const t of s)t.tag!==r&&X.commit(t),t.alt=null,q(t.inst)&&(t.inst.children=null);e.alt=null,X.finishCommit(),t.runLayoutEffects(),t.runAsyncEffects(),o.length>0&&setTimeout((()=>o.forEach((t=>Ot(t))))),Ft(t)}(e)}catch(e){if(!(e instanceof Promise))throw Zt=!0,e;Nt=!0,e.finally((()=>{Nt=!1,!t&&Rt(!1)}))}return o}function Dt(t,e){const n=e.getWorkInProgress(),s=e.getMountDeep(),i=e.getIsStreamZone(),o=s&&q(t.inst)&&t.inst.children.length>0;if(t.hook&&(t.hook.idx=0),o){const n=function(t,e){e.navToChild();const n=t.inst,s=q(n)?n.children[0]:null,i=Bt(Wt(t,s,!0,e),s,0);return i.parent=t,t.child=i,i.eidx=t.element?0:t.eidx,Ht(i,t,s,e),i}(t,e);return i&&X.chunk(n),n}for(;t.parent&&t!==n;){const n=Ut(t,e);if(i&&X.chunk(t),n)return i&&X.chunk(n),n;t=t.parent}return null}function Ut(t,e){e.navToSibling();const n=t.parent.inst,s=e.getMountIndex(),i=q(n)&&n.children?n.children[s]:null;if(!Boolean(i))return e.navToParent(),e.setMountDeep(!1),null;e.setMountDeep(!0);const o=Bt(Wt(t,i,!1,e),i,s);return o.parent=t.parent,t.next=o,o.eidx=t.eidx+(t.element?1:t.cec),Ht(o,t,i,e),o}function Ht(t,n,s,c){const{alt:u}=t,h=!u||!at(s)||function(t,e,n){const s=t.alt,i=s.inst,o=e;if(o.type!==i.type||o.shouldUpdate(i.props,o.props))return!0;n.setMountDeep(!1),t.tag=r,t.child=s.child,t.child.parent=t,t.hook=s.hook,t.cc=s.cc,t.cec=s.cec,s.element&&(t.element=s.element),s.provider&&(t.provider=s.provider),s.catch&&(t.catch=s.catch),s.atoms&&(t.atoms=s.atoms);const a=t.eidx-s.eidx;return 0!==a&&dt(t.child,((t,e)=>{if(t.eidx+=a,t.element)return e()})),yt(t,s),!1}(t,s,c);c.setCursorFiber(t),t.inst=s,u&&u.mask&a&&(t.mask|=a,u.mask&=-129),t.hook&&(t.hook.owner=t),h?(t.inst=_t(t,n,c),u&&function(t,e,n){const{id:s,inst:i}=t;if(Y(e.inst,i)){if(q(e.inst)&&q(i)&&0!==e.cc){const r=e.cc===i.children.length;if(!G(i,l.SKIP_SCAN_OPT)||!r){const{prevKeys:r,nextKeys:c,prevKeysMap:u,nextKeysMap:h,keyedFibersMap:d}=function(t,e){let n=t,s=0;const i=[],o=[],r={},a={},c={},l={};for(;n||s<e.length;){if(n){const t=j(n.inst),e=T(t)?L(s):t;r[e]||(r[e]=!0,i.push(e)),c[e]=n}if(e[s]){const t=j(e[s]),n=T(t)?L(s):t;a[n]||(a[n]=!0,o.push(n)),l[n]=!0}n=n?n.next:null,s++}return{prevKeys:i,nextKeys:o,prevKeysMap:r,nextKeysMap:a,keyedFibersMap:c}}(e.child,i.children),f=0===c.length;let m=Math.max(r.length,c.length),p=0,g=0;n.addActionMap(s,d);for(let t=0;t<m;t++){const e=c[t-g]??null,i=r[t-p]??null,o=d[i]||null;e!==i?null===e||u[e]?h[i]?h[i]&&h[e]&&n.addMoveAction(s,e):(n.addRemoveAction(s,i),n.addDeletion(o),f&&(o.mask|=64),g++,m++):null===i||h[i]?(n.addInsertAction(s,e),p++,m++):(n.addReplaceAction(s,e),n.addDeletion(o)):null!==e&&n.addStableAction(s,e)}G(i,l.STATIC_SLOT_OPT)&&function(t,e,n){const s=n.getActionsById(t.id),i=t.inst;e.element&&(t.element=e.element);for(let e=0;e<i.children.length;e++)pt(i.children,t,s.map,e,t.eidx);t.cc=i.children.length,n.setMountDeep(!1)}(t,e,n),G(i,l.MEMO_SLOT_OPT)&&function(t,e,n){const s=n.getActionsById(t.id),i=Boolean(s.move),r=Boolean(s.remove),c=Boolean(s.insert),l=Boolean(s.insert);(i&&!r||r&&!i)&&!c&&!l&&function(t,e){if(!q(t.inst))return;const n=e.getActionsById(t.id),s=t.inst.children;for(let t=0;t<s.length;t++){const e=s[t],i=j(e);if(null===i)return!1;const o=n.map[i];if(!o)return!1;const r=o.inst,a=e;if(!at(a)||!at(r)||a.type!==r.type||a.shouldUpdate(r.props,a.props))return!1}return!0}(t,n)&&(i&&function(t,e,n){const s=n.getActionsById(t.id);mt(t,e,n,((t,e)=>{s.move[e]&&(t.alt=(new ut).mutate(t),t.tag=o,t.mask|=a,n.addCandidate(t))}))}(t,e,n),r&&function(t,e,n){mt(t,e,n)}(t,e,n))}(t,e,n)}}}else n.addDeletion(e)}(t,u,c),function(t,n){const s=t.inst;let r=!1;var a;t.parent.tag===i&&(t.tag=t.parent.tag),32&t.parent.mask&&!t.parent.element&&!(W(a=s)&&a.value===e)&&(t.mask|=32),r=n&&t.tag!==i&&Y(n.inst,s)&&j(n.inst)===j(s),r&&!t.element&&n.element&&(t.element=n.element),t.tag=r?o:i,q(t.inst)&&(t.cc=t.inst.children.length),!t.element&&H(t.inst)&&(t.element=X.createElement(t.inst)),t.element&&t.increment()}(t,u)):t.mask&a&&(t.tag=o),c.addCandidate(t)}function Bt(t,e,n){const s=new ut(function(t,e,n){return t&&function(t,e){return!!(t&&e&&p(t)&&p(e)&&Y(t,e,!0))&&j(t)===j(e)}(e,n)?t.hook:p(n)?new ht:null}(t,t?t.inst:null,e),t?t.provider:null,n);return s.alt=t||null,s}function Wt(t,e,n,s){const i=j(e);if(null!==i){const e=n?t.id:t.parent.id,o=s.getActionsById(e);if(o){const t=o.move&&Boolean(o.move[i]),e=o.stable&&Boolean(o.stable[i]);if(t||e){const e=o.map[i];return t&&(e.mask|=a),e}return null}}return t.alt?n?t.alt.child||null:t.alt.next||null:null}function _t(t,e,n){let s=t.inst;const i=p(s),o=s;if(i)try{const i=n.getResourceId();let a=o.type(o.props,o.ref);const c=n.getDefers();if(c.length>0){const t=Promise.all(c.map((t=>t())));throw n.setResourceId(i),n.resetDefers(),n.navToPrev(),n.setNextUnitOfWork(e),ut.setNextId(e.id),t}E(a)?(!p(r=o)||r.token!==kt)&&(a=vt({slot:a})):k(a)&&(a=U(a)),o.children=a,X.detectIsPortal(s)&&t.markHost(16)}catch(e){if(e instanceof Promise)throw e;o.children=[],t.setError(e),((...t)=>{!y(console)&&console.error(...t)})(e)}else F(s)&&(s=s());var r;return q(s)&&(s.children=P(s.children,(t=>k(t)?U(t):t||function(t){return T(e=t)||!1===e?V():t;var e}(t))),i&&0===o.children.length&&o.children.push(V())),s}function Ft(t,e=!1){t.flush(),!e&&t.getEmitter().emit("finish"),t.runAfterCommit()}function $t(t){const e=t.copy(),n=t.getWorkInProgress(),s=n.child;return s&&(s.parent=null),n.child=n.alt.child,n.alt=null,t.applyCancels(),Ft(t,!0),Yt.cancelTask((t=>{const{fiber:n,setValue:i,resetValue:r}=t,a=it();g(i)&&i(),g(r)&&e.addCancel(r),n.alt=(new ut).mutate(n),n.tag=o,n.child=s,s&&(s.parent=n),e.setRoot(a.getRoot()),e.setWorkInProgress(n),((t,e=et)=>{Object.assign(nt.get(e),t)})(e)})),!1}const Vt=()=>({shouldUpdate:x,setValue:null,resetValue:null});class jt extends J{constructor(){super(),this.port1=null,this.port2=null,this.port1=new Gt(this),this.port2=new Gt(this)}}class Gt{constructor(t){this.offs=[],this.channel=t}on(t,e){const n=this.channel.on(t,e);this.offs.push(n)}postMessage(t){X.spawn((()=>{this.channel.emit("message",t)}))}unref(){this.offs.forEach((t=>t()))}}class Kt{constructor(t,e,n){this.taskRestorer=null,this.pendingSetter=null,this.id=++Kt.nextTaskId,this.callback=t,this.priority=e,this.forceAsync=n}getPriority(){return this.priority}getForceAsync(){return this.forceAsync}setIsTransition(t){this.isTransition=t}getIsTransition(){return this.isTransition}run(){this.callback(this.taskRestorer),this.taskRestorer=null}pending(t){this.isTransition&&this.pendingSetter&&this.pendingSetter(t)}markAsPending(){this.isPending=!0}canPending(){return!this.isPending&&g(this.pendingSetter)}markAsUnnecessary(){this.isUnnecessary=!0}getIsUnnecessary(){return this.isUnnecessary}setTaskRestorer(t){this.taskRestorer=t}setLocationCreator(t){this.locationCreator=t}createLocation(){return this.locationCreator()}setPendingSetter(t){this.pendingSetter=t}static detectHasRelatedUpdate(t,e,n=!1){const[s]=t.split(":");return e.some((e=>{const i=e.createLocation();return i===t||n&&i.length>t.length&&-1!==i.indexOf(s)}))}}Kt.nextTaskId=0;const qt=()=>t,Yt=new class{constructor(){this.queue={[c.HIGH]:[],[c.NORMAL]:[],[c.LOW]:[]},this.deadline=0,this.task=null,this.scheduledCallback=null,this.isMessageLoopRunning=!1,this.channel=null,this.port=null,this.channel=new jt,this.port=this.channel.port2,this.channel.port1.on("message",this.performWorkUntilDeadline.bind(this))}reset(){this.deadline=0,this.task=null,this.scheduledCallback=null,this.isMessageLoopRunning=!1}shouldYield(){return w()>=this.deadline}schedule(t,e){const{priority:n=c.NORMAL,forceAsync:s=!1,isTransition:i=!1,createLocation:o,setPendingStatus:r}=e||{},a=new Kt(t,n,s);a.setIsTransition(i),a.setPendingSetter(r),a.setLocationCreator(o||qt),this.put(a),this.execute()}hasPrimaryTask(){if(!this.task.getIsTransition())return!1;const{high:t,normal:e,low:n}=this.getQueues(),s=t.length>0||e.length>0,i=n.length>0;if(s||i){const o=this.task.createLocation();if(s)return(Kt.detectHasRelatedUpdate(o,t,!0)||Kt.detectHasRelatedUpdate(o,e,!0))&&this.task.markAsUnnecessary(),!0;if(i&&Kt.detectHasRelatedUpdate(o,n))return this.task.markAsUnnecessary(),!0}return!1}cancelTask(t){if(this.task.getIsUnnecessary())return this.complete(this.task);this.task.setTaskRestorer(t),this.defer(this.task)}complete(t){t.pending(!1)}put(t){const e=this.queue[t.getPriority()];if(t.getIsTransition()){const n=t.createLocation(),s=e.filter((t=>t.createLocation()!==n));e.splice(0,e.length,...s)}e.push(t)}pick(t){if(0===t.length)return!1;if(this.task=t.shift(),this.task.getIsTransition()&&this.task.canPending()){const t=this.task;return t.markAsPending(),this.defer(this.task),this.task=null,e=()=>t.pending(!0),Promise.resolve().then(e),!0}var e;return this.task.run(),this.task.getForceAsync()?this.requestCallbackAsync(Rt):this.requestCallback(Rt),!0}execute(){const t=Boolean(it()?.getWorkInProgress()),{high:e,normal:n,low:s}=this.getQueues();t||this.isMessageLoopRunning||this.pick(e)||this.pick(n)||this.pick(s)}requestCallbackAsync(t){this.scheduledCallback=t,this.isMessageLoopRunning||(this.isMessageLoopRunning=!0,this.port.postMessage(null))}requestCallback(t){t(!1),this.task=null,this.execute()}performWorkUntilDeadline(){if(this.scheduledCallback){this.deadline=w()+6;const t=this.scheduledCallback(!0);t?this.port.postMessage(null):null===t?setTimeout((()=>this.port.postMessage(null))):(this.complete(this.task),this.reset(),this.execute())}else this.isMessageLoopRunning=!1}defer(t){const{low:e}=this.getQueues();e.unshift(t)}getQueues(){return{high:this.queue[c.HIGH],normal:this.queue[c.NORMAL],low:this.queue[c.LOW]}}};function zt(t,e){const{idx:n}=e;return s=>{const i=it();if(i.getIsInsertionEffectsZone())return;const{owner:r}=e,a=g(s),l=i.getIsTransitionZone(),u=i.getIsBatchZone(),h=i.getIsEventZone(),d=l?c.LOW:h?c.HIGH:c.NORMAL,f=l,m=i.getPendingStatusSetter(),p=function(t){const{rootId:e,hook:n,isTransition:s,tools:i=Vt}=t;return t=>{st(e);const r=g(t),{shouldUpdate:a,setValue:c,resetValue:l}=i(),u=it(),h=n.owner,d=h.alt||h;a()&&function(t){let e=t;for(;e;){if("D"===e.tag)return!1;e=e.parent}return Boolean(t)}(d)&&!r?(g(c)&&c(),g(l)&&s&&u.addCancel(l),d.alt=(new ut).mutate(d),d.tag=o,d.cc=0,d.cec=0,d.child=null,u.setIsUpdateZone(!0),u.resetMount(),u.setWorkInProgress(d),u.setCursorFiber(d),d.inst=_t(d,null,u),u.setNextUnitOfWork(d)):r&&t({fiber:d,setValue:c,resetValue:l})}}({rootId:t,hook:e,isTransition:l,tools:a?s:void 0}),y={priority:d,forceAsync:f,isTransition:l,createLocation:()=>function(t,e,n){let s=n,i=`${n.idx}:${e}`;for(;s;)s=s.parent,s&&(i=`${s.idx}.${i}`);return i=`[${t}]${i}`,i}(t,n,r),setPendingStatus:m};u?function(t,e,n){if(it().getIsTransitionZone())e();else{const n=t.batch||{timer:null,changes:[]};t.batch=n,n.changes.push((()=>a&&s().setValue())),n.timer&&clearTimeout(n.timer),n.timer=setTimeout((()=>{n.changes.splice(-1),n.changes.forEach((t=>t())),t.batch=null,e()}))}}(r,(()=>Yt.schedule(p,y))):Yt.schedule(p,y)}}function Qt(t){const e=zt(et,it().getCursorFiber().hook),n=lt((()=>({value:g(t)?t():t})),[]),s=(i=t=>{const s=function(t){const{get:e,set:n,reset:s,next:i,shouldUpdate:o=x}=t,r=it().getIsBatchZone();return()=>{const t=e(),a=g(i)?i(t):i;return{shouldUpdate:()=>r||o(t,a),setValue:()=>n(a),resetValue:()=>s(t)}}}({next:t,get:()=>n.value,set:t=>n.value=t,reset:t=>n.value=t,shouldUpdate:(t,e)=>!Object.is(t,e)});e(s)},lt((()=>i),[]));var i;return[n.value,s]}function Xt(t,e){g(t)?t(e):function(t){if(!v(t)||b(t))return!1;const e=t;for(const t in e)if("current"===t&&e.hasOwnProperty(t))return!0;return!1}(t)&&(t.current=e)}function Jt(t,e,...s){if("string"==typeof t){const i=e||{};return i.as=t,i.slot=s,function(t){const e=()=>{const{as:e,slot:n,_void:s=!1,...i}=t,o=s?[]:E(n)?n:n?[n]:[];return new Z(e,i,o)};return e[C]=!0,e[O]=t.as,e[n]=t.key,e}(i)}if(g(t)){const n=e||{};return n.slot=1===s.length?s[0]:s,t(n)}return null}const te=Symbol("portal");f((t=>{const e=t.container,n=it().getCursorFiber();return lt((()=>e.innerHTML=""),[]),n.element=e,t.container=null,t.slot}),{token:te});const ee=t=>p(t)&&t.token===te;function ne(t){const e=(t=>ee(t.inst)?t.element:null)(t);e&&(e.innerHTML="")}class se{constructor(t){this.type="",this.sourceEvent=null,this.target=null,this.propagation=!0,this.type=t.sourceEvent.type,this.sourceEvent=t.sourceEvent,this.target=t.target}stopPropagation(){this.propagation=!1,this.sourceEvent.stopPropagation()}preventDefault(){this.sourceEvent.preventDefault()}getPropagation(){return this.propagation}}function ie(t,e,n){const s=it(),i=s.getEvents(),o=i.get(e),r=E(n)?t=>n[0](...n.slice(1),t):n;if(o)o.set(t,r);else{const n=t=>{const n=i.get(e).get(t.target),o=t.target;let r=null;if(g(n)&&(r=new se({sourceEvent:t,target:o}),s.setIsEventZone(!0),n(r),s.setIsEventZone(!1)),o.parentElement&&(!r||r.getPropagation())){const e=t.constructor;o.parentElement.dispatchEvent(new e(t.type,t))}};i.set(e,new WeakMap([[t,r]])),document.addEventListener(e,n,!0),s.addEventUnsubscriber((()=>document.removeEventListener(e,n,!0)))}}const oe=t=>t.startsWith("on"),re=t=>t.slice(2,t.length).toLowerCase(),ae="style",ce="class",le="className";let ue=[],he=[];const de=new Set(["svg","animate","animateMotion","animateTransform","circle","clipPath","defs","desc","ellipse","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence","filter","foreignObject","g","image","line","linearGradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialGradient","rect","stop","switch","symbol","text","textPath","tspan","use","view"]),fe=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]),me={[z.TAG]:t=>{const e=t.name;return function(t){return de.has(t)}(e)?document.createElementNS("http://www.w3.org/2000/svg",e):document.createElement(e)},[z.TEXT]:t=>document.createTextNode(t.value),[z.COMMENT]:t=>document.createComment(t.value)};function pe(t){return me[t.type](t)}function ge(t,e){const n=Object.keys(e);for(const s of n)t.style.setProperty(s,String(e[s]))}function ye(t,e,n){n?t.setAttribute(e,n):t.removeAttribute(e)}function ke(t){const{tagName:e,element:n,attrName:s,attrValue:i}=t,o=ve[e];let r=!!o&&o(n,s,i);return function(t,e){const n=Object.getPrototypeOf(t),s=Object.getOwnPropertyDescriptor(n,e);return Boolean(s?.set)}(n,s)&&(n[s]=i),!r&&I(i)&&(r=!s.includes("-")),r}const ve={input:(t,e,n)=>("value"===e?he.push((()=>{I(n)?t.checked=n:t.value=String(n)})):"autoFocus"===e&&he.push((()=>{t.autofocus=Boolean(n),t.autofocus&&t.focus()})),!1),textarea:(t,e,n)=>"value"===e&&(t.innerText=String(n),!0)};const Ie={[i]:t=>{t.element&&!ee(t.inst)&&function(t){const e=ft(t.parent),n=e.element,i=n.childNodes,o=it().getIsHydrateZone();if(o){const e=i[t.eidx];_(t.inst)&&e instanceof Text&&t.inst.value.length!==e.length&&e.splitText(t.inst.value.length),t.element=e}else 32&t.mask||(0===i.length||t.eidx>i.length-1?(r=e.inst.name,!fe.has(r)&&Te(t.element,n)):we(t.element,n.childNodes[t.eidx],n));var r;B(t.inst)&&function(t,e,n){const i=Object.keys(e.attrs),o=t;for(const r of i){const i=e.attrs[r];"$"!==r[0]&&(r!==s?r!==ce&&r!==le?r===ae&&i&&v(i)?ge(o,i):oe(r)?ie(o,re(r),i):n||y(i)||u[r]||!ke({tagName:e.name,element:o,attrValue:i,attrName:r})&&o.setAttribute(r,i):ye(o,ce,i):Xt(i,t))}}(t.element,t.inst,o)}(t)},[o]:t=>{t.mask&a&&(function(t){const e=function(t,e){const n=[];return dt(t,((t,e)=>{if(t.element)return!X.detectIsPortal(t.inst)&&n.push(t.element),e()})),n}(t),n=e[0].parentElement,s=new DocumentFragment,i=t.eidx;let o=0;for(const t of e)we(document.createComment(`${i}:${o}`),t,n),Te(t,s),o++;ue.push((()=>{for(let t=1;t<e.length;t++)Pe(n.childNodes[i+1],n);xe(s,n.childNodes[i],n)}))}(t),t.mask&=-129),t.element&&!ee(t.inst)&&function(t){const e=t.element,n=t.alt.inst,i=t.inst;$(i)?n.value!==i.value&&(e.textContent=i.value):function(t,e,n){const i=function(t,e){const n=new Set,s=Object.keys(t.attrs),i=Object.keys(e.attrs),o=Math.max(s.length,i.length);for(let t=0;t<o;t++)n.add(s[t]||i[t]);return n}(e,n),o=t;for(const r of i){const i=e.attrs[r],a=n.attrs[r];"$"!==r[0]&&(r!==s?r!==ce&&r!==le||i===a?r===ae&&a&&i!==a&&v(a)?ge(o,a):y(a)?o.removeAttribute(r):oe(r)?i!==a&&ie(o,re(r),a):u[r]||i===a||!ke({tagName:n.name,element:o,attrValue:a,attrName:r})&&o.setAttribute(r,a):ye(o,ce,a):Xt(i,t))}}(e,n,i)}(t)},D:function(t){const e=ft(t.parent);64&t.mask?e.element.innerHTML&&(e.element.innerHTML=""):dt(t,((t,n)=>{if(t.element)return!ee(t.inst)&&Me(t.element,e.element)&&Pe(t.element,e.element),n()}))},[r]:S};function Ee(){ue.forEach((t=>t())),he.forEach((t=>t())),ue=[],he=[]}const be=t=>Ie[t.tag](t),Te=(t,e)=>e.appendChild(t),we=(t,e,n)=>n.insertBefore(t,e),Se=(t,e,n)=>n.insertBefore(t,n.childNodes[e]),xe=(t,e,n)=>n.replaceChild(t,e),Me=(t,e)=>t.parentElement===e,Pe=(t,e)=>e.removeChild(t),Ae=new Map,Le=requestAnimationFrame.bind(void 0),Ce=cancelAnimationFrame.bind(void 0),Oe=Le;let Ne=!1;const Ze=t=>{let e=0;return function(t){let e,n=t.length;for(;0!=n;)e=Math.floor(Math.random()*n),n--,[t[n],t[e]]=[t[e],t[n]];return t}(Array(t).fill(0).map((()=>({id:++e,name:`${e}`}))))},Re=()=>document.body.clientHeight,De=f((({items:t,getKey:e,duration:n=1e3,slot:s})=>{const[i,o]=Qt(t),r=function(t=null){return lt((()=>({current:t})),[])}(null),a=lt((()=>({refs:{indexed:{},keyed:{}},rects:{},items:i,timerId:null,timerId2:null,firstRender:!0,isTransition:!1})),[]);Tt((()=>{const t=()=>{let t=0;for(const e of Array.from(r.current.children))a.rects[t]=e.getBoundingClientRect(),t++};return t(),window.addEventListener("resize",t),()=>window.removeEventListener("resize",t)}),[]),xt((()=>{a.firstRender||(a.isTransition=!0,!a.timerId&&c(i,!0),a.items=t,requestAnimationFrame((()=>{Re(),c(t,!1)})))}),[t]),Tt((()=>{a.firstRender||(Re(),l(i))}),[i]),Tt((()=>{a.firstRender=!1}),[i]);const c=(t,s)=>{let i=0;for(const o of t){const t=a.rects[i],r=e(o),c=a.refs.keyed[r];c.style.setProperty("position","absolute"),c.style.setProperty("width",`${t.width}px`),c.style.setProperty("height",`${t.height}px`),c.style.setProperty("transform",`translate(${t.left}px, ${t.top}px)`),s||(c.style.setProperty("transition",`transform ${n}ms ease-in-out, opacity ${n/2}ms ease-in-out`),c.style.setProperty("opacity","0.5")),i++}!s&&a.timerId&&window.clearTimeout(a.timerId),a.timerId=window.setTimeout((()=>{a.timerId=null,o(a.items)}),n)},l=t=>{for(const s of t){const t=e(s),i=a.refs.keyed[t];i.style.setProperty("transition",`opacity ${n/2}ms ease-in-out`),i.style.setProperty("opacity","1"),i.style.removeProperty("position"),i.style.removeProperty("width"),i.style.removeProperty("height"),i.style.removeProperty("transform")}a.isTransition=!1,a.timerId2&&window.clearTimeout(a.timerId2),a.timerId2=window.setTimeout((()=>{if(a.timerId2=null,!a.isTransition)for(const n of t){const t=e(n);a.refs.keyed[t].removeAttribute("style")}}),n/2)};return s({items:i,containerRef:r,itemRef:(t,e)=>n=>{a.refs.indexed[t]=n,a.refs.keyed[e]=n}})})),Ue=f((()=>{const[t,e]=Qt((()=>Ze(100)));return Jt(vt,null,Jt("div",{class:"content"},Jt(De,{items:t,getKey:t=>t.id,duration:1e3},(({items:t,containerRef:e,itemRef:n})=>Jt("div",{ref:e,class:"grid"},t.map(((t,e)=>{const s=t.id;return Jt("div",{ref:n(e,s),key:s,class:"grid-item"},Jt("span",null,t.name))}))))),Jt("div",{class:"button-layout"},Jt("button",{class:"button",onClick:()=>{e(Ze(t.length))}},"shuffle"))))}));var He;(He=document.getElementById("root"),{render:e=>function(e,n,s){!Ne&&(X.createElement=pe,X.insertElement=Se,X.raf=Le,X.caf=Ce,X.spawn=Oe,X.commit=be,X.finishCommit=Ee,X.detectIsDynamic=x,X.detectIsPortal=ee,X.unmountPortal=ne,X.chunk=S,Ne=!0);const r=!y(Ae.get(n)),a=g(s);let l=null;r?l=Ae.get(n):(l=Ae.size,Ae.set(n,l),!a&&(n.innerHTML="")),it(l)?.getIsInsertionEffectsZone()||Yt.schedule((()=>{st(l);const r=it(),c=r.getRoot(),u=Boolean(c),h=(new ut).mutate({element:n,inst:new Z(t,{},P([e||V()])),alt:c,tag:u?o:i});r.resetMount(),r.setWorkInProgress(h),r.setIsHydrateZone(a),r.setNextUnitOfWork(h),a&&s()}),{priority:c.NORMAL})}(e,He),unmount:()=>function(t){!function(t,e){if(y(t))return;const n=it(t);var s;Ot(n.getRoot()),n.unsubscribeEvents(),s=t,nt.delete(s),e()}(Ae.get(t),(()=>{Ae.delete(t),t.innerHTML=""}))}(He)}).render(Jt(Ue,null))})();
//# sourceMappingURL=build.js.map