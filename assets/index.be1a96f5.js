import{r as e,s as t,a as r,m as a,b as n,c as o,d as l,p as s,R as i,T as c,e as u,f as d,S as f,g as m,h,B as g,I as v,D as p,L as x,u as y,i as M}from"./vendor.9afc5476.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const r of e)if("childList"===r.type)for(const e of r.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),"use-credentials"===e.crossorigin?t.credentials="include":"anonymous"===e.crossorigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();var E="_App_8dhhf_1",b="_canvasContainer_8dhhf_10",P="_canvas_8dhhf_10";function S(){const[M,S]=e.exports.useState(!0),k=e.exports.useRef(),I=e.exports.useRef(),T=e.exports.useRef(),w=e.exports.useRef([]),{width:R=1,height:_=1}=(t=>{const[r,a]=e.exports.useState({});return e.exports.useLayoutEffect((()=>{var e,r;a(null!=(r=null==(e=t.current)?void 0:e.getBoundingClientRect())?r:{})}),[t]),y(t,(e=>a(e.contentRect))),r})(k),[N,L]=e.exports.useState(null),[C,q]=e.exports.useState(null);return e.exports.useEffect((()=>{N&&q(t(N))}),[N]),e.exports.useEffect((()=>{if(N&&C){let h=function(){let e=w.current;for(var t=0;t<e.length;t++){const r=e[t];void 0!==r.x&&void 0!==r.y&&(e[t].x=Math.max(Math.min(r.x,i-v/2),v/2),e[t].y=Math.max(Math.min(r.y,c-v/2),v/2),e[t].x=.9*r.x+.1*(Math.round(r.x/v+.5)*v-v/2),e[t].y=.9*r.y+.1*(Math.round(r.y/v+.5)*v-v/2),Math.random()<.0015&&(e[t].vx=Math.random()<.5?5:-5),Math.random()<.0015&&(e[t].vy=Math.random()<.5?5:-5))}};var e=null!=(m=window.devicePixelRatio)?m:1,i=R,c=_,u=t(N).attr("width",i*e).attr("height",c*e),d=N.getContext("2d");console.log("Q",i,c);let g=5*Math.sqrt(i*c/16e6);const v=20*g;w.current=r(100).map((e=>({r:(8+2.5*Math.random())*g,x:Math.random()*i,y:Math.random()*c}))),w.current[0].r=20*g,T.current=a().strength(0);var f=n(w.current).alphaDecay(0).velocityDecay(.05).force("charge",T.current).force("collide",o().radius((e=>e.r+2*g)).iterations(20)).on("tick",(()=>{h(),d.resetTransform(),d.scale(e,e),d.fillStyle=!1===M?"#4d4d4d":"#fafafa",d.fillRect(0,0,i,c);d.lineWidth=1;var t=M?201:50,r=M?255:104;d.strokeStyle="rgb("+r+","+r+","+r+")";for(var a=v/2;a<i+v/2;a+=v){let e=Math.floor(a);d.beginPath(),d.moveTo(e+.5,v/2),d.lineTo(e+.5,Math.round(c/v)*v-v/2),d.stroke()}for(a=v/2;a<c+v/2;a+=v){let e=Math.floor(a);d.beginPath(),d.moveTo(v/2,e+.5),d.lineTo(i-v/2,e+.5),d.stroke()}d.strokeStyle="rgb("+t+","+t+","+t+")";for(a=v/2;a<i+v/2;a+=v){let e=Math.floor(a);d.beginPath(),d.moveTo(e+.5-1,v/2),d.lineTo(e+.5-1,Math.round(c/v)*v-v/2),d.stroke()}for(a=v/2;a<c+v/2;a+=v){let e=Math.floor(a);d.beginPath(),d.moveTo(v/2,e+.5-1),d.lineTo(i-v/2,e+.5-1),d.stroke()}w.current.slice(0).forEach(((e,t)=>{const r=e;if(void 0!==r.x&&void 0!==r.y&&void 0!==r.r){let e=0===t?!0===M?"#4d4d4d":"#fafafa":l[t%6];d.fillStyle=e,d.beginPath(),d.moveTo(r.x+r.r,r.y),d.arc(r.x,r.y,r.r,0,2*Math.PI),d.fill(),d.fillStyle="rgba(255,255,255,0.45)",d.beginPath(),d.moveTo(r.x+r.r,r.y),d.arc(r.x,r.y,r.r,0,2*Math.PI),d.fill(),d.lineWidth=1,d.strokeStyle="rgba(0,0,0,0.8)",d.beginPath(),d.arc(r.x,r.y,r.r-.5,0,2*Math.PI),d.stroke(),d.save(),d.beginPath(),d.arc(r.x,r.y,r.r-1,0,2*Math.PI),d.clip(),d.fillStyle=e,d.beginPath(),d.arc(r.x,r.y+1,r.r-1,0,2*Math.PI),d.fill(),d.restore(),d.lineWidth=1,d.strokeStyle="rgba(255,255,255,0.32)",d.beginPath(),d.arc(r.x,r.y,r.r-.5-1,0,2*Math.PI),d.stroke()}}))}));u.on("mousemove",((e,t)=>{var r=s(e,u.node());w.current[0].fx=r[0],w.current[0].fy=r[1]}));const p=200;return u.on("mousedown",(()=>{var e;null==(e=T.current)||e.strength(((e,t)=>{var r,a;return(0==t?null!=(a=null==(r=I.current)?void 0:r.valueAsNumber)?a:p:0)*Math.pow(v/20,2)}))})),u.on("mouseup",(()=>{var e;null==(e=T.current)||e.strength(0)})),()=>{f.stop()}}var m}),[R,_,C,M]),i.createElement(c,{theme:u({palette:{mode:M?"light":"dark"}})},i.createElement("div",{className:E},i.createElement(d,{sx:{bgcolor:!1===M?"#4d4d4d":"#fafafa",backgroundImage:"none",color:"text.primary"}},i.createElement(f,{direction:"row",gap:2,sx:{flex:1},alignItems:"center"},i.createElement(f,{direction:"row",gap:1,alignItems:"center"},i.createElement(m,{variant:"h6"},"Strength")," ",i.createElement(h,{sx:{width:"96px"},min:-250,max:250,defaultValue:250,ref:e=>{var t;return I.current=null!=(t=null==e?void 0:e.querySelector("input"))?t:void 0}})),i.createElement(g,{sx:{flex:1}}),i.createElement(f,{alignItems:"center",direction:"row",gap:0},i.createElement(m,{variant:"h6",component:"span"},"Theme mode")," ",i.createElement(v,{onClick:()=>S((e=>!e))},M?i.createElement(p,null):i.createElement(x,null))))),i.createElement("div",{className:b,ref:e=>k.current=null!=e?e:void 0},i.createElement("canvas",{ref:e=>L(e),className:P}))))}M.render(i.createElement(i.StrictMode,null,i.createElement(S,null)),document.getElementById("root"));
