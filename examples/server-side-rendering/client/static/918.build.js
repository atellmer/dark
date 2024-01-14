"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[918],{38:(e,r,t)=>{t.d(r,{G:()=>n});var o=t(654),i=t(524);const n=(0,o.wU)((({slot:e})=>(0,i.h)("article",{class:"fade animated-route"},e)))},918:(e,r,t)=>{t.r(r),t.d(r,{default:()=>L});var o=t(654),i=t(750),n=t(760),s=t(544),a=t(238),l=t(47),c=t(435),u=t(261),d=t(443),h=t(812);function m(e,r){const[t,o]=r;e.isFetching=!1,e.isLoaded=!0,e.data=t,e.error=o}var p=t(524),f=t(113),g=t(397),b=t(940),w=t(450),v=t(752),y=t(169),$=t(550),k=t(38);new class{constructor(){this.endpoint="https://jsonplaceholder.typicode.com/posts"}async fetchPost(e){const r=await fetch(`${this.endpoint}/${e}`);return await r.json()}async fetchComments(e){const r=await fetch(`${this.endpoint}/${e}/comments`);return await r.json()}async fetchPostAndComments(e){return await Promise.all([this.fetchPost(e),this.fetchComments(e)])}};const x=(0,o.wU)((({slot:e})=>{const{url:r}=function(){const e=(0,f.M6)();(0,f.BU)(e);const r=(0,f._L)(),{location:{pathname:t}}=e,o=(0,u.Y)((()=>r?(0,g.L7)(t,r):""),[r,t]);return{path:r,url:o}}(),t=(0,b.k)(),o=(0,w.U)(),$=(0,v.T)(),[x,L]=(0,i.e)(0),C=function(e,r=[]){const t=(0,u.Y)((()=>({isFetching:!0,isLoaded:!1,data:null,error:null})),[]),{register:o,unregister:i}=(0,l.h)(),[p,f]=function(){const e=(0,u.Y)((()=>({isMounted:!0,isFirstTime:!0})),[]),{isFirstTime:r}=e;return(0,n.b)((()=>(e.isFirstTime=!1,()=>e.isMounted=!1)),[]),[()=>e.isMounted,()=>r]}(),g=(0,c.P)(),b=()=>p()&&g(),w=(0,d.pj)(),v=(0,u.Y)((()=>w.getNextResourceId()),[]),y=String(v),$=(0,s.X)(),k=w.getIsHydrateZone(),x=async()=>{try{$||f()||(t.isFetching=!0,b());const r=await e();return $?w.setResource(v,[r,null]):(i(y),t.data=r,t.isFetching=!1,t.error=null),r}catch(e){(0,h.vU)(e),$?w.setResource(v,[null,String(e)]):(i(y),t.isFetching=!1,t.error=String(e))}finally{$||(t.isLoaded=!0,b())}};if((0,a.d4)((()=>{!k&&x()}),[...r]),(0,a.d4)((()=>()=>i(y)),[]),$||k){const e=w.getResource(v);if($)e?m(t,e):w.defer(x);else if(k){if(!e)throw new Error("[Dark]: can not read app state from the server!");m(t,e)}}else f()&&o(y);return{loading:t.isFetching,data:t.data,error:t.error,refetch:x}}((()=>new Promise((e=>setTimeout((()=>e([{userId:1,id:1,title:"Hello world",body:"Lorem ipsum, dolor sit amet consectetur adipisicing elit."},[{postId:1,id:1,name:"Alex",email:"alex@gmail.com",body:"wedwed wefwefwe ewfwef"}]])),300)))),[Number(o.get("id"))]),{data:U,loading:A,error:P}=C;if((0,a.d4)((()=>{"null"===o.get("id")&&t.push("/home/888")}),[$.url]),A)return(0,p.h)("div",null,"LOADING...");if(P)return(0,p.h)("div",null,"error: ",P);const[E,I]=U;return(0,p.h)(k.G,null,(0,p.h)("h1",null,"Home"),(0,p.h)("header",null,(0,p.h)(y.r,{to:`${r}a`},"child route a"),(0,p.h)(y.r,{to:`${r}b`},"child route b"),(0,p.h)(y.r,{to:`${r}c`},"child route c"),(0,p.h)(F,{$primary:!0,onClick:()=>L(x+1)},"fired ",x," times")),(0,p.h)("p",null,"Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero excepturi quae harum laborum temporibus? Repellendus laboriosam sunt corporis quasi. Quo accusamus aperiam consequuntur quia veritatis nobis minima omnis error expedita!"),(0,p.h)("div",null,(0,p.h)("h4",null,E.title),(0,p.h)("p",null,E.body),(0,p.h)("ul",null,I.map((e=>(0,p.h)("li",{key:e.id},(0,p.h)("b",null,e.email),(0,p.h)("div",null,e.body)))))),e)})),F=$.zo.button`
  display: inline-block;
  font-size: 1rem;
  padding: 0.5rem 0.7rem;
  background-color: var(--color);
  color: var(--text-color);
  border: 1px solid var(--color);
  border-radius: 3px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: var(--hover-color);
  }
  &:active {
    background-color: var(--color);
  }

  ${e=>$.iv`
    --color: ${e.$primary?"#BA68C8":"#eee"};
    --hover-color: ${e.$primary?"#8E24AA":"#E0E0E0"};
    --text-color: ${e.$primary?"#fff":"#000"};
  `}
`,L=x},450:(e,r,t)=>{t.d(r,{U:()=>i});var o=t(113);function i(){const e=(0,o.M6)();return(0,o.BU)(e),e.params}}}]);
//# sourceMappingURL=918.build.js.map