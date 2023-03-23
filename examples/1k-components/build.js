(()=>{"use strict";var e,t,n=function(e,t,n,a){this.min=e,this.max=t,this.mean=n,this.last=a},a=function(){function e(e){this.samples=[],this.maxSamples=e,this._i=-1}return e.prototype.addSample=function(e){this._i=(this._i+1)%this.maxSamples,this.samples[this._i]=e},e.prototype.each=function(e){for(var t=this.samples,n=0;n<t.length;n++)e(t[(this._i+1+n)%t.length],n)},e.prototype.calc=function(){var e=this.samples;if(0===e.length)return new n(0,0,0,0);for(var t=e[(this._i+1)%e.length],a=t,c=0,o=0;o<e.length;o++){var i=e[(this._i+1+o)%e.length];i<t&&(t=i),i>a&&(a=i),c+=i}var r=e[this._i],f=c/e.length;return new n(t,a,f,r)},e}(),c=[],o=-1,i=(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])},function(t,n){function a(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(a.prototype=n.prototype,new a)}),r=function(){function e(e){var t=this;this._sync=function(){t.sync(),t._dirty=!1},this.name=e,this.element=document.createElement("div"),this.element.style.cssText="padding: 2px;background-color: #020;font-family: monospace;font-size: 12px;color: #0f0",this._dirty=!1,this.invalidate()}return e.prototype.invalidate=function(){var e;this._dirty||(this._dirty=!0,e=this._sync,c.push(e),-1===o&&requestAnimationFrame((function(e){o=-1;var t=c;c=[];for(var n=0;n<t.length;n++)t[n]()})))},e.prototype.sync=function(){throw new Error("sync method not implemented")},e}();!function(e){e[e.HideMin=1]="HideMin",e[e.HideMax=2]="HideMax",e[e.HideMean=4]="HideMean",e[e.HideLast=8]="HideLast",e[e.HideGraph=16]="HideGraph",e[e.RoundValues=32]="RoundValues"}(t||(t={}));var f=function(e){function n(n,a,c,o){var i=e.call(this,n)||this;i.flags=a,i.unitName=c,i.samples=o;var r=document.createElement("div");r.style.cssText="text-align: center",r.textContent=i.name;var f=document.createElement("div");return 0==(a&t.HideMin)?(i.minText=document.createElement("div"),f.appendChild(i.minText)):i.minText=null,0==(a&t.HideMax)?(i.maxText=document.createElement("div"),f.appendChild(i.maxText)):i.maxText=null,0==(a&t.HideMean)?(i.meanText=document.createElement("div"),f.appendChild(i.meanText)):i.meanText=null,0==(a&t.HideLast)?(i.lastText=document.createElement("div"),f.appendChild(i.lastText)):i.lastText=null,i.element.appendChild(r),i.element.appendChild(f),0==(a&t.HideGraph)?(i.canvas=document.createElement("canvas"),i.canvas.style.cssText="display: block; padding: 0; margin: 0",i.canvas.width=100,i.canvas.height=30,i.ctx=i.canvas.getContext("2d"),i.element.appendChild(i.canvas)):(i.canvas=null,i.ctx=null),i}return i(n,e),n.prototype.sync=function(){var e,n,a,c,o=this,i=this.samples.calc(),r=30/(1.2*i.max);0==(this.flags&t.RoundValues)?(e=i.min.toFixed(2),n=i.max.toFixed(2),a=i.mean.toFixed(2),c=i.last.toFixed(2)):(e=Math.round(i.min).toString(),n=Math.round(i.max).toString(),a=Math.round(i.mean).toString(),c=Math.round(i.last).toString()),null!==this.minText&&(this.minText.textContent="min:  "+e+this.unitName),null!==this.maxText&&(this.maxText.textContent="max:  "+n+this.unitName),null!==this.meanText&&(this.meanText.textContent="mean: "+a+this.unitName),null!==this.lastText&&(this.lastText.textContent="last: "+c+this.unitName),null!==this.ctx&&(this.ctx.fillStyle="#010",this.ctx.fillRect(0,0,100,30),this.ctx.fillStyle="#0f0",this.samples.each((function(e,t){o.ctx.fillRect(t,30,1,-e*r)})))},n}(r),s=(function(e){function t(t,n){var a=e.call(this,t)||this;return a.counter=n,a.text=document.createElement("div"),a.element.appendChild(a.text),a}i(t,e),t.prototype.sync=function(){this.text.textContent=this.name+": "+this.counter.value}}(r),null);function l(){s||((s=document.createElement("div")).style.cssText="position: fixed;opacity: 0.9;right: 0;bottom: 0",document.body.appendChild(s))}function d(e){for(var t=e.length/6|0,n=new Array(t),a=0;a<t;)n[a]="#"+e.slice(6*a,6*++a);return n}function u(e){var t=e.length;return function(n){return e[Math.max(0,Math.min(t-1,Math.floor(n*t)))]}}const h=u(d("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));u(d("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf")),u(d("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4")),u(d("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));const b="type",m="key",p="ref",E="flag";var v,g;!function(e){e[e.ANIMATION=3]="ANIMATION",e[e.HIGH=2]="HIGH",e[e.NORMAL=1]="NORMAL",e[e.LOW=0]="LOW"}(v||(v={})),function(e){e.HAS_NO_MOVES="HAS_NO_MOVES"}(g||(g={}));const y=e=>"function"==typeof e,x=e=>void 0===e,T=e=>"number"==typeof e,M=e=>"string"==typeof e,w=e=>"boolean"==typeof e,k=e=>Array.isArray(e),H=e=>null===e,C=e=>H(e)||x(e),S=()=>Date.now(),I=()=>{};function A(e){const t=[],n={0:{idx:0,source:e}};let a=0;do{const{source:e,idx:c}=n[a],o=e[c];c>=e.length?(a--,n[a]||(n[a]={idx:0,source:[]}),n[a].idx++):k(o)?(a++,n[a]={idx:0,source:o}):(t.push(o),n[a].idx++)}while(a>0||n[a].idx<n[a].source.length);return t}function N(e,t,n=!1){return e.reduce(((e,a)=>(e[t(a)]=!n||a,e)),{})}function O(e,t){if(!x(e)&&!x(t)&&e.length>0&&t.length>0)for(let n=0;n<t.length;n++)if(t[n]!==e[n])return!0;return!1}const P={displayName:"",token:Symbol("component"),keepRef:!1};class D{type;token;props;ref;displayName;children=[];shouldUpdate;constructor(e,t,n,a,c,o){this.type=e||null,this.token=t||null,this.props=n||null,this.ref=a||null,this.shouldUpdate=c||null,this.displayName=o||""}}function L(e,t={}){const n={...P,...t},{token:a,displayName:c,shouldUpdate:o,keepRef:i}=n;return(t={},n)=>(!i&&t.ref&&delete t.ref,new D(e,a,t,n,o,c))}const R=e=>e instanceof D,F={createNativeElement:()=>{throw new Error(_("createNativeElement"))},requestAnimationFrame:()=>{throw new Error(_("requestAnimationFrame"))},cancelAnimationFrame:()=>{throw new Error(_("cancelAnimationFrame"))},scheduleCallback:()=>{throw new Error(_("scheduleCallback"))},shouldYeildToHost:()=>{throw new Error(_("shouldYeildToHost"))},applyCommit:()=>{throw new Error(_("applyCommit"))},finishCommitWork:()=>{throw new Error(_("finishCommitWork"))},detectIsDynamic:()=>{throw new Error(_("detectIsDynamic"))},detectIsPortal:()=>{throw new Error(_("detectIsPortal"))},unmountPortal:()=>{throw new Error(_("unmountPortal"))},restart:()=>{throw new Error(_("restart"))}},_=e=>`${e} not installed by renderer`;let $=null;const U=new Map;class W{wipRoot=null;currentRoot=null;nextUnitOfWork=null;events=new Map;unsubscribers=[];candidates=new Set;deletions=new Set;fiberMount={level:0,navigation:{},isDeepWalking:!0};componentFiber=null;effects=[];layoutEffects=[];insertionEffects=[];isLayoutEffectsZone=!1;isInserionEffectsZone=!1;isUpdateHookZone=!1;isBatchZone=!1;isHydrateZone=!1;isHot=!1;lazy=new Set}const B=e=>{$=e,!U.get($)&&U.set($,new W)},G=()=>$,Z=(e=$)=>U.get(e),q=()=>Z()?.wipRoot||null,j=e=>Z().wipRoot=e,K=e=>Z().nextUnitOfWork=e,V=()=>Z()?.componentFiber,z=e=>Z().componentFiber=e,X=e=>Z().candidates.add(e),Y=e=>Z().deletions.add(e),J=()=>{Z().fiberMount={level:0,navigation:{},isDeepWalking:!0}},Q=()=>Z().fiberMount.isDeepWalking,ee=e=>Z().fiberMount.isDeepWalking=e,te={get:()=>Z().effects,reset:()=>Z().effects=[],add:e=>Z().effects.push(e)},ne={get:()=>Z().layoutEffects,reset:()=>Z().layoutEffects=[],add:e=>Z().layoutEffects.push(e)},ae={get:()=>Z().insertionEffects,reset:()=>Z().insertionEffects=[],add:e=>Z().insertionEffects.push(e)},ce=()=>Z()?.isLayoutEffectsZone||!1,oe=e=>Z().isLayoutEffectsZone=e,ie=e=>Z(e)?.isInserionEffectsZone||!1,re=e=>Z().isInserionEffectsZone=e,fe=()=>Z()?.isUpdateHookZone||!1,se=e=>Z().isUpdateHookZone=e,le=()=>Z()?.isHydrateZone||!1,de=e=>Z().isHydrateZone=e;var ue;!function(e){e.TAG="TAG",e.TEXT="TEXT",e.COMMENT="COMMENT"}(ue||(ue={}));const he=Symbol("virtual-node");class be{type=null;constructor(e){this.type=e}}class me extends be{name=null;attrs={};children=[];constructor(e,t,n){super(ue.TAG),this.name=e||this.name,this.attrs=t||this.attrs,this.children=n||this.children}}class pe extends be{value="";constructor(e){super(ue.TEXT),this.value=e}}class Ee extends be{value="";constructor(e){super(ue.COMMENT),this.value=e}}const ve=e=>e instanceof be,ge=e=>e instanceof me,ye=e=>e instanceof pe,xe=e=>y(e)&&!0===e[he],Te=()=>new Ee("dark:matter"),Me=e=>ye(e)||(e=>e instanceof Ee)(e);function we(e){const t=()=>{const{as:t,slot:n,_void:a=!1,...c}=e,o=a?[]:k(n)?n:n?[n]:[];return new me(t,c,o)};return t[he]=!0,t[m]=e.key,t[E]=e.flag,t[b]=e.as,t}function ke(e){return new pe(e+"")}ke.from=e=>ye(e)?e.value:e+"";const He=Symbol("memo"),Ce=e=>R(e)&&e.token===He;var Se;!function(e){e.CREATE="CREATE",e.UPDATE="UPDATE",e.DELETE="DELETE",e.SKIP="SKIP"}(Se||(Se={}));const Ie=Symbol("use-effect"),{useEffect:Ae,hasEffects:Ne,dropEffects:Oe}=Pe(Ie,te);function Pe(e,t){return{useEffect:function(n,a){const c=V().hook,{idx:o,values:i}=c,r=()=>{i[o]={deps:a,token:e,value:void 0},t.add((()=>{i[o].value=n()}))};if(x(i[o]))r();else{const{deps:e,value:t}=i[o];(!a||O(a,e))&&(y(t)&&t(),r())}c.idx++},hasEffects:function(t){const{values:n}=t.hook;return n.some((t=>t?.token===e))},dropEffects:function(t){const{values:n}=t;for(const t of n)if(t.token===e){const e=t.value;y(e)&&e()}}}}const De=Symbol("use-layout-effect"),{useEffect:Le,hasEffects:Re,dropEffects:Fe}=Pe(De,ne),_e=Symbol("use-insertion-effect"),{useEffect:$e,hasEffects:Ue,dropEffects:We}=Pe(_e,ae);function Be(e,t){let n=e,a=!0,c=!1,o=!1;const i={},r=e=>!i[e],f=()=>a=!1,s=()=>o=!0;for(;n&&(t({nextFiber:n,isReturn:c,resetIsDeepWalking:f,stop:s}),!o);)if(n.child&&a&&r(n.child.id)){const e=n.child;c=!1,n=e,i[e.id]=!0}else if(n.nextSibling&&r(n.nextSibling.id)){const e=n.nextSibling;a=!0,c=!1,n=e,i[e.id]=!0}else if(n.parent&&n.parent===e&&n.parent.nextSibling&&r(n.parent.nextSibling.id)){const e=n.parent.nextSibling;a=!0,c=!1,n=e,i[e.id]=!0}else n.parent&&n.parent!==e?(a=!1,c=!0,n=n.parent):n=null}function Ge(e){(e.insertionEffectHost||e.layoutEffectHost||e.effectHost||e.portalHost)&&Be(e,(({nextFiber:t,isReturn:n,stop:a})=>{if(t===e.nextSibling)return a();!n&&R(t.instance)&&(t.insertionEffectHost&&We(t.hook),t.layoutEffectHost&&Fe(t.hook),t.effectHost&&Oe(t.hook),t.portalHost&&F.unmountPortal(t))}))}const Ze=Symbol("fragment"),qe=L((({slot:e})=>e||null),{token:Ze}),je={[Se.CREATE]:!0};class Ke{id=0;nativeElement=null;parent=null;child=null;nextSibling=null;alternate=null;move=!1;effectTag=null;instance=null;hook=null;provider=null;effectHost=!1;layoutEffectHost=!1;insertionEffectHost=!1;portalHost=!1;childrenCount=0;childrenElementsCount=0;marker="";isUsed=!1;idx=0;elementIdx=0;batched=null;catchException;static nextId=0;constructor(e=null,t=null,n=0){this.id=++Ke.nextId,this.hook=e,this.provider=t,this.idx=n}mutate(e){const t=Object.keys(e);for(const n of t)this[n]=e[n];return this}markEffectHost(){this.effectHost=!0,this.parent&&!this.parent.effectHost&&this.parent.markEffectHost()}markLayoutEffectHost(){this.layoutEffectHost=!0,this.parent&&!this.parent.layoutEffectHost&&this.parent.markLayoutEffectHost()}markInsertionEffectHost(){this.insertionEffectHost=!0,this.parent&&!this.parent.insertionEffectHost&&this.parent.markInsertionEffectHost()}markPortalHost(){this.portalHost=!0,this.parent&&!this.parent.portalHost&&this.parent.markPortalHost()}incrementChildrenElementsCount(e=1,t=!1){!function(e,t=1,n=!1){if(!e.parent)return;const a=fe(),c=q(),o=a&&c.parent===e.parent;(Me(e.instance)||ge(e.instance)&&0===e.instance.children.length)&&(e.childrenElementsCount=1),a&&o&&!n||(e.parent.childrenElementsCount+=t,e.parent.nativeElement||e.parent.incrementChildrenElementsCount(t))}(this,e,t)}setError(e){y(this.catchException)?this.catchException(e):this.parent&&this.parent.setError(e)}}function Ve(){const e=q();let t=Z()?.nextUnitOfWork||null,n=!1,a=Boolean(t);for(;t&&!n;)t=ze(t),K(t),a=Boolean(t),n=F.shouldYeildToHost();return!t&&e&&function(){if(le()&&Z().lazy.size>0)return ut(null);const e=q(),t=F.detectIsDynamic(),n=Z().deletions,a=Z().candidates,c=fe();for(const e of n)Ge(e),F.applyCommit(e);t&&(re(!0),ae.get().forEach((e=>e())),re(!1)),c&&function(e){const t=e.childrenElementsCount-e.alternate.childrenElementsCount;if(0===t)return;const n=function(e){let t=e;for(;t&&(t=t.parent,!t||!t.nativeElement););return t}(e);let a=!1;e.incrementChildrenElementsCount(t,!0),Be(n.child,(({nextFiber:c,resetIsDeepWalking:o,isReturn:i,stop:r})=>c===n?r():c===e?(a=!0,o()):(c.nativeElement&&o(),void(a&&!i&&(c.elementIdx+=t)))))}(e);for(const e of a)F.applyCommit(e),e.alternate=null;e.alternate=null,F.finishCommitWork(),t&&(oe(!0),ne.get().forEach((e=>e())),oe(!1)),t&&function(){const e=te.get();e.length>0&&setTimeout((()=>e.forEach((e=>e()))))}(),ut(e)}(),a}function ze(e){let t=!0,n=e,a=e.instance;for(;;){if(t=Q(),n.hook&&(n.hook.idx=0),t)if(st(a)&&a.children.length>0){const{fiber$:e,instance$:t}=Xe(n,a);if(n=e,a=t,e)return e}else{const{fiber$$:e,fiber$:t,instance$:c}=Ye(n,a);if(n=t,a=c,e)return e}else{const{fiber$$:e,fiber$:t,instance$:c}=Ye(n,a);if(n=t,a=c,e)return e}if(null===n.parent)return null}}function Xe(e,t){(()=>{const{fiberMount:e}=Z(),t=e.level+1;e.level=t,e.navigation[t]=0})();const n=e.alternate?e.alternate.child:null,a=dt(n,n?n.instance:null,st(t)?t.children[0]:null),c=n?n.provider:null,o=new Ke(a,c,0);return z(o),o.parent=e,e.child=o,o.elementIdx=e.nativeElement?0:e.elementIdx,t=at(t,0,o),n&&tt(n,t),Je(o,n,t),n&&Ce(o.instance)&&nt(o,n,t),X(o),{fiber$:o,instance$:t}}function Ye(e,t){(()=>{const{fiberMount:e}=Z(),t=e.level,n=e.navigation[t]+1;e.navigation[t]=n})();const n=e.parent.instance,a=Z().fiberMount.navigation[Z().fiberMount.level];if(st(n)&&n.children[a]){ee(!0);const c=e.alternate?e.alternate.nextSibling:null,o=dt(c,c?c.instance:null,st(n)?n.children[a]:null),i=c?c.provider:null,r=new Ke(o,i,a);return z(r),r.parent=e.parent,e.nextSibling=r,r.elementIdx=e.elementIdx+(e.nativeElement?1:e.childrenElementsCount),t=at(n,a,r),c&&tt(c,t),Je(r,c,t),c&&Ce(r.instance)&&nt(r,c,t),X(r),{fiber$$:r,fiber$:r,instance$:t}}return(()=>{const{fiberMount:e}=Z(),t=e.level,n=t-1;e.navigation[t]=0,e.level=n})(),ee(!1),t=(e=e.parent).instance,st(e.instance)&&(e.instance.children=[]),{fiber$$:null,fiber$:e,instance$:t}}function Je(e,t,n){let a=!1;if(je[e.parent.effectTag]&&(e.effectTag=e.parent.effectTag),e.effectTag!==Se.CREATE){const e=Boolean(t),c=(e?it(t.instance):null)===(e?it(n):null);a=e&&lt(t.instance,n)&&c}e.instance=n,e.alternate=t||null,e.nativeElement=a?t.nativeElement:null,e.effectTag=a?Se.UPDATE:Se.CREATE,t&&t.move&&(e.move=t.move,t.move=!1),st(e.instance)&&(e.childrenCount=e.instance.children.length),!e.nativeElement&&ve(e.instance)&&(e.nativeElement=F.createNativeElement(e.instance),e.effectTag=Se.CREATE),e.nativeElement&&e.incrementChildrenElementsCount()}function Qe(e,t,n){return 0===e||t.child&&t.child.effectTag===Se.DELETE?(t.child=n,n.parent=t):(t.nextSibling=n,n.parent=t.parent),n}function et(e,t){return(new Ke).mutate({instance:Te(),parent:e,marker:t+"",effectTag:Se.CREATE})}function tt(e,t){const n=lt(e.instance,t),a=function(e){return R(e)?(e=>e.props[E]||null)(e):xe(e)?e[E]||null:ge(e)?e.attrs[E]||null:null}(t),c=a&&a[g.HAS_NO_MOVES];if(e.isUsed=!0,n){if(st(e.instance)&&st(t)&&(!c||e.childrenCount!==t.children.length)){const{prevKeys:n,nextKeys:a,prevKeysMap:c,nextKeysMap:o,keyedFibersMap:i}=function(e,t){let n=e,a=0;const c=[],o=[],i={},r={},f={};for(;n||a<t.length;){if(n){const e=it(n.instance),t=C(e)?ot(a):e;c.push(t),i[t]=!0,f[t]=n}if(t[a]){const e=it(t[a]),n=C(e)?ot(a):e;o.push(n),r[n]=!0}n=n?n.nextSibling:null,a++}return{prevKeys:c,nextKeys:o,prevKeysMap:i,nextKeysMap:r,keyedFibersMap:f}}(e.child,t.children);let r=[],f=Math.max(n.length,a.length),s=e,l=0,d=0,u=0;for(let t=0;t<f;t++){const h=a[t-u]??null,b=n[t-d]??null,m=i[b]||null,p=i[h]||et(e,h);h!==b?null===h||c[h]?o[b]?o[b]&&o[h]&&(r.push([[h,b],"move"]),p.effectTag=Se.UPDATE,m.effectTag=Se.UPDATE,p.move=!0,s=Qe(t,s,p)):(r.push([b,"remove"]),m.effectTag=Se.DELETE,Y(m),u++,l--,f++):(null===b||o[b]?(r.push([h,"insert"]),p.effectTag=Se.CREATE,d++,f++):(r.push([[h,b],"replace"]),p.effectTag=Se.CREATE,m.effectTag=Se.DELETE,Y(m)),s=Qe(t,s,p)):null!==h&&(r.push([h,"stable"]),p.effectTag=Se.UPDATE,s=Qe(t,s,p)),p.idx=l,l++}r=[]}}else(function(e){let t=e.parent;for(;t;){if(t.effectTag===Se.DELETE)return!1;t=t.parent}return!0})(e)&&(e.effectTag=Se.DELETE,Y(e))}function nt(e,t,n){const a=t.instance,c=n;if(e.move||c.type!==a.type)return;const o=a.props,i=c.props;if(!c.shouldUpdate(o,i)){ee(!1);const n=e.elementIdx-t.elementIdx,a=0!==n;e.mutate({...t,alternate:t,id:e.id,idx:e.idx,parent:e.parent,nextSibling:e.nextSibling,elementIdx:e.elementIdx,effectTag:Se.SKIP}),Be(e.child,(({nextFiber:c,stop:o})=>{if(c===e.nextSibling||c===e.parent)return o();if(c.parent===t&&(c.parent=e),a){if(c.elementIdx+=n,c.parent!==e&&c.nativeElement)return o()}else if(c===t.child.child)return o()})),e.incrementChildrenElementsCount(t.childrenElementsCount),t.effectHost&&e.markEffectHost(),t.layoutEffectHost&&e.markLayoutEffectHost(),t.insertionEffectHost&&e.markInsertionEffectHost(),t.portalHost&&e.markPortalHost()}}function at(e,t,n){let a=null;if(st(e)){const c=k(e.children[t])?A([e.children[t]]):[e.children[t]];e.children.splice(t,1,...c),a=e.children[t],a=ct(n,a)}return R(a)&&(Ne(n)&&n.markEffectHost(),Re(n)&&n.markLayoutEffectHost(),Ue(n)&&n.markInsertionEffectHost(),F.detectIsPortal(a)&&n.markPortalHost()),a}function ct(e,t){const n=R(t),a=t;if(n)try{let e=a.type(a.props,a.ref);k(e)&&!(e=>R(e)&&e.token===Ze)(a)?e=qe({slot:e}):(M(e)||T(e))&&(e=ke(e)),a.children=k(e)?A([e]):[e]}catch(t){a.children=[],e.setError(t),function(...e){!x(console)&&console.error(...e)}(t)}else xe(t)&&(t=t());if(st(t)){t.children=n?t.children:k(t.children)?A([t.children]):[t.children];for(let e=0;e<t.children.length;e++)t.children[e]||(t.children[e]=rt(t.children[e]));n&&0===a.children.length&&a.children.push(Te())}return t}function ot(e){return`dark:idx:${e}`}function it(e){var t,n;return R(e)?(e=>C(e.props[m])?null:e.props[m])(e):xe(e)?C((n=e)[m])?null:n[m]:ge(e)?C((t=e).attrs[m])?null:t.attrs[m]:null}function rt(e){return H(t=e)||x(t)||!1===t?Te():e;var t}function ft(e){return xe(e)?e[b]:ge(e)?e.name:ve(e)||R(e)?e.type:null}function st(e){return ge(e)||R(e)}function lt(e,t,n=!1){if(n){const n=t;return e.type===n.type}return ft(e)===ft(t)}function dt(e,t,n){return e&&function(e,t){return!!(e&&t&&R(e)&&R(t)&&lt(e,t,!0))&&it(e)===it(t)}(t,n)?e.hook:R(n)?{idx:0,values:[]}:null}function ut(e){var t;j(null),Z().candidates=new Set,Z().deletions=new Set,ae.reset(),ne.reset(),te.reset(),fe()?se(!1):(t=e,Z().currentRoot=t)}const ht=L((({slot:e})=>e),{token:He});function bt(e,t=!1){return function(e,t){const n=e=>xe(e)||R(e);if(k(e)?n(e[0]):n(e)){const n=ht({slot:qe({slot:e})});return n.shouldUpdate=()=>t,n}return e}(e(),t)}function mt(e,t){const n=V(),{hook:a}=n,{idx:c,values:o}=a;if(x(o[c])){const n=bt(e);return o[c]={deps:t,value:n},a.idx++,n}const i=o[c],r=O(t,i.deps),f=r?e:()=>i.value;return i.deps=t,i.value=bt(f,r),a.idx++,i.value}function pt(e){const t=G(),n=mt((()=>({fiber:null})),[]);return n.fiber=V(),a=>{if(ie())return;const c=function(e){const{rootId:t,fiber:n,forceStart:a=!1,onStart:c}=e;return()=>{n.effectTag!==Se.DELETE&&(a&&c(),n.isUsed||(!a&&c(),B(t),se(!0),J(),n.alternate=(new Ke).mutate({...n}),n.marker="🍒",n.effectTag=Se.UPDATE,n.childrenElementsCount=0,n.child=null,j(n),z(n),n.instance=ct(n,n.instance),K(n)))}}({rootId:t,fiber:n.fiber,forceStart:Boolean(e?.timeoutMs),onStart:a||I});ce()&&(e={...e||{},forceSync:!0}),Z()?.isBatchZone?function(e,t){e.batched&&clearTimeout(e.batched),e.batched=setTimeout((()=>{var n;n=!1,Z().isBatchZone=n,e.batched=null,t()}))}(n.fiber,(()=>F.scheduleCallback(c,e))):F.scheduleCallback(c,e)}}function Et(e){return(e=e.map((e=>M(e)||T(e)?ke(e.toString()):e)))?Array.isArray(e)?[...e]:[e]:[]}function vt(e,t,...n){if(M(e))return we({...t,as:e,slot:Et(n)});if(y(e)){let a=Et(n);return a=1===a.length?a[0]:a,e({...t,slot:a})}return null}const gt=Symbol("portal");L((({slot:e,...t})=>(mt((()=>t[gt].innerHTML=""),[]),e)),{token:gt});const yt=e=>R(e)&&e.token===gt,xt=e=>yt(e)?e.props[gt]:null;function Tt(e){const t=xt(e.instance);t&&(t.innerHTML="")}class Mt{type="";sourceEvent=null;target=null;propagation=!0;constructor(e){this.type=e.sourceEvent.type,this.sourceEvent=e.sourceEvent,this.target=e.target}stopPropagation(){this.propagation=!1,this.sourceEvent.stopPropagation()}preventDefault(){this.sourceEvent.preventDefault()}getPropagation(){return this.propagation}}function wt(e){const{target:t,eventName:n,handler:a}=e,c=Z().events,o=c.get(n);if(o)o.set(t,a);else{const e=e=>{const t=c.get(n).get(e.target),a=e.target;let o=null;y(t)&&(o=new Mt({sourceEvent:e,target:a}),t(o)),(o?o.getPropagation():a.parentElement)&&a.parentElement.dispatchEvent(new e.constructor(e.type,e))};c.set(n,new WeakMap([[t,a]])),document.addEventListener(n,e,!0),i=()=>document.removeEventListener(n,e,!0),Z().unsubscribers.push(i)}var i}const kt=e=>e.startsWith("on"),Ht=e=>e.slice(2,e.length).toLowerCase(),Ct={[m]:!0,[p]:!0,[E]:!0},St={transform:!0,fill:!0};let It=[];const At=N("svg,animate,animateMotion,animateTransform,circle,clipPath,defs,desc,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,image,line,linearGradient,marker,mask,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,stop,switch,symbol,text,textPath,tspan,use,view".split(","),(e=>e)),Nt=N("area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr".split(","),(e=>e)),Ot={[ue.TAG]:e=>{const t=e;return n=t.name,Boolean(At[n])?document.createElementNS("http://www.w3.org/2000/svg",t.name):document.createElement(t.name);var n},[ue.TEXT]:e=>document.createTextNode(e.value),[ue.COMMENT]:e=>document.createComment(e.value)};function Pt(e){return Ot[e.type](e)}function Dt(e,t){!function(e,t){y(e)?e(t):function(e){if("object"!=typeof e||H(e))return!1;const t=e;for(const e in t)if("current"===e&&t.hasOwnProperty(e))return!0;return!1}(e)&&(e.current=t)}(e,t)}function Lt(e){const{tagName:t,element:n,attrName:a,attrValue:c}=e,o=Rt[t];let i=!!o&&o(n,a,c);var r,f;return f=a,(r=Object.getPrototypeOf(n)).hasOwnProperty(f)&&Boolean(Object.getOwnPropertyDescriptor(r,f)?.set)&&(n[a]=c),!i&&w(c)&&(i=!a.includes("-")),i}const Rt={input:(e,t,n)=>("value"===t&&w(n)?e.checked=n:"autoFocus"===t&&(e.autofocus=Boolean(n)),!1),textarea:(e,t,n)=>"value"===t&&(e.innerHTML=String(n),!0)};function Ft(e){let t=e;for(;t;)if(t=t.parent,yt(t.instance)&&(t.nativeElement=xt(t.instance)),t.nativeElement)return t;return t}const _t={[Se.CREATE]:e=>{null!==e.nativeElement&&function(e){const t=Ft(e),n=t.nativeElement,a=n.childNodes;if(le()){const t=a[e.elementIdx];ye(e.instance)&&t instanceof Text&&e.instance.value.length!==t.length&&t.splitText(e.instance.value.length),e.nativeElement=t}else 0===a.length||e.elementIdx>a.length-1?(c=t.instance.name,!Boolean(Nt[c])&&function(e,t){t.appendChild(e.nativeElement)}(e,n)):function(e,t){t.insertBefore(e.nativeElement,t.childNodes[e.elementIdx])}(e,n);var c;ge(e.instance)&&function(e,t){const n=Object.keys(t.attrs),a=e;for(const c of n){const n=t.attrs[c];c!==p?y(n)?kt(c)&&wt({target:a,handler:n,eventName:Ht(c)}):x(n)||Ct[c]||!Lt({tagName:t.name,element:a,attrValue:n,attrName:c})&&a.setAttribute(c,n):Dt(n,e)}}(e.nativeElement,e.instance)}(e)},[Se.UPDATE]:e=>{e.move&&(function(e){const t=function(e){const t=[];return Be(e,(({nextFiber:n,isReturn:a,resetIsDeepWalking:c,stop:o})=>n===e.nextSibling||n===e.parent?o():!a&&n.nativeElement?(!yt(n.instance)&&t.push(n.nativeElement),c()):void 0)),t}(e),n=t[0].parentElement,a=new DocumentFragment,c=e.elementIdx;let o=0;for(const e of t)n.insertBefore(document.createComment(`${c}:${o}`),e),a.appendChild(e),o++;It.push((()=>{for(let e=1;e<t.length;e++)n.removeChild(n.childNodes[c+1]);n.replaceChild(a,n.childNodes[c])}))}(e),e.move=!1),null!==e.nativeElement&&function(e){const t=e.nativeElement,n=e.alternate.instance,a=e.instance;Me(n)&&Me(a)?n.value!==a.value&&(t.textContent=a.value):function(e,t,n){const a=Object.keys(n.attrs),c=e;for(const o of a){const a=t.attrs[o],i=n.attrs[o];o!==p?x(i)?c.removeAttribute(o):y(a)?kt(o)&&a!==i&&wt({target:c,handler:i,eventName:Ht(o)}):Ct[o]||a===i||(St[o]||!Lt({tagName:n.name,element:c,attrValue:i,attrName:o}))&&c.setAttribute(o,i):Dt(a,e)}}(t,n,a)}(e)},[Se.DELETE]:e=>function(e){const t=Ft(e);Be(e,(({nextFiber:n,isReturn:a,resetIsDeepWalking:c,stop:o})=>n===e.nextSibling||n===e.parent?o():!a&&n.nativeElement?(!yt(n.instance)&&t.nativeElement.removeChild(n.nativeElement),c()):void 0))}(e),[Se.SKIP]:()=>{}};function $t(e){_t[e.effectTag](e)}function Ut(){for(const e of It)e();It=[],de(!1)}const Wt={animations:[],hight:[],normal:[],low1:[],low2:[]};let Bt=null,Gt=0,Zt=!1,qt=null;class jt{static nextTaskId=0;id;time;timeoutMs;priority;forceSync;callback;constructor(e){this.id=++jt.nextTaskId,this.time=e.time,this.timeoutMs=e.timeoutMs,this.priority=e.priority,this.forceSync=e.forceSync,this.callback=e.callback}}const Kt=()=>S()>=Gt;function Vt(e,t){const{priority:n=v.NORMAL,timeoutMs:a=0,forceSync:c=!1}=t||{},o=new jt({time:S(),timeoutMs:a,priority:n,forceSync:c,callback:e});({[v.ANIMATION]:()=>Wt.animations.push(o),[v.HIGH]:()=>Wt.hight.push(o),[v.NORMAL]:()=>Wt.normal.push(o),[v.LOW]:()=>o.timeoutMs>0?Wt.low2.push(o):Wt.low1.push(o)})[o.priority](),Xt()}function zt(e){if(!e.length)return!1;qt=e.shift();const t=qt.priority===v.ANIMATION;return qt.callback(),qt.forceSync||t?function(e){for(;e(););Xt(),qt=null}(Ve):(Bt=Ve,Zt||(Zt=!0,Jt.postMessage(null))),!0}function Xt(){Boolean(q())||function(){const[e]=Wt.low2;return!!(e&&S()-e.time>e.timeoutMs)&&(zt(Wt.low2),!0)}()||(Wt.low1.length>1e5&&(Wt.low1=[]),0)||zt(Wt.animations)||zt(Wt.hight)||zt(Wt.normal)||requestIdleCallback((()=>zt(Wt.low1)||zt(Wt.low2)))}let Yt=null,Jt=null;Yt=new MessageChannel,Jt=Yt.port2,Yt.port1.onmessage=function(){if(Bt){Gt=S()+4;try{Bt()?Jt.postMessage(null):(qt=null,Zt=!1,Bt=null,Xt())}catch(e){throw Jt.postMessage(null),e}}else Zt=!1};let Qt=!1;const en=new Map;!function(e){void 0===e&&(e=t.HideMin|t.HideMax|t.HideMean|t.RoundValues),l();var n=new a(100),c=new f("FPS",e,"",n);s.appendChild(c.element);var o=0,i=60;requestAnimationFrame((function e(t){o>0&&(i+=.01652892561983471*(1e3/(t-o)-i)),o=t,n.addSample(i),c.invalidate(),requestAnimationFrame(e)}))}(),function(e){if(void 0===e&&(e=t.HideMin|t.HideMean),l(),void 0!==performance.memory){var n=new a(100),c=new f("Memory",e,"MB",n);s.appendChild(c.element),function e(){n.addSample(Math.round(performance.memory.usedJSHeapSize/1048576)),c.invalidate(),setTimeout(e,30)}()}}();const tn=L((()=>{const[e,t]=function(e,t){const n=pt(t),a=mt((()=>({value:y(e)?e():e})),[]),c=(o=e=>{const c=a.value,o=y(e)?e(c):e;if(!Object.is(c,o)){const e=()=>a.value=o;t?.priority===v.LOW?n((()=>e())):(e(),n())}},mt((()=>o),[]));var o;return[a.value,c]}(1e3,{priority:v.HIGH});return vt("div",{class:"app-wrapper"},vt(an,{count:e}),vt("div",{class:"controls"},"# Points",vt("input",{type:"range",min:10,max:1e4,value:e,onInput:e=>{t(Number(e.target.value))}}),e),vt("div",{class:"about"},"Dark 1k Components Demo based on the"," ",vt("a",{href:"https://infernojs.github.io/inferno/1kcomponents/",target:"_blank"}," ","Inferno demo")," ","based on Glimmer demo by"," ",vt("a",{href:"http://mlange.io",target:"_blank"},"Michael Lange"),"."))})),nn=[0,3,0,1,2],an=L((({count:e})=>{const t=pt(),n=mt((()=>({layout:0,phyllotaxis:hn(100),grid:bn(100),wave:mn(100),spiral:pn(100),points:[],step:0,numSteps:120})),[]);Ae((()=>{0!==e&&(n.phyllotaxis=hn(e),n.grid=bn(e),n.wave=mn(e),n.spiral=pn(e),n.points=on(e,n))}),[e]),Ae((()=>{a()}),[]);const a=()=>{n.step=(n.step+1)%n.numSteps,0===n.step&&(n.layout=(n.layout+1)%nn.length);const e=Math.min(1,n.step/(.8*n.numSteps)),c=nn[n.layout],o=nn[(n.layout+1)%nn.length],i=ln(c),r=ln(o),f=dn(c),s=dn(o);for(const t of n.points)t.x=un(t,e,i,r),t.y=un(t,e,f,s);t(),requestAnimationFrame((()=>{a()}))};return vt("svg",{class:"demo",flag:cn},vt("g",{flag:cn},fn(n.points,rn)))})),cn={[g.HAS_NO_MOVES]:!0},on=(e,t)=>{const n=[];for(let t=0;t<e;t++)n.push({x:0,y:0,color:h(t/e)});return((e,t)=>(e.map(((e,n)=>{const[a,c]=En(t.grid(n)),[o,i]=En(t.wave(n)),[r,f]=En(t.spiral(n)),[s,l]=En(t.phyllotaxis(n));Object.assign(e,{gx:a,gy:c,wx:o,wy:i,sx:r,sy:f,px:s,py:l})})),e))(n,t)},rn=(e,t)=>we({as:"rect",class:"point",key:t,flag:cn,transform:`translate(${Math.floor(e.x)}, ${Math.floor(e.y)})`,fill:e.color}),fn=(e,t)=>{const n=[];for(let a=0;a<e.length;a++)n.push(t(e[a],a));return n},sn=Math.PI*(3-Math.sqrt(5));function ln(e){switch(e){case 0:return"px";case 1:return"gx";case 2:return"wx";case 3:return"sx"}}function dn(e){switch(e){case 0:return"py";case 1:return"gy";case 2:return"wy";case 3:return"sy"}}function un(e,t,n,a){const c=e[n];return c+(e[a]-c)*t}function hn(e){return t=>{const n=Math.sqrt(t/e),a=t*sn;return[n*Math.cos(a),n*Math.sin(a)]}}function bn(e){const t=Math.round(Math.sqrt(e));return e=>[1.6/t*(e%t)-.8,1.6/t*Math.floor(e/t)-.8]}function mn(e){const t=2/(e-1);return e=>{const n=e*t-1;return[n,.3*Math.sin(n*Math.PI*3)]}}function pn(e){return t=>{const n=Math.sqrt(t/(e-1)),a=n*Math.PI*10;return[n*Math.cos(a),n*Math.sin(a)]}}function En(e){const t=window.innerHeight/2,n=window.innerWidth/2;return function(e,t){return t.map(((t,n)=>t+e[n]))}([n,t],function(e,t){return t.map((t=>t*e))}(Math.min(t,n),e))}!function(e,t,n=!1){if(!Qt&&function(){F.createNativeElement=Pt,F.requestAnimationFrame=requestAnimationFrame.bind(this),F.cancelAnimationFrame=cancelAnimationFrame.bind(this),F.scheduleCallback=Vt,F.shouldYeildToHost=Kt,F.applyCommit=$t,F.finishCommitWork=Ut,F.detectIsDynamic=()=>!0,F.detectIsPortal=yt,F.unmountPortal=Tt,F.restart=()=>{},Qt=!0}(),!(t instanceof Element))throw new Error("[Dark]: render receives only Element as container!");const a=!x(en.get(t));let c=null;a?c=en.get(t):(c=en.size,en.set(t,c),n||(t.innerHTML="")),ie(c)||F.scheduleCallback((()=>{B(c);const a=Z(r)?.currentRoot||null,o=Boolean(a),i=(new Ke).mutate({nativeElement:t,instance:new me("root",{},A([e||Te()])),alternate:a,effectTag:o?Se.UPDATE:Se.CREATE});var r;J(),j(i),de(n),K(i)}),{priority:v.NORMAL,forceSync:n||ce()})}(vt(tn,null),document.getElementById("root"))})();
//# sourceMappingURL=build.js.map