import{D as Na,M as be,r as Wo,p as La,_ as za,R as Ta,i as vn,a as ja,b as Da,c as yn,n as Ho,d as wn,e as bn,t as Vo,f as Ko,g as Yo,h as Zo,j as Jo,k as Xo,l as Qo,m as ei,o as ti}from"./PlayGermadeMigration-Bm9shLWZ.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(r){if(r.ep)return;r.ep=!0;const i=n(r);fetch(r.href,i)}})();var ni=Object.defineProperty,ai=(e,t,n)=>t in e?ni(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,P=(e,t,n)=>ai(e,typeof t!="symbol"?t+"":t,n);function Zt(e,t){return typeof e=="string"?document.querySelector(e):e.querySelector(t)}function ri(e,t){return Array.from(typeof e=="string"?document.querySelectorAll(e):e.querySelectorAll(t))}var oi=(e,t={})=>{let n=document.createElement(e);for(let[a,r]of Object.entries(t))if(a==="className")n.className=Array.isArray(r)?r.join(" "):r;else if(a==="textContent")n.textContent=r;else if(a==="children")for(let i of r)n.appendChild(i);else n.setAttribute(a,r);return n},ii=new Set(["a","b","i","em","strong","p","br","ul","ol","li","blockquote","code","pre","span","div","h1","h2","h3","h4","h5","h6","img"]),Un={a:new Set(["href","title"]),img:new Set(["src","alt"]),"*":new Set(["class"])},si=new Set(["http:","https:","mailto:"]);function li(e){try{let t=new URL(e,"https://example.com");return si.has(t.protocol)}catch{return!1}}var ci={"https:":"443","http:":"80"};function di(e){let t=e.trim().toLowerCase().match(/^([a-z\d*][a-z\d.*-]*?)(?::(\d{1,5}|\*))?$/);if(!t)return null;let[,n,a]=t,r=n.split(".");return r.some(i=>i!=="*"&&!/^[a-z\d-]+$/.test(i))?null:{host:new RegExp(`^${r.map(i=>i==="*"?"[^.]+":i).join("\\.")}$`),port:!a||a==="*"?null:a}}var hi=e=>{let t=(Array.isArray(e)?e:e.split(",")).map(di).filter(n=>n!==null);return n=>{let a=n.hostname.toLowerCase(),r=n.port||ci[n.protocol]||"";return t.some(i=>i.host.test(a)&&(i.port===null||i.port===r))}};function fi(e,t,n,a){try{return!!e(new URL(t,document.baseURI),n,a)}catch{return!1}}var Wn=512;function Ba(e,t,n,a){if(n>Wn)throw new RangeError(`jq79: sanitizeHTML input nests deeper than ${Wn} elements`);for(let r of Array.from(e.childNodes))if(r.nodeType===Node.ELEMENT_NODE){let i=mi(r,n,a);i&&t.appendChild(i)}else r.nodeType===Node.TEXT_NODE&&t.appendChild(r.cloneNode())}function mi(e,t,n){let a=e.tagName.toLowerCase();if(!ii.has(a))return null;let r=document.createElement(a);for(let i of Array.from(e.attributes)){let o=i.name.toLowerCase(),s=Un[a]?.has(o),l=Un["*"]?.has(o);!s&&!l||(o==="href"||o==="src")&&(!li(i.value)||n&&!fi(n,i.value,a,o))||r.setAttribute(o,i.value)}return a==="a"&&r.setAttribute("rel","noopener noreferrer"),Ba(e,r,t+1,n),r}function Fa(e,t){let n=document.createElement("template");n.innerHTML=e;let a=document.createElement("div");return Ba(n.content,a,0,t?.allowUrl),a.innerHTML}var ui=(e,t)=>t.split(".").reduce((n,a)=>n?.[a],e),nt=e=>{if(Array.isArray(e))return!0;let t=Object.getPrototypeOf(e);return t===Object.prototype||t===null},qa=(e,t,n)=>{Object.entries(e).forEach(([a,r])=>{let i=t?`${t}.${a}`:a;r&&typeof r=="object"&&nt(r)?qa(r,i,n):n(i,r)})},pi=(e,t)=>{e.own===null?e.own=t:e.own!==t&&(e.ownMany??(e.ownMany=new Set)).add(t)},gi=(e,t)=>{e.deep===null?e.deep=t:e.deep!==t&&(e.deepMany??(e.deepMany=new Set)).add(t)},vi=(e,t)=>{e.own===t?e.own=null:e.ownMany?.delete(t)&&e.ownMany.size===0&&(e.ownMany=null)},yi=(e,t)=>{e.deep===t?e.deep=null:e.deepMany?.delete(t)&&e.deepMany.size===0&&(e.deepMany=null)},Ne=(e,t)=>{e.own!==null&&t(e.own),e.ownMany?.forEach(t)},Be=(e,t)=>{e.deep!==null&&t(e.deep),e.deepMany?.forEach(t)},Hn=" keys",Lt=e=>e?`${e}.${Hn}`:Hn,Vn=".length",Kn=(e,t)=>({children:null,own:null,ownMany:null,deep:null,deepMany:null,parent:e,segment:t}),wi=e=>e.own===null&&e.deep===null&&!e.ownMany?.size&&!e.deepMany?.size&&!e.children?.size,Jt=Symbol("jq79.raw"),ee=e=>{let t=e;for(;t!==null&&typeof t=="object"&&t[Jt];)t=t[Jt];return t},Ga=Symbol("jq79.store"),Me=e=>e!==null&&typeof e=="object"&&e[Ga]===!0,Xt=null,we=[],ae=null,Ge=e=>{we.push(new Set);let t=ae;ae=null;try{return e()}finally{we.pop(),ae=t}},bi=e=>{e.adopted.forEach((t,n)=>{e.read?.has(n)||(t(),e.adopted.delete(n))})},Yn=e=>{e.adopted?.forEach(t=>t()),e.adopted=null},ki=0,ke=0,de=null,kt=!1,Zn=(e,t)=>{let n=de??(de=new Map);for(let a of e)kt&&a===ae?a.run():n.has(a)||n.set(a,t)},Ua=()=>{for(let e=0;de?.size;e++){if(e===100){console.error(`jq79: ${kt?"a write":"a $batch"} kept waking effects for 100 rounds (an effect writes what it reads); giving up on it settling`),de.clear();return}let t=de;de=new Map,Array.from(t.keys()).sort((n,a)=>n.order-a.order).forEach(n=>{t.get(n).has(n)&&n.run()})}},Wa=e=>{ke++===0&&(de=null);try{return e()}finally{if(ke===1)try{Ua()}finally{ke=0,de=null}else ke--}},Jn=()=>{ke=1,kt=!0},Xn=()=>{try{de&&Ua()}finally{ke=0,de=null,kt=!1}},zt=new Set,Qn="$__attach",ea="$__holds",Qt=Symbol("jq79.alsoWakenBy"),Ha=Symbol("jq79.owner"),Pe=e=>{let t=new Map,n=new Set,a=new Set,r=new WeakMap,i=Object.create(null),o=Kn(null,""),s=(m,h)=>{let p=o;return m.split(".").forEach(u=>{let S=p.children??(p.children=new Map),g=S.get(u);g||(g=Kn(p,u),S.set(u,g)),p=g}),h.deep?gi(p,h):pi(p,h),p},l=(m,h)=>{h.deep?yi(m,h):vi(m,h);let p=m;for(;p?.parent&&wi(p);)p.parent.children.delete(p.segment),p=p.parent},c=m=>{let h=o;for(let p of m.split("."))if(h=h.children?.get(p),!h)return;return h},d=m=>{let h=new Set,p=w=>{let O=w.children?[...w.children.values()]:[];for(;O.length;){let $=O.pop();Ne($,C=>h.add(C)),Be($,C=>h.add(C)),$.children?.forEach(C=>O.push(C))}},u=o,S=m.split("."),g="";for(let w=0;w<S.length-1;w++){if(u=u.children?.get(S[w]),!u)return h;g=g?`${g}.${S[w]}`:S[w],Be(u,$=>h.add($));let O=x.get(g);O&&Ne(u,$=>{O.store[ea]($)||h.add($)}),w===S.length-2&&S[w+1]==="length"&&(Ne(u,$=>h.add($)),p(u))}return u=u.children?.get(S[S.length-1]),u&&(Ne(u,w=>h.add(w)),Be(u,w=>h.add(w)),p(u)),h},f=(m,h,p)=>{if(h===p)return!1;for(let u=h;u<p;u++){let S=m.charCodeAt(u);if(S<48||S>57)return!1}return!0},b=(m,h)=>{if(m.deep||h.size<2)return h;let p=new Set;h.forEach(g=>{g.endsWith(Vn)&&p.add(g.slice(0,-Vn.length))});let u=new Set;if(h.forEach(g=>{let w=0,O="";for(let $=g.indexOf(".");$!==-1;$=g.indexOf(".",$+1)){let C=g.slice(0,$);(!(w>0&&f(g,w,$))||p.has(O))&&u.add(C),O=C,w=$+1}}),!u.size)return h;let S=new Set;return h.forEach(g=>{u.has(g)||S.add(g)}),S},E=m=>{let h=null,p=null,u=null,S=zt,g=R=>u?u.has(R):h===R,w=R=>{let Q=s(R,m);u?u.set(R,Q):h===null?(h=R,p=Q):(u=new Map([[h,p],[R,Q]]),h=p=null)},O=R=>{if(u){u.forEach((Q,V)=>{R.has(V)||(l(Q,m),u.delete(V))});return}h!==null&&!R.has(h)&&(l(p,m),h=p=null)},$=()=>{u?u.forEach(R=>l(R,m)):p&&l(p,m),u=null,h=p=null},C=R=>{if(R.size===S.size){let V=!0;if(R.forEach(Oe=>{V&&(V=S.has(Oe))}),V)return}S=R;let Q=b(m,R);O(Q),Q.forEach(V=>{g(V)||w(V)})};return m.reindex.add(C),C(m.deps),()=>{m.reindex.delete(C),$(),S=zt}},B=m=>{let h=c(m);if(h){let p=new Set;Ne(h,u=>p.add(u)),Be(h,u=>p.add(u)),T(p)}},N=m=>B(Lt(m)),T=m=>{if(ke)return Zn(m,a);let h=Array.from(m),p=!0;for(let u=1;p&&u<h.length;u++)p=h[u-1].order<h[u].order;p||h.sort((u,S)=>u.order-S.order),Jn();try{for(let u of h)a.has(u)&&u.run()}finally{Xn()}},k=(m,h,p=!1)=>{if(t.get(m)?.forEach(u=>u(h,m)),n.forEach(u=>u(m,h)),p)if(ke)Zn(a,a);else{Jn();try{a.forEach(u=>u.run())}finally{Xn()}}else T(d(m))},_=(m,h)=>m!==h&&m!==null&&h!==null&&typeof m=="object"&&typeof h=="object"&&!Me(m)&&!Me(h)&&nt(m)&&nt(h)&&Array.isArray(m)===Array.isArray(h),z=null,G=-1,W=(m,h)=>{let p=h.length>m.length,u=p?m:h,S=p?h:m,g=0;for(;g<u.length&&Object.is(ee(u[g]),ee(S[g]));)g++;for(let w=g;w<u.length;w++)if(!Object.is(ee(u[w]),ee(S[w+1])))return G;return g},K=(m,h)=>{if(Array.isArray(h)){let O=m.length,$=h.length,C=O!==$;if(!O||!$)return z;let R=Math.max(O,$);if(Math.abs(O-$)===1){let V=W(m,h);if(V!==G){let Oe=[];for(let Nt=V;Nt<R;Nt++)Oe.push(String(Nt));return{keys:Oe,exact:!0,keysChanged:C}}}let Q=[];for(let V=0;V<R;V++)if(!Object.is(ee(m[V]),ee(h[V]))&&(Q.push(String(V)),Q.length*2>=R))return z;return{keys:Q,exact:!1,keysChanged:C}}let p=Object.keys(m),u=Object.keys(h),S=new Set([...p,...u]);if(!S.size)return z;let g=[];S.forEach(O=>{Object.is(ee(m[O]),ee(h[O]))||g.push(O)});let w=p.length!==u.length||p.some((O,$)=>O!==u[$]);return g.length*2>=S.size?z:{keys:g,exact:!1,keysChanged:w}},te=(m,h,p,u)=>{let S=new Set,g=O=>{let $=c(O);$&&(Ne($,C=>S.add(C)),Be($,C=>S.add(C)))},w=K(h,p);if(!w)return k(m,u);if(t.get(m)?.forEach(O=>O(u,m)),n.forEach(O=>O(m,u)),g(m),w.keys.forEach(O=>{let $=`${m}.${O}`,C=t.get($);if(C){let R=ee(p[O]),Q=v(R)?H(R,$):R;C.forEach(V=>V(Q,$))}w.exact?g($):d($).forEach(R=>S.add(R))}),w.keysChanged&&g(Lt(m)),Array.isArray(p)&&h.length!==p.length){let O=`${m}.length`;t.get(O)?.forEach($=>$(p.length,O)),g(O)}T(S)},v=m=>m!==null&&typeof m=="object"&&nt(m),x=new Map,M=(m,h)=>{let p=x.get(h);p?.store!==m&&(p?.unsubscribe(),x.set(h,{store:m,unsubscribe:m.$onAny((u,S)=>k(`${h}.${u}`,S))}))},U=m=>{x.get(m)?.unsubscribe(),x.delete(m)},H=(m,h)=>{let p=r.get(m);if(p)return p;let u=null,S=new Proxy(m,{has(g,w){return Reflect.has(g,w)||typeof w=="string"&&u?.has(w)===!0},ownKeys(g){return we[we.length-1]?.add(Lt(h)),ae!==null&&ae.home!==a&&Y(ae),Reflect.ownKeys(g)},get(g,w,O){if(w===Jt)return g;if(w===Ga)return h==="";if(typeof w!="string")return Reflect.get(g,w,O);if(h===""&&w in i)return i[w];let $=h?`${h}.${w}`:w;we[we.length-1]?.add($),ae!==null&&ae.home!==a&&Y(ae);let C=Reflect.get(g,w,O);if(Me(C))return M(C,$),C;let R=ee(C);return v(R)?H(R,$):R},set(g,w,O,$){if($!==S&&!Object.prototype.hasOwnProperty.call(g,w))return Reflect.set(g,w,O,$);let C=h?`${h}.${w}`:w,R=Me(O)?O:ee(O),Q=!Object.prototype.hasOwnProperty.call(g,w);if(!Q&&Object.is(g[w],R)&&(R===null||typeof R!="object"))return!0;let V=g[w];g[w]=R,u?.delete(w),Me(R)?M(R,C):U(C);let Oe=Me(R)||!v(R)?R:H(R,C);return!Q&&_(V,R)?te(C,V,R,Oe):k(C,Oe,Q),!0},deleteProperty(g,w){if(typeof w!="string")return Reflect.deleteProperty(g,w);let O=Object.prototype.hasOwnProperty.call(g,w),$=Reflect.deleteProperty(g,w);if($&&O){let C=h?`${h}.${w}`:w;(u??(u=new Set)).add(w),U(C),k(C,void 0),N(h)}return $}});return r.set(m,S),S},y=H(ee(e),"");Object.entries(ee(e)).forEach(([m,h])=>{Me(h)&&M(h,m)});let A=(m,h,{immediate:p=!1}={})=>(t.has(m)||t.set(m,new Set),t.get(m).add(h),p&&h(ui(y,m),m),()=>t.get(m)?.delete(h)),I=(m,{immediate:h=!1}={})=>(n.add(m),h&&qa(y,"",(p,u)=>m(p,u)),()=>n.delete(m)),F=(m,{deep:h=!1,alsoWakenBy:p}={})=>{let u=!1,S=!1,g={deps:zt,reindex:new Set,deep:h,order:ki++,home:a,adopted:null,read:null,run:()=>{if(u){S=!0;return}u=!0;try{let $=0;do{S=!1,g.read=null;let C=new Set;we.push(C);let R=ae;ae=g;try{m()}finally{we.pop(),ae=R,g.deps=C}}while(S&&++$<100);S&&console.error("jq79: an effect re-woke itself 100 times in a row (it writes what it reads); giving up on it settling")}finally{u=!1,g.adopted&&bi(g),g.reindex.forEach($=>$(g.deps))}}};a.add(g);let w=E(g),O=()=>{a.delete(g),w(),Yn(g)};return p?.length?j(g,p,O):(g.run(),Xt=g,O)},j=(m,h,p)=>{let u=h.map(S=>S?.[Qn]?.(m)).filter(Boolean);return m.run(),Xt=m,()=>{p(),u.forEach(S=>S())}},X=m=>{a.add(m);let h=E(m);return()=>{a.delete(m),h()}},Y=m=>{(m.read??(m.read=new Set)).add(a),!(m.adopted?.has(a)||a.has(m))&&(m.adopted??(m.adopted=new Map)).set(a,X(m))},se=()=>{x.forEach(({unsubscribe:m})=>m()),x.clear(),a.forEach(m=>{m.home===a&&Yn(m)})};return i.$on=A,i.$onAny=I,i.$effect=F,i.$dispose=se,i[Qn]=X,i[ea]=m=>a.has(m),y},Si=class{constructor(e,t){P(this,"scope",e),P(this,"disposers",null),P(this,"runs",null),P(this,"children",null),P(this,"owners",null),P(this,"options");let n=e[Qt];this.options=t||n?{deep:t,alsoWakenBy:n}:void 0,this.ownedBy(e)}ownedBy(e){let t=e[Ha];!t||this.owners?.includes(t)||((this.owners??(this.owners=[])).push(t),(t.children??(t.children=new Set)).add(this))}effect(e){(this.disposers??(this.disposers=[])).push(this.scope.$effect(e,this.options)),(this.runs??(this.runs=[])).push(Xt)}onDispose(e){(this.disposers??(this.disposers=[])).push(e)}refresh(){this.runs?.forEach(e=>e.run())}rerun(){let e=this.runs?[...this.runs]:null,t=this.children?[...this.children]:null;e?.forEach(n=>{this.runs&&n.run()}),t?.forEach(n=>n.rerun())}dispose(){let e=this.disposers;if(this.disposers=null,this.runs=null,this.children=null,this.owners?.forEach(t=>t.children?.delete(this)),this.owners=null,e)for(let t=0;t<e.length;t++)e[t]()}},Ke=(e,t=!1)=>new Si(e,t),xi=e=>{let t=Pe({value:void 0});t.$effect(()=>{let a;try{a=e()}catch(r){console.error("jq79: error in $computed, keeping its last value",r);return}t.value=a});let n=(a,r)=>(console.warn(`jq79: a $computed is read-only - the write to ${String(r)} was ignored`),!0);return new Proxy(t,{set:n,deleteProperty:n,defineProperty:n})},rt=/(?:let|var|const)(?:\s+(?=[A-Za-z_$])|\s*(?=[{[]))/y,ta=/\$:\s*/y,ot=/import(?=\s*\()/y,na=/\$:\s*([A-Za-z_$][\w$]*)\s*=(?!=)/y,he=(e,t)=>{let n=e[t],a=t+1;for(;a<e.length;){if(e[a]==="\\"){a+=2;continue}if(e[a]===n)return a+1;a++}return e.length},le=(e,t)=>{let n=e.indexOf(`
`,t);return n===-1?e.length:n},ce=(e,t)=>{let n=e.indexOf("*/",t+2);return n===-1?e.length:n+2},ve=(e,t)=>{let n=t;for(;n<e.length;){if(/\s/.test(e[n])){n++;continue}if(e[n]==="/"&&e[n+1]==="/"){n=le(e,n);continue}if(e[n]==="/"&&e[n+1]==="*"){n=ce(e,n);continue}break}return n},$i=new Set(["return","typeof","case","in","instanceof","new","delete","void","do","else","yield","await"]),fe=(e,t)=>{let n=t-1;for(;n>=0;){let r=e[n];if(/\s/.test(r)){n--;continue}if(r==="/"&&e[n-1]==="*"){let i=e.lastIndexOf("/*",n-2);if(i===-1)return!0;n=i-1;continue}break}if(n<0)return!0;let a=e[n];if(/[\w$]/.test(a)){let r=n;for(;r>0&&/[\w$]/.test(e[r-1]);)r--;return $i.has(e.slice(r,n+1))}return(a==="+"||a==="-")&&e[n-1]===a?!1:!")]}\"'`.".includes(a)},me=(e,t)=>{let n=t+1,a=!1;for(;n<e.length;){let r=e[n];if(r==="\\"){n+=2;continue}if(r===`
`)return n;if(r==="[")a=!0;else if(r==="]")a=!1;else if(r==="/"&&!a){for(n++;n<e.length&&/[a-z]/i.test(e[n]);)n++;return n}n++}return e.length},Oi=/^(\?\.|\?\?|&&|\|\||\*\*|[.,+\-*/%&|^<>=?:([])/,Mi=(e,t)=>{let n=t-1;for(;n>=0;){let a=e[n];if(/\s/.test(a)){n--;continue}if(a==="/"&&e[n-1]==="*"){let r=e.lastIndexOf("/*",n-2);if(r===-1)return"";n=r-1;continue}return a}return""},en=(e,t)=>{let n=0,a=t;for(;a<e.length;){let r=e[a];if(r==="'"||r==='"'||r==="`"){a=he(e,a);continue}if(r==="/"&&e[a+1]==="/"){a=le(e,a);continue}if(r==="/"&&e[a+1]==="*"){a=ce(e,a);continue}if(r==="/"&&fe(e,a)){a=me(e,a);continue}if("([{".includes(r))n++;else if(")]}".includes(r))n--;else{if(n<=0&&r===";")return a;if(n<=0&&r===`
`){let i=ve(e,a+1);if(!(i<e.length&&(Oi.test(e.slice(i,i+2))||[",","="].includes(Mi(e,a)))))return a;a=i;continue}}a++}return e.length},Va=e=>{let t=[],n=0,a=0,r=0,i=s=>{t.push({raw:e.slice(a,s),codeEnd:Math.max(0,r-a)}),a=s+1,r=a},o=0;for(;o<e.length;){let s=e[o];if(s==="'"||s==='"'||s==="`"){o=he(e,o),r=o;continue}if(s==="/"&&e[o+1]==="/"){o=le(e,o);continue}if(s==="/"&&e[o+1]==="*"){o=ce(e,o);continue}if(s==="/"&&fe(e,o)){o=me(e,o),r=o;continue}if("([{".includes(s))n++;else if(")]}".includes(s))n--;else if(s===","&&n<=0){i(o),o++;continue}/\s/.test(s)||(r=o+1),o++}return i(e.length),t},it=e=>{let t=e.trim();if(!t.startsWith("{")&&!t.startsWith("["))return ct.test(t)?[t]:[];let n=[];for(let a of xn(t.slice(1,Ka(t)))){a.startsWith("...")&&(a=a.slice(3).trim());let r=St(a);if(r!==-1&&(a=a.slice(0,r).trim()),t.startsWith("{")){let i=Sn(a,":");if(i!==-1){n.push(...it(a.slice(i+1)));continue}}n.push(...it(a))}return n},Ci=e=>{let t=[],n=Va(e).map(({raw:i,codeEnd:o})=>{let s=i.match(/^\s*/)[0];if(o<=s.length)return{text:i,empty:!0};let l=i.slice(s.length,o),c=i.slice(o),d=St(l),f=(d===-1?l:l.slice(0,d)).trim(),b=l[0]==="{"||l[0]==="[";b?t.push(...it(f)):ct.test(f)&&t.push(f);let E=kn(l).code;return{text:`${s}${b?`(${E})`:E}${c}`,empty:!1}}),a=[];for(;n.length&&n[n.length-1].empty;)a.unshift(n.pop().text);let r=n.map(i=>i.text).join(",")+a.join("");return r.trimStart().startsWith("(")&&(r=`;${r}`),{vars:t,code:r}},kn=e=>{let t=[],n="",a=0,r=0,i=!0;for(;a<e.length;){let o=e[a],s=e[a+1];if(o==="'"||o==='"'||o==="`"){let l=he(e,a);n+=e.slice(a,l),a=l,i=!1;continue}if(o==="/"&&(s==="/"||s==="*")){let l=s==="/"?le(e,a):ce(e,a);n+=e.slice(a,l),a=l;continue}if(o==="/"&&fe(e,a)){let l=me(e,a);n+=e.slice(a,l),a=l,i=!1;continue}if(o==="i"&&(a===0||!/[\w$.]/.test(e[a-1]))&&(ot.lastIndex=a,ot.test(e))){n+="$__import",a+=6,i=!1;continue}if(r===0&&i){rt.lastIndex=a;let l=rt.exec(e);if(l){let d=a+l[0].length,f=en(e,d),{vars:b,code:E}=Ci(e.slice(d,f));t.push(...b),n+=E,a=f,i=!1;continue}ta.lastIndex=a;let c=ta.exec(e);if(c){na.lastIndex=a;let d=na.exec(e);d&&t.push(d[1]);let f=a+c[0].length,b=en(e,f);n+=`$__effect(() => { ${kn(e.slice(f,b)).code} });`,a=b;continue}}"([{".includes(o)?r++:")]}".includes(o)&&(r=Math.max(0,r-1)),o===`
`||o===";"||o==="}"?i=!0:/\s/.test(o)||(i=!1),n+=o,a++}return{vars:t,code:n}},st=/export\s+default(?![\w$])/y,lt=/import\s*(?:([\w$\s,{}*]+?)\s*from\s*)?(["'])([^"'\n]+)\2/y,Ei=e=>{let t=[],n=0,a=0;for(let r=0;r<=e.length;r++){let i=e[r];if(i==="{")n++;else if(i==="}")n--;else if(r===e.length||i===","&&n===0){let o=e.slice(a,r).trim();o&&t.push(o),a=r+1}}return t},Ri=(e,t,n)=>{let a=`await $__import(${JSON.stringify(t)})`;if(e===void 0)return a;let r=Ei(e),i=[],o=a;if(r.length>1){let s=`$__mod${n}`;i.push(`${s} = ${a}`),o=s}for(let s of r)s.startsWith("{")?i.push(`${s.replace(/\s+as\s+/g,": ")} = ${o}`):s.startsWith("*")?i.push(`${s.replace(/^\*\s*as\s+/,"")} = ${o}`):i.push(`${s} = $__default(${o})`);return`const ${i.join(", ")}`},ct=/^[A-Za-z_$][\w$]*$/,Ka=e=>{let t=0,n=0;for(;n<e.length;){let a=e[n];if(a==="'"||a==='"'||a==="`"){n=he(e,n);continue}if(a==="/"&&e[n+1]==="/"){n=le(e,n);continue}if(a==="/"&&e[n+1]==="*"){n=ce(e,n);continue}if(a==="/"&&fe(e,n)){n=me(e,n);continue}if("([{".includes(a))t++;else if(")]}".includes(a)&&--t===0)return n;n++}return e.length},Sn=(e,t)=>{let n=0,a=0;for(;a<e.length;){let r=e[a];if(r==="'"||r==='"'||r==="`"){a=he(e,a);continue}if(r==="/"&&e[a+1]==="/"){a=le(e,a);continue}if(r==="/"&&e[a+1]==="*"){a=ce(e,a);continue}if(r==="/"&&r!==t&&fe(e,a)){a=me(e,a);continue}if("([{".includes(r))n++;else if(")]}".includes(r))n--;else if(n===0&&r===t)return a;a++}return-1},xn=e=>{let t=[],n=0,a=0,r=0;for(;r<=e.length;){let i=e[r];if(i==="'"||i==='"'||i==="`"){r=he(e,r);continue}if(i==="/"&&e[r+1]==="/"){r=le(e,r);continue}if(i==="/"&&e[r+1]==="*"){r=ce(e,r);continue}if(i==="/"&&fe(e,r)){r=me(e,r);continue}if(i!==void 0&&"([{".includes(i))n++;else if(i!==void 0&&")]}".includes(i))n--;else if(r===e.length||i===","&&n===0){let o=e.slice(a,r).trim();o&&t.push(o),a=r+1}r++}return t},St=e=>{let t=0;for(;t<e.length;){let n=Sn(e.slice(t),"=");if(n===-1)return-1;let a=t+n;if(e[a+1]!=="="&&e[a+1]!==">"&&e[a-1]!=="="&&e[a-1]!=="!")return a;t=a+1}return-1},$n=e=>{let t=(e??"").trim();if(!t.startsWith("{"))return null;let n=Ka(t);if(n>=t.length)return null;let a=[];for(let r of xn(t.slice(1,n))){if(r.startsWith("..."))continue;let i=St(r),o=i===-1?r:r.slice(0,i),s=i===-1?void 0:r.slice(i+1).trim(),l=Sn(o,":"),c=(l===-1?o:o.slice(0,l)).trim();if(!ct.test(c))continue;let d={name:c};s!==void 0&&(d.default=s);let f=l===-1?"":o.slice(l+1).trim();ct.test(f)&&(d.as=f),a.push(d)}return a},_i=e=>{let t=0,n=0,a=!0;for(;t<e.length;){let r=e[t];if(r==="'"||r==='"'||r==="`"){t=he(e,t),a=!1;continue}if(r==="/"&&e[t+1]==="/"){t=le(e,t);continue}if(r==="/"&&e[t+1]==="*"){t=ce(e,t);continue}if(r==="/"&&fe(e,t)){t=me(e,t),a=!1;continue}if(r==="e"&&n===0&&a&&(t===0||!/[\w$.]/.test(e[t-1]))){st.lastIndex=t;let i=st.exec(e);if(i)return t+i[0].length}"([{".includes(r)?n++:")]}".includes(r)&&(n=Math.max(0,n-1)),r===`
`||r===";"||r==="}"?a=!0:/\s/.test(r)||(a=!1),t++}return-1},Ai=/^async(?![\w$])/,Ii=/^function(?![\w$])\s*\*?\s*[A-Za-z_$][\w$]*|^function(?![\w$])\s*\*?/,Pi=e=>{let t=_i(e);if(t===-1)return null;let n=ve(e,t),a=e.slice(n);Ai.test(a)&&(n=ve(e,n+5));let r=Ii.exec(e.slice(n));if(r&&(n=ve(e,n+r[0].length)),e[n]!=="(")return null;let i=0,o=n;for(;o<e.length;){let s=e[o];if(s==="'"||s==='"'||s==="`"){o=he(e,o);continue}if(s==="/"&&e[o+1]==="/"){o=le(e,o);continue}if(s==="/"&&e[o+1]==="*"){o=ce(e,o);continue}if(s==="/"&&fe(e,o)){o=me(e,o);continue}if("([{".includes(s))i++;else if(")]}".includes(s)&&--i===0)break;o++}return xn(e.slice(n+1,o))[0]??""},Ya=e=>{let t=Pi(e);if(t===null)return null;let n=$n(t),a=n?.find(r=>r.name.startsWith("$"))?.name;if(a)throw new Error(`jq79: the factory signature is (props, ctx), so \`${a}\` can't be destructured from the first parameter. Write \`export default (props, { ${a} }) => …\`, or \`_\` in place of props if the component takes none.`);return n},Ni=e=>{let t="",n=0,a=0,r=!0,i=!1,o=0;for(;n<e.length;){let s=e[n],l=e[n+1],c=n===0||!/[\w$.]/.test(e[n-1]);if(s==="'"||s==='"'||s==="`"){let d=he(e,n);t+=e.slice(n,d),n=d,r=!1;continue}if(s==="/"&&(l==="/"||l==="*")){let d=l==="/"?le(e,n):ce(e,n);t+=e.slice(n,d),n=d;continue}if(s==="/"&&fe(e,n)){let d=me(e,n);t+=e.slice(n,d),n=d,r=!1;continue}if(s==="i"&&c){if(ot.lastIndex=n,ot.test(e)){t+="$__import",n+=6,r=!1;continue}if(a===0&&r){lt.lastIndex=n;let d=lt.exec(e);if(d){t+=Ri(d[1],d[3],o++),n+=d[0].length,r=!1;continue}}}if(s==="e"&&c&&a===0&&r){st.lastIndex=n;let d=st.exec(e);if(d){i=!0,t+="$__exports.default =",n+=d[0].length,r=!1;continue}}"([{".includes(s)?a++:")]}".includes(s)&&(a=Math.max(0,a-1)),s===`
`||s===";"||s==="}"?r=!0:/\s/.test(s)||(r=!1),t+=s,n++}return i?t:null},Li=new Set(["true","false","null","undefined","this","typeof","instanceof","in","new","void","delete","of","await","yield","NaN","Infinity","arguments","case","do","else","return"]),zi=new Set(["function","class","let","const","var","eval","with"]),Ti=new Set(["$scope","$r","$t"]),ji=/^(?:\+\+|--|=>|\*\*=|<<=|>>>=|>>=|&&=|\|\|=|\?\?=|[+\-*/%&|^]=(?!=))/,Di=/^(?:>>>|===|!==|\*\*|<<|>>|==|!=|<=|>=|&&|\|\||\?\?|\?\.)/,Bi=e=>/[A-Za-z_$]/.test(e),Fi=/^(?:0[xXbBoO][\da-fA-F_]+|\d[\d_]*(?:\.[\d_]*)?(?:[eE][+-]?\d+)?)n?/,Za=e=>{let t=new Set,n=[0],a=[],r=!1,i="",o=0;for(;o<e.length;){let s=e[o];if(/\s/.test(s)){o++;continue}if(s==="/"&&e[o+1]==="/"){o=le(e,o);continue}if(s==="/"&&e[o+1]==="*"){o=ce(e,o);continue}if(s==="/"&&fe(e,o)){o=me(e,o),i="value";continue}if(s==='"'||s==="'"){o=he(e,o),i="value";continue}if(s==="`"){let d=o+1;for(;d<e.length;){if(e[d]==="\\"){d+=2;continue}if(e[d]==="`"){d++;break}if(e[d]==="$"&&e[d+1]==="{"){let f=1,b=d+=2;for(;d<e.length&&f>0;)e[d]==="{"?f++:e[d]==="}"&&f--,d++;let E=Za(e.slice(b,d-1));if(E===null)return null;E.forEach(B=>t.add(B));continue}d++}o=d,i="value";continue}if(/\d/.test(s)&&i!=="."&&i!=="?."){let d=Fi.exec(e.slice(o));o+=d?d[0].length:1,i="value";continue}if(Bi(s)){let d=o;for(;d<e.length&&/[\w$]/.test(e[d]);)d++;let f=e.slice(o,d);if(o=d,zi.has(f))return null;if(i==="."||i==="?."){i="value";continue}if(Li.has(f)){i=f==="this"?"value":"op";continue}if(Ti.has(f))return null;let b=o;for(;b<e.length&&/\s/.test(e[b]);)b++;if(e[b]==="(")return null;e[b]===":"&&e[b+1]!==":"&&a[a.length-1]==="{"&&n[n.length-1]===0||t.add(f),i="value";continue}let l=e.slice(o);if(ji.test(l))return null;let c=Di.exec(l);if(c){(c[0]==="&&"||c[0]==="||"||c[0]==="??")&&(r=!0),i=c[0]==="?."?"?.":"op",o+=c[0].length;continue}if(s==="=")return null;s==="("||s==="["||s==="{"?(a.push(s),n.push(0)):s===")"||s==="]"||s==="}"?(a.pop(),n.length>1&&n.pop()):s==="?"?(n[n.length-1]++,r=!0):s===":"&&n[n.length-1]>0&&n[n.length-1]--,i=s,o++}return r&&t.size>1?null:[...t]},Tt=/(?:await\s+)?(?:import\s*\(|(\$importAll)\s*\(\s*\[|(C79|Component79)\s*\.\s*(fetch|fetchAll|importAll)\s*\(\s*(\[)?)/y,jt=/(["'])([^"'\n\\]+)\1/y,qi=/^(?:(?:if|for|while|with)\b[\s\S]*\)|[\s\S]*\b(?:else|do))$/,Gi=(e,t)=>{Tt.lastIndex=0;let n=Tt.exec(e);if(!n)return[];let[,a,r,i,o]=n;if(t.has(a??r??""))return[];let s=a!==void 0||o!==void 0;if(i!==void 0&&i==="fetch"===s)return[];let l=r===void 0?"component":i==="importAll"?"page":"fetch",c=[],d=ve(e,Tt.lastIndex);for(;;){jt.lastIndex=d;let f=jt.exec(e);if(!f)return c;let b=ve(e,jt.lastIndex),E=e[b];if(!s)return E===")"||E===","?[{spec:f[2],kind:l}]:[];if(E!==","&&E!=="]"||(c.push({spec:f[2],kind:l}),E==="]"))return c;d=ve(e,b+1)}},Ui=e=>{let t=[];for(let o=ve(e,0);o<e.length;o=ve(e,o+1)){let s=en(e,o);t.push(e.slice(o,s).trim().replace(/^export\s+(?!default\b)/,"")),o=s}let n=o=>{rt.lastIndex=0;let s=rt.exec(o);return s?Va(o.slice(s[0].length)).map(({raw:l})=>{let c=l.trim(),d=St(c);return d===-1?{target:c,init:""}:{target:c.slice(0,d).trim(),init:c.slice(d+1).trim()}}):null},a=new Set;t.forEach(o=>n(o)?.forEach(({target:s})=>it(s).forEach(l=>a.add(l))));let r=[],i=!1;for(let o of t){if(!i){lt.lastIndex=0;let s=lt.exec(o);if(s)/^type\s/.test(s[1]??"")||r.push({spec:s[3],kind:"component"});else{let l=n(o);for(let c of l?l.map(({init:d})=>d):[o])r.push(...Gi(c,a))}}i=qi.test(o)}return r},ge=e=>e.replace(/-(\w)/g,(t,n)=>n.toUpperCase()),dt=e=>e.replace(/[A-Z]/g,t=>`-${t.toLowerCase()}`),Wi=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]),Hi=/<([A-Za-z][\w.-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)\/>/g,On=/(<script[\s\S]*?<\/script\s*>|<style[\s\S]*?<\/style\s*>)/gi,Vi=e=>e.split(On).map((t,n)=>n%2===1?t:t.replace(Hi,(a,r,i)=>Wi.has(r.toLowerCase())?a:`<${r}${i}></${r}>`)).join(""),Ja=/<([A-Za-z][\w.-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g,Ki=/"[^"]*"|'[^']*'|(^|\s)\.\.\.([A-Za-z_$][\w$.]*)/g,Yi=e=>e.split(On).map((t,n)=>n%2===1?t:t.replace(Ja,(a,r,i)=>{let o=0,s=i.replace(Ki,(l,c,d)=>d===void 0?l:`${c}:props.${o++}="${d}"`);return`<${r}${s}>`})).join(""),Zi=/"[^"]*"|'[^']*'|(^|\s)(:[\w.$-]+)/g,Ji=/<\/slot\.([\w.$-]+)(\s*)>/gi,Xi=/^slot\./i,Qi=e=>Xi.test(e)?`slot.${dt(e.slice(5))}`:e,ht=":jq79-component",Xa=/^[A-Z]/,es="c79-",xt=e=>`${es}${dt(e[0].toLowerCase()+e.slice(1))}`,ts=e=>Xa.test(e)?xt(e):Qi(e),ns=/<\/([A-Z][\w.-]*)(\s*)>/g,as=/\/\s*$/,rs=(e,t)=>{if(!Xa.test(e))return t;let n=` ${ht}="${e}"`,a=as.exec(t);return a?`${t.slice(0,a.index)}${n}${a[0]}`:`${t}${n}`},os=e=>e.split(On).map((t,n)=>n%2===1?t:t.replace(Ja,(a,r,i)=>{let o=i.replace(Zi,(s,l,c)=>c===void 0?s:`${l}${dt(c)}`);return`<${ts(r)}${rs(r,o)}>`}).replace(Ji,(a,r,i)=>`</slot.${dt(r)}${i}>`).replace(ns,(a,r,i)=>`</${xt(r)}${i}>`)).join(""),is=e=>Vi(Yi(os(e))),ss=/^[A-Z][A-Za-z0-9]*$/,Dt=/{{\s*([\s\S]+?)\s*}}/g,aa=new Map,Qa=e=>{let t=aa.get(e);if(t)return t;let n=[],a=0;Dt.lastIndex=0;for(let r=Dt.exec(e);r;r=Dt.exec(e))r.index>a&&n.push(e.slice(a,r.index)),n.push({expr:r[1]}),a=r.index+r[0].length;return a<e.length&&n.push(e.slice(a)),aa.set(e,n),n},er=new Set([":class",":value",":checked",":selected",":if",":elseif",":else",":each",":key",":window",":with",":text",":html",":html.allowed",":props"]),De=e=>er.has(e)||e.startsWith(":class.")||e.startsWith(":props.")||e===":slot"||e.startsWith(":slot."),ls=/^\s*\(?\s*(\w+)\s*(?:,\s*(\w+))?\s*\)?\s+in\s+([\s\S]+)$/,Mn=e=>e==="slot"||e.startsWith("slot."),tr=e=>e?ge(e):"default",ra=e=>`${e}
= $value`,nr=["$scope","$r"],cs=e=>`with ($scope) { return (${e}
); }`,ds=(e,t)=>{let n=Za(e);if(n===null)return null;let a=n.filter(r=>!t.includes(r));return`${a.length===0?"":`let $t; ${a.map(r=>`const ${r} = ($t = $scope.${r}) !== undefined ? $t : $r($scope, ${JSON.stringify(r)});`).join(" ")}`} return (${e}
);`},tn=(e,t)=>`${e.join(",")}
${t}`,oa=e=>`await $mounted();${e}`,hs=e=>["$scope","$__effect","$__import","$__state",...e],fs=e=>`return (async () => { with ($scope) { ${e} }
;$__state.done = true })()`,ms=e=>["$__exports","$__default","$__import",...e],us=e=>`return (async () => { "use strict";
${e}
;$__exports.done = true })()`,ps=e=>{let t=e.attrs[":setup"];return t===void 0?null:t.trim()===""?[]:$n(t)},gs=(e,t,n=Ya)=>{let a=new Set;return e.forEach(r=>{(n(r.content)??t(r))?.forEach(({name:i})=>a.add(i))}),a},vs="__jq79precompiled",ys="jq79-precompiled",ws=(e,t)=>`function anonymous(${e.join(",")}
) {
${t}
}`,bs="0.7.14",ar=e=>Object.fromEntries(Array.from(e.attributes).map(t=>[t.name,t.value])),rr="http://www.w3.org/1999/xhtml",or=e=>{let t=ar(e),n=e.namespaceURI,a=t[ht];delete t[ht];let r=n!==null&&n!==rr;return{tag:r?e.tagName:e.tagName.toLowerCase(),attrs:t,...a===void 0?{}:{component:a},...r?{ns:n}:{},children:Array.from((e instanceof HTMLTemplateElement?e.content:e).childNodes).flatMap(i=>{if(i.nodeType===Node.TEXT_NODE){let o=i.textContent??"";return o?[o]:[]}return i.nodeType===Node.ELEMENT_NODE?[or(i)]:[]})}},ft=new Map,at=new Map,Cn=!1,nn,$t=class extends Error{constructor(e,t){super(`${e}. ${t}`),P(this,"reason",e),P(this,"hint",t)}},ks=()=>new $t("was not precompiled","Safe mode never builds code at runtime: the component's precompiled functions did not reach the page."),Ss=(e,t)=>{let n=globalThis[vs];if(Array.isArray(n)&&n.length>0)for(let[a,r,i]of n.splice(0))at.set(tn(a,r),i);return at.size===0?void 0:at.get(tn(e,t))},En=(e,t,n="")=>{let a=Ss(e,t);if(a===null)throw new SyntaxError("jq79: this code did not compile when it was precompiled");if(a!==void 0)return a;if(nn!==void 0)return xs(e,t,n,nn);if(Cn)throw ks();return new Function(...e,t+n)},Rn=()=>{if(!(typeof document>"u"))for(let e of Array.from(document.querySelectorAll("script[nonce]"))){let t=e.nonce||e.getAttribute("nonce");if(t)return t}},ia="__jq79built",xs=(e,t,n,a)=>{let r=document.createElement("script");r.setAttribute("nonce",a),r.textContent=`document.currentScript.${ia} = ${ws(e,t)}${n}`;let i,o=l=>{i=l.error??new SyntaxError(l.message),l.preventDefault()};window.addEventListener("error",o);try{(document.head??document.documentElement).append(r)}finally{window.removeEventListener("error",o),r.remove()}let s=r[ia];if(typeof s=="function")return at.set(tn(e,t),s),s;throw i!==void 0?i:new $t("could not be built","The page's CSP refused a <script> carrying the nonce jq79 read from the page.")},sa=new Set,$s=(e,t)=>{sa.has(e)||(sa.add(e),console.error(`jq79: safeEval() is on, and "${e}" ${t.reason}, so it rendered as nothing. ${t.hint}`))},Bt=(e,t)=>{if(!(t in e)){if(t in globalThis)return globalThis[t];throw new ReferenceError(`${t} is not defined`)}},ir=(e,t)=>{try{return En([...nr,...t],cs(e))}catch(n){return n instanceof $t&&$s(e,n),null}},Os=(e,t)=>{if(!pe.scopedNames)return null;let n=ds(e,t);if(n===null)return null;try{return En([...nr,...t],n)}catch{return null}},sr=(e,t,n)=>{let a=ft.get(e);if(a===void 0){let r=Os(t,n);a=r?{fn:r,scoped:!0}:{fn:ir(t,n),scoped:!1},ft.set(e,a)}return a},lr=(e,t)=>`${t.join(",")}|${e}`,Ms=(e,t)=>sr(lr(e,t),e,t).fn,Cs=(e,t,n)=>{let a=ir(t,n);return ft.set(e,{fn:a,scoped:!1}),a},Es=/^(?:([\w$]+) is not defined|Can't find variable: ([\w$]+))/,Rs=100,Ae=new Map,_n=new Set,mt=0,an=!1,rn=new Set,_s=()=>{an=!1,!(mt>0)&&(Ae.forEach(({name:e,expr:t,scope:n},a)=>{e in n||(_n.add(a),console.warn(`jq79: ${e} is not defined - evaluating "${t}". Template expressions resolve against the component store: a top-level let/var/const in a :setup script, a declared prop, or a global. Note a "function name() {}" declaration is not on the store - write "const name = () => {}".`))}),Ae.clear())},cr=()=>{an||mt>0||!Ae.size||(an=!0,queueMicrotask(_s))},dr=e=>{mt++;let t=()=>{mt--,cr()};e.then(t,t)},As=(e,t)=>{if(rn.has(e))return;rn.add(e);let n=t?.message||String(t);console.error(`jq79: ${n} - evaluating "${e}". The expression rendered as nothing. If the value arrives later, guard it - "a?.b", or :if on the element.`)},hr=(e,t,n)=>{if(!(n instanceof ReferenceError))return As(e,n);let a=Es.exec(n.message),r=a?.[1]??a?.[2];if(!r)return;let i=`${r}|${e}`;_n.has(i)||Ae.has(i)||Ae.size>=Rs||(Ae.set(i,{name:r,expr:e,scope:t}),cr())},fr=(e,t,n)=>{let a=n?Object.keys(n):[],r=lr(e,a),{fn:i,scoped:o}=sr(r,e,a);if(!i)return;let s=n?Object.values(n):[];if(!o)return i(t,Bt,...s);try{return i(t,Bt,...s)}catch(l){if(!(l instanceof ReferenceError))throw l;let c=Cs(r,e,a);if(!c)throw l;return c(t,Bt,...s)}},D=(e,t,n)=>{try{return fr(e,t,n)}catch(a){hr(e,t,a);return}},mr=(e,t,n)=>{try{return fr(e,t,n)}catch(a){if(!(a instanceof ReferenceError))throw a;hr(e,t,a);return}},ur=(e,t)=>{if(e.length===1){let a=e[0];return typeof a=="string"?a:String(D(a.expr,t)??"")}let n="";for(let a of e)n+=typeof a=="string"?a:String(D(a.expr,t)??"");return n},pr=(e,t,n,a)=>{let[r,...i]=t.slice(1).split("."),o=new Set(i);e.addEventListener(r,s=>{if(o.has("self")&&s.target!==e)return;o.has("prevent")&&s.preventDefault(),o.has("stop")&&s.stopPropagation();let l=mr(n,a,{$event:s});typeof l=="function"&&l.call(e,s)},{once:o.has("once"),capture:o.has("capture")})},Is=(e,t,n,a)=>{let[r,...i]=t.slice(1).split("."),o=new Set(i),s=l=>{o.has("prevent")&&l.preventDefault(),o.has("stop")&&l.stopPropagation(),o.has("once")&&e.off(r,s),Ge(()=>{let c=mr(n,a,{$event:l});typeof c=="function"&&c(l)})};e.on(r,s)},An=e=>e instanceof DocumentFragment?{first:e.firstChild,last:e.lastChild}:{first:e,last:e},Ot=({first:e,last:t})=>{for(let n=e;n;){let a=n===t?null:n.nextSibling;n.parentNode?.removeChild(n),n=a}},Ps=e=>{e.forEach(t=>{if(t.first===t.last)return Ot(t);if(!t.first.parentNode)return;let n=document.createRange();n.setStartBefore(t.first),n.setEndAfter(t.last),n.deleteContents()})},Ns=(e,t)=>{let n=[],a=null;return e.forEach(r=>{if(!t(r)){a=null;return}a&&a.last.nextSibling===r.range.first?a.last=r.range.last:n.push(a={first:r.range.first,last:r.range.last})}),n},Ls=({first:e,last:t},n)=>{let a=n.nextSibling;for(let r=e;r;){let i=r===t?null:r.nextSibling;n.parentNode.insertBefore(r,a),r=i}},la=(e,t)=>{let n=t.replace(/-/g,"").toLowerCase();for(let a=e;a&&a!==Object.prototype;a=Object.getPrototypeOf(a))for(let r of Object.keys(a))if(/^[A-Z]/.test(r)&&r.replace(/-/g,"").toLowerCase()===n)return r;return null},Ee=null,ut=null,gr=new WeakSet,zs=e=>{let t={memo:Ee,base:ut};return Ee=new Map,ut=e,t},Ts=e=>{Ee=e.memo,ut=e.base},ca=(e,t)=>e.component!==void 0?da(t,e.component):e.tag.includes("-")?da(t,e.tag):null,re=e=>e.component??e.tag,da=(e,t)=>{if(!Ee)return la(e,t);let n=t.replace(/-/g,"").toLowerCase();for(let a=e;a&&a!==Object.prototype;a=Object.getPrototypeOf(a)){if(a===ut){if(Ee.has(t))return Ee.get(t);let r=la(a,t);return Ee.set(t,r),r}if(!gr.has(a)){for(let r of Object.keys(a))if(/^[A-Z]/.test(r)&&r.replace(/-/g,"").toLowerCase()===n)return r}}return null},js=e=>{let t=new Set;for(let n=e;n&&n!==Object.prototype;n=Object.getPrototypeOf(n))for(let a of Object.keys(n))/^[A-Z]/.test(a)&&t.add(a);return[...t].sort()},Ds=(e,t)=>{let n=js(t);return new Error(`jq79: <${e}> is not defined - no component of that name is in scope, and nothing renders here. Import it in a :setup script, declare it as a prop, or add a <template name="${e}"> to this file. In scope: ${n.length?n.join(", "):"(none)"}.`)},ha=100,Ft=0,vr=Symbol("jq79.slots"),Ue=e=>Object.keys(e.attrs).find(t=>t===":slot"||t.startsWith(":slot.")),Bs=e=>e==="default"?":slot":`:slot.${e}`,Fs=e=>typeof e!="string"||e.trim()!=="",qs=e=>{let t={},n=[];e.children.forEach(r=>{let i=typeof r=="object"&&r.tag==="template"?Ue(r):void 0;if(typeof r=="string"||i===void 0){n.push(r);return}let o=tr(i.slice(6));if(o in t){console.warn(`jq79: two <template ${Bs(o)}> in <${re(e)}>; the second was ignored`);return}t[o]={nodes:r.children,binder:r.attrs[i]||void 0}});let a=n.some(Fs);return a&&"default"in t?console.warn(`jq79: <${re(e)}> has both a <template :slot> and content outside it - the <template> is the default slot's content, and the rest was ignored`):a&&(t.default={nodes:n,binder:e.attrs[":slot"]||void 0}),t},Gs=(e,t,n)=>{$n(t)?.forEach(({name:a,as:r,default:i})=>{let o=r??a;Object.defineProperty(e,o,{enumerable:!0,configurable:!0,get:()=>{let s=n[a]?.();return s===void 0&&i!==void 0?D(i,e):s},set:()=>console.warn(`jq79: "${o}" is a slot prop - it comes from the component, so assigning to it does nothing`)})})},Us=e=>{let t=Ue(e);return console.warn(`jq79: <template ${t}> fills a slot only as a direct child of a component tag; here it rendered nothing`),document.createComment(`misplaced ${t}`)},Ws=(e,t)=>{let n=Object.entries(qs(e));if(!n.length)return null;let a={};return n.forEach(([r,i])=>{a[r]=Hs(i,t)}),a},Hs=(e,t)=>(n,a,r,i)=>{let o=Object.create(t);Gs(o,e.binder,n);let s=o[Qt]??[];Object.defineProperty(o,Qt,{value:[...s,a]});let l=Ke(o);return l.ownedBy(a),r.onDispose(()=>l.dispose()),Te(e.nodes,o,l,i)},Vs=(e,t,n,a)=>{let r=tr(e.tag.slice(5)),i=document.createDocumentFragment(),o=document.createComment(e.tag),s=document.createComment(`/${e.tag}`);i.append(o,s);let l=t[vr]?.[r];if(!l)return i.insertBefore(Te(e.children,t,n,a),s),i;let c={};return Object.entries(e.attrs).forEach(([d,f])=>{if(!(d===je||De(d)||d.startsWith("@")))if(d.startsWith(":")){let b=f||d.slice(1);c[ge(d.slice(1))]=()=>D(b,t)}else c[ge(d)]=()=>f}),i.insertBefore(l(c,t,n,a),s),i},yr="data-c79-box",Ks=(e,t,n)=>{if(t.ns!==void 0)return document.createDocumentFragment();let a=document.createElement(xt(e));a.setAttribute(yr,"");let r=t.attrs[je];return r!==void 0&&a.setAttribute(je,r),n||zl(),a},fa=new WeakSet,Ys=(e,t)=>{if(e.ns===void 0||fa.has(e))return;let n=t.template.find(r=>typeof r=="object");if(n===void 0||n.ns!==void 0)return;fa.add(e);let a=e.ns==="http://www.w3.org/1998/Math/MathML"?"<math>":"<svg>";console.warn(`jq79: <${re(e)}> is used inside ${a} and its template starts with <${n.tag.toLowerCase()}>, which is parsed as HTML - it renders and never draws. A component's template decides its own namespace, so root it at ${a}`)},ma=(e,t,n,a,r)=>{let i=Ks(e,t,r),o=!(i instanceof DocumentFragment),s=o?null:document.createComment(`/${e}`);o||i.append(document.createComment(e),s);let l=Ws(t,n),c={},d={},f=[],b=[],E=!1,B;Object.entries(t.attrs).forEach(([v,x])=>{if(v!==je){if(v===":props"||v.startsWith(":props.")){E=!0,b.push({expr:x});return}if(De(v)){Hl.has(v)&&(B??(B=[])).push(v.slice(1));return}if(v.startsWith("@"))f.push([v,x]);else if(v===":model"||v.startsWith(":model.")){let M=v===":model"?"default":ge(v.slice(7));d[M]=x||(v===":model"?"model":M)}else if(v.startsWith(":")){let M=ge(v.slice(1));c[M]=x||M,b.push({name:M,expr:x||M})}else{let M=ge(v),U=JSON.stringify(x);c[M]=U,b.push({name:M,expr:U})}}});let N=v=>v==="default"?":model":`:model.${v}`,T=v=>v==="default"?"model":v,k=new Set;Object.entries(d).forEach(([v,x])=>{let M=T(v);c[M]!==void 0&&console.warn(`jq79: <${re(t)}> binds prop "${M}" through both :${M} and ${N(v)} - ${N(v)} wins`),c[M]=x,Ms(ra(x),["$value"])===null&&(k.add(v),console.warn(`jq79: ${N(v)}="${x}" is not assignable - updates from <${re(t)}> will be dropped`))});let _=()=>{let v={};return b.forEach(({name:x,expr:M})=>{if(x!==void 0)v[x]=D(M,n);else{let U=D(M,n);U!==null&&typeof U=="object"&&Object.assign(v,U)}}),Object.entries(d).forEach(([x,M])=>{v[T(x)]=D(M,n)}),v},z=null,G=null,W=null,K=new Set,te=v=>{if(v==null){if(!n[zr]?.has(e)||K.has("unfilled"))return;K.add("unfilled"),console.error(`jq79: <${re(t)}> is declared as a prop and the parent passed nothing - nothing renders here. Pass it (:${e}="…"), or drop it from the signature to use the one declared in this file.`);return}K.has("type")||(K.add("type"),console.error(`jq79: <${re(t)}> is ${typeof v}, not a component - nothing renders here`))};return a.effect(()=>{let v=D(e,n),x=v instanceof q?v:null;if(x||te(v),x===G||(W?.dispose(),W=null,z?.destroy(),z=null,G=x,!x))return;Ys(t,x);let M=new q({template:x.template,scripts:x.scripts,styles:x.styles,modules:x.modules,filename:x.filename,siblings:x.siblings,name:x.name});if(l&&(M.slots=l),Object.keys(d).length){let F=new Set;M.modelWriteback=(j,X)=>{let Y=j==null?"default":ge(String(j)),se=d[Y];return se===void 0?(F.has(Y)||(F.add(Y),console.warn(`jq79: <${re(t)}> has no ${N(Y)} - bound: ${Object.keys(d).map(N).join(", ")}`)),!1):k.has(Y)?!1:(Ge(()=>D(ra(se),n,{$value:X})),!0)}}f.forEach(([F,j])=>Is(M,F,j,n));let U=Ul(M.scripts);Wl(t,e,Object.keys(c),U),B&&Vl(t,e,B,U);let H=$a(Ge(_),U),y=document.createDocumentFragment();if(Ft>=ha){console.error(`jq79: <${re(t)}> is ${ha} levels deep inside itself; giving up here. A component that renders itself stops when its data stops - is there a cycle in it?`);return}Ft++;try{(r?M.renderShadow(H):M.render(H)).mount(y)}finally{Ft--}let A=n[yt];A&&M.holdOwner(A.owner),s?s.parentNode.insertBefore(y,s):i.appendChild(y);let I=Ke(n,!0);if(E){let F=[];I.effect(()=>{let j=$a(_(),U),X=Object.keys(j);F.forEach(Y=>{Y in j||(M.data[Y]=void 0)}),X.forEach(Y=>{M.data[Y]=j[Y]}),F=X})}else Object.entries(c).forEach(([F,j])=>{U!==null&&!U.has(F)||I.effect(()=>{M.data[F]=D(j,n)})});W=I,z=M}),a.onDispose(()=>{W?.dispose(),z?.destroy()}),i},Zs=(e,t)=>{let n=()=>{let a=D(e,t);return a!==null&&typeof a=="object"?a:null};return new Proxy(t,{has(a,r){let i=n();return i!==null&&Reflect.has(i,r)||Reflect.has(a,r)},get(a,r){let i=n();return i!==null&&Reflect.has(i,r)?i[r]:Reflect.get(a,r)},set(a,r,i){let o=n();return o!==null&&Reflect.has(o,r)?(o[r]=i,!0):Reflect.set(a,r,i)}})},Se=e=>typeof e=="string"?e.split(/\s+/).filter(Boolean):Array.isArray(e)?e.flatMap(Se):e!==null&&typeof e=="object"?Object.entries(e).flatMap(([t,n])=>n?Se(t):[]):[],Js=e=>typeof e=="function"?(t,n,a)=>{try{return!!e(t,n,a)}catch{return!1}}:typeof e=="string"||Array.isArray(e)?hi(e):()=>!1,Xs=new Set(["allowfullscreen","async","autofocus","autoplay","checked","controls","default","defer","disabled","formnovalidate","inert","ismap","itemscope","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","selected"]),In=e=>e.ns===void 0?document.createElement(e.tag):document.createElementNS(e.ns,e.tag),Qs={"http://www.w3.org/2000/svg":["svg","feGaussianBlur"],"http://www.w3.org/1998/Math/MathML":["math","mi"]},ua=new Map,el=(e,t)=>{let n=`${e} ${t}`,a=ua.get(n);if(a!==void 0)return a;let r=Qs[e],i=t;if(r!==void 0&&typeof DOMParser<"u"&&/^[a-z][a-z0-9]*$/.test(t)){let[o,s]=r;i=new DOMParser().parseFromString(`<${o}><${s} ${t}="x"/></${o}>`,"text/html").querySelector(s)?.getAttributeNames().find(l=>l.toLowerCase()===t)??t}return ua.set(n,i),i},wr=(e,t)=>{let n=e.namespaceURI;if(n===null||n===rr)return t;let a=t.replace(/-/g,"").toLowerCase(),r=el(n,a);return r===a?t:r},br=(e,t,n)=>{let a=Xs.has(t);(a?!n:n==null)?e.removeAttribute(t):e.setAttribute(t,a?"":String(n))},pe={cloneSkeletons:!0,scopedNames:!0},tl=new Set([":text",":html",":value",":checked",":selected"]),nl=e=>e.startsWith("@")||e===":class"||e.startsWith(":class.")||tl.has(e)?!0:e.startsWith(":")?e===":model"?!1:!De(e)&&!e.includes("."):e!==ht,kr=e=>{if(e.component||e.tag.includes("-")||Mn(e.tag)||e.tag==="template"||e.ns===void 0&&document.createElement(e.tag)instanceof HTMLUnknownElement)return!1;for(let t in e.attrs)if(!nl(t))return!1;return e.attrs[":text"]!==void 0||e.attrs[":html"]!==void 0?!0:e.children.every(t=>typeof t=="string"||kr(t))},Sr=(e,t,n)=>{let a=In(e),r,i=null;for(let f in e.attrs){let b=e.attrs[f];if(f.startsWith("@"))n.push({kind:"event",path:t,attr:f,expr:b});else if(f===":class")r=b;else if(f.startsWith(":class."))(i??(i=[])).push([f.slice(7),b]);else if(!De(f))if(f.startsWith(":")){let E=f.slice(1);n.push({kind:"attr",path:t,name:wr(a,E),expr:b||ge(E)})}else a.setAttribute(f,b)}(r!==void 0||i)&&n.push({kind:"class",path:t,classExpr:r,toggles:i,staticClasses:new Set(Se(e.attrs.class??""))});let o=e.attrs[":text"],s=e.attrs[":html"];o!==void 0?n.push({kind:"textContent",path:t,expr:o}):s!==void 0?n.push({kind:"html",path:t,expr:s}):e.children.forEach((f,b)=>{if(typeof f=="string"){f.includes("{{")?(n.push({kind:"text",path:[...t,b],parts:Qa(f)}),a.appendChild(document.createTextNode(""))):a.appendChild(document.createTextNode(f));return}a.appendChild(Sr(f,[...t,b],n))});let l=e.attrs[":value"];l!==void 0&&n.push({kind:"value",path:t,expr:l});let c=e.attrs[":checked"];c!==void 0&&n.push({kind:"checked",path:t,expr:c});let d=e.attrs[":selected"];return d!==void 0&&n.push({kind:"selected",path:t,expr:d}),a},al=3,xr=e=>e.attrs[":text"]!==void 0||e.attrs[":html"]!==void 0?1:1+e.children.reduce((t,n)=>t+(typeof n=="string"?0:xr(n)),0),pa=new WeakMap,ga=new WeakSet,rl=e=>{let t=pa.get(e);if(t!==void 0)return t;if(!ga.has(e))return ga.add(e),null;let n=null;if(kr(e)&&xr(e)>=al){let a=[];n={skeleton:Sr(e,[],a),ops:a}}return pa.set(e,n),n},ol=(e,t)=>{let n=e;for(let a=0;a<t.length;a++)n=n.childNodes[t[a]];return n},il=(e,t,n)=>{let a=e.skeleton.cloneNode(!0);for(let r of e.ops){let i=r.path.length===0?a:ol(a,r.path);if(r.kind==="text"){let o=i,s=r.parts;n.effect(()=>{let l=ur(s,t);o.textContent!==l&&(o.textContent=l)})}else if(r.kind==="event")pr(i,r.attr,r.expr,t);else if(r.kind==="attr"){let o=i,{name:s,expr:l}=r;n.effect(()=>br(o,s,D(l,t)))}else if(r.kind==="class"){let o=i,{classExpr:s,toggles:l,staticClasses:c}=r,d=[];n.effect(()=>{let f=s!==void 0?Se(D(s,t)):[];l?.forEach(([b,E])=>{D(E,t)&&f.push(...Se(b))}),d.forEach(b=>{!f.includes(b)&&!c.has(b)&&o.classList.remove(b)}),o.classList.add(...f),d=f})}else if(r.kind==="textContent"){let o=i,{expr:s}=r;n.effect(()=>{let l=String(D(s,t)??"");o.textContent!==l&&(o.textContent=l)})}else if(r.kind==="html"){let o=i,{expr:s}=r;n.effect(()=>{o.innerHTML=Fa(String(D(s,t)??""))})}else if(r.kind==="value"){let o=i,{expr:s}=r;n.effect(()=>{let l=String(D(s,t)??"");o.value!==l&&(o.value=l)})}else if(r.kind==="checked"){let o=i,{expr:s}=r;n.effect(()=>{let l=!!D(s,t);o.checked!==l&&(o.checked=l)})}else if(r.kind==="selected"){let o=i,{expr:s}=r;n.effect(()=>{let l=!!D(s,t);o.selected!==l&&(o.selected=l)})}}return a},Pn=(e,t,n,a)=>{let r=e.attrs[":with"],i=r!==void 0?Zs(r,t):t;if(Mn(e.tag))return Vs(e,i,n,a);if(e.tag==="template"&&Ue(e)!==void 0)return Us(e);let o=ca(e,i);if(o)return ma(o,e,i,n,a);if(pe.cloneSkeletons){let k=rl(e);if(k)return il(k,i,n)}let s=In(e);if(e.component!==void 0&&i[yt]?.count===0)throw Ds(e.component,i);let l=e.ns===void 0&&(e.component!==void 0||e.tag.includes("-"));if(l){let k=!1;n.effect(()=>{if(k)return;let _=ca(e,i);if(!_)return;k=!0;let z=ma(_,e,i,n,a),G=An(z);n.onDispose(()=>Ot(G)),s.replaceWith(z)})}for(let k in e.attrs){let _=e.attrs[k];if(k.startsWith("@"))pr(s,k,_,i);else if(k===":model"||k.startsWith(":model."))l||console.warn(`jq79: ${k} on <${re(e)}> does nothing - :model binds component tags only (for now)`);else if(!De(k))if(k.startsWith(":"))if(l)s.setAttribute(k,_);else{let z=k.slice(1),G=_||ge(z),W=wr(s,z);n.effect(()=>br(s,W,D(G,i)))}else s.setAttribute(k,_)}let c=e.attrs[":class"],d=null;for(let k in e.attrs)k.startsWith(":class.")&&(d??(d=[])).push([k.slice(7),e.attrs[k]]);if(c!==void 0||d){let k=new Set(Se(e.attrs.class??"")),_=[];n.effect(()=>{let z=c!==void 0?Se(D(c,i)):[];d?.forEach(([G,W])=>{D(W,i)&&z.push(...Se(G))}),_.forEach(G=>{!z.includes(G)&&!k.has(G)&&s.classList.remove(G)}),s.classList.add(...z),_=z})}let f=e.attrs[":text"],b=e.attrs[":html"],E=e.attrs[":html.allowed"];E!==void 0&&b===void 0&&console.warn("jq79: :html.allowed without :html on the same element does nothing"),f!==void 0?n.effect(()=>{let k=String(D(f,i)??"");s.textContent!==k&&(s.textContent=k)}):b!==void 0?n.effect(()=>{let k=E!==void 0?{allowUrl:Js(D(E,i))}:void 0;s.innerHTML=Fa(String(D(b,i)??""),k)}):s instanceof HTMLTemplateElement?Te(e.children,i,n,a,s.content):Te(e.children,i,n,a,s);let B=e.attrs[":value"];B!==void 0&&n.effect(()=>{let k=String(D(B,i)??"");s.value!==k&&(s.value=k)});let N=e.attrs[":checked"];N!==void 0&&n.effect(()=>{let k=!!D(N,i);s.checked!==k&&(s.checked=k)});let T=e.attrs[":selected"];return T!==void 0&&n.effect(()=>{let k=!!D(T,i);s.selected!==k&&(s.selected=k)}),s},sl=(e,t,n,a)=>{let r=document.createComment("if"),i=document.createDocumentFragment();i.appendChild(r);let o=null,s=null,l=null;return n.effect(()=>{let c=e.find(f=>f.expr===void 0||D(f.expr,t))??null;if(c===s||(l?.dispose(),o&&Ot(o),o=null,s=c,!c))return;l=Ke(t);let d=Pn(c.node,t,l,a);o=An(d),r.parentNode.insertBefore(d,r.nextSibling)}),n.onDispose(()=>l?.dispose()),i},Le=(e,t,n)=>{Object.defineProperty(e,t,{value:n,writable:!0,enumerable:!0,configurable:!0})},ll=e=>{let t=new Uint8Array(e.length),n=[],a=new Int32Array(e.length).fill(-1);for(let r=0;r<e.length;r++){let i=e[r];if(i<0)continue;let o=0,s=n.length;for(;o<s;){let l=o+s>>1;e[n[l]]<i?o=l+1:s=l}o>0&&(a[r]=n[o-1]),n[o]=r}for(let r=n.length?n[n.length-1]:-1;r!==-1;r=a[r])t[r]=1;return t},cl=e=>{if(e===null||typeof e!="object"||Array.isArray(e))return!1;let t=Object.getPrototypeOf(e);return t===Object.prototype||t===null},$r=(e,t)=>typeof e=="string"?t.some(n=>ya(e,n)):Object.values(e.attrs).some(n=>t.some(a=>ya(n,a)))||e.children.some(n=>$r(n,t)),Or=e=>typeof e!="string"&&(":if"in e.attrs||":elseif"in e.attrs||":else"in e.attrs||":each"in e.attrs||e.component!==void 0||e.tag.includes("-")||Mn(e.tag)||e.children.some(Or)),va=/[A-Za-z0-9_$]/,dl=/^[A-Za-z_$][\w$]*\.[A-Za-z_$][\w$]*$/,ya=(e,t)=>{for(let n=e.indexOf(t);n!==-1;n=e.indexOf(t,n+1)){let a=n===0?"":e[n-1],r=e[n+t.length]??"";if(!va.test(a)&&!va.test(r))return!0}return!1},qt=new WeakMap,hl=e=>{let t=qt.get(e);if(t!==void 0)return t;let n=e.attrs[":each"].match(ls);if(!n)return qt.set(e,null),null;let[,a,r,i]=n,o=e.attrs[":key"],s=o===a,l=o!==void 0&&!s&&dl.test(o)&&o.startsWith(`${a}.`)?o.slice(a.length+1):void 0,{[":each"]:c,[":key"]:d,[":window"]:f,...b}=e.attrs,E={...e,attrs:b},B=["$index",...r?[r]:[]],N=$r(E,B),T=/^[A-Z]/.test(a)||r!==void 0&&/^[A-Z]/.test(r),k=o!==void 0&&Or(E),_={itemName:a,atName:r,listExpr:i,keyExpr:o,keyIsItem:s,keyProp:l,itemNode:E,readsPosition:N,namesComponent:T,nestsScopes:k,windowExpr:f};return qt.set(e,_),_},Ze=8,fl=/^(auto|scroll|overlay)$/,ml=e=>{for(let t=e;t;t=t instanceof ShadowRoot?t.host:t.parentNode)if(!(!(t instanceof HTMLElement)||t===document.body||t===document.documentElement)&&fl.test(getComputedStyle(t).overflowY))return t;return null},ul=(e,t,n,a,r)=>{let i=()=>{let v=e.component!==void 0||e.tag.includes("-")?document.createElement("div"):In(e);return v.setAttribute("aria-hidden","true"),v.setAttribute("style","height: 0px; margin: 0; padding: 0; border: 0; list-style: none; visibility: hidden"),v},o=i(),s=i(),l=Pe({start:0,count:-1}),c=0,d=0,f=null,b=!1,E=0,B=null,N=null,T=v=>Math.ceil(v/c)+1+2*Ze,k=(v,x)=>{v=Math.max(0,Math.min(v,Math.max(0,d-x))),(l.start!==v||l.count!==x)&&Wa(()=>{l.start=v,l.count=x})},_=()=>{let v=o.getBoundingClientRect().top;if(f){let x=f.getBoundingClientRect(),M=f.scrollTop;return{listTop:v-x.top-f.clientTop+M,scrollTop:M,height:f.clientHeight||window.innerHeight}}return{listTop:v+window.scrollY,scrollTop:window.scrollY,height:window.innerHeight}},z=()=>{if(E=0,!(c>0)||!o.isConnected)return;let{listTop:v,scrollTop:x,height:M}=_();k(Math.floor((x-v)/c)-Ze,T(M))},G=()=>{E||(E=typeof requestAnimationFrame=="function"?requestAnimationFrame(z):setTimeout(z,16))},W=(v,{block:x="nearest"}={})=>{if(K(),c>0&&o.isConnected){let{listTop:H,scrollTop:y,height:A}=_(),I=H+v*c,F=I+c,j=y;x==="start"?j=I:x==="end"?j=F-A:x==="center"?j=I-(A-c)/2:I<y?j=I:F>y+A&&(j=F-A),j!==y&&(f?f.scrollTop=j:window.scrollTo(window.scrollX,j)),z()}let M=l.count>0?l.count:T(window.innerHeight||800);(v<l.start||v>=l.start+M)&&k(v-Ze,M);let U=r().find(H=>H.scope.$index===v);return U?U.range.first:null},K=()=>{b||!o.isConnected||(b=!0,N=o.parentElement,f=ml(o.parentNode),(f??window).addEventListener("scroll",G,{passive:!0}),window.addEventListener("resize",G),f&&typeof ResizeObserver=="function"&&(B=new ResizeObserver(G),B.observe(f)),N&&Object.defineProperty(N,"$scrollTo",{value:W,configurable:!0,writable:!0}),z())};a.onDispose(()=>{E&&(typeof cancelAnimationFrame=="function"?cancelAnimationFrame:clearTimeout)(E),b&&((f??window).removeEventListener("scroll",G),window.removeEventListener("resize",G),B?.disconnect(),N&&N.$scrollTo===W&&delete N.$scrollTo)});let te=!1;return{top:o,bottom:s,range:v=>{d=v;let x=Number(D(t,n)),M=c;if(c=x>0?x:0,c&&c!==M&&b&&o.isConnected){let{listTop:A,scrollTop:I,height:F}=_(),j=ee(l);j.count=T(F),j.start=Math.max(0,Math.floor((I-A)/c)-Ze)}if(!c)return o.style.height=s.style.height="0px",[0,v];let U=l.count>0?l.count:T(window.innerHeight||800),H=Math.max(0,Math.min(l.start,v-U)),y=Math.min(v,H+U);return o.style.height=`${H*c}px`,s.style.height=`${(v-y)*c}px`,[H,y]},settled:()=>{b||te||(te=!0,queueMicrotask(()=>{te=!1,K()}))}}},pl=(e,t,n,a)=>{let r=hl(e);if(!r)return document.createComment(`invalid :each expression "${e.attrs[":each"]}"`);let{itemName:i,atName:o,listExpr:s,keyExpr:l,keyIsItem:c,keyProp:d,itemNode:f,readsPosition:b,namesComponent:E,nestsScopes:B,windowExpr:N}=r,T=document.createComment("each"),k=document.createDocumentFragment();k.appendChild(T);let _=N===void 0?null:ul(f,N,t,n,()=>z);_&&k.append(_.top,_.bottom),(":if"in e.attrs||":elseif"in e.attrs||":else"in e.attrs)&&console.warn("jq79: :if/:elseif/:else on a :each element is ignored; filter the list expression instead");let z=[],G=!1;return n.effect(()=>{let W=zs(t);try{let K=D(s,t),te=Array.isArray(K),v=te?null:cl(K)?Object.keys(K):[],x=te?K.length:v.length,[M,U]=_?_.range(x):[0,x],H=new Map;z.forEach((h,p)=>{h.pos=p;let u=H.get(h.key);u?u.push(h):H.set(h.key,[h])});let y=new Set,A=[],I=[],F=[],j=[],X;for(let h=M;h<U;h++){let p=te?h:v[h],u=te?K[h]:K[p],S=p;c?S=u:d!==void 0&&u!==null&&typeof u=="object"?S=u[d]:l!==void 0&&(X===void 0?(X=Object.create(t),Le(X,i,u),o&&Le(X,o,p),Le(X,"$index",h)):(X[i]=u,o&&(X[o]=p),X.$index=h),S=D(l,X)),y.has(S)&&!G&&(G=!0,console.warn(`jq79: duplicate :key in :each "${e.attrs[":each"]}"; duplicates pair up by position`)),y.add(S);let g=H.get(S)?.shift();if(g&&Object.is(g.item,u)){let C=g.scope;C.$index!==h&&(b&&A.push(g),C.$index=h),o&&C[o]!==p&&(C[o]=p),F.push(g),j.push(g.pos);continue}if(g&&l!==void 0){let C=g.scope;C[i]=u,C.$index!==h&&(C.$index=h),o&&C[o]!==p&&(C[o]=p),g.item=u,I.push(g),F.push(g),j.push(g.pos);continue}g&&(g.fx.dispose(),Ot(g.range));let w=Object.create(t);Le(w,i,u),o&&Le(w,o,p),Le(w,"$index",h),E||gr.add(w);let O=Ke(t);B&&Object.defineProperty(w,Ha,{value:O});let $=An(Pn(f,w,O,a));F.push({key:S,item:u,scope:w,fx:O,range:$,pos:h}),j.push(-1)}let Y=new Set;H.forEach(h=>h.forEach(p=>Y.add(p))),Y.size&&(Y.forEach(h=>{h.dead=!0,h.fx.dispose()}),Ps(Ns(z,h=>h.dead===!0)));let se=_?_.top:T,m=ll(j);F.forEach((h,p)=>{!m[p]&&se.nextSibling!==h.range.first&&Ls(h.range,se),se=h.range.last}),A.forEach(h=>Ge(()=>h.fx.refresh())),I.forEach(h=>Ge(()=>h.fx.rerun())),z=F}finally{Ts(W)}_?.settled()}),n.onDispose(()=>z.forEach(W=>W.fx.dispose())),k},Mr=(e,t)=>{let n=t;for(;n<e.length&&typeof e[n]=="string"&&!e[n].trim();)n++;return n},Gt=e=>{let t=":if"in e.attrs,n=":elseif"in e.attrs,a=":else"in e.attrs;if((t?1:0)+(n?1:0)+(a?1:0)<2)return;let r=[t?":if":null,n?":elseif":null,a?":else":null].filter(Boolean);console.warn(`jq79: ${r.join(" and ")} on the same <${re(e)}> - only ${r[0]} applies; the branches of a chain are sibling elements, one directive each`)},gl=(e,t)=>{let n=":elseif"in e.attrs?":elseif":":else";console.warn(t?`jq79: a second ${n} on <${re(e)}> - the chain before it already ended with :else, which closes it. One :if, any number of :elseif, at most one :else`:`jq79: ${n} on <${re(e)}> continues no :if - it renders unconditionally. A chain is :if, then :elseif, then :else, on adjacent siblings: anything but whitespace between them breaks it`)},vl=[":if",":elseif",":else",":each"],yl=(e,t)=>{if(e.tag!=="template"||e.ns!==void 0)return;let n=vl.find(a=>a in e.attrs);if(n!==void 0){if(Ue(e)!==void 0){if(t?.component===void 0)return;console.warn(`jq79: ${n} on <template ${Ue(e)}> is ignored - a slot is filled with its children as written. Put ${n} on the elements inside it, or on the component's tag`);return}console.warn(`jq79: ${n} on a nested <template> shows nothing - a <template>'s children live in its .content and never reach the page. Put ${n} on the elements themselves`)}},wl=[...er,":model",":slot"].map(e=>e.slice(1)),bl={":attrs":':attrs was removed in 0.7 - it now binds an attribute called "attrs". Bind them one at a time (:disabled="x", :title="y"), or :class for classes'},kl=e=>{for(let t in e.attrs){let n=bl[t];n!==void 0&&console.warn(`jq79: ${n}`)}},Sl=e=>{if(!(e.component!==void 0||e.tag.includes("-")))for(let t in e.attrs){if(!t.startsWith(":")||De(t)||t===":model"||t.startsWith(":model."))continue;let n=t.slice(1);if(n.includes(".")){console.warn(`jq79: ${t} is not a directive - it bound an attribute named "${n}". Dotted modifiers belong to an event: if you meant @${n}, that is the spelling`);continue}let a=wl.find(r=>n!==r&&n.startsWith(r));a!==void 0&&console.warn(`jq79: ${t} is not a directive - it bound an attribute named "${n}". A ":name" jq79 does not recognize binds that attribute (which is what :src and :disabled are). If you meant :${a}, that is the spelling`)}},Cr=(e,t)=>{e.forEach(a=>{typeof a!="string"&&(yl(a,t),kl(a),Sl(a),Cr(a.children,a))});let n=!1;for(let a=0;a<e.length;){let r=e[a];if(typeof r=="string"){r.trim()&&(n=!1),a++;continue}if(":each"in r.attrs){n=!1,a++;continue}if(Gt(r),":if"in r.attrs){a++;let i=s=>{let l=Mr(e,a),c=e[l];if(typeof c=="object"&&s in c.attrs)return a=l+1,c};for(let s=i(":elseif");s;s=i(":elseif"))Gt(s);let o=i(":else");o&&Gt(o),n=o!==void 0;continue}(":elseif"in r.attrs||":else"in r.attrs)&&gl(r,n),n=!1,a++}},wa=new WeakMap,xl=(e,t,n)=>{let a=wa.get(t);if(a)return a;let r=[{expr:t.attrs[":if"],node:t}],i=n+1,o=c=>{let d=Mr(e,i),f=e[d];if(typeof f=="object"&&c in f.attrs)return i=d+1,f};for(let c=o(":elseif");c;c=o(":elseif"))r.push({expr:c.attrs[":elseif"],node:c});let s=o(":else");s&&r.push({node:s});let l={branches:r,next:i};return wa.set(t,l),l},Te=(e,t,n,a=!1,r)=>{let i=r??document.createDocumentFragment(),o=0;for(;o<e.length;){let s=e[o];if(typeof s=="string"){let l=document.createTextNode(s);if(s.includes("{{")){let c=Qa(s);n.effect(()=>{let d=ur(c,t);l.textContent!==d&&(l.textContent=d)})}i.appendChild(l),o++;continue}if(":each"in s.attrs){i.appendChild(pl(s,t,n,a)),o++;continue}if(":if"in s.attrs){let l=xl(e,s,o);i.appendChild(sl(l.branches,t,n,a)),o=l.next;continue}i.appendChild(Pn(s,t,n,a)),o++}return i},je="data-jq79",$l=e=>{let t=2166136261;for(let n=0;n<e.length;n++)t=Math.imul(t^e.charCodeAt(n),16777619);return(t>>>0).toString(36)},Er=(e,t)=>{e.forEach(n=>{typeof n!="string"&&(n.attrs[je]=t,Er(n.children,t))})},Ol=/^:(before|after|first-line|first-letter)(?![\w-])/i,Rr=(e,t)=>{let n=0;for(let a=0;a<e.length;a++){let r=e[a];if(r==="\\")a++;else if(r==='"'||r==="'")for(a++;a<e.length&&e[a]!==r;)a+=e[a]==="\\"?2:1;else if(r==="("||r==="[")n++;else if(r===")"||r==="]")n--;else if(n===0&&t(a))return}},Ml=(e,t)=>{let n=e.length;return Rr(e,a=>e[a]!==":"||e[a+1]!==":"&&!Ol.test(e.slice(a))?!1:(n=a,!0)),`${e.slice(0,n)}[${je}="${t}"]${e.slice(n)}`},Cl=(e,t)=>{let n=_r(e),a=n.match(/^\s*/)[0],r=n.match(/\s*$/)[0],i=n.slice(a.length,n.length-r.length);if(!i)return e;let o=[],s=0;return Rr(i,l=>{i[l]===","&&(o.push(i.slice(s,l)),s=l+1)}),o.push(i.slice(s)),a+o.map(l=>l.trim()&&Ml(l.trim(),t)).join(", ")+r},_r=e=>{let t="";for(let n=0;n<e.length;){let a=e[n];if(a==="/"&&e[n+1]==="*"){let r=e.indexOf("*/",n+2);n=r===-1?e.length:r+2}else if(a==='"'||a==="'"){let r=n+1;for(;r<e.length&&e[r]!==a;)r+=e[r]==="\\"?2:1;t+=e.slice(n,r+1),n=r+1}else a==="\\"?(t+=e.slice(n,n+2),n+=2):(t+=a,n++)}return t},El=/(^|[\s>+~,(])([A-Z][A-Za-z0-9]*)(?![\w-])/g,Rl=/[a-z]/,_l=e=>e.replace(El,(t,n,a)=>Rl.test(a)?`${n}${xt(a)}`:t),Ar=/^\s*@(media|supports|container|layer|scope|document)\b/i,Ir=/^\s*@/,Al=e=>{let t="",n="",a="",r=[],i=()=>r.length===0||r[r.length-1],o=()=>{t+=i()&&!Ir.test(a)?_l(n):n,n=""},s=c=>{o(),t+=c,a+=c},l=(c,d)=>{o(),t+=c,a="",d!==void 0?r.push(d):c==="}"&&r.pop()};for(let c=0;c<e.length;){let d=e[c];if(d==="/"&&e[c+1]==="*"){let f=e.indexOf("*/",c+2),b=f===-1?e.length:f+2;s(e.slice(c,b)),c=b}else if(d==='"'||d==="'"){let f=c+1;for(;f<e.length&&e[f]!==d;)f+=e[f]==="\\"?2:1;s(e.slice(c,Math.min(f+1,e.length))),c=f+1}else d==="{"?(l("{",Ar.test(a)),c++):d==="}"||d===";"?(l(d),c++):(n+=d,a+=d,c++)}return o(),t},Il=(e,t)=>{/:deep\(|::v-deep|>>>/.test(e)&&console.warn("jq79: :deep()/::v-deep/>>> are not supported in <style scoped>; the rule will be dropped by the browser");let n="",a="",r=[],i=()=>r.length===0||r[r.length-1];for(let o=0;o<e.length;){let s=e[o],l=s;if(s==="/"&&e[o+1]==="*"){let c=e.indexOf("*/",o+2);l=e.slice(o,c===-1?e.length:c+2)}else if(s==='"'||s==="'"){let c=o+1;for(;c<e.length&&e[c]!==s;)c+=e[c]==="\\"?2:1;l=e.slice(o,c+1)}else s==="\\"&&(l=e.slice(o,o+2));if(o+=l.length,!i())n+=l,l==="{"?r.push(!1):l==="}"&&r.pop();else if(l==="{"){let c=_r(a),d=Ir.test(c);n+=(d?a:Cl(a,t))+"{",r.push(d&&Ar.test(c)),a=""}else l==="}"||l===";"?(n+=a+l,a="",l==="}"&&r.pop()):a+=l}return n+a},on=e=>{let t=is(e),n=new DOMParser().parseFromString(`<template>${t}</template>`,"text/html").querySelector("template"),a=[],r=[];Array.from(n.content.children).forEach(s=>{s.tagName==="TEMPLATE"?r.push(s):a.push(s)});let i=ba(a,e),o={};return r.forEach(s=>{let l=s.getAttribute("name");if(l===null){console.warn("jq79: a top-level <template> without a name declares nothing and was ignored");return}if(!ss.test(l)){console.warn(`jq79: <template name="${l}"> was ignored - a component name has to be PascalCase, or no tag could ever reference it (only capitalized names resolve as components)`);return}if(l in o){console.warn(`jq79: two <template name="${l}"> in one file; the second was ignored`);return}o[l]=new q({...ba(Array.from(s.content.children),s.innerHTML),siblings:o,name:l})}),Object.keys(o).length&&(i.siblings=o),i},Pl=/^(?:text|application)\/(?:x-)?typescript$/i,Nl=e=>"lang"in e?`lang="${e.lang}"`:Pl.test(e.type?.trim()??"")?`type="${e.type}"`:null,ba=(e,t)=>{let n=[],a=[],r=[];e.forEach(o=>{let s={attrs:ar(o),content:o.textContent??""};o.tagName==="SCRIPT"?n.push(s):o.tagName==="STYLE"?a.push(s):r.push(or(o))}),n.forEach(o=>{let s=Nl(o.attrs);s&&console.warn(`jq79: <script ${s}> needs the jq79/vite plugin to compile it. This component didn't go through the bundler, so its types were never stripped: the script will throw, or - for a plain \`let x: T = ...\` - silently fail to declare x.`)}),a.forEach(o=>{"lang"in o.attrs&&console.warn(`jq79: <style lang="${o.attrs.lang}"> needs the jq79/vite plugin to compile it. This component didn't go through the bundler, so its styles were left uncompiled and the browser will ignore them.`)}),a.forEach(o=>{"lang"in o.attrs||(o.content=Al(o.content))});let i=o=>"scoped"in o.attrs&&!("lang"in o.attrs);if(a.some(i)){let o=$l(t);Er(r,o),a.forEach(s=>{i(s)&&(s.scoped=Il(s.content,o))})}return Cr(r),{template:r,scripts:n,styles:a}},Pr=/\.html?([?#]|$)/,pt=e=>Pr.test(e)?hn(e):import(e),Nn=/^(?:\.\.?\/|\/|[a-z][a-z0-9+.-]*:)/i,sn=(e,t)=>{if(!Nn.test(e))return e;try{return new URL(e,new URL(t??"",document.baseURI)).href}catch{return e}},Ll=(e,t)=>e?`
//# sourceURL=${e}?jq79-script=${t}`:"",Nr=(e,t,n)=>{try{return En(e,t,Ll(n.filename,n.index??0))}catch(a){throw a instanceof $t?new Error(`jq79: safeEval() is on, and script ${n.index??0} of ${n.filename??"a component built from a string"} ${a.reason}. ${a.hint}`):a}},ka=e=>e.scoped??e.content,Fe=`:where([${yr}]) { display: contents }`,Ln=()=>Cn&&typeof Document<"u"&&"adoptedStyleSheets"in Document.prototype,gt=e=>{let t=new CSSStyleSheet;return t.replaceSync(e),t},zn=(e,t)=>{e.adoptedStyleSheets.includes(t)||(e.adoptedStyleSheets=[...e.adoptedStyleSheets,t])},ln=(e,t)=>{e.adoptedStyleSheets=e.adoptedStyleSheets.filter(n=>n!==t)},Je=null,qe=null,zl=()=>{if(Ln()){zn(document,qe??(qe=gt(Fe)));return}Je?.isConnected||(Je=document.createElement("style"),Je.textContent=Fe,document.head.appendChild(Je))},vt=new Map,Tl=e=>{let t=vt.get(e);if(!t){if(Ln()){let n=gt(e);zn(document,n),t={sheet:n,count:0}}else{let n=document.createElement("style");n.textContent=e,document.head.appendChild(n),t={el:n,count:0}}vt.set(e,t)}t.count++},jl=e=>{let t=vt.get(e);t&&--t.count<=0&&(t.sheet?ln(document,t.sheet):t.el?.remove(),vt.delete(e))},Dl=(e,t,n,a={},r=pt,i={})=>{let o={...qr,...a},s=new Proxy(t,{has:(d,f)=>f!=="$__effect"&&f!=="$__import"&&f!=="$__state"&&(Reflect.has(d,f)||!(f in globalThis)&&!(f in o))}),l={},c=Nr(hs(Object.keys(o)),fs(e),i)(s,n,r,l,...Object.values(o));return c.catch(d=>console.error("jq79: error in :setup script",d)),dr(c),{settled:c,sync:l.done===!0}},Sa=(e,t)=>{t?.forEach(({name:n,default:a})=>{e[n]===void 0&&(e[n]=a===void 0?void 0:D(a,e))})},Mt=e=>{let t=new Map;return n=>{if(t.has(n))return t.get(n);let a=e(n);return t.set(n,a),a}},Lr=e=>(e?.forEach(t=>Object.freeze(t)),e&&Object.freeze(e),e),Bl=Mt(Ni),cn=Mt(e=>Lr(Ya(e))),Fl=Mt(e=>{let t=kn(e);return Object.freeze(t.vars),Object.freeze(t)}),ql=Mt(e=>Lr(ps({attrs:{":setup":e}}))),dn=e=>{let t=e.attrs[":setup"],n=t===void 0?null:ql(t);return!n&&e.attrs[":setup"]!==void 0&&Gl(e,e.attrs[":setup"]),n},xa=new WeakSet,Gl=(e,t)=>{t.trim()==="_"||xa.has(e)||(xa.add(e),console.warn(`jq79: :setup="${t}" is not a props pattern, so this component declares no signature and takes whatever a parent passes - write the props it takes ("{ a, b }"), a bare :setup for none, or "_" to stay open on purpose`))},Ul=e=>{let t=null;return e.forEach(n=>{let a=cn(n.content)??dn(n);if(!a)return;let r=t??(t=new Set);a.forEach(({name:i})=>r.add(i))}),t},$a=(e,t)=>{if(t===null)return e;let n={};return Object.keys(e).forEach(a=>{t.has(a)&&(n[a]=e[a])}),n},Oa=new WeakMap,Wl=(e,t,n,a)=>{if(a===null)return;let r=Oa.get(e)??new Set;Oa.set(e,r),n.forEach(i=>{a.has(i)||r.has(i)||(r.add(i),console.warn(`jq79: :${i} is not declared by <${t}> - add it to the :setup signature, or drop it`))})},Hl=new Set([":value",":checked",":selected",":text",":html",":class"]),Ma=new WeakSet,Vl=(e,t,n,a)=>{if(a===null||Ma.has(e))return;let r=n.filter(i=>a.has(i));r.length&&(Ma.add(e),r.forEach(i=>console.warn(`jq79: :${i} on <${t}> is a directive, not a prop - <${t}> never receives its "${i}". Rename the prop (${r.map(o=>`:${o}`).join(", ")} are reserved on a component tag), or use :model for a value that goes both ways`)))},Kl=(e,t)=>{if(!e)return null;let n=Object.create(null),a=!1;return Object.entries(e).forEach(([r,i])=>{t.has(r)||(n[r]=i,a=!0)}),a?n:null},zr=Symbol("jq79.unfilledProps"),yt=Symbol("jq79.pendingScripts"),Yl=e=>e&&e.default!==void 0?e.default:e,Zl=(e,t,n,a={},r=pt,i={})=>{let o={...qr,...a},s={},l=Nr(ms(Object.keys(o)),us(e),i)(s,Yl,r,...Object.values(o)),c=B=>console.error("jq79: error in factory script",B),d=!1,f,b=()=>{if(d)return f;d=!0;let B=s.default;if(typeof B!="function")return;let N=T=>{T&&typeof T=="object"&&Object.assign(t,T)};try{let T=B(t,{$data:t,$props:t,$effect:n,...a});T instanceof Promise?f=T.then(N).catch(c):N(T)}catch(T){c(T)}return f},E=l.then(b,c);return dr(E),s.done&&b(),{settled:E,sync:s.done===!0&&f===void 0}},Jl="__JQ79_HMR_ENABLED__",Xl="__JQ79_HMR__",xe=null,Ql=e=>{if(!xe||!e.filename)return;let t=xe.get(e.filename);t||xe.set(e.filename,t=new Set),t.add(new WeakRef(e))},Ut=e=>{try{return new URL(e,document.baseURI).pathname}catch{return e}},ec=(e,t)=>{if(!xe)return 0;let n=Ut(e),a=on(t);oe?.forEach((s,l)=>{Ut(l)===n&&oe.set(l,Promise.resolve(t))});let r=!1,i=s=>s.name===void 0?a:a.siblings?.[s.name]??null,o=0;for(let[s,l]of xe)if(Ut(s)===n){for(let c of l){let d=c.deref();if(!d){l.delete(c);continue}let f=i(d);if(!f){r=!0;continue}d.hotReplace(f)&&o++}l.size||xe.delete(s)}return r?0:o},tc=()=>{xe??(xe=new Map),globalThis[Xl]={update:ec}},Ca=3e3,nc=(e,t)=>{let n=setTimeout(()=>{console.warn(`jq79: ${e.name?`<${e.name}>`:"a component"}${e.filename?` (${e.filename})`:""} has been waiting ${Ca/1e3}s for a :setup script and has rendered nothing. The template waits until every script returns or calls $mounted() - add an await $mounted() above the slow part to render first and fill in after.`)},Ca);n?.unref?.(),Promise.all(t).then(()=>clearTimeout(n))},Tr=e=>{if(Nn.test(e))return e;let t=import.meta.resolve;if(typeof t!="function")return e;try{return t(e)}catch{return e}},oe=new Map,jr=e=>{try{return new URL(e,document.baseURI).href.replace(/#.*$/,"")}catch{return e}},Ea=e=>Promise.all([fetch(e).then(t=>{if(!t.ok)throw new Error(`failed to fetch component from ${e}: ${t.status}`);return t.text()}),fn?.then(()=>cc(e))]).then(([t])=>t),Dr=e=>{if(!oe)return Ea(e);let t=jr(e),n=oe.get(t);if(!n){n=Ea(e),oe.set(t,n);let a=n;a.catch(()=>{oe?.get(t)===a&&oe.delete(t)})}return n},hn=async e=>{let t=Tr(e),n=await Dr(t);return new q(n,{filename:t})},Ra=new WeakSet,_a=new Set,ac=e=>{if(_a.has(e))return;_a.add(e);let t=document.createElement("link");t.rel="modulepreload";let n=Rn();n&&t.setAttribute("nonce",n),t.href=e,document.head.append(t)},rc=/<script\b(?:"[^"]*"|'[^']*'|[^>"'])*>([\s\S]*?)<\/script\s*>/gi,wt=new Set,Br=(e,t,n)=>{for(let{spec:a,kind:r}of Ui(e)){if(r==="component"&&n&&a in n)continue;let i=Tr(r==="fetch"?a:sn(a,r==="component"?t:void 0));r==="fetch"||Pr.test(i)?oe&&Dr(i).then(o=>oc(o,i),()=>{}):Nn.test(i)&&ac(i)}},oc=(e,t)=>{let n=jr(t);if(!wt.has(n)){wt.add(n);for(let[,a]of e.matchAll(rc))Br(a,t,void 0)}},ic=(e,t,n)=>{for(let a of e)Ra.has(a)||(Ra.add(a),Br(a.content,t,n))},fn,sc="/jq79-sw.js",lc=async e=>{let t=typeof navigator>"u"?void 0:navigator.serviceWorker;if(!t)throw new Error("jq79: safeEval() compiles components in a service worker, and this page can't have one - service workers need https (or localhost). Precompile with the jq79/vite plugin instead, or use safeEval({ nonce: true }) on a page whose server issues a nonce.");let n;try{n=await t.register(e)}catch(a){throw new Error(`jq79: safeEval() couldn't register its service worker at ${e} (${a.message}). Serve jq79-sw.js from the jq79 package at your site's root, or pass its URL: safeEval({ worker: "/path/jq79-sw.js" }).`)}await t.ready,!t.controller&&await new Promise(a=>{t.addEventListener("controllerchange",()=>a(),{once:!0}),t.controller?a():n.active?.postMessage("jq79:claim")})},cc=e=>{let t=new URL(e,document.baseURI);return t.hash="",t.searchParams.set(ys,""),new Promise((n,a)=>{let r=document.createElement("script"),i=Rn();i&&r.setAttribute("nonce",i),r.src=t.href,r.onload=()=>{r.remove(),n()},r.onerror=()=>{r.remove(),a(new Error(`jq79: the precompiled functions of ${e} did not load, and safeEval() can't render it without them`))},document.head.append(r)})},Fr=class Ce{constructor(t,n={}){P(this,"template"),P(this,"scripts"),P(this,"styles"),P(this,"modules"),P(this,"filename"),P(this,"siblings"),P(this,"name"),P(this,"slots"),P(this,"modelWriteback"),P(this,"data",null),P(this,"fx",null),P(this,"content",null),P(this,"startMarker",null),P(this,"endMarker",null),P(this,"styleEls",[]),P(this,"shadowCss",null),P(this,"shadowSheets",[]),P(this,"sheetRoot",null),P(this,"ownsSharedStyles",!1),P(this,"useShadow",!1),P(this,"mountRoot",null),P(this,"resolveMounted",null),P(this,"renderDone",!1),P(this,"held",0),P(this,"onPaint",null),P(this,"destroyHooks",null),P(this,"attachHooks",null),P(this,"detachHooks",null),P(this,"onPage",!1),P(this,"emitListeners",new Map);let a=typeof t=="string"?on(t):t;this.template=a.template,this.scripts=a.scripts,this.styles=a.styles,this.modules=n.modules??(typeof t=="string"?void 0:t.modules),this.filename=n.filename??(typeof t=="string"?void 0:t.filename),this.siblings=a.siblings,this.name=a.name,this.adoptSiblings(),Ql(this)}adoptSiblings(){this.siblings&&Object.entries(this.siblings).forEach(([t,n])=>{n.filename??(n.filename=this.filename),n.modules??(n.modules=this.modules),this.name||(this[t]=n)})}hotReplace(t){let n=typeof t=="string"?on(t):t;_n.clear(),Ae.clear(),rn.clear();let a=this.startMarker,r=!!(a&&this.content),i=r&&a.isConnected,o=i?a.parentNode:null,s=i?this.endMarker.nextSibling:null,l={...this.data},c=this.useShadow;return r&&this.destroy(),this.template=n.template,this.scripts=n.scripts,this.styles=n.styles,this.siblings=n.siblings,this.adoptSiblings(),!r||(this.renderWith(l,c),!o)?!1:(c&&this.placeShadowStyles(o,s),o.insertBefore(this.content,s),this.mountRoot=o,this.settleMounted(),!0)}static debug(t){if(t){let n=pe.scopedNames;for(let a in t){let r=t[a];Object.prototype.hasOwnProperty.call(pe,a)?typeof r=="boolean"?pe[a]=r:console.warn(`jq79: Component79.debug ignored "${a}" - the flags are booleans, and the ones it knows are: ${Object.keys(pe).join(", ")}`):console.warn(`jq79: Component79.debug does not know "${a}" - the flags it has are: ${Object.keys(pe).join(", ")}`)}pe.scopedNames!==n&&ft.clear()}return{...pe}}static safeEval(t={}){Cn=!0;let n=[];if(t.nonce){let r=Rn();r===void 0?n.push(Promise.reject(new Error("jq79: safeEval({ nonce: true }) found no nonce on this page - no <script> carries one. The nonce belongs on the script that loads the page, the one the CSP names."))):nn=r}let a=t.worker??(t.nonce?!1:sc);return a!==!1&&n.push(fn??(fn=lc(a))),Promise.all(n).then(()=>{})}static cache(t){return t===!1?(oe=null,wt.clear()):t===!0&&(oe??(oe=new Map)),!!oe}static clearCache(){oe?.clear(),wt.clear()}static fetch(t){if(Array.isArray(t))throw new TypeError("Component79.fetch takes one URL; use fetchAll for an array");return new dc(hn(t))}static fetchAll(t){return Promise.all(t.map(hn))}static importAll(t){if(!Array.isArray(t))throw new TypeError("Component79.importAll takes an array; use import() for one");return Promise.all(t.map(n=>pt(sn(n,void 0))))}on(t,n){return this.emitListeners.has(t)||this.emitListeners.set(t,new Set),this.emitListeners.get(t).add(n),this}off(t,n){return this.emitListeners.get(t)?.delete(n),this}render(t={}){return this.renderWith(t,!1)}renderShadow(t={}){return this.renderWith(t,!0)}renderWith(t,n){this.destroy();let a=gs(this.scripts,dn,cn),r=Kl(this.siblings,a),i=r?Object.assign(Object.create(r),t):{...t},o=new Set([...a].filter(y=>!(y in t)));o.size&&Object.defineProperty(i,zr,{value:o}),this.slots&&Object.defineProperty(i,vr,{value:this.slots}),Object.defineProperty(i,yt,{value:{count:0,owner:this}});let s=Pe(i),l=Ke(s);this.data=s,this.fx=l,this.useShadow=n,this.startMarker=document.createComment("jq79"),this.endMarker=document.createComment("/jq79");let c=this.startMarker,d=!1,f=(y,A)=>{y==="model:update"&&!d&&(d=!0,console.warn("jq79: $emit('model:update', …) no longer feeds :model - call $updateModel(value) or $updateModel(name, value) instead"));let I=new CustomEvent(y,{detail:A,bubbles:!0,composed:!0,cancelable:!0});return c===this.startMarker&&this.emitListeners.get(y)?.forEach(F=>F(I,A)),I.cancelBubble||c.dispatchEvent(I),!I.defaultPrevented},b,E=new Promise(y=>{b=y});this.resolveMounted=b,this.renderDone=!1,this.held=0;let B=y=>{if(typeof y!="function")throw new TypeError("jq79: $destroyed expects a function");return c!==this.startMarker?(ze(y,"$destroyed"),()=>{}):Wt(this.destroyHooks??(this.destroyHooks=[]),y)},N=(y,{immediate:A=!0}={})=>{if(typeof y!="function")throw new TypeError("jq79: $attached expects a function");if(c!==this.startMarker)return()=>{};this.watchPage();let I=Wt(this.attachHooks??(this.attachHooks=[]),y);return A&&this.onPage&&ze(y,"$attached"),I},T=y=>{if(typeof y!="function")throw new TypeError("jq79: $detached expects a function");return c!==this.startMarker?(ze(y,"$detached"),()=>{}):(this.watchPage(),Wt(this.detachHooks??(this.detachHooks=[]),y))},k=y=>{let A=xi(y);return B(()=>A.$dispose()),A},_=this.endMarker,z=y=>{let A=[];for(let I=c.nextSibling;I&&I!==_;I=I.nextSibling)I instanceof Element&&(I.matches(y)&&A.push(I),A.push(...Array.from(I.querySelectorAll(y))));return A},G=y=>z(y)[0]??null,W=this.modules,K=y=>W&&y in W?Promise.resolve(W[y]):pt(sn(y,this.filename)),te=y=>{if(!Array.isArray(y))throw new TypeError("$importAll takes an array; use import() for one");return Promise.all(y.map(K))},v=Object.assign(Object.create(null),{$emit:f,$updateModel:(...y)=>{let[A,I]=y.length>1?y:[void 0,y[0]];return c!==this.startMarker?!1:this.modelWriteback?.(A,I)??!1},$slots:Object.fromEntries(Object.keys(this.slots??{}).map(y=>[y,!0]))}),x=[],M=!0;ic(this.scripts,this.filename,this.modules),this.scripts.forEach((y,A)=>{let I;x.push(new Promise(p=>{I=p}));let F=!1,j=()=>{F=!0,I()},X={$mounted:()=>(j(),E),$destroyed:B,$attached:N,$detached:T,$computed:k,$self:G,$$self:z,...v,$importAll:te,...r},Y={filename:this.filename,index:A},se=":mounted"in y.attrs,m=Bl(y.content),h=(()=>{if(m!==null){se&&console.warn("jq79: :mounted on a factory script renders the template before the factory has returned, so none of its bindings exist yet - await $mounted() inside the factory instead."),Sa(s,cn(y.content));let g=se?oa(m):m;return Zl(g,s,w=>l.effect(w),X,K,Y)}let{vars:p,code:u}=Fl(y.content);Sa(s,dn(y)),p.forEach(g=>{g in s||(s[g]=void 0)});let S=se?oa(u):u;return Dl(S,s,g=>l.effect(g),X,K,Y)})();if(h.sync)h.settled.then(j,j);else{let p=i[yt];p.count++;let u=()=>{p.count--,j()};h.settled.then(u,u)}!h.sync&&!F&&(M=!1)});let U=document.createDocumentFragment(),H=new Proxy(s,{has:(y,A)=>typeof A=="string"&&A in v||Reflect.has(y,A),get:(y,A,I)=>typeof A=="string"&&A in v&&!Reflect.has(y,A)?v[A]:Reflect.get(y,A,I)});if(U.append(this.startMarker,this.endMarker),this.content=U,M?(this.endMarker.parentNode.insertBefore(Te(this.template,H,l,n),this.endMarker),this.renderDone=!0,this.settleMounted()):(Promise.all(x).then(()=>{c===this.startMarker&&(this.endMarker.parentNode.insertBefore(Te(this.template,H,l,n),this.endMarker),this.renderDone=!0,this.settleMounted(),Ce.settleAttached())}),nc(this,x)),n)if(Ln())this.shadowCss=[...this.styles.map(y=>y.content),Fe];else{let y=document.createElement("style");y.textContent=Fe,this.styleEls=[...this.styles.map(A=>{let I=document.createElement("style");return I.textContent=A.content,I}),y]}else this.styles.forEach(y=>Tl(ka(y))),this.ownsSharedStyles=!0;return this}mount(t,n){let a=typeof t=="string"?Zt(t):t;if(!a)throw new Error(`mount target not found: ${t}`);return(!this.content||n!==void 0)&&this.renderWith(n??{},this.useShadow),this.attach(a)}mountShadow(t,n){let a=typeof t=="string"?Zt(t):t;if(!a)throw new Error(`mount target not found: ${t}`);return(!this.content||n!==void 0||!this.useShadow)&&this.renderWith(n??{},!0),this.attach(a)}attach(t){this.mountRoot&&this.detach();let n=this.useShadow&&t instanceof Element?t.shadowRoot??t.attachShadow({mode:"open"}):t;return this.useShadow&&this.placeShadowStyles(n,null),n.appendChild(this.content),this.mountRoot=n,this.settleMounted(),Ce.settleAttached(),this}isOnPage(){return this.renderDone&&this.startMarker?.isConnected===!0}watchPage(){ye.has(this)||(ye.add(this),this.onPage=this.isOnPage(),this.onPage||Ce.queueSettle())}static queueSettle(){Ht||(Ht=!0,queueMicrotask(()=>{Ht=!1,Ce.settleAttached()}))}static settleAttached(){if(ye.size===0)return;let t=[...ye].filter(n=>!n.onPage&&n.isOnPage());Ce.inDocumentOrder(t).forEach(n=>{n.onPage||!ye.has(n)||(n.onPage=!0,n.attachHooks?.slice().forEach(a=>ze(a,"$attached")))})}notifyDetached(){if(ye.size===0)return;let t=[];if(this.startMarker?.isConnected){let n=new Set;for(let r=this.startMarker;r&&(n.add(r),r!==this.endMarker);r=r.nextSibling);let a=r=>{for(;r;r=r.parentNode)if(n.has(r))return!0;return!1};t=Ce.inDocumentOrder([...ye].filter(r=>r.onPage&&a(r.startMarker)))}else this.onPage&&(t=[this]);t.forEach(n=>{n.onPage&&(n.onPage=!1,n.detachHooks?.slice().forEach(a=>ze(a,"$detached")))})}static inDocumentOrder(t){return t.sort((n,a)=>n.startMarker.compareDocumentPosition(a.startMarker)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1)}placeShadowStyles(t,n){if(this.shadowCss&&typeof ShadowRoot<"u"&&t instanceof ShadowRoot){this.sheetRoot&&this.sheetRoot!==t&&this.shadowSheets.forEach(a=>ln(this.sheetRoot,a)),this.shadowSheets.length===0&&(this.shadowSheets=this.shadowCss.map(a=>a===Fe?qe??(qe=gt(a)):gt(a))),this.shadowSheets.forEach(a=>zn(t,a)),this.sheetRoot=t;return}this.shadowCss&&this.styleEls.length===0&&(this.styleEls=this.shadowCss.map(a=>{let r=document.createElement("style");return r.textContent=a,r})),this.styleEls.forEach(a=>t.insertBefore(a,n))}settleMounted(){if(!this.renderDone||this.held>0)return;let t=this.onPaint;this.onPaint=null,t?.(),this.mountRoot&&this.resolveMounted?.()}holdOwner(t){this.renderDone&&this.held===0||(t.held++,this.onPaint=()=>{t.held--,t.settleMounted()})}detach(){if(!this.mountRoot||!this.content||!this.startMarker||!this.endMarker)return this;this.notifyDetached();let t=this.startMarker;for(;t;){let n=t.nextSibling;if(this.content.appendChild(t),t===this.endMarker)break;t=n}return this.mountRoot=null,this}destroy(){this.notifyDetached(),ye.delete(this),this.attachHooks=null,this.detachHooks=null,this.onPage=!1;let t=this.destroyHooks;this.destroyHooks=null,t?.forEach(a=>ze(a,"$destroyed")),this.resolveMounted=null;let n=this.onPaint;return this.onPaint=null,n?.(),this.detach(),this.fx?.dispose(),this.fx=null,this.data?.$dispose(),this.styleEls.forEach(a=>a.parentNode?.removeChild(a)),this.styleEls=[],this.sheetRoot&&this.shadowSheets.forEach(a=>{a!==qe&&ln(this.sheetRoot,a)}),this.shadowCss=null,this.shadowSheets=[],this.sheetRoot=null,this.ownsSharedStyles&&(this.styles.forEach(a=>jl(ka(a))),this.ownsSharedStyles=!1),this.content=null,this.startMarker=null,this.endMarker=null,this.renderDone=!1,this.data=null,this.resolveMounted=null,this}};P(Fr,"version",bs);var q=Fr,dc=class{constructor(e){P(this,"chain"),this.chain=e}queue(e){return this.chain=this.chain.then(t=>(e(t),t)),this}then(e,t){return this.chain.then(e,t)}catch(e){return this.chain.catch(e)}finally(e){return this.chain.finally(e)}mount(e,t){return this.queue(n=>n.mount(e,t))}mountShadow(e,t){return this.queue(n=>n.mountShadow(e,t))}render(e={}){return this.queue(t=>t.render(e))}renderShadow(e={}){return this.queue(t=>t.renderShadow(e))}on(e,t){return this.queue(n=>n.on(e,t))}off(e,t){return this.queue(n=>n.off(e,t))}detach(){return this.queue(e=>e.detach())}destroy(){return this.queue(e=>e.destroy())}},ze=(e,t)=>{try{e()}catch(n){console.error(`jq79: error in a ${t} hook`,n)}},Wt=(e,t)=>(e.push(t),()=>{let n=e.indexOf(t);n!==-1&&e.splice(n,1)}),ye=new Set,Ht=!1,qr={$:Zt,$$:ri,$create:oi,$reactive:Pe,$toRaw:ee,$batch:Wa,Component79:q,C79:q};typeof globalThis<"u"&&globalThis[Jl]&&tc();const hc=`<!--
  The app's own mark: three loose cartridges, lying as they lie in a drawer.
  
  Three real ones, at their real proportions. Behind on the left the **NES**
  brick, wider than it is tall, its paper label boxed in black. Behind on the
  right a **PC Engine** HuCard — barely a card at all, the gold contacts along
  its top edge and the insertion arrow printed above the art. In front the
  **Mega Drive** shell, upright and black, with the thumb notch bitten out of
  its top lip.
  
  Three machines that never agreed on the shape of a game, which is the whole
  job: a collection is a pile of dumps from all of them.
  
  Every shape is laid out to sit inside the box *after* its tilt, corners
  included, so the mark is never cropped — favicon, header and hero all show the
  same thing.
  
  Drawn in the slate tones \`SystemLogos.tsx\` uses for console hardware rather
  than in the palette: these are objects, and an object that changed colour with
  the theme would stop being the object. The tones were picked to hold on both
  backgrounds; the labels are what carry the colour.
-->
<script :setup="{ className = &quot;&quot; }"><\/script>

<svg
  :class="className || 'brand-logo'"
  viewBox="0 0 64 64"
  role="img"
  aria-label="ROM Manager"
>
  <!-- NES: 136 × 120 mm, so landscape, and grey all over. -->
  <g transform="rotate(-14 21 24)">
    <rect
      x="7.5"
      y="12"
      width="27"
      height="24"
      rx="2"
      fill="#cbd5e1"
      stroke="#475569"
      stroke-width="2.2"
      stroke-linejoin="round"
    />
    <!-- The label: black-boxed, with the title band across its top. -->
    <rect
      x="10.5"
      y="15"
      width="21"
      height="12.5"
      rx="0.8"
      fill="#f1f5f9"
      stroke="#475569"
      stroke-width="1.3"
    />
    <rect x="11.7" y="16.2" width="18.6" height="3.4" fill="#1976d2" />
    <!-- The lip along the front, and the ridges under it. -->
    <path d="M9.5 31h23" stroke="#64748b" stroke-width="1.5" stroke-linecap="round" />
    <path d="M11.5 33.5h7M23.5 33.5h7" stroke="#94a3b8" stroke-width="1.3" stroke-linecap="round" />
  </g>

  <!-- PC Engine: a HuCard, 54 × 86 mm and 2 mm thick — a printed card. -->
  <g transform="rotate(14 47 26)">
    <rect
      x="39.5"
      y="14"
      width="15"
      height="24"
      rx="1.5"
      fill="#f1f5f9"
      stroke="#475569"
      stroke-width="1.8"
      stroke-linejoin="round"
    />
    <!-- The contacts along the top edge, which is the edge it goes in by. -->
    <path
      d="M41.5 16v2.6M44 16v2.6M46.5 16v2.6M49 16v2.6M51.5 16v2.6"
      stroke="#d69e2e"
      stroke-width="1.4"
      stroke-linecap="round"
    />
    <!-- The arrow printed above the art, saying which way up it goes. -->
    <path d="M47 20.5l1.8 2.4h-3.6z" fill="#64748b" />
    <rect x="41.5" y="25" width="11" height="8" rx="0.8" fill="#1976d2" />
    <path d="M41.5 35h11" stroke="#94a3b8" stroke-width="1.2" stroke-linecap="round" />
  </g>

  <!-- Mega Drive: upright, black, and the round notch cut into its top lip. -->
  <g transform="rotate(-5 32 41)">
    <path
      d="M22.5 26h5a4.5 4.5 0 0 0 9 0h5a2.5 2.5 0 0 1 2.5 2.5v25a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 20 53.5v-25A2.5 2.5 0 0 1 22.5 26z"
      fill="#252d38"
      stroke="#94a3b8"
      stroke-width="2.3"
      stroke-linejoin="round"
    />
    <!-- The grip, ridged either side of the notch. -->
    <path
      d="M23 31h4M37 31h4"
      stroke="#94a3b8"
      stroke-width="1.4"
      stroke-linecap="round"
    />
    <!-- The label: title band over the art, as they came. -->
    <rect x="23" y="35" width="18" height="14" rx="1" fill="#f1f5f9" />
    <rect x="23" y="35" width="18" height="4" rx="1" fill="#f59e0b" />
  </g>
</svg>
`,fc={},mc="components/BrandLogo.html";let Gr;Gr=new q(hc,{modules:fc,filename:mc});const Ur=Gr,uc=`<!--
  The icons, drawn rather than typed: <Icon name="close" />.

  Two families, because two jobs. What a row *is* — a folder, a game, a disc, a
  page — keeps the colours of the emoji it replaced, from the palette, so each
  theme gets a tone that reads on its own background (which of them a file gets:
  \`iconNameOf\` in ui/icons.ts). What a control *does* is drawn in one stroke of
  \`currentColor\` and sized in \`em\` (the \`icon\` class), so it takes the colour and
  the size of the text it stands among.
-->
<script :setup="{ name = &quot;file&quot;, systemId = &quot;&quot;, open = false, status = &quot;missing&quot;, className = &quot;&quot; }">const uid = Math.random().toString(36).slice(2, 10);
const cut = \`bundle-cut-\${uid}\`;
const frame = \`photo-\${uid}\`;
<\/script>

<svg :if="name === 'folder'" viewBox="0 0 24 24">
  <!-- Back and front, so the tab reads as a fold rather than a bump. -->
  <path d="M2.4 6.6a1.6 1.6 0 0 1 1.6-1.6h4.5c.44 0 .86.18 1.16.5l1.5 1.6H20a1.6 1.6 0 0 1 1.6 1.6v9.1a1.6 1.6 0 0 1-1.6 1.6H4a1.6 1.6 0 0 1-1.6-1.6z" fill="var(--icon-folder-back)" />
  <path d="M2.4 9.6h19.2v8.2a1.6 1.6 0 0 1-1.6 1.6H4a1.6 1.6 0 0 1-1.6-1.6z" fill="var(--icon-folder)" />
</svg>
<svg :elseif="name === 'game'" viewBox="0 0 24 24">
  <Pad :system-id="systemId" />
</svg>
<svg :elseif="name === 'bundle'" viewBox="0 0 24 24">
  <!--
    A game whose files are more than one: the gamepad with a parcel in the corner.
    The pad is drawn exactly where the plain game icon draws it, and cut back
    around the parcel by a mask on a wrapper of its own (a mask on a transformed
    element would be resolved in the transformed space).
  -->
  <mask :id="cut" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
    <rect width="24" height="24" fill="#fff" />
    <!-- Black hides; stroked too, so the parcel gets a hair of clearance. -->
    <rect x="15.1" y="14.9" width="7.8" height="7" rx="1.1" fill="#000" stroke="#000" stroke-width="1.6" />
  </mask>
  <g :mask="\`url(#\${cut})\`">
    <Pad :system-id="systemId" />
  </g>
  <Parcel :x="15.1" :y="14.9" :width="7.8" :height="7" :rx="1.1" />
</svg>
<svg :elseif="name === 'archive'" viewBox="0 0 24 24">
  <!-- A zip, a 7z, a rar: the bundle's parcel with nothing else in the frame. -->
  <Parcel :x="3.6" :y="5.3" :width="16.8" :height="14.2" :rx="1.7" />
</svg>
<svg :elseif="name === 'disc'" viewBox="0 0 24 24">
  <!-- A disc image. The hole and the shine are what keep it from being a dot. -->
  <circle cx="12" cy="12" r="9.2" fill="var(--icon-disc)" />
  <path d="M6.2 8.3a7 7 0 0 1 4.6-3.4" fill="none" stroke="var(--icon-disc-mark)" stroke-width="1.5" stroke-linecap="round" />
  <circle cx="12" cy="12" r="3.3" fill="var(--icon-disc-mark)" />
  <circle cx="12" cy="12" r="1.25" fill="var(--icon-disc)" />
</svg>
<svg :elseif="name === 'image'" viewBox="0 0 24 24">
  <!-- A picture: two hills, clipped to the frame so the corners stay round. -->
  <clipPath :id="frame">
    <rect x="2.8" y="4.6" width="18.4" height="14.8" rx="2" />
  </clipPath>
  <g :clip-path="\`url(#\${frame})\`">
    <rect x="2.8" y="4.6" width="18.4" height="14.8" fill="var(--icon-photo)" />
    <circle cx="8.3" cy="9.4" r="2" fill="#f9ab00" />
    <path d="M2.8 19.4 9.6 12l4 4.4 2.6-2.4 5 5.4z" fill="var(--icon-photo-hill)" />
  </g>
</svg>
<svg :elseif="name === 'memory-card'" viewBox="0 0 24 24">
  <!-- Saved games: a memory card (the floppy is the editor's save button). -->
  <path d="M6.6 2.8h6.9c.4 0 .78.16 1.06.44l2.9 2.9c.28.28.44.66.44 1.06V19.8a1.4 1.4 0 0 1-1.4 1.4H6.6a1.4 1.4 0 0 1-1.4-1.4V4.2a1.4 1.4 0 0 1 1.4-1.4z" fill="var(--icon-card)" />
  <rect x="7.6" y="5.6" width="1.5" height="3.4" rx=".6" fill="var(--icon-card-mark)" />
  <rect x="10.3" y="5.6" width="1.5" height="3.4" rx=".6" fill="var(--icon-card-mark)" />
  <rect x="13" y="5.6" width="1.5" height="3.4" rx=".6" fill="var(--icon-card-mark)" />
  <rect x="7.4" y="12.6" width="7.4" height="5.6" rx=".9" fill="var(--icon-card-mark)" />
</svg>
<svg :elseif="name === 'document'" viewBox="0 0 24 24">
  <!-- Something written: a readme, a .dat, a .json. -->
  <Sheet />
  <rect x="7.4" y="11.8" width="8.4" height="1.4" rx=".7" fill="var(--icon-paper-mark)" />
  <rect x="7.4" y="14.6" width="8.4" height="1.4" rx=".7" fill="var(--icon-paper-mark)" />
  <rect x="7.4" y="17.4" width="5.4" height="1.4" rx=".7" fill="var(--icon-paper-mark)" />
</svg>
<svg :elseif="name === 'chevron'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <!-- Points right when shut and down when open, as a disclosure has always. -->
  <path d="M9.5 5.5 16 12l-6.5 6.5" :transform="open ? 'rotate(90 12 12)' : undefined" />
</svg>
<svg :elseif="name === 'plus'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M12 5v14M5 12h14" />
</svg>
<svg :elseif="name === 'close'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="m6 6 12 12M18 6 6 18" />
</svg>
<svg :elseif="name === 'check'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="m5 12.5 4.8 4.8L19 7.5" />
</svg>
<svg :elseif="name === 'double-check'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M2 12.5l4.5 4.5L15 7.5" />
  <path d="M8 12.5l4.5 4.5L21 7.5" />
</svg>
<svg :elseif="name === 'cross'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M18 6L6 18M6 6l12 12" />
</svg>
<svg :elseif="name === 'arrow-left'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M19.5 12H5M11 6l-6 6 6 6" />
</svg>
<svg :elseif="name === 'play'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M7 5v14l12-7z" />
</svg>
<svg :elseif="name === 'arrow-right'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M4.5 12H19M13 6l6 6-6 6" />
</svg>
<svg :elseif="name === 'folder-plus'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M3 6.6a1.6 1.6 0 0 1 1.6-1.6h4.3c.44 0 .86.18 1.16.5L11.5 7h7.9A1.6 1.6 0 0 1 21 8.6v8.8A1.6 1.6 0 0 1 19.4 19H4.6A1.6 1.6 0 0 1 3 17.4z" />
  <path d="M12 10.4v6M9 13.4h6" />
</svg>
<svg :elseif="name === 'trash'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M4.5 6.5h15M9.6 6.5V4.9a1.4 1.4 0 0 1 1.4-1.4h2a1.4 1.4 0 0 1 1.4 1.4v1.6" />
  <path d="M6.6 6.5l.85 12.1a1.7 1.7 0 0 0 1.7 1.6h5.7a1.7 1.7 0 0 0 1.7-1.6l.85-12.1" />
</svg>
<svg :elseif="name === 'group'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <rect x="4" y="4" width="16" height="16" rx="2.2" />
  <path d="M12 4v16M4 12h16" />
</svg>
<svg :elseif="name === 'organize'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M4 9h13M14 6l3 3-3 3M20 15H7M10 12l-3 3 3 3" />
</svg>
<svg :elseif="name === 'pencil'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M4.5 19.5h3.3L19.1 8.2a1.7 1.7 0 0 0 0-2.4l-.9-.9a1.7 1.7 0 0 0-2.4 0L4.5 16.2z" />
  <path d="m14.7 6.7 2.6 2.6" />
</svg>
<svg :elseif="name === 'save'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M5.4 4.5h10.2L19.5 8.4v10.1a1.4 1.4 0 0 1-1.4 1.4H5.4A1.4 1.4 0 0 1 4 18.5V5.9a1.4 1.4 0 0 1 1.4-1.4z" />
  <path d="M8 4.5v5h7.2v-5M7.6 20v-5.4h8.8V20" />
</svg>
<svg :elseif="name === 'search'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="11" cy="11" r="6.2" />
  <path d="m15.6 15.6 4 4" />
</svg>
<svg :elseif="name === 'hourglass'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M6.4 3.6h11.2M6.4 20.4h11.2" />
  <path d="M8 3.6v2.9c0 1.1.5 2.1 1.3 2.8L12 11.6l-2.7 2.3c-.8.7-1.3 1.7-1.3 2.8v2.9M16 3.6v2.9c0 1.1-.5 2.1-1.3 2.8L12 11.6l2.7 2.3c.8.7 1.3 1.7 1.3 2.8v2.9" />
  <path d="M10.1 17.6h3.8" stroke-width="2.6" />
</svg>
<svg :elseif="name === 'gear'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M21.7 9.7L21.7 14.3L18.6 14.2L17.9 15.8L19.9 18.2L16.3 21L14.4 18.6L12.7 19L12.1 22L7.6 21L8.4 18L7 16.9L4.2 18.3L2.2 14.1L5.1 12.9L5.1 11.1L2.2 9.9L4.2 5.7L7 7.1L8.4 6L7.6 3L12.1 2L12.7 5L14.4 5.4L16.3 3L19.9 5.8L17.9 8.2L18.6 9.8Z" />
  <circle cx="12" cy="12" r="3.1" />
</svg>
<svg :elseif="name === 'status'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <!-- How much of a game is on disk: a full disc, a half one, an empty ring. -->
  <circle cx="12" cy="12" r="6.4" :fill="status === 'complete' ? 'currentColor' : 'none'" />
  <path :if="status === 'partial'" d="M12 5.6a6.4 6.4 0 0 1 0 12.8z" fill="currentColor" />
</svg>
<svg :elseif="name === 'dot'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="12" cy="12" r="5" fill="currentColor" stroke="none" />
</svg>
<svg :elseif="name === 'lock'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <rect x="5" y="11" width="14" height="10" rx="2" />
  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
</svg>
<svg :elseif="name === 'refresh'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
  <path d="M21 3v5h-5" />
</svg>
<svg :elseif="name === 'github'" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true" :class="className || undefined">
  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
</svg>
<svg :elseif="name === 'upload'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M12 15V4M7.5 8.5 12 4l4.5 4.5" />
  <path d="M4 14v4.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V14" />
</svg>
<svg :elseif="name === 'sync'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M20 11a8 8 0 0 0-14.3-4.9L4 8" />
  <path d="M4 4v4h4" />
  <path d="M4 13a8 8 0 0 0 14.3 4.9L20 16" />
  <path d="M20 20v-4h-4" />
</svg>
<svg :elseif="name === 'library'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M5 4h3v16H5zM10 4h3v16h-3z" />
  <path d="m15.5 5.2 2.9-.8 3.3 15.4-2.9.8z" />
</svg>
<svg :else viewBox="0 0 24 24">
  <!-- A file nothing is known about, .DS_Store included: a page, left blank. -->
  <Sheet />
</svg>

<!-- The gamepad: one shape per family of systems, the SNES-style pad otherwise. -->
<template name="Pad">
  <script :setup="{ systemId = &quot;&quot; }">$: id = String(systemId ?? "").toUpperCase();
<\/script>
  <svg viewBox="0 0 24 24" width="24" height="24">
    <g :if="['MEGADRIVE', 'GENESIS', 'MEGACD', 'S32X'].includes(id)">
      <!-- Mega Drive Crescent / Kidney Shape Controller Body -->
      <path
        d="M2.5 12.8c0-3.8 4-7.3 9.5-7.3s9.5 3.5 9.5 7.3c0 2.2-1.3 4.2-3.2 4.2-1.6 0-2.6-1.1-3.5-2.2l-.6-.8c-.5-.6-1.2-.9-1.9-.9s-1.4.3-1.9.9l-.6.8c-.9 1.1-1.9 2.2-3.5 2.2-1.9 0-3.3-2-3.3-4.2z"
        fill="var(--icon-pad)"
      />
      <!-- Direction Pad Base Circle & Cross -->
      <circle cx="7.2" cy="12" r="3.2" fill="#0f172a" opacity="0.4" />
      <rect x="6.2" y="9.8" width="2" height="4.4" rx=".5" fill="var(--icon-pad-mark)" />
      <rect x="5" y="11" width="4.4" height="2" rx=".5" fill="var(--icon-pad-mark)" />
      <!-- Red START Button -->
      <rect x="11" y="8.2" width="1.8" height="2.8" rx=".5" fill="#ef4444" transform="rotate(-15 11.9 9.6)" />
      <!-- A, B, C Buttons in Arc -->
      <circle cx="14.8" cy="13.2" r="1.25" fill="#cbd5e1" />
      <circle cx="17.2" cy="12.1" r="1.25" fill="#cbd5e1" />
      <circle cx="19.5" cy="11.0" r="1.25" fill="#cbd5e1" />
      <!-- X, Y, Z Buttons above -->
      <circle cx="14.4" cy="10.2" r="0.8" fill="#94a3b8" />
      <circle cx="16.5" cy="9.3" r="0.8" fill="#94a3b8" />
      <circle cx="18.6" cy="8.4" r="0.8" fill="#94a3b8" />
    </g>
    <g :elseif="id === 'NES'">
      <rect x="2" y="7" width="20" height="10" rx="1.5" fill="#334155" />
      <rect x="4" y="8" width="16" height="4" fill="#0f172a" />
      <!-- Red D-Pad -->
      <rect x="4.5" y="10" width="1.8" height="4" rx=".3" fill="#e60012" />
      <rect x="3.4" y="11.1" width="4" height="1.8" rx=".3" fill="#e60012" />
      <!-- Red A/B Buttons -->
      <circle cx="15.5" cy="12" r="1.3" fill="#e60012" />
      <circle cx="18.5" cy="12" r="1.3" fill="#e60012" />
      <!-- Select / Start -->
      <rect x="9.2" y="11.6" width="1.8" height="0.8" rx=".3" fill="#94a3b8" />
      <rect x="11.8" y="11.6" width="1.8" height="0.8" rx=".3" fill="#94a3b8" />
    </g>
    <g :elseif="id === 'N64'">
      <!-- N64 Trident Controller -->
      <path
        d="M4 8.5c0-1.5 1-3 2.5-3h11c1.5 0 2.5 1.5 2.5 3v2c0 2-1 4-2 6.5L16 20h-2.5l-1.5-6h-0.2l-1.5 6H8L6 16.5C5 14 4 11.5 4 10.5v-2z"
        fill="var(--icon-pad)"
      />
      <!-- Center Analog Stick Base -->
      <circle cx="12" cy="10.5" r="2" fill="#94a3b8" />
      <!-- D-Pad on Left -->
      <rect x="6.2" y="8.8" width="1.6" height="3.6" rx=".4" fill="var(--icon-pad-mark)" />
      <rect x="5.2" y="9.8" width="3.6" height="1.6" rx=".4" fill="var(--icon-pad-mark)" />
      <!-- Red A & Blue B Buttons -->
      <circle cx="15.5" cy="13.2" r="1.2" fill="#e60012" />
      <circle cx="14.2" cy="11.4" r="1.1" fill="#3b82f6" />
      <!-- Yellow C Buttons -->
      <circle cx="18.2" cy="10.5" r="0.9" fill="#eab308" />
      <circle cx="16.8" cy="8.8" r="0.9" fill="#eab308" />
    </g>
    <g :elseif="id === 'PSX'">
      <path
        d="M4.5 7.5h15c2.5 0 4.5 2 4.5 4.5v3c0 2.5-1.5 4.5-3.2 4.5-1.4 0-2.3-.9-3.2-1.9l-.6-.7c-.4-.5-1-.8-1.7-.8s-1.3.3-1.7.8l-.6.7c-.9 1-1.8 1.9-3.2 1.9-1.7 0-3.2-2-3.2-4.5v-3c0-2.5 2-4.5 4.5-4.5z"
        fill="var(--icon-pad)"
      />
      <!-- D-Pad -->
      <rect x="5.8" y="9.8" width="2.2" height="5.2" rx=".5" fill="var(--icon-pad-mark)" />
      <rect x="4.3" y="11.3" width="5.2" height="2.2" rx=".5" fill="var(--icon-pad-mark)" />
      <!-- PS Action Symbols: Triangle, Circle, Cross, Square -->
      <polygon points="17.2,8.8 18.2,10.4 16.2,10.4" fill="#22c55e" />
      <circle cx="19.4" cy="12.4" r="1" fill="#ef4444" />
      <path d="M16.4 13.8l1.6 1.6m-1.6 0l1.6-1.6" stroke="#3b82f6" stroke-width="0.8" />
      <rect x="14.2" y="11.4" width="1.8" height="1.8" rx="0.2" fill="#ec4899" />
    </g>
    <g :elseif="id === 'SATURN'">
      <ellipse cx="12" cy="12" rx="10" ry="6.5" fill="var(--icon-pad)" />
      <circle cx="7" cy="12" r="2.8" fill="#0f172a" opacity="0.4" />
      <rect x="6.2" y="10" width="1.6" height="4" rx=".4" fill="var(--icon-pad-mark)" />
      <rect x="5" y="11.2" width="4" height="1.6" rx=".4" fill="var(--icon-pad-mark)" />
      <!-- A, B, C buttons -->
      <circle cx="14.8" cy="13" r="1.1" fill="#6366f1" />
      <circle cx="17" cy="12.2" r="1.1" fill="#6366f1" />
      <circle cx="19.2" cy="11.4" r="1.1" fill="#6366f1" />
    </g>
    <g :elseif="id === 'SMS'">
      <rect x="3" y="7" width="18" height="10" rx="1.5" fill="#0284c7" />
      <rect x="5" y="9" width="6" height="6" fill="#0f172a" />
      <line x1="5" y1="12" x2="11" y2="12" stroke="#ef4444" stroke-width="1.2" />
      <line x1="8" y1="9" x2="8" y2="15" stroke="#ef4444" stroke-width="1.2" />
      <circle cx="15.5" cy="12" r="1.3" fill="#cbd5e1" />
      <circle cx="18.5" cy="12" r="1.3" fill="#cbd5e1" />
    </g>
    <g :elseif="['TGFX16', 'TGFX16-CD'].includes(id)">
      <rect x="3" y="7" width="18" height="10" rx="2" fill="#d97706" />
      <rect x="5" y="9" width="6" height="6" rx="1" fill="#78350f" />
      <rect x="7" y="9.8" width="2" height="4.4" rx=".4" fill="#fef3c7" />
      <rect x="5.8" y="11" width="4.4" height="2" rx=".4" fill="#fef3c7" />
      <circle cx="15" cy="12" r="1.3" fill="#ef4444" />
      <circle cx="18" cy="12" r="1.3" fill="#ef4444" />
    </g>
    <g :elseif="['NEOGEO', 'NEOGEO-CD'].includes(id)">
      <!-- Dark Charcoal Console Chassis -->
      <rect x="2" y="6" width="20" height="13" rx="1.5" fill="#26272b" stroke="#141518" stroke-width="0.8" />
      <!-- Top Vent Strip & SNK marker -->
      <rect x="2" y="6" width="20" height="3" fill="#1d1e22" />
      <rect x="3" y="7" width="2.5" height="1" fill="#ffffff" />
      <!-- Cartridge Slot Recess -->
      <rect x="5" y="10" width="14" height="3.5" rx="0.8" fill="#141518" />
      <rect x="6" y="11" width="12" height="1.5" rx="0.4" fill="#0d0e10" />
      <!-- Gold Neo-Geo Accent -->
      <rect x="9" y="15" width="6" height="1.8" rx="0.4" fill="#eab308" />
      <!-- Reset button indicator -->
      <circle cx="5" cy="16" r="0.8" fill="#64748b" />
    </g>
    <g :elseif="['ATARI2600', 'ATARI5200', 'ATARI7800', 'ATARILYNX'].includes(id)">
      <rect x="7" y="11" width="10" height="7" rx="1.5" fill="#ea580c" />
      <rect x="11" y="5" width="2" height="7" rx="0.5" fill="#78350f" />
      <circle cx="12" cy="5" r="1" fill="#ef4444" />
      <circle cx="9" cy="13" r="1.2" fill="#ef4444" />
    </g>
    <g :elseif="id === 'GBA'">
      <!-- Top L / R Shoulder Bumpers -->
      <path d="M4 6.5C4 5.5 6.5 5 12 5s8 1 8 1.5v3H4v-3z" fill="#cbd5e1" />
      <!-- Indigo GBA Horizontal Shell Body -->
      <path
        d="M7 6h10c2.5 0 4.5.8 5.5 2.2 1 1.5 1 3.8 1 3.8s0 2.3-1 3.8C21.5 17.2 19.5 18 17 18H7c-2.5 0-4.5-.8-5.5-2.2C.5 14.3.5 12 .5 12s0-2.3 1-3.8C2.5 6.8 4.5 6 7 6z"
        fill="#544697"
      />
      <!-- Screen Frame Bezel -->
      <rect x="7" y="7" width="10" height="9.5" rx="1.5" fill="#232328" />
      <rect x="8" y="8" width="8" height="6" rx="0.8" fill="#121316" />
      <!-- Silver D-Pad -->
      <rect x="3.2" y="10.8" width="2.6" height="1.1" rx=".3" fill="#e2e8f0" />
      <rect x="3.95" y="10.05" width="1.1" height="2.6" rx=".3" fill="#e2e8f0" />
      <!-- Silver A / B Buttons -->
      <circle cx="17.4" cy="12.2" r="1.0" fill="#e2e8f0" />
      <circle cx="19.2" cy="10.6" r="1.0" fill="#e2e8f0" />
      <!-- Start / Select Pills -->
      <rect x="3.8" y="13" width="1.8" height="0.7" rx=".3" fill="#362f63" transform="rotate(20 4.7 13.35)" />
      <rect x="3.8" y="14.2" width="1.8" height="0.7" rx=".3" fill="#362f63" transform="rotate(20 4.7 14.55)" />
    </g>
    <g :elseif="['GAMEBOY', 'GBC', 'GAMEGEAR', 'WONDERSWAN', 'WONDERSWANCOLOR', 'POKEMONMINI'].includes(id)">
      <rect x="3" y="7" width="18" height="10" rx="2.5" fill="#3b82f6" />
      <rect x="7" y="8.5" width="10" height="7" rx="1" fill="#0f172a" />
      <circle cx="17.8" cy="12" r="1.1" fill="#cbd5e1" />
      <rect x="4.2" y="10.8" width="1.6" height="3" rx=".4" fill="#cbd5e1" />
      <rect x="3.5" y="11.5" width="3" height="1.6" rx=".4" fill="#cbd5e1" />
    </g>
    <g :else>
      <!-- SNES / Retro Gamepad Body Shell (Well-proportioned horizontal contour) -->
      <path
        d="M5.5 6.2h13c3.5 0 5.5 2.4 5.5 5.5s-2 5.5-5.5 5.5h-1.6c-1.1 0-2.1-.5-2.6-1.4l-.4-.8c-.4-.6-1.1-.9-1.9-.9s-1.5.3-1.9.9l-.4.8c-.5.9-1.5 1.4-2.6 1.4H5.5C2 17.2 0 14.8 0 11.7S2 6.2 5.5 6.2z"
        fill="var(--icon-pad)"
      />
      <!-- Inner Faceplate Contour -->
      <path
        d="M5.5 7.2h13c2.8 0 4.5 1.9 4.5 4.5s-1.7 4.5-4.5 4.5h-1.6c-.8 0-1.6-.4-2-1.1l-.4-.8c-.6-1-1.7-1.6-2.9-1.6s-2.3.6-2.9 1.6l-.4.8c-.4.7-1.2 1.1-2 1.1H5.5C2.7 16.2 1 14.3 1 11.7S2.7 7.2 5.5 7.2z"
        fill="var(--icon-pad-face)"
        opacity="0.15"
      />
      <!-- D-Pad -->
      <rect x="5.2" y="9.2" width="2.4" height="6.4" rx=".7" fill="var(--icon-pad-mark)" />
      <rect x="3.2" y="11.2" width="6.4" height="2.4" rx=".7" fill="var(--icon-pad-mark)" />
      <!-- Four Colored Action Buttons (SNES Palette - Spacious Spacing) -->
      <circle cx="17.2" cy="9.1" r="1.3" fill="#f9ab00" />
      <circle cx="19.6" cy="11.7" r="1.3" fill="#e94235" />
      <circle cx="17.2" cy="14.3" r="1.3" fill="#34a853" />
      <circle cx="14.8" cy="11.7" r="1.3" fill="#4285f4" />
      <!-- Select & Start Pill Buttons -->
      <rect x="9.6" y="12.3" width="1.9" height="0.85" rx=".4" fill="var(--icon-pad-mark)" transform="rotate(-20 10.5 12.7)" />
      <rect x="11.9" y="12.3" width="1.9" height="0.85" rx=".4" fill="var(--icon-pad-mark)" transform="rotate(-20 12.8 12.7)" />
    </g>
  </svg>
</template>

<!--
  A parcel: a box and the tape across it. The tape is a share of the box, so one
  drawing holds at the 7.8 units of a corner mark and the 16.8 of a whole icon.
-->
<template name="Parcel">
  <script :setup="{ x, y, width, height, rx }">$: band = height * 0.3;
<\/script>
  <svg viewBox="0 0 24 24" width="24" height="24">
    <rect :x="x" :y="y" :width="width" :height="height" :rx="rx" fill="var(--icon-box)" />
    <rect :x="x" :y="y + band" :width="width" :height="height * 0.229" fill="var(--icon-box-tape)" />
    <rect :x="x + width * 0.385" :y="y" :width="width * 0.205" :height="band" fill="var(--icon-box-tape)" />
  </svg>
</template>

<!-- The page both file marks are drawn on, with its top corner turned over. -->
<template name="Sheet">
  <svg viewBox="0 0 24 24" width="24" height="24">
    <path d="M6.2 2.4h7.1L19.2 8.3v11.9a1.5 1.5 0 0 1-1.5 1.5H6.2a1.5 1.5 0 0 1-1.5-1.5V3.9a1.5 1.5 0 0 1 1.5-1.5z" fill="var(--icon-paper)" />
    <path d="M13.3 2.4 19.2 8.3h-4.4a1.5 1.5 0 0 1-1.5-1.5z" fill="var(--icon-paper-fold)" />
  </svg>
</template>
`,pc={},gc="components/Icon.html";let Ye;Ye=new q(uc,{modules:pc,filename:gc});const ne=Ye;Ye.Pad;Ye.Parcel;Ye.Sheet;const vc=`<!--
  The open origins as tabs: the library (never closed) and any folders. Emits
  \`select\` and \`close\` with the origin's id.
-->
<script :setup="{ origins = [], activeOriginId = void 0, labels = {} }">const Icon = await import("./Icon.html");
$: reconnectTitle = labels.reconnect ?? "Reconnect folder";
$: closeTitle = labels.close ?? "Close tab";
const close = (event, id) => {
  event.stopPropagation();
  $emit("close", id);
};
<\/script>

<div class="tabs">
  <div
    :each="origin in origins"
    :key="origin.id"
    :class="\`tab \${activeOriginId === origin.id ? 'active' : ''} \${origin.locked ? 'locked' : ''}\`"
    @click="$emit('select', origin.id)"
    :title="origin.locked ? reconnectTitle : undefined"
  >
    <span :if="origin.locked" class="tab-lock"><Icon name="refresh" /></span>
    <span :if="origin.kind === 'library'" class="tab-lock"><Icon name="library" /></span>
    <span class="tab-name">{{ origin.name }}</span>
    <!-- The library is the app's own storage: there is nothing to close. -->
    <button :if="origin.kind !== 'library'" class="tab-close" @click="close($event, origin.id)" :title="closeTitle">
      <Icon name="close" />
    </button>
  </div>
</div>
`,yc={"./Icon.html":ne},wc="components/Tabs.html";let Wr;Wr=new q(vc,{modules:yc,filename:wc});const bc=Wr,Hr=1,mn=`${be}/wizard.json`;function Ie(){return{folders:{},regionOrder:Na}}function kc(e,t,n){const a=t.folders[e];return typeof a=="boolean"?a:n.has(e)}function Sc(e){return e.length>0&&!e.startsWith("/")&&!e.includes("\\")&&!e.split("/").includes("..")}function xc(e){if(!e||typeof e!="object")return Ie();const t=e;if(t.version!==Hr||!t.folders||typeof t.folders!="object")return Ie();const n={};for(const[a,r]of Object.entries(t.folders))typeof r=="boolean"&&Sc(a)&&(n[a]=r);return{folders:n,regionOrder:La(t.regionOrder)}}class $c{static async read(t){try{const n=await t.readFile(mn);return xc(JSON.parse(new TextDecoder().decode(n)))}catch{return Ie()}}static async write(t,n){const a={version:Hr,folders:n.folders,regionOrder:Wo(n.regionOrder)};await t.createDirectory(be),await t.writeFile(mn,new TextEncoder().encode(`${JSON.stringify(a,null,2)}
`))}static async setWizard(t,n,a,r){const i=await this.read(t),o={...i.folders};a===r.has(n)?delete o[n]:o[n]=a;const s={...i,folders:o};return await this.write(t,s),s}static async setRegionOrder(t,n){const r={...await this.read(t),regionOrder:La(n)};return await this.write(t,r),r}}const Oc=Object.freeze(Object.defineProperty({__proto__:null,WIZARD_CONFIG_PATH:mn,WizardConfigService:$c,emptySettings:Ie,isWizardFolder:kc},Symbol.toStringTag,{value:"Module"})),L=Pe({origins:[],activeOriginId:void 0,loading:!1,error:void 0,wizardSettings:Ie(),knownSystems:[]}),Aa="rom-manager:active-origin-id";function Vt(e){try{e?localStorage.setItem(Aa,e):localStorage.removeItem(Aa)}catch{}}class Re{static instance;constructor(){}static getInstance(){return Re.instance||(Re.instance=new Re),Re.instance}addOrigin(t){const n=L.origins.findIndex(a=>a.id===t.id);L.origins=n===-1?[...L.origins,t]:L.origins.map((a,r)=>r===n?t:a),L.activeOriginId||(L.activeOriginId=t.id,Vt(t.id))}getOrigin(t){return L.origins.find(n=>n.id===t)}getOrigins(){return[...L.origins]}removeOrigin(t){if(L.origins=L.origins.filter(n=>n.id!==t),L.activeOriginId===t){const n=L.origins[0]?.id;L.activeOriginId=n,Vt(n)}}setActiveOrigin(t){this.getOrigin(t)&&(L.activeOriginId=t,Vt(t))}getActiveOrigin(){const t=L.activeOriginId;return t?this.getOrigin(t):void 0}setSelection(t){const n=L.activeOriginId;n&&(L.origins=L.origins.map(a=>a.id===n?{...a,selection:t}:a))}getSelection(){return this.getActiveOrigin()?.selection||[]}setLoading(t){L.loading=t}isLoading(){return L.loading}setError(t){L.error=t}getError(){return L.error}setWizardSettings(t){L.wizardSettings=t}getWizardSettings(){return ee(L).wizardSettings}setKnownSystems(t){L.knownSystems=Array.from(t)}getKnownSystems(){return new Set(ee(L).knownSystems)}clear(){L.origins=[],L.activeOriginId=void 0,L.loading=!1,L.error=void 0,L.wizardSettings=Ie()}}const Mc=Re.getInstance(),Cc=Object.freeze(Object.defineProperty({__proto__:null,StoreService:Re,appState:L,storeService:Mc},Symbol.toStringTag,{value:"Module"}));var Z={app:{name:"ROM Manager",initializing:"Starting…"},header:{regions:{label:"Region priority",preferred:"The {region} cover art is preferred",prefer:"Prefer the {region} cover art"},preferences:"Preferences"},tabs:{reconnect:"Click to grant access again",close:"Close",add:"Open a folder"},welcome:{tagline:"Your retro collection, read where it lives",pitch:"ROM Manager opens a folder of ROMs and makes a library of it: every file identified by its checksum, every Game shown as one entry with its Variants, and its Cover Art alongside. It runs entirely in the browser, against your own disk.",open:"Open folder",opening:"Opening…",hint:"Nothing is uploaded. Nothing is moved without showing you first.",library:"Open my library",openFolder:"Open a folder",libraryHint:"Your library lives in this browser. Nothing is uploaded; on a desktop you can sync it with a folder.",what:{title:"What it does",hash:{title:"Identified by checksum",body:"Every file is matched against the No-Intro and Redump DATs by its CRC32. A file name is what somebody typed; a checksum is what the file is."},grouping:{title:"One entry per Game",body:"Regions, revisions and languages of the same title fold into a single Game, and its Variants are read in the details pane — which of them you have, which files are missing, and where each one ships."},covers:{title:"Cover Art per region",body:"Boxes for EU, US and JP, taken from libretro-thumbnails and kept in the library as you browse, so they stay there with the network off. A preference order decides which one is shown."},consolidate:{title:"Moves you approve first",body:"Consolidating a System is worked out as a Plan and shown to you whole. Nothing is renamed or moved until you say so, and it can be undone right afterwards."}},how:{title:"How it goes",step1:{title:"Open your collection",body:"Pick the folder your Systems live in — the MiSTer `games` folder, or anything laid out like it."},step2:{title:"Browse it by Game",body:"A System folder can be read flat, as it is on disk, or grouped, with the recognised files folded into the Game they are releases of."},step3:{title:"Tidy it up and fill it in",body:"Consolidate the folder when the Plan convinces you, drop covers or ROMs straight onto the pane, and edit what the catalogue does not know."}},systems:{title:"Systems it knows",hint:"{count} Systems, each one identified by the folder name MiSTer gives it."},privacy:{title:"It never leaves your machine",body:"Folders are read through the File System Access API, which asks your permission for one folder and grants it to this tab alone. There is no backend and no upload. Real support only exists in Chromium browsers."},footer:{legal:"ROM Manager is free and open-source software. All system names, trademarks, and cover art belong to their respective owners.",github:"Code on GitHub"}},library:{locked:{title:"Folder remembered: {name}",open:"Open «{name}»"},opening:"Opening…",name:"Library",add:"Add ROMs",sync:{action:"Sync with the library",title:"Sync “{folder}” with the library",message:"The folder's games are copied to the library and the library's to the folder, until both are the same. A file changed in both places is kept in both versions. The library will take as much room in this browser as the folder.",confirm:"Sync",running:"Syncing with the library…",done:"Synced: {toLibrary} to the library, {toFolder} to the folder, {conflicts} kept in two versions.",same:"The folder and the library were already the same."}},tree:{title:"Files",newFolder:"New folder inside the selected one",addFiles:"Add files to the selected folder",delete:"Delete what is selected",expand:"Expand",collapse:"Collapse",initialized:"Has library metadata",groupOn:"Browse this folder as it is on disk",groupOff:"Group this folder by Game",consolidate:"Rename and sort this folder to match the catalogue",empty:"Empty folder",reading:"Reading games…",status:{complete:"Every file is here",partial:"Some files are missing",missing:"Not in this folder"},prompt:{folderName:"Name of the new folder"},confirm:{delete:"Delete {count} item(s)? This cannot be undone."},error:{separator:"A folder name cannot contain path separators",read:"The folder could not be read",operation:"The operation failed",drag:"What was dragged could not be read"}},details:{empty:"Pick a ROM to read its details",back:"Back to the Game",cover:{none:"No cover",region:"{region} box",game:"Box of the Game",alt:"{title} cover art"},facts:{system:"System",format:"Format",size:"Size",modified:"Modified",added:"Added to the library",file:"File",publisher:"Publisher",crc32:"CRC32",updated:"Updated",notInitialized:"Not in the library",noExtension:"no extension"},file:{pending:"Not in the library yet",add:"Add metadata"},edit:"Edit",delete:"Delete",checksum:{calculate:"Calculate",calculating:"Calculating…",skipped:"Skipped — over {limit}",failed:"The checksum could not be calculated"},variants:{title:"Variants",files:"{count} files",missingFile:"missing",more:"{count} more the catalogue knows of",shipsTo:"Ships to {region}",runsAt:"Runs at {standard}",consolidate:"Rename and sort to match the catalogue",deleteVariant:"Delete variant",deleteFile:"Delete file",deleteTitle:"Delete variant",deleteMessage:'Are you sure you want to delete the "{variant}" variant ({count} file(s))? This action cannot be undone.',deleteFileTitle:"Delete file",deleteFileMessage:'Are you sure you want to delete the file "{name}"? This action cannot be undone.'},status:{complete:"Complete",partial:"Incomplete",missing:"Not in this folder"},selection:{title:"{count} ROMs selected",ready:"All of them are in the library",pending:"{count} of them are not in the library yet",edit:"Edit {count}",gate:"Every selected ROM has to be in the library before editing in batch",hint:"Edit the fields every selected Game shares"},batch:{title:"Editing {count} Games",subtitle:"Only the fields every Game shares can be changed",keep:"Keep as it is ({value})",mixed:"mixed",apply:"Apply to {count} Games",saving:"Saving…",error:"The records could not be saved"}},editor:{lookup:{idle:"Look up in the dataset",crc32:"Checking CRC32…",md5:"Calculating MD5…",sha1:"Calculating SHA1…",hint:"Look the Game up in the dataset (CRC32 → MD5 → SHA1)",tooLarge:"The file is too large to checksum",title:"Found in the dataset",match:"Match:",select:"Fields to update:",current:"Now:",incoming:"New:",empty:"(empty)",apply:"Apply the ones ticked",notFound:"No dataset has this file",failed:"The lookup failed"},fields:{cover:"Cover Art",title:"Title",description:"Description",releaseDate:"Release date",publisher:"Publisher",region:"Region",videoStandard:"Video standard",crc32:"CRC32"},select:"Choose…",changeCover:"Change cover",removeCover:"Remove cover",dropCoverOrClick:"Drag an image here or click to select",notCalculated:"Not calculated",tooLarge:"File too large",calculate:"Calculate",save:"Save",saving:"Saving…",cancel:"Cancel",error:{save:"The record could not be saved",checksum:"The checksum could not be calculated"}},drop:{label:"Add files",toGame:"Add to {title}",toFolder:"Add to {folder}",root:"the root",images:{one:"Image",many:"Images",hint:"They are kept in the metadata of the Game and take the place of the published cover for that region."},files:{one:"File",many:"Files"},asIs:"As it is",asGame:"As {title}",alongGame:"Goes with the Game",already:"{title} is already in {folder}",andMore:"{path} · and {count} more",hint:{plain:"They are copied as they are into {folder}.",intake:"As they are, they go into {folder}. As a Game, each one goes where the catalogue puts it, creating the folder if it is not there, and whatever comes out of an archive is unpacked and checked against what the archive claimed."},cancel:"Cancel",confirm:"Add",confirmMany:"Add {count}"},intake:{label:"Add Games to the library",toSystem:"Add to {system}",toLibrary:"Add to the library",games:{one:"Game",many:"Games ({count})",hint:"The folder is created if it is not there. Whatever comes out of an archive is unpacked and checked against what the archive claimed."},taken:"Already in {path}",from:"from {archive}",companions:{one:"File that goes with it",many:"Files that go with it",already:"{name} (already there)",hint:"No catalogue claims them, so they are copied next to the Game."},strays:{title:"Not recognised",hint:"No catalogue claims them, so they are not copied: pick a folder in the tree to put them there as they are."},refused:{title:"Cannot be opened",zip64:"the archive uses Zip64, which this version cannot read",encrypted:"it is encrypted",method:"it uses a compression this version cannot read",damaged:"its index could not be read"},cancel:"Cancel",confirm:"Add",confirmMany:"Add {count}"},organize:{title:"Consolidate {system}",done:"{system} consolidated",moving:"to move",settled:"already in place",markers:"Games marked",conflicts:"left alone",untouched:"Left alone",reason:{duplicateTarget:"another file claims the same name",targetTaken:"the destination name is already taken",swap:"several files claim each other's place"},moved:"Moved",willMove:"To be moved",more:"and {count} more",settledAll:"Everything is where the catalogue says it should be.",undo:"Undo",close:"Done",cancel:"Cancel",confirm:"Move {count} files",busy:{reading:"Reading {system}…",readingProgress:"Reading {system}: {done} of {total}",moving:"Moving files…",movingProgress:"Moving files: {done} of {total}",undoing:"Putting the files back…"}},system:{folder:"Folder",collection:"Folder / Collection",path:"Path",about:"About this System",extensions:"Usual file extensions",key:"System key",medium:{disc:"Disc System",cartridge:"Cartridge System"},structure:{label:"On-disk structure",disc:"A folder per Game and a subfolder per Variant",cartridge:"Flat System folder (System/Game.ext)"}},media:{kind:{case:"Cover Art",background:"Background",title:"Title screen",snap:"Screenshot",logo:"Logo"},scope:{global:"Every region"}},prefs:{title:"Preferences",close:"Close",theme:{title:"Theme",hint:"Automatic follows the system.",auto:"Automatic",light:"Light",dark:"Dark"},locale:{title:"Language",hint:"Automatic follows the browser.",auto:"Automatic"},regions:{title:"Region priority",hint:"The order cover art is preferred in. It is kept in the open library.",locked:"Open a folder to choose it: it is kept in the library."},storage:{title:"Storage",usage:"{used} used of {quota} available in this browser",unknown:"This browser does not say how much room is left.",persistent:"Persistent: the browser will not clear your library to make room.",bestEffort:"Best effort: the browser may clear the library when it runs out of room (or, on an iPhone, after days unused unless it is added to the home screen).",ask:"Ask for persistent storage"}},mobile:{nav:"Library navigation",systems:"Systems",games:"Games",game:"Game",reading:"Reading…",noSystems:"No games yet. Use “Add ROMs”.",pickSystem:"Pick a system.",noGames:"No games in this system.",pickGame:"Pick a game.",gameCount:"{count} games",versions:"{count} files",oneVersion:"1 file"},errors:{library:"Could not open this browser's library",sync:"Could not sync with the library",openFolder:"The folder could not be opened",deniedFolder:"Access to the folder was refused. Click again to ask for it once more.",savedFolder:"The remembered folder could not be opened",readSelection:"The selection could not be read",group:"{path} could not be grouped",viewMode:"The view mode could not be saved",regionOrder:"The region order could not be saved",plan:"{system} could not be planned",organize:"The files could not be moved",undo:"The move could not be undone",identify:"The files could not be identified",writeFiles:"The files could not be saved",copyFiles:"The files could not be copied",noGame:"No Game was recognised: pick one to add images to it, or a folder to copy the files into as they are.",catalogue:"The catalogue could not be reached, so they can only be copied as they are: {reason}",unknown:"unknown error"},progress:{reading:"Reading {path}: {done} of {total}",identifying:"Identifying {file}…",identifyingMany:"Identifying {count} files…",identifyingFile:"Identifying {file}: {percent}%",identifyingFileOf:"Identifying {file}: {percent}% ({done} of {total})",saving:"Saving {file}…",copying:"Copying {file}…",copyingOf:"Copying {file} ({done} of {total})…",adding:"Adding {file}…",addingOf:"Adding {file} ({done} of {total})…"},modal:{confirm:"Confirm",cancel:"Cancel",close:"Close",delete:"Delete",createFolderTitle:"New Folder",deleteTitle:"Confirm Deletion"},mods:{title:"Mods",empty:"No mods for this game.",hint:'Add IPS, BPS or UPS patches with "Add ROMs" or by dropping them here. A mod never changes the ROM.',unassigned:"{count} unassigned in this system",assign:"Assign to this game",unassign:"Unassign",rename:"Rename",renameTitle:"Rename mod",remove:"Remove",removeTitle:"Remove mod",removeMessage:'Remove the mod "{name}"? Its patch file is deleted.',added:"{count} mod(s) added, {assigned} to their game",duplicates:"{count} already in the library",fit:{fits:"Fits a version here",other:"For another version",unknown:"IPS: version not checked"},refused:{"not-a-patch":'"{name}" is not an IPS, BPS or UPS patch',damaged:'"{name}" is damaged',"no-system":'"{name}": open the game or the system it is for, then add it'},errors:{import:"The mods could not be added.",change:"The mod could not be changed."}},host:{launcher:"Launcher",launcherTitle:"Back to the launcher",play:"Play",playWithMod:"Play with this mod",migration:{running:"Moving your launcher library in…",progress:"Moving your launcher library in ({done} of {total})…",done:"Your launcher library is here: {roms} ROM(s), {mods} mod(s).",failed:"Your launcher library could not be moved in: {reason}"}}};Z.app;Z.header;Z.tabs;Z.welcome;Z.library;Z.tree;Z.details;Z.editor;Z.drop;Z.intake;Z.organize;Z.system;Z.media;Z.prefs;Z.mobile;Z.errors;Z.progress;Z.modal;Z.mods;Z.host;var J={app:{name:"ROM Manager",initializing:"Arrancando…"},header:{regions:{label:"Prioridad de región",preferred:"Se prefiere la carátula de {region}",prefer:"Preferir la carátula de {region}"},preferences:"Preferencias"},tabs:{reconnect:"Haz clic para volver a dar acceso",close:"Cerrar",add:"Abrir una carpeta"},welcome:{tagline:"Tu colección retro, leída donde está",pitch:"ROM Manager abre una carpeta de ROMs y hace una biblioteca con ella: cada fichero identificado por su checksum, cada Juego en una sola entrada con sus Variantes, y su Carátula al lado. Funciona entero en el navegador, contra tu propio disco.",open:"Abrir carpeta",opening:"Abriendo…",hint:"No se sube nada. No se mueve nada sin enseñártelo antes.",library:"Abrir mi biblioteca",openFolder:"Abrir una carpeta",libraryHint:"Tu biblioteca vive en este navegador. No se sube nada; en escritorio puedes sincronizarla con una carpeta.",what:{title:"Qué hace",hash:{title:"Identifica por checksum",body:"Cada fichero se contrasta con los DAT de No-Intro y Redump por su CRC32. El nombre de un fichero es lo que alguien escribió; el checksum es lo que el fichero es."},grouping:{title:"Una entrada por Juego",body:"Regiones, revisiones e idiomas de un mismo título se pliegan en un solo Juego, y sus Variantes se leen en el panel de detalles: cuáles tienes, qué ficheros faltan y a dónde se vendió cada una."},covers:{title:"Una carátula por región",body:"Cajas de EU, US y JP sacadas de libretro-thumbnails y guardadas en la biblioteca según navegas, así que siguen ahí con la red apagada. Un orden de preferencia decide cuál se enseña."},consolidate:{title:"Nada se mueve sin tu permiso",body:"Consolidar un Sistema se calcula como un Plan y se te enseña entero. No se renombra ni se mueve nada hasta que lo dices, y se puede deshacer justo después."}},how:{title:"Cómo funciona",step1:{title:"Abre tu colección",body:"Elige la carpeta donde viven tus Sistemas: la carpeta `games` de MiSTer, o cualquiera montada igual."},step2:{title:"Navégala por Juego",body:"La carpeta de un Sistema se puede leer plana, tal cual está en disco, o agrupada, con los ficheros reconocidos plegados en el Juego del que son una edición."},step3:{title:"Ordénala y complétala",body:"Consolida la carpeta cuando el Plan te convenza, suelta carátulas o ROMs directamente sobre el panel, y edita lo que el catálogo no sepa."}},systems:{title:"Sistemas que conoce",hint:"{count} Sistemas, cada uno identificado por el nombre de carpeta que le da MiSTer."},privacy:{title:"No sale de tu máquina",body:"Las carpetas se leen con la File System Access API, que te pide permiso para una carpeta y se lo da sólo a esta pestaña. No hay servidor ni subida de nada. Soporte real sólo hay en navegadores Chromium."},footer:{legal:"ROM Manager es software libre de código abierto. Todos los nombres de sistemas, marcas y carátulas son propiedad de sus respectivos dueños.",github:"Código en GitHub"}},library:{locked:{title:"Carpeta recordada: {name}",open:"Abrir «{name}»"},opening:"Abriendo…",name:"Biblioteca",add:"Añadir ROMs",sync:{action:"Sincronizar con la biblioteca",title:"Sincronizar «{folder}» con la biblioteca",message:"Los juegos de la carpeta se copian a la biblioteca y los de la biblioteca a la carpeta, hasta que las dos sean iguales. Si un archivo cambió en los dos sitios se guardan ambas versiones. La biblioteca ocupará en este navegador el mismo espacio que la carpeta.",confirm:"Sincronizar",running:"Sincronizando con la biblioteca…",done:"Sincronizado: {toLibrary} a la biblioteca, {toFolder} a la carpeta, {conflicts} con dos versiones.",same:"La carpeta y la biblioteca ya eran iguales."}},tree:{title:"Ficheros",newFolder:"Nueva carpeta dentro de la seleccionada",addFiles:"Añadir ficheros a la carpeta seleccionada",delete:"Borrar lo seleccionado",expand:"Desplegar",collapse:"Plegar",initialized:"Tiene metadatos en la biblioteca",groupOn:"Ver esta carpeta tal cual está en disco",groupOff:"Agrupar esta carpeta por Juego",consolidate:"Renombrar y ordenar esta carpeta según el catálogo",empty:"Carpeta vacía",reading:"Leyendo juegos…",status:{complete:"Están todos los ficheros",partial:"Faltan ficheros",missing:"No está en esta carpeta"},prompt:{folderName:"Nombre de la carpeta nueva"},confirm:{delete:"¿Borrar {count} elemento(s)? Esto no se puede deshacer."},error:{separator:"El nombre de una carpeta no puede llevar separadores de ruta",read:"No se ha podido leer la carpeta",operation:"La operación ha fallado",drag:"No se ha podido leer lo que se arrastró"}},details:{empty:"Elige una ROM para leer sus detalles",back:"Volver al Juego",cover:{none:"Sin carátula",region:"Caja de {region}",game:"Caja del Juego",alt:"Carátula de {title}"},facts:{system:"Sistema",format:"Formato",size:"Tamaño",modified:"Modificado",added:"Añadido a la biblioteca",file:"Fichero",publisher:"Editora",crc32:"CRC32",updated:"Actualizado",notInitialized:"No está en la biblioteca",noExtension:"sin extensión"},file:{pending:"Todavía no está en la biblioteca",add:"Añadir metadatos"},edit:"Editar",delete:"Borrar",checksum:{calculate:"Calcular",calculating:"Calculando…",skipped:"No se calcula — pasa de {limit}",failed:"No se ha podido calcular el checksum"},variants:{title:"Variantes",files:"{count} ficheros",missingFile:"falta",more:"otras {count} que el catálogo conoce",shipsTo:"Se vendió en {region}",runsAt:"Funciona a {standard}",consolidate:"Renombrar y ordenar según el catálogo",deleteVariant:"Borrar variante",deleteFile:"Borrar fichero",deleteTitle:"Borrar variante",deleteMessage:'¿Seguro que quieres borrar la variante "{variant}" ({count} fichero(s))? Esta acción no se puede deshacer.',deleteFileTitle:"Borrar fichero",deleteFileMessage:'¿Seguro que quieres borrar el fichero "{name}"? Esta acción no se puede deshacer.'},status:{complete:"Completa",partial:"Incompleta",missing:"No está en esta carpeta"},selection:{title:"{count} ROMs seleccionadas",ready:"Todas están en la biblioteca",pending:"{count} de ellas todavía no están en la biblioteca",edit:"Editar {count}",gate:"Todas las ROMs seleccionadas tienen que estar en la biblioteca para editarlas en lote",hint:"Editar los campos que comparten todos los Juegos seleccionados"},batch:{title:"Editando {count} Juegos",subtitle:"Sólo se pueden cambiar los campos que comparten todos los Juegos",keep:"Dejar como está ({value})",mixed:"mezclado",apply:"Aplicar a {count} Juegos",saving:"Guardando…",error:"No se han podido guardar las fichas"}},editor:{lookup:{idle:"Buscar en el dataset",crc32:"Comprobando CRC32…",md5:"Calculando MD5…",sha1:"Calculando SHA1…",hint:"Buscar el Juego en el dataset (CRC32 → MD5 → SHA1)",tooLarge:"El fichero es demasiado grande para calcularle el checksum",title:"Encontrado en el dataset",match:"Coincide con:",select:"Campos que actualizar:",current:"Ahora:",incoming:"Nuevo:",empty:"(vacío)",apply:"Aplicar los marcados",notFound:"Ningún dataset tiene este fichero",failed:"La búsqueda ha fallado"},fields:{cover:"Carátula",title:"Título",description:"Descripción",releaseDate:"Fecha de salida",publisher:"Editora",region:"Región",videoStandard:"Estándar de vídeo",crc32:"CRC32"},select:"Elige…",changeCover:"Cambiar la carátula",removeCover:"Quitar la carátula",dropCoverOrClick:"Arrastra una imagen aquí o haz clic para elegir",notCalculated:"Sin calcular",tooLarge:"Fichero demasiado grande",calculate:"Calcular",save:"Guardar",saving:"Guardando…",cancel:"Cancelar",error:{save:"No se ha podido guardar la ficha",checksum:"No se ha podido calcular el checksum"}},drop:{label:"Añadir ficheros",toGame:"Añadir a {title}",toFolder:"Añadir a {folder}",root:"la raíz",images:{one:"Imagen",many:"Imágenes",hint:"Se guardan en los metadatos del Juego y sustituyen a la carátula publicada de esa región."},files:{one:"Fichero",many:"Ficheros"},asIs:"Tal cual",asGame:"Como {title}",alongGame:"Va con el Juego",already:"{title} ya está en {folder}",andMore:"{path} · y {count} más",hint:{plain:"Se copian tal cual a {folder}.",intake:"Tal cual van a {folder}. Como Juego, cada uno va donde lo pone el catálogo, creando la carpeta si no existe, y lo que salga de un archivo se descomprime y se comprueba que sea lo que el archivo decía."},cancel:"Cancelar",confirm:"Añadir",confirmMany:"Añadir {count}"},intake:{label:"Añadir Juegos a la biblioteca",toSystem:"Añadir a {system}",toLibrary:"Añadir a la biblioteca",games:{one:"Juego",many:"Juegos ({count})",hint:"La carpeta se crea si no existe. Lo que salga de un archivo se descomprime y se comprueba que sea lo que el archivo decía."},taken:"Ya está en {path}",from:"de {archive}",companions:{one:"Fichero que va con él",many:"Ficheros que van con él",already:"{name} (ya está ahí)",hint:"No están en ningún catálogo, así que se copian junto al Juego."},strays:{title:"Sin reconocer",hint:"Ningún catálogo los reclama, así que no se copian: elige una carpeta en el árbol para meterlos tal cual."},refused:{title:"No se pueden abrir",zip64:"el archivo usa Zip64, que esta versión no sabe leer",encrypted:"está cifrado",method:"usa una compresión que esta versión no sabe leer",damaged:"no se ha podido leer su índice"},cancel:"Cancelar",confirm:"Añadir",confirmMany:"Añadir {count}"},organize:{title:"Consolidar {system}",done:"{system} consolidado",moving:"por mover",settled:"ya en su sitio",markers:"Juegos marcados",conflicts:"sin tocar",untouched:"No se tocan",reason:{duplicateTarget:"otro fichero reclama el mismo nombre",targetTaken:"el nombre de destino ya está ocupado",swap:"varios ficheros se reclaman el sitio entre sí"},moved:"Movidos",willMove:"Se moverán",more:"y {count} más",settledAll:"Todo está donde el catálogo dice que debe estar.",undo:"Deshacer",close:"Hecho",cancel:"Cancelar",confirm:"Mover {count} ficheros",busy:{reading:"Leyendo {system}…",readingProgress:"Leyendo {system}: {done} de {total}",moving:"Moviendo ficheros…",movingProgress:"Moviendo ficheros: {done} de {total}",undoing:"Devolviendo los ficheros a su sitio…"}},system:{folder:"Carpeta",collection:"Carpeta / Colección",path:"Ruta",about:"Sobre este Sistema",extensions:"Extensiones habituales",key:"Clave del Sistema",medium:{disc:"Sistema de disco",cartridge:"Sistema de cartucho"},structure:{label:"Estructura en disco",disc:"Una carpeta por Juego y una subcarpeta por Variante",cartridge:"Carpeta de Sistema plana (Sistema/Juego.ext)"}},media:{kind:{case:"Carátula",background:"Fondo",title:"Pantalla de título",snap:"Captura",logo:"Logo"},scope:{global:"Todas las regiones"}},prefs:{title:"Preferencias",close:"Cerrar",theme:{title:"Tema",hint:"Automático sigue al sistema.",auto:"Automático",light:"Claro",dark:"Oscuro"},locale:{title:"Idioma",hint:"Automático sigue al navegador.",auto:"Automático"},regions:{title:"Prioridad de región",hint:"Orden en que se prefieren las carátulas. Se guarda en la biblioteca abierta.",locked:"Abre una carpeta para elegirlo: se guarda en la biblioteca."},storage:{title:"Almacenamiento",usage:"{used} usados de {quota} disponibles en este navegador",unknown:"Este navegador no dice cuánto espacio queda.",persistent:"Persistente: el navegador no borrará tu biblioteca para hacer sitio.",bestEffort:"Sin garantía: el navegador podría borrar la biblioteca si le falta espacio (o, en iPhone, tras días sin usarla si no la instalas en la pantalla de inicio).",ask:"Pedir almacenamiento persistente"}},mobile:{nav:"Navegación de la biblioteca",systems:"Sistemas",games:"Juegos",game:"Juego",reading:"Leyendo…",noSystems:"Todavía no hay juegos. Usa «Añadir ROMs».",pickSystem:"Elige un sistema.",noGames:"No hay juegos en este sistema.",pickGame:"Elige un juego.",gameCount:"{count} juegos",versions:"{count} archivos",oneVersion:"1 archivo"},errors:{openFolder:"No se ha podido abrir la carpeta",library:"No se ha podido abrir la biblioteca de este navegador",sync:"No se ha podido sincronizar con la biblioteca",deniedFolder:"Acceso denegado a la carpeta. Haz clic de nuevo para volver a pedirlo.",savedFolder:"No se ha podido abrir la carpeta guardada",readSelection:"No se ha podido leer la selección",group:"No se ha podido agrupar {path}",viewMode:"No se ha podido guardar el modo de vista",regionOrder:"No se ha podido guardar el orden de regiones",plan:"No se ha podido planear {system}",organize:"No se han podido mover los ficheros",undo:"No se ha podido deshacer",identify:"No se han podido identificar los ficheros",writeFiles:"No se han podido guardar los ficheros",copyFiles:"No se han podido copiar los ficheros",noGame:"No se ha reconocido ningún Juego: elige uno para añadirle imágenes, o una carpeta para copiar los ficheros dentro tal cual.",catalogue:"No se ha podido consultar el catálogo, así que sólo se pueden copiar tal cual: {reason}",unknown:"error desconocido"},progress:{reading:"Leyendo {path}: {done} de {total}",identifying:"Identificando {file}…",identifyingMany:"Identificando {count} ficheros…",identifyingFile:"Identificando {file}: {percent}%",identifyingFileOf:"Identificando {file}: {percent}% ({done} de {total})",saving:"Guardando {file}…",copying:"Copiando {file}…",copyingOf:"Copiando {file} ({done} de {total})…",adding:"Añadiendo {file}…",addingOf:"Añadiendo {file} ({done} de {total})…"},modal:{confirm:"Confirmar",cancel:"Cancelar",close:"Cerrar",delete:"Eliminar",createFolderTitle:"Nueva carpeta",deleteTitle:"Confirmar eliminación"},mods:{title:"Mods",empty:"Este juego no tiene mods.",hint:"Añade parches IPS, BPS o UPS con «Añadir ROMs» o soltándolos aquí. Un mod nunca cambia la ROM.",unassigned:"{count} sin asignar en este sistema",assign:"Asignar a este juego",unassign:"Quitar del juego",rename:"Renombrar",renameTitle:"Renombrar mod",remove:"Eliminar",removeTitle:"Eliminar mod",removeMessage:"¿Eliminar el mod «{name}»? Se borra su archivo de parche.",added:"{count} mod(s) añadido(s), {assigned} a su juego",duplicates:"{count} ya estaba(n) en la biblioteca",fit:{fits:"Encaja con una versión de aquí",other:"Para otra versión",unknown:"IPS: versión sin comprobar"},refused:{"not-a-patch":"«{name}» no es un parche IPS, BPS ni UPS",damaged:"«{name}» está dañado","no-system":"«{name}»: abre el juego o el sistema al que va y añádelo"},errors:{import:"No se pudieron añadir los mods.",change:"No se pudo cambiar el mod."}},host:{launcher:"Lanzador",launcherTitle:"Volver al lanzador",play:"Jugar",playWithMod:"Jugar con este mod",migration:{running:"Trayendo la biblioteca del lanzador…",progress:"Trayendo la biblioteca del lanzador ({done} de {total})…",done:"Tu biblioteca del lanzador ya está aquí: {roms} ROM(s), {mods} mod(s).",failed:"No se pudo traer la biblioteca del lanzador: {reason}"}}};J.app;J.header;J.tabs;J.welcome;J.library;J.tree;J.details;J.editor;J.drop;J.intake;J.organize;J.system;J.media;J.prefs;J.mobile;J.errors;J.progress;J.modal;J.mods;J.host;const Ct=["en","es"],Vr=["auto",...Ct],We="en",Et="auto",Ec={en:"English",es:"Español"};function Rc(e){return Ct.some(t=>t===e)}function Kr(e){return Vr.find(t=>t===e)??Et}function Yr(e){for(const t of e??[]){const n=t.toLowerCase().split("-")[0],a=Ct.find(r=>r===n);if(a)return a}return We}function Zr(e,t){return e==="auto"?Yr(t):e}function Ia(e,t){let n=e;for(const a of t.split(".")){if(typeof n!="object"||n===null)return;n=n[a]}return typeof n=="string"?n:void 0}function _c(e,t){return t?e.replace(/\{(\w+)\}/g,(n,a)=>a in t?String(t[a]):n):e}function Jr(e,t,n,a){const r=Ia(e,n)??Ia(t,n);return r===void 0?n:_c(r,a)}function Xr(e,t=""){return Object.entries(e).flatMap(([n,a])=>{const r=t?`${t}.${n}`:n;return typeof a=="string"?[r]:Xr(a,r)})}const Ac=Object.freeze(Object.defineProperty({__proto__:null,DEFAULT_LOCALE:We,DEFAULT_LOCALE_PREFERENCE:Et,LOCALES:Ct,LOCALE_LABELS:Ec,LOCALE_PREFERENCES:Vr,isLocale:Rc,messageKeys:Xr,negotiateLocale:Yr,parseLocalePreference:Kr,resolveLocale:Zr,translate:Jr},Symbol.toStringTag,{value:"Module"})),Qr="rom-manager.locale",Kt={en:Z,es:J},$e=Pe({preference:Et,locale:We});function Ic(){if(!(typeof navigator>"u"))return navigator.languages?.length?navigator.languages:[navigator.language]}function Pc(){try{return Kr(localStorage.getItem(Qr))}catch{return Et}}function Nc(e){try{localStorage.setItem(Qr,e)}catch{}}function Lc(e){typeof document<"u"&&(document.documentElement.lang=e)}function un(e){const t=Zr(e,Ic());$e.locale=t,Lc(t)}function zc(e){$e.preference=e,Nc(e),un(e)}function eo(e,t){return Jr(Kt[$e.locale]??Kt[We],Kt[We],e,t)}function Tc(){const e=Pc();if($e.preference=e,un(e),typeof window>"u")return()=>{};const t=()=>{const n=$e.preference;n==="auto"&&un(n)};return window.addEventListener("languagechange",t),()=>window.removeEventListener("languagechange",t)}const to=Object.freeze(Object.defineProperty({__proto__:null,i18nState:$e,initLocale:Tc,setLocalePreference:zc,t:eo},Symbol.toStringTag,{value:"Module"})),no=["auto","light","dark"],Rt="auto";function ao(e){return no.find(t=>t===e)??Rt}function ro(e,t){return e==="auto"?t?"dark":"light":e}const jc=Object.freeze(Object.defineProperty({__proto__:null,DEFAULT_THEME_MODE:Rt,THEME_MODES:no,parseThemeMode:ao,resolveTheme:ro},Symbol.toStringTag,{value:"Module"})),oo="rom-manager.theme",Dc="(prefers-color-scheme: dark)",He=Pe({mode:Rt});function Bc(){try{return ao(localStorage.getItem(oo))}catch{return Rt}}function Fc(e){try{localStorage.setItem(oo,e)}catch{}}function io(){return typeof matchMedia=="function"?matchMedia(Dc):void 0}function pn(e){typeof document>"u"||(document.documentElement.dataset.theme=ro(e,io()?.matches??!1))}function qc(e){He.mode=e,Fc(e),pn(e)}function Gc(){const e=Bc();He.mode=e,pn(e);const t=io();if(!t)return()=>{};const n=()=>pn(He.mode);return t.addEventListener("change",n),()=>t.removeEventListener("change",n)}const so=Object.freeze(Object.defineProperty({__proto__:null,initTheme:Gc,setThemeMode:qc,themeState:He},Symbol.toStringTag,{value:"Module"}));class Uc{get locale(){return $e.locale}get localePreference(){return $e.preference}get themeMode(){return He.mode}get origins(){return L.origins}get activeOriginId(){return L.activeOriginId}get loading(){return L.loading}get error(){return L.error}get knownSystems(){return L.knownSystems}get wizardSettings(){return L.wizardSettings}}const Wc=new Uc,ie=Object.freeze(Object.defineProperty({__proto__:null,t:eo,ui:Wc},Symbol.toStringTag,{value:"Module"})),Hc=`<!--
  The explorer's header: the mark (back to the start), the open tabs, add ROMs,
  sync, the preferred region and the preferences.

  Events: go-home, open-folder, add-roms, sync, select-origin (id),
  close-origin (id), region-order-change (order), open-preferences.
  \`canOpenFolder\` / \`canAddRoms\` / \`canSync\` say which buttons exist; \`launcherUrl\`, when
  rom-manager is a launcher's \`/roms/\`, is the way back to it.
-->
<script
  :setup="{ origins = [], activeOriginId = void 0, showLanding = false, regionOrder = [], hasNode = false, canOpenFolder = false, canAddRoms = false, canSync = false, launcherUrl = void 0 }">const [BrandLogo, Icon, Tabs, { REGIONS, preferRegion }, { t }] = await $importAll([
  "../components/BrandLogo.html",
  "../components/Icon.html",
  "../components/Tabs.html",
  "../helpers/rom-regions",
  "../lib/ui-state"
]);
<\/script>

<header class="explorer-header">
  <div class="header-left">
    <h1 class="explorer-title clickable" @click="$emit('go-home')" :title="t('app.name')">
      <BrandLogo class-name="explorer-mark" />
      {{ t('app.name') }}
    </h1>
    <a :if="launcherUrl" class="header-launcher icon-label" :href="launcherUrl" :title="t('host.launcherTitle')">
      <Icon name="arrow-left" /> {{ t('host.launcher') }}
    </a>
    <button :if="canOpenFolder" class="tab-add" @click="$emit('open-folder')" :title="t('tabs.add')">
      <Icon name="plus" />
    </button>
  </div>

  <div class="header-right">
    <Tabs
      :origins="origins"
      :active-origin-id="showLanding ? undefined : activeOriginId"
      :labels="{ reconnect: t('tabs.reconnect'), close: t('tabs.close') }"
      @select="$emit('select-origin', $event.detail)"
      @close="$emit('close-origin', $event.detail)"
    />
    <div class="header-right-actions">
      <button :if="canAddRoms" class="header-prefs" @click="$emit('add-roms')" :title="t('library.add')">
        <Icon name="upload" />
      </button>
      <button :if="canSync" class="header-prefs" @click="$emit('sync')" :title="t('library.sync.action')">
        <Icon name="sync" />
      </button>
      <div class="header-regions" role="group" :aria-label="t('header.regions.label')">
        <button
          :each="region in REGIONS"
          :key="region"
          :class="\`header-region \${regionOrder[0] === region ? 'on' : ''}\`"
          :disabled="!hasNode || showLanding"
          :aria-pressed="regionOrder[0] === region ? 'true' : 'false'"
          :title="regionOrder[0] === region ? t('header.regions.preferred', { region }) : t('header.regions.prefer', { region })"
          @click="$emit('region-order-change', preferRegion(regionOrder, region))"
        >
          {{ region }}
        </button>
      </div>

      <button class="header-prefs" @click="$emit('open-preferences')" :title="t('header.preferences')">
        <Icon name="gear" />
      </button>
    </div>
  </div>
</header>
`,Vc={"../components/BrandLogo.html":Ur,"../components/Icon.html":ne,"../components/Tabs.html":bc,"../helpers/rom-regions":za,"../lib/ui-state":ie},Kc="views/Header.html";let lo;lo=new q(Hc,{modules:Vc,filename:Kc});const Yc=lo,Zc=`<!--
  A console, drawn: the badge of a system folder and the mark of a system's page.
  One branch per system the catalogue knows; anything else gets the generic one.
-->
<script :setup="{ systemId = &quot;&quot;, className = &quot;system-logo-svg&quot; }">$: id = String(systemId).toUpperCase();
<\/script>

<svg :if="id === 'NES'" viewBox="0 0 128 128" :class="className" aria-label="NES Console">
  <!-- NES Console Main Body -->
  <rect x="8" y="32" width="112" height="68" rx="4" fill="#cbd5e1" stroke="#475569" stroke-width="3" />
  <!-- Black top band -->
  <rect x="8" y="32" width="112" height="20" fill="#1e293b" />
  <!-- Cartridge Door Slot -->
  <rect x="18" y="36" width="60" height="12" fill="#0f172a" rx="1" />
  <rect x="20" y="38" width="56" height="3" fill="#334155" />
  <!-- Red Power / Reset Buttons -->
  <rect x="18" y="72" width="16" height="18" rx="2" fill="#94a3b8" />
  <rect x="22" y="76" width="8" height="10" rx="1" fill="#e60012" />
  <rect x="38" y="72" width="16" height="18" rx="2" fill="#94a3b8" />
  <rect x="42" y="76" width="8" height="10" rx="1" fill="#e60012" />
  <!-- Controller Ports -->
  <rect x="68" y="74" width="20" height="12" rx="2" fill="#0f172a" />
  <rect x="92" y="74" width="20" height="12" rx="2" fill="#0f172a" />
  <!-- Ventilation Grill Lines -->
  <line x1="84" y1="36" x2="114" y2="36" stroke="#475569" stroke-width="2" />
  <line x1="84" y1="40" x2="114" y2="40" stroke="#475569" stroke-width="2" />
  <line x1="84" y1="44" x2="114" y2="44" stroke="#475569" stroke-width="2" />
</svg>
<svg :elseif="id === 'SNES'" viewBox="0 0 128 128" :class="className" aria-label="SNES Console">
  <!-- SNES Main Body -->
  <rect x="12" y="24" width="104" height="80" rx="12" fill="#cbd5e1" stroke="#64748b" stroke-width="3" />
  <!-- Darker Center Section -->
  <rect x="24" y="24" width="80" height="56" rx="6" fill="#94a3b8" />
  <!-- Cartridge Slot & Flap -->
  <rect x="32" y="32" width="64" height="14" rx="3" fill="#475569" />
  <rect x="36" y="35" width="56" height="4" rx="1" fill="#1e293b" />
  <!-- Purple Power / Eject / Reset Switches -->
  <rect x="28" y="54" width="14" height="20" rx="2" fill="#8b5cf6" />
  <rect x="48" y="56" width="32" height="14" rx="2" fill="#64748b" />
  <rect x="86" y="54" width="14" height="20" rx="2" fill="#8b5cf6" />
  <!-- Controller Ports Front Panel -->
  <rect x="24" y="84" width="80" height="16" rx="4" fill="#94a3b8" />
  <rect x="32" y="87" width="28" height="10" rx="3" fill="#334155" />
  <rect x="68" y="87" width="28" height="10" rx="3" fill="#334155" />
</svg>
<svg :elseif="id === 'GAMEBOY'" viewBox="0 0 128 128" :class="className" aria-label="Game Boy Console">
  <!-- Handheld Shell -->
  <path d="M32 10h64a10 10 0 0 1 10 10v78a10 10 0 0 1-10 10H50L32 94V20a10 10 0 0 1 10-10z" fill="#cbd5e1" stroke="#64748b" stroke-width="3" />
  <!-- Screen Frame -->
  <rect x="40" y="20" width="48" height="38" rx="4" fill="#94a3b8" />
  <rect x="46" y="24" width="36" height="28" rx="2" fill="#8bac0f" />
  <rect x="48" y="26" width="32" height="24" fill="#9bbc0f" />
  <!-- D-Pad -->
  <rect x="40" y="68" width="16" height="5" rx="1.5" fill="#334155" />
  <rect x="45.5" y="62.5" width="5" height="16" rx="1.5" fill="#334155" />
  <!-- Buttons A / B -->
  <circle cx="76" cy="74" r="5" fill="#9333ea" />
  <circle cx="88" cy="67" r="5" fill="#9333ea" />
  <!-- Select / Start -->
  <rect x="52" y="94" width="10" height="3" rx="1" fill="#64748b" transform="rotate(-25 57 95.5)" />
  <rect x="66" y="94" width="10" height="3" rx="1" fill="#64748b" transform="rotate(-25 71 95.5)" />
</svg>
<svg :elseif="id === 'GBC'" viewBox="0 0 128 128" :class="className" aria-label="Game Boy Color Console">
  <path d="M32 10h64a10 10 0 0 1 10 10v78a10 10 0 0 1-10 10H50L32 94V20a10 10 0 0 1 10-10z" fill="#7e22ce" stroke="#581c87" stroke-width="3" />
  <rect x="38" y="18" width="52" height="40" rx="4" fill="#1e293b" />
  <rect x="44" y="22" width="40" height="30" rx="2" fill="#0284c7" />
  <circle cx="76" cy="74" r="5" fill="#ef4444" />
  <circle cx="88" cy="67" r="5" fill="#eab308" />
  <rect x="40" y="68" width="16" height="5" rx="1.5" fill="#0f172a" />
  <rect x="45.5" y="62.5" width="5" height="16" rx="1.5" fill="#0f172a" />
</svg>
<svg :elseif="id === 'GBA'" viewBox="0 0 128 128" :class="className" aria-label="Game Boy Advance Console">
  <!-- Top L / R Shoulder Bumpers Backing -->
  <path
    d="M24 30C24 24 36 22 50 22h28c14 0 26 2 26 8 2 8 8 16 8 34 0 18-6 26-8 34H24c-2-8-8-16-8-34 0-18 6-26 8-34z"
    fill="#d1d5db"
    stroke="#9ca3af"
    stroke-width="2"
  />
  <!-- Authentic Indigo Body (Wide horizontal curve layout) -->
  <path
    d="M44 26h40c10 0 18 2 25 7 9 6 13 18 13 31 0 14-4 25-13 31-7 5-15 7-25 7H44c-10 0-18-2-25-7-9-6-13-17-13-31 0-13 4-25 13-31 7-5 15-7 25-7z"
    fill="#544697"
    stroke="#382e6e"
    stroke-width="2.5"
  />
  <!-- Center Screen Bezel -->
  <path
    d="M38 34h52c6 0 10 4 10 10v38c0 10-6 14-12 14H40c-6 0-12-4-12-14V44c0-6 4-10 10-10z"
    fill="#232328"
    stroke="#17171a"
    stroke-width="1.5"
  />
  <!-- Screen Display Inset -->
  <rect x="42" y="39" width="44" height="33" rx="3" fill="#121316" />
  <rect x="44" y="41" width="40" height="29" rx="1.5" fill="#1c1e24" />
  <!-- D-Pad (Light Silver Cross on Left Wing) -->
  <rect x="20" y="54" width="14" height="6" rx="1.5" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="0.8" />
  <rect x="24" y="50" width="6" height="14" rx="1.5" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="0.8" />
  <circle cx="27" cy="57" r="1.5" fill="#cbd5e1" />
  <!-- SELECT & START Angled Pills below D-Pad -->
  <rect x="20" y="70" width="14" height="4.5" rx="2.25" fill="#362f63" transform="rotate(25 27 72.25)" />
  <circle cx="31" cy="74" r="1.5" fill="#e2e8f0" />
  <rect x="20" y="78" width="14" height="4.5" rx="2.25" fill="#362f63" transform="rotate(25 27 80.25)" />
  <circle cx="31" cy="82" r="1.5" fill="#e2e8f0" />
  <!-- A & B Action Buttons (Light Silver angled buttons on Right Wing) -->
  <circle cx="88" cy="62" r="6" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1" />
  <circle cx="99" cy="54" r="6" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1" />
  <!-- Speaker Ventilation Grille Lines (Bottom Right) -->
  <line x1="88" y1="76" x2="99" y2="73" stroke="#362f63" stroke-width="1.8" stroke-linecap="round" />
  <line x1="88" y1="80" x2="99" y2="77" stroke="#362f63" stroke-width="1.8" stroke-linecap="round" />
  <line x1="88" y1="84" x2="99" y2="81" stroke="#362f63" stroke-width="1.8" stroke-linecap="round" />
  <line x1="88" y1="88" x2="99" y2="85" stroke="#362f63" stroke-width="1.8" stroke-linecap="round" />
  <line x1="88" y1="92" x2="99" y2="89" stroke="#362f63" stroke-width="1.8" stroke-linecap="round" />
</svg>
<svg :elseif="id === 'N64'" viewBox="0 0 128 128" :class="className" aria-label="Nintendo 64 Console">
  <!-- N64 Curved Console Body -->
  <path d="M16 40L28 20h72l12 20v56H16V40z" fill="#1e293b" stroke="#0f172a" stroke-width="3" />
  <path d="M28 20h72v24H28V20z" fill="#334155" />
  <!-- Cartridge Slot -->
  <rect x="36" y="24" width="56" height="12" rx="3" fill="#0f172a" />
  <!-- N64 Jewel Logo -->
  <circle cx="64" cy="50" r="8" fill="#10b981" />
  <path d="M64 44l6 4-6 4-6-4z" fill="#ef4444" />
  <!-- Controller Ports on Front -->
  <rect x="24" y="70" width="16" height="12" rx="3" fill="#0f172a" />
  <rect x="44" y="70" width="16" height="12" rx="3" fill="#0f172a" />
  <rect x="68" y="70" width="16" height="12" rx="3" fill="#0f172a" />
  <rect x="88" y="70" width="16" height="12" rx="3" fill="#0f172a" />
  <!-- Feet -->
  <rect x="20" y="96" width="16" height="8" rx="2" fill="#0f172a" />
  <rect x="92" y="96" width="16" height="8" rx="2" fill="#0f172a" />
</svg>
<svg :elseif="['MEGADRIVE', 'GENESIS'].includes(id)" viewBox="0 0 128 128" :class="className" aria-label="Mega Drive Console">
  <!-- Mega Drive Main Matte Black Body -->
  <rect x="12" y="24" width="104" height="80" rx="8" fill="#1e293b" stroke="#0f172a" stroke-width="3" />
  <!-- Circular Elevated Section -->
  <circle cx="64" cy="56" r="28" fill="#0f172a" stroke="#334155" stroke-width="2" />
  <circle cx="64" cy="56" r="20" fill="#1e293b" />
  <!-- Cartridge Slot -->
  <rect x="36" y="30" width="56" height="12" rx="3" fill="#0f172a" />
  <!-- Metallic 16-BIT Badge -->
  <text x="64" y="60" font-size="10" font-weight="bold" fill="#38bdf8" text-anchor="middle" letter-spacing="1">
    16-BIT
  </text>
  <!-- Red Reset Button -->
  <circle cx="28" cy="80" r="5" fill="#ef4444" />
</svg>
<svg :elseif="id === 'MEGACD'" viewBox="0 0 128 128" :class="className" aria-label="Mega-CD Console">
  <!-- Top Console -->
  <rect x="24" y="16" width="80" height="48" rx="6" fill="#1e293b" stroke="#0f172a" stroke-width="2" />
  <circle cx="64" cy="36" r="14" fill="#0f172a" />
  <!-- Bottom CD Unit -->
  <rect x="12" y="60" width="104" height="48" rx="6" fill="#334155" stroke="#0f172a" stroke-width="3" />
  <rect x="24" y="76" width="80" height="16" rx="3" fill="#0f172a" />
  <circle cx="94" cy="84" r="3" fill="#22c55e" />
</svg>
<svg :elseif="id === 'S32X'" viewBox="0 0 128 128" :class="className" aria-label="32X Console">
  <path d="M24 32h80l-12 56H36L24 32z" fill="#ef4444" stroke="#7f1d1d" stroke-width="3" />
  <rect x="38" y="44" width="52" height="16" rx="3" fill="#7f1d1d" />
  <text x="64" y="56" font-size="12" font-weight="bold" fill="#fca5a5" text-anchor="middle">
    32X
  </text>
</svg>
<svg :elseif="id === 'SATURN'" viewBox="0 0 128 128" :class="className" aria-label="Sega Saturn Console">
  <rect x="12" y="24" width="104" height="80" rx="10" fill="#334155" stroke="#1e293b" stroke-width="3" />
  <!-- Round CD Lid -->
  <circle cx="64" cy="58" r="26" fill="#1e293b" stroke="#475569" stroke-width="2" />
  <circle cx="64" cy="58" r="10" fill="#6366f1" />
  <!-- Power / Open Buttons -->
  <circle cx="28" cy="40" r="6" fill="#64748b" />
  <circle cx="100" cy="40" r="6" fill="#64748b" />
</svg>
<svg :elseif="id === 'PSX'" viewBox="0 0 128 128" :class="className" aria-label="PlayStation Console">
  <!-- PS1 Classic Gray Body -->
  <rect x="12" y="24" width="104" height="80" rx="10" fill="#cbd5e1" stroke="#64748b" stroke-width="3" />
  <!-- Circular CD Lid in Center -->
  <circle cx="64" cy="56" r="26" fill="#94a3b8" stroke="#475569" stroke-width="2" />
  <circle cx="64" cy="56" r="12" fill="#64748b" />
  <!-- Power / Open / Reset Buttons -->
  <circle cx="28" cy="42" r="7" fill="#64748b" />
  <circle cx="100" cy="42" r="7" fill="#64748b" />
  <circle cx="100" cy="74" r="5" fill="#64748b" />
  <!-- Front Dual Memory Card & Controller Slots -->
  <rect x="24" y="88" width="36" height="10" rx="2" fill="#475569" />
  <rect x="68" y="88" width="36" height="10" rx="2" fill="#475569" />
</svg>
<svg :elseif="id === 'SMS'" viewBox="0 0 128 128" :class="className" aria-label="Master System Console">
  <path d="M12 28L28 16h72l16 12v68H12V28z" fill="#0284c7" stroke="#0369a1" stroke-width="3" />
  <rect x="24" y="32" width="80" height="24" fill="#0f172a" />
  <line x1="24" y1="64" x2="104" y2="64" stroke="#ef4444" stroke-width="4" />
</svg>
<svg :elseif="id === 'GAMEGEAR'" viewBox="0 0 128 128" :class="className" aria-label="Game Gear Console">
  <rect x="10" y="28" width="108" height="72" rx="16" fill="#1e293b" stroke="#0f172a" stroke-width="3" />
  <rect x="42" y="36" width="44" height="34" rx="4" fill="#2563eb" />
  <rect x="46" y="40" width="36" height="26" fill="#0f172a" />
  <circle cx="26" cy="64" r="7" fill="#ef4444" />
  <circle cx="98" cy="58" r="4" fill="#eab308" />
  <circle cx="98" cy="70" r="4" fill="#22c55e" />
</svg>
<svg :elseif="['TGFX16', 'TGFX16-CD'].includes(id)" viewBox="0 0 128 128" :class="className" aria-label="TurboGrafx Console">
  <rect x="16" y="24" width="96" height="80" rx="8" fill="#d97706" stroke="#78350f" stroke-width="3" />
  <rect x="28" y="32" width="72" height="32" rx="4" fill="#78350f" />
  <text x="64" y="52" font-size="14" font-weight="bold" fill="#fef3c7" text-anchor="middle">
    TURBO
  </text>
</svg>
<svg :elseif="['NEOGEO', 'NEOGEO-CD'].includes(id)" viewBox="0 0 128 128" :class="className" aria-label="Neo Geo Console">
  <!-- Main Charcoal Console Chassis -->
  <rect x="10" y="20" width="108" height="88" rx="6" fill="#26272b" stroke="#141518" stroke-width="3" />

  <!-- Top Ventilation Ridge & Inset -->
  <path d="M10 20h108v16H10z" fill="#1d1e22" />
  <path d="M22 20v16M26 20v16M30 20v16M98 20v16M102 20v16M106 20v16" stroke="#141518" stroke-width="1.5" />
  <!-- Horizontal Vent Lines -->
  <line x1="38" y1="25" x2="90" y2="25" stroke="#141518" stroke-width="1.5" />
  <line x1="38" y1="28" x2="90" y2="28" stroke="#141518" stroke-width="1.5" />
  <line x1="38" y1="31" x2="90" y2="31" stroke="#141518" stroke-width="1.5" />

  <!-- Top-Left SNK Logo -->
  <text x="14" y="32" font-size="7" font-weight="900" fill="#ffffff" letter-spacing="0.5">
    SNK
  </text>

  <!-- Central Cartridge Slot Recess -->
  <rect x="22" y="42" width="84" height="24" rx="4" fill="#18191c" stroke="#101113" stroke-width="1.5" />
  <rect x="28" y="48" width="72" height="12" rx="2" fill="#0d0e10" />
  <line x1="28" y1="54" x2="100" y2="54" stroke="#26272b" stroke-width="1" />

  <!-- Bottom Left Joystick Recess & Buttons -->
  <ellipse cx="26" cy="80" rx="10" ry="12" fill="#1c1d20" stroke="#141518" stroke-width="1" />
  <circle cx="26" cy="78" r="4.5" fill="#121315" stroke="#333438" stroke-width="1" />
  <text x="26" y="96" font-size="3" font-weight="700" fill="#94a3b8" text-anchor="middle">
    RESET
  </text>

  <!-- Center Gold Typography Badge -->
  <text x="64" y="77" font-size="9" font-weight="900" fill="#eab308" text-anchor="middle" letter-spacing="0.5">
    NEO·GEO
  </text>
  <text x="64" y="83" font-size="3.5" font-weight="800" fill="#ca8a04" text-anchor="middle" letter-spacing="0.4">
    MAX 330 MEGA
  </text>
  <text x="64" y="88" font-size="3" font-weight="700" fill="#ca8a04" text-anchor="middle" letter-spacing="0.3">
    PRO-GEAR SPEC
  </text>
  <text x="64" y="93" font-size="2.6" font-weight="600" fill="#a16207" text-anchor="middle" letter-spacing="0.2">
    ADVANCED ENTERTAINMENT SYSTEM
  </text>

  <!-- Bottom Right Memory Card In Slot Indicator -->
  <polygon points="98,90 102,90 100,93" fill="#cbd5e1" />
  <text x="100" y="88" font-size="2.6" font-weight="700" fill="#94a3b8" text-anchor="middle">
    CARD IN
  </text>
</svg>
<svg :elseif="['ATARI2600', 'ATARI5200', 'ATARI7800', 'ATARILYNX'].includes(id)" viewBox="0 0 128 128" :class="className" aria-label="Atari Console">
  <rect x="12" y="28" width="104" height="72" rx="8" fill="#ea580c" stroke="#9a3412" stroke-width="3" />
  <rect x="12" y="60" width="104" height="16" fill="#78350f" />
  <path d="M64 36v32M48 68c0-16 8-24 16-24s16 8 16 24" fill="none" stroke="#fff" stroke-width="5" />
</svg>
<svg :elseif="['WONDERSWAN', 'WONDERSWANCOLOR'].includes(id)" viewBox="0 0 128 128" :class="className" aria-label="WonderSwan Console">
  <rect x="20" y="24" width="88" height="80" rx="14" fill="#06b6d4" stroke="#155e75" stroke-width="3" />
  <rect x="34" y="32" width="60" height="36" rx="4" fill="#155e75" />
  <circle cx="34" cy="82" r="4" fill="#fff" />
  <circle cx="46" cy="82" r="4" fill="#fff" />
  <circle cx="82" cy="82" r="4" fill="#fff" />
</svg>
<svg :else viewBox="0 0 128 128" :class="className" aria-label="Retro Console">
  <rect x="16" y="28" width="96" height="72" rx="10" fill="var(--surface-3)" stroke="var(--border)" stroke-width="3" />
  <circle cx="44" cy="64" r="10" fill="var(--icon-pad-mark)" />
  <circle cx="80" cy="58" r="6" fill="#ef4444" />
  <circle cx="88" cy="70" r="6" fill="#3b82f6" />
</svg>
`,Jc={},Xc="components/SystemLogo.html";let co;co=new q(Zc,{modules:Jc,filename:Xc});const _t=co,Qc=`<!-- The welcome panel's four capability drawings, by \`kind\`: hash, grouping, covers, consolidate. -->
<script :setup="{ kind = &quot;hash&quot;, className = &quot;&quot; }"><\/script>

<svg :if="kind === 'hash'"
  :class="className || 'card-illustration'"
  viewBox="0 0 240 120"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-label="Hash Identification"
>
  <!-- Chip pins -->
  <path d="M33 34h12M33 46h12M33 58h12M33 70h12M33 82h12" stroke="var(--text-faint)" stroke-width="2.5" stroke-linecap="round" />
  <path d="M130 34h12M130 46h12M130 58h12M130 70h12M130 82h12" stroke="var(--text-faint)" stroke-width="2.5" stroke-linecap="round" />

  <!-- Main Chip body -->
  <rect x="45" y="20" width="85" height="76" rx="8" fill="#1e293b" stroke="var(--border-strong)" stroke-width="2" />
  
  <!-- Chip center circuit symbol -->
  <rect x="61" y="38" width="53" height="40" rx="4" fill="#0f172a" stroke="var(--accent)" stroke-width="1.8" />
  <text x="87" y="63" fill="var(--accent)" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle">
    SHA1
  </text>

  <!-- Binary datastream / hash lines on right -->
  <rect x="148" y="32" width="70" height="8" rx="4" fill="var(--accent)" opacity="0.85" />
  <rect x="148" y="48" width="52" height="7" rx="3.5" fill="var(--text-dim)" opacity="0.6" />
  <rect x="148" y="62" width="62" height="7" rx="3.5" fill="var(--text-dim)" opacity="0.6" />
  <rect x="148" y="76" width="40" height="7" rx="3.5" fill="var(--text-dim)" opacity="0.4" />

  <!-- Verification checkmark badge -->
  <circle cx="205" cy="80" r="18" fill="var(--ok)" stroke="var(--surface)" stroke-width="3" />
  <path d="M196 80l6 6 12-12" stroke="var(--ok-on)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
</svg>
<svg :elseif="kind === 'grouping'"
  :class="className || 'card-illustration'"
  viewBox="0 0 240 120"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-label="ROM Grouping"
>
  <!-- Main Parent Game Card -->
  <rect x="18" y="20" width="85" height="76" rx="8" fill="var(--surface)" stroke="var(--accent)" stroke-width="2.2" />
  <!-- Game title placeholder lines -->
  <rect x="28" y="32" width="65" height="8" rx="4" fill="var(--text)" />
  <rect x="28" y="46" width="45" height="6" rx="3" fill="var(--text-dim)" />
  
  <!-- Grouping tag pill inside parent -->
  <rect x="28" y="64" width="52" height="18" rx="9" fill="var(--accent-soft)" />
  <text x="54" y="76" fill="var(--accent-ink)" font-family="sans-serif" font-size="9" font-weight="bold" text-anchor="middle">
    GAME
  </text>

  <!-- Connecting tree curves -->
  <path d="M103 58 C 128 58, 125 28, 146 28" stroke="var(--accent)" stroke-width="2.2" fill="none" stroke-dasharray="4 4" />
  <path d="M103 58 L 146 58" stroke="var(--accent)" stroke-width="2.2" fill="none" />
  <path d="M103 58 C 128 58, 125 88, 146 88" stroke="var(--accent)" stroke-width="2.2" fill="none" stroke-dasharray="4 4" />

  <!-- Variant Pills (EU, US, JP) -->
  <!-- EU Variant -->
  <g transform="translate(146, 16)">
    <rect x="0" y="0" width="76" height="24" rx="12" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.5" />
    <rect x="8" y="5" width="24" height="14" rx="7" fill="#3b82f6" />
    <text x="20" y="15" fill="#ffffff" font-family="sans-serif" font-size="8.5" font-weight="bold" text-anchor="middle">EU</text>
    <rect x="38" y="10" width="28" height="4" rx="2" fill="var(--text-dim)" />
  </g>

  <!-- US Variant -->
  <g transform="translate(146, 46)">
    <rect x="0" y="0" width="76" height="24" rx="12" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.5" />
    <rect x="8" y="5" width="24" height="14" rx="7" fill="#ef4444" />
    <text x="20" y="15" fill="#ffffff" font-family="sans-serif" font-size="8.5" font-weight="bold" text-anchor="middle">US</text>
    <rect x="38" y="10" width="28" height="4" rx="2" fill="var(--text-dim)" />
  </g>

  <!-- JP Variant -->
  <g transform="translate(146, 76)">
    <rect x="0" y="0" width="76" height="24" rx="12" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.5" />
    <rect x="8" y="5" width="24" height="14" rx="7" fill="#10b981" />
    <text x="20" y="15" fill="#ffffff" font-family="sans-serif" font-size="8.5" font-weight="bold" text-anchor="middle">JP</text>
    <rect x="38" y="10" width="28" height="4" rx="2" fill="var(--text-dim)" />
  </g>
</svg>
<svg :elseif="kind === 'covers'"
  :class="className || 'card-illustration'"
  viewBox="0 0 240 120"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-label="Cover Art"
>
  <!-- Secondary background cover (stacked behind) -->
  <g transform="translate(45, 20) rotate(-10)">
    <rect x="0" y="0" width="58" height="82" rx="5" fill="#334155" stroke="var(--border-strong)" stroke-width="1.8" />
    <path d="M0 35 L58 20 L58 82 L0 82 Z" fill="#475569" opacity="0.4" />
  </g>

  <!-- Main Front Cover Card -->
  <g transform="translate(86, 12)">
    <rect x="0" y="0" width="68" height="94" rx="6" fill="#1e293b" stroke="var(--accent)" stroke-width="2.4" />
    <!-- Cover Art Artwork Header -->
    <path d="M0 5 C0 2.2 2.2 0 5 0 L63 0 C65.8 0 68 2.2 68 5 L68 56 L0 56 Z" fill="url(#cover-art-grad-large)" />

    <defs>
      <linearGradient id="cover-art-grad-large" x1="0" y1="0" x2="68" y2="56" gradientUnits="userSpaceOnUse">
        <stop stop-color="#6366f1" />
        <stop offset="1" stop-color="#ec4899" />
      </linearGradient>
    </defs>

    <!-- Sun & mountains graphic inside cover art -->
    <circle cx="50" cy="20" r="7" fill="#fbbf24" opacity="0.9" />
    <path d="M8 52 L24 28 L38 42 L52 30 L68 52 Z" fill="#0f172a" opacity="0.65" />

    <!-- Cover Title Box -->
    <rect x="8" y="64" width="52" height="7" rx="3.5" fill="#ffffff" opacity="0.9" />
    <rect x="8" y="77" width="32" height="5" rx="2.5" fill="var(--text-dim)" opacity="0.6" />

    <!-- Region badge overlay on cover -->
    <rect x="44" y="75" width="18" height="11" rx="3" fill="var(--accent)" />
    <text x="53" y="83.5" fill="var(--accent-on)" font-family="sans-serif" font-size="7" font-weight="bold" text-anchor="middle">
      EU
    </text>
  </g>

  <!-- Libretro thumbnail sync badge -->
  <g transform="translate(170, 34)">
    <circle cx="22" cy="22" r="22" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="2" />
    <!-- Photo Image Icon -->
    <rect x="10" y="12" width="24" height="19" rx="3" stroke="var(--accent)" stroke-width="2" fill="none" />
    <circle cx="16" cy="18" r="2" fill="var(--accent)" />
    <path d="M10 27 L17 20 L22 25 L27 21 L34 27" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </g>
</svg>
<svg :elseif="kind === 'consolidate'"
  :class="className || 'card-illustration'"
  viewBox="0 0 240 120"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-label="Canonical Organization"
>
  <!-- Raw files stack (left side) -->
  <g transform="translate(16, 20)">
    <rect x="0" y="0" width="64" height="18" rx="4" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.2" />
    <text x="7" y="12" fill="var(--text-faint)" font-family="monospace" font-size="7.5">game_v1.zip</text>

    <rect x="0" y="26" width="64" height="18" rx="4" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.2" />
    <text x="7" y="38" fill="var(--text-faint)" font-family="monospace" font-size="7.5">game_us.bin</text>

    <rect x="0" y="52" width="64" height="18" rx="4" fill="var(--surface)" stroke="var(--border-strong)" stroke-width="1.2" />
    <text x="7" y="64" fill="var(--text-faint)" font-family="monospace" font-size="7.5">game_jp.rom</text>
  </g>

  <!-- Organization Arrow in Center -->
  <g transform="translate(92, 42)">
    <circle cx="16" cy="12" r="18" fill="var(--accent-soft)" />
    <path d="M7 12 H25 M20 7 L25 12 L20 17" stroke="var(--accent-ink)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
  </g>

  <!-- Clean Organized Folder (right side) -->
  <g transform="translate(144, 15)">
    <!-- Main Folder tab -->
    <path d="M0 5 C0 2.2 2.2 0 5 0 L26 0 C28.5 0 30.5 1.5 31.8 3.5 L35 8 L63 8 C65.8 8 68 10.2 68 13 L68 75 C68 77.8 65.8 80 63 80 L5 80 C2.2 80 0 77.8 0 75 Z" fill="#fbbf24" opacity="0.9" />

    <!-- Organized items inside folder -->
    <rect x="8" y="18" width="52" height="14" rx="3" fill="var(--surface)" />
    <rect x="14" y="23" width="30" height="4" rx="2" fill="var(--text)" />
    <rect x="48" y="22" width="9" height="6" rx="2.5" fill="#3b82f6" />

    <rect x="8" y="37" width="52" height="14" rx="3" fill="var(--surface)" />
    <rect x="14" y="42" width="30" height="4" rx="2" fill="var(--text)" />
    <rect x="48" y="41" width="9" height="6" rx="2.5" fill="#ef4444" />

    <rect x="8" y="56" width="52" height="14" rx="3" fill="var(--surface)" />
    <rect x="14" y="61" width="30" height="4" rx="2" fill="var(--text)" />
    <rect x="48" y="60" width="9" height="6" rx="2.5" fill="#10b981" />
  </g>
</svg>
`,ed={},td="components/WelcomeIllustration.html";let ho;ho=new q(Qc,{modules:ed,filename:td});const nd=ho,gn={NES:{id:"NES",name:"NES / Famicom",fullName:"Nintendo Entertainment System",manufacturer:"Nintendo",releaseYear:1983,media:"cartridge",description:"The 8-bit third-generation home console that revitalized the video game industry with legendary titles like Super Mario Bros., The Legend of Zelda, and Metroid.",commonExtensions:["nes","fds","unf","unif"],accentColor:"#e60012"},SNES:{id:"SNES",name:"Super Nintendo",fullName:"Super Nintendo Entertainment System",manufacturer:"Nintendo",releaseYear:1990,media:"cartridge",description:"Nintendo’s iconic 16-bit console celebrated for Mode 7 graphics, custom sound chips, and classic franchises like Super Mario World, Chrono Trigger, and Super Metroid.",commonExtensions:["sfc","smc","fig","swc"],accentColor:"#8b5cf6"},GAMEBOY:{id:"GAMEBOY",name:"Game Boy",fullName:"Nintendo Game Boy",manufacturer:"Nintendo",releaseYear:1989,media:"cartridge",description:"The groundbreaking monochrome handheld system that dominated portable gaming with exceptional battery life and games like Tetris and Pokémon Red/Blue.",commonExtensions:["gb"],accentColor:"#8bac0f"},GBC:{id:"GBC",name:"Game Boy Color",fullName:"Nintendo Game Boy Color",manufacturer:"Nintendo",releaseYear:1998,media:"cartridge",description:"The color evolution of the Game Boy featuring a color LCD screen, backwards compatibility, and titles like Pokémon Gold/Silver and Legend of Zelda: Oracle of Ages.",commonExtensions:["gbc"],accentColor:"#9333ea"},GBA:{id:"GBA",name:"Game Boy Advance",fullName:"Nintendo Game Boy Advance",manufacturer:"Nintendo",releaseYear:2001,media:"cartridge",description:"A powerful 32-bit handheld console delivering 2D arcade-quality graphics, home to games like Pokémon Ruby/Sapphire, Castlevania: Aria of Sorrow, and Golden Sun.",commonExtensions:["gba"],accentColor:"#3b82f6"},N64:{id:"N64",name:"Nintendo 64",fullName:"Nintendo 64",manufacturer:"Nintendo",releaseYear:1996,media:"cartridge",description:"Pioneered 3D gaming and analogue control with games like Super Mario 64, The Legend of Zelda: Ocarina of Time, GoldenEye 007, and Super Smash Bros.",commonExtensions:["z64","n64","v64"],accentColor:"#10b981"},PokemonMini:{id:"PokemonMini",name:"Pokémon Mini",fullName:"Nintendo Pokémon Mini",manufacturer:"Nintendo",releaseYear:2001,media:"cartridge",description:"The smallest cartridge-based handheld console ever produced by Nintendo, dedicated entirely to Pokémon themed mini-games.",commonExtensions:["min"],accentColor:"#f59e0b"},SMS:{id:"SMS",name:"Master System",fullName:"Sega Master System",manufacturer:"Sega",releaseYear:1985,media:"cartridge",description:"Sega’s 8-bit console that rivaled the NES with superior graphics hardware, popular for Alex Kidd, Phantasy Star, and Sonic the Hedgehog.",commonExtensions:["sms"],accentColor:"#0284c7"},GameGear:{id:"GameGear",name:"Game Gear",fullName:"Sega Game Gear",manufacturer:"Sega",releaseYear:1990,media:"cartridge",description:"Sega’s full-color backlit handheld console based on Master System architecture, featuring portable versions of Sonic, Shinobi, and Columns.",commonExtensions:["gg"],accentColor:"#2563eb"},MegaDrive:{id:"MegaDrive",name:"Mega Drive / Genesis",fullName:"Sega Mega Drive / Genesis",manufacturer:"Sega",releaseYear:1988,media:"cartridge",description:'Sega’s legendary 16-bit console defined by "Blast Processing", arcade ports, and classic games like Sonic the Hedgehog, Streets of Rage, and Gunstar Heroes.',commonExtensions:["md","gen","smd","bin"],accentColor:"#1e293b"},MegaCD:{id:"MegaCD",name:"Mega-CD / Sega CD",fullName:"Sega Mega-CD / Sega CD",manufacturer:"Sega",releaseYear:1991,media:"disc",description:"CD-ROM add-on for the Mega Drive introducing CD audio, full-motion video, and enhanced scaling graphics with games like Sonic CD and Snatcher.",commonExtensions:["cue","bin","iso","chd"],accentColor:"#475569"},S32X:{id:"S32X",name:"32X",fullName:"Sega 32X",manufacturer:"Sega",releaseYear:1994,media:"cartridge",description:"32-bit hardware expansion unit for the Mega Drive featuring twin RISC processors for 3D games like Virtua Fighter, Star Wars Arcade, and Knuckles’ Chaotix.",commonExtensions:["32x","bin"],accentColor:"#ef4444"},Saturn:{id:"Saturn",name:"Sega Saturn",fullName:"Sega Saturn",manufacturer:"Sega",releaseYear:1994,media:"disc",description:"Sega’s 32-bit dual-CPU console celebrated for unbeatable 2D arcade ports, innovative 3D titles, and classics like Panzer Dragoon, Nights into Dreams, and Virtua Fighter 2.",commonExtensions:["cue","bin","iso","chd"],accentColor:"#6366f1"},PSX:{id:"PSX",name:"PlayStation",fullName:"Sony PlayStation",manufacturer:"Sony",releaseYear:1994,media:"disc",description:"The landmark 32-bit console that revolutionized gaming with CD-ROM media, 3D graphics, and blockbusters like Final Fantasy VII, Metal Gear Solid, and Resident Evil.",commonExtensions:["cue","bin","iso","chd","pbp","m3u"],accentColor:"#00439c"},TGFX16:{id:"TGFX16",name:"TurboGrafx-16 / PC Engine",fullName:"NEC TurboGrafx-16 / PC Engine",manufacturer:"NEC",releaseYear:1987,media:"cartridge",description:"NEC and Hudson Soft’s sleek 16-bit graphics system using ultra-compact HuCard media, famous for shoot-’em-ups and games like Bonk’s Adventure and Splatterhouse.",commonExtensions:["pce","sgx"],accentColor:"#d97706"},"TGFX16-CD":{id:"TGFX16-CD",name:"TurboGrafx-CD / PC Engine CD",fullName:"NEC TurboGrafx-CD / PC Engine CD-ROM²",manufacturer:"NEC",releaseYear:1988,media:"disc",description:"The world’s first CD-ROM console add-on, legendary for redbook audio soundtracks, animated cutscenes, and masterpieces like Castlevania: Rondo of Blood.",commonExtensions:["cue","bin","iso","chd","toc"],accentColor:"#b45309"},NEOGEO:{id:"NEOGEO",name:"Neo Geo AES / MVS",fullName:"SNK Neo Geo Advanced Entertainment System",manufacturer:"SNK",releaseYear:1990,media:"cartridge",description:"The ultimate arcade hardware in the home, featuring massive gigabit cartridges and iconic fighting and action games like Metal Slug, King of Fighters, and Samurai Shodown.",commonExtensions:["neo","zip","7z"],accentColor:"#dc2626"},"NeoGeo-CD":{id:"NeoGeo-CD",name:"Neo Geo CD",fullName:"SNK Neo Geo CD",manufacturer:"SNK",releaseYear:1994,media:"disc",description:"CD-based home version of the Neo Geo arcade hardware offering arcade-perfect gameplay with orchestrated soundtracks.",commonExtensions:["cue","bin","iso","chd"],accentColor:"#991b1b"},Atari2600:{id:"Atari2600",name:"Atari 2600",fullName:"Atari 2600 Video Computer System",manufacturer:"Atari",releaseYear:1977,media:"cartridge",description:"The pioneer of microprocessor-based home consoles with interchangeable cartridges, home to classics like Pitfall!, Space Invaders, and Asteroids.",commonExtensions:["a26","bin"],accentColor:"#ea580c"},ATARI5200:{id:"ATARI5200",name:"Atari 5200",fullName:"Atari 5200 SuperSystem",manufacturer:"Atari",releaseYear:1982,media:"cartridge",description:"Atari’s second-generation console based on Atari 8-bit computer architecture, featuring arcade ports like Centipede, Pac-Man, and Defender.",commonExtensions:["a52","bin"],accentColor:"#c2410c"},ATARI7800:{id:"ATARI7800",name:"Atari 7800",fullName:"Atari 7800 ProSystem",manufacturer:"Atari",releaseYear:1986,media:"cartridge",description:"Designed with near-perfect arcade capability and full backwards compatibility with Atari 2600 cartridges.",commonExtensions:["a78","bin"],accentColor:"#9a3412"},AtariLynx:{id:"AtariLynx",name:"Atari Lynx",fullName:"Atari Lynx",manufacturer:"Atari",releaseYear:1989,media:"cartridge",description:"The world’s first handheld console with a color LCD screen, featuring hardware sprite scaling and ambidextrous flip control.",commonExtensions:["lnx","lyx"],accentColor:"#fb923c"},WonderSwan:{id:"WonderSwan",name:"WonderSwan",fullName:"Bandai WonderSwan",manufacturer:"Bandai",releaseYear:1999,media:"cartridge",description:"Gunpei Yokoi’s compact handheld console featuring portrait or landscape orientation, long battery life, and Japanese RPG classics.",commonExtensions:["ws"],accentColor:"#06b6d4"},WonderSwanColor:{id:"WonderSwanColor",name:"WonderSwan Color",fullName:"Bandai WonderSwan Color",manufacturer:"Bandai",releaseYear:2e3,media:"cartridge",description:"Color upgrade to the WonderSwan featuring a FSTN color screen and exclusive titles like Final Fantasy remakes and Klonoa.",commonExtensions:["wsc","ws"],accentColor:"#0891b2"}};function ad(e){if(!e)return;const t=e.indexOf("/")===-1?e:e.split("/")[0],n=Object.keys(gn).find(a=>a.toLowerCase()===t.toLowerCase());return n?gn[n]:void 0}function rd(){return Object.values(gn)}const Tn=Object.freeze(Object.defineProperty({__proto__:null,getAllSystemsInfo:rd,getSystemInfo:ad},Symbol.toStringTag,{value:"Module"})),od=`<!--
  The first screen, when no folder has ever been opened: what the app is, how it
  is used, the systems it knows, and the way in.

  Events: open-library, add-roms, open-folder. \`canOpenLibrary\` / \`canAddRoms\` /
  \`canOpenFolder\` say which ways in exist here (no folders on phones).
-->
<script :setup="{ canOpenLibrary = false, canAddRoms = false, canOpenFolder = false, loading = false }">const [BrandLogo, Icon, SystemLogo, WelcomeIllustration, { getAllSystemsInfo }, { t }] = await $importAll([
  "../components/BrandLogo.html",
  "../components/Icon.html",
  "../components/SystemLogo.html",
  "../components/WelcomeIllustration.html",
  "../helpers/system-info",
  "../lib/ui-state"
]);
const CAPABILITIES = ["hash", "grouping", "covers", "consolidate"];
const STEPS = ["step1", "step2", "step3"];
const TOP_ROW_IDS = ["GAMEBOY", "GBC", "GameGear", "SMS", "TGFX16", "Atari2600", "WonderSwan", "PokemonMini"];
const MIDDLE_ROW_IDS = ["NES", "SNES", "N64", "GBA", "MegaDrive", "PSX", "Saturn", "NEOGEO"];
const BOTTOM_ROW_IDS = ["MegaCD", "S32X", "TGFX16-CD", "NeoGeo-CD", "ATARI5200", "ATARI7800", "AtariLynx", "WonderSwanColor"];
const systems = getAllSystemsInfo();
const byId = new Map(systems.map((system) => [system.id, system]));
const pick = (ids) => ids.map((id) => byId.get(id)).filter(Boolean);
const assigned = /* @__PURE__ */ new Set([...TOP_ROW_IDS, ...MIDDLE_ROW_IDS, ...BOTTOM_ROW_IDS]);
const top = [...pick(TOP_ROW_IDS), ...systems.filter((system) => !assigned.has(system.id))];
const middle = pick(MIDDLE_ROW_IDS);
const bottom = pick(BOTTOM_ROW_IDS);
const rows = [
  { name: "top", track: [...top, ...top, ...top, ...top] },
  { name: "middle", track: [...middle, ...middle, ...middle, ...middle] },
  { name: "bottom", track: [...bottom, ...bottom, ...bottom, ...bottom] }
];
<\/script>

<div class="welcome">
  <section class="welcome-hero">
    <BrandLogo class-name="welcome-mark" />

    <div class="welcome-heading">
      <h2>{{ t('app.name') }}</h2>
      <p class="welcome-tagline">{{ t('welcome.tagline') }}</p>
    </div>

    <p class="welcome-pitch">{{ t('welcome.pitch') }}</p>

    <div :if="canOpenLibrary" class="welcome-actions">
      <button class="welcome-cta icon-label" @click="$emit('open-library')" :disabled="loading">
        <Icon name="library" />
        {{ t('welcome.library') }}
      </button>
      <button :if="canAddRoms" class="welcome-secondary icon-label" @click="$emit('add-roms')" :disabled="loading">
        <Icon name="upload" />
        {{ t('library.add') }}
      </button>
    </div>

    <button
      :if="canOpenFolder"
      :class="\`\${canOpenLibrary ? 'welcome-secondary' : 'welcome-cta'} icon-label\`"
      @click="$emit('open-folder')"
      :disabled="loading"
    >
      <Icon name="folder-plus" />
      {{ loading ? t('welcome.opening') : canOpenLibrary ? t('welcome.openFolder') : t('welcome.open') }}
    </button>

    <p class="welcome-hint">{{ canOpenLibrary ? t('welcome.libraryHint') : t('welcome.hint') }}</p>
  </section>

  <section class="welcome-section">
    <h3>{{ t('welcome.what.title') }}</h3>
    <ul class="welcome-cards">
      <li :each="capability in CAPABILITIES" :key="capability" class="welcome-card">
        <div class="welcome-card-illustration">
          <WelcomeIllustration :kind="capability" />
        </div>
        <h4>{{ t(\`welcome.what.\${capability}.title\`) }}</h4>
        <p>{{ t(\`welcome.what.\${capability}.body\`) }}</p>
      </li>
    </ul>
  </section>

  <section class="welcome-section">
    <h3>{{ t('welcome.how.title') }}</h3>
    <ol class="welcome-steps">
      <li :each="step, at in STEPS" :key="step" class="welcome-step">
        <span class="welcome-step-number" aria-hidden="true">{{ at + 1 }}</span>
        <div>
          <h4>{{ t(\`welcome.how.\${step}.title\`) }}</h4>
          <p>{{ t(\`welcome.how.\${step}.body\`) }}</p>
        </div>
      </li>
    </ol>
  </section>

  <section class="welcome-section welcome-systems-section">
    <h3>{{ t('welcome.systems.title') }}</h3>
    <p class="welcome-hint">{{ t('welcome.systems.hint', { count: systems.length }) }}</p>
    <div class="welcome-systems">
      <div :each="row in rows" :key="row.name" :class="\`welcome-systems-row welcome-systems-row--\${row.name}\`">
        <ul class="welcome-systems-track">
          <li :each="system, idx in row.track" :key="\`\${row.name}-\${system.id}-\${idx}\`" class="welcome-system" :title="system.fullName">
            <span class="welcome-system-logo">
              <SystemLogo :system-id="system.id" />
            </span>
            <span class="welcome-system-name">{{ system.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>

  <section class="welcome-note">
    <h3>{{ t('welcome.privacy.title') }}</h3>
    <p>{{ t('welcome.privacy.body') }}</p>
  </section>

  <footer class="welcome-footer">
    <p class="welcome-footer-legal">{{ t('welcome.footer.legal') }}</p>
    <a class="welcome-footer-github" href="https://github.com/wasm-gaming/rom-manager" target="_blank" rel="noopener noreferrer">
      <Icon name="github" />
      <span>{{ t('welcome.footer.github') }}</span>
    </a>
  </footer>
</div>
`,id={"../components/BrandLogo.html":Ur,"../components/Icon.html":ne,"../components/SystemLogo.html":_t,"../components/WelcomeIllustration.html":nd,"../helpers/system-info":Tn,"../lib/ui-state":ie},sd="views/WelcomePanel.html";let fo;fo=new q(od,{modules:id,filename:sd});const ld=fo,cd=`<!-- A folder with the console it holds as a badge: the mark of a system folder browsed as games. -->
<script :setup="{ systemId = &quot;&quot; }">const SystemLogo = await import("./SystemLogo.html");
<\/script>

<div class="system-folder-icon">
  <svg viewBox="0 0 24 24">
    <path d="M2.4 6.6a1.6 1.6 0 0 1 1.6-1.6h4.5c.44 0 .86.18 1.16.5l1.5 1.6H20a1.6 1.6 0 0 1 1.6 1.6v9.1a1.6 1.6 0 0 1-1.6 1.6H4a1.6 1.6 0 0 1-1.6-1.6z" fill="var(--icon-folder-back)" />
    <path d="M2.4 9.6h19.2v8.2a1.6 1.6 0 0 1-1.6 1.6H4a1.6 1.6 0 0 1-1.6-1.6z" fill="var(--icon-folder)" />
  </svg>
  <span class="system-folder-badge">
    <SystemLogo :system-id="systemId" />
  </span>
</div>
`,dd={"./SystemLogo.html":_t},hd="components/SystemFolderIcon.html";let mo;mo=new q(cd,{modules:dd,filename:hd});const fd=mo,md=`<!-- The tree's title and its toolbar. Emits \`create-folder\`, \`add-files\` and \`delete-selected\`. -->
<script :setup="{ busy = false, hasSelection = false, title = &quot;Library&quot;, labels = {} }">const Icon = await import("./Icon.html");
<\/script>

<div class="file-tree-header">
  <h3>{{ title }}</h3>
  <div class="file-tree-actions">
    <button @click="$emit('create-folder')" :disabled="busy" :title="labels.newFolder ?? 'New folder'">
      <Icon name="folder-plus" />
    </button>
    <button @click="$emit('add-files')" :disabled="busy" :title="labels.addFiles ?? 'Add files'">
      <Icon name="plus" />
    </button>
    <button @click="$emit('delete-selected')" :disabled="busy || !hasSelection" :title="labels.delete ?? 'Delete'">
      <Icon name="trash" />
    </button>
  </div>
</div>
`,ud={"./Icon.html":ne},pd="components/FileTreeHeader.html";let uo;uo=new q(md,{modules:ud,filename:pd});const gd=uo,vd=`<!--
  Every text comes from the parent (a component depends on helpers only); the
  defaults are English.
  A yes / no question in a modal dialog. Emits \`confirm\` and \`close\` (the dialog
  closed by any means: the ×, Cancel, Escape, a click on the backdrop).
-->
<script :setup="{ open = false, title = &quot;&quot;, message = &quot;&quot;, confirmLabel = &quot;Delete&quot;, cancelLabel = &quot;Cancel&quot;, closeLabel = &quot;Close&quot;, danger = true, busy = false }">const Icon = await import("./Icon.html");
const dialog = () => $self("dialog");
const sync = (isOpen) => {
  const element = dialog();
  if (!element) return;
  if (isOpen && !element.open) element.showModal();
  else if (!isOpen && element.open) element.close();
};
const dismiss = () => dialog()?.close();
const onBackdrop = (event) => {
  if (event.target === dialog() && !busy) dismiss();
};
$: sync(open);
await $mounted();
sync(open);
<\/script>

<dialog class="modal-dialog confirm-dialog" :aria-label="title" @close="$emit('close')" @click="onBackdrop">
  <header class="modal-header">
    <h3>{{ title }}</h3>
    <button type="button" class="modal-close" @click="dismiss" :disabled="busy" :title="closeLabel">
      <Icon name="close" />
    </button>
  </header>

  <div class="modal-content">
    <p class="modal-message">{{ message }}</p>
  </div>

  <div class="modal-actions">
    <button type="button" class="btn-cancel" @click="dismiss" :disabled="busy">
      {{ cancelLabel }}
    </button>
    <button type="button" :class="danger ? 'btn-danger' : 'btn-apply'" @click="$emit('confirm')" :disabled="busy">
      {{ confirmLabel }}
    </button>
  </div>
</dialog>
`,yd={"./Icon.html":ne},wd="components/ConfirmModal.html";let po;po=new q(vd,{modules:yd,filename:wd});const At=po,bd=`<!--
  Every text comes from the parent (a component depends on helpers only); the
  defaults are English.
  Asks for one line of text in a modal dialog. Emits \`submit\` with the trimmed
  value, and \`close\` when the dialog closes by any means.
-->
<script :setup="{ open = false, title = &quot;&quot;, message = &quot;&quot;, defaultValue = &quot;&quot;, placeholder = &quot;&quot;, submitLabel = &quot;Confirm&quot;, cancelLabel = &quot;Cancel&quot;, closeLabel = &quot;Close&quot;, busy = false }">const Icon = await import("./Icon.html");
let value = defaultValue;
const dialog = () => $self("dialog");
const sync = (isOpen) => {
  const element = dialog();
  if (!element) return;
  if (isOpen && !element.open) {
    value = defaultValue;
    element.showModal();
    setTimeout(() => {
      const input = $self(".prompt-input");
      input?.focus();
      input?.select();
    }, 50);
  } else if (!isOpen && element.open) {
    element.close();
  }
};
const dismiss = () => dialog()?.close();
const onBackdrop = (event) => {
  if (event.target === dialog() && !busy) dismiss();
};
const submit = () => {
  if (!value.trim() || busy) return;
  $emit("submit", value.trim());
};
$: if (open) value = defaultValue;
$: sync(open);
await $mounted();
sync(open);
<\/script>

<dialog class="modal-dialog prompt-dialog" :aria-label="title" @close="$emit('close')" @click="onBackdrop">
  <header class="modal-header">
    <h3>{{ title }}</h3>
    <button type="button" class="modal-close" @click="dismiss" :disabled="busy" :title="closeLabel">
      <Icon name="close" />
    </button>
  </header>

  <form class="modal-form" @submit.prevent="submit">
    <div class="modal-content">
      <p :if="message" class="modal-message">{{ message }}</p>
      <input
        type="text"
        class="prompt-input"
        :value="value"
        :placeholder="placeholder"
        @input="value = $event.target.value"
        :disabled="busy"
      />
    </div>

    <div class="modal-actions">
      <button type="button" class="btn-cancel" @click="dismiss" :disabled="busy">
        {{ cancelLabel }}
      </button>
      <button type="submit" class="btn-apply" :disabled="!value.trim() || busy">
        {{ submitLabel }}
      </button>
    </div>
  </form>
</dialog>
`,kd={"./Icon.html":ne},Sd="components/PromptModal.html";let go;go=new q(bd,{modules:kd,filename:Sd});const vo=go,yo="",xd="application/x-rom-manager-paths";function $d(e){const t=e.lastIndexOf("/");return t===-1?yo:e.slice(0,t)}function Od(e){return e.slice(e.lastIndexOf("/")+1)}function Md(e,t){return e?`${e}/${t}`:t}function Cd(e,t){return t===e||t.startsWith(`${e}/`)}function Ed(e){const t=JSON.parse(e);if(!Array.isArray(t)||t.some(n=>typeof n!="string"))throw new Error("Invalid drag payload");return t}function Rd(e){return e.startsWith(".")}function _d(e){const t=e.indexOf("/");return t===-1?e||void 0:e.slice(0,t)}const wo=Object.freeze(Object.defineProperty({__proto__:null,DRAG_MIME:xd,ROOT:yo,contains:Cd,isHiddenName:Rd,join:Md,nameOf:Od,parentOf:$d,parseDraggedPaths:Ed,systemOfPath:_d},Symbol.toStringTag,{value:"Module"})),Ad=new Set(["iso","cue","chd","gdi","nrg","mdf","ccd","pbp"]),Id=new Set(["sav","srm","state","st0","st1","st2","st3","st4","st5","mcr","mc"]),Pd=new Set(["zip","7z","rar","gz","tar"]),Nd=new Set(["png","jpg","jpeg","gif","webp","bmp","svg"]),Ld=new Set(["txt","json","xml","md","nfo","pdf","doc","dat"]);function zd(e){const t=e.split(".").pop()?.toLowerCase()||"";return Ad.has(t)?"disc":Id.has(t)?"memory-card":Pd.has(t)?"archive":Nd.has(t)?"image":Ld.has(t)?"document":"file"}const Td=Object.freeze(Object.defineProperty({__proto__:null,iconNameOf:zd},Symbol.toStringTag,{value:"Module"})),jd=`<!--
  The tree of an origin: folders and files, or — in a folder browsed grouped —
  one row per game, its files folded into it. Selection (click, shift, ctrl/cmd,
  the arrow keys), new folders, adding files, deleting, and moving by drag.

  Events:
    selection-change (paths)   game-change (game | undefined)
    folder-change (path | undefined)   visible-change (paths)
    removed (paths)   changed (paths written or moved, both ends)
    grouping-needed (path)   toggle-grouping (path)   organize (path)

  \`isInitialized\`, \`canGroup\` and \`isGrouped\` are questions the parent answers;
  \`groupedRows\` (a Map, folder → rows) is what grouping has produced so far.

  Thousands of rows: each row's marks (\`selected\`, \`active\`, \`drop\`) are in
  \`rowMarks\`, by the row's position, beside \`rows\` rather than in it — so a
  change of selection flips only the rows it changes, and what reads the list as
  a whole (the loop, \`visible-change\`) is not woken by it. What is marked lives
  in \`marks\` (a class instance: the store leaves it alone).
-->
<script
  :setup="{ node, selectedFiles = [], isInitialized = void 0, canGroup = void 0, isGrouped = void 0, groupedRows = void 0, canOrganize = false, notice = void 0, refreshToken = 0, labels = {} }">const [
  Icon,
  SystemFolderIcon,
  FileTreeHeader,
  ConfirmModal,
  PromptModal,
  { contains, DRAG_MIME, isHiddenName, join, nameOf, parentOf, parseDraggedPaths, ROOT, systemOfPath },
  { iconNameOf },
  { t }
] = await $importAll([
  "../components/Icon.html",
  "../components/SystemFolderIcon.html",
  "../components/FileTreeHeader.html",
  "../components/ConfirmModal.html",
  "../components/PromptModal.html",
  "../helpers/tree",
  "../helpers/file-icons",
  "../lib/ui-state"
]);
class Marks {
  selection = /* @__PURE__ */ new Set();
  game = void 0;
  active = /* @__PURE__ */ new Set();
  drop = void 0;
  anchor = void 0;
  /** The last game reported to the parent, so it hears each change once. */
  reported = void 0;
}
const marks = new Marks();
let children = /* @__PURE__ */ new Map();
let expanded = /* @__PURE__ */ new Set();
let rowMarks = [];
let selectionCount = 0;
let rootDrop = false;
let error = void 0;
let busy = false;
let createFolder = null;
let deleteConfirm = null;
const flagsOf = (row) => ({
  selected: row.path ? marks.selection.has(row.path) : marks.game === row.key,
  active: Boolean(row.path && marks.active.has(row.path)),
  drop: row.path !== void 0 && marks.drop === row.path
});
const rawRows = () => $toRaw(rows);
const remark = () => $batch(() => {
  const list = rawRows();
  const current = $toRaw(rowMarks);
  if (current.length !== list.length) {
    rowMarks = list.map(flagsOf);
  } else {
    list.forEach((row, index) => {
      const flags = flagsOf(row);
      const mark = current[index];
      if (mark.selected !== flags.selected) rowMarks[index].selected = flags.selected;
      if (mark.active !== flags.active) rowMarks[index].active = flags.active;
      if (mark.drop !== flags.drop) rowMarks[index].drop = flags.drop;
    });
  }
  selectionCount = marks.selection.size;
  rootDrop = marks.drop === ROOT;
});
const loadDirectory = async (path) => {
  const entries = await node.list(path);
  children = new Map(children).set(path, entries);
};
const refresh = async () => {
  const paths = Array.from(children.keys());
  const listings = await Promise.all(paths.map(async (path) => [path, await node.list(path)]));
  children = new Map(listings);
};
const run = async (operation) => {
  try {
    busy = true;
    error = void 0;
    await operation();
  } catch (err) {
    error = err instanceof Error ? err.message : "Operation failed";
  } finally {
    busy = false;
  }
};
$: entriesByPath = (() => {
  const map = /* @__PURE__ */ new Map();
  for (const entries of children.values()) for (const entry of entries) map.set(entry.path, entry);
  return map;
})();
$: rows = (() => {
  const result = [];
  const reading = labels.reading ?? "Reading games\\u2026";
  const push = (row) => result.push({ ...row, open: expanded.has(row.key) });
  const pushEntry = (entry, depth) => {
    push({
      key: entry.path,
      depth,
      label: entry.name,
      kind: entry.kind,
      path: entry.path,
      paths: [entry.path],
      entry,
      expandable: entry.kind === "directory"
    });
    if (entry.kind === "directory" && expanded.has(entry.path)) walk(entry.path, depth + 1);
  };
  const walk = (path, depth) => {
    const grouped = groupedRows?.get(path);
    if (!grouped) {
      if (isGrouped?.(path)) {
        push({ key: \`\${path}/\\u2026\`, depth, label: reading, kind: "pending", paths: [], expandable: false });
        return;
      }
      for (const entry of children.get(path) || []) pushEntry(entry, depth);
      return;
    }
    for (const wizard of grouped) {
      if (wizard.kind === "entry") {
        pushEntry(wizard.entry, depth);
      } else {
        const game = wizard.kind === "game" ? wizard.game : wizard;
        if (game) {
          push({
            key: \`\${path}:\${game.id || game.key}\`,
            depth,
            label: game.title,
            kind: "group",
            paths: game.paths,
            status: game.status,
            game,
            expandable: false
          });
        }
      }
    }
  };
  walk(ROOT, 0);
  return result;
})();
$: if (groupedRows) {
  for (const row of rows) {
    if (row.kind === "pending" && row.key.endsWith("/\\u2026")) $emit("grouping-needed", row.key.slice(0, -2));
  }
}
$: $emit("visible-change", rows.flatMap((row) => row.paths));
const markGameOfSelection = () => {
  if (marks.selection.size === 0) return;
  const row = rawRows().find((candidate) => candidate.kind === "group" && candidate.paths.some((p) => marks.selection.has(p)));
  if (row && row.game) {
    marks.game = row.key;
    if (row.game !== marks.reported) {
      marks.reported = row.game;
      $emit("game-change", row.game);
    }
  }
};
$: {
  void rows;
  queueMicrotask(() => {
    markGameOfSelection();
    rowMarks = rawRows().map(flagsOf);
    selectionCount = marks.selection.size;
  });
}
const selectPaths = (paths, game) => $batch(() => {
  marks.selection = paths;
  $emit("selection-change", Array.from(paths));
  if (game !== marks.reported) {
    marks.reported = game;
    $emit("game-change", game);
  }
  const folder = paths.size === 1 ? Array.from(paths)[0] : void 0;
  const directory = folder && entriesByPath.get(folder)?.kind === "directory" ? folder : void 0;
  $emit("folder-change", directory);
  markGameOfSelection();
  remark();
});
const revealDirectory = async (path) => {
  const parts = path.split("/");
  let current = "";
  for (const part of parts) {
    current = current ? \`\${current}/\${part}\` : part;
    if (!children.has(current)) await loadDirectory(current);
    if (!expanded.has(current)) expanded = new Set(expanded).add(current);
  }
};
const followSelectedFiles = (files) => {
  marks.active = new Set(files);
  const current = Array.from(marks.selection);
  const same = current.length === files.length && current.every((path, i) => path === files[i]);
  if (files.length > 0 && !same) {
    marks.selection = new Set(files);
    markGameOfSelection();
    for (const path of files) {
      const parent = parentOf(path);
      if (parent && parent !== ROOT) void revealDirectory(parent);
    }
  }
  remark();
};
$: {
  const files = selectedFiles ? Array.from(selectedFiles) : [];
  queueMicrotask(() => followSelectedFiles(files));
}
const toggleDirectory = async (path) => {
  if (expanded.has(path)) {
    const next = new Set(expanded);
    next.delete(path);
    expanded = next;
    return;
  }
  if (!children.has(path)) await loadDirectory(path);
  expanded = new Set(expanded).add(path);
};
const isSelected = (row) => row.path ? marks.selection.has(row.path) : marks.game === row.key;
const selectRow = (row) => {
  $batch(() => {
    marks.game = row.kind === "group" ? row.key : void 0;
    if (row.kind === "group") {
      marks.anchor = row.paths[0];
      selectPaths(new Set(row.paths), row.game);
    } else if (row.path) {
      marks.anchor = row.path;
      selectPaths(/* @__PURE__ */ new Set([row.path]));
    }
  });
  requestAnimationFrame(() => $self(".tree-item.selected")?.scrollIntoView({ block: "nearest" }));
};
const onKeyDown = (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  const active = document.activeElement;
  if (active) {
    const tag = active.tagName.toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select" || active.isContentEditable) return;
  }
  if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
  const list = rawRows();
  if (list.length === 0) return;
  const index = list.findIndex(isSelected);
  event.preventDefault();
  if (index === -1) {
    selectRow(list[0]);
    return;
  }
  const row = list[index];
  if (event.key === "ArrowUp") {
    if (index > 0) selectRow(list[index - 1]);
  } else if (event.key === "ArrowDown") {
    if (index < list.length - 1) selectRow(list[index + 1]);
  } else if (event.key === "ArrowLeft") {
    if (row.kind === "directory" && row.path) {
      if (expanded.has(row.path)) void toggleDirectory(row.path);
    } else {
      for (let i = index - 1; i >= 0; i--) {
        if (list[i].kind === "directory" && list[i].depth < row.depth) {
          selectRow(list[i]);
          break;
        }
      }
    }
  } else if (event.key === "ArrowRight") {
    if (row.kind === "directory" && row.path && !expanded.has(row.path)) void revealDirectory(row.path);
  }
};
window.addEventListener("keydown", onKeyDown);
$destroyed(() => window.removeEventListener("keydown", onKeyDown));
const targetDirectory = () => {
  const [path] = Array.from(marks.selection);
  if (!path) return ROOT;
  return entriesByPath.get(path)?.kind === "directory" ? path : parentOf(path);
};
const onRowClick = (event, row) => $batch(() => {
  marks.game = row.kind === "group" ? row.key : void 0;
  if (row.kind === "group") {
    marks.anchor = row.paths[0];
    selectPaths(new Set(row.paths), row.game);
    return;
  }
  if (!row.path) return;
  const paths = rawRows().flatMap((candidate) => candidate.path ? [candidate.path] : []);
  const anchor = marks.anchor;
  if (event.shiftKey && anchor && paths.includes(anchor) && paths.includes(row.path)) {
    const from = paths.indexOf(anchor);
    const to = paths.indexOf(row.path);
    selectPaths(new Set(paths.slice(Math.min(from, to), Math.max(from, to) + 1)));
    return;
  }
  if (event.metaKey || event.ctrlKey) {
    const next = new Set(marks.selection);
    if (next.has(row.path)) next.delete(row.path);
    else next.add(row.path);
    marks.anchor = row.path;
    selectPaths(next);
    return;
  }
  marks.anchor = row.path;
  selectPaths(/* @__PURE__ */ new Set([row.path]));
});
const onCaretClick = (row) => {
  if (row.expandable && row.path) void toggleDirectory(row.path);
};
const onCreateFolder = () => {
  if (!node.createDirectory) return;
  createFolder = { suggested: join(targetDirectory(), "new-folder") };
};
const confirmCreateFolder = (name) => {
  createFolder = null;
  void run(async () => {
    await node.createDirectory?.(name);
    await revealDirectory(name);
    await refresh();
    selectPaths(/* @__PURE__ */ new Set([name]));
  });
};
const addFiles = async (files, destination) => {
  if (!node.writeFile && !node.write) return;
  await run(async () => {
    const written = [];
    for (const file of Array.from(files)) {
      const path = join(destination, file.name);
      const bytes = new Uint8Array(await file.arrayBuffer());
      if (node.writeFile) await node.writeFile(path, bytes);
      else if (node.write) await node.write(path, bytes.buffer);
      written.push(path);
    }
    await revealDirectory(destination);
    await refresh();
    if (written.length > 0) selectPaths(new Set(written));
    $emit("changed", written);
  });
};
const onFilesPicked = (event) => {
  const input = event.currentTarget;
  if (input.files && input.files.length > 0) void addFiles(input.files, targetDirectory());
  input.value = "";
};
const onDeleteSelected = () => {
  if (marks.selection.size === 0 || !node.remove && !node.delete) return;
  deleteConfirm = { paths: Array.from(marks.selection) };
};
const confirmDelete = () => {
  if (!deleteConfirm) return;
  const paths = deleteConfirm.paths;
  deleteConfirm = null;
  void run(async () => {
    for (const path of paths) {
      if (node.remove) await node.remove(path);
      else if (node.delete) await node.delete(path);
    }
    $emit("removed", paths);
    selectPaths(/* @__PURE__ */ new Set());
    await refresh();
  });
};
const moveInto = async (directory, paths) => {
  if (!node.move) return;
  const valid = paths.filter((path) => !contains(path, directory));
  if (valid.length === 0) return;
  await run(async () => {
    const moved = [];
    for (const path of valid) {
      const destination = join(directory, nameOf(path));
      await node.move?.(path, destination);
      moved.push(destination);
    }
    $emit("changed", [...valid, ...moved]);
    await revealDirectory(directory);
    await refresh();
    selectPaths(new Set(moved));
  });
};
const onDragStart = (event, row) => {
  if (!event.dataTransfer) return;
  const held = row.paths.every((path) => marks.selection.has(path));
  const dragged = held ? Array.from(marks.selection) : row.paths;
  if (!held) selectPaths(new Set(row.paths), row.game);
  event.dataTransfer.setData(DRAG_MIME, JSON.stringify(dragged));
  event.dataTransfer.effectAllowed = "move";
};
const setDropTarget = (directory) => {
  if (marks.drop === directory) return;
  marks.drop = directory;
  remark();
};
const onDragOver = (event, directory) => {
  event.preventDefault();
  event.stopPropagation();
  if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
  setDropTarget(directory);
};
const onDrop = (event, directory) => {
  event.preventDefault();
  event.stopPropagation();
  setDropTarget(void 0);
  const dropped = event.dataTransfer?.files;
  if (dropped && dropped.length > 0) {
    void addFiles(dropped, directory);
    return;
  }
  const payload = event.dataTransfer?.getData(DRAG_MIME);
  if (!payload) return;
  try {
    void moveInto(directory, parseDraggedPaths(payload));
  } catch {
    error = "Invalid drag operation";
  }
};
$: statusLabels = {
  complete: labels.statusComplete ?? "Complete",
  partial: labels.statusPartial ?? "Partial",
  missing: labels.statusMissing ?? "Missing"
};
const rowIcon = (row) => {
  if (row.kind === "directory") {
    const systemId2 = row.path && isGrouped?.(row.path) ? systemOfPath(row.path || row.label) : void 0;
    return systemId2 ? { name: "system-folder", systemId: systemId2 } : { name: "folder", systemId: "" };
  }
  const systemId = row.paths[0] ? systemOfPath(row.paths[0]) : row.path ? systemOfPath(row.path) : void 0;
  if (row.kind === "group") return { name: "bundle", systemId };
  return { name: iconNameOf(row.label), systemId };
};
const rowClass = (row, index) => [
  "tree-item",
  row.kind,
  isHiddenName(row.label) ? "hidden-file" : "",
  row.status ? \`status-\${row.status}\` : "",
  rowMarks[index]?.selected ? "selected" : "",
  rowMarks[index]?.active ? "active" : "",
  rowMarks[index]?.drop ? "drop-target" : ""
].filter(Boolean).join(" ");
await $mounted();
loadDirectory(ROOT).catch((err) => {
  error = err instanceof Error ? err.message : "Failed to read directory";
});
$: if (refreshToken) queueMicrotask(() => refresh().catch(() => void 0));
<\/script>

<div class="file-tree">
  <FileTreeHeader
    :busy="busy"
    :has-selection="selectionCount > 0"
    :labels="{ newFolder: labels.collapseAll, addFiles: labels.expandAll, delete: labels.delete }"
    @create-folder="onCreateFolder()"
    @add-files="$self('.file-tree-input')?.click()"
    @delete-selected="onDeleteSelected()"
  />

  <input type="file" multiple class="file-tree-input" @change="onFilesPicked" />

  <div :if="error" class="file-tree-error">{{ error }}</div>
  <div :if="notice" class="file-tree-notice">{{ notice }}</div>

  <ul
    :class="\`file-tree-body \${rootDrop ? 'drop-target' : ''}\`"
    @dragover="onDragOver($event, ROOT)"
    @dragleave="setDropTarget(undefined)"
    @drop="onDrop($event, ROOT)"
  >
    <li
      :each="row in rows"
      :key="row.key"
      :class="rowClass(row, $index)"
      :style="\`padding-left: \${0.5 + row.depth * 0.6}rem\`"
      :draggable="row.paths.length > 0 ? 'true' : 'false'"
      @click="onRowClick($event, row)"
      @dragstart="onDragStart($event, row)"
      @dragover="row.kind === 'directory' ? onDragOver($event, row.path) : undefined"
      @drop="row.kind === 'directory' ? onDrop($event, row.path) : undefined"
    >
      <div class="tree-item-left" @click="onCaretClick(row)">
        <span :if="row.expandable" class="tree-caret" :title="row.open ? 'Collapse' : 'Expand'">
          <Icon name="chevron" :open="row.open" />
        </span>
        <span :else class="tree-caret"></span>

        <span class="tree-icon">
          <span :if="row.kind === 'pending'" class="tree-spinner"></span>
          <SystemFolderIcon :elseif="rowIcon(row).name === 'system-folder'" :system-id="rowIcon(row).systemId" />
          <Icon :else :name="rowIcon(row).name" :system-id="rowIcon(row).systemId" />
        </span>
        <span class="tree-name">{{ row.label }}</span>
      </div>

      <div class="tree-item-actions">
        <span :if="row.status && row.status !== 'complete'" class="tree-status" :title="statusLabels[row.status] ?? row.status">
          <Icon name="status" :status="row.status" />
        </span>

        <span :if="row.kind !== 'directory' && row.paths.some((path) => isInitialized?.(path))" class="tree-badge" title="Has library record">
          <Icon name="dot" />
        </span>

        <button
          :if="row.kind === 'directory' && canGroup?.(row.path)"
          :class="\`tree-group-toggle \${isGrouped?.(row.path) ? 'on' : ''}\`"
          @click.stop="$emit('toggle-grouping', row.path)"
          :title="isGrouped?.(row.path) ? 'Browsing grouped by game' : 'Browse grouped by game'"
        >
          <Icon name="group" />
        </button>

        <button
          :if="row.kind === 'directory' && canOrganize && canGroup?.(row.path)"
          class="tree-organize"
          @click.stop="$emit('organize', row.path)"
          title="Consolidate folder"
        >
          <Icon name="organize" />
        </button>
      </div>
    </li>

    <li :if="rows.length === 0 && children.has(ROOT)" class="tree-empty">Empty directory</li>
  </ul>

  <PromptModal
    :close-label="t('prefs.close')"
    :cancel-label="t('drop.cancel')"
    :submit-label="t('modal.confirm')"
    :if="createFolder"
    :open="true"
    :title="t('modal.createFolderTitle')"
    :message="t('tree.prompt.folderName')"
    :default-value="createFolder.suggested"
    @submit="confirmCreateFolder($event.detail)"
    @close="createFolder = null"
  />

  <ConfirmModal
    :close-label="t('prefs.close')"
    :cancel-label="t('drop.cancel')"
    :confirm-label="t('modal.delete')"
    :if="deleteConfirm"
    :open="true"
    :title="t('modal.deleteTitle')"
    :message="t('tree.confirm.delete', { count: deleteConfirm.paths.length })"
    :danger="true"
    @confirm="confirmDelete()"
    @close="deleteConfirm = null"
  />
</div>
`,Dd={"../components/Icon.html":ne,"../components/SystemFolderIcon.html":fd,"../components/FileTreeHeader.html":gd,"../components/ConfirmModal.html":At,"../components/PromptModal.html":vo,"../helpers/tree":wo,"../helpers/file-icons":Td,"../lib/ui-state":ie},Bd="views/FileTree.html";let bo;bo=new q(jd,{modules:Dd,filename:Bd});const Fd=bo,qd=`<!-- A folder picked in the tree: its system (when the folder is one), or a plain collection. -->
<script :setup="{ folder = &quot;&quot;, wizard = false }">const [SystemLogo, { getSystemInfo }, { t }] = await $importAll([
  "../components/SystemLogo.html",
  "../helpers/system-info",
  "../lib/ui-state"
]);
$: info = wizard ? getSystemInfo(folder) : void 0;
<\/script>

<div :if="!info" class="system-details generic">
  <div class="system-hero centered">
    <div class="system-logo-wrapper large">
      <SystemLogo system-id="generic" />
    </div>
    <div class="system-heading centered">
      <h2>{{ folder.slice(folder.lastIndexOf('/') + 1) || t('system.folder') }}</h2>
      <p class="metadata-subtitle">{{ t('system.collection') }}</p>
    </div>
  </div>
  <div class="facts">
    <div class="fact">
      <span class="fact-label">{{ t('system.path') }}</span>
      <span class="fact-value"><code>{{ folder }}</code></span>
    </div>
  </div>
</div>
<div :else class="system-details">
  <div class="system-hero centered">
    <div class="system-logo-wrapper large" :style="\`border-color: \${info.accentColor}\`">
      <SystemLogo :system-id="info.id" />
    </div>

    <div class="system-heading centered">
      <h2>{{ info.name }}</h2>
      <p class="system-fullname">{{ info.fullName }}</p>

      <div class="system-meta-tags centered">
        <span
          class="tag manufacturer"
          :style="\`background-color: \${info.accentColor}22; color: \${info.accentColor}; border-color: \${info.accentColor}55\`"
        >{{ info.manufacturer }}</span>
        <span class="tag year">{{ info.releaseYear }}</span>
        <span class="tag media">{{ info.media === 'disc' ? t('system.medium.disc') : t('system.medium.cartridge') }}</span>
      </div>
    </div>
  </div>

  <div class="system-description-box">
    <h4>{{ t('system.about') }}</h4>
    <p class="system-description">{{ info.description }}</p>
  </div>

  <div class="system-extensions-box">
    <h4>{{ t('system.extensions') }}</h4>
    <div class="system-extensions-list">
      <span :each="ext in info.commonExtensions" :key="ext" class="extension-pill"><code>.{{ ext }}</code></span>
    </div>
  </div>

  <div class="facts">
    <div class="fact">
      <span class="fact-label">{{ t('system.key') }}</span>
      <span class="fact-value"><code>{{ info.id }}</code></span>
    </div>
    <div class="fact">
      <span class="fact-label">{{ t('system.structure.label') }}</span>
      <span class="fact-value">{{ info.media === 'disc' ? t('system.structure.disc') : t('system.structure.cartridge') }}</span>
    </div>
    <div class="fact">
      <span class="fact-label">{{ t('system.folder') }}</span>
      <span class="fact-value"><code>{{ folder }}</code></span>
    </div>
  </div>
</div>
`,Gd={"../components/SystemLogo.html":_t,"../helpers/system-info":Tn,"../lib/ui-state":ie},Ud="views/SystemDetails.html";let ko;ko=new q(qd,{modules:Gd,filename:Ud});const Wd=ko,Hd=["Asia","Australia","Austria","Belgium","Brazil","Canada","China","Croatia","Denmark","Europe","Finland","France","Germany","Greece","Hong Kong","India","Ireland","Israel","Italy","Japan","Korea","Mexico","Netherlands","Norway","Peru","Poland","Portugal","Russia","South Africa","Spain","Sweden","Switzerland","Taiwan","Turkey","United Kingdom","USA"],Vd=["NTSC","PAL","PAL, NTSC","SECAM"];class _e{static instance;metadataCache=new Map;constructor(){}static getInstance(){return _e.instance||(_e.instance=new _e),_e.instance}getROMFormat(t){const n=t.split(".").pop()?.toLowerCase()||"";return{nes:"NES",smc:"SNES",sfc:"SNES",gen:"Genesis",md:"Genesis",bin:"Genesis",gb:"Game Boy",gba:"Game Boy Advance",z64:"Nintendo 64",n64:"Nintendo 64",gbc:"Game Boy Color"}[n]||n.toUpperCase()}parseMetadata(t,n){return{filename:t,path:"",format:this.getROMFormat(t),fileSize:n,lastModified:new Date}}getMetadata(t){return this.metadataCache.get(t)}setMetadata(t,n){this.metadataCache.set(t,n)}updateMetadata(t,n){const r={...this.metadataCache.get(t)||{filename:t,path:t,format:"",fileSize:0},...n};return this.metadataCache.set(t,r),r}clearCache(){this.metadataCache.clear()}}const Kd=_e.getInstance(),So=Object.freeze(Object.defineProperty({__proto__:null,ROMMetadataService:_e,ROM_REGIONS:Hd,VIDEO_STANDARDS:Vd,romMetadataService:Kd},Symbol.toStringTag,{value:"Module"})),xo=["case","background","title","snap","logo"],It="case";function $o(e){return xo.includes(e)}const jn="global",Yd=[...Ta,jn];function Zd(e){return e===jn?void 0:e}const Dn=["png","jpg","jpeg","webp","gif","avif"];function Bn(e){const t=(e??"").split(/[?#]/)[0].split("/").pop()??"",n=t.lastIndexOf("."),a=n===-1?"":t.slice(n+1).toLowerCase();return Dn.includes(a)?a:void 0}function Jd(e){return Bn(e)!==void 0}function Pt(e,t){const n=t.region?`.${t.region}`:"";return`${e}${n}.${t.kind}.${t.extension??"png"}`}function Oo(e){const t=e.split(".");if(t.length<3)return;const n=t.pop().toLowerCase();if(!Dn.includes(n))return;const a=t.pop();if(!$o(a))return;const r=t.length>1&&vn(t[t.length-1])?t.pop():void 0,i=t.join(".");return i.length>0?{gameId:i,kind:a,region:r,extension:n}:void 0}const Fn=Object.freeze(Object.defineProperty({__proto__:null,COVER_KIND:It,GLOBAL_SCOPE:jn,IMAGE_EXTENSIONS:Dn,MEDIA_KINDS:xo,MEDIA_SCOPES:Yd,imageExtensionOf:Bn,isImageName:Jd,isMediaKind:$o,mediaFileNameOf:Pt,parseMediaName:Oo,regionOfScope:Zd},Symbol.toStringTag,{value:"Module"})),Xd=`<!--
  One file's record, edited: the cover (dropped, picked or removed), the text
  fields, and a lookup in the catalogue by checksum (CRC32, then MD5, then SHA-1)
  whose results are offered field by field.

  \`onSave(record, coverFile?, coverRemoved?)\` is awaited (it may fail with a
  message to show); \`loadContent()\` reads the ROM, only when a checksum needs it.
  Events: cancel.
-->
<script :setup="{ romPath = &quot;&quot;, record, coverUrl = void 0, loadContent, canChecksum = true, onSave }">const [Icon, { ROM_REGIONS, VIDEO_STANDARDS }, { gameNameOf, systemOf }, { ROMDatasetService }, { calculateCRC32, calculateMD5, calculateSHA1 }, { isImageName }, { t }] = await $importAll([
  "../components/Icon.html",
  "../lib/ROMMetadataService",
  "../lib/RomLibraryService",
  "../lib/ROMDatasetService",
  "../lib/ChecksumService",
  "../helpers/rom-media",
  "../lib/ui-state"
]);
const LOOKUP_FIELDS = ["title", "description", "region", "videoStandard", "cover"];
let draft = { ...record };
let saving = false;
let busy = false;
let lookupPhase = "idle";
let lookupResult = null;
let selectedFields = /* @__PURE__ */ new Set();
let error = null;
let pendingCoverFile = void 0;
let pendingCoverUrl = void 0;
let coverRemoved = false;
let isCoverDragging = false;
$destroyed(() => {
  if (pendingCoverUrl) URL.revokeObjectURL(pendingCoverUrl);
});
$: activeCoverUrl = coverRemoved ? void 0 : pendingCoverUrl || (draft.cover?.startsWith("https://") ? draft.cover : coverUrl);
const update = (field, value) => {
  draft = { ...draft, [field]: value };
};
const onCoverFile = (file) => {
  if (!file.type.startsWith("image/") && !isImageName(file.name)) return;
  if (pendingCoverUrl) URL.revokeObjectURL(pendingCoverUrl);
  pendingCoverFile = file;
  pendingCoverUrl = URL.createObjectURL(file);
  coverRemoved = false;
};
const removeCover = () => {
  if (pendingCoverUrl) URL.revokeObjectURL(pendingCoverUrl);
  pendingCoverFile = void 0;
  pendingCoverUrl = void 0;
  coverRemoved = true;
  draft = { ...draft, cover: void 0 };
};
const onCoverDragOver = (event) => {
  event.preventDefault();
  event.stopPropagation();
  isCoverDragging = true;
};
const onCoverDragLeave = (event) => {
  event.preventDefault();
  event.stopPropagation();
  isCoverDragging = false;
};
const onCoverDrop = (event) => {
  event.preventDefault();
  event.stopPropagation();
  isCoverDragging = false;
  const files = Array.from(event.dataTransfer?.files ?? []);
  const image = files.find((f) => f.type.startsWith("image/") || isImageName(f.name));
  if (image) onCoverFile(image);
};
const onFilePicked = (event) => {
  const files = event.currentTarget.files;
  if (files && files.length > 0) onCoverFile(files[0]);
};
const pickCover = () => $self(".cover-file-input")?.click();
const computeChecksum = async () => {
  try {
    busy = true;
    error = null;
    if (!draft.crc32) update("crc32", await calculateCRC32(await loadContent()));
  } catch (err) {
    error = err instanceof Error ? err.message : t("editor.error.checksum");
  } finally {
    busy = false;
  }
};
const showLookupResult = (result) => {
  lookupResult = result;
  const fields = /* @__PURE__ */ new Set();
  if (result.name) fields.add("title");
  if (result.description) fields.add("description");
  if (result.region) fields.add("region");
  if (result.videoStandard) fields.add("videoStandard");
  if (result.cover) fields.add("cover");
  selectedFields = fields;
  lookupPhase = "complete";
};
const lookup = async () => {
  try {
    busy = true;
    error = null;
    lookupResult = null;
    selectedFields = /* @__PURE__ */ new Set();
    lookupPhase = "crc32";
    const content = await loadContent();
    const crc32 = draft.crc32 || await calculateCRC32(content);
    if (!draft.crc32) update("crc32", crc32);
    const system = systemOf(romPath);
    try {
      await ROMDatasetService.ensureSystem(system);
    } catch {
      error = \`No dataset available for \${system}\`;
      lookupPhase = "complete";
      return;
    }
    let result = await ROMDatasetService.lookupByCrc(crc32);
    if (result) return showLookupResult(result);
    lookupPhase = "md5";
    result = await ROMDatasetService.lookupByMd5(await calculateMD5(content));
    if (result) return showLookupResult(result);
    lookupPhase = "sha1";
    result = await ROMDatasetService.lookupBySha1(await calculateSHA1(content));
    if (result) return showLookupResult(result);
    error = t("editor.lookup.notFound");
    lookupPhase = "complete";
  } catch (err) {
    error = err instanceof Error ? err.message : t("editor.lookup.failed");
    lookupPhase = "complete";
  } finally {
    busy = false;
  }
};
const toggleField = (field) => {
  const next = new Set(selectedFields);
  if (next.has(field)) next.delete(field);
  else next.add(field);
  selectedFields = next;
};
const applySelected = () => {
  const result = lookupResult;
  if (!result) return;
  const take = (field, incoming, current) => selectedFields.has(field) && incoming ? incoming : current;
  draft = {
    ...draft,
    title: take("title", result.name, draft.title),
    description: take("description", result.description, draft.description),
    region: take("region", result.region, draft.region),
    videoStandard: take("videoStandard", result.videoStandard, draft.videoStandard),
    cover: take("cover", result.cover, draft.cover)
  };
  lookupResult = null;
  selectedFields = /* @__PURE__ */ new Set();
};
const save = async () => {
  try {
    saving = true;
    error = null;
    await onSave(draft, pendingCoverFile, coverRemoved);
  } catch (err) {
    error = err instanceof Error ? err.message : t("editor.error.save");
    saving = false;
  }
};
const syncLookupDialog = (result) => {
  requestAnimationFrame(() => {
    const element = $self(".lookup-dialog");
    if (!element) return;
    if (result && !element.open) element.showModal();
    else if (!result && element.open) element.close();
  });
};
$: syncLookupDialog(lookupResult);
$: lookupIcon = busy && (lookupPhase === "md5" || lookupPhase === "sha1") ? "hourglass" : "search";
$: lookupText = busy && lookupPhase === "crc32" ? t("editor.lookup.crc32") : busy && lookupPhase === "md5" ? t("editor.lookup.md5") : busy && lookupPhase === "sha1" ? t("editor.lookup.sha1") : t("editor.lookup.idle");
const incomingOf = (field) => field === "title" ? lookupResult?.name : lookupResult?.[field];
const currentOf = (field) => draft[field] || t("editor.lookup.empty");
<\/script>

<div class="metadata-editor">
  <div class="metadata-header">
    <div>
      <h3>{{ draft.title || gameNameOf(romPath) }}</h3>
      <p class="metadata-subtitle">{{ romPath }}</p>
    </div>
    <button
      @click="lookup"
      :disabled="busy || saving || !canChecksum"
      class="btn-lookup icon-label"
      :title="canChecksum ? t('editor.lookup.hint') : t('editor.lookup.tooLarge')"
    ><Icon :name="lookupIcon" /> {{ lookupText }}</button>
  </div>

  <div :if="error" class="lookup-error">{{ error }}</div>

  <dialog
    :if="lookupResult"
    class="modal-dialog lookup-dialog"
    :aria-label="t('editor.lookup.title')"
    @close="lookupResult = null"
    @click.self="lookupResult = null"
  >
    <header class="modal-header">
      <h3>{{ t('editor.lookup.title') }}</h3>
      <button class="modal-close" @click="lookupResult = null"><Icon name="close" /></button>
    </header>

    <div class="modal-content">
      <p class="match-name"><strong>{{ t('editor.lookup.match') }}</strong> {{ lookupResult.name }}</p>

      <div class="update-fields">
        <h4>{{ t('editor.lookup.select') }}</h4>
        <div :each="field in LOOKUP_FIELDS.filter((name) => incomingOf(name))" :key="field" class="field-option">
          <label class="checkbox-label">
            <input type="checkbox" :checked="selectedFields.has(field)" @change="toggleField(field)" />
            <span class="checkbox-text">
              <strong>{{ t(\`editor.fields.\${field}\`) }}</strong>
              <img
                :if="field === 'cover'"
                class="cover-preview"
                :src="incomingOf(field)"
                :alt="t('details.cover.alt', { title: lookupResult.name })"
                loading="lazy"
              />
              <span :else class="field-preview">
                <span class="current">{{ t('editor.lookup.current') }} <span class="value">{{ currentOf(field) }}</span></span>
                <span class="new">{{ t('editor.lookup.incoming') }} <span class="value">{{ incomingOf(field) }}</span></span>
              </span>
            </span>
          </label>
        </div>
      </div>
    </div>

    <div class="modal-actions">
      <button @click="lookupResult = null" class="btn-cancel icon-label"><Icon name="close" /> {{ t('editor.cancel') }}</button>
      <button @click="applySelected" class="btn-apply icon-label" :disabled="selectedFields.size === 0">
        <Icon name="check" /> {{ t('editor.lookup.apply') }}
      </button>
    </div>
  </dialog>

  <div
    :class="\`form-group cover-editor-group \${isCoverDragging ? 'dragging' : ''}\`"
    @dragover="onCoverDragOver"
    @dragleave="onCoverDragLeave"
    @drop="onCoverDrop"
  >
    <label>{{ t('editor.fields.cover') }}</label>
    <div :if="activeCoverUrl" class="cover-preview-wrapper">
      <img class="cover-image" :src="activeCoverUrl" :alt="t('details.cover.alt', { title: draft.title || gameNameOf(romPath) })" loading="lazy" />
      <div class="cover-actions">
        <button type="button" class="btn-inline" @click="pickCover">{{ t('editor.changeCover') }}</button>
        <button type="button" class="btn-inline btn-danger" @click="removeCover">{{ t('editor.removeCover') }}</button>
      </div>
    </div>
    <div :else class="cover-drop-zone" @click="pickCover">
      <span class="cover-drop-prompt">{{ t('editor.dropCoverOrClick') }}</span>
    </div>
    <input type="file" accept="image/*" style="display: none" class="cover-file-input" @change="onFilePicked" />
  </div>

  <div class="form-group">
    <label>{{ t('editor.fields.title') }}</label>
    <input type="text" :value="draft.title || ''" @input="update('title', $event.target.value)" />
  </div>

  <div class="form-group">
    <label>{{ t('editor.fields.description') }}</label>
    <textarea rows="4" :value="draft.description || ''" @input="update('description', $event.target.value)"></textarea>
  </div>

  <div class="form-group">
    <label>{{ t('editor.fields.releaseDate') }}</label>
    <input type="date" :value="draft.releaseDate || ''" @input="update('releaseDate', $event.target.value)" />
  </div>

  <div class="form-group">
    <label>{{ t('editor.fields.publisher') }}</label>
    <input type="text" :value="draft.publisher || ''" @input="update('publisher', $event.target.value)" />
  </div>

  <div class="form-group">
    <label>{{ t('editor.fields.region') }}</label>
    <select :value="draft.region || ''" @change="update('region', $event.target.value)">
      <option value="">{{ t('editor.select') }}</option>
      <option :each="value in (draft.region && !ROM_REGIONS.includes(draft.region) ? [draft.region, ...ROM_REGIONS] : ROM_REGIONS)" :key="value" :value="value">{{ value }}</option>
    </select>
  </div>

  <div class="form-group">
    <label>{{ t('editor.fields.videoStandard') }}</label>
    <select :value="draft.videoStandard || ''" @change="update('videoStandard', $event.target.value)">
      <option value="">{{ t('editor.select') }}</option>
      <option :each="value in (draft.videoStandard && !VIDEO_STANDARDS.includes(draft.videoStandard) ? [draft.videoStandard, ...VIDEO_STANDARDS] : VIDEO_STANDARDS)" :key="value" :value="value">{{ value }}</option>
    </select>
  </div>

  <div class="form-group">
    <label>{{ t('editor.fields.crc32') }}</label>
    <div class="field-with-action">
      <input
        type="text"
        :value="draft.crc32 || ''"
        :placeholder="canChecksum ? t('editor.notCalculated') : t('editor.tooLarge')"
        disabled
        class="checksum-field"
      />
      <button :if="canChecksum && !draft.crc32" class="btn-inline" @click="computeChecksum" :disabled="busy">{{ t('editor.calculate') }}</button>
    </div>
  </div>

  <div class="editor-actions">
    <button class="btn-primary icon-label" @click="save" :disabled="saving">
      <Icon :if="!saving" name="save" /> {{ saving ? t('editor.saving') : t('editor.save') }}
    </button>
    <button class="btn-cancel" @click="$emit('cancel')" :disabled="saving">{{ t('editor.cancel') }}</button>
  </div>
</div>
`,Qd={"../components/Icon.html":ne,"../lib/ROMMetadataService":So,"../lib/RomLibraryService":yn,"../lib/ROMDatasetService":Da,"../lib/ChecksumService":ja,"../helpers/rom-media":Fn,"../lib/ui-state":ie},eh="views/MetadataEditor.html";let Mo;Mo=new q(Xd,{modules:Qd,filename:eh});const th=Mo,Yt="game",Co=2;function nh(e,t){const n=t===!1?10:0,a=e.regions.length>1?Co+1:0;return n+a+(e.flags.length>0?1:0)}function Eo(e){return Ho(e.title)}function qn(e){return e.files.find(t=>t.cover)?.cover}function Ro(e,t,n){const a=new Map;for(const[o,s]of Object.entries(t?.byRegion??{}))s&&vn(o)&&a.set(o,{url:s,rank:Co});for(const o of e.variants){const s=qn(o);if(!s)continue;const l=n?n.has(o.key):void 0,c=nh(o,l),d=o.regions.length>0?[...o.regions]:[Yt];for(const f of d){const b=a.get(f);(!b||c<b.rank)&&a.set(f,{url:s,rank:c})}}const r={};for(const[o,{url:s}]of a)o!==Yt&&(r[o]=s);const i=a.get(Yt)?.url??t?.game;return i?{byRegion:r,game:i}:{byRegion:r}}function ah(e,t={}){const n=t.order??Na,a=new Set(t.present??[]);if(t.variantUrl){const o=Object.entries(e.byRegion).find(([,c])=>c===t.variantUrl),s=t.variantRegion??(o&&vn(o[0])?o[0]:void 0),l=s&&t.stored?.byRegion[s]||t.stored?.game;return{url:t.variantUrl,file:l,region:s}}const r=o=>{const s=t.stored?.byRegion[o];if(s)return{url:e.byRegion[o],file:s,region:o};if(t.stored?.game)return{file:t.stored.game};const l=e.byRegion[o];return l?{url:l,region:o}:void 0};for(const o of n){const s=a.has(o)?r(o):void 0;if(s)return s}for(const o of n){const s=r(o);if(s)return s}const i=t.stored?.game;return i||e.game?{url:e.game,file:i}:void 0}function rh(e,t){if(t.file||!t.url)return!1;const n=Object.values(e.byRegion).filter(Boolean);return n.length>1&&n.every(a=>a===t.url)}function Ve(e,t){return t.file?t.file:Pt(e,{kind:It,region:t.region,extension:Bn(t.url)})}function _o(e,t){const n=new Set;return t&&n.add(Ve(e,t)),t?.file&&t.url&&n.add(Ve(e,{url:t.url,region:t.region})),n.add(Pt(e,{kind:It})),[...n]}function Ao(e){const t=Object.entries(e.byRegion).filter(([,n])=>!!n).map(([n,a])=>({url:a,region:n}));return e.game&&t.push({url:e.game}),t}function oh(e){if(!e)return"3 / 4";const t=e.toLowerCase();return t.includes("advance")||t.includes("gba")||t.includes("nintendo 64")||t.includes("n64")||t.includes("super nintendo")||t.includes("snes")||t.includes("super famicom")?"4 / 3":t.includes("game boy color")||t.includes("gbc")||t.includes("game boy")||t.includes("gamegear")||t.includes("game gear")||t.includes("playstation")||t.includes("ps1")||t.includes("psx")||t.includes("nintendo ds")||t.includes("3ds")?"1 / 1":"3 / 4"}const Gn=Object.freeze(Object.defineProperty({__proto__:null,coverFileNameOf:Ve,coverKeyOf:Eo,coversOf:Ro,isSharedCover:rh,pickCover:ah,storableCoversOf:Ao,storedCoverNamesOf:_o,systemAspectRatio:oh,variantCoverUrl:qn},Symbol.toStringTag,{value:"Module"}));function ih(e){if(e<1024)return`${e} B`;const t=["KB","MB","GB"];let n=e/1024,a=0;for(;n>=1024&&a<t.length-1;)n/=1024,a+=1;return`${n.toFixed(n<10?1:0)} ${t[a]}`}function sh(e){if(e===void 0)return"—";const t=typeof e=="number"?new Date(e):new Date(e);return Number.isNaN(t.getTime())?"—":t.toLocaleString()}const lh=Object.freeze(Object.defineProperty({__proto__:null,formatDate:sh,formatSize:ih},Symbol.toStringTag,{value:"Module"}));function Io(e){if(e.byteLength<512)return null;const t=new Uint8Array(e,0,512);if(!(t[0]===78&&t[1]===69&&t[2]===79))return null;const a=new DataView(e,0,512),r=t[4],i=t[5],o=a.getUint32(8,!0),s=a.getUint32(12,!0),l=a.getUint32(16,!0),c=a.getUint32(20,!0),d=a.getUint32(24,!0),f=o+s+l+c+d,b=512+f;return{validHeader:!0,version:r,system:i,pSize:o,sSize:s,mSize:l,vSize:c,cSize:d,totalDataSize:f,expectedFileSize:b}}function ch(e){const t=e.fileName.toLowerCase().endsWith(".neo"),n=e.fileName.toLowerCase().endsWith(".zip");let a=!1,r,i="";if(t)if(e.headerBuffer){const c=Io(e.headerBuffer);c?(r=c,e.fileSize!==void 0?(a=e.fileSize===c.expectedFileSize,i=a?`Valid .neo header (P: ${Xe(c.pSize)}, C: ${Xe(c.cSize)}, total: ${Xe(c.totalDataSize)})`:`Header/size mismatch (expected ${c.expectedFileSize} B, got ${e.fileSize} B)`):(a=!0,i=`Valid .neo header (total data ${Xe(c.totalDataSize)})`)):(a=!1,i="Invalid or missing .neo 512-byte header magic")}else a=(e.fileSize??0)>512,i=a?"Plausible .neo file size":"File size too small for .neo";else if(n){const c=(e.memberCrcs?.length??0)>0;a=c||(e.fileSize??0)>0,i=c?`Valid ZIP archive containing ${e.memberCrcs?.length} chip dumps`:"ZIP archive structure detected"}else a=(e.fileSize??0)>0,i="Generic ROM file";const o=!!e.datMatch;let s="unverified",l="Unverified";return a&&o?(s="verified",l=t?"Verified (DAT + Header)":"Verified (DAT + ZIP)"):a&&!o?(s="structurally_valid",l=t?"Valid Structure (Custom DAT)":"Valid Archive (Custom DAT)"):a||(s="incomplete",l="Incomplete / Corrupted"),{status:s,structureValid:a,datVerified:o,statusLabel:l,details:i,header:r}}function Xe(e){return e>=1024*1024?`${(e/(1024*1024)).toFixed(1)} MiB`:e>=1024?`${(e/1024).toFixed(0)} KiB`:`${e} B`}const dh=Object.freeze(Object.defineProperty({__proto__:null,parseNeoGeoHeader:Io,validateNeoGeoVariant:ch},Symbol.toStringTag,{value:"Module"})),hh=`<!--
  A game's mods (IPS / BPS / UPS), in its details: name, format, and whether it fits a
  version that is here; rename, unassign, remove. The system's unassigned mods follow,
  each with "Assign to this game".

  \`mods\` are the system's (ModRecord[]); \`versions\` the CRCs of the versions on disk;
  \`actions\` = { rename(sha1, name), assign(sha1, assign: boolean), remove(sha1) }, all async.
  \`play(crc, patch)\`, when a launcher hosts rom-manager, is the link that plays a version with a
  mod: the version a BPS / UPS fits, else the first one here.
-->
<script :setup="{ game, mods = [], versions = [], actions, play = void 0 }">const [Icon, PromptModal, ConfirmModal, { gameIdOf, modFit }, { t }] = await $importAll([
  "../components/Icon.html",
  "../components/PromptModal.html",
  "../components/ConfirmModal.html",
  "../helpers/library-index",
  "../lib/ui-state"
]);
let renaming = void 0;
let removing = void 0;
let busy = false;
let error = void 0;
$: gameId = gameIdOf(game.title);
$: assigned = mods.filter((mod) => mod.gameId === gameId);
$: unassigned = mods.filter((mod) => !mod.gameId);
const fitOf = (mod) => modFit(mod, versions);
const playOf = (mod) => {
  if (!play) return void 0;
  const fit = fitOf(mod);
  if (fit === "other") return void 0;
  return play(fit === "fits" ? mod.sourceCrc : versions[0]?.crc, mod.sha1);
};
const act = async (run) => {
  try {
    busy = true;
    error = void 0;
    await run();
  } catch (err) {
    error = err instanceof Error ? err.message : t("mods.errors.change");
  } finally {
    busy = false;
  }
};
const rename = (name) => {
  const current = renaming;
  renaming = void 0;
  if (current && name && name !== current.name) void act(() => actions.rename(current.sha1, name));
};
const remove = () => {
  const current = removing;
  removing = void 0;
  if (current) void act(() => actions.remove(current.sha1));
};
<\/script>
<section class="game-mods">
  <div class="variants-heading">
    <h3>{{ t('mods.title') }}</h3>
  </div>
  <p :if="assigned.length === 0" class="mods-empty">{{ t('mods.empty') }}</p>
  <ul :else class="mods">
    <li :each="mod in assigned" :key="mod.sha1" class="mod-row">
      <span class="mod-name" :title="mod.name">{{ mod.name }}</span>
      <span class="tag">{{ mod.format.toUpperCase() }}</span>
      <span :class="\`tag mod-fit mod-fit-\${fitOf(mod)} \${fitOf(mod) === 'fits' ? 'status-complete' : ''}\`" :title="mod.sourceCrc ? \`CRC32 \${mod.sourceCrc}\` : ''">{{ t(\`mods.fit.\${fitOf(mod)}\`) }}</span>
      <span class="mod-actions">
        <a :if="playOf(mod)" class="mod-play icon-label" :href="playOf(mod)" :title="t('host.playWithMod')"><Icon name="play" /> {{ t('host.play') }}</a>
        <button class="tree-organize" :disabled="busy" @click="renaming = { sha1: mod.sha1, name: mod.name }" :title="t('mods.rename')">
          <Icon name="pencil" />
        </button>
        <button class="tree-organize" :disabled="busy" @click="act(() => actions.assign(mod.sha1, false))" :title="t('mods.unassign')">
          <Icon name="close" />
        </button>
        <button class="tree-organize" :disabled="busy" @click="removing = { sha1: mod.sha1, name: mod.name }" :title="t('mods.remove')">
          <Icon name="trash" />
        </button>
      </span>
    </li>
  </ul>

  <details :if="unassigned.length > 0" class="variants-missing">
    <summary>{{ t('mods.unassigned', { count: unassigned.length }) }}</summary>
    <ul class="mods">
      <li :each="mod in unassigned" :key="mod.sha1" class="mod-row">
        <span class="mod-name" :title="mod.name">{{ mod.name }}</span>
        <span class="tag">{{ mod.format.toUpperCase() }}</span>
        <span class="mod-actions">
          <button class="mod-assign" :disabled="busy" @click="act(() => actions.assign(mod.sha1, true))">
            <Icon name="plus" /> {{ t('mods.assign') }}
          </button>
          <button class="tree-organize" :disabled="busy" @click="removing = { sha1: mod.sha1, name: mod.name }" :title="t('mods.remove')">
            <Icon name="trash" />
          </button>
        </span>
      </li>
    </ul>
  </details>

  <p :if="error" class="mods-error" role="alert">{{ error }}</p>
  <p class="mods-hint">{{ t('mods.hint') }}</p>

  <PromptModal
    :if="renaming"
    :open="true"
    :close-label="t('prefs.close')"
    :cancel-label="t('drop.cancel')"
    :submit-label="t('modal.confirm')"
    :title="t('mods.renameTitle')"
    :default-value="renaming.name"
    @submit="rename($event.detail)"
    @close="renaming = undefined"
  />
  <ConfirmModal
    :if="removing"
    :open="true"
    :close-label="t('prefs.close')"
    :cancel-label="t('drop.cancel')"
    :confirm-label="t('modal.delete')"
    :title="t('mods.removeTitle')"
    :message="t('mods.removeMessage', { name: removing.name })"
    @confirm="remove()"
    @close="removing = undefined"
  />
</section>
`,fh={"../components/Icon.html":ne,"../components/PromptModal.html":vo,"../components/ConfirmModal.html":At,"../helpers/library-index":wn,"../lib/ui-state":ie},mh="views/GameMods.html";let Po;Po=new q(hh,{modules:fh,filename:mh});const uh=Po,No="play.germade",ph=No==="play.germade",gh="/",Lo=Object.freeze(Object.defineProperty({__proto__:null,HOST:No,LAUNCHER_BASE:gh,isPlayGermade:ph},Symbol.toStringTag,{value:"Module"})),vh={MegaDrive:"megadrive",SNES:"snes",GBA:"gba",GAMEBOY:"gba",GBC:"gba",NEOGEO:"neogeo"};function zo(e){return vh[e]}function yh({system:e,gameId:t,crc:n,patch:a},r="/"){const i=zo(e);if(!i)return;const o=new URLSearchParams({system:e,game:t,version:n.toLowerCase()});return a&&o.set("patch",a.slice(0,8).toLowerCase()),`${r}${i}/?${o}`}const wh=Object.freeze(Object.defineProperty({__proto__:null,launcherRouteOf:zo,playUrl:yh},Symbol.toStringTag,{value:"Module"})),bh=`<!--
  The details pane: what is picked in the tree, shown as it is.

  - a game (grouped folder): its cover and its variants, each with its files;
  - a folder: the system it is (SystemDetails);
  - one file: its record (or what is known before it has one), or the editor;
  - several files: the list, or the batch editor.

  Events: edit, cancel-edit, select-file (path), organize (path),
  remove (paths), back. The async ones are functions, because the editor waits
  on them: \`onSave(path, record, coverFile?, coverRemoved?)\`,
  \`onSaveMany(changes)\`, \`loadContent(path)\`, and the game's mods (\`mods\`, the
  system's) through \`modActions\` (see GameMods).
-->
<script
  :setup="{ paths = [], game = void 0, folder = void 0, wizardFolder = false, gameCover = void 0, records, stats, covers, editing = false, onSave, onSaveMany, loadContent, canOrganize = false, canRemove = false, back = void 0, mods = [], modActions = void 0 }">const [Icon, SystemDetails, MetadataEditor, { CRC32_SIZE_LIMIT, emptyRecord, gameNameOf }, { t }] = await $importAll([
  "../components/Icon.html",
  "./SystemDetails.html",
  "./MetadataEditor.html",
  "../lib/RomLibraryService",
  "../lib/ui-state"
]);
$: single = paths.length === 1 ? paths[0] : void 0;
$: record = single ? records.get(single) ?? null : null;
$: stat = single ? stats.get(single) : void 0;
$: size = stat?.size ?? 0;
$: own = single ? covers.get(single) : void 0;
$: cover = own ? { url: own } : gameCover;
$: selectedRecords = paths.map((path) => records.get(path)).filter(Boolean);
$: showsFolder = Boolean(folder && (paths.length === 0 || paths.length === 1 && paths[0] === folder));
<\/script>

<GameView
  :if="game"
  :game="game"
  :cover="gameCover"
  :stats="stats"
  :can-organize="canOrganize"
  :mods="mods"
  :mod-actions="modActions"
  @select-file="$emit('select-file', $event.detail)"
  @organize="$emit('organize', $event.detail)"
/>
<SystemDetails :elseif="showsFolder" :folder="folder" :wizard="wizardFolder" />
<div :elseif="paths.length === 0" class="empty-state">{{ t('details.empty') }}</div>
<RomBatchEditor
  :elseif="paths.length > 1 && editing && selectedRecords.length === paths.length"
  :records="selectedRecords"
  :count="paths.length"
  :on-save="onSaveMany"
  @cancel="$emit('cancel-edit')"
/>
<RomSelectionView :elseif="paths.length > 1" :paths="paths" :records="records" @edit="$emit('edit')" />
<div :elseif="editing" class="details-editing" style="display: contents">
  <!-- One editor per file: another file starts a fresh one. -->
  <MetadataEditor
    :each="key in [single]"
    :key="key"
    :rom-path="single"
    :record="record ?? { ...emptyRecord(), title: gameNameOf(single) }"
    :cover-url="covers.get(single)"
    :can-checksum="size <= CRC32_SIZE_LIMIT"
    :load-content="() => loadContent(single)"
    :on-save="(updated, coverFile, coverRemoved) => onSave(single, updated, coverFile, coverRemoved)"
    @cancel="$emit('cancel-edit')"
  />
</div>
<div :else class="details-single" style="display: contents">
  <button :if="back" class="btn-back icon-label" @click="$emit('back')" :title="t('details.back')">
    <Icon name="arrow-left" /> {{ back.label }}
  </button>
  <RomFileView
    :if="!record"
    :path="single"
    :stat="stat"
    :cover="cover"
    :load-content="loadContent"
    :can-remove="canRemove"
    @edit="$emit('edit')"
    @remove="$emit('remove', $event.detail)"
  />
  <RomInfoView
    :else
    :path="single"
    :record="record"
    :stat="stat"
    :cover="cover"
    :can-remove="canRemove"
    @edit="$emit('edit')"
    @remove="$emit('remove', $event.detail)"
  />
</div>

<!-- The box art (or a placeholder in the system's own box shape) and whose box it is. -->
<template name="CoverFigure">
  <script :setup="{ cover = void 0, alt = &quot;&quot;, system = void 0 }">const [{ systemAspectRatio }, { t }] = await $importAll(["../helpers/rom-covers", "../lib/ui-state"]);
let naturalRatio = void 0;
const resetFor = (_system) => {
  naturalRatio = void 0;
};
$: resetFor(system);
$: currentRatio = naturalRatio || systemAspectRatio(system);
$: isLandscape = (() => {
  const parts = currentRatio.split("/").map((s) => parseFloat(s.trim()));
  return parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && parts[0] > parts[1];
})();
$: regionLabel = cover?.region ? t("details.cover.region", { region: cover.region }) : cover ? t("details.cover.game") : "\\xA0";
const onLoad = (event) => {
  const img = event.currentTarget;
  if (img.naturalWidth && img.naturalHeight) naturalRatio = \`\${img.naturalWidth} / \${img.naturalHeight}\`;
};
<\/script>
  <figure class="rom-info-cover-figure">
    <div :class="\`rom-info-cover-wrapper \${isLandscape ? 'landscape' : ''}\`" :style="\`aspect-ratio: \${currentRatio}\`">
      <!-- Keyed by its url: a new image starts as a new element (the ratio is read on load). -->
      <img :each="url in (cover ? [cover.url] : [])" :key="url" class="rom-info-cover" :src="url" :alt="t('details.cover.alt', { title: alt })" @load="onLoad" />
      <div :if="!cover" class="rom-info-cover placeholder">{{ t('details.cover.none') }}</div>
    </div>
    <figcaption class="rom-info-cover-region">{{ regionLabel }}</figcaption>
  </figure>
</template>

<!-- A file's CRC32, taken on demand (it reads the whole file). -->
<template name="ChecksumRow">
  <script :setup="{ path, size = 0, loadContent }">const [{ CRC32_SIZE_LIMIT }, { calculateCRC32 }, { formatSize }, { t }] = await $importAll([
  "../lib/RomLibraryService",
  "../lib/ChecksumService",
  "../helpers/format",
  "../lib/ui-state"
]);
let value = void 0;
let busy = false;
let error = void 0;
const compute = async () => {
  try {
    busy = true;
    error = void 0;
    value = await calculateCRC32(await loadContent(path));
  } catch (err) {
    error = err instanceof Error ? err.message : t("details.checksum.failed");
  } finally {
    busy = false;
  }
};
<\/script>
  <div :if="size > CRC32_SIZE_LIMIT" class="fact">
    <span class="fact-label">CRC32</span>
    <span class="fact-value muted">{{ t('details.checksum.skipped', { limit: formatSize(CRC32_SIZE_LIMIT) }) }}</span>
  </div>
  <div :else class="fact">
    <span class="fact-label">{{ t('details.facts.crc32') }}</span>
    <span class="fact-value">
      <code :if="value">{{ value }}</code>
      <button :else class="btn-inline" @click="compute" :disabled="busy">
        {{ busy ? t('details.checksum.calculating') : t('details.checksum.calculate') }}
      </button>
      <span :if="error" class="fact-error">{{ error }}</span>
    </span>
  </div>
</template>

<!-- A file with no record yet: what the disk says about it. Events: edit, remove (paths). -->
<template name="RomFileView">
  <script :setup="{ path, stat = void 0, cover = void 0, loadContent, canRemove = false }">const [Icon, ConfirmModal, { romMetadataService }, { extensionOf, fileNameOf, systemOf }, { formatDate, formatSize }, { t }] = await $importAll([
  "../components/Icon.html",
  "../components/ConfirmModal.html",
  "../lib/ROMMetadataService",
  "../lib/RomLibraryService",
  "../helpers/format",
  "../lib/ui-state"
]);
let confirmDelete = false;
$: size = stat?.size ?? 0;
const confirmRemove = () => {
  confirmDelete = false;
  $emit("remove", [path]);
};
<\/script>
  <div class="rom-file-view">
    <button :if="canRemove" class="btn-delete-topright" @click="confirmDelete = true" :title="t('details.delete')">
      <Icon name="trash" />
    </button>
    <div :if="cover" class="rom-info-hero">
      <CoverFigure :cover="cover" :alt="fileNameOf(path)" :system="systemOf(path)" />
      <div class="rom-info-heading">
        <h3>{{ fileNameOf(path) }}</h3>
        <p class="metadata-subtitle">{{ t('details.file.pending') }}</p>
        <button class="btn-primary icon-label" @click="$emit('edit')"><Icon name="pencil" /> {{ t('details.file.add') }}</button>
      </div>
    </div>
    <div :else class="rom-file-header">
      <div>
        <h3>{{ fileNameOf(path) }}</h3>
        <p class="metadata-subtitle">{{ t('details.file.pending') }}</p>
      </div>
      <button class="btn-primary icon-label" @click="$emit('edit')"><Icon name="pencil" /> {{ t('details.file.add') }}</button>
    </div>

    <div class="facts">
      <div class="fact">
        <span class="fact-label">{{ t('details.facts.system') }}</span>
        <span class="fact-value">{{ systemOf(path) || '—' }}</span>
      </div>
      <div class="fact">
        <span class="fact-label">{{ t('details.facts.format') }}</span>
        <span class="fact-value">{{ romMetadataService.getROMFormat(path) }} ({{ extensionOf(path) || t('details.facts.noExtension') }})</span>
      </div>
      <div class="fact">
        <span class="fact-label">{{ t('details.facts.size') }}</span>
        <span class="fact-value">{{ formatSize(size) }}</span>
      </div>
      <div class="fact">
        <span class="fact-label">{{ t('details.facts.modified') }}</span>
        <span class="fact-value">{{ formatDate(stat?.mtime) }}</span>
      </div>
      <div class="fact">
        <span class="fact-label">{{ t('details.facts.added') }}</span>
        <span class="fact-value muted">{{ t('details.facts.notInitialized') }}</span>
      </div>
      <ChecksumRow :path="path" :size="size" :load-content="loadContent" />
    </div>

    <ConfirmModal
      :close-label="t('prefs.close')"
      :cancel-label="t('drop.cancel')"
      :confirm-label="t('modal.delete')"
      :if="confirmDelete"
      :open="true"
      :title="t('details.variants.deleteFileTitle')"
      :message="t('details.variants.deleteFileMessage', { name: fileNameOf(path) })"
      :danger="true"
      @confirm="confirmRemove()"
      @close="confirmDelete = false"
    />
  </div>
</template>

<!-- A file with a record: the game it is, as written in its \`.meta\`. Events: edit, remove (paths). -->
<template name="RomInfoView">
  <script :setup="{ path, record, stat = void 0, cover = void 0, canRemove = false }">const [Icon, ConfirmModal, { fileNameOf, gameNameOf, systemOf }, { formatDate, formatSize }, { t }] = await $importAll([
  "../components/Icon.html",
  "../components/ConfirmModal.html",
  "../lib/RomLibraryService",
  "../helpers/format",
  "../lib/ui-state"
]);
let confirmDelete = false;
const confirmRemove = () => {
  confirmDelete = false;
  $emit("remove", [path]);
};
<\/script>
  <div class="rom-info">
    <button :if="canRemove" class="btn-delete-topright" @click="confirmDelete = true" :title="t('details.delete')">
      <Icon name="trash" />
    </button>
    <div class="rom-info-hero">
      <CoverFigure :cover="cover" :alt="record.title || path" :system="systemOf(path)" />
      <div class="rom-info-heading">
        <h2>{{ record.title || gameNameOf(path) }}</h2>
        <p class="rom-info-system">{{ systemOf(path) }}</p>
        <div class="rom-info-tags">
          <span :if="record.region" class="tag">{{ record.region }}</span>
          <span :if="record.videoStandard" class="tag">{{ record.videoStandard }}</span>
          <span :if="record.releaseDate" class="tag">{{ record.releaseDate }}</span>
        </div>
        <button class="btn-primary icon-label" @click="$emit('edit')"><Icon name="pencil" /> {{ t('details.edit') }}</button>
      </div>
    </div>

    <p :if="record.description" class="rom-info-description">{{ record.description }}</p>

    <div class="facts">
      <div class="fact">
        <span class="fact-label">{{ t('details.facts.file') }}</span>
        <span class="fact-value">{{ fileNameOf(path) }}</span>
      </div>
      <div :if="record.publisher" class="fact">
        <span class="fact-label">{{ t('details.facts.publisher') }}</span>
        <span class="fact-value">{{ record.publisher }}</span>
      </div>
      <div class="fact">
        <span class="fact-label">{{ t('details.facts.size') }}</span>
        <span class="fact-value">{{ formatSize(stat?.size ?? 0) }}</span>
      </div>
      <div class="fact">
        <span class="fact-label">{{ t('details.facts.crc32') }}</span>
        <span class="fact-value"><code :if="record.crc32">{{ record.crc32 }}</code><span :else>—</span></span>
      </div>
      <div class="fact">
        <span class="fact-label">{{ t('details.facts.added') }}</span>
        <span class="fact-value">{{ formatDate(record.addedAt) }}</span>
      </div>
      <div class="fact">
        <span class="fact-label">{{ t('details.facts.updated') }}</span>
        <span class="fact-value">{{ formatDate(record.updatedAt) }}</span>
      </div>
    </div>

    <ConfirmModal
      :close-label="t('prefs.close')"
      :cancel-label="t('drop.cancel')"
      :confirm-label="t('modal.delete')"
      :if="confirmDelete"
      :open="true"
      :title="t('details.variants.deleteFileTitle')"
      :message="t('details.variants.deleteFileMessage', { name: fileNameOf(path) })"
      :danger="true"
      @confirm="confirmRemove()"
      @close="confirmDelete = false"
    />
  </div>
</template>

<!-- One variant of a game: its status, regions, video standards and files. Events: select-file, organize. -->
<template name="VariantRow">
  <script :setup="{ variant, stats, cover = void 0, canOrganize = false, play = void 0 }">const [Icon, { fileNameOf, systemOf }, { validateNeoGeoVariant }, { formatSize }, { t }] = await $importAll([
  "../components/Icon.html",
  "../lib/RomLibraryService",
  "../helpers/neogeo-validator",
  "../helpers/format",
  "../lib/ui-state"
]);
const STATUS_KEYS = {
  complete: "details.status.complete",
  partial: "details.status.partial",
  missing: "details.status.missing"
};
$: activeUrl = cover?.publishedUrl || cover?.url;
$: isCoverActive = variant.status !== "missing" && (Boolean(activeUrl && variant.cover === activeUrl) || Boolean(cover?.region && !variant.cover && variant.regions.includes(cover.region)));
$: displayKey = variant.key === "Unknown" ? "World / Arcade" : variant.key;
$: playHref = play && variant.status !== "missing" ? play(variant.files.find((file) => file.path)?.crc) : void 0;
const validationOf = (file) => {
  const isNeoGeo = systemOf(file.path) === "NEOGEO" || file.path.toLowerCase().endsWith(".neo");
  return isNeoGeo ? validateNeoGeoVariant({ fileName: fileNameOf(file.path), fileSize: stats.get(file.path)?.size, datMatch: Boolean(file.crc) }) : null;
};
<\/script>
  <li :class="\`variant status-\${variant.status}\${isCoverActive ? ' active-cover' : ''}\`">
    <div class="variant-heading">
      <span class="variant-mark" :title="t(STATUS_KEYS[variant.status])"><Icon name="status" :status="variant.status" /></span>
      <span class="variant-key">{{ displayKey }}</span>
      <span class="variant-support">
        <span :each="region in variant.regions" :key="region" class="tag region" :title="t('details.variants.shipsTo', { region })">{{ region }}</span>
        <span :each="standard in variant.videoStandards" :key="standard" class="tag video" :title="t('details.variants.runsAt', { standard })">{{ standard }}</span>
      </span>
      <span class="variant-count">{{ variant.files.length > 1 ? t('details.variants.files', { count: variant.files.length }) : '' }}</span>
      <a :if="playHref" class="variant-play icon-label" :href="playHref"><Icon name="play" /> {{ t('host.play') }}</a>
    </div>
    <ul class="variant-files">
      <li :each="file, index in variant.files" :key="file.path || \`missing:\${index}\`" :class="file.path ? 'variant-file' : 'variant-file missing'">
        <span :if="!file.path">{{ file.label }}</span>
        <button :else class="btn-inline" @click="$emit('select-file', file.path)">{{ file.label }}</button>
        <span
          :if="file.path && validationOf(file)"
          :class="\`variant-validation-icon status-\${validationOf(file).status}\`"
          :title="\`\${validationOf(file).statusLabel} (\${validationOf(file).details})\`"
        >
          <Icon :if="validationOf(file).status === 'verified'" name="double-check" />
          <Icon :elseif="validationOf(file).status === 'structurally_valid'" name="check" />
          <Icon :elseif="validationOf(file).status === 'incomplete'" name="cross" />
        </span>
        <button
          :if="file.path && file.isConsolidated === false && canOrganize"
          class="tree-organize"
          @click.stop="$emit('organize', file.path)"
          :title="t('details.variants.consolidate')"
        >
          <Icon name="organize" />
        </button>
        <code class="variant-file-crc" title="CRC32">{{ file.crc }}</code>
        <span class="variant-file-size">{{ file.path ? formatSize(stats.get(file.path)?.size ?? 0) : t('details.variants.missingFile') }}</span>
      </li>
    </ul>
  </li>
</template>

<!-- A game: its cover, status, the variants on disk, and the others the catalogue knows. -->
<template name="GameView">
  <script :setup="{ game, cover = void 0, stats, canOrganize = false, mods = [], modActions = void 0 }">const [Icon, GameMods, { systemOf }, { t }, { isPlayGermade }, { playUrl }, { gameIdOf }] = await $importAll([
  "../components/Icon.html",
  "./GameMods.html",
  "../lib/RomLibraryService",
  "../lib/ui-state",
  "../lib/host",
  "../helpers/launcher",
  "../helpers/library-index"
]);
const STATUS_KEYS = {
  complete: "details.status.complete",
  partial: "details.status.partial",
  missing: "details.status.missing"
};
const hasFiles = (variant) => variant.files.some((file) => file.path);
$: present = game.variants.filter(hasFiles);
$: missing = game.variants.filter((variant) => !hasFiles(variant));
$: play = isPlayGermade ? (crc, patch) => crc ? playUrl({ system: systemOf(game.paths[0]), gameId: gameIdOf(game.title), crc, patch }) : void 0 : void 0;
$: versionCrcs = present.flatMap((variant) => variant.files.filter((file) => file.path).map((file) => ({ crc: file.crc })));
const organizeAll = () => $emit("organize", present[0].files.find((f) => f.path)?.path || game.paths[0]);
<\/script>
  <div class="rom-info game-info">
    <div class="rom-info-hero">
      <CoverFigure :cover="cover" :alt="game.title" :system="systemOf(game.paths[0])" />
      <div class="rom-info-heading">
        <h2>{{ game.title }}</h2>
        <p class="rom-info-system">{{ systemOf(game.paths[0]) || '—' }}</p>
        <div class="rom-info-tags">
          <span :class="\`tag status-\${game.status}\`">{{ t(STATUS_KEYS[game.status]) }}</span>
          <span :each="variant in present" :key="variant.key" class="tag">{{ variant.key }}</span>
        </div>
      </div>
    </div>

    <div class="variants-heading">
      <h3>{{ t('details.variants.title') }}</h3>
      <button :if="present.length > 0 && canOrganize" class="tree-organize" @click="organizeAll" :title="t('details.variants.consolidateAll')">
        <Icon name="organize" />
      </button>
    </div>

    <ul class="variants">
      <VariantRow
        :each="variant in present"
        :key="variant.key"
        :variant="variant"
        :stats="stats"
        :cover="cover"
        :can-organize="canOrganize"
        :play="play"
        @select-file="$emit('select-file', $event.detail)"
        @organize="$emit('organize', $event.detail)"
      />
    </ul>

    <details :if="missing.length > 0" class="variants-missing">
      <summary>{{ t('details.variants.more', { count: missing.length }) }}</summary>
      <ul class="variants">
        <VariantRow
          :each="variant in missing"
          :key="variant.key"
          :variant="variant"
          :stats="stats"
          :cover="cover"
          :can-organize="canOrganize"
          @select-file="$emit('select-file', $event.detail)"
          @organize="$emit('organize', $event.detail)"
        />
      </ul>
    </details>

    <GameMods :if="modActions" :game="game" :mods="mods" :versions="versionCrcs" :actions="modActions" :play="play" />
  </div>
</template>

<!-- Region and video standard for several records at once. Events: cancel. -->
<template name="RomBatchEditor">
  <script :setup="{ records = [], count = 0, onSave }">const [Icon, { ROM_REGIONS, VIDEO_STANDARDS }, { t }] = await $importAll([
  "../components/Icon.html",
  "../lib/ROMMetadataService",
  "../lib/ui-state"
]);
let region = "";
let videoStandard = "";
let saving = false;
let error = void 0;
const sharedValue = (field) => {
  const first = records[0]?.[field];
  if (typeof first !== "string") return void 0;
  return records.every((record) => record[field] === first) ? first : void 0;
};
$: currentRegion = sharedValue("region");
$: currentVideo = sharedValue("videoStandard");
const save = async () => {
  const changes = {};
  if (region) changes.region = region;
  if (videoStandard) changes.videoStandard = videoStandard;
  try {
    saving = true;
    error = void 0;
    await onSave(changes);
  } catch (err) {
    error = err instanceof Error ? err.message : t("details.batch.error");
    saving = false;
  }
};
<\/script>
  <div class="metadata-editor">
    <div class="metadata-header">
      <div>
        <h3>{{ t('details.batch.title', { count }) }}</h3>
        <p class="metadata-subtitle">{{ t('details.batch.subtitle') }}</p>
      </div>
    </div>

    <div :if="error" class="lookup-error">{{ error }}</div>

    <div class="form-group">
      <label>{{ t('editor.fields.region') }}</label>
      <select :value="region" @change="region = $event.target.value">
        <option value="">{{ t('details.batch.keep', { value: currentRegion || t('details.batch.mixed') }) }}</option>
        <option :each="value in ROM_REGIONS" :key="value" :value="value">{{ value }}</option>
      </select>
    </div>

    <div class="form-group">
      <label>{{ t('editor.fields.videoStandard') }}</label>
      <select :value="videoStandard" @change="videoStandard = $event.target.value">
        <option value="">{{ t('details.batch.keep', { value: currentVideo || t('details.batch.mixed') }) }}</option>
        <option :each="value in VIDEO_STANDARDS" :key="value" :value="value">{{ value }}</option>
      </select>
    </div>

    <div class="editor-actions">
      <button class="btn-primary icon-label" @click="save" :disabled="saving || (!region && !videoStandard)">
        <Icon :if="!saving" name="save" /> {{ saving ? t('details.batch.saving') : t('details.batch.apply', { count }) }}
      </button>
      <button class="btn-cancel" @click="$emit('cancel')" :disabled="saving">{{ t('editor.cancel') }}</button>
    </div>
  </div>
</template>

<!-- Several files picked: which have records, and the way to edit them together. Events: edit. -->
<template name="RomSelectionView">
  <script :setup="{ paths = [], records }">const [Icon, { fileNameOf, systemOf }, { t }] = await $importAll(["../components/Icon.html", "../lib/RomLibraryService", "../lib/ui-state"]);
$: pending = paths.length - paths.filter((path) => records.get(path)).length;
<\/script>
  <div class="rom-selection">
    <div class="rom-file-header">
      <div>
        <h3>{{ t('details.selection.title', { count: paths.length }) }}</h3>
        <p class="metadata-subtitle">{{ pending === 0 ? t('details.selection.ready') : t('details.selection.pending', { count: pending }) }}</p>
      </div>
      <button
        class="btn-primary icon-label"
        @click="$emit('edit')"
        :disabled="pending > 0"
        :title="pending > 0 ? t('details.selection.gate') : t('details.selection.hint')"
      ><Icon name="pencil" /> {{ t('details.selection.edit', { count: paths.length }) }}</button>
    </div>
    <ul class="rom-selection-list">
      <li :each="path in paths" :key="path" :class="records.get(path) ? 'initialised' : 'pending'">
        <span class="rom-selection-name">{{ records.get(path)?.title || fileNameOf(path) }}</span>
        <span class="rom-selection-system">{{ systemOf(path) }}</span>
      </li>
    </ul>
  </div>
</template>
`,kh={"../components/Icon.html":ne,"./SystemDetails.html":Wd,"./MetadataEditor.html":th,"../lib/RomLibraryService":yn,"../lib/ui-state":ie,"../helpers/rom-covers":Gn,"../lib/ChecksumService":ja,"../helpers/format":lh,"../components/ConfirmModal.html":At,"../lib/ROMMetadataService":So,"../helpers/neogeo-validator":dh,"./GameMods.html":uh,"../lib/host":Lo,"../helpers/launcher":wh,"../helpers/library-index":wn},Sh="views/RomDetails.html";let ue;ue=new q(bh,{modules:kh,filename:Sh});const xh=ue;ue.CoverFigure;ue.ChecksumRow;ue.RomFileView;ue.RomInfoView;ue.VariantRow;ue.GameView;ue.RomBatchEditor;ue.RomSelectionView;const $h=["systems","games","game"];function Oh(e){const t=new URLSearchParams(e),n=t.get("system")||void 0,a=n&&t.get("game")||void 0;return{system:n,game:a}}function Mh(e,t){const n=new URLSearchParams(e);n.delete("system"),n.delete("game"),t.system&&n.set("system",t.system),t.system&&t.game&&n.set("game",t.game);const a=n.toString();return a?`?${a}`:""}function Ch(e){return e.game?"game":e.system?"games":"systems"}const Eh=Object.freeze(Object.defineProperty({__proto__:null,PANELS:$h,panelOf:Ch,readPanelState:Oh,writePanelState:Mh},Symbol.toStringTag,{value:"Module"})),Rh=`<!--
  The phone layout: three full-screen panels side by side — systems, the games of
  one, the game — navigated by swiping (CSS scroll snap) or by picking, which
  slides to the next panel. Back (the browser's, or Android's gesture) walks left
  again: every step is a history entry, \`?system=…&game=…\`.

  It holds no data of its own: the system folders come from the open node, the
  games from the same grouped rows the desktop tree uses, and the game panel is
  whatever the explorer puts in this component's slot (its details).

  Events: grouping-needed (path), pick-game (WizardGame | undefined).
-->
<script :setup="{ node, refreshToken = 0, knownSystems = [], groupedRows, regionOrder = [] }">const [Icon, SystemLogo, { PANELS, panelOf, readPanelState, writePanelState }, { getSystemInfo }, { pickCover }, { t }] = await $importAll([
  "../components/Icon.html",
  "../components/SystemLogo.html",
  "../helpers/mobile-panels",
  "../helpers/system-info",
  "../helpers/rom-covers",
  "../lib/ui-state"
]);
let state = readPanelState(location.search);
let systems = void 0;
let current = panelOf(readPanelState(location.search));
$: games = state.system ? (groupedRows.get(state.system) ?? []).filter((row) => row.kind === "group") : [];
$: game = state.game ? games.find((row) => row.id === state.game) : void 0;
const listSystems = (_token, known) => {
  const knownSet = new Set(known);
  node.list("").then((entries) => {
    systems = entries.filter((entry) => entry.kind === "directory" && knownSet.has(entry.name)).map((entry) => entry.name);
  }).catch(() => {
    systems = [];
  });
};
$: listSystems(refreshToken, knownSystems);
$: if (state.system && !groupedRows.has(state.system)) $emit("grouping-needed", state.system);
const reported = /* @__PURE__ */ (() => {
  let id;
  return { get: () => id, set: (next) => {
    id = next;
  } };
})();
$: {
  const id = game?.key;
  if (id !== reported.get()) {
    reported.set(id);
    $emit("pick-game", game);
  }
}
const panelElement = (panel) => $self(\`.mobile-panel[data-panel="\${panel}"]\`);
const scrollTo = (panel, smooth = true) => {
  const target = panelElement(panel);
  const box = $self(".mobile-panels");
  if (!target || !box) return;
  const reduced = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  box.scrollTo({ left: target.offsetLeft, behavior: smooth && !reduced ? "smooth" : "auto" });
};
const go = (next) => {
  history.pushState(null, "", \`\${location.pathname}\${writePanelState(location.search, next)}\`);
  state = next;
  requestAnimationFrame(() => scrollTo(panelOf(next)));
};
const pickSystem = (system) => go({ system });
const pickGame = (row) => go({ system: state.system, game: row.id });
const showPanel = (panel) => {
  if (PANELS.indexOf(panel) < PANELS.indexOf(panelOf(state))) {
    scrollTo(panel);
    current = panel;
    return;
  }
  scrollTo(panel);
};
$: title = current === "game" ? game?.title ?? t("mobile.game") : current === "games" ? state.system ? getSystemInfo(state.system)?.name ?? state.system : t("mobile.games") : t("mobile.systems");
const countOf = (system) => {
  const rows = groupedRows.get(system);
  return rows ? rows.filter((row) => row.kind === "group").length : void 0;
};
const systemLine = (system) => {
  const info = getSystemInfo(system);
  const count = countOf(system);
  return \`\${info ? \`\${info.manufacturer} \\xB7 \${info.releaseYear}\` : system}\${count !== void 0 ? \` \\xB7 \${t("mobile.gameCount", { count })}\` : ""}\`;
};
const gameLine = (row) => \`\${row.presentRegions.join(" \\xB7 ") || row.label} \\xB7 \${row.paths.length === 1 ? t("mobile.oneVersion") : t("mobile.versions", { count: row.paths.length })}\`;
const coverOf = (row) => pickCover(row.covers, { present: row.presentRegions, order: regionOrder });
const onPop = () => {
  const next = readPanelState(location.search);
  state = next;
  scrollTo(panelOf(next));
};
addEventListener("popstate", onPop);
$destroyed(() => removeEventListener("popstate", onPop));
await $mounted();
scrollTo(panelOf(state), false);
if (typeof IntersectionObserver !== "undefined") {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) current = entry.target.dataset.panel;
      }
    },
    { root: $self(".mobile-panels"), threshold: 0.6 }
  );
  for (const element of $$self(".mobile-panel")) observer.observe(element);
  $destroyed(() => observer.disconnect());
}
<\/script>

<div class="mobile-panels-wrap">
  <nav class="mobile-panels-bar" :aria-label="t('mobile.nav')">
    <button :if="current !== 'systems'" class="mobile-back" @click="showPanel(PANELS[PANELS.indexOf(current) - 1])" :title="t('details.back')">
      <Icon name="arrow-left" />
    </button>
    <h2 class="mobile-panels-title">{{ title }}</h2>
    <div class="mobile-dots" role="tablist">
      <button
        :each="panel in PANELS"
        :key="panel"
        role="tab"
        :class="\`mobile-dot \${panel === current ? 'on' : ''}\`"
        :aria-selected="panel === current ? 'true' : 'false'"
        :aria-label="t(\`mobile.\${panel}\`)"
        :disabled="PANELS.indexOf(panel) > PANELS.indexOf(panelOf(state))"
        @click="showPanel(panel)"
      ></button>
    </div>
  </nav>

  <div class="mobile-panels">
    <section class="mobile-panel" data-panel="systems">
      <p :if="systems === undefined" class="mobile-empty">{{ t('mobile.reading') }}</p>
      <p :elseif="systems.length === 0" class="mobile-empty">{{ t('mobile.noSystems') }}</p>
      <ul :else class="mobile-list">
        <li :each="system in systems" :key="system">
          <button :class="\`mobile-row \${state.system === system ? 'on' : ''}\`" @click="pickSystem(system)">
            <span class="mobile-row-logo"><SystemLogo :system-id="system" /></span>
            <span class="mobile-row-text">
              <strong>{{ getSystemInfo(system)?.name ?? system }}</strong>
              <small>{{ systemLine(system) }}</small>
            </span>
          </button>
        </li>
      </ul>
    </section>

    <section class="mobile-panel" data-panel="games">
      <p :if="!state.system" class="mobile-empty">{{ t('mobile.pickSystem') }}</p>
      <p :elseif="!groupedRows.has(state.system)" class="mobile-empty">{{ t('mobile.reading') }}</p>
      <p :elseif="games.length === 0" class="mobile-empty">{{ t('mobile.noGames') }}</p>
      <ul :else class="mobile-list">
        <li :each="row in games" :key="row.key">
          <button :class="\`mobile-row \${state.game === row.id ? 'on' : ''}\`" @click="pickGame(row)">
            <span class="mobile-row-cover">
              <img :if="coverOf(row)?.url" :src="coverOf(row).url" alt="" loading="lazy" />
              <span :else></span>
            </span>
            <span class="mobile-row-text">
              <strong>{{ row.title }}</strong>
              <small>{{ gameLine(row) }}</small>
            </span>
          </button>
        </li>
      </ul>
    </section>

    <section class="mobile-panel" data-panel="game">
      <slot :if="game"></slot>
      <p :else class="mobile-empty">{{ t('mobile.pickGame') }}</p>
    </section>
  </div>
</div>
`,_h={"../components/Icon.html":ne,"../components/SystemLogo.html":_t,"../helpers/mobile-panels":Eh,"../helpers/system-info":Tn,"../helpers/rom-covers":Gn,"../lib/ui-state":ie},Ah="views/MobilePanels.html";let To;To=new q(Rh,{modules:_h,filename:Ah});const Ih=To;function Pa(){return globalThis.navigator?.storage??null}const Ph={async status(){const e=Pa(),t=await e?.estimate?.().catch(()=>{}),n=e?.persisted?await e.persisted().catch(()=>null):null;return{usage:typeof t?.usage=="number"?t.usage:null,quota:typeof t?.quota=="number"?t.quota:null,persistent:n}},async persist(){const e=Pa();return e?.persist?e.persisted&&await e.persisted().catch(()=>!1)?!0:e.persist().catch(()=>!1):!1}};function Nh(e,t){const n=["B","KB","MB","GB","TB"];let a=e,r=0;for(;a>=1024&&r<n.length-1;)a/=1024,r++;const i=r===0||a>=100?0:1;return`${a.toLocaleString(t,{maximumFractionDigits:i})} ${n[r]}`}const jo=Object.freeze(Object.defineProperty({__proto__:null,LibraryStorageService:Ph,formatBytes:Nh},Symbol.toStringTag,{value:"Module"})),Lh=`<!--
  Preferences: theme, language, region order and, with a library, its storage.

  Events: theme-mode-change (mode), locale-change (preference),
  region-order-change (order), close. \`canChangeRegions\` is false while no
  library or folder is open (the order is stored in its \`.meta\`).
-->
<script
  :setup="{ open = false, themeMode = &quot;auto&quot;, locale = &quot;auto&quot;, regionOrder = [], canChangeRegions = false, library = false }">const [Icon, { THEME_MODES }, { LOCALE_LABELS, LOCALE_PREFERENCES }, { LibraryStorageService, formatBytes }, { REGION_ORDERS, parseRegionOrder, regionOrderKey }, { t }] = await $importAll([
  "../components/Icon.html",
  "../helpers/theme",
  "../helpers/i18n",
  "../lib/LibraryStorageService",
  "../helpers/rom-regions",
  "../lib/ui-state"
]);
let storage = void 0;
const readStorage = (isOpen, hasLibrary) => {
  if (!isOpen || !hasLibrary) return;
  LibraryStorageService.status().then((status) => {
    storage = status;
  }).catch(() => {
    storage = void 0;
  });
};
const askPersistence = async () => {
  await LibraryStorageService.persist();
  storage = await LibraryStorageService.status();
};
const dialog = () => $self("dialog");
const sync = (isOpen) => {
  const element = dialog();
  if (!element) return;
  if (isOpen && !element.open) element.showModal();
  if (!isOpen && element.open) element.close();
};
const onBackdrop = (event) => {
  if (event.target === dialog()) dialog()?.close();
};
$: readStorage(open, library);
$: sync(open);
await $mounted();
sync(open);
<\/script>

<dialog class="modal-dialog" :aria-label="t('prefs.title')" @close="$emit('close')" @click="onBackdrop">
  <header class="modal-header">
    <h3>{{ t('prefs.title') }}</h3>
    <button class="modal-close" @click="dialog()?.close()" :title="t('prefs.close')">
      <Icon name="close" />
    </button>
  </header>

  <div class="modal-content">
    <section class="prefs-group">
      <h4>{{ t('prefs.theme.title') }}</h4>
      <div class="prefs-segmented" role="group" :aria-label="t('prefs.theme.title')">
        <button
          :each="mode in THEME_MODES"
          :key="mode"
          :class="\`prefs-segment \${mode === themeMode ? 'on' : ''}\`"
          :aria-pressed="mode === themeMode ? 'true' : 'false'"
          @click="$emit('theme-mode-change', mode)"
        >
          {{ t(\`prefs.theme.\${mode}\`) }}
        </button>
      </div>
      <p class="prefs-hint">{{ t('prefs.theme.hint') }}</p>
    </section>

    <section class="prefs-group">
      <h4>{{ t('prefs.locale.title') }}</h4>
      <div class="prefs-segmented" role="group" :aria-label="t('prefs.locale.title')">
        <button
          :each="preference in LOCALE_PREFERENCES"
          :key="preference"
          :class="\`prefs-segment \${preference === locale ? 'on' : ''}\`"
          :aria-pressed="preference === locale ? 'true' : 'false'"
          @click="$emit('locale-change', preference)"
        >
          {{ preference === 'auto' ? t('prefs.locale.auto') : LOCALE_LABELS[preference] }}
        </button>
      </div>
      <p class="prefs-hint">{{ t('prefs.locale.hint') }}</p>
    </section>

    <section class="prefs-group">
      <h4>{{ t('prefs.regions.title') }}</h4>
      <select
        class="prefs-select"
        :value="regionOrderKey(regionOrder)"
        :disabled="!canChangeRegions"
        @change="$emit('region-order-change', parseRegionOrder($event.target.value))"
      >
        <option :each="order in REGION_ORDERS" :key="regionOrderKey(order)" :value="regionOrderKey(order)">
          {{ regionOrderKey(order) }}
        </option>
      </select>
      <p class="prefs-hint">{{ canChangeRegions ? t('prefs.regions.hint') : t('prefs.regions.locked') }}</p>
    </section>

    <section :if="library" class="prefs-group">
      <h4>{{ t('prefs.storage.title') }}</h4>
      <div :if="storage?.usage != null && storage.quota != null" class="prefs-storage-meter" aria-hidden="true">
        <span :style="\`width: \${Math.min(100, (storage.usage / storage.quota) * 100)}%\`"></span>
      </div>
      <p :if="storage?.usage != null && storage.quota != null" class="prefs-hint">
        {{ t('prefs.storage.usage', { used: formatBytes(storage.usage), quota: formatBytes(storage.quota) }) }}
      </p>
      <p :else class="prefs-hint">{{ t('prefs.storage.unknown') }}</p>
      <p :if="storage?.persistent" class="prefs-hint">{{ t('prefs.storage.persistent') }}</p>
      <p :if="!storage?.persistent" class="prefs-hint">{{ t('prefs.storage.bestEffort') }}</p>
      <button :if="!storage?.persistent" class="prefs-segment" @click="askPersistence()">{{ t('prefs.storage.ask') }}</button>
    </section>
  </div>
</dialog>
`,zh={"../components/Icon.html":ne,"../helpers/theme":jc,"../helpers/i18n":Ac,"../lib/LibraryStorageService":jo,"../helpers/rom-regions":za,"../lib/ui-state":ie},Th="views/PreferencesModal.html";let Do;Do=new q(Lh,{modules:zh,filename:Th});const jh=Do,Dh=`<!--
  Files dropped on the details pane: images for the game on screen (what each
  is a picture of, and for which region), files the catalogue knows (taken as
  games, or copied as they are) and the rest, copied. Opens as it mounts.
  Events: confirm (DropDecision), cancel (closed by any means).
-->
<script :setup="{ files = [], target, intake = void 0, busy = void 0, error = void 0 }">const [Icon, { GLOBAL_SCOPE, isImageName, MEDIA_KINDS, MEDIA_SCOPES }, { itemsOf, offerOf, splitDrop }, { parentOf: folderOf }, { t }] = await $importAll([
  "../components/Icon.html",
  "../helpers/rom-media",
  "../lib/RomIntakeService",
  "../helpers/tree",
  "../lib/ui-state"
]);
const images = target.kind === "game" ? files.filter((file) => isImageName(file.name)) : [];
const rest = files.filter((file) => !images.includes(file));
const folder = target.kind === "game" ? target.folder : target.path;
const offers = new Map(
  rest.flatMap((file) => {
    const offer = intake && offerOf(file, intake);
    return offer ? [[file, offer]] : [];
  })
);
let choices = Object.fromEntries(
  images.map((file) => [file.name, { kind: "case", scope: GLOBAL_SCOPE }])
);
let taking = new Set([...offers].filter(([, offer]) => offer.pending.length > 0).map(([file]) => file));
const choiceOf = (file) => choices[file.name] ?? { kind: "case", scope: GLOBAL_SCOPE };
const update = (file, change) => {
  choices = { ...choices, [file.name]: { ...choiceOf(file), ...change } };
};
const take = (file, asGame) => {
  const next = new Set(taking);
  if (asGame) next.add(file);
  else next.delete(file);
  taking = next;
};
$: split = splitDrop(rest, taking, intake ?? []);
const confirm = () => $emit("confirm", {
  images: images.map((file) => ({ file, ...choiceOf(file) })),
  files: split.copied,
  intake: split.intake
});
$: destination = (target.kind === "game" ? target.folder : target.path) || t("drop.root");
const copiedTo = (file) => folder ? \`\${folder}/\${file.name}\` : file.name;
const whereOf = (file, offer) => {
  if (!taking.has(file)) return copiedTo(file);
  const along = offer.pending.length - 1;
  return along > 0 ? t("drop.andMore", { path: offer.path, count: along }) : offer.path;
};
$: hint = offers.size > 0 ? t("drop.hint.intake", { folder: destination }) : t("drop.hint.plain", { folder: destination });
const alongOf = (file) => itemsOf(file, split.along)[0];
const dialog = () => $self("dialog");
const dismiss = () => dialog()?.close();
const onBackdrop = (event) => {
  if (event.target === dialog() && !busy) dismiss();
};
await $mounted();
if (!dialog()?.open) dialog()?.showModal();
<\/script>

<dialog class="modal-dialog drop-dialog" :aria-label="t('drop.label')" @close="$emit('cancel')" @click="onBackdrop">
  <header class="modal-header">
    <h3>{{ target.kind === 'game' ? t('drop.toGame', { title: target.title }) : t('drop.toFolder', { folder: target.path || t('drop.root') }) }}</h3>
    <button class="modal-close" @click="dismiss" :disabled="Boolean(busy)">
      <Icon name="close" />
    </button>
  </header>

  <div class="modal-content">
    <div :if="error" class="lookup-error">{{ error }}</div>

    <section :if="images.length > 0" class="prefs-group">
      <h4>{{ images.length > 1 ? t('drop.images.many') : t('drop.images.one') }}</h4>
      <ul class="drop-images">
        <li :each="file in images" :key="file.name" class="drop-image">
          <span class="drop-image-name" :title="file.name">{{ file.name }}</span>
          <select class="prefs-select" :value="choiceOf(file).kind" :disabled="Boolean(busy)" @change="update(file, { kind: $event.target.value })">
            <option :each="kind in MEDIA_KINDS" :key="kind" :value="kind">{{ t(\`media.kind.\${kind}\`) }}</option>
          </select>
          <select class="prefs-select" :value="choiceOf(file).scope" :disabled="Boolean(busy)" @change="update(file, { scope: $event.target.value })">
            <option :each="scope in MEDIA_SCOPES" :key="scope" :value="scope">{{ scope === GLOBAL_SCOPE ? t('media.scope.global') : scope }}</option>
          </select>
        </li>
      </ul>
      <p class="prefs-hint">{{ t('drop.images.hint') }}</p>
    </section>

    <section :if="rest.length > 0" class="prefs-group">
      <h4>{{ rest.length > 1 ? t('drop.files.many') : t('drop.files.one') }}</h4>
      <ul class="drop-files">
        <li :each="file, at in rest" :key="\`\${at}:\${file.name}\`" :class="offers.get(file) || alongOf(file) ? 'drop-file' : undefined">
          <span :if="!offers.get(file) && !alongOf(file)">{{ file.name }}</span>
          <span :else class="drop-file-name" :title="file.name">{{ file.name }}</span>

          <span :if="!offers.get(file) && alongOf(file)" class="drop-file-note">{{ t('drop.alongGame') }}</span>
          <span :if="!offers.get(file) && alongOf(file)" class="drop-file-where" :title="alongOf(file).path">{{ alongOf(file).path }}</span>

          <select
            :if="offers.get(file) && offers.get(file).pending.length > 0"
            class="prefs-select"
            :value="taking.has(file) ? 'game' : 'copy'"
            :disabled="Boolean(busy)"
            @change="take(file, $event.target.value === 'game')"
          >
            <option value="game">{{ t('drop.asGame', { title: offers.get(file).match.title }) }}</option>
            <option value="copy">{{ t('drop.asIs') }}</option>
          </select>
          <span :elseif="offers.get(file)" class="drop-file-note">
            {{ t('drop.already', { title: offers.get(file).match.title, folder: folderOf(offers.get(file).path) || t('drop.root') }) }}
          </span>
          <span :if="offers.get(file)" class="drop-file-where" :title="whereOf(file, offers.get(file))">{{ whereOf(file, offers.get(file)) }}</span>
        </li>
      </ul>
      <p class="prefs-hint">{{ hint }}</p>
    </section>
  </div>

  <div class="modal-actions">
    <button class="btn-cancel" @click="dismiss" :disabled="Boolean(busy)">{{ t('drop.cancel') }}</button>
    <button class="btn-apply" @click="confirm" :disabled="Boolean(busy)">
      {{ busy ?? (files.length > 1 ? t('drop.confirmMany', { count: files.length }) : t('drop.confirm')) }}
    </button>
  </div>
</dialog>
`,Bh={"../components/Icon.html":ne,"../helpers/rom-media":Fn,"../lib/RomIntakeService":bn,"../helpers/tree":wo,"../lib/ui-state":ie},Fh="views/MediaDropModal.html";let Bo;Bo=new q(Dh,{modules:Bh,filename:Fh});const qh=Bo,Gh=`<!--
  What a batch of dropped or picked files is about to become: the games the
  catalogue named, their companions, the files nothing claimed, and what could
  not be read. Opens as it mounts. Events: confirm, cancel (closed by any means).
-->
<script :setup="{ items = [], busy = void 0, error = void 0 }">const [Icon, { isPlaced }, { t }] = await $importAll([
  "../components/Icon.html",
  "../lib/RomIntakeService",
  "../lib/ui-state"
]);
const REFUSAL_KEYS = {
  zip64: "intake.refused.zip64",
  encrypted: "intake.refused.encrypted",
  method: "intake.refused.method",
  damaged: "intake.refused.damaged"
};
$: games = items.filter((item) => item.match && !item.refused);
$: companions = items.filter((item) => !item.match && item.path && !item.refused);
$: strays = items.filter((item) => !item.path && !item.refused);
$: refused = items.filter((item) => item.refused);
$: adding = items.filter(isPlaced).length;
$: systems = [...new Set(games.map((item) => item.match.system))];
const dialog = () => $self("dialog");
const dismiss = () => dialog()?.close();
const onBackdrop = (event) => {
  if (event.target === dialog() && !busy) dismiss();
};
await $mounted();
if (!dialog()?.open) dialog()?.showModal();
<\/script>

<dialog class="modal-dialog drop-dialog" :aria-label="t('intake.label')" @close="$emit('cancel')" @click="onBackdrop">
  <header class="modal-header">
    <h3>{{ systems.length === 1 ? t('intake.toSystem', { system: systems[0] }) : t('intake.toLibrary') }}</h3>
    <button class="modal-close" @click="dismiss" :disabled="Boolean(busy)">
      <Icon name="close" />
    </button>
  </header>

  <div class="modal-content">
    <div :if="error" class="lookup-error">{{ error }}</div>

    <section :if="games.length > 0" class="prefs-group">
      <h4>{{ games.length > 1 ? t('intake.games.many', { count: games.length }) : t('intake.games.one') }}</h4>
      <ul class="intake-list">
        <li :each="item, at in games" :key="\`\${at}:\${item.name}\`" :class="\`intake-item \${item.taken ? 'taken' : ''}\`">
          <span class="intake-title">{{ item.match.title }}</span>
          <span class="intake-where">{{ item.match.system }} · {{ item.match.variant }}<span :if="item.archive" class="intake-archive">{{ t('intake.from', { archive: item.archive }) }}</span></span>
          <span class="intake-path" :title="item.path">{{ item.taken ? t('intake.taken', { path: item.path ?? '' }) : item.path }}</span>
        </li>
      </ul>
      <p class="prefs-hint">{{ t('intake.games.hint') }}</p>
    </section>

    <section :if="companions.length > 0" class="prefs-group">
      <h4>{{ companions.length > 1 ? t('intake.companions.many') : t('intake.companions.one') }}</h4>
      <ul class="drop-files">
        <li :each="item, at in companions" :key="\`\${at}:\${item.name}\`" :class="item.taken ? 'taken' : ''">
          {{ item.taken ? t('intake.companions.already', { name: item.name }) : item.name }}
        </li>
      </ul>
      <p class="prefs-hint">{{ t('intake.companions.hint') }}</p>
    </section>

    <section :if="strays.length > 0" class="prefs-group">
      <h4>{{ t('intake.strays.title') }}</h4>
      <ul class="drop-files">
        <li :each="item, at in strays" :key="\`\${at}:\${item.name}\`">{{ item.name }}<small :if="item.archive" class="intake-archive">{{ t('intake.from', { archive: item.archive }) }}</small></li>
      </ul>
      <p class="prefs-hint">{{ t('intake.strays.hint') }}</p>
    </section>

    <section :if="refused.length > 0" class="prefs-group">
      <h4>{{ t('intake.refused.title') }}</h4>
      <ul class="drop-files">
        <li :each="item, at in refused" :key="\`\${at}:\${item.name}\`">{{ item.name }} — {{ t(REFUSAL_KEYS[item.refused]) }}</li>
      </ul>
    </section>
  </div>

  <div class="modal-actions">
    <button class="btn-cancel" @click="dismiss" :disabled="Boolean(busy)">{{ t('intake.cancel') }}</button>
    <button class="btn-apply" @click="$emit('confirm')" :disabled="Boolean(busy) || adding === 0">
      {{ busy ?? (adding > 1 ? t('intake.confirmMany', { count: adding }) : t('intake.confirm')) }}
    </button>
  </div>
</dialog>
`,Uh={"../components/Icon.html":ne,"../lib/RomIntakeService":bn,"../lib/ui-state":ie},Wh="views/RomIntakeModal.html";let Fo;Fo=new q(Gh,{modules:Uh,filename:Wh});const Hh=Fo,Vh=`<!--
  The plan to rename and sort a system folder to match the catalogue, before and
  after it is applied. Events: confirm, undo, close.
-->
<script :setup="{ system = &quot;&quot;, plan, applied = void 0, busy = void 0 }">const [Icon, { t }] = await $importAll(["../components/Icon.html", "../lib/ui-state"]);
const PREVIEW_LIMIT = 200;
const shorten = (items) => items.slice(0, PREVIEW_LIMIT);
$: hidden = plan.moves.length - PREVIEW_LIMIT;
const reasonOf = (reason) => reason === "duplicate-target" ? t("organize.reason.duplicateTarget") : reason === "target-taken" ? t("organize.reason.targetTaken") : t("organize.reason.swap");
<\/script>

<div class="organize-backdrop" @click="busy ? undefined : $emit('close')">
  <div class="organize-panel" @click.stop="">
    <header class="organize-header">
      <h2>{{ applied ? t('organize.done', { system }) : t('organize.title', { system }) }}</h2>
      <button class="organize-close" @click="$emit('close')" :disabled="Boolean(busy)">
        <Icon name="close" />
      </button>
    </header>

    <div class="organize-summary">
      <span><strong>{{ plan.moves.length }}</strong> {{ t('organize.moving') }}</span>
      <span><strong>{{ plan.settled }}</strong> {{ t('organize.settled') }}</span>
      <span :if="plan.markers.length > 0"><strong>{{ plan.markers.length }}</strong> {{ t('organize.markers') }}</span>
      <span :if="plan.conflicts.length > 0" class="organize-warn"><strong>{{ plan.conflicts.length }}</strong> {{ t('organize.conflicts') }}</span>
    </div>

    <div :if="busy" class="organize-busy">{{ busy }}</div>

    <div class="organize-body">
      <section :if="plan.conflicts.length > 0">
        <h3>{{ t('organize.untouched') }}</h3>
        <ul class="organize-list">
          <li :each="conflict in shorten(plan.conflicts)" :key="conflict.from" class="organize-conflict">
            <code>{{ conflict.from }}</code>
            <small>{{ reasonOf(conflict.reason) }}</small>
          </li>
        </ul>
      </section>

      <section :if="plan.moves.length > 0">
        <h3>{{ applied ? t('organize.moved') : t('organize.willMove') }}</h3>
        <ul class="organize-list">
          <li :each="move in shorten(plan.moves)" :key="move.from">
            <code>{{ move.from }}</code>
            <span class="organize-arrow"><Icon name="arrow-right" /></span>
            <code>{{ move.to }}</code>
          </li>
        </ul>
        <p :if="hidden > 0" class="organize-more">{{ t('organize.more', { count: hidden }) }}</p>
      </section>

      <p :if="plan.moves.length === 0 && plan.conflicts.length === 0" class="organize-empty">{{ t('organize.settledAll') }}</p>
    </div>

    <footer :if="applied" class="organize-actions">
      <button @click="$emit('undo')" :disabled="Boolean(busy)">{{ t('organize.undo') }}</button>
      <button class="primary" @click="$emit('close')" :disabled="Boolean(busy)">{{ t('organize.close') }}</button>
    </footer>
    <footer :else class="organize-actions">
      <button @click="$emit('close')" :disabled="Boolean(busy)">{{ t('organize.cancel') }}</button>
      <button
        class="primary danger"
        @click="$emit('confirm')"
        :disabled="Boolean(busy) || plan.moves.length + plan.markers.length === 0"
      >{{ t('organize.confirm', { count: plan.moves.length }) }}</button>
    </footer>
  </div>
</div>
`,Kh={"../components/Icon.html":ne,"../lib/ui-state":ie},Yh="views/OrganizePanel.html";let qo;qo=new q(Vh,{modules:Kh,filename:Yh});const Zh=qo,Jh=8*1024*1024;function Qe(e,t){return e?`${be}/${e}/${t}`:`${be}/${t}`}class Xh{static listings=new WeakMap;static async entriesOf(t,n){const a=this.listings.get(t)??new Map;this.listings.set(t,a);const r=a.get(n);if(r)return r;const i=t.list(n?`${be}/${n}`:be).catch(()=>[]);return a.set(n,i),i}static forget(t,n){this.listings.get(t)?.delete(n)}static async storedCovers(t,n,a){const r={byRegion:{}};for(const i of await this.entriesOf(t,n)){const o=Oo(i.name);!o||o.kind!==It||o.gameId!==a||(o.region?r.byRegion[o.region]=i.name:r.game=i.name)}return r}static async stored(t,n,a,r){for(const i of _o(a,r))try{const o=await t.readFile(Qe(n,i));return URL.createObjectURL(new Blob([o]))}catch{}}static async save(t,n,a,r,i){const o=Pt(a,r);return await t.createDirectory(`${be}/${n}`),await t.writeFile(Qe(n,o),i),this.forget(t,n),o}static async download(t){try{const n=await fetch(t);if(!n.ok)return;const a=await n.blob();return a.size===0||a.size>Jh?void 0:new Uint8Array(await a.arrayBuffer())}catch{return}}static async cache(t,n,a,r,i=!1){return r.url?await this.write(t,n,[Ve(a,r)],r.url,i)>0:!!r.file}static async write(t,n,a,r,i=!1){const o=[];for(const l of a)(i||!await t.exists(Qe(n,l)))&&o.push(l);if(o.length===0)return a.length;const s=await this.download(r);if(!s)return a.length-o.length;await t.createDirectory(`${be}/${n}`);for(const l of o)await t.writeFile(Qe(n,l),s);return this.forget(t,n),a.length}static async cacheAll(t,n,a,r){const i=new Map;for(const s of Ao(r)){const l=i.get(s.url)??[];l.push(s),i.set(s.url,l)}return(await Promise.all(Array.from(i,([s,l])=>this.write(t,n,l.map(c=>Ve(a,c)),s,!0)))).reduce((s,l)=>s+l,0)}static async resolve(t,n,a,r){if(!r)return;const i=await this.stored(t,n,a,r);if(i)return{url:i,stored:!0};if(r.url)return this.cache(t,n,a,r),{url:r.url,stored:!1}}}const Qh=Object.freeze(Object.defineProperty({__proto__:null,CoverService:Xh},Symbol.toStringTag,{value:"Module"})),ef="rom-manager-handles",tf=1,bt="handles";function et(){return new Promise((e,t)=>{const n=indexedDB.open(ef,tf);n.onupgradeneeded=()=>{const a=n.result;a.objectStoreNames.contains(bt)||a.createObjectStore(bt,{keyPath:"id"})},n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error)})}function tt(e,t){return e.transaction(bt,t).objectStore(bt)}class nf{static async save(t){const n=await et();try{await new Promise((a,r)=>{const i=tt(n,"readwrite").put(t);i.onsuccess=()=>a(),i.onerror=()=>r(i.error)})}finally{n.close()}}static async remove(t){const n=await et();try{await new Promise((a,r)=>{const i=tt(n,"readwrite").delete(t);i.onsuccess=()=>a(),i.onerror=()=>r(i.error)})}finally{n.close()}}static async loadAll(){const t=await et();try{return await new Promise((n,a)=>{const r=tt(t,"readonly").getAll();r.onsuccess=()=>n(r.result),r.onerror=()=>a(r.error)})}finally{t.close()}}static async clear(){const t=await et();try{await new Promise((n,a)=>{const r=tt(t,"readwrite").clear();r.onsuccess=()=>n(),r.onerror=()=>a(r.error)})}finally{t.close()}}}const af=Object.freeze(Object.defineProperty({__proto__:null,HandleStoreService:nf},Symbol.toStringTag,{value:"Module"}));function rf(e){return e.slice(e.lastIndexOf("/")+1)}function of(e,t){const n=[];for(let a=e.lastIndexOf("/");a>t.length;a=e.lastIndexOf("/",a-1))n.push(e.slice(0,a));return n}function sf(e){return e.fileName??e.name}function lf(e,t,n,a=new Map,r="cartridge"){const i=e?`${e}/`:"",o=[],s=new Set,l=new Set;for(const c of n.groups){if(c.status==="missing")continue;const d=c.group.id,f=[],b=[],E=new Set,B=new Set;for(const N of c.variants){const T=N.files.map(k=>{const _=k.local?.path,z=k.entry.crc;if(_===void 0||!_.startsWith(i))return{label:sf(k.entry),crc:z};b.push(_);for(const v of N.variant.regions)E.add(v);s.add(_);for(const v of of(_,e))l.add(v);const G=_.includes("/")?_.slice(0,_.indexOf("/")):"",W=k.entry.fileName??k.entry.name,K=Vo(G,r,c.group,N.variant,W),te=_===K;return{label:rf(_),path:_,crc:z,isConsolidated:te}});T.some(k=>k.path)&&B.add(N.variant.key),f.push({key:N.variant.key,status:N.status,regions:N.variant.regions,videoStandards:N.variant.videoStandards,files:T,cover:qn(N.variant)})}b.length!==0&&o.push({kind:"group",key:`group:${d}`,id:d,label:d,title:c.group.title,status:c.status,variants:f,paths:b,covers:Ro(c.group,a.get(Eo(c.group)),B),presentRegions:Ta.filter(N=>E.has(N))})}for(const c of t)(c.kind==="file"?s.has(c.path):l.has(c.path))||o.push({kind:"entry",key:c.path,label:c.name,entry:c});return o}const cf=Object.freeze(Object.defineProperty({__proto__:null,buildWizardTree:lf},Symbol.toStringTag,{value:"Module"})),df=`<!--
  The explorer: the open origins (the library and any folders), the tree and the
  details pane — or, on a phone, the swiped panels — and every dialog they open.

  State that outlives a tab (origins, the active one, its selection, errors, the
  known systems, the grouping settings) is the services' (\`ui\` in ../state);
  what is on screen for the open tab is kept here.
-->
<script :setup>const [
  Header,
  WelcomePanel,
  FileTree,
  RomDetails,
  MobilePanels,
  PreferencesModal,
  MediaDropModal,
  RomIntakeModal,
  OrganizePanel,
  ConfirmModal,
  { storageService, LIBRARY_ORIGIN_ID, canOpenFolders, isLibraryAvailable },
  { LibraryStorageService },
  { RomLibrary, gameNameOf, systemOf },
  { GameCatalogService },
  { CoverService },
  { OrganizeService },
  { RomIntakeService, isPlaced },
  { ROMDatasetService },
  { isWizardFolder, WizardConfigService },
  { setThemeMode },
  { setLocalePreference },
  { HandleStoreService },
  { buildWizardTree },
  { isSharedCover, pickCover },
  { imageExtensionOf, isImageName, regionOfScope },
  { filterPlanForPath },
  { storeService },
  { ui, t },
  { LibraryIndexService },
  { ModService },
  { gameIdOf },
  { isPatchName },
  { isPlayGermade, LAUNCHER_BASE },
  { PlayGermadeMigration }
] = await $importAll([
  "./Header.html",
  "./WelcomePanel.html",
  "./FileTree.html",
  "./RomDetails.html",
  "./MobilePanels.html",
  "./PreferencesModal.html",
  "./MediaDropModal.html",
  "./RomIntakeModal.html",
  "./OrganizePanel.html",
  "../components/ConfirmModal.html",
  "../lib/StorageService",
  "../lib/LibraryStorageService",
  "../lib/RomLibraryService",
  "../lib/GameCatalogService",
  "../lib/CoverService",
  "../lib/OrganizeService",
  "../lib/RomIntakeService",
  "../lib/ROMDatasetService",
  "../lib/WizardConfigService",
  "../lib/ThemeService",
  "../lib/I18nService",
  "../lib/HandleStoreService",
  "../helpers/wizard-tree",
  "../helpers/rom-covers",
  "../helpers/rom-media",
  "../helpers/rom-organize",
  "../lib/StoreService",
  "../lib/ui-state",
  "../lib/LibraryIndexService",
  "../lib/ModService",
  "../helpers/library-index",
  "../helpers/patch",
  "../lib/host",
  "../lib/PlayGermadeMigration"
]);
const gameKey = (romPath) => \`\${systemOf(romPath)}/\${gameNameOf(romPath)}\`;
const systemFolderOf = (path) => {
  const separator = path.indexOf("/");
  return separator === -1 ? path : path.slice(0, separator);
};
const parentOf = (path) => {
  const separator = path.lastIndexOf("/");
  return separator === -1 ? "" : path.slice(0, separator);
};
const regionsOfFile = (game2, path) => path ? game2.variants.find((variant) => variant.files.some((file) => file.path === path))?.regions : void 0;
const isFileDrag = (event) => Array.from(event.dataTransfer?.types ?? []).includes("Files");
const intakeNotice = ({ file, read, size, done, total }) => {
  const percent = size > 0 ? Math.min(100, Math.round(read / size * 100)) : 100;
  return total > 1 ? t("progress.identifyingFileOf", { file, percent, done: done + 1, total }) : t("progress.identifyingFile", { file, percent });
};
const identifyingNotice = (files) => files.length > 1 ? t("progress.identifyingMany", { count: files.length }) : t("progress.identifying", { file: files[0].name });
class Book {
  /** Systems whose library folder has already been listed. */
  indexedSystems = /* @__PURE__ */ new Set();
  /** Folders whose grouped rows are already being worked out. */
  grouping = /* @__PURE__ */ new Set();
  /** Object URLs minted for local covers, revoked when they are replaced. */
  objectUrls = [];
  /** Persisted handles restored from IndexedDB on startup. */
  restoredHandles = /* @__PURE__ */ new Map();
  /** Where the next pick goes: the library from the welcome panel, else the open tab. */
  pickTarget = "active";
  /** Mods picked together with ROMs: taken once the ROMs are in (or the intake is dropped). */
  pendingMods = void 0;
}
const book = new Book();
let storageNodes = /* @__PURE__ */ new Map();
let records = /* @__PURE__ */ new Map();
let stats = /* @__PURE__ */ new Map();
let coverUrls = /* @__PURE__ */ new Map();
let initialised = /* @__PURE__ */ new Set();
let groupedRows = /* @__PURE__ */ new Map();
let notice = void 0;
let editing = false;
let game = void 0;
let gameFile = void 0;
let folder = void 0;
let gameCover = void 0;
let drop = void 0;
let dropBusy = void 0;
let dropError = void 0;
let dropping = false;
let intake = void 0;
let intakeBusy = void 0;
let intakeError = void 0;
let mediaVersion = 0;
let gameMods = void 0;
let modsVersion = 0;
let refreshToken = 0;
let organize = void 0;
let organizeBusy = void 0;
let preferences = false;
let showLanding = true;
let syncAsk = false;
let syncBusy = false;
const libraryAvailable = isLibraryAvailable();
const foldersAvailable = canOpenFolders();
const PHONE_QUERY = "(max-width: 768px), (max-height: 500px) and (pointer: coarse)";
let phone = globalThis.matchMedia?.(PHONE_QUERY).matches ?? false;
const phoneList = globalThis.matchMedia?.(PHONE_QUERY);
const onPhoneChange = () => {
  phone = phoneList?.matches ?? false;
};
phoneList?.addEventListener("change", onPhoneChange);
$destroyed(() => phoneList?.removeEventListener("change", onPhoneChange));
$: activeOrigin = ui.activeOriginId ? ui.origins.find((origin) => origin.id === ui.activeOriginId) : void 0;
$: activeNode = ui.activeOriginId ? storageNodes.get(ui.activeOriginId) : void 0;
$: selection = activeOrigin?.selection || [];
$: knownSet = new Set(ui.knownSystems);
$: regionOrder = ui.wizardSettings.regionOrder;
$: hasLibrary = storageNodes.has(LIBRARY_ORIGIN_ID);
$destroyed(() => {
  for (const url of book.objectUrls) URL.revokeObjectURL(url);
});
const readWizardSettings = (node) => {
  if (!node) return;
  queueMicrotask(() => {
    WizardConfigService.read(node).then((settings) => storeService.setWizardSettings(settings)).catch(() => void 0);
  });
};
$: readWizardSettings(activeNode);
const showCover = /* @__PURE__ */ (() => {
  let token = 0;
  let shown;
  const revoke = (url) => {
    if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
  };
  return (node, picked, file, order, _version) => {
    const mine = ++token;
    revoke(shown);
    shown = void 0;
    gameCover = void 0;
    if (!node || !picked) return;
    queueMicrotask(async () => {
      try {
        const system = systemOf(picked.paths[0]);
        const stored = await CoverService.storedCovers(node, system, picked.id).catch(() => void 0);
        const selectedVariant = file ? picked.variants.find((v) => v.files.some((f) => f.path === file)) : void 0;
        const cover = pickCover(picked.covers, {
          present: regionsOfFile(picked, file) ?? picked.presentRegions,
          order,
          stored,
          variantUrl: selectedVariant?.cover,
          variantRegion: selectedVariant?.regions[0]
        });
        const resolved = await CoverService.resolve(node, system, picked.id, cover);
        if (mine !== token) {
          revoke(resolved?.url);
          return;
        }
        shown = resolved?.url;
        const region = cover && !isSharedCover(picked.covers, cover) ? cover.region : void 0;
        gameCover = resolved ? { url: resolved.url, publishedUrl: cover?.url, region } : void 0;
      } catch {
        if (mine === token) gameCover = void 0;
      }
    });
  };
})();
$: showCover(activeNode, game, gameFile, regionOrder, mediaVersion);
const cacheCovers = (node, picked, known) => {
  if (!node || !picked) return;
  if (!picked.paths.some((path) => known.get(path))) return;
  queueMicrotask(() => void CoverService.cacheAll(node, systemOf(picked.paths[0]), picked.id, picked.covers));
};
$: cacheCovers(activeNode, game, records);
const releaseCovers = () => {
  for (const url of book.objectUrls) URL.revokeObjectURL(url);
  book.objectUrls = [];
};
const loadSelection = async (node, paths) => {
  const lib = new RomLibrary(node);
  const loaded = await lib.readMany(paths);
  const statEntries = await Promise.all(paths.map(async (path) => [path, await node.stat(path)]));
  releaseCovers();
  const coverEntries = await Promise.all(
    paths.map(async (path) => {
      const url = await lib.coverUrl(path, loaded.get(path)?.cover);
      if (url?.startsWith("blob:")) book.objectUrls.push(url);
      return [path, url];
    })
  );
  $batch(() => {
    records = loaded;
    stats = new Map(statEntries);
    coverUrls = new Map(coverEntries.filter((entry) => Boolean(entry[1])));
  });
};
const openFolder = async () => {
  try {
    storeService.setLoading(true);
    storeService.setError(void 0);
    const node = storageService.createNodeInstance();
    const opened = await node.initialize();
    if (!opened) return;
    showLanding = false;
    const path = node.getPath();
    const name = path?.split("/").pop() || "Folder";
    const originId = \`origin-\${Date.now()}\`;
    storageNodes = new Map(storageNodes).set(originId, node);
    storeService.addOrigin({ id: originId, name, path, selection: [], kind: "folder" });
    const handle = node.getHandle();
    if (handle) HandleStoreService.save({ id: originId, name, handle }).catch(() => void 0);
  } catch (err) {
    storeService.setError(err instanceof Error ? err.message : t("errors.openFolder"));
  } finally {
    storeService.setLoading(false);
  }
};
const selectOrigin = async (originId) => {
  showLanding = false;
  const origin = ui.origins.find((candidate) => candidate.id === originId);
  if (origin?.locked) {
    const savedHandle = book.restoredHandles.get(originId);
    if (savedHandle) {
      try {
        storeService.setLoading(true);
        storeService.setError(void 0);
        const node = storageService.createNodeInstance();
        const authorized = await node.initializeFromHandle(savedHandle);
        if (!authorized) {
          storeService.setError(t("errors.deniedFolder"));
          return;
        }
        storageNodes = new Map(storageNodes).set(originId, node);
        storeService.addOrigin({ ...origin, locked: false });
      } catch (err) {
        storeService.setError(err instanceof Error ? err.message : t("errors.savedFolder"));
        return;
      } finally {
        storeService.setLoading(false);
      }
    }
  }
  book.indexedSystems = /* @__PURE__ */ new Set();
  book.grouping = /* @__PURE__ */ new Set();
  $batch(() => {
    initialised = /* @__PURE__ */ new Set();
    groupedRows = /* @__PURE__ */ new Map();
    editing = false;
    game = void 0;
    gameFile = void 0;
    storeService.setActiveOrigin(originId);
  });
};
const canGroup = (path) => knownSet.has(systemFolderOf(path));
const isGrouped = (path) => isWizardFolder(path, ui.wizardSettings, knownSet);
const groupingNeeded = async (path) => {
  const node = activeNode;
  if (!node || book.grouping.has(path)) return;
  book.grouping.add(path);
  try {
    storeService.setError(void 0);
    const system = systemFolderOf(path);
    const [match, systemCovers, entries, medium] = await Promise.all([
      GameCatalogService.load(node, system, (progress) => {
        notice = t("progress.reading", { path, done: progress.done, total: progress.total });
      }),
      GameCatalogService.coversOf(system),
      node.list(path),
      ROMDatasetService.mediaOf(system).catch(() => "cartridge")
    ]);
    groupedRows = new Map(groupedRows).set(path, buildWizardTree(path, entries, match, systemCovers, medium ?? "cartridge"));
    void LibraryIndexService.write(node, system, match).catch(() => {
    });
  } catch (err) {
    storeService.setError(err instanceof Error ? err.message : t("errors.group", { path }));
  } finally {
    notice = void 0;
  }
};
const toggleGrouping = async (path) => {
  const node = activeNode;
  if (!node) return;
  const systems = storeService.getKnownSystems();
  const grouped = isWizardFolder(path, storeService.getWizardSettings(), systems);
  try {
    storeService.setWizardSettings(await WizardConfigService.setWizard(node, path, !grouped, systems));
  } catch (err) {
    storeService.setError(err instanceof Error ? err.message : t("errors.viewMode"));
    return;
  }
  book.grouping.delete(path);
  const next = new Map(groupedRows);
  next.delete(path);
  groupedRows = next;
};
const changeRegionOrder = async (order) => {
  const node = activeNode;
  if (!node) return;
  try {
    storeService.setWizardSettings(await WizardConfigService.setRegionOrder(node, order));
  } catch (err) {
    storeService.setError(err instanceof Error ? err.message : t("errors.regionOrder"));
  }
};
const invalidateTree = () => {
  book.grouping.clear();
  $batch(() => {
    groupedRows = /* @__PURE__ */ new Map();
    records = /* @__PURE__ */ new Map();
    stats = /* @__PURE__ */ new Map();
    refreshToken += 1;
  });
};
const reindex = (() => {
  let chain = Promise.resolve();
  return (paths, node = activeNode) => {
    if (!node) return;
    const systems = paths.map(systemFolderOf).filter(Boolean);
    if (systems.length === 0) return;
    chain = chain.then(() => LibraryIndexService.refreshMany(node, systems)).catch(() => {
    });
  };
})();
const reindexAll = (node) => {
  if (!node) return;
  void LibraryIndexService.readAll(node).then((indexes) => reindex(indexes.map((index) => index.system), node));
};
const loadMods = /* @__PURE__ */ (() => {
  let token = 0;
  return (node, picked, _version) => {
    const mine = ++token;
    if (!node || !picked) {
      gameMods = void 0;
      return;
    }
    const system = systemOf(picked.paths[0]);
    queueMicrotask(async () => {
      const mods = await ModService.list(node, system).catch(() => []);
      if (mine === token) gameMods = { system, mods };
    });
  };
})();
$: loadMods(activeNode, game, modsVersion);
const modContext = () => {
  if (game) return { system: systemOf(game.paths[0]), gameId: gameIdOf(game.title) };
  const place = folder ?? (selection.length === 1 ? selection[0] : void 0);
  const system = place ? systemFolderOf(place) : void 0;
  return system && knownSet.has(system) ? { system } : {};
};
const modsNotice = (result) => {
  const parts = [];
  const assigned = result.added.filter((added) => added.gameId).length;
  if (result.added.length > 0) parts.push(t("mods.added", { count: result.added.length, assigned }));
  if (result.duplicates.length > 0) parts.push(t("mods.duplicates", { count: result.duplicates.length }));
  for (const { name, reason } of result.rejected) parts.push(t(\`mods.refused.\${reason}\`, { name }));
  return parts.join(" \\xB7 ");
};
const takeMods = async (files, node = activeNode) => {
  const patches = files.filter((file) => isPatchName(file.name));
  if (patches.length === 0 || !node) return files;
  const rest = files.filter((file) => !isPatchName(file.name));
  const run = async () => {
    try {
      const result = await ModService.import(node, patches, modContext());
      modsVersion += 1;
      notice = modsNotice(result);
      setTimeout(() => {
        if (notice === modsNotice(result)) notice = void 0;
      }, 6e3);
    } catch (err) {
      storeService.setError(err instanceof Error ? err.message : t("mods.errors.import"));
    }
  };
  if (rest.length === 0) await run();
  else book.pendingMods = run;
  return rest;
};
const afterRomsLanded = async (node, paths) => {
  if (!book.pendingMods) {
    reindex(paths, node);
    return;
  }
  await LibraryIndexService.refreshMany(node, paths.map(systemFolderOf));
  await flushMods();
};
const flushMods = async () => {
  const run = book.pendingMods;
  book.pendingMods = void 0;
  if (run) await run();
};
const modActions = {
  rename: (sha1, name) => renameMod(sha1, name),
  assign: (sha1, assign) => assignMod(sha1, assign),
  remove: (sha1) => removeMod(sha1)
};
const renameMod = async (sha1, name) => {
  const node = activeNode;
  if (!node || !gameMods) return;
  await ModService.update(node, gameMods.system, sha1, { name });
  modsVersion += 1;
};
const assignMod = async (sha1, assign) => {
  const node = activeNode;
  if (!node || !gameMods || !game) return;
  await ModService.update(node, gameMods.system, sha1, { gameId: assign ? gameIdOf(game.title) : void 0 });
  modsVersion += 1;
};
const removeMod = async (sha1) => {
  const node = activeNode;
  if (!node || !gameMods) return;
  await ModService.remove(node, gameMods.system, sha1);
  modsVersion += 1;
};
const planOrganize = async (path) => {
  const node = activeNode;
  if (!node) return;
  const system = systemFolderOf(path);
  try {
    storeService.setError(void 0);
    organizeBusy = t("organize.busy.reading", { system });
    let plan = await OrganizeService.plan(node, system, (done, total) => {
      organizeBusy = t("organize.busy.readingProgress", { system, done, total });
    });
    if (path !== system) plan = filterPlanForPath(plan, path);
    organize = { system, plan };
  } catch (err) {
    storeService.setError(err instanceof Error ? err.message : t("errors.plan", { system }));
  } finally {
    organizeBusy = void 0;
  }
};
const confirmOrganize = async () => {
  const node = activeNode;
  const current = organize;
  if (!node || !current) return;
  try {
    storeService.setError(void 0);
    organizeBusy = t("organize.busy.moving");
    const applied = await OrganizeService.apply(node, current.system, current.plan, (done, total) => {
      organizeBusy = t("organize.busy.movingProgress", { done, total });
    });
    organize = { ...current, applied };
    invalidateTree();
    reindex([current.system]);
  } catch (err) {
    storeService.setError(err instanceof Error ? err.message : t("errors.organize"));
  } finally {
    organizeBusy = void 0;
  }
};
const undoOrganize = async () => {
  const node = activeNode;
  const current = organize;
  if (!node || !current?.applied) return;
  try {
    storeService.setError(void 0);
    organizeBusy = t("organize.busy.undoing");
    await OrganizeService.undo(node, current.applied);
    organize = void 0;
    invalidateTree();
    reindex([current.system]);
  } catch (err) {
    storeService.setError(err instanceof Error ? err.message : t("errors.undo"));
  } finally {
    organizeBusy = void 0;
  }
};
const askPersistenceOnce = async () => {
  try {
    if (localStorage.getItem("rom-manager:persist-asked")) return;
    localStorage.setItem("rom-manager:persist-asked", "1");
  } catch {
  }
  await LibraryStorageService.persist();
};
const addRoms = (target = "active") => {
  book.pickTarget = target;
  $self(".rom-picker")?.click();
};
const onRomsPicked = async (event) => {
  const input = event.currentTarget;
  const files = Array.from(input.files ?? []);
  input.value = "";
  if (files.length === 0) return;
  const libraryNode = storageNodes.get(LIBRARY_ORIGIN_ID);
  const toLibrary = book.pickTarget === "library" || showLanding || !activeNode || activeOrigin?.locked;
  const node = toLibrary ? libraryNode : activeNode;
  if (!node) return;
  if (toLibrary && ui.activeOriginId !== LIBRARY_ORIGIN_ID) await selectOrigin(LIBRARY_ORIGIN_ID);
  showLanding = false;
  const roms = await takeMods(files, node);
  if (roms.length > 0) await identifyIntake(roms, node);
};
const confirmSync = async () => {
  const libraryNode = storageNodes.get(LIBRARY_ORIGIN_ID);
  const node = activeNode;
  if (!libraryNode || !node || node === libraryNode) return;
  try {
    syncBusy = true;
    storeService.setError(void 0);
    notice = t("library.sync.running");
    const result = await libraryNode.syncWith(node);
    void askPersistenceOnce();
    notice = result.changed ? t("library.sync.done", { toLibrary: result.transferred.toA, toFolder: result.transferred.toB, conflicts: result.conflicts.length }) : t("library.sync.same");
    book.grouping.clear();
    groupedRows = /* @__PURE__ */ new Map();
    refreshToken += 1;
    reindexAll(libraryNode);
    reindexAll(node);
  } catch (err) {
    notice = void 0;
    storeService.setError(err instanceof Error ? err.message : t("errors.sync"));
  } finally {
    syncBusy = false;
    syncAsk = false;
  }
};
const closeOrigin = (originId) => {
  if (originId === LIBRARY_ORIGIN_ID) return;
  book.restoredHandles.delete(originId);
  HandleStoreService.remove(originId).catch(() => void 0);
  storeService.removeOrigin(originId);
  const next = new Map(storageNodes);
  next.delete(originId);
  storageNodes = next;
};
const gameChange = (selected) => $batch(() => {
  editing = false;
  gameFile = void 0;
  game = selected ?? void 0;
});
const selectFile = (path) => $batch(() => {
  editing = false;
  gameFile = path;
});
const dropDestination = () => {
  if (game) {
    return {
      target: { kind: "game", title: game.title, folder: parentOf(game.paths[0]) },
      game: { id: game.id, system: systemOf(game.paths[0]) }
    };
  }
  if (selection.length === 1) {
    const path = selection[0];
    const record = records.get(path);
    return {
      target: { kind: "game", title: record?.title || gameNameOf(path), folder: parentOf(path) },
      game: { id: record?.id || gameNameOf(path), system: systemOf(path) }
    };
  }
  return folder === void 0 ? void 0 : { target: { kind: "folder", path: folder } };
};
const onPaneDragOver = (event) => {
  if (!isFileDrag(event)) return;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
  dropping = true;
};
const onPaneDragLeave = (event) => {
  const leaving = event.relatedTarget;
  if (!leaving || !event.currentTarget.contains(leaving)) dropping = false;
};
const onPaneDrop = (event) => {
  if (!isFileDrag(event)) return;
  event.preventDefault();
  dropping = false;
  void paneDrop(Array.from(event.dataTransfer?.files ?? []));
};
const paneDrop = async (dropped) => {
  if (dropped.length === 0 || !activeNode) return;
  const files = await takeMods(dropped);
  if (files.length === 0) return;
  const destination = dropDestination();
  if (!destination) {
    void identifyIntake(files);
    return;
  }
  storeService.setError(void 0);
  dropError = void 0;
  void openDrop(files, destination);
};
const openDrop = async (files, destination) => {
  const node = activeNode;
  const askable = files.some((file) => !isImageName(file.name));
  if (!node || !askable) {
    drop = { files, ...destination };
    return;
  }
  try {
    notice = identifyingNotice(files);
    const items = await RomIntakeService.identify(node, files, (progress) => {
      notice = intakeNotice(progress);
    });
    drop = { files, ...destination, intake: items };
  } catch (err) {
    drop = { files, ...destination };
    dropError = t("errors.catalogue", { reason: err instanceof Error ? err.message : t("errors.unknown") });
  } finally {
    notice = void 0;
  }
};
const identifyIntake = async (files, node = activeNode) => {
  if (!node) return;
  try {
    storeService.setError(void 0);
    intakeError = void 0;
    notice = identifyingNotice(files);
    const items = await RomIntakeService.identify(node, files, (progress) => {
      notice = intakeNotice(progress);
    });
    if (!items.some((item) => item.path || item.refused)) {
      storeService.setError(t("errors.noGame"));
      void flushMods();
      return;
    }
    intake = items;
  } catch (err) {
    storeService.setError(err instanceof Error ? err.message : t("errors.identify"));
    void flushMods();
  } finally {
    notice = void 0;
  }
};
const confirmIntake = async () => {
  const node = activeNode;
  const items = intake;
  if (!node || !items) return;
  try {
    intakeError = void 0;
    const addedPaths = items.filter(isPlaced).map((item) => item.path).filter(Boolean);
    await RomIntakeService.apply(node, items, ({ file, done, total }) => {
      intakeBusy = total > 1 ? t("progress.copyingOf", { file, done: done + 1, total }) : t("progress.copying", { file });
    });
    intake = void 0;
    if (activeOrigin?.kind === "library") void askPersistenceOnce();
    book.grouping.clear();
    groupedRows = /* @__PURE__ */ new Map();
    refreshToken += 1;
    if (addedPaths.length > 0) {
      gameFile = void 0;
      await selectionChange(addedPaths);
    }
    await afterRomsLanded(node, addedPaths);
  } catch (err) {
    intakeError = err instanceof Error ? err.message : t("errors.copyFiles");
  } finally {
    intakeBusy = void 0;
  }
};
const confirmDrop = async ({ images, files, intake: taken }) => {
  const node = activeNode;
  const current = drop;
  if (!node || !current) return;
  const { target } = current;
  const directory = target.kind === "game" ? target.folder : target.path;
  try {
    dropError = void 0;
    for (const image of images) {
      if (!current.game) break;
      dropBusy = t("progress.saving", { file: image.file.name });
      await CoverService.save(
        node,
        current.game.system,
        current.game.id,
        { kind: image.kind, region: regionOfScope(image.scope), extension: imageExtensionOf(image.file.name) },
        new Uint8Array(await image.file.arrayBuffer())
      );
    }
    const copiedPaths = [];
    for (const file of files) {
      dropBusy = t("progress.copying", { file: file.name });
      const path = directory ? \`\${directory}/\${file.name}\` : file.name;
      await node.writeFile(path, new Uint8Array(await file.arrayBuffer()));
      copiedPaths.push(path);
    }
    const takenPaths = [];
    if (taken.length > 0) {
      await RomIntakeService.apply(node, taken, ({ file, done, total }) => {
        dropBusy = total > 1 ? t("progress.addingOf", { file, done: done + 1, total }) : t("progress.adding", { file });
      });
      takenPaths.push(...taken.filter(isPlaced).map((item) => item.path).filter(Boolean));
    }
    drop = void 0;
    if (images.length > 0) mediaVersion += 1;
    const addedPaths = takenPaths.length > 0 ? takenPaths : copiedPaths;
    if (files.length > 0 || taken.length > 0) {
      book.grouping.clear();
      groupedRows = /* @__PURE__ */ new Map();
      refreshToken += 1;
    }
    if (addedPaths.length > 0) {
      gameFile = void 0;
      await selectionChange(addedPaths);
    }
    await afterRomsLanded(node, [...copiedPaths, ...takenPaths]);
  } catch (err) {
    dropError = err instanceof Error ? err.message : t("errors.writeFiles");
  } finally {
    dropBusy = void 0;
  }
};
const cancelDrop = () => {
  if (dropBusy) return;
  drop = void 0;
  dropError = void 0;
  void flushMods();
};
const cancelIntake = () => {
  if (intakeBusy) return;
  intake = void 0;
  intakeError = void 0;
  void flushMods();
};
const selectionChange = async (paths) => {
  $batch(() => {
    editing = false;
    storeService.setSelection(paths);
  });
  const node = activeNode;
  if (!node) return;
  try {
    storeService.setError(void 0);
    await loadSelection(node, paths);
  } catch (err) {
    storeService.setError(err instanceof Error ? err.message : t("errors.readSelection"));
  }
};
const visibleChange = async (paths) => {
  const node = activeNode;
  if (!node) return;
  const systems = new Set(paths.map(systemOf).filter(Boolean));
  const pending = Array.from(systems).filter((system) => !book.indexedSystems.has(system));
  if (pending.length === 0) return;
  const lib = new RomLibrary(node);
  const found = await Promise.all(pending.map(async (system) => [system, await lib.initializedGames(system)]));
  for (const system of pending) book.indexedSystems.add(system);
  const next = new Set(initialised);
  for (const [system, games] of found) for (const id of games) next.add(\`\${system}/\${id}\`);
  initialised = next;
};
const loadContent = async (path) => {
  const node = activeNode;
  if (!node) throw new Error("No folder is open");
  const bytes = await node.readFile(path);
  const content = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(content).set(bytes);
  return content;
};
const persist = async (lib, path, record) => {
  let stored = record;
  if (record.cover?.startsWith("https://")) {
    try {
      stored = { ...record, cover: await lib.saveCover(path, record.cover) };
    } catch {
      stored = record;
    }
  }
  await lib.write(path, stored);
};
const save = async (path, record, coverFile, coverRemoved) => {
  const node = activeNode;
  if (!node) return;
  const updated = { ...record };
  if (coverRemoved) {
    updated.cover = void 0;
  } else if (coverFile) {
    const bytes = new Uint8Array(await coverFile.arrayBuffer());
    const ext = coverFile.name.split(".").pop()?.toLowerCase() || "png";
    updated.cover = await CoverService.save(node, systemOf(path), record.id || gameNameOf(path), { kind: "case", extension: ext }, bytes);
    mediaVersion += 1;
  }
  await persist(new RomLibrary(node), path, updated);
  initialised = new Set(initialised).add(gameKey(path));
  editing = false;
  await loadSelection(node, selection);
};
const saveMany = async (changes) => {
  const node = activeNode;
  if (!node) return;
  const lib = new RomLibrary(node);
  for (const path of selection) {
    const record = records.get(path);
    if (!record) continue;
    await persist(lib, path, { ...record, ...changes });
  }
  editing = false;
  await loadSelection(node, selection);
};
const removed = (paths) => {
  reindex(paths);
  book.grouping.clear();
  groupedRows = /* @__PURE__ */ new Map();
  const affected = selection.some((selected) => paths.some((path) => selected === path || selected.startsWith(\`\${path}/\`)));
  if (!affected) return;
  releaseCovers();
  $batch(() => {
    editing = false;
    game = void 0;
    gameFile = void 0;
    storeService.setSelection([]);
    records = /* @__PURE__ */ new Map();
    stats = /* @__PURE__ */ new Map();
    coverUrls = /* @__PURE__ */ new Map();
  });
};
const deleteFiles = async (paths) => {
  const node = activeNode;
  if (!node || paths.length === 0) return;
  const lib = new RomLibrary(node);
  for (const path of paths) {
    try {
      await node.remove(path);
    } catch {
    }
    await lib.remove(path).catch(() => {
    });
  }
  removed(paths);
  refreshToken += 1;
};
const goHome = () => $batch(() => {
  storeService.setSelection([]);
  game = void 0;
  gameFile = void 0;
  folder = void 0;
  editing = false;
  notice = void 0;
  organize = void 0;
  showLanding = true;
});
const panelGame = (picked) => {
  gameChange(picked ?? void 0);
  void selectionChange(picked ? picked.paths : []);
};
$: welcome = ui.origins.length === 0 || showLanding || activeOrigin?.locked || !activeNode;
$: canSync = !showLanding && Boolean(activeNode) && activeOrigin?.kind !== "library" && hasLibrary;
$: detailsPaths = gameFile ? [gameFile] : selection;
$: detailsGame = gameFile ? void 0 : game;
$: wizardFolder = folder !== void 0 && isGrouped(folder);
$: back = game && gameFile ? { label: game.title } : void 0;
await $mounted();
const migrateFromLauncher = async (node) => {
  try {
    if (await PlayGermadeMigration.done(node)) return;
    notice = t("host.migration.running");
    const report = await PlayGermadeMigration.run(node, void 0, ({ done, total }) => {
      notice = t("host.migration.progress", { done, total });
    });
    if (!report) {
      notice = void 0;
      return;
    }
    book.grouping.clear();
    groupedRows = /* @__PURE__ */ new Map();
    refreshToken += 1;
    modsVersion += 1;
    void askPersistenceOnce();
    if (ui.activeOriginId !== LIBRARY_ORIGIN_ID) await selectOrigin(LIBRARY_ORIGIN_ID);
    showLanding = false;
    notice = t("host.migration.done", { roms: report.placed + report.copied + report.already, mods: report.mods.added.length });
  } catch (err) {
    notice = void 0;
    storeService.setError(t("host.migration.failed", { reason: err instanceof Error ? err.message : t("errors.unknown") }));
  }
};
const openLibrary = async () => {
  if (!libraryAvailable) return;
  try {
    const node = storageService.createNodeInstance();
    await node.initializeLibrary();
    storageNodes = new Map(storageNodes).set(LIBRARY_ORIGIN_ID, node);
    storeService.addOrigin({ id: LIBRARY_ORIGIN_ID, name: t("library.name"), path: "OPFS", selection: [], kind: "library" });
    if (isPlayGermade) void migrateFromLauncher(node);
  } catch (err) {
    storeService.setError(err instanceof Error ? err.message : t("errors.library"));
  }
};
openLibrary().then(() => HandleStoreService.loadAll()).then((stored) => {
  for (const entry of stored) {
    book.restoredHandles.set(entry.id, entry.handle);
    storeService.addOrigin({ id: entry.id, name: entry.name, path: entry.name, selection: [], locked: true, kind: "folder" });
  }
  try {
    const lastActiveId = localStorage.getItem("rom-manager:active-origin-id");
    if (lastActiveId && (lastActiveId === LIBRARY_ORIGIN_ID || stored.some((entry) => entry.id === lastActiveId))) {
      storeService.setActiveOrigin(lastActiveId);
    }
  } catch {
  }
}).catch(() => void 0);
ROMDatasetService.listSystems().then((systems) => storeService.setKnownSystems(new Set(systems.map((it) => it.system)))).catch(() => storeService.setKnownSystems(/* @__PURE__ */ new Set()));
<\/script>

<div class="rom-explorer">
  <Header
    :origins="ui.origins"
    :active-origin-id="ui.activeOriginId"
    :show-landing="showLanding"
    :region-order="regionOrder"
    :has-node="Boolean(activeNode)"
    :can-open-folder="foldersAvailable"
    :can-add-roms="storageNodes.size > 0"
    :can-sync="canSync"
    :launcher-url="isPlayGermade ? LAUNCHER_BASE : undefined"
    @go-home="goHome()"
    @open-folder="openFolder()"
    @add-roms="addRoms('active')"
    @sync="syncAsk = true"
    @select-origin="selectOrigin($event.detail)"
    @close-origin="closeOrigin($event.detail)"
    @region-order-change="changeRegionOrder($event.detail)"
    @open-preferences="preferences = true"
  />

  <div :if="ui.error" class="error-message">{{ ui.error }}</div>

  <!-- Initial view: before any folder is opened, on reload, or when the title is clicked. -->
  <WelcomePanel
    :if="welcome"
    :can-open-folder="foldersAvailable"
    :can-open-library="hasLibrary"
    :can-add-roms="hasLibrary"
    :loading="ui.loading"
    @open-folder="openFolder()"
    @open-library="selectOrigin(LIBRARY_ORIGIN_ID)"
    @add-roms="addRoms('library')"
  />
  <div :elseif="phone" class="mobile-host" style="display: contents">
    <MobilePanels
      :each="originKey in [ui.activeOriginId]"
      :key="originKey"
      :node="activeNode"
      :refresh-token="refreshToken"
      :known-systems="ui.knownSystems"
      :grouped-rows="groupedRows"
      :region-order="regionOrder"
      @grouping-needed="groupingNeeded($event.detail)"
      @pick-game="panelGame($event.detail)"
    >
      <RomDetails
        :paths="detailsPaths"
        :game="detailsGame"
        :folder="folder"
        :wizard-folder="wizardFolder"
        :game-cover="gameCover"
        :records="records"
        :stats="stats"
        :covers="coverUrls"
        :editing="editing"
        :on-save="save"
        :on-save-many="saveMany"
        :load-content="loadContent"
        :can-organize="true"
        :can-remove="true"
        :back="back"
        :mods="gameMods?.mods ?? []"
        :mod-actions="modActions"
        @edit="editing = true"
        @cancel-edit="editing = false"
        @select-file="selectFile($event.detail)"
        @organize="planOrganize($event.detail)"
        @remove="deleteFiles($event.detail)"
        @back="gameFile = undefined"
      />
    </MobilePanels>
  </div>
  <div :else class="explorer-container">
    <FileTree
      :each="treeKey in [\`\${ui.activeOriginId}:0\`]"
      :key="treeKey"
      :node="activeNode"
      :selected-files="selection"
      :is-initialized="(path) => initialised.has(gameKey(path))"
      :can-group="canGroup"
      :is-grouped="isGrouped"
      :grouped-rows="groupedRows"
      :can-organize="true"
      :notice="notice ?? (organize ? undefined : organizeBusy)"
      :refresh-token="refreshToken"
      @selection-change="selectionChange($event.detail)"
      @game-change="gameChange($event.detail)"
      @folder-change="folder = $event.detail ?? undefined"
      @visible-change="visibleChange($event.detail)"
      @removed="removed($event.detail)"
      @changed="reindex($event.detail)"
      @grouping-needed="groupingNeeded($event.detail)"
      @toggle-grouping="toggleGrouping($event.detail)"
      @organize="planOrganize($event.detail)"
    />

    <!-- The pane takes files from outside: an image for the game on screen, or anything for the folder picked. -->
    <div :class="\`details-pane \${dropping ? 'drop-target' : ''}\`" @dragover="onPaneDragOver" @dragleave="onPaneDragLeave" @drop="onPaneDrop">
      <RomDetails
        :paths="detailsPaths"
        :game="detailsGame"
        :folder="folder"
        :wizard-folder="wizardFolder"
        :game-cover="gameCover"
        :records="records"
        :stats="stats"
        :covers="coverUrls"
        :editing="editing"
        :on-save="save"
        :on-save-many="saveMany"
        :load-content="loadContent"
        :can-organize="true"
        :can-remove="true"
        :back="back"
        :mods="gameMods?.mods ?? []"
        :mod-actions="modActions"
        @edit="editing = true"
        @cancel-edit="editing = false"
        @select-file="selectFile($event.detail)"
        @organize="planOrganize($event.detail)"
        @remove="deleteFiles($event.detail)"
        @back="gameFile = undefined"
      />
    </div>
  </div>

  <!-- Mounted whether or not it is open: the dialog closes itself, and being still there is what lets it be seen doing so. -->
  <PreferencesModal
    :open="preferences"
    :theme-mode="ui.themeMode"
    :locale="ui.localePreference"
    :region-order="regionOrder"
    :can-change-regions="Boolean(activeNode)"
    :library="hasLibrary"
    @theme-mode-change="setThemeMode($event.detail)"
    @locale-change="setLocalePreference($event.detail)"
    @region-order-change="changeRegionOrder($event.detail)"
    @close="preferences = false"
  />

  <!-- Behind "Añadir ROMs". No \`accept\`: iOS greys out extensions it has no type for. -->
  <input type="file" multiple hidden class="rom-picker" @change="onRomsPicked" />

  <ConfirmModal
    :close-label="t('prefs.close')"
    :cancel-label="t('drop.cancel')"
    :open="syncAsk"
    :title="t('library.sync.title', { folder: activeOrigin?.name ?? '' })"
    :message="t('library.sync.message')"
    :confirm-label="t('library.sync.confirm')"
    :danger="false"
    :busy="syncBusy"
    @confirm="confirmSync()"
    @close="syncBusy ? undefined : (syncAsk = false)"
  />

  <!-- Only while there is a drop to read: what it says depends on the files and where they were dropped. -->
  <MediaDropModal
    :if="drop"
    :files="drop.files"
    :target="drop.target"
    :intake="drop.intake"
    :busy="dropBusy"
    :error="dropError"
    @confirm="confirmDrop($event.detail)"
    @cancel="cancelDrop()"
  />

  <!-- Only once the drop has been identified: what it says is the answer. -->
  <RomIntakeModal
    :if="intake"
    :items="intake"
    :busy="intakeBusy"
    :error="intakeError"
    @confirm="confirmIntake()"
    @cancel="cancelIntake()"
  />

  <OrganizePanel
    :if="organize"
    :system="organize.system"
    :plan="organize.plan"
    :applied="organize.applied"
    :busy="organizeBusy"
    @confirm="confirmOrganize()"
    @undo="undoOrganize()"
    @close="organize = undefined"
  />
</div>
`,hf={"./Header.html":Yc,"./WelcomePanel.html":ld,"./FileTree.html":Fd,"./RomDetails.html":xh,"./MobilePanels.html":Ih,"./PreferencesModal.html":jh,"./MediaDropModal.html":qh,"./RomIntakeModal.html":Hh,"./OrganizePanel.html":Zh,"../components/ConfirmModal.html":At,"../lib/StorageService":ti,"../lib/LibraryStorageService":jo,"../lib/RomLibraryService":yn,"../lib/GameCatalogService":ei,"../lib/CoverService":Qh,"../lib/OrganizeService":Qo,"../lib/RomIntakeService":bn,"../lib/ROMDatasetService":Da,"../lib/WizardConfigService":Oc,"../lib/ThemeService":so,"../lib/I18nService":to,"../lib/HandleStoreService":af,"../helpers/wizard-tree":cf,"../helpers/rom-covers":Gn,"../helpers/rom-media":Fn,"../helpers/rom-organize":Xo,"../lib/StoreService":Cc,"../lib/ui-state":ie,"../lib/LibraryIndexService":Jo,"../lib/ModService":Zo,"../helpers/library-index":wn,"../helpers/patch":Yo,"../lib/host":Lo,"../lib/PlayGermadeMigration":Ko},ff="views/ROMExplorer.html";let Go;Go=new q(df,{modules:hf,filename:ff});const mf=Go,uf=`<!--
  The app: the remembered theme and language first (the system's / the browser's
  until chosen, and followed while they are "auto"), then the explorer.
-->
<script :setup>const [ROMExplorer, { initTheme }, { initLocale }] = await $importAll([
  "./ROMExplorer.html",
  "../lib/ThemeService",
  "../lib/I18nService"
]);
$destroyed(initTheme());
$destroyed(initLocale());
<\/script>

<ROMExplorer />
`,pf={"./ROMExplorer.html":mf,"../lib/ThemeService":so,"../lib/I18nService":to},gf="views/App.html";let Uo;Uo=new q(uf,{modules:pf,filename:gf});const vf=Uo;vf.mount("#app");
