"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[704],{38:(o,e,r)=>{r.d(e,{G:()=>l});var t=r(654),i=r(524);const l=(0,t.wU)((({slot:o})=>(0,i.h)("article",{class:"fade animated-route"},o)))},704:(o,e,r)=>{r.r(e),r.d(e,{default:()=>y});var t=r(654),i=r(750),l=r(903),n=r(238),a=r(524),s=r(218),c=r(113),u=r(397),d=r(940),h=r(450),m=r(752),p=r(169),f=r(550),b=r(38);new class{constructor(){this.endpoint="https://jsonplaceholder.typicode.com/posts"}async fetchPost(o){const e=await fetch(`${this.endpoint}/${o}`);return await e.json()}async fetchComments(o){const e=await fetch(`${this.endpoint}/${o}/comments`);return await e.json()}async fetchPostAndComments(o){return await Promise.all([this.fetchPost(o),this.fetchComments(o)])}};const w=(0,t.wU)((({slot:o})=>{const{url:e}=function(){const o=(0,c.M6)();(0,c.BU)(o);const e=(0,c._L)(),{location:{pathname:r}}=o,t=(0,s.Y)((()=>e?(0,u.L7)(r,e):""),[e,r]);return{path:e,url:t}}(),r=(0,d.k)(),t=(0,h.U)(),f=(0,m.T)(),[w,y]=(0,i.e)(0),$=Number(t.get("id")),k=(0,l.Wf)((()=>new Promise((o=>setTimeout((()=>o([{userId:1,id:1,title:"Hello world",body:"Lorem ipsum, dolor sit amet consectetur adipisicing elit."},[{postId:1,id:1,name:"Alex",email:"alex@gmail.com",body:"wedwed wefwefwe ewfwef"}]])),300)))),[$]),{data:g,loading:x,error:C}=k;if((0,n.d4)((()=>{"null"===t.get("id")&&r.push("/home/888")}),[f.url]),x)return(0,a.h)("div",null,"LOADING...");if(C)return(0,a.h)("div",null,"error: ",C);const[A,P]=g;return(0,a.h)(b.G,null,(0,a.h)("h1",null,"Home"),(0,a.h)("header",null,(0,a.h)(p.r,{to:`${e}a`},"child route a"),(0,a.h)(p.r,{to:`${e}b`},"child route b"),(0,a.h)(p.r,{to:`${e}c`},"child route c"),(0,a.h)("button",{onClick:()=>y(w+1)},"fired ",w," times")),(0,a.h)("p",null,"Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero excepturi quae harum laborum temporibus? Repellendus laboriosam sunt corporis quasi. Quo accusamus aperiam consequuntur quia veritatis nobis minima omnis error expedita!"),(0,a.h)(v,null,"Default"),(0,a.h)(v,{$primary:!0},"Primary"),(0,a.h)("div",null,(0,a.h)("h4",null,A.title),(0,a.h)("p",null,A.body),(0,a.h)("ul",null,P.map((o=>(0,a.h)("li",{key:o.id},(0,a.h)("b",null,o.email),(0,a.h)("div",null,o.body)))))),o)})),v=f.zo.button`
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

  ${o=>f.iv`
    --color: ${o.$primary?"#BA68C8":"#eee"};
    --hover-color: ${o.$primary?"#8E24AA":"#E0E0E0"};
    --text-color: ${o.$primary?"#fff":"#000"};
  `}
`,y=w},450:(o,e,r)=>{r.d(e,{U:()=>i});var t=r(113);function i(){const o=(0,t.M6)();return(0,t.BU)(o),o.params}}}]);
//# sourceMappingURL=704.build.js.map