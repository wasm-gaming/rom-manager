(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function n(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(a){if(a.ep)return;a.ep=!0;const o=n(a);fetch(a.href,o)}})();var bc=Object.defineProperty,kc=(t,e,n)=>e in t?bc(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n,j=(t,e,n)=>kc(t,typeof e!="symbol"?e+"":e,n);function br(t,e){return typeof t=="string"?document.querySelector(t):t.querySelector(e)}function Ac(t,e){return Array.from(typeof t=="string"?document.querySelectorAll(t):t.querySelectorAll(e))}var Sc=(t,e={})=>{let n=document.createElement(t);for(let[r,a]of Object.entries(e))if(r==="className")n.className=Array.isArray(a)?a.join(" "):a;else if(r==="textContent")n.textContent=a;else if(r==="children")for(let o of a)n.appendChild(o);else n.setAttribute(r,a);return n},xc=new Set(["a","b","i","em","strong","p","br","ul","ol","li","blockquote","code","pre","span","div","h1","h2","h3","h4","h5","h6","img"]),Qa={a:new Set(["href","title"]),img:new Set(["src","alt"]),"*":new Set(["class"])},Ec=new Set(["http:","https:","mailto:"]);function Ic(t){try{let e=new URL(t,"https://example.com");return Ec.has(e.protocol)}catch{return!1}}var Cc={"https:":"443","http:":"80"};function Oc(t){let e=t.trim().toLowerCase().match(/^([a-z\d*][a-z\d.*-]*?)(?::(\d{1,5}|\*))?$/);if(!e)return null;let[,n,r]=e,a=n.split(".");return a.some(o=>o!=="*"&&!/^[a-z\d-]+$/.test(o))?null:{host:new RegExp(`^${a.map(o=>o==="*"?"[^.]+":o).join("\\.")}$`),port:!r||r==="*"?null:r}}var $c=t=>{let e=(Array.isArray(t)?t:t.split(",")).map(Oc).filter(n=>n!==null);return n=>{let r=n.hostname.toLowerCase(),a=n.port||Cc[n.protocol]||"";return e.some(o=>o.host.test(r)&&(o.port===null||o.port===a))}};function Mc(t,e,n,r){try{return!!t(new URL(e,document.baseURI),n,r)}catch{return!1}}var Ha=512;function hi(t,e,n,r){if(n>Ha)throw new RangeError(`jq79: sanitizeHTML input nests deeper than ${Ha} elements`);for(let a of Array.from(t.childNodes))if(a.nodeType===Node.ELEMENT_NODE){let o=Bc(a,n,r);o&&e.appendChild(o)}else a.nodeType===Node.TEXT_NODE&&e.appendChild(a.cloneNode())}function Bc(t,e,n){let r=t.tagName.toLowerCase();if(!xc.has(r))return null;let a=document.createElement(r);for(let o of Array.from(t.attributes)){let i=o.name.toLowerCase(),s=Qa[r]?.has(i),l=Qa["*"]?.has(i);!s&&!l||(i==="href"||i==="src")&&(!Ic(o.value)||n&&!Mc(n,o.value,r,i))||a.setAttribute(i,o.value)}return r==="a"&&a.setAttribute("rel","noopener noreferrer"),hi(t,a,e+1,n),a}function ui(t,e){let n=document.createElement("template");n.innerHTML=t;let r=document.createElement("div");return hi(n.content,r,0,e?.allowUrl),r.innerHTML}var Rc=(t,e)=>e.split(".").reduce((n,r)=>n?.[r],t),Vt=t=>{if(Array.isArray(t))return!0;let e=Object.getPrototypeOf(t);return e===Object.prototype||e===null},pi=(t,e,n)=>{Object.entries(t).forEach(([r,a])=>{let o=e?`${e}.${r}`:r;a&&typeof a=="object"&&Vt(a)?pi(a,o,n):n(o,a)})},_c=(t,e)=>{t.own===null?t.own=e:t.own!==e&&(t.ownMany??(t.ownMany=new Set)).add(e)},Pc=(t,e)=>{t.deep===null?t.deep=e:t.deep!==e&&(t.deepMany??(t.deepMany=new Set)).add(e)},Nc=(t,e)=>{t.own===e?t.own=null:t.ownMany?.delete(e)&&t.ownMany.size===0&&(t.ownMany=null)},zc=(t,e)=>{t.deep===e?t.deep=null:t.deepMany?.delete(e)&&t.deepMany.size===0&&(t.deepMany=null)},Ye=(t,e)=>{t.own!==null&&e(t.own),t.ownMany?.forEach(e)},ut=(t,e)=>{t.deep!==null&&e(t.deep),t.deepMany?.forEach(e)},Wa=" keys",Hn=t=>t?`${t}.${Wa}`:Wa,Va=".length",Ja=(t,e)=>({children:null,own:null,ownMany:null,deep:null,deepMany:null,parent:t,segment:e}),Lc=t=>t.own===null&&t.deep===null&&!t.ownMany?.size&&!t.deepMany?.size&&!t.children?.size,kr=Symbol("jq79.raw"),ae=t=>{let e=t;for(;e!==null&&typeof e=="object"&&e[kr];)e=e[kr];return e},mi=Symbol("jq79.store"),Te=t=>t!==null&&typeof t=="object"&&t[mi]===!0,Ar=null,Me=[],se=null,Et=t=>{Me.push(new Set);let e=se;se=null;try{return t()}finally{Me.pop(),se=e}},Tc=t=>{t.adopted.forEach((e,n)=>{t.read?.has(n)||(e(),t.adopted.delete(n))})},Xa=t=>{t.adopted?.forEach(e=>e()),t.adopted=null},Dc=0,Re=0,ye=null,In=!1,Ka=(t,e)=>{let n=ye??(ye=new Map);for(let r of t)In&&r===se?r.run():n.has(r)||n.set(r,e)},gi=()=>{for(let t=0;ye?.size;t++){if(t===100){console.error(`jq79: ${In?"a write":"a $batch"} kept waking effects for 100 rounds (an effect writes what it reads); giving up on it settling`),ye.clear();return}let e=ye;ye=new Map,Array.from(e.keys()).sort((n,r)=>n.order-r.order).forEach(n=>{e.get(n).has(n)&&n.run()})}},yi=t=>{Re++===0&&(ye=null);try{return t()}finally{if(Re===1)try{gi()}finally{Re=0,ye=null}else Re--}},Ya=()=>{Re=1,In=!0},Za=()=>{try{ye&&gi()}finally{Re=0,ye=null,In=!1}},Wn=new Set,eo="$__attach",to="$__holds",Sr=Symbol("jq79.alsoWakenBy"),vi=Symbol("jq79.owner"),Ke=t=>{let e=new Map,n=new Set,r=new Set,a=new WeakMap,o=Object.create(null),i=Ja(null,""),s=(k,m)=>{let E=i;return k.split(".").forEach(x=>{let _=E.children??(E.children=new Map),I=_.get(x);I||(I=Ja(E,x),_.set(x,I)),E=I}),m.deep?Pc(E,m):_c(E,m),E},l=(k,m)=>{m.deep?zc(k,m):Nc(k,m);let E=k;for(;E?.parent&&Lc(E);)E.parent.children.delete(E.segment),E=E.parent},c=k=>{let m=i;for(let E of k.split("."))if(m=m.children?.get(E),!m)return;return m},d=k=>{let m=new Set,E=M=>{let L=M.children?[...M.children.values()]:[];for(;L.length;){let z=L.pop();Ye(z,D=>m.add(D)),ut(z,D=>m.add(D)),z.children?.forEach(D=>L.push(D))}},x=i,_=k.split("."),I="";for(let M=0;M<_.length-1;M++){if(x=x.children?.get(_[M]),!x)return m;I=I?`${I}.${_[M]}`:_[M],ut(x,z=>m.add(z));let L=O.get(I);L&&Ye(x,z=>{L.store[to](z)||m.add(z)}),M===_.length-2&&_[M+1]==="length"&&(Ye(x,z=>m.add(z)),E(x))}return x=x.children?.get(_[_.length-1]),x&&(Ye(x,M=>m.add(M)),ut(x,M=>m.add(M)),E(x)),m},f=(k,m,E)=>{if(m===E)return!1;for(let x=m;x<E;x++){let _=k.charCodeAt(x);if(_<48||_>57)return!1}return!0},h=(k,m)=>{if(k.deep||m.size<2)return m;let E=new Set;m.forEach(I=>{I.endsWith(Va)&&E.add(I.slice(0,-Va.length))});let x=new Set;if(m.forEach(I=>{let M=0,L="";for(let z=I.indexOf(".");z!==-1;z=I.indexOf(".",z+1)){let D=I.slice(0,z);(!(M>0&&f(I,M,z))||E.has(L))&&x.add(D),L=D,M=z+1}}),!x.size)return m;let _=new Set;return m.forEach(I=>{x.has(I)||_.add(I)}),_},y=k=>{let m=null,E=null,x=null,_=Wn,I=F=>x?x.has(F):m===F,M=F=>{let re=s(F,k);x?x.set(F,re):m===null?(m=F,E=re):(x=new Map([[m,E],[F,re]]),m=E=null)},L=F=>{if(x){x.forEach((re,X)=>{F.has(X)||(l(re,k),x.delete(X))});return}m!==null&&!F.has(m)&&(l(E,k),m=E=null)},z=()=>{x?x.forEach(F=>l(F,k)):E&&l(E,k),x=null,m=E=null},D=F=>{if(F.size===_.size){let X=!0;if(F.forEach(Le=>{X&&(X=_.has(Le))}),X)return}_=F;let re=h(k,F);L(re),re.forEach(X=>{I(X)||M(X)})};return k.reindex.add(D),D(k.deps),()=>{k.reindex.delete(D),z(),_=Wn}},u=k=>{let m=c(k);if(m){let E=new Set;Ye(m,x=>E.add(x)),ut(m,x=>E.add(x)),S(E)}},g=k=>u(Hn(k)),S=k=>{if(Re)return Ka(k,r);let m=Array.from(k),E=!0;for(let x=1;E&&x<m.length;x++)E=m[x-1].order<m[x].order;E||m.sort((x,_)=>x.order-_.order),Ya();try{for(let x of m)r.has(x)&&x.run()}finally{Za()}},v=(k,m,E=!1)=>{if(e.get(k)?.forEach(x=>x(m,k)),n.forEach(x=>x(k,m)),E)if(Re)Ka(r,r);else{Ya();try{r.forEach(x=>x.run())}finally{Za()}}else S(d(k))},p=(k,m)=>k!==m&&k!==null&&m!==null&&typeof k=="object"&&typeof m=="object"&&!Te(k)&&!Te(m)&&Vt(k)&&Vt(m)&&Array.isArray(k)===Array.isArray(m),w=null,A=-1,P=(k,m)=>{let E=m.length>k.length,x=E?k:m,_=E?m:k,I=0;for(;I<x.length&&Object.is(ae(x[I]),ae(_[I]));)I++;for(let M=I;M<x.length;M++)if(!Object.is(ae(x[M]),ae(_[M+1])))return A;return I},C=(k,m)=>{if(Array.isArray(m)){let L=k.length,z=m.length,D=L!==z;if(!L||!z)return w;let F=Math.max(L,z);if(Math.abs(L-z)===1){let X=P(k,m);if(X!==A){let Le=[];for(let Qn=X;Qn<F;Qn++)Le.push(String(Qn));return{keys:Le,exact:!0,keysChanged:D}}}let re=[];for(let X=0;X<F;X++)if(!Object.is(ae(k[X]),ae(m[X]))&&(re.push(String(X)),re.length*2>=F))return w;return{keys:re,exact:!1,keysChanged:D}}let E=Object.keys(k),x=Object.keys(m),_=new Set([...E,...x]);if(!_.size)return w;let I=[];_.forEach(L=>{Object.is(ae(k[L]),ae(m[L]))||I.push(L)});let M=E.length!==x.length||E.some((L,z)=>L!==x[z]);return I.length*2>=_.size?w:{keys:I,exact:!1,keysChanged:M}},B=(k,m,E,x)=>{let _=new Set,I=L=>{let z=c(L);z&&(Ye(z,D=>_.add(D)),ut(z,D=>_.add(D)))},M=C(m,E);if(!M)return v(k,x);if(e.get(k)?.forEach(L=>L(x,k)),n.forEach(L=>L(k,x)),I(k),M.keys.forEach(L=>{let z=`${k}.${L}`,D=e.get(z);if(D){let F=ae(E[L]),re=b(F)?H(F,z):F;D.forEach(X=>X(re,z))}M.exact?I(z):d(z).forEach(F=>_.add(F))}),M.keysChanged&&I(Hn(k)),Array.isArray(E)&&m.length!==E.length){let L=`${k}.length`;e.get(L)?.forEach(z=>z(E.length,L)),I(L)}S(_)},b=k=>k!==null&&typeof k=="object"&&Vt(k),O=new Map,R=(k,m)=>{let E=O.get(m);E?.store!==k&&(E?.unsubscribe(),O.set(m,{store:k,unsubscribe:k.$onAny((x,_)=>v(`${m}.${x}`,_))}))},U=k=>{O.get(k)?.unsubscribe(),O.delete(k)},H=(k,m)=>{let E=a.get(k);if(E)return E;let x=null,_=new Proxy(k,{has(I,M){return Reflect.has(I,M)||typeof M=="string"&&x?.has(M)===!0},ownKeys(I){return Me[Me.length-1]?.add(Hn(m)),se!==null&&se.home!==r&&Y(se),Reflect.ownKeys(I)},get(I,M,L){if(M===kr)return I;if(M===mi)return m==="";if(typeof M!="string")return Reflect.get(I,M,L);if(m===""&&M in o)return o[M];let z=m?`${m}.${M}`:M;Me[Me.length-1]?.add(z),se!==null&&se.home!==r&&Y(se);let D=Reflect.get(I,M,L);if(Te(D))return R(D,z),D;let F=ae(D);return b(F)?H(F,z):F},set(I,M,L,z){if(z!==_&&!Object.prototype.hasOwnProperty.call(I,M))return Reflect.set(I,M,L,z);let D=m?`${m}.${M}`:M,F=Te(L)?L:ae(L),re=!Object.prototype.hasOwnProperty.call(I,M);if(!re&&Object.is(I[M],F)&&(F===null||typeof F!="object"))return!0;let X=I[M];I[M]=F,x?.delete(M),Te(F)?R(F,D):U(D);let Le=Te(F)||!b(F)?F:H(F,D);return!re&&p(X,F)?B(D,X,F,Le):v(D,Le,re),!0},deleteProperty(I,M){if(typeof M!="string")return Reflect.deleteProperty(I,M);let L=Object.prototype.hasOwnProperty.call(I,M),z=Reflect.deleteProperty(I,M);if(z&&L){let D=m?`${m}.${M}`:M;(x??(x=new Set)).add(M),U(D),v(D,void 0),g(m)}return z}});return a.set(k,_),_},$=H(ae(t),"");Object.entries(ae(t)).forEach(([k,m])=>{Te(m)&&R(m,k)});let N=(k,m,{immediate:E=!1}={})=>(e.has(k)||e.set(k,new Set),e.get(k).add(m),E&&m(Rc($,k),k),()=>e.get(k)?.delete(m)),T=(k,{immediate:m=!1}={})=>(n.add(k),m&&pi($,"",(E,x)=>k(E,x)),()=>n.delete(k)),W=(k,{deep:m=!1,alsoWakenBy:E}={})=>{let x=!1,_=!1,I={deps:Wn,reindex:new Set,deep:m,order:Dc++,home:r,adopted:null,read:null,run:()=>{if(x){_=!0;return}x=!0;try{let z=0;do{_=!1,I.read=null;let D=new Set;Me.push(D);let F=se;se=I;try{k()}finally{Me.pop(),se=F,I.deps=D}}while(_&&++z<100);_&&console.error("jq79: an effect re-woke itself 100 times in a row (it writes what it reads); giving up on it settling")}finally{x=!1,I.adopted&&Tc(I),I.reindex.forEach(z=>z(I.deps))}}};r.add(I);let M=y(I),L=()=>{r.delete(I),M(),Xa(I)};return E?.length?G(I,E,L):(I.run(),Ar=I,L)},G=(k,m,E)=>{let x=m.map(_=>_?.[eo]?.(k)).filter(Boolean);return k.run(),Ar=k,()=>{E(),x.forEach(_=>_())}},te=k=>{r.add(k);let m=y(k);return()=>{r.delete(k),m()}},Y=k=>{(k.read??(k.read=new Set)).add(r),!(k.adopted?.has(r)||r.has(k))&&(k.adopted??(k.adopted=new Map)).set(r,te(k))},fe=()=>{O.forEach(({unsubscribe:k})=>k()),O.clear(),r.forEach(k=>{k.home===r&&Xa(k)})};return o.$on=N,o.$onAny=T,o.$effect=W,o.$dispose=fe,o[eo]=te,o[to]=k=>r.has(k),$},Fc=class{constructor(t,e){j(this,"scope",t),j(this,"disposers",null),j(this,"runs",null),j(this,"children",null),j(this,"owners",null),j(this,"options");let n=t[Sr];this.options=e||n?{deep:e,alsoWakenBy:n}:void 0,this.ownedBy(t)}ownedBy(t){let e=t[vi];!e||this.owners?.includes(e)||((this.owners??(this.owners=[])).push(e),(e.children??(e.children=new Set)).add(this))}effect(t){(this.disposers??(this.disposers=[])).push(this.scope.$effect(t,this.options)),(this.runs??(this.runs=[])).push(Ar)}onDispose(t){(this.disposers??(this.disposers=[])).push(t)}refresh(){this.runs?.forEach(t=>t.run())}rerun(){let t=this.runs?[...this.runs]:null,e=this.children?[...this.children]:null;t?.forEach(n=>{this.runs&&n.run()}),e?.forEach(n=>n.rerun())}dispose(){let t=this.disposers;if(this.disposers=null,this.runs=null,this.children=null,this.owners?.forEach(e=>e.children?.delete(this)),this.owners=null,t)for(let e=0;e<t.length;e++)t[e]()}},Pt=(t,e=!1)=>new Fc(t,e),jc=t=>{let e=Ke({value:void 0});e.$effect(()=>{let r;try{r=t()}catch(a){console.error("jq79: error in $computed, keeping its last value",a);return}e.value=r});let n=(r,a)=>(console.warn(`jq79: a $computed is read-only - the write to ${String(a)} was ignored`),!0);return new Proxy(e,{set:n,deleteProperty:n,defineProperty:n})},rn=/(?:let|var|const)(?:\s+(?=[A-Za-z_$])|\s*(?=[{[]))/y,no=/\$:\s*/y,an=/import(?=\s*\()/y,ro=/\$:\s*([A-Za-z_$][\w$]*)\s*=(?!=)/y,ve=(t,e)=>{let n=t[e],r=e+1;for(;r<t.length;){if(t[r]==="\\"){r+=2;continue}if(t[r]===n)return r+1;r++}return t.length},ue=(t,e)=>{let n=t.indexOf(`
`,e);return n===-1?t.length:n},pe=(t,e)=>{let n=t.indexOf("*/",e+2);return n===-1?t.length:n+2},Ie=(t,e)=>{let n=e;for(;n<t.length;){if(/\s/.test(t[n])){n++;continue}if(t[n]==="/"&&t[n+1]==="/"){n=ue(t,n);continue}if(t[n]==="/"&&t[n+1]==="*"){n=pe(t,n);continue}break}return n},Uc=new Set(["return","typeof","case","in","instanceof","new","delete","void","do","else","yield","await"]),we=(t,e)=>{let n=e-1;for(;n>=0;){let a=t[n];if(/\s/.test(a)){n--;continue}if(a==="/"&&t[n-1]==="*"){let o=t.lastIndexOf("/*",n-2);if(o===-1)return!0;n=o-1;continue}break}if(n<0)return!0;let r=t[n];if(/[\w$]/.test(r)){let a=n;for(;a>0&&/[\w$]/.test(t[a-1]);)a--;return Uc.has(t.slice(a,n+1))}return(r==="+"||r==="-")&&t[n-1]===r?!1:!")]}\"'`.".includes(r)},be=(t,e)=>{let n=e+1,r=!1;for(;n<t.length;){let a=t[n];if(a==="\\"){n+=2;continue}if(a===`
`)return n;if(a==="[")r=!0;else if(a==="]")r=!1;else if(a==="/"&&!r){for(n++;n<t.length&&/[a-z]/i.test(t[n]);)n++;return n}n++}return t.length},qc=/^(\?\.|\?\?|&&|\|\||\*\*|[.,+\-*/%&|^<>=?:([])/,Gc=(t,e)=>{let n=e-1;for(;n>=0;){let r=t[n];if(/\s/.test(r)){n--;continue}if(r==="/"&&t[n-1]==="*"){let a=t.lastIndexOf("/*",n-2);if(a===-1)return"";n=a-1;continue}return r}return""},xr=(t,e)=>{let n=0,r=e;for(;r<t.length;){let a=t[r];if(a==="'"||a==='"'||a==="`"){r=ve(t,r);continue}if(a==="/"&&t[r+1]==="/"){r=ue(t,r);continue}if(a==="/"&&t[r+1]==="*"){r=pe(t,r);continue}if(a==="/"&&we(t,r)){r=be(t,r);continue}if("([{".includes(a))n++;else if(")]}".includes(a))n--;else{if(n<=0&&a===";")return r;if(n<=0&&a===`
`){let o=Ie(t,r+1);if(!(o<t.length&&(qc.test(t.slice(o,o+2))||[",","="].includes(Gc(t,r)))))return r;r=o;continue}}r++}return t.length},wi=t=>{let e=[],n=0,r=0,a=0,o=s=>{e.push({raw:t.slice(r,s),codeEnd:Math.max(0,a-r)}),r=s+1,a=r},i=0;for(;i<t.length;){let s=t[i];if(s==="'"||s==='"'||s==="`"){i=ve(t,i),a=i;continue}if(s==="/"&&t[i+1]==="/"){i=ue(t,i);continue}if(s==="/"&&t[i+1]==="*"){i=pe(t,i);continue}if(s==="/"&&we(t,i)){i=be(t,i),a=i;continue}if("([{".includes(s))n++;else if(")]}".includes(s))n--;else if(s===","&&n<=0){o(i),i++;continue}/\s/.test(s)||(a=i+1),i++}return o(t.length),e},on=t=>{let e=t.trim();if(!e.startsWith("{")&&!e.startsWith("["))return cn.test(e)?[e]:[];let n=[];for(let r of ta(e.slice(1,bi(e)))){r.startsWith("...")&&(r=r.slice(3).trim());let a=Cn(r);if(a!==-1&&(r=r.slice(0,a).trim()),e.startsWith("{")){let o=ea(r,":");if(o!==-1){n.push(...on(r.slice(o+1)));continue}}n.push(...on(r))}return n},Qc=t=>{let e=[],n=wi(t).map(({raw:o,codeEnd:i})=>{let s=o.match(/^\s*/)[0];if(i<=s.length)return{text:o,empty:!0};let l=o.slice(s.length,i),c=o.slice(i),d=Cn(l),f=(d===-1?l:l.slice(0,d)).trim(),h=l[0]==="{"||l[0]==="[";h?e.push(...on(f)):cn.test(f)&&e.push(f);let y=Zr(l).code;return{text:`${s}${h?`(${y})`:y}${c}`,empty:!1}}),r=[];for(;n.length&&n[n.length-1].empty;)r.unshift(n.pop().text);let a=n.map(o=>o.text).join(",")+r.join("");return a.trimStart().startsWith("(")&&(a=`;${a}`),{vars:e,code:a}},Zr=t=>{let e=[],n="",r=0,a=0,o=!0;for(;r<t.length;){let i=t[r],s=t[r+1];if(i==="'"||i==='"'||i==="`"){let l=ve(t,r);n+=t.slice(r,l),r=l,o=!1;continue}if(i==="/"&&(s==="/"||s==="*")){let l=s==="/"?ue(t,r):pe(t,r);n+=t.slice(r,l),r=l;continue}if(i==="/"&&we(t,r)){let l=be(t,r);n+=t.slice(r,l),r=l,o=!1;continue}if(i==="i"&&(r===0||!/[\w$.]/.test(t[r-1]))&&(an.lastIndex=r,an.test(t))){n+="$__import",r+=6,o=!1;continue}if(a===0&&o){rn.lastIndex=r;let l=rn.exec(t);if(l){let d=r+l[0].length,f=xr(t,d),{vars:h,code:y}=Qc(t.slice(d,f));e.push(...h),n+=y,r=f,o=!1;continue}no.lastIndex=r;let c=no.exec(t);if(c){ro.lastIndex=r;let d=ro.exec(t);d&&e.push(d[1]);let f=r+c[0].length,h=xr(t,f);n+=`$__effect(() => { ${Zr(t.slice(f,h)).code} });`,r=h;continue}}"([{".includes(i)?a++:")]}".includes(i)&&(a=Math.max(0,a-1)),i===`
`||i===";"||i==="}"?o=!0:/\s/.test(i)||(o=!1),n+=i,r++}return{vars:e,code:n}},sn=/export\s+default(?![\w$])/y,ln=/import\s*(?:([\w$\s,{}*]+?)\s*from\s*)?(["'])([^"'\n]+)\2/y,Hc=t=>{let e=[],n=0,r=0;for(let a=0;a<=t.length;a++){let o=t[a];if(o==="{")n++;else if(o==="}")n--;else if(a===t.length||o===","&&n===0){let i=t.slice(r,a).trim();i&&e.push(i),r=a+1}}return e},Wc=(t,e,n)=>{let r=`await $__import(${JSON.stringify(e)})`;if(t===void 0)return r;let a=Hc(t),o=[],i=r;if(a.length>1){let s=`$__mod${n}`;o.push(`${s} = ${r}`),i=s}for(let s of a)s.startsWith("{")?o.push(`${s.replace(/\s+as\s+/g,": ")} = ${i}`):s.startsWith("*")?o.push(`${s.replace(/^\*\s*as\s+/,"")} = ${i}`):o.push(`${s} = $__default(${i})`);return`const ${o.join(", ")}`},cn=/^[A-Za-z_$][\w$]*$/,bi=t=>{let e=0,n=0;for(;n<t.length;){let r=t[n];if(r==="'"||r==='"'||r==="`"){n=ve(t,n);continue}if(r==="/"&&t[n+1]==="/"){n=ue(t,n);continue}if(r==="/"&&t[n+1]==="*"){n=pe(t,n);continue}if(r==="/"&&we(t,n)){n=be(t,n);continue}if("([{".includes(r))e++;else if(")]}".includes(r)&&--e===0)return n;n++}return t.length},ea=(t,e)=>{let n=0,r=0;for(;r<t.length;){let a=t[r];if(a==="'"||a==='"'||a==="`"){r=ve(t,r);continue}if(a==="/"&&t[r+1]==="/"){r=ue(t,r);continue}if(a==="/"&&t[r+1]==="*"){r=pe(t,r);continue}if(a==="/"&&a!==e&&we(t,r)){r=be(t,r);continue}if("([{".includes(a))n++;else if(")]}".includes(a))n--;else if(n===0&&a===e)return r;r++}return-1},ta=t=>{let e=[],n=0,r=0,a=0;for(;a<=t.length;){let o=t[a];if(o==="'"||o==='"'||o==="`"){a=ve(t,a);continue}if(o==="/"&&t[a+1]==="/"){a=ue(t,a);continue}if(o==="/"&&t[a+1]==="*"){a=pe(t,a);continue}if(o==="/"&&we(t,a)){a=be(t,a);continue}if(o!==void 0&&"([{".includes(o))n++;else if(o!==void 0&&")]}".includes(o))n--;else if(a===t.length||o===","&&n===0){let i=t.slice(r,a).trim();i&&e.push(i),r=a+1}a++}return e},Cn=t=>{let e=0;for(;e<t.length;){let n=ea(t.slice(e),"=");if(n===-1)return-1;let r=e+n;if(t[r+1]!=="="&&t[r+1]!==">"&&t[r-1]!=="="&&t[r-1]!=="!")return r;e=r+1}return-1},na=t=>{let e=(t??"").trim();if(!e.startsWith("{"))return null;let n=bi(e);if(n>=e.length)return null;let r=[];for(let a of ta(e.slice(1,n))){if(a.startsWith("..."))continue;let o=Cn(a),i=o===-1?a:a.slice(0,o),s=o===-1?void 0:a.slice(o+1).trim(),l=ea(i,":"),c=(l===-1?i:i.slice(0,l)).trim();if(!cn.test(c))continue;let d={name:c};s!==void 0&&(d.default=s);let f=l===-1?"":i.slice(l+1).trim();cn.test(f)&&(d.as=f),r.push(d)}return r},Vc=t=>{let e=0,n=0,r=!0;for(;e<t.length;){let a=t[e];if(a==="'"||a==='"'||a==="`"){e=ve(t,e),r=!1;continue}if(a==="/"&&t[e+1]==="/"){e=ue(t,e);continue}if(a==="/"&&t[e+1]==="*"){e=pe(t,e);continue}if(a==="/"&&we(t,e)){e=be(t,e),r=!1;continue}if(a==="e"&&n===0&&r&&(e===0||!/[\w$.]/.test(t[e-1]))){sn.lastIndex=e;let o=sn.exec(t);if(o)return e+o[0].length}"([{".includes(a)?n++:")]}".includes(a)&&(n=Math.max(0,n-1)),a===`
`||a===";"||a==="}"?r=!0:/\s/.test(a)||(r=!1),e++}return-1},Jc=/^async(?![\w$])/,Xc=/^function(?![\w$])\s*\*?\s*[A-Za-z_$][\w$]*|^function(?![\w$])\s*\*?/,Kc=t=>{let e=Vc(t);if(e===-1)return null;let n=Ie(t,e),r=t.slice(n);Jc.test(r)&&(n=Ie(t,n+5));let a=Xc.exec(t.slice(n));if(a&&(n=Ie(t,n+a[0].length)),t[n]!=="(")return null;let o=0,i=n;for(;i<t.length;){let s=t[i];if(s==="'"||s==='"'||s==="`"){i=ve(t,i);continue}if(s==="/"&&t[i+1]==="/"){i=ue(t,i);continue}if(s==="/"&&t[i+1]==="*"){i=pe(t,i);continue}if(s==="/"&&we(t,i)){i=be(t,i);continue}if("([{".includes(s))o++;else if(")]}".includes(s)&&--o===0)break;i++}return ta(t.slice(n+1,i))[0]??""},ki=t=>{let e=Kc(t);if(e===null)return null;let n=na(e),r=n?.find(a=>a.name.startsWith("$"))?.name;if(r)throw new Error(`jq79: the factory signature is (props, ctx), so \`${r}\` can't be destructured from the first parameter. Write \`export default (props, { ${r} }) => …\`, or \`_\` in place of props if the component takes none.`);return n},Yc=t=>{let e="",n=0,r=0,a=!0,o=!1,i=0;for(;n<t.length;){let s=t[n],l=t[n+1],c=n===0||!/[\w$.]/.test(t[n-1]);if(s==="'"||s==='"'||s==="`"){let d=ve(t,n);e+=t.slice(n,d),n=d,a=!1;continue}if(s==="/"&&(l==="/"||l==="*")){let d=l==="/"?ue(t,n):pe(t,n);e+=t.slice(n,d),n=d;continue}if(s==="/"&&we(t,n)){let d=be(t,n);e+=t.slice(n,d),n=d,a=!1;continue}if(s==="i"&&c){if(an.lastIndex=n,an.test(t)){e+="$__import",n+=6,a=!1;continue}if(r===0&&a){ln.lastIndex=n;let d=ln.exec(t);if(d){e+=Wc(d[1],d[3],i++),n+=d[0].length,a=!1;continue}}}if(s==="e"&&c&&r===0&&a){sn.lastIndex=n;let d=sn.exec(t);if(d){o=!0,e+="$__exports.default =",n+=d[0].length,a=!1;continue}}"([{".includes(s)?r++:")]}".includes(s)&&(r=Math.max(0,r-1)),s===`
`||s===";"||s==="}"?a=!0:/\s/.test(s)||(a=!1),e+=s,n++}return o?e:null},Zc=new Set(["true","false","null","undefined","this","typeof","instanceof","in","new","void","delete","of","await","yield","NaN","Infinity","arguments","case","do","else","return"]),ed=new Set(["function","class","let","const","var","eval","with"]),td=new Set(["$scope","$r","$t"]),nd=/^(?:\+\+|--|=>|\*\*=|<<=|>>>=|>>=|&&=|\|\|=|\?\?=|[+\-*/%&|^]=(?!=))/,rd=/^(?:>>>|===|!==|\*\*|<<|>>|==|!=|<=|>=|&&|\|\||\?\?|\?\.)/,ad=t=>/[A-Za-z_$]/.test(t),od=/^(?:0[xXbBoO][\da-fA-F_]+|\d[\d_]*(?:\.[\d_]*)?(?:[eE][+-]?\d+)?)n?/,Ai=t=>{let e=new Set,n=[0],r=[],a=!1,o="",i=0;for(;i<t.length;){let s=t[i];if(/\s/.test(s)){i++;continue}if(s==="/"&&t[i+1]==="/"){i=ue(t,i);continue}if(s==="/"&&t[i+1]==="*"){i=pe(t,i);continue}if(s==="/"&&we(t,i)){i=be(t,i),o="value";continue}if(s==='"'||s==="'"){i=ve(t,i),o="value";continue}if(s==="`"){let d=i+1;for(;d<t.length;){if(t[d]==="\\"){d+=2;continue}if(t[d]==="`"){d++;break}if(t[d]==="$"&&t[d+1]==="{"){let f=1,h=d+=2;for(;d<t.length&&f>0;)t[d]==="{"?f++:t[d]==="}"&&f--,d++;let y=Ai(t.slice(h,d-1));if(y===null)return null;y.forEach(u=>e.add(u));continue}d++}i=d,o="value";continue}if(/\d/.test(s)&&o!=="."&&o!=="?."){let d=od.exec(t.slice(i));i+=d?d[0].length:1,o="value";continue}if(ad(s)){let d=i;for(;d<t.length&&/[\w$]/.test(t[d]);)d++;let f=t.slice(i,d);if(i=d,ed.has(f))return null;if(o==="."||o==="?."){o="value";continue}if(Zc.has(f)){o=f==="this"?"value":"op";continue}if(td.has(f))return null;let h=i;for(;h<t.length&&/\s/.test(t[h]);)h++;if(t[h]==="(")return null;t[h]===":"&&t[h+1]!==":"&&r[r.length-1]==="{"&&n[n.length-1]===0||e.add(f),o="value";continue}let l=t.slice(i);if(nd.test(l))return null;let c=rd.exec(l);if(c){(c[0]==="&&"||c[0]==="||"||c[0]==="??")&&(a=!0),o=c[0]==="?."?"?.":"op",i+=c[0].length;continue}if(s==="=")return null;s==="("||s==="["||s==="{"?(r.push(s),n.push(0)):s===")"||s==="]"||s==="}"?(r.pop(),n.length>1&&n.pop()):s==="?"?(n[n.length-1]++,a=!0):s===":"&&n[n.length-1]>0&&n[n.length-1]--,o=s,i++}return a&&e.size>1?null:[...e]},Vn=/(?:await\s+)?(?:import\s*\(|(\$importAll)\s*\(\s*\[|(C79|Component79)\s*\.\s*(fetch|fetchAll|importAll)\s*\(\s*(\[)?)/y,Jn=/(["'])([^"'\n\\]+)\1/y,id=/^(?:(?:if|for|while|with)\b[\s\S]*\)|[\s\S]*\b(?:else|do))$/,sd=(t,e)=>{Vn.lastIndex=0;let n=Vn.exec(t);if(!n)return[];let[,r,a,o,i]=n;if(e.has(r??a??""))return[];let s=r!==void 0||i!==void 0;if(o!==void 0&&o==="fetch"===s)return[];let l=a===void 0?"component":o==="importAll"?"page":"fetch",c=[],d=Ie(t,Vn.lastIndex);for(;;){Jn.lastIndex=d;let f=Jn.exec(t);if(!f)return c;let h=Ie(t,Jn.lastIndex),y=t[h];if(!s)return y===")"||y===","?[{spec:f[2],kind:l}]:[];if(y!==","&&y!=="]"||(c.push({spec:f[2],kind:l}),y==="]"))return c;d=Ie(t,h+1)}},ld=t=>{let e=[];for(let i=Ie(t,0);i<t.length;i=Ie(t,i+1)){let s=xr(t,i);e.push(t.slice(i,s).trim().replace(/^export\s+(?!default\b)/,"")),i=s}let n=i=>{rn.lastIndex=0;let s=rn.exec(i);return s?wi(i.slice(s[0].length)).map(({raw:l})=>{let c=l.trim(),d=Cn(c);return d===-1?{target:c,init:""}:{target:c.slice(0,d).trim(),init:c.slice(d+1).trim()}}):null},r=new Set;e.forEach(i=>n(i)?.forEach(({target:s})=>on(s).forEach(l=>r.add(l))));let a=[],o=!1;for(let i of e){if(!o){ln.lastIndex=0;let s=ln.exec(i);if(s)/^type\s/.test(s[1]??"")||a.push({spec:s[3],kind:"component"});else{let l=n(i);for(let c of l?l.map(({init:d})=>d):[i])a.push(...sd(c,r))}}o=id.test(i)}return a},xe=t=>t.replace(/-(\w)/g,(e,n)=>n.toUpperCase()),dn=t=>t.replace(/[A-Z]/g,e=>`-${e.toLowerCase()}`),cd=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]),dd=/<([A-Za-z][\w.-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)\/>/g,ra=/(<script[\s\S]*?<\/script\s*>|<style[\s\S]*?<\/style\s*>)/gi,fd=t=>t.split(ra).map((e,n)=>n%2===1?e:e.replace(dd,(r,a,o)=>cd.has(a.toLowerCase())?r:`<${a}${o}></${a}>`)).join(""),Si=/<([A-Za-z][\w.-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g,hd=/"[^"]*"|'[^']*'|(^|\s)\.\.\.([A-Za-z_$][\w$.]*)/g,ud=t=>t.split(ra).map((e,n)=>n%2===1?e:e.replace(Si,(r,a,o)=>{let i=0,s=o.replace(hd,(l,c,d)=>d===void 0?l:`${c}:props.${i++}="${d}"`);return`<${a}${s}>`})).join(""),pd=/"[^"]*"|'[^']*'|(^|\s)(:[\w.$-]+)/g,md=/<\/slot\.([\w.$-]+)(\s*)>/gi,gd=/^slot\./i,yd=t=>gd.test(t)?`slot.${dn(t.slice(5))}`:t,fn=":jq79-component",xi=/^[A-Z]/,vd="c79-",On=t=>`${vd}${dn(t[0].toLowerCase()+t.slice(1))}`,wd=t=>xi.test(t)?On(t):yd(t),bd=/<\/([A-Z][\w.-]*)(\s*)>/g,kd=/\/\s*$/,Ad=(t,e)=>{if(!xi.test(t))return e;let n=` ${fn}="${t}"`,r=kd.exec(e);return r?`${e.slice(0,r.index)}${n}${r[0]}`:`${e}${n}`},Sd=t=>t.split(ra).map((e,n)=>n%2===1?e:e.replace(Si,(r,a,o)=>{let i=o.replace(pd,(s,l,c)=>c===void 0?s:`${l}${dn(c)}`);return`<${wd(a)}${Ad(a,i)}>`}).replace(md,(r,a,o)=>`</slot.${dn(a)}${o}>`).replace(bd,(r,a,o)=>`</${On(a)}${o}>`)).join(""),xd=t=>fd(ud(Sd(t))),Ed=/^[A-Z][A-Za-z0-9]*$/,Xn=/{{\s*([\s\S]+?)\s*}}/g,ao=new Map,Ei=t=>{let e=ao.get(t);if(e)return e;let n=[],r=0;Xn.lastIndex=0;for(let a=Xn.exec(t);a;a=Xn.exec(t))a.index>r&&n.push(t.slice(r,a.index)),n.push({expr:a[1]}),r=a.index+a[0].length;return r<t.length&&n.push(t.slice(r)),ao.set(t,n),n},Ii=new Set([":class",":value",":checked",":selected",":if",":elseif",":else",":each",":key",":window",":with",":text",":html",":html.allowed",":props"]),ht=t=>Ii.has(t)||t.startsWith(":class.")||t.startsWith(":props.")||t===":slot"||t.startsWith(":slot."),Id=/^\s*\(?\s*(\w+)\s*(?:,\s*(\w+))?\s*\)?\s+in\s+([\s\S]+)$/,aa=t=>t==="slot"||t.startsWith("slot."),Ci=t=>t?xe(t):"default",oo=t=>`${t}
= $value`,Oi=["$scope","$r"],Cd=t=>`with ($scope) { return (${t}
); }`,Od=(t,e)=>{let n=Ai(t);if(n===null)return null;let r=n.filter(a=>!e.includes(a));return`${r.length===0?"":`let $t; ${r.map(a=>`const ${a} = ($t = $scope.${a}) !== undefined ? $t : $r($scope, ${JSON.stringify(a)});`).join(" ")}`} return (${t}
);`},Er=(t,e)=>`${t.join(",")}
${e}`,io=t=>`await $mounted();${t}`,$d=t=>["$scope","$__effect","$__import","$__state",...t],Md=t=>`return (async () => { with ($scope) { ${t} }
;$__state.done = true })()`,Bd=t=>["$__exports","$__default","$__import",...t],Rd=t=>`return (async () => { "use strict";
${t}
;$__exports.done = true })()`,_d=t=>{let e=t.attrs[":setup"];return e===void 0?null:e.trim()===""?[]:na(e)},Pd=(t,e,n=ki)=>{let r=new Set;return t.forEach(a=>{(n(a.content)??e(a))?.forEach(({name:o})=>r.add(o))}),r},Nd="__jq79precompiled",zd="jq79-precompiled",Ld=(t,e)=>`function anonymous(${t.join(",")}
) {
${e}
}`,Td="0.7.14",$i=t=>Object.fromEntries(Array.from(t.attributes).map(e=>[e.name,e.value])),Mi="http://www.w3.org/1999/xhtml",Bi=t=>{let e=$i(t),n=t.namespaceURI,r=e[fn];delete e[fn];let a=n!==null&&n!==Mi;return{tag:a?t.tagName:t.tagName.toLowerCase(),attrs:e,...r===void 0?{}:{component:r},...a?{ns:n}:{},children:Array.from((t instanceof HTMLTemplateElement?t.content:t).childNodes).flatMap(o=>{if(o.nodeType===Node.TEXT_NODE){let i=o.textContent??"";return i?[i]:[]}return o.nodeType===Node.ELEMENT_NODE?[Bi(o)]:[]})}},hn=new Map,Jt=new Map,oa=!1,Ir,$n=class extends Error{constructor(t,e){super(`${t}. ${e}`),j(this,"reason",t),j(this,"hint",e)}},Dd=()=>new $n("was not precompiled","Safe mode never builds code at runtime: the component's precompiled functions did not reach the page."),Fd=(t,e)=>{let n=globalThis[Nd];if(Array.isArray(n)&&n.length>0)for(let[r,a,o]of n.splice(0))Jt.set(Er(r,a),o);return Jt.size===0?void 0:Jt.get(Er(t,e))},ia=(t,e,n="")=>{let r=Fd(t,e);if(r===null)throw new SyntaxError("jq79: this code did not compile when it was precompiled");if(r!==void 0)return r;if(Ir!==void 0)return jd(t,e,n,Ir);if(oa)throw Dd();return new Function(...t,e+n)},sa=()=>{if(!(typeof document>"u"))for(let t of Array.from(document.querySelectorAll("script[nonce]"))){let e=t.nonce||t.getAttribute("nonce");if(e)return e}},so="__jq79built",jd=(t,e,n,r)=>{let a=document.createElement("script");a.setAttribute("nonce",r),a.textContent=`document.currentScript.${so} = ${Ld(t,e)}${n}`;let o,i=l=>{o=l.error??new SyntaxError(l.message),l.preventDefault()};window.addEventListener("error",i);try{(document.head??document.documentElement).append(a)}finally{window.removeEventListener("error",i),a.remove()}let s=a[so];if(typeof s=="function")return Jt.set(Er(t,e),s),s;throw o!==void 0?o:new $n("could not be built","The page's CSP refused a <script> carrying the nonce jq79 read from the page.")},lo=new Set,Ud=(t,e)=>{lo.has(t)||(lo.add(t),console.error(`jq79: safeEval() is on, and "${t}" ${e.reason}, so it rendered as nothing. ${e.hint}`))},Kn=(t,e)=>{if(!(e in t)){if(e in globalThis)return globalThis[e];throw new ReferenceError(`${e} is not defined`)}},Ri=(t,e)=>{try{return ia([...Oi,...e],Cd(t))}catch(n){return n instanceof $n&&Ud(t,n),null}},qd=(t,e)=>{if(!Se.scopedNames)return null;let n=Od(t,e);if(n===null)return null;try{return ia([...Oi,...e],n)}catch{return null}},_i=(t,e,n)=>{let r=hn.get(t);if(r===void 0){let a=qd(e,n);r=a?{fn:a,scoped:!0}:{fn:Ri(e,n),scoped:!1},hn.set(t,r)}return r},Pi=(t,e)=>`${e.join(",")}|${t}`,Gd=(t,e)=>_i(Pi(t,e),t,e).fn,Qd=(t,e,n)=>{let r=Ri(e,n);return hn.set(t,{fn:r,scoped:!1}),r},Hd=/^(?:([\w$]+) is not defined|Can't find variable: ([\w$]+))/,Wd=100,He=new Map,la=new Set,un=0,Cr=!1,Or=new Set,Vd=()=>{Cr=!1,!(un>0)&&(He.forEach(({name:t,expr:e,scope:n},r)=>{t in n||(la.add(r),console.warn(`jq79: ${t} is not defined - evaluating "${e}". Template expressions resolve against the component store: a top-level let/var/const in a :setup script, a declared prop, or a global. Note a "function name() {}" declaration is not on the store - write "const name = () => {}".`))}),He.clear())},Ni=()=>{Cr||un>0||!He.size||(Cr=!0,queueMicrotask(Vd))},zi=t=>{un++;let e=()=>{un--,Ni()};t.then(e,e)},Jd=(t,e)=>{if(Or.has(t))return;Or.add(t);let n=e?.message||String(e);console.error(`jq79: ${n} - evaluating "${t}". The expression rendered as nothing. If the value arrives later, guard it - "a?.b", or :if on the element.`)},Li=(t,e,n)=>{if(!(n instanceof ReferenceError))return Jd(t,n);let r=Hd.exec(n.message),a=r?.[1]??r?.[2];if(!a)return;let o=`${a}|${t}`;la.has(o)||He.has(o)||He.size>=Wd||(He.set(o,{name:a,expr:t,scope:e}),Ni())},Ti=(t,e,n)=>{let r=n?Object.keys(n):[],a=Pi(t,r),{fn:o,scoped:i}=_i(a,t,r);if(!o)return;let s=n?Object.values(n):[];if(!i)return o(e,Kn,...s);try{return o(e,Kn,...s)}catch(l){if(!(l instanceof ReferenceError))throw l;let c=Qd(a,t,r);if(!c)throw l;return c(e,Kn,...s)}},Q=(t,e,n)=>{try{return Ti(t,e,n)}catch(r){Li(t,e,r);return}},Di=(t,e,n)=>{try{return Ti(t,e,n)}catch(r){if(!(r instanceof ReferenceError))throw r;Li(t,e,r);return}},Fi=(t,e)=>{if(t.length===1){let r=t[0];return typeof r=="string"?r:String(Q(r.expr,e)??"")}let n="";for(let r of t)n+=typeof r=="string"?r:String(Q(r.expr,e)??"");return n},ji=(t,e,n,r)=>{let[a,...o]=e.slice(1).split("."),i=new Set(o);t.addEventListener(a,s=>{if(i.has("self")&&s.target!==t)return;i.has("prevent")&&s.preventDefault(),i.has("stop")&&s.stopPropagation();let l=Di(n,r,{$event:s});typeof l=="function"&&l.call(t,s)},{once:i.has("once"),capture:i.has("capture")})},Xd=(t,e,n,r)=>{let[a,...o]=e.slice(1).split("."),i=new Set(o),s=l=>{i.has("prevent")&&l.preventDefault(),i.has("stop")&&l.stopPropagation(),i.has("once")&&t.off(a,s),Et(()=>{let c=Di(n,r,{$event:l});typeof c=="function"&&c(l)})};t.on(a,s)},ca=t=>t instanceof DocumentFragment?{first:t.firstChild,last:t.lastChild}:{first:t,last:t},Mn=({first:t,last:e})=>{for(let n=t;n;){let r=n===e?null:n.nextSibling;n.parentNode?.removeChild(n),n=r}},Kd=t=>{t.forEach(e=>{if(e.first===e.last)return Mn(e);if(!e.first.parentNode)return;let n=document.createRange();n.setStartBefore(e.first),n.setEndAfter(e.last),n.deleteContents()})},Yd=(t,e)=>{let n=[],r=null;return t.forEach(a=>{if(!e(a)){r=null;return}r&&r.last.nextSibling===a.range.first?r.last=a.range.last:n.push(r={first:a.range.first,last:a.range.last})}),n},Zd=({first:t,last:e},n)=>{let r=n.nextSibling;for(let a=t;a;){let o=a===e?null:a.nextSibling;n.parentNode.insertBefore(a,r),a=o}},co=(t,e)=>{let n=e.replace(/-/g,"").toLowerCase();for(let r=t;r&&r!==Object.prototype;r=Object.getPrototypeOf(r))for(let a of Object.keys(r))if(/^[A-Z]/.test(a)&&a.replace(/-/g,"").toLowerCase()===n)return a;return null},Fe=null,pn=null,Ui=new WeakSet,ef=t=>{let e={memo:Fe,base:pn};return Fe=new Map,pn=t,e},tf=t=>{Fe=t.memo,pn=t.base},fo=(t,e)=>t.component!==void 0?ho(e,t.component):t.tag.includes("-")?ho(e,t.tag):null,le=t=>t.component??t.tag,ho=(t,e)=>{if(!Fe)return co(t,e);let n=e.replace(/-/g,"").toLowerCase();for(let r=t;r&&r!==Object.prototype;r=Object.getPrototypeOf(r)){if(r===pn){if(Fe.has(e))return Fe.get(e);let a=co(r,e);return Fe.set(e,a),a}if(!Ui.has(r)){for(let a of Object.keys(r))if(/^[A-Z]/.test(a)&&a.replace(/-/g,"").toLowerCase()===n)return a}}return null},nf=t=>{let e=new Set;for(let n=t;n&&n!==Object.prototype;n=Object.getPrototypeOf(n))for(let r of Object.keys(n))/^[A-Z]/.test(r)&&e.add(r);return[...e].sort()},rf=(t,e)=>{let n=nf(e);return new Error(`jq79: <${t}> is not defined - no component of that name is in scope, and nothing renders here. Import it in a :setup script, declare it as a prop, or add a <template name="${t}"> to this file. In scope: ${n.length?n.join(", "):"(none)"}.`)},uo=100,Yn=0,qi=Symbol("jq79.slots"),It=t=>Object.keys(t.attrs).find(e=>e===":slot"||e.startsWith(":slot.")),af=t=>t==="default"?":slot":`:slot.${t}`,of=t=>typeof t!="string"||t.trim()!=="",sf=t=>{let e={},n=[];t.children.forEach(a=>{let o=typeof a=="object"&&a.tag==="template"?It(a):void 0;if(typeof a=="string"||o===void 0){n.push(a);return}let i=Ci(o.slice(6));if(i in e){console.warn(`jq79: two <template ${af(i)}> in <${le(t)}>; the second was ignored`);return}e[i]={nodes:a.children,binder:a.attrs[o]||void 0}});let r=n.some(of);return r&&"default"in e?console.warn(`jq79: <${le(t)}> has both a <template :slot> and content outside it - the <template> is the default slot's content, and the rest was ignored`):r&&(e.default={nodes:n,binder:t.attrs[":slot"]||void 0}),e},lf=(t,e,n)=>{na(e)?.forEach(({name:r,as:a,default:o})=>{let i=a??r;Object.defineProperty(t,i,{enumerable:!0,configurable:!0,get:()=>{let s=n[r]?.();return s===void 0&&o!==void 0?Q(o,t):s},set:()=>console.warn(`jq79: "${i}" is a slot prop - it comes from the component, so assigning to it does nothing`)})})},cf=t=>{let e=It(t);return console.warn(`jq79: <template ${e}> fills a slot only as a direct child of a component tag; here it rendered nothing`),document.createComment(`misplaced ${e}`)},df=(t,e)=>{let n=Object.entries(sf(t));if(!n.length)return null;let r={};return n.forEach(([a,o])=>{r[a]=ff(o,e)}),r},ff=(t,e)=>(n,r,a,o)=>{let i=Object.create(e);lf(i,t.binder,n);let s=i[Sr]??[];Object.defineProperty(i,Sr,{value:[...s,r]});let l=Pt(i);return l.ownedBy(r),a.onDispose(()=>l.dispose()),it(t.nodes,i,l,o)},hf=(t,e,n,r)=>{let a=Ci(t.tag.slice(5)),o=document.createDocumentFragment(),i=document.createComment(t.tag),s=document.createComment(`/${t.tag}`);o.append(i,s);let l=e[qi]?.[a];if(!l)return o.insertBefore(it(t.children,e,n,r),s),o;let c={};return Object.entries(t.attrs).forEach(([d,f])=>{if(!(d===st||ht(d)||d.startsWith("@")))if(d.startsWith(":")){let h=f||d.slice(1);c[xe(d.slice(1))]=()=>Q(h,e)}else c[xe(d)]=()=>f}),o.insertBefore(l(c,e,n,r),s),o},Gi="data-c79-box",uf=(t,e,n)=>{if(e.ns!==void 0)return document.createDocumentFragment();let r=document.createElement(On(t));r.setAttribute(Gi,"");let a=e.attrs[st];return a!==void 0&&r.setAttribute(st,a),n||th(),r},po=new WeakSet,pf=(t,e)=>{if(t.ns===void 0||po.has(t))return;let n=e.template.find(a=>typeof a=="object");if(n===void 0||n.ns!==void 0)return;po.add(t);let r=t.ns==="http://www.w3.org/1998/Math/MathML"?"<math>":"<svg>";console.warn(`jq79: <${le(t)}> is used inside ${r} and its template starts with <${n.tag.toLowerCase()}>, which is parsed as HTML - it renders and never draws. A component's template decides its own namespace, so root it at ${r}`)},mo=(t,e,n,r,a)=>{let o=uf(t,e,a),i=!(o instanceof DocumentFragment),s=i?null:document.createComment(`/${t}`);i||o.append(document.createComment(t),s);let l=df(e,n),c={},d={},f=[],h=[],y=!1,u;Object.entries(e.attrs).forEach(([b,O])=>{if(b!==st){if(b===":props"||b.startsWith(":props.")){y=!0,h.push({expr:O});return}if(ht(b)){fh.has(b)&&(u??(u=[])).push(b.slice(1));return}if(b.startsWith("@"))f.push([b,O]);else if(b===":model"||b.startsWith(":model.")){let R=b===":model"?"default":xe(b.slice(7));d[R]=O||(b===":model"?"model":R)}else if(b.startsWith(":")){let R=xe(b.slice(1));c[R]=O||R,h.push({name:R,expr:O||R})}else{let R=xe(b),U=JSON.stringify(O);c[R]=U,h.push({name:R,expr:U})}}});let g=b=>b==="default"?":model":`:model.${b}`,S=b=>b==="default"?"model":b,v=new Set;Object.entries(d).forEach(([b,O])=>{let R=S(b);c[R]!==void 0&&console.warn(`jq79: <${le(e)}> binds prop "${R}" through both :${R} and ${g(b)} - ${g(b)} wins`),c[R]=O,Gd(oo(O),["$value"])===null&&(v.add(b),console.warn(`jq79: ${g(b)}="${O}" is not assignable - updates from <${le(e)}> will be dropped`))});let p=()=>{let b={};return h.forEach(({name:O,expr:R})=>{if(O!==void 0)b[O]=Q(R,n);else{let U=Q(R,n);U!==null&&typeof U=="object"&&Object.assign(b,U)}}),Object.entries(d).forEach(([O,R])=>{b[S(O)]=Q(R,n)}),b},w=null,A=null,P=null,C=new Set,B=b=>{if(b==null){if(!n[ls]?.has(t)||C.has("unfilled"))return;C.add("unfilled"),console.error(`jq79: <${le(e)}> is declared as a prop and the parent passed nothing - nothing renders here. Pass it (:${t}="…"), or drop it from the signature to use the one declared in this file.`);return}C.has("type")||(C.add("type"),console.error(`jq79: <${le(e)}> is ${typeof b}, not a component - nothing renders here`))};return r.effect(()=>{let b=Q(t,n),O=b instanceof J?b:null;if(O||B(b),O===A||(P?.dispose(),P=null,w?.destroy(),w=null,A=O,!O))return;pf(e,O);let R=new J({template:O.template,scripts:O.scripts,styles:O.styles,modules:O.modules,filename:O.filename,siblings:O.siblings,name:O.name});if(l&&(R.slots=l),Object.keys(d).length){let W=new Set;R.modelWriteback=(G,te)=>{let Y=G==null?"default":xe(String(G)),fe=d[Y];return fe===void 0?(W.has(Y)||(W.add(Y),console.warn(`jq79: <${le(e)}> has no ${g(Y)} - bound: ${Object.keys(d).map(g).join(", ")}`)),!1):v.has(Y)?!1:(Et(()=>Q(oo(fe),n,{$value:te})),!0)}}f.forEach(([W,G])=>Xd(R,W,G,n));let U=ch(R.scripts);dh(e,t,Object.keys(c),U),u&&hh(e,t,u,U);let H=Io(Et(p),U),$=document.createDocumentFragment();if(Yn>=uo){console.error(`jq79: <${le(e)}> is ${uo} levels deep inside itself; giving up here. A component that renders itself stops when its data stops - is there a cycle in it?`);return}Yn++;try{(a?R.renderShadow(H):R.render(H)).mount($)}finally{Yn--}let N=n[vn];N&&R.holdOwner(N.owner),s?s.parentNode.insertBefore($,s):o.appendChild($);let T=Pt(n,!0);if(y){let W=[];T.effect(()=>{let G=Io(p(),U),te=Object.keys(G);W.forEach(Y=>{Y in G||(R.data[Y]=void 0)}),te.forEach(Y=>{R.data[Y]=G[Y]}),W=te})}else Object.entries(c).forEach(([W,G])=>{U!==null&&!U.has(W)||T.effect(()=>{R.data[W]=Q(G,n)})});P=T,w=R}),r.onDispose(()=>{P?.dispose(),w?.destroy()}),o},mf=(t,e)=>{let n=()=>{let r=Q(t,e);return r!==null&&typeof r=="object"?r:null};return new Proxy(e,{has(r,a){let o=n();return o!==null&&Reflect.has(o,a)||Reflect.has(r,a)},get(r,a){let o=n();return o!==null&&Reflect.has(o,a)?o[a]:Reflect.get(r,a)},set(r,a,o){let i=n();return i!==null&&Reflect.has(i,a)?(i[a]=o,!0):Reflect.set(r,a,o)}})},Pe=t=>typeof t=="string"?t.split(/\s+/).filter(Boolean):Array.isArray(t)?t.flatMap(Pe):t!==null&&typeof t=="object"?Object.entries(t).flatMap(([e,n])=>n?Pe(e):[]):[],gf=t=>typeof t=="function"?(e,n,r)=>{try{return!!t(e,n,r)}catch{return!1}}:typeof t=="string"||Array.isArray(t)?$c(t):()=>!1,yf=new Set(["allowfullscreen","async","autofocus","autoplay","checked","controls","default","defer","disabled","formnovalidate","inert","ismap","itemscope","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","selected"]),da=t=>t.ns===void 0?document.createElement(t.tag):document.createElementNS(t.ns,t.tag),vf={"http://www.w3.org/2000/svg":["svg","feGaussianBlur"],"http://www.w3.org/1998/Math/MathML":["math","mi"]},go=new Map,wf=(t,e)=>{let n=`${t} ${e}`,r=go.get(n);if(r!==void 0)return r;let a=vf[t],o=e;if(a!==void 0&&typeof DOMParser<"u"&&/^[a-z][a-z0-9]*$/.test(e)){let[i,s]=a;o=new DOMParser().parseFromString(`<${i}><${s} ${e}="x"/></${i}>`,"text/html").querySelector(s)?.getAttributeNames().find(l=>l.toLowerCase()===e)??e}return go.set(n,o),o},Qi=(t,e)=>{let n=t.namespaceURI;if(n===null||n===Mi)return e;let r=e.replace(/-/g,"").toLowerCase(),a=wf(n,r);return a===r?e:a},Hi=(t,e,n)=>{let r=yf.has(e);(r?!n:n==null)?t.removeAttribute(e):t.setAttribute(e,r?"":String(n))},Se={cloneSkeletons:!0,scopedNames:!0},bf=new Set([":text",":html",":value",":checked",":selected"]),kf=t=>t.startsWith("@")||t===":class"||t.startsWith(":class.")||bf.has(t)?!0:t.startsWith(":")?t===":model"?!1:!ht(t)&&!t.includes("."):t!==fn,Wi=t=>{if(t.component||t.tag.includes("-")||aa(t.tag)||t.tag==="template"||t.ns===void 0&&document.createElement(t.tag)instanceof HTMLUnknownElement)return!1;for(let e in t.attrs)if(!kf(e))return!1;return t.attrs[":text"]!==void 0||t.attrs[":html"]!==void 0?!0:t.children.every(e=>typeof e=="string"||Wi(e))},Vi=(t,e,n)=>{let r=da(t),a,o=null;for(let f in t.attrs){let h=t.attrs[f];if(f.startsWith("@"))n.push({kind:"event",path:e,attr:f,expr:h});else if(f===":class")a=h;else if(f.startsWith(":class."))(o??(o=[])).push([f.slice(7),h]);else if(!ht(f))if(f.startsWith(":")){let y=f.slice(1);n.push({kind:"attr",path:e,name:Qi(r,y),expr:h||xe(y)})}else r.setAttribute(f,h)}(a!==void 0||o)&&n.push({kind:"class",path:e,classExpr:a,toggles:o,staticClasses:new Set(Pe(t.attrs.class??""))});let i=t.attrs[":text"],s=t.attrs[":html"];i!==void 0?n.push({kind:"textContent",path:e,expr:i}):s!==void 0?n.push({kind:"html",path:e,expr:s}):t.children.forEach((f,h)=>{if(typeof f=="string"){f.includes("{{")?(n.push({kind:"text",path:[...e,h],parts:Ei(f)}),r.appendChild(document.createTextNode(""))):r.appendChild(document.createTextNode(f));return}r.appendChild(Vi(f,[...e,h],n))});let l=t.attrs[":value"];l!==void 0&&n.push({kind:"value",path:e,expr:l});let c=t.attrs[":checked"];c!==void 0&&n.push({kind:"checked",path:e,expr:c});let d=t.attrs[":selected"];return d!==void 0&&n.push({kind:"selected",path:e,expr:d}),r},Af=3,Ji=t=>t.attrs[":text"]!==void 0||t.attrs[":html"]!==void 0?1:1+t.children.reduce((e,n)=>e+(typeof n=="string"?0:Ji(n)),0),yo=new WeakMap,vo=new WeakSet,Sf=t=>{let e=yo.get(t);if(e!==void 0)return e;if(!vo.has(t))return vo.add(t),null;let n=null;if(Wi(t)&&Ji(t)>=Af){let r=[];n={skeleton:Vi(t,[],r),ops:r}}return yo.set(t,n),n},xf=(t,e)=>{let n=t;for(let r=0;r<e.length;r++)n=n.childNodes[e[r]];return n},Ef=(t,e,n)=>{let r=t.skeleton.cloneNode(!0);for(let a of t.ops){let o=a.path.length===0?r:xf(r,a.path);if(a.kind==="text"){let i=o,s=a.parts;n.effect(()=>{let l=Fi(s,e);i.textContent!==l&&(i.textContent=l)})}else if(a.kind==="event")ji(o,a.attr,a.expr,e);else if(a.kind==="attr"){let i=o,{name:s,expr:l}=a;n.effect(()=>Hi(i,s,Q(l,e)))}else if(a.kind==="class"){let i=o,{classExpr:s,toggles:l,staticClasses:c}=a,d=[];n.effect(()=>{let f=s!==void 0?Pe(Q(s,e)):[];l?.forEach(([h,y])=>{Q(y,e)&&f.push(...Pe(h))}),d.forEach(h=>{!f.includes(h)&&!c.has(h)&&i.classList.remove(h)}),i.classList.add(...f),d=f})}else if(a.kind==="textContent"){let i=o,{expr:s}=a;n.effect(()=>{let l=String(Q(s,e)??"");i.textContent!==l&&(i.textContent=l)})}else if(a.kind==="html"){let i=o,{expr:s}=a;n.effect(()=>{i.innerHTML=ui(String(Q(s,e)??""))})}else if(a.kind==="value"){let i=o,{expr:s}=a;n.effect(()=>{let l=String(Q(s,e)??"");i.value!==l&&(i.value=l)})}else if(a.kind==="checked"){let i=o,{expr:s}=a;n.effect(()=>{let l=!!Q(s,e);i.checked!==l&&(i.checked=l)})}else if(a.kind==="selected"){let i=o,{expr:s}=a;n.effect(()=>{let l=!!Q(s,e);i.selected!==l&&(i.selected=l)})}}return r},fa=(t,e,n,r)=>{let a=t.attrs[":with"],o=a!==void 0?mf(a,e):e;if(aa(t.tag))return hf(t,o,n,r);if(t.tag==="template"&&It(t)!==void 0)return cf(t);let i=fo(t,o);if(i)return mo(i,t,o,n,r);if(Se.cloneSkeletons){let v=Sf(t);if(v)return Ef(v,o,n)}let s=da(t);if(t.component!==void 0&&o[vn]?.count===0)throw rf(t.component,o);let l=t.ns===void 0&&(t.component!==void 0||t.tag.includes("-"));if(l){let v=!1;n.effect(()=>{if(v)return;let p=fo(t,o);if(!p)return;v=!0;let w=mo(p,t,o,n,r),A=ca(w);n.onDispose(()=>Mn(A)),s.replaceWith(w)})}for(let v in t.attrs){let p=t.attrs[v];if(v.startsWith("@"))ji(s,v,p,o);else if(v===":model"||v.startsWith(":model."))l||console.warn(`jq79: ${v} on <${le(t)}> does nothing - :model binds component tags only (for now)`);else if(!ht(v))if(v.startsWith(":"))if(l)s.setAttribute(v,p);else{let w=v.slice(1),A=p||xe(w),P=Qi(s,w);n.effect(()=>Hi(s,P,Q(A,o)))}else s.setAttribute(v,p)}let c=t.attrs[":class"],d=null;for(let v in t.attrs)v.startsWith(":class.")&&(d??(d=[])).push([v.slice(7),t.attrs[v]]);if(c!==void 0||d){let v=new Set(Pe(t.attrs.class??"")),p=[];n.effect(()=>{let w=c!==void 0?Pe(Q(c,o)):[];d?.forEach(([A,P])=>{Q(P,o)&&w.push(...Pe(A))}),p.forEach(A=>{!w.includes(A)&&!v.has(A)&&s.classList.remove(A)}),s.classList.add(...w),p=w})}let f=t.attrs[":text"],h=t.attrs[":html"],y=t.attrs[":html.allowed"];y!==void 0&&h===void 0&&console.warn("jq79: :html.allowed without :html on the same element does nothing"),f!==void 0?n.effect(()=>{let v=String(Q(f,o)??"");s.textContent!==v&&(s.textContent=v)}):h!==void 0?n.effect(()=>{let v=y!==void 0?{allowUrl:gf(Q(y,o))}:void 0;s.innerHTML=ui(String(Q(h,o)??""),v)}):s instanceof HTMLTemplateElement?it(t.children,o,n,r,s.content):it(t.children,o,n,r,s);let u=t.attrs[":value"];u!==void 0&&n.effect(()=>{let v=String(Q(u,o)??"");s.value!==v&&(s.value=v)});let g=t.attrs[":checked"];g!==void 0&&n.effect(()=>{let v=!!Q(g,o);s.checked!==v&&(s.checked=v)});let S=t.attrs[":selected"];return S!==void 0&&n.effect(()=>{let v=!!Q(S,o);s.selected!==v&&(s.selected=v)}),s},If=(t,e,n,r)=>{let a=document.createComment("if"),o=document.createDocumentFragment();o.appendChild(a);let i=null,s=null,l=null;return n.effect(()=>{let c=t.find(f=>f.expr===void 0||Q(f.expr,e))??null;if(c===s||(l?.dispose(),i&&Mn(i),i=null,s=c,!c))return;l=Pt(e);let d=fa(c.node,e,l,r);i=ca(d),a.parentNode.insertBefore(d,a.nextSibling)}),n.onDispose(()=>l?.dispose()),o},Ze=(t,e,n)=>{Object.defineProperty(t,e,{value:n,writable:!0,enumerable:!0,configurable:!0})},Cf=t=>{let e=new Uint8Array(t.length),n=[],r=new Int32Array(t.length).fill(-1);for(let a=0;a<t.length;a++){let o=t[a];if(o<0)continue;let i=0,s=n.length;for(;i<s;){let l=i+s>>1;t[n[l]]<o?i=l+1:s=l}i>0&&(r[a]=n[i-1]),n[i]=a}for(let a=n.length?n[n.length-1]:-1;a!==-1;a=r[a])e[a]=1;return e},Of=t=>{if(t===null||typeof t!="object"||Array.isArray(t))return!1;let e=Object.getPrototypeOf(t);return e===Object.prototype||e===null},Xi=(t,e)=>typeof t=="string"?e.some(n=>bo(t,n)):Object.values(t.attrs).some(n=>e.some(r=>bo(n,r)))||t.children.some(n=>Xi(n,e)),Ki=t=>typeof t!="string"&&(":if"in t.attrs||":elseif"in t.attrs||":else"in t.attrs||":each"in t.attrs||t.component!==void 0||t.tag.includes("-")||aa(t.tag)||t.children.some(Ki)),wo=/[A-Za-z0-9_$]/,$f=/^[A-Za-z_$][\w$]*\.[A-Za-z_$][\w$]*$/,bo=(t,e)=>{for(let n=t.indexOf(e);n!==-1;n=t.indexOf(e,n+1)){let r=n===0?"":t[n-1],a=t[n+e.length]??"";if(!wo.test(r)&&!wo.test(a))return!0}return!1},Zn=new WeakMap,Mf=t=>{let e=Zn.get(t);if(e!==void 0)return e;let n=t.attrs[":each"].match(Id);if(!n)return Zn.set(t,null),null;let[,r,a,o]=n,i=t.attrs[":key"],s=i===r,l=i!==void 0&&!s&&$f.test(i)&&i.startsWith(`${r}.`)?i.slice(r.length+1):void 0,{[":each"]:c,[":key"]:d,[":window"]:f,...h}=t.attrs,y={...t,attrs:h},u=["$index",...a?[a]:[]],g=Xi(y,u),S=/^[A-Z]/.test(r)||a!==void 0&&/^[A-Z]/.test(a),v=i!==void 0&&Ki(y),p={itemName:r,atName:a,listExpr:o,keyExpr:i,keyIsItem:s,keyProp:l,itemNode:y,readsPosition:g,namesComponent:S,nestsScopes:v,windowExpr:f};return Zn.set(t,p),p},Lt=8,Bf=/^(auto|scroll|overlay)$/,Rf=t=>{for(let e=t;e;e=e instanceof ShadowRoot?e.host:e.parentNode)if(!(!(e instanceof HTMLElement)||e===document.body||e===document.documentElement)&&Bf.test(getComputedStyle(e).overflowY))return e;return null},_f=(t,e,n,r,a)=>{let o=()=>{let b=t.component!==void 0||t.tag.includes("-")?document.createElement("div"):da(t);return b.setAttribute("aria-hidden","true"),b.setAttribute("style","height: 0px; margin: 0; padding: 0; border: 0; list-style: none; visibility: hidden"),b},i=o(),s=o(),l=Ke({start:0,count:-1}),c=0,d=0,f=null,h=!1,y=0,u=null,g=null,S=b=>Math.ceil(b/c)+1+2*Lt,v=(b,O)=>{b=Math.max(0,Math.min(b,Math.max(0,d-O))),(l.start!==b||l.count!==O)&&yi(()=>{l.start=b,l.count=O})},p=()=>{let b=i.getBoundingClientRect().top;if(f){let O=f.getBoundingClientRect(),R=f.scrollTop;return{listTop:b-O.top-f.clientTop+R,scrollTop:R,height:f.clientHeight||window.innerHeight}}return{listTop:b+window.scrollY,scrollTop:window.scrollY,height:window.innerHeight}},w=()=>{if(y=0,!(c>0)||!i.isConnected)return;let{listTop:b,scrollTop:O,height:R}=p();v(Math.floor((O-b)/c)-Lt,S(R))},A=()=>{y||(y=typeof requestAnimationFrame=="function"?requestAnimationFrame(w):setTimeout(w,16))},P=(b,{block:O="nearest"}={})=>{if(C(),c>0&&i.isConnected){let{listTop:H,scrollTop:$,height:N}=p(),T=H+b*c,W=T+c,G=$;O==="start"?G=T:O==="end"?G=W-N:O==="center"?G=T-(N-c)/2:T<$?G=T:W>$+N&&(G=W-N),G!==$&&(f?f.scrollTop=G:window.scrollTo(window.scrollX,G)),w()}let R=l.count>0?l.count:S(window.innerHeight||800);(b<l.start||b>=l.start+R)&&v(b-Lt,R);let U=a().find(H=>H.scope.$index===b);return U?U.range.first:null},C=()=>{h||!i.isConnected||(h=!0,g=i.parentElement,f=Rf(i.parentNode),(f??window).addEventListener("scroll",A,{passive:!0}),window.addEventListener("resize",A),f&&typeof ResizeObserver=="function"&&(u=new ResizeObserver(A),u.observe(f)),g&&Object.defineProperty(g,"$scrollTo",{value:P,configurable:!0,writable:!0}),w())};r.onDispose(()=>{y&&(typeof cancelAnimationFrame=="function"?cancelAnimationFrame:clearTimeout)(y),h&&((f??window).removeEventListener("scroll",A),window.removeEventListener("resize",A),u?.disconnect(),g&&g.$scrollTo===P&&delete g.$scrollTo)});let B=!1;return{top:i,bottom:s,range:b=>{d=b;let O=Number(Q(e,n)),R=c;if(c=O>0?O:0,c&&c!==R&&h&&i.isConnected){let{listTop:N,scrollTop:T,height:W}=p(),G=ae(l);G.count=S(W),G.start=Math.max(0,Math.floor((T-N)/c)-Lt)}if(!c)return i.style.height=s.style.height="0px",[0,b];let U=l.count>0?l.count:S(window.innerHeight||800),H=Math.max(0,Math.min(l.start,b-U)),$=Math.min(b,H+U);return i.style.height=`${H*c}px`,s.style.height=`${(b-$)*c}px`,[H,$]},settled:()=>{h||B||(B=!0,queueMicrotask(()=>{B=!1,C()}))}}},Pf=(t,e,n,r)=>{let a=Mf(t);if(!a)return document.createComment(`invalid :each expression "${t.attrs[":each"]}"`);let{itemName:o,atName:i,listExpr:s,keyExpr:l,keyIsItem:c,keyProp:d,itemNode:f,readsPosition:h,namesComponent:y,nestsScopes:u,windowExpr:g}=a,S=document.createComment("each"),v=document.createDocumentFragment();v.appendChild(S);let p=g===void 0?null:_f(f,g,e,n,()=>w);p&&v.append(p.top,p.bottom),(":if"in t.attrs||":elseif"in t.attrs||":else"in t.attrs)&&console.warn("jq79: :if/:elseif/:else on a :each element is ignored; filter the list expression instead");let w=[],A=!1;return n.effect(()=>{let P=ef(e);try{let C=Q(s,e),B=Array.isArray(C),b=B?null:Of(C)?Object.keys(C):[],O=B?C.length:b.length,[R,U]=p?p.range(O):[0,O],H=new Map;w.forEach((m,E)=>{m.pos=E;let x=H.get(m.key);x?x.push(m):H.set(m.key,[m])});let $=new Set,N=[],T=[],W=[],G=[],te;for(let m=R;m<U;m++){let E=B?m:b[m],x=B?C[m]:C[E],_=E;c?_=x:d!==void 0&&x!==null&&typeof x=="object"?_=x[d]:l!==void 0&&(te===void 0?(te=Object.create(e),Ze(te,o,x),i&&Ze(te,i,E),Ze(te,"$index",m)):(te[o]=x,i&&(te[i]=E),te.$index=m),_=Q(l,te)),$.has(_)&&!A&&(A=!0,console.warn(`jq79: duplicate :key in :each "${t.attrs[":each"]}"; duplicates pair up by position`)),$.add(_);let I=H.get(_)?.shift();if(I&&Object.is(I.item,x)){let D=I.scope;D.$index!==m&&(h&&N.push(I),D.$index=m),i&&D[i]!==E&&(D[i]=E),W.push(I),G.push(I.pos);continue}if(I&&l!==void 0){let D=I.scope;D[o]=x,D.$index!==m&&(D.$index=m),i&&D[i]!==E&&(D[i]=E),I.item=x,T.push(I),W.push(I),G.push(I.pos);continue}I&&(I.fx.dispose(),Mn(I.range));let M=Object.create(e);Ze(M,o,x),i&&Ze(M,i,E),Ze(M,"$index",m),y||Ui.add(M);let L=Pt(e);u&&Object.defineProperty(M,vi,{value:L});let z=ca(fa(f,M,L,r));W.push({key:_,item:x,scope:M,fx:L,range:z,pos:m}),G.push(-1)}let Y=new Set;H.forEach(m=>m.forEach(E=>Y.add(E))),Y.size&&(Y.forEach(m=>{m.dead=!0,m.fx.dispose()}),Kd(Yd(w,m=>m.dead===!0)));let fe=p?p.top:S,k=Cf(G);W.forEach((m,E)=>{!k[E]&&fe.nextSibling!==m.range.first&&Zd(m.range,fe),fe=m.range.last}),N.forEach(m=>Et(()=>m.fx.refresh())),T.forEach(m=>Et(()=>m.fx.rerun())),w=W}finally{tf(P)}p?.settled()}),n.onDispose(()=>w.forEach(P=>P.fx.dispose())),v},Yi=(t,e)=>{let n=e;for(;n<t.length&&typeof t[n]=="string"&&!t[n].trim();)n++;return n},er=t=>{let e=":if"in t.attrs,n=":elseif"in t.attrs,r=":else"in t.attrs;if((e?1:0)+(n?1:0)+(r?1:0)<2)return;let a=[e?":if":null,n?":elseif":null,r?":else":null].filter(Boolean);console.warn(`jq79: ${a.join(" and ")} on the same <${le(t)}> - only ${a[0]} applies; the branches of a chain are sibling elements, one directive each`)},Nf=(t,e)=>{let n=":elseif"in t.attrs?":elseif":":else";console.warn(e?`jq79: a second ${n} on <${le(t)}> - the chain before it already ended with :else, which closes it. One :if, any number of :elseif, at most one :else`:`jq79: ${n} on <${le(t)}> continues no :if - it renders unconditionally. A chain is :if, then :elseif, then :else, on adjacent siblings: anything but whitespace between them breaks it`)},zf=[":if",":elseif",":else",":each"],Lf=(t,e)=>{if(t.tag!=="template"||t.ns!==void 0)return;let n=zf.find(r=>r in t.attrs);if(n!==void 0){if(It(t)!==void 0){if(e?.component===void 0)return;console.warn(`jq79: ${n} on <template ${It(t)}> is ignored - a slot is filled with its children as written. Put ${n} on the elements inside it, or on the component's tag`);return}console.warn(`jq79: ${n} on a nested <template> shows nothing - a <template>'s children live in its .content and never reach the page. Put ${n} on the elements themselves`)}},Tf=[...Ii,":model",":slot"].map(t=>t.slice(1)),Df={":attrs":':attrs was removed in 0.7 - it now binds an attribute called "attrs". Bind them one at a time (:disabled="x", :title="y"), or :class for classes'},Ff=t=>{for(let e in t.attrs){let n=Df[e];n!==void 0&&console.warn(`jq79: ${n}`)}},jf=t=>{if(!(t.component!==void 0||t.tag.includes("-")))for(let e in t.attrs){if(!e.startsWith(":")||ht(e)||e===":model"||e.startsWith(":model."))continue;let n=e.slice(1);if(n.includes(".")){console.warn(`jq79: ${e} is not a directive - it bound an attribute named "${n}". Dotted modifiers belong to an event: if you meant @${n}, that is the spelling`);continue}let r=Tf.find(a=>n!==a&&n.startsWith(a));r!==void 0&&console.warn(`jq79: ${e} is not a directive - it bound an attribute named "${n}". A ":name" jq79 does not recognize binds that attribute (which is what :src and :disabled are). If you meant :${r}, that is the spelling`)}},Zi=(t,e)=>{t.forEach(r=>{typeof r!="string"&&(Lf(r,e),Ff(r),jf(r),Zi(r.children,r))});let n=!1;for(let r=0;r<t.length;){let a=t[r];if(typeof a=="string"){a.trim()&&(n=!1),r++;continue}if(":each"in a.attrs){n=!1,r++;continue}if(er(a),":if"in a.attrs){r++;let o=s=>{let l=Yi(t,r),c=t[l];if(typeof c=="object"&&s in c.attrs)return r=l+1,c};for(let s=o(":elseif");s;s=o(":elseif"))er(s);let i=o(":else");i&&er(i),n=i!==void 0;continue}(":elseif"in a.attrs||":else"in a.attrs)&&Nf(a,n),n=!1,r++}},ko=new WeakMap,Uf=(t,e,n)=>{let r=ko.get(e);if(r)return r;let a=[{expr:e.attrs[":if"],node:e}],o=n+1,i=c=>{let d=Yi(t,o),f=t[d];if(typeof f=="object"&&c in f.attrs)return o=d+1,f};for(let c=i(":elseif");c;c=i(":elseif"))a.push({expr:c.attrs[":elseif"],node:c});let s=i(":else");s&&a.push({node:s});let l={branches:a,next:o};return ko.set(e,l),l},it=(t,e,n,r=!1,a)=>{let o=a??document.createDocumentFragment(),i=0;for(;i<t.length;){let s=t[i];if(typeof s=="string"){let l=document.createTextNode(s);if(s.includes("{{")){let c=Ei(s);n.effect(()=>{let d=Fi(c,e);l.textContent!==d&&(l.textContent=d)})}o.appendChild(l),i++;continue}if(":each"in s.attrs){o.appendChild(Pf(s,e,n,r)),i++;continue}if(":if"in s.attrs){let l=Uf(t,s,i);o.appendChild(If(l.branches,e,n,r)),i=l.next;continue}o.appendChild(fa(s,e,n,r)),i++}return o},st="data-jq79",qf=t=>{let e=2166136261;for(let n=0;n<t.length;n++)e=Math.imul(e^t.charCodeAt(n),16777619);return(e>>>0).toString(36)},es=(t,e)=>{t.forEach(n=>{typeof n!="string"&&(n.attrs[st]=e,es(n.children,e))})},Gf=/^:(before|after|first-line|first-letter)(?![\w-])/i,ts=(t,e)=>{let n=0;for(let r=0;r<t.length;r++){let a=t[r];if(a==="\\")r++;else if(a==='"'||a==="'")for(r++;r<t.length&&t[r]!==a;)r+=t[r]==="\\"?2:1;else if(a==="("||a==="[")n++;else if(a===")"||a==="]")n--;else if(n===0&&e(r))return}},Qf=(t,e)=>{let n=t.length;return ts(t,r=>t[r]!==":"||t[r+1]!==":"&&!Gf.test(t.slice(r))?!1:(n=r,!0)),`${t.slice(0,n)}[${st}="${e}"]${t.slice(n)}`},Hf=(t,e)=>{let n=ns(t),r=n.match(/^\s*/)[0],a=n.match(/\s*$/)[0],o=n.slice(r.length,n.length-a.length);if(!o)return t;let i=[],s=0;return ts(o,l=>{o[l]===","&&(i.push(o.slice(s,l)),s=l+1)}),i.push(o.slice(s)),r+i.map(l=>l.trim()&&Qf(l.trim(),e)).join(", ")+a},ns=t=>{let e="";for(let n=0;n<t.length;){let r=t[n];if(r==="/"&&t[n+1]==="*"){let a=t.indexOf("*/",n+2);n=a===-1?t.length:a+2}else if(r==='"'||r==="'"){let a=n+1;for(;a<t.length&&t[a]!==r;)a+=t[a]==="\\"?2:1;e+=t.slice(n,a+1),n=a+1}else r==="\\"?(e+=t.slice(n,n+2),n+=2):(e+=r,n++)}return e},Wf=/(^|[\s>+~,(])([A-Z][A-Za-z0-9]*)(?![\w-])/g,Vf=/[a-z]/,Jf=t=>t.replace(Wf,(e,n,r)=>Vf.test(r)?`${n}${On(r)}`:e),rs=/^\s*@(media|supports|container|layer|scope|document)\b/i,as=/^\s*@/,Xf=t=>{let e="",n="",r="",a=[],o=()=>a.length===0||a[a.length-1],i=()=>{e+=o()&&!as.test(r)?Jf(n):n,n=""},s=c=>{i(),e+=c,r+=c},l=(c,d)=>{i(),e+=c,r="",d!==void 0?a.push(d):c==="}"&&a.pop()};for(let c=0;c<t.length;){let d=t[c];if(d==="/"&&t[c+1]==="*"){let f=t.indexOf("*/",c+2),h=f===-1?t.length:f+2;s(t.slice(c,h)),c=h}else if(d==='"'||d==="'"){let f=c+1;for(;f<t.length&&t[f]!==d;)f+=t[f]==="\\"?2:1;s(t.slice(c,Math.min(f+1,t.length))),c=f+1}else d==="{"?(l("{",rs.test(r)),c++):d==="}"||d===";"?(l(d),c++):(n+=d,r+=d,c++)}return i(),e},Kf=(t,e)=>{/:deep\(|::v-deep|>>>/.test(t)&&console.warn("jq79: :deep()/::v-deep/>>> are not supported in <style scoped>; the rule will be dropped by the browser");let n="",r="",a=[],o=()=>a.length===0||a[a.length-1];for(let i=0;i<t.length;){let s=t[i],l=s;if(s==="/"&&t[i+1]==="*"){let c=t.indexOf("*/",i+2);l=t.slice(i,c===-1?t.length:c+2)}else if(s==='"'||s==="'"){let c=i+1;for(;c<t.length&&t[c]!==s;)c+=t[c]==="\\"?2:1;l=t.slice(i,c+1)}else s==="\\"&&(l=t.slice(i,i+2));if(i+=l.length,!o())n+=l,l==="{"?a.push(!1):l==="}"&&a.pop();else if(l==="{"){let c=ns(r),d=as.test(c);n+=(d?r:Hf(r,e))+"{",a.push(d&&rs.test(c)),r=""}else l==="}"||l===";"?(n+=r+l,r="",l==="}"&&a.pop()):r+=l}return n+r},$r=t=>{let e=xd(t),n=new DOMParser().parseFromString(`<template>${e}</template>`,"text/html").querySelector("template"),r=[],a=[];Array.from(n.content.children).forEach(s=>{s.tagName==="TEMPLATE"?a.push(s):r.push(s)});let o=Ao(r,t),i={};return a.forEach(s=>{let l=s.getAttribute("name");if(l===null){console.warn("jq79: a top-level <template> without a name declares nothing and was ignored");return}if(!Ed.test(l)){console.warn(`jq79: <template name="${l}"> was ignored - a component name has to be PascalCase, or no tag could ever reference it (only capitalized names resolve as components)`);return}if(l in i){console.warn(`jq79: two <template name="${l}"> in one file; the second was ignored`);return}i[l]=new J({...Ao(Array.from(s.content.children),s.innerHTML),siblings:i,name:l})}),Object.keys(i).length&&(o.siblings=i),o},Yf=/^(?:text|application)\/(?:x-)?typescript$/i,Zf=t=>"lang"in t?`lang="${t.lang}"`:Yf.test(t.type?.trim()??"")?`type="${t.type}"`:null,Ao=(t,e)=>{let n=[],r=[],a=[];t.forEach(i=>{let s={attrs:$i(i),content:i.textContent??""};i.tagName==="SCRIPT"?n.push(s):i.tagName==="STYLE"?r.push(s):a.push(Bi(i))}),n.forEach(i=>{let s=Zf(i.attrs);s&&console.warn(`jq79: <script ${s}> needs the jq79/vite plugin to compile it. This component didn't go through the bundler, so its types were never stripped: the script will throw, or - for a plain \`let x: T = ...\` - silently fail to declare x.`)}),r.forEach(i=>{"lang"in i.attrs&&console.warn(`jq79: <style lang="${i.attrs.lang}"> needs the jq79/vite plugin to compile it. This component didn't go through the bundler, so its styles were left uncompiled and the browser will ignore them.`)}),r.forEach(i=>{"lang"in i.attrs||(i.content=Xf(i.content))});let o=i=>"scoped"in i.attrs&&!("lang"in i.attrs);if(r.some(o)){let i=qf(e);es(a,i),r.forEach(s=>{o(s)&&(s.scoped=Kf(s.content,i))})}return Zi(a),{template:a,scripts:n,styles:r}},os=/\.html?([?#]|$)/,mn=t=>os.test(t)?Pr(t):import(t),ha=/^(?:\.\.?\/|\/|[a-z][a-z0-9+.-]*:)/i,Mr=(t,e)=>{if(!ha.test(t))return t;try{return new URL(t,new URL(e??"",document.baseURI)).href}catch{return t}},eh=(t,e)=>t?`
//# sourceURL=${t}?jq79-script=${e}`:"",is=(t,e,n)=>{try{return ia(t,e,eh(n.filename,n.index??0))}catch(r){throw r instanceof $n?new Error(`jq79: safeEval() is on, and script ${n.index??0} of ${n.filename??"a component built from a string"} ${r.reason}. ${r.hint}`):r}},So=t=>t.scoped??t.content,vt=`:where([${Gi}]) { display: contents }`,ua=()=>oa&&typeof Document<"u"&&"adoptedStyleSheets"in Document.prototype,gn=t=>{let e=new CSSStyleSheet;return e.replaceSync(t),e},pa=(t,e)=>{t.adoptedStyleSheets.includes(e)||(t.adoptedStyleSheets=[...t.adoptedStyleSheets,e])},Br=(t,e)=>{t.adoptedStyleSheets=t.adoptedStyleSheets.filter(n=>n!==e)},Tt=null,wt=null,th=()=>{if(ua()){pa(document,wt??(wt=gn(vt)));return}Tt?.isConnected||(Tt=document.createElement("style"),Tt.textContent=vt,document.head.appendChild(Tt))},yn=new Map,nh=t=>{let e=yn.get(t);if(!e){if(ua()){let n=gn(t);pa(document,n),e={sheet:n,count:0}}else{let n=document.createElement("style");n.textContent=t,document.head.appendChild(n),e={el:n,count:0}}yn.set(t,e)}e.count++},rh=t=>{let e=yn.get(t);e&&--e.count<=0&&(e.sheet?Br(document,e.sheet):e.el?.remove(),yn.delete(t))},ah=(t,e,n,r={},a=mn,o={})=>{let i={...ps,...r},s=new Proxy(e,{has:(d,f)=>f!=="$__effect"&&f!=="$__import"&&f!=="$__state"&&(Reflect.has(d,f)||!(f in globalThis)&&!(f in i))}),l={},c=is($d(Object.keys(i)),Md(t),o)(s,n,a,l,...Object.values(i));return c.catch(d=>console.error("jq79: error in :setup script",d)),zi(c),{settled:c,sync:l.done===!0}},xo=(t,e)=>{e?.forEach(({name:n,default:r})=>{t[n]===void 0&&(t[n]=r===void 0?void 0:Q(r,t))})},Bn=t=>{let e=new Map;return n=>{if(e.has(n))return e.get(n);let r=t(n);return e.set(n,r),r}},ss=t=>(t?.forEach(e=>Object.freeze(e)),t&&Object.freeze(t),t),oh=Bn(Yc),Rr=Bn(t=>ss(ki(t))),ih=Bn(t=>{let e=Zr(t);return Object.freeze(e.vars),Object.freeze(e)}),sh=Bn(t=>ss(_d({attrs:{":setup":t}}))),_r=t=>{let e=t.attrs[":setup"],n=e===void 0?null:sh(e);return!n&&t.attrs[":setup"]!==void 0&&lh(t,t.attrs[":setup"]),n},Eo=new WeakSet,lh=(t,e)=>{e.trim()==="_"||Eo.has(t)||(Eo.add(t),console.warn(`jq79: :setup="${e}" is not a props pattern, so this component declares no signature and takes whatever a parent passes - write the props it takes ("{ a, b }"), a bare :setup for none, or "_" to stay open on purpose`))},ch=t=>{let e=null;return t.forEach(n=>{let r=Rr(n.content)??_r(n);if(!r)return;let a=e??(e=new Set);r.forEach(({name:o})=>a.add(o))}),e},Io=(t,e)=>{if(e===null)return t;let n={};return Object.keys(t).forEach(r=>{e.has(r)&&(n[r]=t[r])}),n},Co=new WeakMap,dh=(t,e,n,r)=>{if(r===null)return;let a=Co.get(t)??new Set;Co.set(t,a),n.forEach(o=>{r.has(o)||a.has(o)||(a.add(o),console.warn(`jq79: :${o} is not declared by <${e}> - add it to the :setup signature, or drop it`))})},fh=new Set([":value",":checked",":selected",":text",":html",":class"]),Oo=new WeakSet,hh=(t,e,n,r)=>{if(r===null||Oo.has(t))return;let a=n.filter(o=>r.has(o));a.length&&(Oo.add(t),a.forEach(o=>console.warn(`jq79: :${o} on <${e}> is a directive, not a prop - <${e}> never receives its "${o}". Rename the prop (${a.map(i=>`:${i}`).join(", ")} are reserved on a component tag), or use :model for a value that goes both ways`)))},uh=(t,e)=>{if(!t)return null;let n=Object.create(null),r=!1;return Object.entries(t).forEach(([a,o])=>{e.has(a)||(n[a]=o,r=!0)}),r?n:null},ls=Symbol("jq79.unfilledProps"),vn=Symbol("jq79.pendingScripts"),ph=t=>t&&t.default!==void 0?t.default:t,mh=(t,e,n,r={},a=mn,o={})=>{let i={...ps,...r},s={},l=is(Bd(Object.keys(i)),Rd(t),o)(s,ph,a,...Object.values(i)),c=u=>console.error("jq79: error in factory script",u),d=!1,f,h=()=>{if(d)return f;d=!0;let u=s.default;if(typeof u!="function")return;let g=S=>{S&&typeof S=="object"&&Object.assign(e,S)};try{let S=u(e,{$data:e,$props:e,$effect:n,...r});S instanceof Promise?f=S.then(g).catch(c):g(S)}catch(S){c(S)}return f},y=l.then(h,c);return zi(y),s.done&&h(),{settled:y,sync:s.done===!0&&f===void 0}},gh="__JQ79_HMR_ENABLED__",yh="__JQ79_HMR__",Ne=null,vh=t=>{if(!Ne||!t.filename)return;let e=Ne.get(t.filename);e||Ne.set(t.filename,e=new Set),e.add(new WeakRef(t))},tr=t=>{try{return new URL(t,document.baseURI).pathname}catch{return t}},wh=(t,e)=>{if(!Ne)return 0;let n=tr(t),r=$r(e);ce?.forEach((s,l)=>{tr(l)===n&&ce.set(l,Promise.resolve(e))});let a=!1,o=s=>s.name===void 0?r:r.siblings?.[s.name]??null,i=0;for(let[s,l]of Ne)if(tr(s)===n){for(let c of l){let d=c.deref();if(!d){l.delete(c);continue}let f=o(d);if(!f){a=!0;continue}d.hotReplace(f)&&i++}l.size||Ne.delete(s)}return a?0:i},bh=()=>{Ne??(Ne=new Map),globalThis[yh]={update:wh}},$o=3e3,kh=(t,e)=>{let n=setTimeout(()=>{console.warn(`jq79: ${t.name?`<${t.name}>`:"a component"}${t.filename?` (${t.filename})`:""} has been waiting ${$o/1e3}s for a :setup script and has rendered nothing. The template waits until every script returns or calls $mounted() - add an await $mounted() above the slow part to render first and fill in after.`)},$o);n?.unref?.(),Promise.all(e).then(()=>clearTimeout(n))},cs=t=>{if(ha.test(t))return t;let e=import.meta.resolve;if(typeof e!="function")return t;try{return e(t)}catch{return t}},ce=new Map,ds=t=>{try{return new URL(t,document.baseURI).href.replace(/#.*$/,"")}catch{return t}},Mo=t=>Promise.all([fetch(t).then(e=>{if(!e.ok)throw new Error(`failed to fetch component from ${t}: ${e.status}`);return e.text()}),Nr?.then(()=>Oh(t))]).then(([e])=>e),fs=t=>{if(!ce)return Mo(t);let e=ds(t),n=ce.get(e);if(!n){n=Mo(t),ce.set(e,n);let r=n;r.catch(()=>{ce?.get(e)===r&&ce.delete(e)})}return n},Pr=async t=>{let e=cs(t),n=await fs(e);return new J(n,{filename:e})},Bo=new WeakSet,Ro=new Set,Ah=t=>{if(Ro.has(t))return;Ro.add(t);let e=document.createElement("link");e.rel="modulepreload";let n=sa();n&&e.setAttribute("nonce",n),e.href=t,document.head.append(e)},Sh=/<script\b(?:"[^"]*"|'[^']*'|[^>"'])*>([\s\S]*?)<\/script\s*>/gi,wn=new Set,hs=(t,e,n)=>{for(let{spec:r,kind:a}of ld(t)){if(a==="component"&&n&&r in n)continue;let o=cs(a==="fetch"?r:Mr(r,a==="component"?e:void 0));a==="fetch"||os.test(o)?ce&&fs(o).then(i=>xh(i,o),()=>{}):ha.test(o)&&Ah(o)}},xh=(t,e)=>{let n=ds(e);if(!wn.has(n)){wn.add(n);for(let[,r]of t.matchAll(Sh))hs(r,e,void 0)}},Eh=(t,e,n)=>{for(let r of t)Bo.has(r)||(Bo.add(r),hs(r.content,e,n))},Nr,Ih="/jq79-sw.js",Ch=async t=>{let e=typeof navigator>"u"?void 0:navigator.serviceWorker;if(!e)throw new Error("jq79: safeEval() compiles components in a service worker, and this page can't have one - service workers need https (or localhost). Precompile with the jq79/vite plugin instead, or use safeEval({ nonce: true }) on a page whose server issues a nonce.");let n;try{n=await e.register(t)}catch(r){throw new Error(`jq79: safeEval() couldn't register its service worker at ${t} (${r.message}). Serve jq79-sw.js from the jq79 package at your site's root, or pass its URL: safeEval({ worker: "/path/jq79-sw.js" }).`)}await e.ready,!e.controller&&await new Promise(r=>{e.addEventListener("controllerchange",()=>r(),{once:!0}),e.controller?r():n.active?.postMessage("jq79:claim")})},Oh=t=>{let e=new URL(t,document.baseURI);return e.hash="",e.searchParams.set(zd,""),new Promise((n,r)=>{let a=document.createElement("script"),o=sa();o&&a.setAttribute("nonce",o),a.src=e.href,a.onload=()=>{a.remove(),n()},a.onerror=()=>{a.remove(),r(new Error(`jq79: the precompiled functions of ${t} did not load, and safeEval() can't render it without them`))},document.head.append(a)})},us=class De{constructor(e,n={}){j(this,"template"),j(this,"scripts"),j(this,"styles"),j(this,"modules"),j(this,"filename"),j(this,"siblings"),j(this,"name"),j(this,"slots"),j(this,"modelWriteback"),j(this,"data",null),j(this,"fx",null),j(this,"content",null),j(this,"startMarker",null),j(this,"endMarker",null),j(this,"styleEls",[]),j(this,"shadowCss",null),j(this,"shadowSheets",[]),j(this,"sheetRoot",null),j(this,"ownsSharedStyles",!1),j(this,"useShadow",!1),j(this,"mountRoot",null),j(this,"resolveMounted",null),j(this,"renderDone",!1),j(this,"held",0),j(this,"onPaint",null),j(this,"destroyHooks",null),j(this,"attachHooks",null),j(this,"detachHooks",null),j(this,"onPage",!1),j(this,"emitListeners",new Map);let r=typeof e=="string"?$r(e):e;this.template=r.template,this.scripts=r.scripts,this.styles=r.styles,this.modules=n.modules??(typeof e=="string"?void 0:e.modules),this.filename=n.filename??(typeof e=="string"?void 0:e.filename),this.siblings=r.siblings,this.name=r.name,this.adoptSiblings(),vh(this)}adoptSiblings(){this.siblings&&Object.entries(this.siblings).forEach(([e,n])=>{n.filename??(n.filename=this.filename),n.modules??(n.modules=this.modules),this.name||(this[e]=n)})}hotReplace(e){let n=typeof e=="string"?$r(e):e;la.clear(),He.clear(),Or.clear();let r=this.startMarker,a=!!(r&&this.content),o=a&&r.isConnected,i=o?r.parentNode:null,s=o?this.endMarker.nextSibling:null,l={...this.data},c=this.useShadow;return a&&this.destroy(),this.template=n.template,this.scripts=n.scripts,this.styles=n.styles,this.siblings=n.siblings,this.adoptSiblings(),!a||(this.renderWith(l,c),!i)?!1:(c&&this.placeShadowStyles(i,s),i.insertBefore(this.content,s),this.mountRoot=i,this.settleMounted(),!0)}static debug(e){if(e){let n=Se.scopedNames;for(let r in e){let a=e[r];Object.prototype.hasOwnProperty.call(Se,r)?typeof a=="boolean"?Se[r]=a:console.warn(`jq79: Component79.debug ignored "${r}" - the flags are booleans, and the ones it knows are: ${Object.keys(Se).join(", ")}`):console.warn(`jq79: Component79.debug does not know "${r}" - the flags it has are: ${Object.keys(Se).join(", ")}`)}Se.scopedNames!==n&&hn.clear()}return{...Se}}static safeEval(e={}){oa=!0;let n=[];if(e.nonce){let a=sa();a===void 0?n.push(Promise.reject(new Error("jq79: safeEval({ nonce: true }) found no nonce on this page - no <script> carries one. The nonce belongs on the script that loads the page, the one the CSP names."))):Ir=a}let r=e.worker??(e.nonce?!1:Ih);return r!==!1&&n.push(Nr??(Nr=Ch(r))),Promise.all(n).then(()=>{})}static cache(e){return e===!1?(ce=null,wn.clear()):e===!0&&(ce??(ce=new Map)),!!ce}static clearCache(){ce?.clear(),wn.clear()}static fetch(e){if(Array.isArray(e))throw new TypeError("Component79.fetch takes one URL; use fetchAll for an array");return new $h(Pr(e))}static fetchAll(e){return Promise.all(e.map(Pr))}static importAll(e){if(!Array.isArray(e))throw new TypeError("Component79.importAll takes an array; use import() for one");return Promise.all(e.map(n=>mn(Mr(n,void 0))))}on(e,n){return this.emitListeners.has(e)||this.emitListeners.set(e,new Set),this.emitListeners.get(e).add(n),this}off(e,n){return this.emitListeners.get(e)?.delete(n),this}render(e={}){return this.renderWith(e,!1)}renderShadow(e={}){return this.renderWith(e,!0)}renderWith(e,n){this.destroy();let r=Pd(this.scripts,_r,Rr),a=uh(this.siblings,r),o=a?Object.assign(Object.create(a),e):{...e},i=new Set([...r].filter($=>!($ in e)));i.size&&Object.defineProperty(o,ls,{value:i}),this.slots&&Object.defineProperty(o,qi,{value:this.slots}),Object.defineProperty(o,vn,{value:{count:0,owner:this}});let s=Ke(o),l=Pt(s);this.data=s,this.fx=l,this.useShadow=n,this.startMarker=document.createComment("jq79"),this.endMarker=document.createComment("/jq79");let c=this.startMarker,d=!1,f=($,N)=>{$==="model:update"&&!d&&(d=!0,console.warn("jq79: $emit('model:update', …) no longer feeds :model - call $updateModel(value) or $updateModel(name, value) instead"));let T=new CustomEvent($,{detail:N,bubbles:!0,composed:!0,cancelable:!0});return c===this.startMarker&&this.emitListeners.get($)?.forEach(W=>W(T,N)),T.cancelBubble||c.dispatchEvent(T),!T.defaultPrevented},h,y=new Promise($=>{h=$});this.resolveMounted=h,this.renderDone=!1,this.held=0;let u=$=>{if(typeof $!="function")throw new TypeError("jq79: $destroyed expects a function");return c!==this.startMarker?(et($,"$destroyed"),()=>{}):nr(this.destroyHooks??(this.destroyHooks=[]),$)},g=($,{immediate:N=!0}={})=>{if(typeof $!="function")throw new TypeError("jq79: $attached expects a function");if(c!==this.startMarker)return()=>{};this.watchPage();let T=nr(this.attachHooks??(this.attachHooks=[]),$);return N&&this.onPage&&et($,"$attached"),T},S=$=>{if(typeof $!="function")throw new TypeError("jq79: $detached expects a function");return c!==this.startMarker?(et($,"$detached"),()=>{}):(this.watchPage(),nr(this.detachHooks??(this.detachHooks=[]),$))},v=$=>{let N=jc($);return u(()=>N.$dispose()),N},p=this.endMarker,w=$=>{let N=[];for(let T=c.nextSibling;T&&T!==p;T=T.nextSibling)T instanceof Element&&(T.matches($)&&N.push(T),N.push(...Array.from(T.querySelectorAll($))));return N},A=$=>w($)[0]??null,P=this.modules,C=$=>P&&$ in P?Promise.resolve(P[$]):mn(Mr($,this.filename)),B=$=>{if(!Array.isArray($))throw new TypeError("$importAll takes an array; use import() for one");return Promise.all($.map(C))},b=Object.assign(Object.create(null),{$emit:f,$updateModel:(...$)=>{let[N,T]=$.length>1?$:[void 0,$[0]];return c!==this.startMarker?!1:this.modelWriteback?.(N,T)??!1},$slots:Object.fromEntries(Object.keys(this.slots??{}).map($=>[$,!0]))}),O=[],R=!0;Eh(this.scripts,this.filename,this.modules),this.scripts.forEach(($,N)=>{let T;O.push(new Promise(E=>{T=E}));let W=!1,G=()=>{W=!0,T()},te={$mounted:()=>(G(),y),$destroyed:u,$attached:g,$detached:S,$computed:v,$self:A,$$self:w,...b,$importAll:B,...a},Y={filename:this.filename,index:N},fe=":mounted"in $.attrs,k=oh($.content),m=(()=>{if(k!==null){fe&&console.warn("jq79: :mounted on a factory script renders the template before the factory has returned, so none of its bindings exist yet - await $mounted() inside the factory instead."),xo(s,Rr($.content));let I=fe?io(k):k;return mh(I,s,M=>l.effect(M),te,C,Y)}let{vars:E,code:x}=ih($.content);xo(s,_r($)),E.forEach(I=>{I in s||(s[I]=void 0)});let _=fe?io(x):x;return ah(_,s,I=>l.effect(I),te,C,Y)})();if(m.sync)m.settled.then(G,G);else{let E=o[vn];E.count++;let x=()=>{E.count--,G()};m.settled.then(x,x)}!m.sync&&!W&&(R=!1)});let U=document.createDocumentFragment(),H=new Proxy(s,{has:($,N)=>typeof N=="string"&&N in b||Reflect.has($,N),get:($,N,T)=>typeof N=="string"&&N in b&&!Reflect.has($,N)?b[N]:Reflect.get($,N,T)});if(U.append(this.startMarker,this.endMarker),this.content=U,R?(this.endMarker.parentNode.insertBefore(it(this.template,H,l,n),this.endMarker),this.renderDone=!0,this.settleMounted()):(Promise.all(O).then(()=>{c===this.startMarker&&(this.endMarker.parentNode.insertBefore(it(this.template,H,l,n),this.endMarker),this.renderDone=!0,this.settleMounted(),De.settleAttached())}),kh(this,O)),n)if(ua())this.shadowCss=[...this.styles.map($=>$.content),vt];else{let $=document.createElement("style");$.textContent=vt,this.styleEls=[...this.styles.map(N=>{let T=document.createElement("style");return T.textContent=N.content,T}),$]}else this.styles.forEach($=>nh(So($))),this.ownsSharedStyles=!0;return this}mount(e,n){let r=typeof e=="string"?br(e):e;if(!r)throw new Error(`mount target not found: ${e}`);return(!this.content||n!==void 0)&&this.renderWith(n??{},this.useShadow),this.attach(r)}mountShadow(e,n){let r=typeof e=="string"?br(e):e;if(!r)throw new Error(`mount target not found: ${e}`);return(!this.content||n!==void 0||!this.useShadow)&&this.renderWith(n??{},!0),this.attach(r)}attach(e){this.mountRoot&&this.detach();let n=this.useShadow&&e instanceof Element?e.shadowRoot??e.attachShadow({mode:"open"}):e;return this.useShadow&&this.placeShadowStyles(n,null),n.appendChild(this.content),this.mountRoot=n,this.settleMounted(),De.settleAttached(),this}isOnPage(){return this.renderDone&&this.startMarker?.isConnected===!0}watchPage(){Ce.has(this)||(Ce.add(this),this.onPage=this.isOnPage(),this.onPage||De.queueSettle())}static queueSettle(){rr||(rr=!0,queueMicrotask(()=>{rr=!1,De.settleAttached()}))}static settleAttached(){if(Ce.size===0)return;let e=[...Ce].filter(n=>!n.onPage&&n.isOnPage());De.inDocumentOrder(e).forEach(n=>{n.onPage||!Ce.has(n)||(n.onPage=!0,n.attachHooks?.slice().forEach(r=>et(r,"$attached")))})}notifyDetached(){if(Ce.size===0)return;let e=[];if(this.startMarker?.isConnected){let n=new Set;for(let a=this.startMarker;a&&(n.add(a),a!==this.endMarker);a=a.nextSibling);let r=a=>{for(;a;a=a.parentNode)if(n.has(a))return!0;return!1};e=De.inDocumentOrder([...Ce].filter(a=>a.onPage&&r(a.startMarker)))}else this.onPage&&(e=[this]);e.forEach(n=>{n.onPage&&(n.onPage=!1,n.detachHooks?.slice().forEach(r=>et(r,"$detached")))})}static inDocumentOrder(e){return e.sort((n,r)=>n.startMarker.compareDocumentPosition(r.startMarker)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1)}placeShadowStyles(e,n){if(this.shadowCss&&typeof ShadowRoot<"u"&&e instanceof ShadowRoot){this.sheetRoot&&this.sheetRoot!==e&&this.shadowSheets.forEach(r=>Br(this.sheetRoot,r)),this.shadowSheets.length===0&&(this.shadowSheets=this.shadowCss.map(r=>r===vt?wt??(wt=gn(r)):gn(r))),this.shadowSheets.forEach(r=>pa(e,r)),this.sheetRoot=e;return}this.shadowCss&&this.styleEls.length===0&&(this.styleEls=this.shadowCss.map(r=>{let a=document.createElement("style");return a.textContent=r,a})),this.styleEls.forEach(r=>e.insertBefore(r,n))}settleMounted(){if(!this.renderDone||this.held>0)return;let e=this.onPaint;this.onPaint=null,e?.(),this.mountRoot&&this.resolveMounted?.()}holdOwner(e){this.renderDone&&this.held===0||(e.held++,this.onPaint=()=>{e.held--,e.settleMounted()})}detach(){if(!this.mountRoot||!this.content||!this.startMarker||!this.endMarker)return this;this.notifyDetached();let e=this.startMarker;for(;e;){let n=e.nextSibling;if(this.content.appendChild(e),e===this.endMarker)break;e=n}return this.mountRoot=null,this}destroy(){this.notifyDetached(),Ce.delete(this),this.attachHooks=null,this.detachHooks=null,this.onPage=!1;let e=this.destroyHooks;this.destroyHooks=null,e?.forEach(r=>et(r,"$destroyed")),this.resolveMounted=null;let n=this.onPaint;return this.onPaint=null,n?.(),this.detach(),this.fx?.dispose(),this.fx=null,this.data?.$dispose(),this.styleEls.forEach(r=>r.parentNode?.removeChild(r)),this.styleEls=[],this.sheetRoot&&this.shadowSheets.forEach(r=>{r!==wt&&Br(this.sheetRoot,r)}),this.shadowCss=null,this.shadowSheets=[],this.sheetRoot=null,this.ownsSharedStyles&&(this.styles.forEach(r=>rh(So(r))),this.ownsSharedStyles=!1),this.content=null,this.startMarker=null,this.endMarker=null,this.renderDone=!1,this.data=null,this.resolveMounted=null,this}};j(us,"version",Td);var J=us,$h=class{constructor(t){j(this,"chain"),this.chain=t}queue(t){return this.chain=this.chain.then(e=>(t(e),e)),this}then(t,e){return this.chain.then(t,e)}catch(t){return this.chain.catch(t)}finally(t){return this.chain.finally(t)}mount(t,e){return this.queue(n=>n.mount(t,e))}mountShadow(t,e){return this.queue(n=>n.mountShadow(t,e))}render(t={}){return this.queue(e=>e.render(t))}renderShadow(t={}){return this.queue(e=>e.renderShadow(t))}on(t,e){return this.queue(n=>n.on(t,e))}off(t,e){return this.queue(n=>n.off(t,e))}detach(){return this.queue(t=>t.detach())}destroy(){return this.queue(t=>t.destroy())}},et=(t,e)=>{try{t()}catch(n){console.error(`jq79: error in a ${e} hook`,n)}},nr=(t,e)=>(t.push(e),()=>{let n=t.indexOf(e);n!==-1&&t.splice(n,1)}),Ce=new Set,rr=!1,ps={$:br,$$:Ac,$create:Sc,$reactive:Ke,$toRaw:ae,$batch:yi,Component79:J,C79:J};typeof globalThis<"u"&&globalThis[gh]&&bh();const Mh=`<!--
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
`,Bh={},Rh="components/BrandLogo.html";let ms;ms=new J(Mh,{modules:Bh,filename:Rh});const gs=ms,_h=`<!--
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
`,Ph={},Nh="components/Icon.html";let Nt;Nt=new J(_h,{modules:Ph,filename:Nh});const ie=Nt;Nt.Pad;Nt.Parcel;Nt.Sheet;const zh=`<!--
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
`,Lh={"./Icon.html":ie},Th="components/Tabs.html";let ys;ys=new J(zh,{modules:Lh,filename:Th});const Dh=ys,zr="*";function lt(t){return t==="EU"||t==="US"||t==="JP"}const Ct=["EU","US","JP"],_o=["PAL","NTSC"],vs=new Map([["Europe",{region:"EU",video:"PAL"}],["Austria",{region:"EU",video:"PAL"}],["Belgium",{region:"EU",video:"PAL"}],["Bulgaria",{region:"EU",video:"PAL"}],["Croatia",{region:"EU",video:"PAL"}],["Czech",{region:"EU",video:"PAL"}],["Denmark",{region:"EU",video:"PAL"}],["Estonia",{region:"EU",video:"PAL"}],["Finland",{region:"EU",video:"PAL"}],["France",{region:"EU",video:"PAL"}],["Germany",{region:"EU",video:"PAL"}],["Greece",{region:"EU",video:"PAL"}],["Hungary",{region:"EU",video:"PAL"}],["Ireland",{region:"EU",video:"PAL"}],["Italy",{region:"EU",video:"PAL"}],["Latvia",{region:"EU",video:"PAL"}],["Lithuania",{region:"EU",video:"PAL"}],["Netherlands",{region:"EU",video:"PAL"}],["Norway",{region:"EU",video:"PAL"}],["Poland",{region:"EU",video:"PAL"}],["Portugal",{region:"EU",video:"PAL"}],["Romania",{region:"EU",video:"PAL"}],["Russia",{region:"EU",video:"PAL"}],["Scandinavia",{region:"EU",video:"PAL"}],["Serbia",{region:"EU",video:"PAL"}],["Slovakia",{region:"EU",video:"PAL"}],["Slovenia",{region:"EU",video:"PAL"}],["Spain",{region:"EU",video:"PAL"}],["Sweden",{region:"EU",video:"PAL"}],["Switzerland",{region:"EU",video:"PAL"}],["Turkey",{region:"EU",video:"PAL"}],["UK",{region:"EU",video:"PAL"}],["Ukraine",{region:"EU",video:"PAL"}],["United Kingdom",{region:"EU",video:"PAL"}],["Australia",{region:"EU",video:"PAL"}],["New Zealand",{region:"EU",video:"PAL"}],["India",{region:"EU",video:"PAL"}],["Israel",{region:"EU",video:"PAL"}],["South Africa",{region:"EU",video:"PAL"}],["USA",{region:"US",video:"NTSC"}],["Canada",{region:"US",video:"NTSC"}],["Mexico",{region:"US",video:"NTSC"}],["Chile",{region:"US",video:"NTSC"}],["Peru",{region:"US",video:"NTSC"}],["Latin America",{region:"US",video:"NTSC"}],["Brazil",{region:"US",video:"NTSC"}],["Argentina",{region:"US",video:"PAL"}],["Japan",{region:"JP",video:"NTSC"}],["Asia",{region:"JP",video:"NTSC"}],["China",{region:"JP",video:"NTSC"}],["Hong Kong",{region:"JP",video:"NTSC"}],["Korea",{region:"JP",video:"NTSC"}],["Singapore",{region:"JP",video:"NTSC"}],["Taiwan",{region:"JP",video:"NTSC"}],["Thailand",{region:"JP",video:"NTSC"}]]),ws="World";function bs(t){const e=new Set;for(const n of t){if(n===ws){for(const a of Ct)e.add(a);continue}const r=vs.get(n);r&&e.add(r.region)}return Ct.filter(n=>e.has(n))}function ks(t){const e=new Set;for(const n of t){if(n===ws){for(const a of _o)e.add(a);continue}const r=vs.get(n);r&&e.add(r.video)}return _o.filter(n=>e.has(n))}const ma=[["EU","US","JP"],["US","EU","JP"],["EU","JP","US"],["US","JP","EU"],["JP","EU","US"],["JP","US","EU"]],Ot=ma[0];function Fh(t,e){return[e,...t.filter(n=>n!==e)]}function As(t){return t.join("/")}function ga(t){const e=typeof t=="string"?t.split("/"):t;return Array.isArray(e)?ma.find(r=>r.length===e.length&&r.every((a,o)=>a===e[o]))??Ot:Ot}const Ss=Object.freeze(Object.defineProperty({__proto__:null,ANY_REGION:zr,DEFAULT_REGION_ORDER:Ot,REGIONS:Ct,REGION_ORDERS:ma,isRegion:lt,parseRegionOrder:ga,preferRegion:Fh,regionOrderKey:As,regionsOf:bs,videoStandardsOf:ks},Symbol.toStringTag,{value:"Module"})),V=".meta",mt=".roms",jh=50*1024*1024,ya=1;function xs(t){const e=t.indexOf("/");return e===-1?"":t.slice(0,e)}function va(t){return t.slice(t.lastIndexOf("/")+1)}function Uh(t){const e=va(t),n=e.lastIndexOf(".");return n<=0?"":e.slice(n+1).toLowerCase()}function wa(t){const e=va(t),n=e.lastIndexOf(".");return n<=0?e:e.slice(0,n)}function Rn(t,e=V){const n=xs(t);return n?`${e}/${n}`:e}function rt(t,e=V){return`${Rn(t,e)}/${wa(t)}.json`}function Lr(t,e,n=V){return`${Rn(t,n)}/${e}`}function Tr(t){return t.startsWith("https://")}function Es(t){if(!(typeof t!="string"||t.length===0)){if(Tr(t))return t;if(!(t.includes("/")||t.includes("\\")||t.includes("..")))return t}}function Ae(t){return typeof t=="string"&&t.length>0?t:void 0}function qh(t){if(typeof t!="object"||t===null)return null;const e=t,n=new Date().toISOString();return{version:typeof e.version=="number"?e.version:ya,title:Ae(e.title),description:Ae(e.description),releaseDate:Ae(e.releaseDate),publisher:Ae(e.publisher),region:Ae(e.region),videoStandard:Ae(e.videoStandard),cover:Es(e.cover),crc32:Ae(e.crc32),addedAt:Ae(e.addedAt)||n,updatedAt:Ae(e.updatedAt)||n}}function Is(){const t=new Date().toISOString();return{version:ya,addedAt:t,updatedAt:t}}class ba{constructor(e){this.node=e}async read(e){for(const n of[V,mt]){let r;try{r=await this.node.readFile(rt(e,n))}catch{continue}try{return qh(JSON.parse(new TextDecoder().decode(r)))}catch{return null}}return null}async readMany(e){const n=await Promise.all(e.map(async r=>[r,await this.read(r)]));return new Map(n)}async write(e,n){const r={...n,version:ya,updatedAt:new Date().toISOString()},a=new TextEncoder().encode(`${JSON.stringify(r,null,2)}
`);await this.node.writeFile(rt(e),a)}async remove(e){for(const n of[V,mt])try{await this.node.remove(rt(e,n))}catch{}}async initializedGames(e){const n=new Set;for(const r of[V,mt]){const a=e?`${r}/${e}`:r;try{for(const o of await this.node.list(a))o.kind==="file"&&o.name.endsWith(".json")&&n.add(o.name.slice(0,-5))}catch{}}return n}async saveCover(e,n){if(!Tr(n))throw new Error("Only https covers can be downloaded");const r=await fetch(n);if(!r.ok)throw new Error(`Cover download failed (${r.status})`);const a=await r.blob(),o=Gh(n,a.type),i=`${wa(e)}.case.${o}`;return await this.node.writeFile(Lr(e,i),new Uint8Array(await a.arrayBuffer())),i}async coverUrl(e,n){const r=Es(n);if(r){if(Tr(r))return r;for(const a of[V,mt])try{const o=await this.node.readFile(Lr(e,r,a));return URL.createObjectURL(new Blob([o]))}catch{}}}}function Gh(t,e){const n={"image/png":"png","image/jpeg":"jpg","image/webp":"webp","image/gif":"gif"};if(n[e])return n[e];const r=t.split("?")[0].split(".").pop()?.toLowerCase()||"";return/^(png|jpg|jpeg|webp|gif)$/.test(r)?r:"png"}const ka=Object.freeze(Object.defineProperty({__proto__:null,CRC32_SIZE_LIMIT:jh,LEGACY_META_DIR:mt,META_DIR:V,RomLibrary:ba,coverPathOf:Lr,emptyRecord:Is,extensionOf:Uh,fileNameOf:va,gameNameOf:wa,recordDirOf:Rn,recordPathOf:rt,systemOf:xs},Symbol.toStringTag,{value:"Module"})),Cs=1,Dr=`${V}/wizard.json`;function We(){return{folders:{},regionOrder:Ot}}function Qh(t,e,n){const r=e.folders[t];return typeof r=="boolean"?r:n.has(t)}function Hh(t){return t.length>0&&!t.startsWith("/")&&!t.includes("\\")&&!t.split("/").includes("..")}function Wh(t){if(!t||typeof t!="object")return We();const e=t;if(e.version!==Cs||!e.folders||typeof e.folders!="object")return We();const n={};for(const[r,a]of Object.entries(e.folders))typeof a=="boolean"&&Hh(r)&&(n[r]=a);return{folders:n,regionOrder:ga(e.regionOrder)}}class Vh{static async read(e){try{const n=await e.readFile(Dr);return Wh(JSON.parse(new TextDecoder().decode(n)))}catch{return We()}}static async write(e,n){const r={version:Cs,folders:n.folders,regionOrder:As(n.regionOrder)};await e.createDirectory(V),await e.writeFile(Dr,new TextEncoder().encode(`${JSON.stringify(r,null,2)}
`))}static async setWizard(e,n,r,a){const o=await this.read(e),i={...o.folders};r===a.has(n)?delete i[n]:i[n]=r;const s={...o,folders:i};return await this.write(e,s),s}static async setRegionOrder(e,n){const a={...await this.read(e),regionOrder:ga(n)};return await this.write(e,a),a}}const Jh=Object.freeze(Object.defineProperty({__proto__:null,WIZARD_CONFIG_PATH:Dr,WizardConfigService:Vh,emptySettings:We,isWizardFolder:Qh},Symbol.toStringTag,{value:"Module"})),q=Ke({origins:[],activeOriginId:void 0,loading:!1,error:void 0,wizardSettings:We(),knownSystems:[]}),Po="rom-manager:active-origin-id";function ar(t){try{t?localStorage.setItem(Po,t):localStorage.removeItem(Po)}catch{}}class je{static instance;constructor(){}static getInstance(){return je.instance||(je.instance=new je),je.instance}addOrigin(e){const n=q.origins.findIndex(r=>r.id===e.id);q.origins=n===-1?[...q.origins,e]:q.origins.map((r,a)=>a===n?e:r),q.activeOriginId||(q.activeOriginId=e.id,ar(e.id))}getOrigin(e){return q.origins.find(n=>n.id===e)}getOrigins(){return[...q.origins]}removeOrigin(e){if(q.origins=q.origins.filter(n=>n.id!==e),q.activeOriginId===e){const n=q.origins[0]?.id;q.activeOriginId=n,ar(n)}}setActiveOrigin(e){this.getOrigin(e)&&(q.activeOriginId=e,ar(e))}getActiveOrigin(){const e=q.activeOriginId;return e?this.getOrigin(e):void 0}setSelection(e){const n=q.activeOriginId;n&&(q.origins=q.origins.map(r=>r.id===n?{...r,selection:e}:r))}getSelection(){return this.getActiveOrigin()?.selection||[]}setLoading(e){q.loading=e}isLoading(){return q.loading}setError(e){q.error=e}getError(){return q.error}setWizardSettings(e){q.wizardSettings=e}getWizardSettings(){return ae(q).wizardSettings}setKnownSystems(e){q.knownSystems=Array.from(e)}getKnownSystems(){return new Set(ae(q).knownSystems)}clear(){q.origins=[],q.activeOriginId=void 0,q.loading=!1,q.error=void 0,q.wizardSettings=We()}}const Xh=je.getInstance(),Kh=Object.freeze(Object.defineProperty({__proto__:null,StoreService:je,appState:q,storeService:Xh},Symbol.toStringTag,{value:"Module"}));var Z={app:{name:"ROM Manager",initializing:"Starting…"},header:{regions:{label:"Region priority",preferred:"The {region} cover art is preferred",prefer:"Prefer the {region} cover art"},preferences:"Preferences"},tabs:{reconnect:"Click to grant access again",close:"Close",add:"Open a folder"},welcome:{tagline:"Your retro collection, read where it lives",pitch:"ROM Manager opens a folder of ROMs and makes a library of it: every file identified by its checksum, every Game shown as one entry with its Variants, and its Cover Art alongside. It runs entirely in the browser, against your own disk.",open:"Open folder",opening:"Opening…",hint:"Nothing is uploaded. Nothing is moved without showing you first.",library:"Open my library",openFolder:"Open a folder",libraryHint:"Your library lives in this browser. Nothing is uploaded; on a desktop you can sync it with a folder.",what:{title:"What it does",hash:{title:"Identified by checksum",body:"Every file is matched against the No-Intro and Redump DATs by its CRC32. A file name is what somebody typed; a checksum is what the file is."},grouping:{title:"One entry per Game",body:"Regions, revisions and languages of the same title fold into a single Game, and its Variants are read in the details pane — which of them you have, which files are missing, and where each one ships."},covers:{title:"Cover Art per region",body:"Boxes for EU, US and JP, taken from libretro-thumbnails and kept in the library as you browse, so they stay there with the network off. A preference order decides which one is shown."},consolidate:{title:"Moves you approve first",body:"Consolidating a System is worked out as a Plan and shown to you whole. Nothing is renamed or moved until you say so, and it can be undone right afterwards."}},how:{title:"How it goes",step1:{title:"Open your collection",body:"Pick the folder your Systems live in — the MiSTer `games` folder, or anything laid out like it."},step2:{title:"Browse it by Game",body:"A System folder can be read flat, as it is on disk, or grouped, with the recognised files folded into the Game they are releases of."},step3:{title:"Tidy it up and fill it in",body:"Consolidate the folder when the Plan convinces you, drop covers or ROMs straight onto the pane, and edit what the catalogue does not know."}},systems:{title:"Systems it knows",hint:"{count} Systems, each one identified by the folder name MiSTer gives it."},privacy:{title:"It never leaves your machine",body:"Folders are read through the File System Access API, which asks your permission for one folder and grants it to this tab alone. There is no backend and no upload. Real support only exists in Chromium browsers."},footer:{legal:"ROM Manager is free and open-source software. All system names, trademarks, and cover art belong to their respective owners.",github:"Code on GitHub"}},library:{locked:{title:"Folder remembered: {name}",open:"Open «{name}»"},opening:"Opening…",name:"Library",add:"Add ROMs",sync:{action:"Sync with the library",title:"Sync “{folder}” with the library",message:"The folder's games are copied to the library and the library's to the folder, until both are the same. A file changed in both places is kept in both versions. The library will take as much room in this browser as the folder.",confirm:"Sync",running:"Syncing with the library…",done:"Synced: {toLibrary} to the library, {toFolder} to the folder, {conflicts} kept in two versions.",same:"The folder and the library were already the same."}},tree:{title:"Files",newFolder:"New folder inside the selected one",addFiles:"Add files to the selected folder",delete:"Delete what is selected",expand:"Expand",collapse:"Collapse",initialized:"Has library metadata",groupOn:"Browse this folder as it is on disk",groupOff:"Group this folder by Game",consolidate:"Rename and sort this folder to match the catalogue",empty:"Empty folder",reading:"Reading games…",status:{complete:"Every file is here",partial:"Some files are missing",missing:"Not in this folder"},prompt:{folderName:"Name of the new folder"},confirm:{delete:"Delete {count} item(s)? This cannot be undone."},error:{separator:"A folder name cannot contain path separators",read:"The folder could not be read",operation:"The operation failed",drag:"What was dragged could not be read"}},details:{empty:"Pick a ROM to read its details",back:"Back to the Game",cover:{none:"No cover",region:"{region} box",game:"Box of the Game",alt:"{title} cover art"},facts:{system:"System",format:"Format",size:"Size",modified:"Modified",added:"Added to the library",file:"File",publisher:"Publisher",crc32:"CRC32",updated:"Updated",notInitialized:"Not in the library",noExtension:"no extension"},file:{pending:"Not in the library yet",add:"Add metadata"},edit:"Edit",delete:"Delete",checksum:{calculate:"Calculate",calculating:"Calculating…",skipped:"Skipped — over {limit}",failed:"The checksum could not be calculated"},variants:{title:"Variants",files:"{count} files",missingFile:"missing",more:"{count} more the catalogue knows of",shipsTo:"Ships to {region}",runsAt:"Runs at {standard}",consolidate:"Rename and sort to match the catalogue",deleteVariant:"Delete variant",deleteFile:"Delete file",deleteTitle:"Delete variant",deleteMessage:'Are you sure you want to delete the "{variant}" variant ({count} file(s))? This action cannot be undone.',deleteFileTitle:"Delete file",deleteFileMessage:'Are you sure you want to delete the file "{name}"? This action cannot be undone.'},status:{complete:"Complete",partial:"Incomplete",missing:"Not in this folder"},selection:{title:"{count} ROMs selected",ready:"All of them are in the library",pending:"{count} of them are not in the library yet",edit:"Edit {count}",gate:"Every selected ROM has to be in the library before editing in batch",hint:"Edit the fields every selected Game shares"},batch:{title:"Editing {count} Games",subtitle:"Only the fields every Game shares can be changed",keep:"Keep as it is ({value})",mixed:"mixed",apply:"Apply to {count} Games",saving:"Saving…",error:"The records could not be saved"}},editor:{lookup:{idle:"Look up in the dataset",crc32:"Checking CRC32…",md5:"Calculating MD5…",sha1:"Calculating SHA1…",hint:"Look the Game up in the dataset (CRC32 → MD5 → SHA1)",tooLarge:"The file is too large to checksum",title:"Found in the dataset",match:"Match:",select:"Fields to update:",current:"Now:",incoming:"New:",empty:"(empty)",apply:"Apply the ones ticked",notFound:"No dataset has this file",failed:"The lookup failed"},fields:{cover:"Cover Art",title:"Title",description:"Description",releaseDate:"Release date",publisher:"Publisher",region:"Region",videoStandard:"Video standard",crc32:"CRC32"},select:"Choose…",changeCover:"Change cover",removeCover:"Remove cover",dropCoverOrClick:"Drag an image here or click to select",notCalculated:"Not calculated",tooLarge:"File too large",calculate:"Calculate",save:"Save",saving:"Saving…",cancel:"Cancel",error:{save:"The record could not be saved",checksum:"The checksum could not be calculated"}},drop:{label:"Add files",toGame:"Add to {title}",toFolder:"Add to {folder}",root:"the root",images:{one:"Image",many:"Images",hint:"They are kept in the metadata of the Game and take the place of the published cover for that region."},files:{one:"File",many:"Files"},asIs:"As it is",asGame:"As {title}",alongGame:"Goes with the Game",already:"{title} is already in {folder}",andMore:"{path} · and {count} more",hint:{plain:"They are copied as they are into {folder}.",intake:"As they are, they go into {folder}. As a Game, each one goes where the catalogue puts it, creating the folder if it is not there, and whatever comes out of an archive is unpacked and checked against what the archive claimed."},cancel:"Cancel",confirm:"Add",confirmMany:"Add {count}"},intake:{label:"Add Games to the library",toSystem:"Add to {system}",toLibrary:"Add to the library",games:{one:"Game",many:"Games ({count})",hint:"The folder is created if it is not there. Whatever comes out of an archive is unpacked and checked against what the archive claimed."},taken:"Already in {path}",from:"from {archive}",companions:{one:"File that goes with it",many:"Files that go with it",already:"{name} (already there)",hint:"No catalogue claims them, so they are copied next to the Game."},strays:{title:"Not recognised",hint:"No catalogue claims them, so they are not copied: pick a folder in the tree to put them there as they are."},refused:{title:"Cannot be opened",zip64:"the archive uses Zip64, which this version cannot read",encrypted:"it is encrypted",method:"it uses a compression this version cannot read",damaged:"its index could not be read"},cancel:"Cancel",confirm:"Add",confirmMany:"Add {count}"},organize:{title:"Consolidate {system}",done:"{system} consolidated",moving:"to move",settled:"already in place",markers:"Games marked",conflicts:"left alone",untouched:"Left alone",reason:{duplicateTarget:"another file claims the same name",targetTaken:"the destination name is already taken",swap:"several files claim each other's place"},moved:"Moved",willMove:"To be moved",more:"and {count} more",settledAll:"Everything is where the catalogue says it should be.",undo:"Undo",close:"Done",cancel:"Cancel",confirm:"Move {count} files",busy:{reading:"Reading {system}…",readingProgress:"Reading {system}: {done} of {total}",moving:"Moving files…",movingProgress:"Moving files: {done} of {total}",undoing:"Putting the files back…"}},system:{folder:"Folder",collection:"Folder / Collection",path:"Path",about:"About this System",extensions:"Usual file extensions",key:"System key",medium:{disc:"Disc System",cartridge:"Cartridge System"},structure:{label:"On-disk structure",disc:"A folder per Game and a subfolder per Variant",cartridge:"Flat System folder (System/Game.ext)"}},media:{kind:{case:"Cover Art",background:"Background",title:"Title screen",snap:"Screenshot",logo:"Logo"},scope:{global:"Every region"}},prefs:{title:"Preferences",close:"Close",theme:{title:"Theme",hint:"Automatic follows the system.",auto:"Automatic",light:"Light",dark:"Dark"},locale:{title:"Language",hint:"Automatic follows the browser.",auto:"Automatic"},regions:{title:"Region priority",hint:"The order cover art is preferred in. It is kept in the open library.",locked:"Open a folder to choose it: it is kept in the library."},storage:{title:"Storage",usage:"{used} used of {quota} available in this browser",unknown:"This browser does not say how much room is left.",persistent:"Persistent: the browser will not clear your library to make room.",bestEffort:"Best effort: the browser may clear the library when it runs out of room (or, on an iPhone, after days unused unless it is added to the home screen).",ask:"Ask for persistent storage"}},mobile:{nav:"Library navigation",systems:"Systems",games:"Games",game:"Game",reading:"Reading…",noSystems:"No games yet. Use “Add ROMs”.",pickSystem:"Pick a system.",noGames:"No games in this system.",pickGame:"Pick a game.",gameCount:"{count} games",versions:"{count} files",oneVersion:"1 file"},errors:{library:"Could not open this browser's library",sync:"Could not sync with the library",openFolder:"The folder could not be opened",deniedFolder:"Access to the folder was refused. Click again to ask for it once more.",savedFolder:"The remembered folder could not be opened",readSelection:"The selection could not be read",group:"{path} could not be grouped",viewMode:"The view mode could not be saved",regionOrder:"The region order could not be saved",plan:"{system} could not be planned",organize:"The files could not be moved",undo:"The move could not be undone",identify:"The files could not be identified",writeFiles:"The files could not be saved",copyFiles:"The files could not be copied",noGame:"No Game was recognised: pick one to add images to it, or a folder to copy the files into as they are.",catalogue:"The catalogue could not be reached, so they can only be copied as they are: {reason}",unknown:"unknown error"},progress:{reading:"Reading {path}: {done} of {total}",identifying:"Identifying {file}…",identifyingMany:"Identifying {count} files…",identifyingFile:"Identifying {file}: {percent}%",identifyingFileOf:"Identifying {file}: {percent}% ({done} of {total})",saving:"Saving {file}…",copying:"Copying {file}…",copyingOf:"Copying {file} ({done} of {total})…",adding:"Adding {file}…",addingOf:"Adding {file} ({done} of {total})…"},modal:{confirm:"Confirm",cancel:"Cancel",close:"Close",delete:"Delete",createFolderTitle:"New Folder",deleteTitle:"Confirm Deletion"},mods:{title:"Mods",empty:"No mods for this game.",hint:'Add IPS, BPS or UPS patches with "Add ROMs" or by dropping them here. A mod never changes the ROM.',unassigned:"{count} unassigned in this system",assign:"Assign to this game",unassign:"Unassign",rename:"Rename",renameTitle:"Rename mod",remove:"Remove",removeTitle:"Remove mod",removeMessage:'Remove the mod "{name}"? Its patch file is deleted.',added:"{count} mod(s) added, {assigned} to their game",duplicates:"{count} already in the library",fit:{fits:"Fits a version here",other:"For another version",unknown:"IPS: version not checked"},refused:{"not-a-patch":'"{name}" is not an IPS, BPS or UPS patch',damaged:'"{name}" is damaged',"no-system":'"{name}": open the game or the system it is for, then add it'},errors:{import:"The mods could not be added.",change:"The mod could not be changed."}},host:{launcher:"Launcher",launcherTitle:"Back to the launcher",play:"Play",playWithMod:"Play with this mod",migration:{running:"Moving your launcher library in…",progress:"Moving your launcher library in ({done} of {total})…",done:"Your launcher library is here: {roms} ROM(s), {mods} mod(s).",failed:"Your launcher library could not be moved in: {reason}"}}};Z.app;Z.header;Z.tabs;Z.welcome;Z.library;Z.tree;Z.details;Z.editor;Z.drop;Z.intake;Z.organize;Z.system;Z.media;Z.prefs;Z.mobile;Z.errors;Z.progress;Z.modal;Z.mods;Z.host;var ee={app:{name:"ROM Manager",initializing:"Arrancando…"},header:{regions:{label:"Prioridad de región",preferred:"Se prefiere la carátula de {region}",prefer:"Preferir la carátula de {region}"},preferences:"Preferencias"},tabs:{reconnect:"Haz clic para volver a dar acceso",close:"Cerrar",add:"Abrir una carpeta"},welcome:{tagline:"Tu colección retro, leída donde está",pitch:"ROM Manager abre una carpeta de ROMs y hace una biblioteca con ella: cada fichero identificado por su checksum, cada Juego en una sola entrada con sus Variantes, y su Carátula al lado. Funciona entero en el navegador, contra tu propio disco.",open:"Abrir carpeta",opening:"Abriendo…",hint:"No se sube nada. No se mueve nada sin enseñártelo antes.",library:"Abrir mi biblioteca",openFolder:"Abrir una carpeta",libraryHint:"Tu biblioteca vive en este navegador. No se sube nada; en escritorio puedes sincronizarla con una carpeta.",what:{title:"Qué hace",hash:{title:"Identifica por checksum",body:"Cada fichero se contrasta con los DAT de No-Intro y Redump por su CRC32. El nombre de un fichero es lo que alguien escribió; el checksum es lo que el fichero es."},grouping:{title:"Una entrada por Juego",body:"Regiones, revisiones e idiomas de un mismo título se pliegan en un solo Juego, y sus Variantes se leen en el panel de detalles: cuáles tienes, qué ficheros faltan y a dónde se vendió cada una."},covers:{title:"Una carátula por región",body:"Cajas de EU, US y JP sacadas de libretro-thumbnails y guardadas en la biblioteca según navegas, así que siguen ahí con la red apagada. Un orden de preferencia decide cuál se enseña."},consolidate:{title:"Nada se mueve sin tu permiso",body:"Consolidar un Sistema se calcula como un Plan y se te enseña entero. No se renombra ni se mueve nada hasta que lo dices, y se puede deshacer justo después."}},how:{title:"Cómo funciona",step1:{title:"Abre tu colección",body:"Elige la carpeta donde viven tus Sistemas: la carpeta `games` de MiSTer, o cualquiera montada igual."},step2:{title:"Navégala por Juego",body:"La carpeta de un Sistema se puede leer plana, tal cual está en disco, o agrupada, con los ficheros reconocidos plegados en el Juego del que son una edición."},step3:{title:"Ordénala y complétala",body:"Consolida la carpeta cuando el Plan te convenza, suelta carátulas o ROMs directamente sobre el panel, y edita lo que el catálogo no sepa."}},systems:{title:"Sistemas que conoce",hint:"{count} Sistemas, cada uno identificado por el nombre de carpeta que le da MiSTer."},privacy:{title:"No sale de tu máquina",body:"Las carpetas se leen con la File System Access API, que te pide permiso para una carpeta y se lo da sólo a esta pestaña. No hay servidor ni subida de nada. Soporte real sólo hay en navegadores Chromium."},footer:{legal:"ROM Manager es software libre de código abierto. Todos los nombres de sistemas, marcas y carátulas son propiedad de sus respectivos dueños.",github:"Código en GitHub"}},library:{locked:{title:"Carpeta recordada: {name}",open:"Abrir «{name}»"},opening:"Abriendo…",name:"Biblioteca",add:"Añadir ROMs",sync:{action:"Sincronizar con la biblioteca",title:"Sincronizar «{folder}» con la biblioteca",message:"Los juegos de la carpeta se copian a la biblioteca y los de la biblioteca a la carpeta, hasta que las dos sean iguales. Si un archivo cambió en los dos sitios se guardan ambas versiones. La biblioteca ocupará en este navegador el mismo espacio que la carpeta.",confirm:"Sincronizar",running:"Sincronizando con la biblioteca…",done:"Sincronizado: {toLibrary} a la biblioteca, {toFolder} a la carpeta, {conflicts} con dos versiones.",same:"La carpeta y la biblioteca ya eran iguales."}},tree:{title:"Ficheros",newFolder:"Nueva carpeta dentro de la seleccionada",addFiles:"Añadir ficheros a la carpeta seleccionada",delete:"Borrar lo seleccionado",expand:"Desplegar",collapse:"Plegar",initialized:"Tiene metadatos en la biblioteca",groupOn:"Ver esta carpeta tal cual está en disco",groupOff:"Agrupar esta carpeta por Juego",consolidate:"Renombrar y ordenar esta carpeta según el catálogo",empty:"Carpeta vacía",reading:"Leyendo juegos…",status:{complete:"Están todos los ficheros",partial:"Faltan ficheros",missing:"No está en esta carpeta"},prompt:{folderName:"Nombre de la carpeta nueva"},confirm:{delete:"¿Borrar {count} elemento(s)? Esto no se puede deshacer."},error:{separator:"El nombre de una carpeta no puede llevar separadores de ruta",read:"No se ha podido leer la carpeta",operation:"La operación ha fallado",drag:"No se ha podido leer lo que se arrastró"}},details:{empty:"Elige una ROM para leer sus detalles",back:"Volver al Juego",cover:{none:"Sin carátula",region:"Caja de {region}",game:"Caja del Juego",alt:"Carátula de {title}"},facts:{system:"Sistema",format:"Formato",size:"Tamaño",modified:"Modificado",added:"Añadido a la biblioteca",file:"Fichero",publisher:"Editora",crc32:"CRC32",updated:"Actualizado",notInitialized:"No está en la biblioteca",noExtension:"sin extensión"},file:{pending:"Todavía no está en la biblioteca",add:"Añadir metadatos"},edit:"Editar",delete:"Borrar",checksum:{calculate:"Calcular",calculating:"Calculando…",skipped:"No se calcula — pasa de {limit}",failed:"No se ha podido calcular el checksum"},variants:{title:"Variantes",files:"{count} ficheros",missingFile:"falta",more:"otras {count} que el catálogo conoce",shipsTo:"Se vendió en {region}",runsAt:"Funciona a {standard}",consolidate:"Renombrar y ordenar según el catálogo",deleteVariant:"Borrar variante",deleteFile:"Borrar fichero",deleteTitle:"Borrar variante",deleteMessage:'¿Seguro que quieres borrar la variante "{variant}" ({count} fichero(s))? Esta acción no se puede deshacer.',deleteFileTitle:"Borrar fichero",deleteFileMessage:'¿Seguro que quieres borrar el fichero "{name}"? Esta acción no se puede deshacer.'},status:{complete:"Completa",partial:"Incompleta",missing:"No está en esta carpeta"},selection:{title:"{count} ROMs seleccionadas",ready:"Todas están en la biblioteca",pending:"{count} de ellas todavía no están en la biblioteca",edit:"Editar {count}",gate:"Todas las ROMs seleccionadas tienen que estar en la biblioteca para editarlas en lote",hint:"Editar los campos que comparten todos los Juegos seleccionados"},batch:{title:"Editando {count} Juegos",subtitle:"Sólo se pueden cambiar los campos que comparten todos los Juegos",keep:"Dejar como está ({value})",mixed:"mezclado",apply:"Aplicar a {count} Juegos",saving:"Guardando…",error:"No se han podido guardar las fichas"}},editor:{lookup:{idle:"Buscar en el dataset",crc32:"Comprobando CRC32…",md5:"Calculando MD5…",sha1:"Calculando SHA1…",hint:"Buscar el Juego en el dataset (CRC32 → MD5 → SHA1)",tooLarge:"El fichero es demasiado grande para calcularle el checksum",title:"Encontrado en el dataset",match:"Coincide con:",select:"Campos que actualizar:",current:"Ahora:",incoming:"Nuevo:",empty:"(vacío)",apply:"Aplicar los marcados",notFound:"Ningún dataset tiene este fichero",failed:"La búsqueda ha fallado"},fields:{cover:"Carátula",title:"Título",description:"Descripción",releaseDate:"Fecha de salida",publisher:"Editora",region:"Región",videoStandard:"Estándar de vídeo",crc32:"CRC32"},select:"Elige…",changeCover:"Cambiar la carátula",removeCover:"Quitar la carátula",dropCoverOrClick:"Arrastra una imagen aquí o haz clic para elegir",notCalculated:"Sin calcular",tooLarge:"Fichero demasiado grande",calculate:"Calcular",save:"Guardar",saving:"Guardando…",cancel:"Cancelar",error:{save:"No se ha podido guardar la ficha",checksum:"No se ha podido calcular el checksum"}},drop:{label:"Añadir ficheros",toGame:"Añadir a {title}",toFolder:"Añadir a {folder}",root:"la raíz",images:{one:"Imagen",many:"Imágenes",hint:"Se guardan en los metadatos del Juego y sustituyen a la carátula publicada de esa región."},files:{one:"Fichero",many:"Ficheros"},asIs:"Tal cual",asGame:"Como {title}",alongGame:"Va con el Juego",already:"{title} ya está en {folder}",andMore:"{path} · y {count} más",hint:{plain:"Se copian tal cual a {folder}.",intake:"Tal cual van a {folder}. Como Juego, cada uno va donde lo pone el catálogo, creando la carpeta si no existe, y lo que salga de un archivo se descomprime y se comprueba que sea lo que el archivo decía."},cancel:"Cancelar",confirm:"Añadir",confirmMany:"Añadir {count}"},intake:{label:"Añadir Juegos a la biblioteca",toSystem:"Añadir a {system}",toLibrary:"Añadir a la biblioteca",games:{one:"Juego",many:"Juegos ({count})",hint:"La carpeta se crea si no existe. Lo que salga de un archivo se descomprime y se comprueba que sea lo que el archivo decía."},taken:"Ya está en {path}",from:"de {archive}",companions:{one:"Fichero que va con él",many:"Ficheros que van con él",already:"{name} (ya está ahí)",hint:"No están en ningún catálogo, así que se copian junto al Juego."},strays:{title:"Sin reconocer",hint:"Ningún catálogo los reclama, así que no se copian: elige una carpeta en el árbol para meterlos tal cual."},refused:{title:"No se pueden abrir",zip64:"el archivo usa Zip64, que esta versión no sabe leer",encrypted:"está cifrado",method:"usa una compresión que esta versión no sabe leer",damaged:"no se ha podido leer su índice"},cancel:"Cancelar",confirm:"Añadir",confirmMany:"Añadir {count}"},organize:{title:"Consolidar {system}",done:"{system} consolidado",moving:"por mover",settled:"ya en su sitio",markers:"Juegos marcados",conflicts:"sin tocar",untouched:"No se tocan",reason:{duplicateTarget:"otro fichero reclama el mismo nombre",targetTaken:"el nombre de destino ya está ocupado",swap:"varios ficheros se reclaman el sitio entre sí"},moved:"Movidos",willMove:"Se moverán",more:"y {count} más",settledAll:"Todo está donde el catálogo dice que debe estar.",undo:"Deshacer",close:"Hecho",cancel:"Cancelar",confirm:"Mover {count} ficheros",busy:{reading:"Leyendo {system}…",readingProgress:"Leyendo {system}: {done} de {total}",moving:"Moviendo ficheros…",movingProgress:"Moviendo ficheros: {done} de {total}",undoing:"Devolviendo los ficheros a su sitio…"}},system:{folder:"Carpeta",collection:"Carpeta / Colección",path:"Ruta",about:"Sobre este Sistema",extensions:"Extensiones habituales",key:"Clave del Sistema",medium:{disc:"Sistema de disco",cartridge:"Sistema de cartucho"},structure:{label:"Estructura en disco",disc:"Una carpeta por Juego y una subcarpeta por Variante",cartridge:"Carpeta de Sistema plana (Sistema/Juego.ext)"}},media:{kind:{case:"Carátula",background:"Fondo",title:"Pantalla de título",snap:"Captura",logo:"Logo"},scope:{global:"Todas las regiones"}},prefs:{title:"Preferencias",close:"Cerrar",theme:{title:"Tema",hint:"Automático sigue al sistema.",auto:"Automático",light:"Claro",dark:"Oscuro"},locale:{title:"Idioma",hint:"Automático sigue al navegador.",auto:"Automático"},regions:{title:"Prioridad de región",hint:"Orden en que se prefieren las carátulas. Se guarda en la biblioteca abierta.",locked:"Abre una carpeta para elegirlo: se guarda en la biblioteca."},storage:{title:"Almacenamiento",usage:"{used} usados de {quota} disponibles en este navegador",unknown:"Este navegador no dice cuánto espacio queda.",persistent:"Persistente: el navegador no borrará tu biblioteca para hacer sitio.",bestEffort:"Sin garantía: el navegador podría borrar la biblioteca si le falta espacio (o, en iPhone, tras días sin usarla si no la instalas en la pantalla de inicio).",ask:"Pedir almacenamiento persistente"}},mobile:{nav:"Navegación de la biblioteca",systems:"Sistemas",games:"Juegos",game:"Juego",reading:"Leyendo…",noSystems:"Todavía no hay juegos. Usa «Añadir ROMs».",pickSystem:"Elige un sistema.",noGames:"No hay juegos en este sistema.",pickGame:"Elige un juego.",gameCount:"{count} juegos",versions:"{count} archivos",oneVersion:"1 archivo"},errors:{openFolder:"No se ha podido abrir la carpeta",library:"No se ha podido abrir la biblioteca de este navegador",sync:"No se ha podido sincronizar con la biblioteca",deniedFolder:"Acceso denegado a la carpeta. Haz clic de nuevo para volver a pedirlo.",savedFolder:"No se ha podido abrir la carpeta guardada",readSelection:"No se ha podido leer la selección",group:"No se ha podido agrupar {path}",viewMode:"No se ha podido guardar el modo de vista",regionOrder:"No se ha podido guardar el orden de regiones",plan:"No se ha podido planear {system}",organize:"No se han podido mover los ficheros",undo:"No se ha podido deshacer",identify:"No se han podido identificar los ficheros",writeFiles:"No se han podido guardar los ficheros",copyFiles:"No se han podido copiar los ficheros",noGame:"No se ha reconocido ningún Juego: elige uno para añadirle imágenes, o una carpeta para copiar los ficheros dentro tal cual.",catalogue:"No se ha podido consultar el catálogo, así que sólo se pueden copiar tal cual: {reason}",unknown:"error desconocido"},progress:{reading:"Leyendo {path}: {done} de {total}",identifying:"Identificando {file}…",identifyingMany:"Identificando {count} ficheros…",identifyingFile:"Identificando {file}: {percent}%",identifyingFileOf:"Identificando {file}: {percent}% ({done} de {total})",saving:"Guardando {file}…",copying:"Copiando {file}…",copyingOf:"Copiando {file} ({done} de {total})…",adding:"Añadiendo {file}…",addingOf:"Añadiendo {file} ({done} de {total})…"},modal:{confirm:"Confirmar",cancel:"Cancelar",close:"Cerrar",delete:"Eliminar",createFolderTitle:"Nueva carpeta",deleteTitle:"Confirmar eliminación"},mods:{title:"Mods",empty:"Este juego no tiene mods.",hint:"Añade parches IPS, BPS o UPS con «Añadir ROMs» o soltándolos aquí. Un mod nunca cambia la ROM.",unassigned:"{count} sin asignar en este sistema",assign:"Asignar a este juego",unassign:"Quitar del juego",rename:"Renombrar",renameTitle:"Renombrar mod",remove:"Eliminar",removeTitle:"Eliminar mod",removeMessage:"¿Eliminar el mod «{name}»? Se borra su archivo de parche.",added:"{count} mod(s) añadido(s), {assigned} a su juego",duplicates:"{count} ya estaba(n) en la biblioteca",fit:{fits:"Encaja con una versión de aquí",other:"Para otra versión",unknown:"IPS: versión sin comprobar"},refused:{"not-a-patch":"«{name}» no es un parche IPS, BPS ni UPS",damaged:"«{name}» está dañado","no-system":"«{name}»: abre el juego o el sistema al que va y añádelo"},errors:{import:"No se pudieron añadir los mods.",change:"No se pudo cambiar el mod."}},host:{launcher:"Lanzador",launcherTitle:"Volver al lanzador",play:"Jugar",playWithMod:"Jugar con este mod",migration:{running:"Trayendo la biblioteca del lanzador…",progress:"Trayendo la biblioteca del lanzador ({done} de {total})…",done:"Tu biblioteca del lanzador ya está aquí: {roms} ROM(s), {mods} mod(s).",failed:"No se pudo traer la biblioteca del lanzador: {reason}"}}};ee.app;ee.header;ee.tabs;ee.welcome;ee.library;ee.tree;ee.details;ee.editor;ee.drop;ee.intake;ee.organize;ee.system;ee.media;ee.prefs;ee.mobile;ee.errors;ee.progress;ee.modal;ee.mods;ee.host;const _n=["en","es"],Os=["auto",..._n],$t="en",Pn="auto",Yh={en:"English",es:"Español"};function Zh(t){return _n.some(e=>e===t)}function $s(t){return Os.find(e=>e===t)??Pn}function Ms(t){for(const e of t??[]){const n=e.toLowerCase().split("-")[0],r=_n.find(a=>a===n);if(r)return r}return $t}function Bs(t,e){return t==="auto"?Ms(e):t}function No(t,e){let n=t;for(const r of e.split(".")){if(typeof n!="object"||n===null)return;n=n[r]}return typeof n=="string"?n:void 0}function eu(t,e){return e?t.replace(/\{(\w+)\}/g,(n,r)=>r in e?String(e[r]):n):t}function Rs(t,e,n,r){const a=No(t,n)??No(e,n);return a===void 0?n:eu(a,r)}function _s(t,e=""){return Object.entries(t).flatMap(([n,r])=>{const a=e?`${e}.${n}`:n;return typeof r=="string"?[a]:_s(r,a)})}const tu=Object.freeze(Object.defineProperty({__proto__:null,DEFAULT_LOCALE:$t,DEFAULT_LOCALE_PREFERENCE:Pn,LOCALES:_n,LOCALE_LABELS:Yh,LOCALE_PREFERENCES:Os,isLocale:Zh,messageKeys:_s,negotiateLocale:Ms,parseLocalePreference:$s,resolveLocale:Bs,translate:Rs},Symbol.toStringTag,{value:"Module"})),Ps="rom-manager.locale",or={en:Z,es:ee},ze=Ke({preference:Pn,locale:$t});function nu(){if(!(typeof navigator>"u"))return navigator.languages?.length?navigator.languages:[navigator.language]}function ru(){try{return $s(localStorage.getItem(Ps))}catch{return Pn}}function au(t){try{localStorage.setItem(Ps,t)}catch{}}function ou(t){typeof document<"u"&&(document.documentElement.lang=t)}function Fr(t){const e=Bs(t,nu());ze.locale=e,ou(e)}function iu(t){ze.preference=t,au(t),Fr(t)}function Ns(t,e){return Rs(or[ze.locale]??or[$t],or[$t],t,e)}function su(){const t=ru();if(ze.preference=t,Fr(t),typeof window>"u")return()=>{};const e=()=>{const n=ze.preference;n==="auto"&&Fr(n)};return window.addEventListener("languagechange",e),()=>window.removeEventListener("languagechange",e)}const zs=Object.freeze(Object.defineProperty({__proto__:null,i18nState:ze,initLocale:su,setLocalePreference:iu,t:Ns},Symbol.toStringTag,{value:"Module"})),Ls=["auto","light","dark"],Nn="auto";function Ts(t){return Ls.find(e=>e===t)??Nn}function Ds(t,e){return t==="auto"?e?"dark":"light":t}const lu=Object.freeze(Object.defineProperty({__proto__:null,DEFAULT_THEME_MODE:Nn,THEME_MODES:Ls,parseThemeMode:Ts,resolveTheme:Ds},Symbol.toStringTag,{value:"Module"})),Fs="rom-manager.theme",cu="(prefers-color-scheme: dark)",Mt=Ke({mode:Nn});function du(){try{return Ts(localStorage.getItem(Fs))}catch{return Nn}}function fu(t){try{localStorage.setItem(Fs,t)}catch{}}function js(){return typeof matchMedia=="function"?matchMedia(cu):void 0}function jr(t){typeof document>"u"||(document.documentElement.dataset.theme=Ds(t,js()?.matches??!1))}function hu(t){Mt.mode=t,fu(t),jr(t)}function uu(){const t=du();Mt.mode=t,jr(t);const e=js();if(!e)return()=>{};const n=()=>jr(Mt.mode);return e.addEventListener("change",n),()=>e.removeEventListener("change",n)}const Us=Object.freeze(Object.defineProperty({__proto__:null,initTheme:uu,setThemeMode:hu,themeState:Mt},Symbol.toStringTag,{value:"Module"}));class pu{get locale(){return ze.locale}get localePreference(){return ze.preference}get themeMode(){return Mt.mode}get origins(){return q.origins}get activeOriginId(){return q.activeOriginId}get loading(){return q.loading}get error(){return q.error}get knownSystems(){return q.knownSystems}get wizardSettings(){return q.wizardSettings}}const mu=new pu,de=Object.freeze(Object.defineProperty({__proto__:null,t:Ns,ui:mu},Symbol.toStringTag,{value:"Module"})),gu=`<!--
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
`,yu={"../components/BrandLogo.html":gs,"../components/Icon.html":ie,"../components/Tabs.html":Dh,"../helpers/rom-regions":Ss,"../lib/ui-state":de},vu="views/Header.html";let qs;qs=new J(gu,{modules:yu,filename:vu});const wu=qs,bu=`<!--
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
`,ku={},Au="components/SystemLogo.html";let Gs;Gs=new J(bu,{modules:ku,filename:Au});const zn=Gs,Su=`<!-- The welcome panel's four capability drawings, by \`kind\`: hash, grouping, covers, consolidate. -->
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
`,xu={},Eu="components/WelcomeIllustration.html";let Qs;Qs=new J(Su,{modules:xu,filename:Eu});const Iu=Qs,Ur={NES:{id:"NES",name:"NES / Famicom",fullName:"Nintendo Entertainment System",manufacturer:"Nintendo",releaseYear:1983,media:"cartridge",description:"The 8-bit third-generation home console that revitalized the video game industry with legendary titles like Super Mario Bros., The Legend of Zelda, and Metroid.",commonExtensions:["nes","fds","unf","unif"],accentColor:"#e60012"},SNES:{id:"SNES",name:"Super Nintendo",fullName:"Super Nintendo Entertainment System",manufacturer:"Nintendo",releaseYear:1990,media:"cartridge",description:"Nintendo’s iconic 16-bit console celebrated for Mode 7 graphics, custom sound chips, and classic franchises like Super Mario World, Chrono Trigger, and Super Metroid.",commonExtensions:["sfc","smc","fig","swc"],accentColor:"#8b5cf6"},GAMEBOY:{id:"GAMEBOY",name:"Game Boy",fullName:"Nintendo Game Boy",manufacturer:"Nintendo",releaseYear:1989,media:"cartridge",description:"The groundbreaking monochrome handheld system that dominated portable gaming with exceptional battery life and games like Tetris and Pokémon Red/Blue.",commonExtensions:["gb"],accentColor:"#8bac0f"},GBC:{id:"GBC",name:"Game Boy Color",fullName:"Nintendo Game Boy Color",manufacturer:"Nintendo",releaseYear:1998,media:"cartridge",description:"The color evolution of the Game Boy featuring a color LCD screen, backwards compatibility, and titles like Pokémon Gold/Silver and Legend of Zelda: Oracle of Ages.",commonExtensions:["gbc"],accentColor:"#9333ea"},GBA:{id:"GBA",name:"Game Boy Advance",fullName:"Nintendo Game Boy Advance",manufacturer:"Nintendo",releaseYear:2001,media:"cartridge",description:"A powerful 32-bit handheld console delivering 2D arcade-quality graphics, home to games like Pokémon Ruby/Sapphire, Castlevania: Aria of Sorrow, and Golden Sun.",commonExtensions:["gba"],accentColor:"#3b82f6"},N64:{id:"N64",name:"Nintendo 64",fullName:"Nintendo 64",manufacturer:"Nintendo",releaseYear:1996,media:"cartridge",description:"Pioneered 3D gaming and analogue control with games like Super Mario 64, The Legend of Zelda: Ocarina of Time, GoldenEye 007, and Super Smash Bros.",commonExtensions:["z64","n64","v64"],accentColor:"#10b981"},PokemonMini:{id:"PokemonMini",name:"Pokémon Mini",fullName:"Nintendo Pokémon Mini",manufacturer:"Nintendo",releaseYear:2001,media:"cartridge",description:"The smallest cartridge-based handheld console ever produced by Nintendo, dedicated entirely to Pokémon themed mini-games.",commonExtensions:["min"],accentColor:"#f59e0b"},SMS:{id:"SMS",name:"Master System",fullName:"Sega Master System",manufacturer:"Sega",releaseYear:1985,media:"cartridge",description:"Sega’s 8-bit console that rivaled the NES with superior graphics hardware, popular for Alex Kidd, Phantasy Star, and Sonic the Hedgehog.",commonExtensions:["sms"],accentColor:"#0284c7"},GameGear:{id:"GameGear",name:"Game Gear",fullName:"Sega Game Gear",manufacturer:"Sega",releaseYear:1990,media:"cartridge",description:"Sega’s full-color backlit handheld console based on Master System architecture, featuring portable versions of Sonic, Shinobi, and Columns.",commonExtensions:["gg"],accentColor:"#2563eb"},MegaDrive:{id:"MegaDrive",name:"Mega Drive / Genesis",fullName:"Sega Mega Drive / Genesis",manufacturer:"Sega",releaseYear:1988,media:"cartridge",description:'Sega’s legendary 16-bit console defined by "Blast Processing", arcade ports, and classic games like Sonic the Hedgehog, Streets of Rage, and Gunstar Heroes.',commonExtensions:["md","gen","smd","bin"],accentColor:"#1e293b"},MegaCD:{id:"MegaCD",name:"Mega-CD / Sega CD",fullName:"Sega Mega-CD / Sega CD",manufacturer:"Sega",releaseYear:1991,media:"disc",description:"CD-ROM add-on for the Mega Drive introducing CD audio, full-motion video, and enhanced scaling graphics with games like Sonic CD and Snatcher.",commonExtensions:["cue","bin","iso","chd"],accentColor:"#475569"},S32X:{id:"S32X",name:"32X",fullName:"Sega 32X",manufacturer:"Sega",releaseYear:1994,media:"cartridge",description:"32-bit hardware expansion unit for the Mega Drive featuring twin RISC processors for 3D games like Virtua Fighter, Star Wars Arcade, and Knuckles’ Chaotix.",commonExtensions:["32x","bin"],accentColor:"#ef4444"},Saturn:{id:"Saturn",name:"Sega Saturn",fullName:"Sega Saturn",manufacturer:"Sega",releaseYear:1994,media:"disc",description:"Sega’s 32-bit dual-CPU console celebrated for unbeatable 2D arcade ports, innovative 3D titles, and classics like Panzer Dragoon, Nights into Dreams, and Virtua Fighter 2.",commonExtensions:["cue","bin","iso","chd"],accentColor:"#6366f1"},PSX:{id:"PSX",name:"PlayStation",fullName:"Sony PlayStation",manufacturer:"Sony",releaseYear:1994,media:"disc",description:"The landmark 32-bit console that revolutionized gaming with CD-ROM media, 3D graphics, and blockbusters like Final Fantasy VII, Metal Gear Solid, and Resident Evil.",commonExtensions:["cue","bin","iso","chd","pbp","m3u"],accentColor:"#00439c"},TGFX16:{id:"TGFX16",name:"TurboGrafx-16 / PC Engine",fullName:"NEC TurboGrafx-16 / PC Engine",manufacturer:"NEC",releaseYear:1987,media:"cartridge",description:"NEC and Hudson Soft’s sleek 16-bit graphics system using ultra-compact HuCard media, famous for shoot-’em-ups and games like Bonk’s Adventure and Splatterhouse.",commonExtensions:["pce","sgx"],accentColor:"#d97706"},"TGFX16-CD":{id:"TGFX16-CD",name:"TurboGrafx-CD / PC Engine CD",fullName:"NEC TurboGrafx-CD / PC Engine CD-ROM²",manufacturer:"NEC",releaseYear:1988,media:"disc",description:"The world’s first CD-ROM console add-on, legendary for redbook audio soundtracks, animated cutscenes, and masterpieces like Castlevania: Rondo of Blood.",commonExtensions:["cue","bin","iso","chd","toc"],accentColor:"#b45309"},NEOGEO:{id:"NEOGEO",name:"Neo Geo AES / MVS",fullName:"SNK Neo Geo Advanced Entertainment System",manufacturer:"SNK",releaseYear:1990,media:"cartridge",description:"The ultimate arcade hardware in the home, featuring massive gigabit cartridges and iconic fighting and action games like Metal Slug, King of Fighters, and Samurai Shodown.",commonExtensions:["neo","zip","7z"],accentColor:"#dc2626"},"NeoGeo-CD":{id:"NeoGeo-CD",name:"Neo Geo CD",fullName:"SNK Neo Geo CD",manufacturer:"SNK",releaseYear:1994,media:"disc",description:"CD-based home version of the Neo Geo arcade hardware offering arcade-perfect gameplay with orchestrated soundtracks.",commonExtensions:["cue","bin","iso","chd"],accentColor:"#991b1b"},Atari2600:{id:"Atari2600",name:"Atari 2600",fullName:"Atari 2600 Video Computer System",manufacturer:"Atari",releaseYear:1977,media:"cartridge",description:"The pioneer of microprocessor-based home consoles with interchangeable cartridges, home to classics like Pitfall!, Space Invaders, and Asteroids.",commonExtensions:["a26","bin"],accentColor:"#ea580c"},ATARI5200:{id:"ATARI5200",name:"Atari 5200",fullName:"Atari 5200 SuperSystem",manufacturer:"Atari",releaseYear:1982,media:"cartridge",description:"Atari’s second-generation console based on Atari 8-bit computer architecture, featuring arcade ports like Centipede, Pac-Man, and Defender.",commonExtensions:["a52","bin"],accentColor:"#c2410c"},ATARI7800:{id:"ATARI7800",name:"Atari 7800",fullName:"Atari 7800 ProSystem",manufacturer:"Atari",releaseYear:1986,media:"cartridge",description:"Designed with near-perfect arcade capability and full backwards compatibility with Atari 2600 cartridges.",commonExtensions:["a78","bin"],accentColor:"#9a3412"},AtariLynx:{id:"AtariLynx",name:"Atari Lynx",fullName:"Atari Lynx",manufacturer:"Atari",releaseYear:1989,media:"cartridge",description:"The world’s first handheld console with a color LCD screen, featuring hardware sprite scaling and ambidextrous flip control.",commonExtensions:["lnx","lyx"],accentColor:"#fb923c"},WonderSwan:{id:"WonderSwan",name:"WonderSwan",fullName:"Bandai WonderSwan",manufacturer:"Bandai",releaseYear:1999,media:"cartridge",description:"Gunpei Yokoi’s compact handheld console featuring portrait or landscape orientation, long battery life, and Japanese RPG classics.",commonExtensions:["ws"],accentColor:"#06b6d4"},WonderSwanColor:{id:"WonderSwanColor",name:"WonderSwan Color",fullName:"Bandai WonderSwan Color",manufacturer:"Bandai",releaseYear:2e3,media:"cartridge",description:"Color upgrade to the WonderSwan featuring a FSTN color screen and exclusive titles like Final Fantasy remakes and Klonoa.",commonExtensions:["wsc","ws"],accentColor:"#0891b2"}};function Cu(t){if(!t)return;const e=t.indexOf("/")===-1?t:t.split("/")[0],n=Object.keys(Ur).find(r=>r.toLowerCase()===e.toLowerCase());return n?Ur[n]:void 0}function Ou(){return Object.values(Ur)}const Aa=Object.freeze(Object.defineProperty({__proto__:null,getAllSystemsInfo:Ou,getSystemInfo:Cu},Symbol.toStringTag,{value:"Module"})),$u=`<!--
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
`,Mu={"../components/BrandLogo.html":gs,"../components/Icon.html":ie,"../components/SystemLogo.html":zn,"../components/WelcomeIllustration.html":Iu,"../helpers/system-info":Aa,"../lib/ui-state":de},Bu="views/WelcomePanel.html";let Hs;Hs=new J($u,{modules:Mu,filename:Bu});const Ru=Hs,_u=`<!-- A folder with the console it holds as a badge: the mark of a system folder browsed as games. -->
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
`,Pu={"./SystemLogo.html":zn},Nu="components/SystemFolderIcon.html";let Ws;Ws=new J(_u,{modules:Pu,filename:Nu});const zu=Ws,Lu=`<!-- The tree's title and its toolbar. Emits \`create-folder\`, \`add-files\` and \`delete-selected\`. -->
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
`,Tu={"./Icon.html":ie},Du="components/FileTreeHeader.html";let Vs;Vs=new J(Lu,{modules:Tu,filename:Du});const Fu=Vs,ju=`<!--
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
`,Uu={"./Icon.html":ie},qu="components/ConfirmModal.html";let Js;Js=new J(ju,{modules:Uu,filename:qu});const Ln=Js,Gu=`<!--
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
`,Qu={"./Icon.html":ie},Hu="components/PromptModal.html";let Xs;Xs=new J(Gu,{modules:Qu,filename:Hu});const Ks=Xs,Ys="",Wu="application/x-rom-manager-paths";function Vu(t){const e=t.lastIndexOf("/");return e===-1?Ys:t.slice(0,e)}function Ju(t){return t.slice(t.lastIndexOf("/")+1)}function Xu(t,e){return t?`${t}/${e}`:e}function Ku(t,e){return e===t||e.startsWith(`${t}/`)}function Yu(t){const e=JSON.parse(t);if(!Array.isArray(e)||e.some(n=>typeof n!="string"))throw new Error("Invalid drag payload");return e}function Zu(t){return t.startsWith(".")}function ep(t){const e=t.indexOf("/");return e===-1?t||void 0:t.slice(0,e)}const Zs=Object.freeze(Object.defineProperty({__proto__:null,DRAG_MIME:Wu,ROOT:Ys,contains:Ku,isHiddenName:Zu,join:Xu,nameOf:Ju,parentOf:Vu,parseDraggedPaths:Yu,systemOfPath:ep},Symbol.toStringTag,{value:"Module"})),tp=new Set(["iso","cue","chd","gdi","nrg","mdf","ccd","pbp"]),np=new Set(["sav","srm","state","st0","st1","st2","st3","st4","st5","mcr","mc"]),rp=new Set(["zip","7z","rar","gz","tar"]),ap=new Set(["png","jpg","jpeg","gif","webp","bmp","svg"]),op=new Set(["txt","json","xml","md","nfo","pdf","doc","dat"]);function ip(t){const e=t.split(".").pop()?.toLowerCase()||"";return tp.has(e)?"disc":np.has(e)?"memory-card":rp.has(e)?"archive":ap.has(e)?"image":op.has(e)?"document":"file"}const sp=Object.freeze(Object.defineProperty({__proto__:null,iconNameOf:ip},Symbol.toStringTag,{value:"Module"})),lp=`<!--
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
`,cp={"../components/Icon.html":ie,"../components/SystemFolderIcon.html":zu,"../components/FileTreeHeader.html":Fu,"../components/ConfirmModal.html":Ln,"../components/PromptModal.html":Ks,"../helpers/tree":Zs,"../helpers/file-icons":sp,"../lib/ui-state":de},dp="views/FileTree.html";let el;el=new J(lp,{modules:cp,filename:dp});const fp=el,hp=`<!-- A folder picked in the tree: its system (when the folder is one), or a plain collection. -->
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
`,up={"../components/SystemLogo.html":zn,"../helpers/system-info":Aa,"../lib/ui-state":de},pp="views/SystemDetails.html";let tl;tl=new J(hp,{modules:up,filename:pp});const mp=tl,gp=["Asia","Australia","Austria","Belgium","Brazil","Canada","China","Croatia","Denmark","Europe","Finland","France","Germany","Greece","Hong Kong","India","Ireland","Israel","Italy","Japan","Korea","Mexico","Netherlands","Norway","Peru","Poland","Portugal","Russia","South Africa","Spain","Sweden","Switzerland","Taiwan","Turkey","United Kingdom","USA"],yp=["NTSC","PAL","PAL, NTSC","SECAM"];class Ue{static instance;metadataCache=new Map;constructor(){}static getInstance(){return Ue.instance||(Ue.instance=new Ue),Ue.instance}getROMFormat(e){const n=e.split(".").pop()?.toLowerCase()||"";return{nes:"NES",smc:"SNES",sfc:"SNES",gen:"Genesis",md:"Genesis",bin:"Genesis",gb:"Game Boy",gba:"Game Boy Advance",z64:"Nintendo 64",n64:"Nintendo 64",gbc:"Game Boy Color"}[n]||n.toUpperCase()}parseMetadata(e,n){return{filename:e,path:"",format:this.getROMFormat(e),fileSize:n,lastModified:new Date}}getMetadata(e){return this.metadataCache.get(e)}setMetadata(e,n){this.metadataCache.set(e,n)}updateMetadata(e,n){const a={...this.metadataCache.get(e)||{filename:e,path:e,format:"",fileSize:0},...n};return this.metadataCache.set(e,a),a}clearCache(){this.metadataCache.clear()}}const vp=Ue.getInstance(),nl=Object.freeze(Object.defineProperty({__proto__:null,ROMMetadataService:Ue,ROM_REGIONS:gp,VIDEO_STANDARDS:yp,romMetadataService:vp},Symbol.toStringTag,{value:"Module"})),wp="rom-manager-datasets",bp=5,ne="roms",oe="datasetsMeta",zo=7;class Xt{static db=null;static initialized;static index=null;static loading=new Map;static{typeof indexedDB<"u"&&(this.initialized=this.initializeDB())}static async initializeDB(){return new Promise((e,n)=>{const r=indexedDB.open(wp,bp);r.onerror=()=>n(r.error),r.onsuccess=()=>{this.db=r.result,e(r.result)},r.onupgradeneeded=a=>{const o=a.target.result,i=a.target.transaction;for(const s of["gamesByCrc","gamesByMd5","gamesBySha1"])o.objectStoreNames.contains(s)&&o.deleteObjectStore(s);if(o.objectStoreNames.contains(ne)){const s=i.objectStore(ne);s.clear(),i.objectStore(oe).clear(),s.indexNames.contains("system")||s.createIndex("system","system",{unique:!1})}else{const s=o.createObjectStore(ne,{keyPath:"crc"});s.createIndex("md5","md5",{unique:!1}),s.createIndex("sha1","sha1",{unique:!1}),s.createIndex("name","name",{unique:!1}),s.createIndex("system","system",{unique:!1})}o.objectStoreNames.contains(oe)||o.createObjectStore(oe,{keyPath:"source"})}})}static async getDB(){return this.db?this.db:this.initialized}static async getIndex(){return this.index??=fetch("/roms/datasets/index.json").then(e=>e.ok?e.json():null).catch(()=>null).then(e=>e&&Array.isArray(e.files)?e:null),this.index}static async listSystems(){const e=await this.getIndex();return e?e.files.filter(n=>this.isValidDatasetIndexEntry(n)).map(({system:n,media:r})=>({system:n,media:r})):[]}static async ensureSystem(e){const n=this.loading.get(e);if(n)return n;const r=(async()=>{const o=(await this.getIndex())?.files.find(i=>i.system===e);if(!o||!this.isValidDatasetIndexEntry(o))throw new Error(`No dataset available for system: ${e}`);await this.loadDataset(o)})();return this.loading.set(e,r),r.catch(()=>this.loading.delete(e)),r}static async mediaOf(e){const r=(await this.getIndex())?.files.find(a=>a.system===e);return r&&this.isValidDatasetIndexEntry(r)?r.media:null}static isValidDatasetIndexEntry(e){if(!e||typeof e!="object")return!1;const n=e;return typeof n.system=="string"&&n.system.length>0&&(n.media==="cartridge"||n.media==="disc")&&typeof n.path=="string"&&/^[^/\\]+\/[^/\\]+\.json$/.test(n.path)&&!n.path.includes("..")&&typeof n.crc32=="string"&&/^[A-Fa-f0-9]{8}$/.test(n.crc32)}static isValidROMMetadata(e){if(!e||typeof e!="object")return!1;const n=e;return typeof n.name=="string"&&typeof n.crc=="string"&&/^[A-Fa-f0-9]{8}$/.test(n.crc)&&(n.md5===void 0||typeof n.md5=="string"&&/^[A-Fa-f0-9]{32}$/.test(n.md5))&&(n.sha1===void 0||typeof n.sha1=="string"&&/^[A-Fa-f0-9]{40}$/.test(n.sha1))}static async loadDataset({system:e,path:n,crc32:r}){const a=await this.getDB(),o=a.transaction([oe],"readonly").objectStore(oe),i=await new Promise((h,y)=>{const u=o.get(n);u.onsuccess=()=>h(u.result),u.onerror=()=>y(u.error)});if(i?.formatVersion===zo&&i.crc32===r){console.log(`✓ Dataset already loaded: ${n}`);return}const s=await fetch(`/roms/datasets/${n}`);if(!s.ok)throw new Error(`HTTP ${s.status}: ${n}`);const l=await s.json();if(!Array.isArray(l.list))throw new Error(`Invalid dataset format: ${n}`);console.log(`📥 Loading dataset: ${n} (${l.meta.totalFiles} files)`);const c=a.transaction([ne,oe],"readwrite"),d=c.objectStore(ne);for(const h of l.list)this.isValidROMMetadata(h)&&d.put({...h,system:e,crc:h.crc.toUpperCase(),md5:h.md5?.toUpperCase(),sha1:h.sha1?.toUpperCase(),cover:this.sanitizeCoverUrl(h.cover)});return c.objectStore(oe).put({...l.meta,source:n,system:e,crc32:r,covers:this.sanitizeCovers(l.covers),sets:l.sets,formatVersion:zo,loadedAt:new Date().toISOString()}),new Promise((h,y)=>{c.oncomplete=()=>{console.log(`✅ Dataset loaded: ${n}`),h()},c.onerror=()=>y(c.error)})}static sanitizeCoverUrl(e){return typeof e=="string"&&e.startsWith("https://")?e:void 0}static sanitizeCovers(e){if(!e||typeof e!="object")return{};const n={};for(const[r,a]of Object.entries(e)){if(r.length===0||!a||typeof a!="object")continue;const o={};for(const[i,s]of Object.entries(a)){const l=this.sanitizeCoverUrl(s);l&&(i===zr||lt(i))&&(o[i]=l)}Object.keys(o).length>0&&(n[r]=o)}return n}static toGameCovers(e){const n=new Map;for(const[r,a]of Object.entries(this.sanitizeCovers(e))){const o={};for(const[s,l]of Object.entries(a))lt(s)&&(o[s]=l);const i=a[zr];n.set(r,i?{byRegion:o,game:i}:{byRegion:o})}return n}static async gameCoversOf(e){await this.ensureSystem(e);const r=(await this.getIndex())?.files.find(s=>s.system===e);if(!r)return new Map;const o=(await this.getDB()).transaction([oe],"readonly").objectStore(oe),i=await new Promise((s,l)=>{const c=o.get(r.path);c.onsuccess=()=>s(c.result),c.onerror=()=>l(c.error)});return this.toGameCovers(i?.covers)}static async listSystemRoms(e){await this.ensureSystem(e);const r=(await this.getDB()).transaction([ne],"readonly").objectStore(ne).index("system");return new Promise((a,o)=>{const i=r.getAll(e);i.onsuccess=()=>a(i.result??[]),i.onerror=()=>o(i.error)})}static async lookupByMd5(e){const r=(await this.getDB()).transaction([ne],"readonly").objectStore(ne).index("md5");return new Promise((a,o)=>{const i=r.get(e.toUpperCase());i.onsuccess=()=>{const s=i.result;if(s){const{md5:l,...c}=s;a(c)}else a(null)},i.onerror=()=>o(i.error)})}static async lookupByCrc(e){const r=(await this.getDB()).transaction([ne],"readonly").objectStore(ne);return new Promise((a,o)=>{const i=r.get(e.toUpperCase());i.onsuccess=()=>{const s=i.result;if(s){const{crc:l,...c}=s;a(c)}else a(null)},i.onerror=()=>o(i.error)})}static async lookupBySha1(e){const r=(await this.getDB()).transaction([ne],"readonly").objectStore(ne).index("sha1");return new Promise((a,o)=>{const i=r.get(e.toUpperCase());i.onsuccess=()=>{const s=i.result;if(s){const{sha1:l,...c}=s;a(c)}else a(null)},i.onerror=()=>o(i.error)})}static async searchByName(e,n=10){const o=(await this.getDB()).transaction([ne],"readonly").objectStore(ne).index("name"),i=[],s=e.toUpperCase();return new Promise((l,c)=>{const d=o.openCursor();d.onsuccess=f=>{const h=f.target.result;if(h&&i.length<n){const{name:y,crc:u,...g}=h.value;y.toUpperCase().includes(s)&&i.push({name:y,...g}),h.continue()}else l(i)},d.onerror=()=>c(d.error)})}static async getStats(){const e=await this.getDB(),n=await new Promise((o,i)=>{const s=e.transaction([ne],"readonly").objectStore(ne).count();s.onsuccess=()=>o(s.result),s.onerror=()=>i(s.error)}),r=e.transaction([oe],"readonly").objectStore(oe),a=[];return new Promise((o,i)=>{const s=r.openCursor();s.onsuccess=l=>{const c=l.target.result;c?(a.push({source:c.value.source,fileCount:c.value.totalFiles}),c.continue()):o({totalFilesByCrc:n,totalFilesByMd5:n,totalFilesBySha1:n,datasets:a})},s.onerror=()=>i(s.error)})}static async lookupSetByMemberCrcs(e,n){if(e.length===0||n.length===0)return;const r=new Set(n.map(i=>i.toUpperCase()));let a,o=0;for(const i of e){const{record:s,media:l}=await this.getMetaRecord(i).catch(()=>({record:void 0,media:void 0}));if(!s?.sets)continue;const c=await this.listSystemRoms(i).catch(()=>[]),d=s.sets;for(const[f,h]of Object.entries(d)){if(!h.members||h.members.length===0)continue;let y=0;for(const u of h.members)r.has(u.toUpperCase())&&y++;if(y>o){o=y;const u=c.find(g=>g.name===h.title||g.fileName===`${f}.neo`);a={system:i,media:l??"cartridge",setKey:f,title:h.title,crc:u?.crc?String(u.crc).toUpperCase():void 0,cover:this.sanitizeCoverUrl(h.cover),attrs:h.attrs}}}}return a}static async getMetaRecord(e){await this.ensureSystem(e);const r=(await this.getIndex())?.files.find(s=>s.system===e);if(!r)return{};const o=(await this.getDB()).transaction([oe],"readonly").objectStore(oe);return{record:await new Promise((s,l)=>{const c=o.get(r.path);c.onsuccess=()=>s(c.result),c.onerror=()=>l(c.error)}),media:r.media}}static async clearData(){const n=(await this.getDB()).transaction([ne,oe],"readwrite");return n.objectStore(ne).clear(),n.objectStore(oe).clear(),new Promise((r,a)=>{n.oncomplete=()=>r(),n.onerror=()=>a(n.error)})}}const Ve=Object.freeze(Object.defineProperty({__proto__:null,ROMDatasetService:Xt},Symbol.toStringTag,{value:"Module"}));/*!
 * hash-wasm (https://www.npmjs.com/package/hash-wasm)
 * (c) Dani Biro
 * @license MIT
 */function bt(t,e,n,r){function a(o){return o instanceof n?o:new n(function(i){i(o)})}return new(n||(n=Promise))(function(o,i){function s(d){try{c(r.next(d))}catch(f){i(f)}}function l(d){try{c(r.throw(d))}catch(f){i(f)}}function c(d){d.done?o(d.value):a(d.value).then(s,l)}c((r=r.apply(t,[])).next())})}class K{constructor(){this.mutex=Promise.resolve()}lock(){let e=()=>{};return this.mutex=this.mutex.then(()=>new Promise(e)),new Promise(n=>{e=n})}dispatch(e){return bt(this,void 0,void 0,function*(){const n=yield this.lock();try{return yield Promise.resolve(e())}finally{n()}})}}var ir;function kp(){return typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:global}const qr=kp(),sr=(ir=qr.Buffer)!==null&&ir!==void 0?ir:null,Ap=qr.TextEncoder?new qr.TextEncoder:null;function rl(t,e){return(t&15)+(t>>6|t>>3&8)<<4|(e&15)+(e>>6|e>>3&8)}function Sp(t,e){const n=e.length>>1;for(let r=0;r<n;r++){const a=r<<1;t[r]=rl(e.charCodeAt(a),e.charCodeAt(a+1))}}function xp(t,e){if(t.length!==e.length*2)return!1;for(let n=0;n<e.length;n++){const r=n<<1;if(e[n]!==rl(t.charCodeAt(r),t.charCodeAt(r+1)))return!1}return!0}const Lo=87,To=48;function Do(t,e,n){let r=0;for(let a=0;a<n;a++){let o=e[a]>>>4;t[r++]=o>9?o+Lo:o+To,o=e[a]&15,t[r++]=o>9?o+Lo:o+To}return String.fromCharCode.apply(null,t)}const Fo=sr!==null?t=>{if(typeof t=="string"){const e=sr.from(t,"utf8");return new Uint8Array(e.buffer,e.byteOffset,e.length)}if(sr.isBuffer(t))return new Uint8Array(t.buffer,t.byteOffset,t.length);if(ArrayBuffer.isView(t))return new Uint8Array(t.buffer,t.byteOffset,t.byteLength);throw new Error("Invalid data type!")}:t=>{if(typeof t=="string")return Ap.encode(t);if(ArrayBuffer.isView(t))return new Uint8Array(t.buffer,t.byteOffset,t.byteLength);throw new Error("Invalid data type!")},jo="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",gt=new Uint8Array(256);for(let t=0;t<jo.length;t++)gt[jo.charCodeAt(t)]=t;function Ep(t){let e=Math.floor(t.length*.75);const n=t.length;return t[n-1]==="="&&(e-=1,t[n-2]==="="&&(e-=1)),e}function Ip(t){const e=Ep(t),n=t.length,r=new Uint8Array(e);let a=0;for(let o=0;o<n;o+=4){const i=gt[t.charCodeAt(o)],s=gt[t.charCodeAt(o+1)],l=gt[t.charCodeAt(o+2)],c=gt[t.charCodeAt(o+3)];r[a]=i<<2|s>>4,a+=1,r[a]=(s&15)<<4|l>>2,a+=1,r[a]=(l&3)<<6|c&63,a+=1}return r}const Dt=16*1024,pt=4,Cp=new K,lr=new Map;function al(t,e){return bt(this,void 0,void 0,function*(){let n=null,r=null,a=!1;if(typeof WebAssembly>"u")throw new Error("WebAssembly is not supported in this environment!");const o=(C,B=0)=>{r.set(C,B)},i=()=>r,s=()=>n.exports,l=C=>{n.exports.Hash_SetMemorySize(C);const B=n.exports.Hash_GetBuffer(),b=n.exports.memory.buffer;r=new Uint8Array(b,B,C)},c=()=>new DataView(n.exports.memory.buffer).getUint32(n.exports.STATE_SIZE,!0),d=Cp.dispatch(()=>bt(this,void 0,void 0,function*(){if(!lr.has(t.name)){const B=Ip(t.data),b=WebAssembly.compile(B);lr.set(t.name,b)}const C=yield lr.get(t.name);n=yield WebAssembly.instantiate(C,{})})),f=()=>bt(this,void 0,void 0,function*(){n||(yield d);const C=n.exports.Hash_GetBuffer(),B=n.exports.memory.buffer;r=new Uint8Array(B,C,Dt)}),h=(C=null)=>{a=!0,n.exports.Hash_Init(C)},y=C=>{let B=0;for(;B<C.length;){const b=C.subarray(B,B+Dt);B+=b.length,r.set(b),n.exports.Hash_Update(b.length)}},u=C=>{if(!a)throw new Error("update() called before init()");const B=Fo(C);y(B)},g=new Uint8Array(e*2),S=(C,B=null)=>{if(!a)throw new Error("digest() called before init()");return a=!1,n.exports.Hash_Final(B),C==="binary"?r.slice(0,e):Do(g,r,e)},v=()=>{if(!a)throw new Error("save() can only be called after init() and before digest()");const C=n.exports.Hash_GetState(),B=c(),b=n.exports.memory.buffer,O=new Uint8Array(b,C,B),R=new Uint8Array(pt+B);return Sp(R,t.hash),R.set(O,pt),R},p=C=>{if(!(C instanceof Uint8Array))throw new Error("load() expects an Uint8Array generated by save()");const B=n.exports.Hash_GetState(),b=c(),O=pt+b,R=n.exports.memory.buffer;if(C.length!==O)throw new Error(`Bad state length (expected ${O} bytes, got ${C.length})`);if(!xp(t.hash,C.subarray(0,pt)))throw new Error("This state was written by an incompatible hash implementation");const U=C.subarray(pt);new Uint8Array(R,B,b).set(U),a=!0},w=C=>typeof C=="string"?C.length<Dt/4:C.byteLength<Dt;let A=w;switch(t.name){case"argon2":case"scrypt":A=()=>!0;break;case"blake2b":case"blake2s":A=(C,B)=>B<=512&&w(C);break;case"blake3":A=(C,B)=>B===0&&w(C);break;case"xxhash64":case"xxhash3":case"xxhash128":case"crc64":A=()=>!1;break}const P=(C,B=null,b=null)=>{if(!A(C,B))return h(B),u(C),S("hex",b);const O=Fo(C);return r.set(O),n.exports.Hash_Calculate(O.length,B,b),Do(g,r,e)};return yield f(),{getMemory:i,writeMemory:o,getExports:s,setMemorySize:l,init:h,update:u,digest:S,save:v,load:p,calculate:P,hashLength:e}})}function ol(t,e,n){return bt(this,void 0,void 0,function*(){const r=yield t.lock(),a=yield al(e,n);return r(),a})}new K;new K;new K;new K;var Op="crc32",$p="AGFzbQEAAAABEQRgAAF/YAF/AGAAAGACf38AAwgHAAEBAQIAAwUEAQECAgYOAn8BQZDJBQt/AEGACAsHcAgGbWVtb3J5AgAOSGFzaF9HZXRCdWZmZXIAAAlIYXNoX0luaXQAAgtIYXNoX1VwZGF0ZQADCkhhc2hfRmluYWwABA1IYXNoX0dldFN0YXRlAAUOSGFzaF9DYWxjdWxhdGUABgpTVEFURV9TSVpFAwEKkggHBQBBgAkLwwMBA39BgIkBIQFBACECA0AgAUEAQQBBAEEAQQBBAEEAQQAgAkEBcWsgAHEgAkEBdnMiA0EBcWsgAHEgA0EBdnMiA0EBcWsgAHEgA0EBdnMiA0EBcWsgAHEgA0EBdnMiA0EBcWsgAHEgA0EBdnMiA0EBcWsgAHEgA0EBdnMiA0EBcWsgAHEgA0EBdnMiA0EBcWsgAHEgA0EBdnM2AgAgAUEEaiEBIAJBAWoiAkGAAkcNAAtBACEAA0AgAEGEkQFqIABBhIkBaigCACICQf8BcUECdEGAiQFqKAIAIAJBCHZzIgI2AgAgAEGEmQFqIAJB/wFxQQJ0QYCJAWooAgAgAkEIdnMiAjYCACAAQYShAWogAkH/AXFBAnRBgIkBaigCACACQQh2cyICNgIAIABBhKkBaiACQf8BcUECdEGAiQFqKAIAIAJBCHZzIgI2AgAgAEGEsQFqIAJB/wFxQQJ0QYCJAWooAgAgAkEIdnMiAjYCACAAQYS5AWogAkH/AXFBAnRBgIkBaigCACACQQh2cyICNgIAIABBhMEBaiACQf8BcUECdEGAiQFqKAIAIAJBCHZzNgIAIABBBGoiAEH8B0cNAAsLJwACQEEAKAKAyQEgAEYNACAAEAFBACAANgKAyQELQQBBADYChMkBC4gDAQN/QQAoAoTJAUF/cyEBQYAJIQICQCAAQQhJDQBBgAkhAgNAIAJBBGooAgAiA0EOdkH8B3FBgJEBaigCACADQRZ2QfwHcUGAiQFqKAIAcyADQQZ2QfwHcUGAmQFqKAIAcyADQf8BcUECdEGAoQFqKAIAcyACKAIAIAFzIgFBFnZB/AdxQYCpAWooAgBzIAFBDnZB/AdxQYCxAWooAgBzIAFBBnZB/AdxQYC5AWooAgBzIAFB/wFxQQJ0QYDBAWooAgBzIQEgAkEIaiECIABBeGoiAEEHSw0ACwsCQCAARQ0AAkACQCAAQQFxDQAgACEDDAELIAFB/wFxIAItAABzQQJ0QYCJAWooAgAgAUEIdnMhASACQQFqIQIgAEF/aiEDCyAAQQFGDQADQCABQf8BcSACLQAAc0ECdEGAiQFqKAIAIAFBCHZzIgFB/wFxIAJBAWotAABzQQJ0QYCJAWooAgAgAUEIdnMhASACQQJqIQIgA0F+aiIDDQALC0EAIAFBf3M2AoTJAQsyAQF/QQBBACgChMkBIgBBGHQgAEGA/gNxQQh0ciAAQQh2QYD+A3EgAEEYdnJyNgKACQsGAEGEyQELWQACQEEAKAKAyQEgAUYNACABEAFBACABNgKAyQELQQBBADYChMkBIAAQA0EAQQAoAoTJASIBQRh0IAFBgP4DcUEIdHIgAUEIdkGA/gNxIAFBGHZycjYCgAkLCwsBAEGACAsEBAAAAA==",Mp="d2eba587",il={name:Op,data:$p,hash:Mp};const Bp=new K;let Ft=null;function bn(t){return!Number.isInteger(t)||t<0||t>4294967295?new Error("Polynomial must be a valid 32-bit long unsigned integer"):null}function Rp(t,e=3988292384){if(bn(e))return Promise.reject(bn(e));if(Ft===null)return ol(Bp,il,4).then(n=>(Ft=n,Ft.calculate(t,e)));try{const n=Ft.calculate(t,e);return Promise.resolve(n)}catch(n){return Promise.reject(n)}}function _p(t=3988292384){return bn(t)?Promise.reject(bn(t)):al(il,4).then(e=>{e.init(t);const n={init:()=>(e.init(t),n),update:r=>(e.update(r),n),digest:r=>e.digest(r),save:()=>e.save(),load:r=>(e.load(r),n),blockSize:4,digestSize:4};return n})}new K;new K;var Pp="md5",Np="AGFzbQEAAAABEgRgAAF/YAAAYAF/AGACf38BfwMIBwABAgMBAAIFBAEBAgIGDgJ/AUGgigULfwBBgAgLB3AIBm1lbW9yeQIADkhhc2hfR2V0QnVmZmVyAAAJSGFzaF9Jbml0AAELSGFzaF9VcGRhdGUAAgpIYXNoX0ZpbmFsAAQNSGFzaF9HZXRTdGF0ZQAFDkhhc2hfQ2FsY3VsYXRlAAYKU1RBVEVfU0laRQMBCoMaBwUAQYAJCy0AQQBC/rnrxemOlZkQNwKQiQFBAEKBxpS6lvHq5m83AoiJAUEAQgA3AoCJAQu+BQEHf0EAQQAoAoCJASIBIABqQf////8BcSICNgKAiQFBAEEAKAKEiQEgAiABSWogAEEddmo2AoSJAQJAAkACQAJAAkACQCABQT9xIgMNAEGACSEEDAELIABBwAAgA2siBUkNASAFQQNxIQZBACEBAkAgA0E/c0EDSQ0AIANBgIkBaiEEIAVB/ABxIQdBACEBA0AgBCABaiICQRhqIAFBgAlqLQAAOgAAIAJBGWogAUGBCWotAAA6AAAgAkEaaiABQYIJai0AADoAACACQRtqIAFBgwlqLQAAOgAAIAcgAUEEaiIBRw0ACwsCQCAGRQ0AIANBmIkBaiECA0AgAiABaiABQYAJai0AADoAACABQQFqIQEgBkF/aiIGDQALC0GYiQFBwAAQAxogACAFayEAIAVBgAlqIQQLIABBwABPDQEgACECDAILIABFDQIgAEEDcSEGQQAhAQJAIABBBEkNACADQYCJAWohBCAAQXxxIQBBACEBA0AgBCABaiICQRhqIAFBgAlqLQAAOgAAIAJBGWogAUGBCWotAAA6AAAgAkEaaiABQYIJai0AADoAACACQRtqIAFBgwlqLQAAOgAAIAAgAUEEaiIBRw0ACwsgBkUNAiADQZiJAWohAgNAIAIgAWogAUGACWotAAA6AAAgAUEBaiEBIAZBf2oiBg0ADAMLCyAAQT9xIQIgBCAAQUBxEAMhBAsgAkUNACACQQNxIQZBACEBAkAgAkEESQ0AIAJBPHEhAEEAIQEDQCABQZiJAWogBCABaiICLQAAOgAAIAFBmYkBaiACQQFqLQAAOgAAIAFBmokBaiACQQJqLQAAOgAAIAFBm4kBaiACQQNqLQAAOgAAIAAgAUEEaiIBRw0ACwsgBkUNAANAIAFBmIkBaiAEIAFqLQAAOgAAIAFBAWohASAGQX9qIgYNAAsLC4cQARl/QQAoApSJASECQQAoApCJASEDQQAoAoyJASEEQQAoAoiJASEFA0AgACgCCCIGIAAoAhgiByAAKAIoIgggACgCOCIJIAAoAjwiCiAAKAIMIgsgACgCHCIMIAAoAiwiDSAMIAsgCiANIAkgCCAHIAMgBmogAiAAKAIEIg5qIAUgBCACIANzcSACc2ogACgCACIPakH4yKq7fWpBB3cgBGoiECAEIANzcSADc2pB1u6exn5qQQx3IBBqIhEgECAEc3EgBHNqQdvhgaECakERdyARaiISaiAAKAIUIhMgEWogACgCECIUIBBqIAQgC2ogEiARIBBzcSAQc2pB7p33jXxqQRZ3IBJqIhAgEiARc3EgEXNqQa+f8Kt/akEHdyAQaiIRIBAgEnNxIBJzakGqjJ+8BGpBDHcgEWoiEiARIBBzcSAQc2pBk4zBwXpqQRF3IBJqIhVqIAAoAiQiFiASaiAAKAIgIhcgEWogDCAQaiAVIBIgEXNxIBFzakGBqppqakEWdyAVaiIQIBUgEnNxIBJzakHYsYLMBmpBB3cgEGoiESAQIBVzcSAVc2pBr++T2nhqQQx3IBFqIhIgESAQc3EgEHNqQbG3fWpBEXcgEmoiFWogACgCNCIYIBJqIAAoAjAiGSARaiANIBBqIBUgEiARc3EgEXNqQb6v88p4akEWdyAVaiIQIBUgEnNxIBJzakGiosDcBmpBB3cgEGoiESAQIBVzcSAVc2pBk+PhbGpBDHcgEWoiFSARIBBzcSAQc2pBjofls3pqQRF3IBVqIhJqIAcgFWogDiARaiAKIBBqIBIgFSARc3EgEXNqQaGQ0M0EakEWdyASaiIQIBJzIBVxIBJzakHiyviwf2pBBXcgEGoiESAQcyAScSAQc2pBwOaCgnxqQQl3IBFqIhIgEXMgEHEgEXNqQdG0+bICakEOdyASaiIVaiAIIBJqIBMgEWogDyAQaiAVIBJzIBFxIBJzakGqj9vNfmpBFHcgFWoiECAVcyAScSAVc2pB3aC8sX1qQQV3IBBqIhEgEHMgFXEgEHNqQdOokBJqQQl3IBFqIhIgEXMgEHEgEXNqQYHNh8V9akEOdyASaiIVaiAJIBJqIBYgEWogFCAQaiAVIBJzIBFxIBJzakHI98++fmpBFHcgFWoiECAVcyAScSAVc2pB5puHjwJqQQV3IBBqIhEgEHMgFXEgEHNqQdaP3Jl8akEJdyARaiISIBFzIBBxIBFzakGHm9Smf2pBDncgEmoiFWogBiASaiAYIBFqIBcgEGogFSAScyARcSASc2pB7anoqgRqQRR3IBVqIhAgFXMgEnEgFXNqQYXSj896akEFdyAQaiIRIBBzIBVxIBBzakH4x75nakEJdyARaiISIBFzIBBxIBFzakHZhby7BmpBDncgEmoiFWogFyASaiATIBFqIBkgEGogFSAScyARcSASc2pBipmp6XhqQRR3IBVqIhAgFXMiFSASc2pBwvJoakEEdyAQaiIRIBVzakGB7ce7eGpBC3cgEWoiEiARcyIaIBBzakGiwvXsBmpBEHcgEmoiFWogFCASaiAOIBFqIAkgEGogFSAac2pBjPCUb2pBF3cgFWoiECAVcyIVIBJzakHE1PulempBBHcgEGoiESAVc2pBqZ/73gRqQQt3IBFqIhIgEXMiCSAQc2pB4JbttX9qQRB3IBJqIhVqIA8gEmogGCARaiAIIBBqIBUgCXNqQfD4/vV7akEXdyAVaiIQIBVzIhUgEnNqQcb97cQCakEEdyAQaiIRIBVzakH6z4TVfmpBC3cgEWoiEiARcyIIIBBzakGF4bynfWpBEHcgEmoiFWogGSASaiAWIBFqIAcgEGogFSAIc2pBhbqgJGpBF3cgFWoiESAVcyIQIBJzakG5oNPOfWpBBHcgEWoiEiAQc2pB5bPutn5qQQt3IBJqIhUgEnMiByARc2pB+PmJ/QFqQRB3IBVqIhBqIAwgFWogDyASaiAGIBFqIBAgB3NqQeWssaV8akEXdyAQaiIRIBVBf3NyIBBzakHExKShf2pBBncgEWoiEiAQQX9zciARc2pBl/+rmQRqQQp3IBJqIhAgEUF/c3IgEnNqQafH0Nx6akEPdyAQaiIVaiALIBBqIBkgEmogEyARaiAVIBJBf3NyIBBzakG5wM5kakEVdyAVaiIRIBBBf3NyIBVzakHDs+2qBmpBBncgEWoiECAVQX9zciARc2pBkpmz+HhqQQp3IBBqIhIgEUF/c3IgEHNqQf3ov39qQQ93IBJqIhVqIAogEmogFyAQaiAOIBFqIBUgEEF/c3IgEnNqQdG7kax4akEVdyAVaiIQIBJBf3NyIBVzakHP/KH9BmpBBncgEGoiESAVQX9zciAQc2pB4M2zcWpBCncgEWoiEiAQQX9zciARc2pBlIaFmHpqQQ93IBJqIhVqIA0gEmogFCARaiAYIBBqIBUgEUF/c3IgEnNqQaGjoPAEakEVdyAVaiIQIBJBf3NyIBVzakGC/c26f2pBBncgEGoiESAVQX9zciAQc2pBteTr6XtqQQp3IBFqIhIgEEF/c3IgEXNqQbul39YCakEPdyASaiIVIARqIBYgEGogFSARQX9zciASc2pBkaeb3H5qQRV3aiEEIBUgA2ohAyASIAJqIQIgESAFaiEFIABBwABqIQAgAUFAaiIBDQALQQAgAjYClIkBQQAgAzYCkIkBQQAgBDYCjIkBQQAgBTYCiIkBIAALyAMBBX9BACgCgIkBQT9xIgBBmIkBakGAAToAACAAQQFqIQECQAJAAkACQCAAQT9zIgJBB0sNACACRQ0BIAFBmIkBakEAOgAAIAJBAUYNASAAQZqJAWpBADoAACACQQJGDQEgAEGbiQFqQQA6AAAgAkEDRg0BIABBnIkBakEAOgAAIAJBBEYNASAAQZ2JAWpBADoAACACQQVGDQEgAEGeiQFqQQA6AAAgAkEGRg0BIABBn4kBakEAOgAADAELIAJBCEYNAkE2IABrIgMhBAJAIAJBA3EiAEUNAEEAIABrIQRBACEAA0AgAEHPiQFqQQA6AAAgBCAAQX9qIgBHDQALIAMgAGohBAsgA0EDSQ0CDAELQZiJAUHAABADGkEAIQFBNyEECyABQYCJAWohAEF/IQIDQCAAIARqQRVqQQA2AAAgAEF8aiEAIAQgAkEEaiICRw0ACwtBAEEAKAKEiQE2AtSJAUEAQQAoAoCJASIAQRV2OgDTiQFBACAAQQ12OgDSiQFBACAAQQV2OgDRiQFBACAAQQN0IgA6ANCJAUEAIAA2AoCJAUGYiQFBwAAQAxpBAEEAKQKIiQE3A4AJQQBBACkCkIkBNwOICQsGAEGAiQELMwBBAEL+uevF6Y6VmRA3ApCJAUEAQoHGlLqW8ermbzcCiIkBQQBCADcCgIkBIAAQAhAECwsLAQBBgAgLBJgAAAA=",zp="e6508e4b",Lp={name:Pp,data:Np,hash:zp};const Tp=new K;let jt=null;function Dp(t){if(jt===null)return ol(Tp,Lp,16).then(e=>(jt=e,jt.calculate(t)));try{const e=jt.calculate(t);return Promise.resolve(e)}catch(e){return Promise.reject(e)}}new K;new K;new K;new K;new K;new K;new K;new K;new K;new K;new K;new K;new K;new K;async function Tn(t){return(await Rp(t instanceof Uint8Array?t:new Uint8Array(t))).toUpperCase()}async function Sa(t,e){const n=await _p();n.init();const r=t.getReader();let a=0;try{for(;;){const{done:o,value:i}=await r.read();if(o)break;n.update(i),a+=i.length,e?.(a)}}finally{r.releaseLock()}return n.digest("hex").toUpperCase()}async function Dn(t){const e=await crypto.subtle.digest("SHA-1",t);return Array.from(new Uint8Array(e)).map(r=>r.toString(16).padStart(2,"0")).join("").toUpperCase()}async function xa(t){return(await Dp(new Uint8Array(t))).toUpperCase()}async function*Fp(t){yield{type:"crc32",value:await Tn(t)},yield{type:"md5",value:await xa(t)},yield{type:"sha1",value:await Dn(t)}}async function jp(t){const[e,n,r]=await Promise.all([Tn(t),xa(t),Dn(t)]);return{crc32:e,md5:n,sha1:r}}const sl=Object.freeze(Object.defineProperty({__proto__:null,calculateCRC32:Tn,calculateChecksums:jp,calculateMD5:xa,calculateSHA1:Dn,lazyChecksums:Fp,streamCRC32:Sa},Symbol.toStringTag,{value:"Module"})),ll=["case","background","title","snap","logo"],Fn="case";function cl(t){return ll.includes(t)}const Ea="global",Up=[...Ct,Ea];function qp(t){return t===Ea?void 0:t}const Ia=["png","jpg","jpeg","webp","gif","avif"];function Ca(t){const e=(t??"").split(/[?#]/)[0].split("/").pop()??"",n=e.lastIndexOf("."),r=n===-1?"":e.slice(n+1).toLowerCase();return Ia.includes(r)?r:void 0}function Gp(t){return Ca(t)!==void 0}function jn(t,e){const n=e.region?`.${e.region}`:"";return`${t}${n}.${e.kind}.${e.extension??"png"}`}function dl(t){const e=t.split(".");if(e.length<3)return;const n=e.pop().toLowerCase();if(!Ia.includes(n))return;const r=e.pop();if(!cl(r))return;const a=e.length>1&&lt(e[e.length-1])?e.pop():void 0,o=e.join(".");return o.length>0?{gameId:o,kind:r,region:a,extension:n}:void 0}const Oa=Object.freeze(Object.defineProperty({__proto__:null,COVER_KIND:Fn,GLOBAL_SCOPE:Ea,IMAGE_EXTENSIONS:Ia,MEDIA_KINDS:ll,MEDIA_SCOPES:Up,imageExtensionOf:Ca,isImageName:Gp,isMediaKind:cl,mediaFileNameOf:jn,parseMediaName:dl,regionOfScope:qp},Symbol.toStringTag,{value:"Module"})),Qp=`<!--
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
`,Hp={"../components/Icon.html":ie,"../lib/ROMMetadataService":nl,"../lib/RomLibraryService":ka,"../lib/ROMDatasetService":Ve,"../lib/ChecksumService":sl,"../helpers/rom-media":Oa,"../lib/ui-state":de},Wp="views/MetadataEditor.html";let fl;fl=new J(Qp,{modules:Hp,filename:Wp});const Vp=fl,Jp=new Set(["Argentina","Asia","Australia","Austria","Belgium","Brazil","Bulgaria","Canada","Chile","China","Croatia","Czech","Denmark","Estonia","Europe","Finland","France","Germany","Greece","Hong Kong","Hungary","India","Ireland","Israel","Italy","Japan","Korea","Latin America","Latvia","Lithuania","Mexico","Netherlands","New Zealand","Norway","Peru","Poland","Portugal","Romania","Russia","Scandinavia","Serbia","Singapore","Slovakia","Slovenia","South Africa","Spain","Sweden","Switzerland","Taiwan","Thailand","Turkey","UK","Ukraine","United Kingdom","Unknown","USA","World"]),Xp=new Set(["Beta","Proto","Prototype","Demo","Sample","Unl","Aftermarket","Pirate","Alt","Debug","Kiosk","Program","Test Program"]),Kp=new Set(["CON","PRN","AUX","NUL","COM1","COM2","COM3","COM4","COM5","COM6","COM7","COM8","COM9","LPT1","LPT2","LPT3","LPT4","LPT5","LPT6","LPT7","LPT8","LPT9"]),Uo=120,qo=24,Yp=/[&*/:`<>?\\|"]/g,Zp=/\b(XXX|XXIX|XXVIII|XXVII|XXVI|XXV|XXIV|XXIII|XXII|XXI|XX|XIX|XVIII|XVII|XVI|XV|XIV|XIII|XII|XI|X|IX|VIII|VII|VI|V|IV|III|II)\b/g,em={XXX:"30",XXIX:"29",XXVIII:"28",XXVII:"27",XXVI:"26",XXV:"25",XXIV:"24",XXIII:"23",XXII:"22",XXI:"21",XX:"20",XIX:"19",XVIII:"18",XVII:"17",XVI:"16",XV:"15",XIV:"14",XIII:"13",XII:"12",XI:"11",X:"10",IX:"9",VIII:"8",VII:"7",VI:"6",V:"5",IV:"4",III:"3",II:"2"};function Go(t){return t.replace(Zp,e=>em[e]??e)}function tm(t){return t.normalize("NFC").replace(Yp,"_")}function hl(t){const e=[];let n=t.length;for(;;){const r=t.slice(0,n).trimEnd(),a=r.length-1,o=r[a]===")"?"(":r[a]==="]"?"[":null;if(!o)break;const i=r.lastIndexOf(o,a);if(i<=0||!/\s/.test(r[i-1]))break;e.unshift(r.slice(i+1,a).trim()),n=i}return{title:t.slice(0,n).trim(),tags:e.filter(Boolean)}}function nm(t){return/^[A-Z][a-z](,[A-Z][a-z])*$/.test(t)?t.split(","):null}function rm(t){const e=t.split(", ");return e.every(n=>Jp.has(n))?e:null}function am(t){const e=t.match(/^Rev\s+([0-9A-Za-z.]+)$/);if(e)return`rev${e[1].replace(/\./g,"")}`;const n=t.match(/^v([0-9][0-9A-Za-z.]*)$/);return n?`v${n[1].replace(/\./g,"")}`:null}function om(t){const e=t.match(/^([A-Za-z][A-Za-z ]*?)(?:\s+(\d+))?$/);return!e||!Xp.has(e[1])?null:`${e[1].toLowerCase().replace(/ /g,"")}${e[2]??""}`}function ul(t){const e=t.match(/^Disc\s+(\d+)(?:\s+of\s+\d+)?$/i);return e?Number(e[1]):null}function Gr(t){const{title:e,tags:n}=hl(t),r={title:e,regions:[],languages:[],flags:[],extras:[],tags:n};for(const a of n){const o=rm(a);if(o&&r.regions.length===0){r.regions=o;continue}const i=nm(a);if(i&&r.languages.length===0){r.languages=i;continue}const s=am(a);if(s&&!r.revision){r.revision=s;continue}const l=ul(a);if(l!==null&&r.disc===void 0){r.disc=l;continue}const c=om(a);c?r.flags.push(c):r.extras.push(a)}return r}function ct(t){const{title:e}=hl(t);let n=tm(e).replace(/\s+/g," ").trim();if(n.length>Uo){const r=n.slice(0,Uo),a=r.lastIndexOf(" ");n=(a>0?r.slice(0,a):r).trim()}return n=n.replace(/[. ]+$/,""),Kp.has(n.toUpperCase())?`_${n}`:n||"_"}function pl(t){return t.crc.toUpperCase().slice(0,8)}function im(t){const e=t.toLowerCase().match(/[a-z0-9]+/g);if(!e)return"";let n="";for(const r of e){if(n.length+r.length>qo)break;n+=r}return n||e[0].slice(0,qo)}function ml(t,e={}){const n=[t.regions.length>0?t.regions.join("+"):"Unknown"];return t.revision&&n.push(t.revision),n.push(...t.flags),e.languages&&t.languages.length>0&&n.push(t.languages.join("+")),e.extras&&n.push(...t.extras.map(im).filter(Boolean)),e.checksum&&n.push(e.checksum),n.join("-")}function sm(t,e){return t.regions.length>0?t.regions:e.region?[e.region]:[]}function lm(t){return[t.title,...t.tags.filter(e=>ul(e)===null)].join("\0")}function cr(t,e){const n=new Map;for(const r of t){const a=ml({...r.parsed,regions:r.regions},e),o=n.get(a);o?o.push(r):n.set(a,[r])}return n}function cm(t){const e=new Map;for(const{parsed:r,game:a}of t){const o=lm(r),i=e.get(o);i?i.files.push(a):e.set(o,{parsed:r,regions:sm(r,a),files:[a]})}for(const r of e.values())r.files.sort((a,o)=>{const i=(Gr(a.name).disc??0)-(Gr(o.name).disc??0);return i!==0?i:(a.fileName??a.name).localeCompare(o.fileName??o.name)});const n=[];for(const r of cr(e.values(),{}).values()){const a=r.length>1;for(const o of cr(r,{languages:a}).values()){const i=o.length>1;for(const s of cr(o,{languages:a,extras:i}).values()){const l=s.length>1;for(const c of s)n.push({key:ml({...c.parsed,regions:c.regions},{languages:a,extras:i,checksum:l?pl(c.files[0]):void 0}),datRegions:c.regions,regions:bs(c.regions),videoStandards:ks(c.regions),languages:c.parsed.languages,revision:c.parsed.revision,flags:c.parsed.flags,files:c.files})}}}return n.sort((r,a)=>r.key.localeCompare(a.key))}function dm(t){const e=new Map;for(const r of t){const a=Gr(r.name),o=ct(r.name),i=Go(o).toLowerCase(),s=e.get(i);s?s.push({parsed:a,game:r}):e.set(i,[{parsed:a,game:r}])}const n=[];for(const[r,a]of e){const o=new Map;for(const s of a){const l=Go(s.parsed.title).toLowerCase(),c=o.get(l);c?c.push(s):o.set(l,[s])}const i=o.size>1;for(const[s,l]of o){const c=Array.from(new Set(l.map(h=>h.parsed.title))).sort(),d=c.find(h=>/\d/.test(h))??c[0],f=ct(d);n.push({id:i?`${f}-${pl(l[0].game)}`:f,title:d,variants:cm(l)})}}return n.sort((r,a)=>r.id.localeCompare(a.id))}const dr="game",gl=2;function fm(t,e){const n=e===!1?10:0,r=t.regions.length>1?gl+1:0;return n+r+(t.flags.length>0?1:0)}function yl(t){return ct(t.title)}function $a(t){return t.files.find(e=>e.cover)?.cover}function vl(t,e,n){const r=new Map;for(const[i,s]of Object.entries(e?.byRegion??{}))s&&lt(i)&&r.set(i,{url:s,rank:gl});for(const i of t.variants){const s=$a(i);if(!s)continue;const l=n?n.has(i.key):void 0,c=fm(i,l),d=i.regions.length>0?[...i.regions]:[dr];for(const f of d){const h=r.get(f);(!h||c<h.rank)&&r.set(f,{url:s,rank:c})}}const a={};for(const[i,{url:s}]of r)i!==dr&&(a[i]=s);const o=r.get(dr)?.url??e?.game;return o?{byRegion:a,game:o}:{byRegion:a}}function hm(t,e={}){const n=e.order??Ot,r=new Set(e.present??[]);if(e.variantUrl){const i=Object.entries(t.byRegion).find(([,c])=>c===e.variantUrl),s=e.variantRegion??(i&&lt(i[0])?i[0]:void 0),l=s&&e.stored?.byRegion[s]||e.stored?.game;return{url:e.variantUrl,file:l,region:s}}const a=i=>{const s=e.stored?.byRegion[i];if(s)return{url:t.byRegion[i],file:s,region:i};if(e.stored?.game)return{file:e.stored.game};const l=t.byRegion[i];return l?{url:l,region:i}:void 0};for(const i of n){const s=r.has(i)?a(i):void 0;if(s)return s}for(const i of n){const s=a(i);if(s)return s}const o=e.stored?.game;return o||t.game?{url:t.game,file:o}:void 0}function um(t,e){if(e.file||!e.url)return!1;const n=Object.values(t.byRegion).filter(Boolean);return n.length>1&&n.every(r=>r===e.url)}function Bt(t,e){return e.file?e.file:jn(t,{kind:Fn,region:e.region,extension:Ca(e.url)})}function wl(t,e){const n=new Set;return e&&n.add(Bt(t,e)),e?.file&&e.url&&n.add(Bt(t,{url:e.url,region:e.region})),n.add(jn(t,{kind:Fn})),[...n]}function bl(t){const e=Object.entries(t.byRegion).filter(([,n])=>!!n).map(([n,r])=>({url:r,region:n}));return t.game&&e.push({url:t.game}),e}function pm(t){if(!t)return"3 / 4";const e=t.toLowerCase();return e.includes("advance")||e.includes("gba")||e.includes("nintendo 64")||e.includes("n64")||e.includes("super nintendo")||e.includes("snes")||e.includes("super famicom")?"4 / 3":e.includes("game boy color")||e.includes("gbc")||e.includes("game boy")||e.includes("gamegear")||e.includes("game gear")||e.includes("playstation")||e.includes("ps1")||e.includes("psx")||e.includes("nintendo ds")||e.includes("3ds")?"1 / 1":"3 / 4"}const Ma=Object.freeze(Object.defineProperty({__proto__:null,coverFileNameOf:Bt,coverKeyOf:yl,coversOf:vl,isSharedCover:um,pickCover:hm,storableCoversOf:bl,storedCoverNamesOf:wl,systemAspectRatio:pm,variantCoverUrl:$a},Symbol.toStringTag,{value:"Module"}));function mm(t){if(t<1024)return`${t} B`;const e=["KB","MB","GB"];let n=t/1024,r=0;for(;n>=1024&&r<e.length-1;)n/=1024,r+=1;return`${n.toFixed(n<10?1:0)} ${e[r]}`}function gm(t){if(t===void 0)return"—";const e=typeof t=="number"?new Date(t):new Date(t);return Number.isNaN(e.getTime())?"—":e.toLocaleString()}const ym=Object.freeze(Object.defineProperty({__proto__:null,formatDate:gm,formatSize:mm},Symbol.toStringTag,{value:"Module"}));function kl(t){if(t.byteLength<512)return null;const e=new Uint8Array(t,0,512);if(!(e[0]===78&&e[1]===69&&e[2]===79))return null;const r=new DataView(t,0,512),a=e[4],o=e[5],i=r.getUint32(8,!0),s=r.getUint32(12,!0),l=r.getUint32(16,!0),c=r.getUint32(20,!0),d=r.getUint32(24,!0),f=i+s+l+c+d,h=512+f;return{validHeader:!0,version:a,system:o,pSize:i,sSize:s,mSize:l,vSize:c,cSize:d,totalDataSize:f,expectedFileSize:h}}function vm(t){const e=t.fileName.toLowerCase().endsWith(".neo"),n=t.fileName.toLowerCase().endsWith(".zip");let r=!1,a,o="";if(e)if(t.headerBuffer){const c=kl(t.headerBuffer);c?(a=c,t.fileSize!==void 0?(r=t.fileSize===c.expectedFileSize,o=r?`Valid .neo header (P: ${Ut(c.pSize)}, C: ${Ut(c.cSize)}, total: ${Ut(c.totalDataSize)})`:`Header/size mismatch (expected ${c.expectedFileSize} B, got ${t.fileSize} B)`):(r=!0,o=`Valid .neo header (total data ${Ut(c.totalDataSize)})`)):(r=!1,o="Invalid or missing .neo 512-byte header magic")}else r=(t.fileSize??0)>512,o=r?"Plausible .neo file size":"File size too small for .neo";else if(n){const c=(t.memberCrcs?.length??0)>0;r=c||(t.fileSize??0)>0,o=c?`Valid ZIP archive containing ${t.memberCrcs?.length} chip dumps`:"ZIP archive structure detected"}else r=(t.fileSize??0)>0,o="Generic ROM file";const i=!!t.datMatch;let s="unverified",l="Unverified";return r&&i?(s="verified",l=e?"Verified (DAT + Header)":"Verified (DAT + ZIP)"):r&&!i?(s="structurally_valid",l=e?"Valid Structure (Custom DAT)":"Valid Archive (Custom DAT)"):r||(s="incomplete",l="Incomplete / Corrupted"),{status:s,structureValid:r,datVerified:i,statusLabel:l,details:o,header:a}}function Ut(t){return t>=1024*1024?`${(t/(1024*1024)).toFixed(1)} MiB`:t>=1024?`${(t/1024).toFixed(0)} KiB`:`${t} B`}const wm=Object.freeze(Object.defineProperty({__proto__:null,parseNeoGeoHeader:kl,validateNeoGeoVariant:vm},Symbol.toStringTag,{value:"Module"})),Ba=1;function Ra(t){return t.normalize("NFKD").toLowerCase().replace(/\+/g," plus ").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"rom"}const Al=t=>Ra(ct(t)),bm=t=>{const e=t.slice(t.lastIndexOf("/")+1),n=e.lastIndexOf(".");return n>0?e.slice(0,n):e},Sl=(t,e)=>`.meta/${t}/mods/${e}`;function xl(t,e,n,r=new Date){const a={},o=(s,l)=>a[s]??={title:l,versions:[],mods:[]};for(const s of e.groups){const l=s.variants.filter(f=>f.files.some(h=>h.local));if(l.length===0)continue;const c=Al(s.group.variants[0]?.files[0]?.name??s.group.title),d=o(c,s.group.title);for(const{variant:f,status:h,files:y}of l){const u=y.flatMap(S=>S.local?[S.local]:[]),g=u[0];d.versions.push({path:g.path,...u.length>1?{files:u.map(S=>S.path)}:{},crc:g.crc32.toUpperCase(),size:g.size,variant:f.key,regions:[...f.regions],...f.revision?{revision:f.revision}:{},verified:h==="complete"})}}for(const s of e.unmatched){const l=ct(bm(s.path));o(Ra(l),l).versions.push({path:s.path,crc:s.crc32.toUpperCase(),size:s.size,regions:[],verified:!1})}_a({system:t,games:a},n);const i={};for(const s of Object.keys(a).sort())i[s]=a[s];return{version:Ba,system:t,generatedAt:r.toISOString(),games:i}}function _a(t,e){for(const n of Object.values(t.games))n.mods=[];for(const n of e){if(!n.gameId)continue;const r=t.games[n.gameId]??={title:n.gameId,versions:[],mods:[]},a=r.versions.find(o=>o.crc===n.sourceCrc)?.crc;r.mods.push({sha1:n.sha1,name:n.name,format:n.format,path:Sl(t.system,n.file),...n.sourceCrc?{sourceCrc:n.sourceCrc}:{},...n.targetCrc?{targetCrc:n.targetCrc}:{},...a?{fits:a}:{}})}for(const[n,r]of Object.entries(t.games))r.versions.length===0&&r.mods.length===0&&delete t.games[n]}function Pa(t,e){const n=e.toUpperCase();for(const r of t)for(const[a,o]of Object.entries(r.games))if(o.versions.some(i=>i.crc===n))return{system:r.system,gameId:a}}function km(t,e){return t.sourceCrc?e.some(n=>n.crc.toUpperCase()===t.sourceCrc)?"fits":"other":"unknown"}function El(t){if(!t||typeof t!="object")return;const e=t;if(!(e.version!==Ba||typeof e.system!="string")&&!(!e.games||typeof e.games!="object"))return e}const Na=Object.freeze(Object.defineProperty({__proto__:null,LIBRARY_INDEX_VERSION:Ba,attachMods:_a,buildLibraryIndex:xl,gameIdOf:Al,modFit:km,modPathOf:Sl,ownerOfCrc:Pa,parseLibraryIndex:El,slugOf:Ra},Symbol.toStringTag,{value:"Module"})),Am=`<!--
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
`,Sm={"../components/Icon.html":ie,"../components/PromptModal.html":Ks,"../components/ConfirmModal.html":Ln,"../helpers/library-index":Na,"../lib/ui-state":de},xm="views/GameMods.html";let Il;Il=new J(Am,{modules:Sm,filename:xm});const Em=Il,Cl="play.germade",Im=Cl==="play.germade",Cm="/",Ol=Object.freeze(Object.defineProperty({__proto__:null,HOST:Cl,LAUNCHER_BASE:Cm,isPlayGermade:Im},Symbol.toStringTag,{value:"Module"})),Om={MegaDrive:"megadrive",SNES:"snes",GBA:"gba",GAMEBOY:"gba",GBC:"gba",NEOGEO:"neogeo"};function $l(t){return Om[t]}function $m({system:t,gameId:e,crc:n,patch:r},a="/"){const o=$l(t);if(!o)return;const i=new URLSearchParams({system:t,game:e,version:n.toLowerCase()});return r&&i.set("patch",r.slice(0,8).toLowerCase()),`${a}${o}/?${i}`}const Mm=Object.freeze(Object.defineProperty({__proto__:null,launcherRouteOf:$l,playUrl:$m},Symbol.toStringTag,{value:"Module"})),Bm=`<!--
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
`,Rm={"../components/Icon.html":ie,"./SystemDetails.html":mp,"./MetadataEditor.html":Vp,"../lib/RomLibraryService":ka,"../lib/ui-state":de,"../helpers/rom-covers":Ma,"../lib/ChecksumService":sl,"../helpers/format":ym,"../components/ConfirmModal.html":Ln,"../lib/ROMMetadataService":nl,"../helpers/neogeo-validator":wm,"./GameMods.html":Em,"../lib/host":Ol,"../helpers/launcher":Mm,"../helpers/library-index":Na},_m="views/RomDetails.html";let ke;ke=new J(Bm,{modules:Rm,filename:_m});const Pm=ke;ke.CoverFigure;ke.ChecksumRow;ke.RomFileView;ke.RomInfoView;ke.VariantRow;ke.GameView;ke.RomBatchEditor;ke.RomSelectionView;const Nm=["systems","games","game"];function zm(t){const e=new URLSearchParams(t),n=e.get("system")||void 0,r=n&&e.get("game")||void 0;return{system:n,game:r}}function Lm(t,e){const n=new URLSearchParams(t);n.delete("system"),n.delete("game"),e.system&&n.set("system",e.system),e.system&&e.game&&n.set("game",e.game);const r=n.toString();return r?`?${r}`:""}function Tm(t){return t.game?"game":t.system?"games":"systems"}const Dm=Object.freeze(Object.defineProperty({__proto__:null,PANELS:Nm,panelOf:Tm,readPanelState:zm,writePanelState:Lm},Symbol.toStringTag,{value:"Module"})),Fm=`<!--
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
`,jm={"../components/Icon.html":ie,"../components/SystemLogo.html":zn,"../helpers/mobile-panels":Dm,"../helpers/system-info":Aa,"../helpers/rom-covers":Ma,"../lib/ui-state":de},Um="views/MobilePanels.html";let Ml;Ml=new J(Fm,{modules:jm,filename:Um});const qm=Ml;function Qo(){return globalThis.navigator?.storage??null}const Gm={async status(){const t=Qo(),e=await t?.estimate?.().catch(()=>{}),n=t?.persisted?await t.persisted().catch(()=>null):null;return{usage:typeof e?.usage=="number"?e.usage:null,quota:typeof e?.quota=="number"?e.quota:null,persistent:n}},async persist(){const t=Qo();return t?.persist?t.persisted&&await t.persisted().catch(()=>!1)?!0:t.persist().catch(()=>!1):!1}};function Qm(t,e){const n=["B","KB","MB","GB","TB"];let r=t,a=0;for(;r>=1024&&a<n.length-1;)r/=1024,a++;const o=a===0||r>=100?0:1;return`${r.toLocaleString(e,{maximumFractionDigits:o})} ${n[a]}`}const Bl=Object.freeze(Object.defineProperty({__proto__:null,LibraryStorageService:Gm,formatBytes:Qm},Symbol.toStringTag,{value:"Module"})),Hm=`<!--
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
`,Wm={"../components/Icon.html":ie,"../helpers/theme":lu,"../helpers/i18n":tu,"../lib/LibraryStorageService":Bl,"../helpers/rom-regions":Ss,"../lib/ui-state":de},Vm="views/PreferencesModal.html";let Rl;Rl=new J(Hm,{modules:Wm,filename:Vm});const Jm=Rl,Xm="modulepreload",Km=function(t){return"/roms/"+t},Ho={},_e=function(e,n,r){let a=Promise.resolve();if(n&&n.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),s=i?.nonce||i?.getAttribute("nonce");a=Promise.allSettled(n.map(l=>{if(l=Km(l),l in Ho)return;Ho[l]=!0;const c=l.endsWith(".css"),d=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${d}`))return;const f=document.createElement("link");if(f.rel=c?"stylesheet":Xm,c||(f.as="script"),f.crossOrigin="",f.href=l,s&&f.setAttribute("nonce",s),document.head.appendChild(f),c)return new Promise((h,y)=>{f.addEventListener("load",h),f.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${l}`)))})}))}function o(i){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=i,window.dispatchEvent(s),!s.defaultPrevented)throw i}return a.then(i=>{for(const s of i||[])s.status==="rejected"&&o(s.reason);return e().catch(o)})},_l={nes:["NES"],unh:["NES"],unf:["NES"],unif:["NES"],fds:["NES"],sfc:["SNES"],smc:["SNES"],swc:["SNES"],fig:["SNES"],gb:["GAMEBOY"],gbc:["GBC"],gba:["GBA"],z64:["N64"],n64:["N64"],v64:["N64"],min:["PokemonMini"],sms:["SMS","GameGear"],gg:["GameGear"],md:["MegaDrive"],gen:["MegaDrive"],smd:["MegaDrive"],"32x":["S32X"],pce:["TGFX16"],sgx:["TGFX16"],a26:["Atari2600"],a52:["ATARI5200"],a78:["ATARI7800"],lnx:["AtariLynx"],lyx:["AtariLynx"],ws:["WonderSwan"],wsc:["WonderSwanColor"],neo:["NEOGEO"],zip:["NEOGEO"],bin:["MegaDrive","Atari2600","ATARI7800","ATARI5200","S32X","PSX","Saturn","MegaCD","TGFX16-CD","NeoGeo-CD"]};Object.keys(_l).filter(t=>t!=="zip");const Ym=100*1024*1024;function Zm(t){const e=t.split(/[/\\]/).pop()??"",n=e.lastIndexOf(".");return n<=0?"":e.slice(n+1).toLowerCase()}function Wo(t,e){const n=_l[Zm(t.name)]??[],r=new Map(e.map(a=>[a.system,a]));return n.map(a=>r.get(a)).filter(a=>a!==void 0&&(a.media==="disc"||t.size<=Ym))}function eg(t,e,n){const r=e.toUpperCase();for(const a of t)for(const o of a.variants)for(const i of o.files)if(i.crc.toUpperCase()===r&&!(i.size!==void 0&&i.size!==n))return{group:a,variant:o,entry:i}}function tg(t,e,n,r){return e==="disc"?`${t}/${n.id}/${r.key}`:t}function ng(t){const e=new Set(t.filter(n=>n.media==="disc").map(n=>n.folder));return e.size===1?[...e][0]:void 0}const Pl=0,za=8,Nl=101010256,rg=117853008,ag=33639248,zl=67324752,Kt=22,Vo=46,kn=30,kt=4294967295,og=65535,ig=1,Ll=Kt+65535;function Tl(t){if(t.length<4)return!1;const e=Un(t).getUint32(0,!0);return e===zl||e===Nl}function Un(t){return new DataView(t.buffer,t.byteOffset,t.byteLength)}function Dl(t){if(t.length<Kt)return;const e=Un(t);for(let n=t.length-Kt;n>=0;n-=1){if(e.getUint32(n,!0)!==Nl||e.getUint16(n+20,!0)!==t.length-n-Kt)continue;if(e.getUint16(n+4,!0)!==0||e.getUint16(n+6,!0)!==0)return;const r=e.getUint16(n+10,!0),a=e.getUint32(n+12,!0),o=e.getUint32(n+16,!0);return{count:r,size:a,offset:o,zip64:r===og||a===kt||o===kt||sg(e,n)}}}function sg(t,e){const n=e-20;return n>=0&&t.getUint32(n,!0)===rg}function Fl(t,e){const n=[],r=Un(t);let a=0;for(;n.length<e&&a+Vo<=t.length&&r.getUint32(a,!0)===ag;){const o=r.getUint16(a+8,!0),i=r.getUint16(a+28,!0),s=r.getUint16(a+30,!0),l=r.getUint16(a+32,!0),c=r.getUint32(a+20,!0),d=r.getUint32(a+24,!0),f=r.getUint32(a+42,!0),h=a+Vo;if(h+i>t.length)break;const y=lg(t.subarray(h,h+i));n.push({name:y,crc32:r.getUint32(a+16,!0).toString(16).padStart(8,"0").toUpperCase(),size:d,compressedSize:c,method:r.getUint16(a+10,!0),offset:f,directory:y.endsWith("/"),encrypted:(o&ig)!==0,zip64:d===kt||c===kt||f===kt}),a=h+i+s+l}return n}function lg(t){return new TextDecoder().decode(t)}function jl(t){if(t.length<kn)return;const e=Un(t);if(e.getUint32(0,!0)===zl)return kn+e.getUint16(26,!0)+e.getUint16(28,!0)}function Yt(t){if(t.zip64)return"zip64";if(t.encrypted)return"encrypted";if(t.method!==Pl&&t.method!==za)return"method"}const cg=Object.freeze(Object.defineProperty({__proto__:null,LOCAL_HEADER_SIZE:kn,ZIP_DEFLATED:za,ZIP_STORED:Pl,ZIP_TAIL_LIMIT:Ll,dataOffsetOf:jl,findCentralDirectory:Dl,isZipHeader:Tl,readCentralDirectory:Fl,refusalOf:Yt},Symbol.toStringTag,{value:"Module"}));async function dg(t){return t.size<4?!1:Tl(new Uint8Array(await t.slice(0,4).arrayBuffer()))}async function fg(t){const e=new Uint8Array(await t.slice(Math.max(0,t.size-Ll)).arrayBuffer()),n=Dl(e);if(!n)return{refused:"damaged"};if(n.zip64)return{refused:"zip64"};const r=new Uint8Array(await t.slice(n.offset,n.offset+n.size).arrayBuffer()),a=Fl(r,n.count);return a.length===0&&n.count>0?{refused:"damaged"}:{entries:a}}async function hg(t,e){const n=new Uint8Array(await t.slice(e.offset,e.offset+kn).arrayBuffer()),r=jl(n);if(r===void 0)throw new Error(`El archivo no tiene los datos de ${e.name}`);const a=t.slice(e.offset+r,e.offset+r+e.compressedSize),o=e.method===za?await ug(a.stream().pipeThrough(new DecompressionStream("deflate-raw"))):new Uint8Array(await a.arrayBuffer());if(await Tn(o)!==e.crc32.toUpperCase())throw new Error(`El contenido de ${e.name} no es el que el archivo declaraba`);return o}async function ug(t){const e=[],n=t.getReader();let r=0;try{for(;;){const{done:i,value:s}=await n.read();if(i)break;e.push(s),r+=s.length}}finally{n.releaseLock()}const a=new Uint8Array(r);let o=0;for(const i of e)a.set(i,o),o+=i.length;return a}const Ul=1,Qr="game.json";function An(t){return`${V}/${t}/scan.json`}function pg(t){if(!t||typeof t!="object")return!1;const e=t;return typeof e.size=="number"&&typeof e.mtime=="number"&&typeof e.crc32=="string"&&/^[A-Fa-f0-9]{8}$/.test(e.crc32)}async function mg(t,e){const n=new Map;let r;try{r=JSON.parse(new TextDecoder().decode(await t.readFile(An(e))))}catch{return n}if(!r||typeof r!="object")return n;const a=r;if(a.version!==Ul||!a.entries||typeof a.entries!="object")return n;for(const[o,i]of Object.entries(a.entries))pg(i)&&n.set(o,i);return n}async function gg(t,e,n){const r={version:Ul,entries:Object.fromEntries(n)};await t.createDirectory(`${V}/${e}`),await t.writeFile(An(e),new TextEncoder().encode(JSON.stringify(r)))}async function yg(t,e,n){let r;try{r=await t.list(e)}catch{return[]}const a=[];for(const o of r){if(o.kind==="file"){a.push(o);continue}if(n!=="cartridge"&&await t.exists(`${o.path}/${Qr}`))for await(const i of t.walkFiles(o.path))i.name!==Qr&&a.push(i)}return a}async function vg(t,e,n,r){const a=await yg(t,e,n),o=await mg(t,e),i=new Map,s=[];let l=0;for(const d of a){const f=await t.stat(d.path);if(!f)continue;const h=o.get(d.path),y=h&&h.size===f.size&&h.mtime===f.mtime;let u;if(y)u=h.crc32;else if(d.name.toLowerCase().endsWith(".zip")||d.name.toLowerCase().endsWith(".7z"))try{const{findCentralDirectory:g,readCentralDirectory:S}=await _e(async()=>{const{findCentralDirectory:A,readCentralDirectory:P}=await Promise.resolve().then(()=>cg);return{findCentralDirectory:A,readCentralDirectory:P}},[]),{ROMDatasetService:v}=await _e(async()=>{const{ROMDatasetService:A}=await Promise.resolve().then(()=>Ve);return{ROMDatasetService:A}},void 0),p=await t.readFile(d.path),w=g(p);if(w){const P=S(p.subarray(w.offset,w.offset+w.size),w.count).filter(C=>!C.directory&&!!C.crc32).map(C=>C.crc32.toUpperCase());if(P.length>0){const C=await v.lookupSetByMemberCrcs([e],P);C&&(u=C.crc??C.setKey)}}}catch{}u??=await Sa(await t.readStream(d.path)),i.set(d.path,{size:f.size,mtime:f.mtime,crc32:u}),s.push({path:d.path,size:f.size,crc32:u}),l+=1,r?.({path:d.path,done:l,total:a.length,hashed:!y})}return i.size===o.size&&[...i].every(([d,f])=>o.get(d)?.crc32===f.crc32)||await gg(t,e,i),s}function wg(t){const e=t.lastIndexOf(".");return e<=0?"":t.slice(e+1)}function qn(t,e,n,r,a){if(e==="disc")return`${t}/${n.id}/${r.key}/${a}`;const o=wg(a),i=`${t}/${n.id}.${r.key}`;return o?`${i}.${o}`:i}function bg(t,e,n,r,a,o){return t===qn(e,n,r,a,o)}function ql(t,e,n){const r=[],a=[],o=[],i=new Set(n.unmatched.map(f=>f.path));let s=0;for(const f of n.groups){let h=!1;for(const y of f.variants)for(const u of y.files){if(!u.local)continue;h=!0,i.add(u.local.path);const g=qn(t,e,f.group,y.variant,u.entry.fileName??u.entry.name);u.local.path===g?s+=1:r.push({from:u.local.path,to:g})}h&&e==="disc"&&a.push({path:`${t}/${f.group.id}/game.json`,gameId:f.group.id,title:f.group.title,system:t})}const l=new Map;for(const f of r){const h=l.get(f.to);h?h.push(f):l.set(f.to,[f])}const c=[];for(const[f,h]of l){if(h.length===1&&!kg(f,i,r)){c.push(h[0]);continue}const y=h.length>1?"duplicate-target":"target-taken";for(const u of h)o.push({reason:y,from:u.from,to:u.to})}return{moves:Ag(c,i,o),markers:a,conflicts:o,settled:s}}function kg(t,e,n){return e.has(t)&&!n.some(r=>r.from===t)}function Ag(t,e,n){const r=[];let a=t;for(;a.length>0;){const o=[];for(const i of a){if(e.has(i.to)){o.push(i);continue}e.delete(i.from),e.add(i.to),r.push(i)}if(o.length===a.length){for(const i of o)n.push({reason:"cycle",from:i.from,to:i.to});break}a=o}return r}function Sg(t,e){const n=i=>i===e||i.startsWith(`${e}/`),r=t.moves.filter(i=>n(i.from)),a=t.conflicts.filter(i=>n(i.from)||n(i.to)),o=t.markers.filter(i=>r.some(s=>s.to===i.path||i.gameId&&s.to.includes(i.gameId)||s.to.startsWith(i.path.replace(/\/game\.json$/,""))));return{moves:r,markers:o,conflicts:a,settled:r.length===0&&a.length===0?1:0}}const xg=Object.freeze(Object.defineProperty({__proto__:null,filterPlanForPath:Sg,isConsolidatedPath:bg,planOrganization:ql,targetOf:qn},Symbol.toStringTag,{value:"Module"})),Jo=1,La=`${V}/undo`,Eg=new TextEncoder,Ig=new TextDecoder;function fr(t){return`${La}/${t}.json`}function nt(t){const e=t.lastIndexOf("/");return e===-1?"":t.slice(0,e)}async function Ee(t,e,n){if(e===""||n.has(e))return;const r=nt(e);r&&await Ee(t,r,n);try{await t.createDirectory(e)}catch{}n.add(e)}async function hr(t,e,n){await t.createDirectory(nt(e)).catch(()=>{}),await t.writeFile(e,Eg.encode(JSON.stringify(n,null,2)))}class Cg{static async plan(e,n,r){const{ROMDatasetService:a}=await _e(async()=>{const{ROMDatasetService:l}=await Promise.resolve().then(()=>Ve);return{ROMDatasetService:l}},void 0),{GameCatalogService:o}=await _e(async()=>{const{GameCatalogService:l}=await Promise.resolve().then(()=>ja);return{GameCatalogService:l}},void 0),i=await a.mediaOf(n);if(!i)throw new Error(`No dataset available for system: ${n}`);const s=await o.load(e,n,l=>{r?.(l.done,l.total)});return ql(n,i,s)}static async apply(e,n,r,a){const o=new Date().toISOString().replace(/[:.]/g,"-"),i={version:Jo,id:o,system:n,createdAt:new Date().toISOString(),moves:r.moves,markers:[]};await hr(e,fr(o),i);const s=new Set,l=[],c=r.moves.length+r.markers.length;for(const d of r.moves){await Ee(e,nt(d.to),s),await e.move(d.from,d.to),l.push(d);const f=rt(d.from),h=rt(d.to);f!==h&&await e.exists(f)&&(await Ee(e,nt(h),s),await e.move(f,h),l.push({from:f,to:h})),a?.(l.length,c)}for(const d of r.markers)await e.exists(d.path)||(await Ee(e,nt(d.path),s),await hr(e,d.path,{gameId:d.gameId,title:d.title,system:d.system}),i.markers.push(d.path));return i.moves=l,await hr(e,fr(o),i),await e.remove(An(n)).catch(()=>{}),a?.(c,c),i}static async list(e){let n;try{n=await e.list(La)}catch{return[]}const r=[];for(const a of n)if(!(a.kind!=="file"||!a.name.endsWith(".json")))try{const o=JSON.parse(Ig.decode(await e.readFile(a.path)));o.version===Jo&&Array.isArray(o.moves)&&r.push(o)}catch{}return r.sort((a,o)=>o.id.localeCompare(a.id))}static async undo(e,n){const r=new Set;for(const a of n.markers)await e.remove(a).catch(()=>{});for(let a=n.moves.length-1;a>=0;a-=1){const o=n.moves[a];!await e.exists(o.to)||await e.exists(o.from)||(await Ee(e,nt(o.from),r),await e.move(o.to,o.from))}await e.remove(An(n.system)).catch(()=>{}),await e.remove(fr(n.id)).catch(()=>{})}}const Og=Object.freeze(Object.defineProperty({__proto__:null,OrganizeService:Cg,UNDO_DIR:La,ensureDir:Ee},Symbol.toStringTag,{value:"Module"}));function dt(t){return t.path!==void 0&&!t.taken&&!t.refused}function Hr(t){return t.source.kind==="file"?t.source.file:t.source.archive}function Ta(t,e){return e.filter(n=>Hr(n)===t)}function $g(t,e){const n=Ta(t,e),r=n.find(a=>a.match&&a.path);if(r)return{match:r.match,path:r.path,pending:n.filter(dt)}}function Mg(t,e,n){const r=n.filter(s=>e.has(Hr(s))&&dt(s)),a=new Set(r.filter(s=>s.match).map(s=>Sn(s.path))),o=n.filter(s=>s.source.kind==="file"&&!s.match&&!e.has(s.source.file)&&dt(s)&&a.has(Sn(s.path))),i=new Set(o.map(Hr));return{copied:t.filter(s=>!e.has(s)&&!i.has(s)),intake:[...r,...o],along:o}}function Sn(t){const e=t.lastIndexOf("/");return e===-1?"":t.slice(0,e)}function Bg(t){return t.slice(t.lastIndexOf("/")+1)}class Wr{static async identify(e,n,r){const{ROMDatasetService:a}=await _e(async()=>{const{ROMDatasetService:l}=await Promise.resolve().then(()=>Ve);return{ROMDatasetService:l}},void 0),o=await a.listSystems(),i=await this.unpack(n,o),s=i.length;for(const[l,c]of i.entries()){if(c.refused||c.match)continue;const d=Wo(c,o);if(d.length===0)continue;if(!c.crc32&&c.source.kind==="file"){const h=y=>r?.({file:c.name,read:y,size:c.size,done:l,total:s});h(0),c.crc32=await Sa(c.source.file.stream(),h)}if(!c.crc32)continue;const f=await this.release(d,c.crc32,c.size);c.match=f?.match,c.path=f?`${f.folder}/${c.name}`:void 0}return this.settle(e,i)}static async unpack(e,n){const{ROMDatasetService:r}=await _e(async()=>{const{ROMDatasetService:o}=await Promise.resolve().then(()=>Ve);return{ROMDatasetService:o}},void 0),a=[];for(const o of e){const i={kind:"file",file:o};if(!await dg(o)){a.push({name:o.name,size:o.size,source:i});continue}const s=await fg(o).catch(()=>({refused:"damaged"}));if("refused"in s){a.push({name:o.name,size:o.size,source:i,refused:s.refused});continue}const l=s.entries.filter(c=>!c.directory&&!Yt(c)&&!!c.crc32).map(c=>c.crc32);if(l.length>0&&n&&n.length>0){const c=Wo({name:o.name,size:o.size},n);if(c.length>0){const d=await r.lookupSetByMemberCrcs(c.map(f=>f.system),l);if(d){a.push({name:o.name,size:o.size,source:i,crc32:d.setKey,match:{system:d.system,media:d.media,gameId:d.title,title:d.title,variant:d.setKey},path:`${d.system}/${o.name}`});continue}}}for(const c of s.entries)c.directory||a.push({name:Bg(c.name),size:c.size,source:{kind:"entry",archive:o,entry:c},archive:o.name,crc32:Yt(c)?void 0:c.crc32,refused:Yt(c)})}return a}static async release(e,n,r){const{GameCatalogService:a}=await _e(async()=>{const{GameCatalogService:o}=await Promise.resolve().then(()=>ja);return{GameCatalogService:o}},void 0);for(const{system:o,media:i}of e){let s;try{s=await a.catalogueOf(o)}catch{continue}const l=eg(s,n,r);if(l)return{match:{system:o,media:i,gameId:l.group.id,title:l.group.title,variant:l.variant.key},folder:tg(o,i,l.group,l.variant)}}}static async settle(e,n){const r=ng(n.flatMap(a=>a.match&&a.path?[{media:a.match.media,folder:Sn(a.path)}]:[]));for(const a of n)a.refused||(!a.path&&r&&(a.path=`${r}/${a.name}`),a.path&&(a.taken=await e.exists(a.path)));return n}static async apply(e,n,r){const a=n.filter(dt),o=new Set,i=[];for(const s of a){r?.({file:s.name,done:i.length,total:a.length});const l=s.source.kind==="file"?new Uint8Array(await s.source.file.arrayBuffer()):await hg(s.source.archive,s.source.entry);await Ee(e,Sn(s.path),o),await e.writeFile(s.path,l),i.push(s.path),s.match&&(await this.saveRecord(e,s,o),s.match.media==="disc"&&await this.mark(e,s.match,o))}return i}static async mark(e,n,r){const a=`${n.system}/${n.gameId}`,o=`${a}/${Qr}`;await e.exists(o)||(await Ee(e,a,r),await e.writeFile(o,new TextEncoder().encode(JSON.stringify({gameId:n.gameId,title:n.title,system:n.system},null,2))))}static async saveRecord(e,n,r){if(!n.match||!n.path)return;await Ee(e,Rn(n.path),r);const a=new ba(e);if(await a.read(n.path))return;const i=new Date().toISOString();let s=null;if(n.crc32)try{const{ROMDatasetService:c}=await _e(async()=>{const{ROMDatasetService:d}=await Promise.resolve().then(()=>Ve);return{ROMDatasetService:d}},void 0);s=await c.lookupByCrc(n.crc32)}catch{}const l={version:1,id:n.match.gameId,title:s?.name||n.match.title,description:s?.description,region:s?.region,videoStandard:s?.videoStandard,cover:s?.cover,crc32:n.crc32,addedAt:i,updatedAt:i};await a.write(n.path,l)}}const Da=Object.freeze(Object.defineProperty({__proto__:null,RomIntakeService:Wr,isPlaced:dt,itemsOf:Ta,offerOf:$g,splitDrop:Mg},Symbol.toStringTag,{value:"Module"})),Rg=`<!--
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
`,_g={"../components/Icon.html":ie,"../helpers/rom-media":Oa,"../lib/RomIntakeService":Da,"../helpers/tree":Zs,"../lib/ui-state":de},Pg="views/MediaDropModal.html";let Gl;Gl=new J(Rg,{modules:_g,filename:Pg});const Ng=Gl,zg=`<!--
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
`,Lg={"../components/Icon.html":ie,"../lib/RomIntakeService":Da,"../lib/ui-state":de},Tg="views/RomIntakeModal.html";let Ql;Ql=new J(zg,{modules:Lg,filename:Tg});const Dg=Ql,Fg=`<!--
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
`,jg={"../components/Icon.html":ie,"../lib/ui-state":de},Ug="views/OrganizePanel.html";let Hl;Hl=new J(Fg,{modules:jg,filename:Ug});const qg=Hl;var Gg=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),Qg=new Uint32Array([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),me=64;function ge(t,e){return t>>>e|t<<32-e}var Wl=class{state=Qg.slice();block=new Uint8Array(me);view=new DataView(this.block.buffer);words=new Uint32Array(64);buffered=0;total=0;hex=null;update(t){if(this.hex)throw new Error("Sha256: update() after digest()");this.total+=t.byteLength;let e=0;if(this.buffered>0){const n=Math.min(me-this.buffered,t.byteLength);this.block.set(t.subarray(0,n),this.buffered),this.buffered+=n,e=n,this.buffered===me&&(this.compress(this.view,0),this.buffered=0)}if(e+me<=t.byteLength){const n=new DataView(t.buffer,t.byteOffset,t.byteLength);for(;e+me<=t.byteLength;e+=me)this.compress(n,e)}return e<t.byteLength&&(this.block.set(t.subarray(e),0),this.buffered=t.byteLength-e),this}digest(){if(this.hex)return this.hex;const t=this.total*8;this.block[this.buffered++]=128,this.buffered>me-8&&(this.block.fill(0,this.buffered),this.compress(this.view,0),this.buffered=0),this.block.fill(0,this.buffered,me-8),this.view.setUint32(me-8,Math.floor(t/4294967296),!1),this.view.setUint32(me-4,t>>>0,!1),this.compress(this.view,0);let e="";for(let n=0;n<8;n++)e+=(this.state[n]>>>0).toString(16).padStart(8,"0");return this.hex=e,e}compress(t,e){const n=this.words;for(let h=0;h<16;h++)n[h]=t.getUint32(e+h*4,!1);for(let h=16;h<64;h++){const y=n[h-15],u=n[h-2],g=ge(y,7)^ge(y,18)^y>>>3,S=ge(u,17)^ge(u,19)^u>>>10;n[h]=n[h-16]+g+n[h-7]+S|0}const r=this.state;let a=r[0],o=r[1],i=r[2],s=r[3],l=r[4],c=r[5],d=r[6],f=r[7];for(let h=0;h<64;h++){const y=ge(l,6)^ge(l,11)^ge(l,25),u=l&c^~l&d,g=f+y+u+Gg[h]+n[h]|0,S=ge(a,2)^ge(a,13)^ge(a,22),v=a&o^a&i^o&i,p=S+v|0;f=d,d=c,c=l,l=s+g|0,s=i,i=o,o=a,a=g+p|0}r[0]=a+r[0]|0,r[1]=o+r[1]|0,r[2]=i+r[2]|0,r[3]=s+r[3]|0,r[4]=l+r[4]|0,r[5]=c+r[5]|0,r[6]=d+r[6]|0,r[7]=f+r[7]|0}},Vl=Array.from({length:256},(t,e)=>e.toString(16).padStart(2,"0"));function Hg(t){const e=new Uint8Array(t);let n="";for(let r=0;r<e.length;r++)n+=Vl[e[r]];return n}function Wg(){const t=globalThis.crypto;if(!t?.subtle)throw new Error("vfs-sync requires Web Crypto (globalThis.crypto.subtle). In browsers this means a secure context (https or localhost).");return t.subtle}async function Rt(t){const e=t.buffer.slice(t.byteOffset,t.byteOffset+t.byteLength);return Hg(await Wg().digest("SHA-256",e))}function Xe(t){if(t===null||typeof t!="object")return JSON.stringify(t)??"null";if(Array.isArray(t))return`[${t.map(Xe).join(",")}]`;const e=t,n=[];for(const r of Object.keys(e).sort())e[r]!==void 0&&n.push(`${JSON.stringify(r)}:${Xe(e[r])}`);return`{${n.join(",")}}`}var Jl=new TextEncoder;function Vg(t){return Jl.encode(Xe(t))}var Xl=new TextDecoder;function Jg(t){return JSON.parse(Xl.decode(t))}function zt(t){return Jl.encode(t)}function Be(t){return Xl.decode(t)}async function Xg(t){const e=new Wl,n=t.getReader();try{for(;;){const{done:r,value:a}=await n.read();if(r)break;a&&e.update(a)}}finally{n.releaseLock()}return e.digest()}function _t(){const t=globalThis.crypto;if(t?.randomUUID)return t.randomUUID();const e=new Uint8Array(16);return t.getRandomValues(e),Array.from(e,n=>Vl[n]).join("")}var Kg=64*1024,Yg=4*1024*1024;function Zg(t){return typeof t.readStream=="function"&&typeof t.writeStream=="function"}async function At(t,e,n={}){if(t.readRange)return t.readRange(e,n);const r=await t.read(e);return r.slice(n.start??0,n.end??r.byteLength)}async function ur(t,e,n={}){return t.readStream?t.readStream(e,n):ey(await At(t,e,n))}async function pr(t,e){if(t.writeStream)return t.writeStream(e);const n=[];return new WritableStream({write(r){n.push(r.slice())},close:async()=>{await t.write(e,Zt(n))}})}function ey(t,e=Kg){let n=0;return new ReadableStream({pull(r){if(n>=t.byteLength){r.close();return}r.enqueue(t.subarray(n,Math.min(n+e,t.byteLength))),n+=e}})}async function Xo(t,e,n){const r=t.getReader(),a=e.getWriter();try{for(;;){const{done:o,value:i}=await r.read();if(o)break;!i||i.byteLength===0||(n?.(i),await a.write(i))}await a.close()}catch(o){throw await a.abort(o).catch(()=>{}),o}finally{r.releaseLock()}}function Zt(t){if(t.length===1)return t[0];let e=0;for(const a of t)e+=a.byteLength;const n=new Uint8Array(e);let r=0;for(const a of t)n.set(a,r),r+=a.byteLength;return n}function $e(t){const e=[];for(const n of t.replace(/\\/g,"/").split("/"))if(!(!n||n===".")){if(n===".."){if(e.length===0)throw new Error(`path escapes the root: ${t}`);e.pop();continue}e.push(n)}return e.join("/")}function tt(t){const e=t.lastIndexOf("/");return e===-1?"":t.slice(0,e)}function yt(t){const e=t.lastIndexOf("/");return e===-1?t:t.slice(e+1)}function ty(t){const e=t.lastIndexOf(".");return e<=0?[t,""]:[t.slice(0,e),t.slice(e)]}var Kl='"entries": [',Ko=8*1024,ny=["uuid","kind","path","hash","size","updated"];function Yl(t){const e={uuid:t.uuid,kind:t.kind,path:t.path,hash:t.hash??null,size:t.size,created:t.created,updated:t.updated,peer:t.peer};return t.deleted&&(e.deleted=!0),t.prev!==void 0&&(e.prev=t.prev),t.prev2&&(e.prev2=t.prev2),t.prevPath&&(e.prevPath=t.prevPath),t.native&&(e.native=t.native),t.mtime!==void 0&&(e.mtime=t.mtime),t.conflictOf&&(e.conflictOf=t.conflictOf),t.reason&&(e.reason=t.reason),t.base&&(e.base=t.base),t.held&&(e.held=t.held),e}function Gn(t){return[...t].sort((e,n)=>(e.path<n.path?-1:e.path>n.path?1:0)||(e.uuid<n.uuid?-1:e.uuid>n.uuid?1:0))}async function ry(t){const n=Gn(t.filter(r=>!r.deleted)).map(r=>{const a={};for(const o of ny)a[o]=r[o]??null;return a});return Rt(zt(Xe(n)))}async function ay(t){const e=Gn(t.entries).map(Yl);return{...t,entries:e,state:await ry(e)}}function oy(t){const n=[["version",2],["storeId",t.storeId],["peer",t.peer],["state",t.state],["text",t.text],["log",t.log],["peers",t.peers],["local",t.local]].map(([a,o])=>`${JSON.stringify(a)}: ${Xe(o)},`),r=Gn(t.entries).map(a=>Xe(Yl(a)));return zt(`{
${n.join(`
`)}
${Kl}
${r.join(`,
`)}
]}
`)}function Yo(t){const e=JSON.parse(Be(t));return e.entries??=[],e.peers??={},e.local??={},e.text??=[],e}function iy(t){const e=Be(t),n=e.indexOf(Kl);if(n===-1)return null;const r=JSON.parse(`${e.slice(0,n)}"entries":[]}`);return r.peers??={},r.local??={},r.text??=[],Zl(r)}function Zl(t){const{entries:e,...n}=t;return n}function sy(t,e,n,r){return{version:2,storeId:e,peer:t,state:"",text:r,log:{segment:n,digest:Fa,rows:0,size:0},peers:{},local:{},entries:[]}}var Fa="0".repeat(64),ly=["cue","json","log","m3u","md","nfo","srt","txt","xml"];function Vr(t){const e=t.slice(t.lastIndexOf("/")+1),n=e.lastIndexOf(".");return n<=0?"":e.slice(n+1).toLowerCase()}async function cy(t){return Rt(zt([t.peer,t.uuid,t.at,t.type,t.path,t.hash??""].join("|")))}async function ec(t){return{op:await cy(t),...t}}function dy(t){const e={op:t.op,batch:t.batch,at:t.at,peer:t.peer,uuid:t.uuid,type:t.type,kind:t.kind,path:t.path};return t.hash!==void 0&&(e.hash=t.hash),t.size!==void 0&&(e.size=t.size),t.prev!==void 0&&(e.prev=t.prev),t.prev2&&(e.prev2=t.prev2),t.prevPath&&(e.prevPath=t.prevPath),e}function fy(t){return t.length===0?new Uint8Array:zt(`${t.map(e=>Xe(dy(e))).join(`
`)}
`)}function qt(t){const e=[];for(const n of Be(t).split(`
`)){const r=n.trim();if(!(!r||!r.startsWith("{")||!r.endsWith("}")))try{e.push(JSON.parse(r))}catch{}}return e}function hy(t){let e=Fa;for(const n of t)e=uy(e,n.op);return e}function uy(t,e){let n="";for(let r=0;r<64;r++){const a=Number.parseInt(t?.[r]??"0",16)||0,o=Number.parseInt(e?.[r]??"0",16)||0;n+=((a^o)&15).toString(16)}return n}function xn(t,e){const n=new Set;for(const a of t)n.add(a.op);const r=[];for(const a of e)n.has(a.op)||(n.add(a.op),r.push(a));return r}var at=".vfs",py=256*1024,my=class{adapter;root;rotateAt;file=null;rows=null;snapshot=null;archives=new Map;now;constructor(t,e=at,n={}){this.adapter=t,this.root=e,this.rotateAt=n.rotateAt??py,this.now=n.now??(()=>Date.now())}path(...t){return[this.root,...t].join("/")}async readFile(t){try{return await this.adapter.read(t)}catch(e){const n=await this.adapter.stat(t);if(n&&n.kind==="file")throw e;return null}}get filePath(){return this.path("vfs.json")}async read(){if(this.file)return this.file;const t=await this.readFile(this.filePath);if(!t)throw new Error(`no vfs store in ${this.adapter.name}`);return this.file=Yo(t),this.file}async header(){if(this.file)return Zl(this.file);for(let t=Ko;t<=Ko*16;t*=4){const e=await At(this.adapter,this.filePath,{end:t}),n=iy(e);if(n)return n;if(e.byteLength<t)break}return this.read()}async write(t){const e=await ay(t);return this.file=e,await this.adapter.write(this.filePath,oy(e)),e}async init(t={}){const e=await this.readFile(this.filePath);return e?(this.file=Yo(e),this.file):this.write(sy(t.peer??_t(),t.storeId??_t(),this.now(),[...ly]))}segmentPath(t){return t===void 0?this.path("commits"):this.path(`commits-${t}`)}async logRows(){if(this.rows)return this.rows;const t=await this.readFile(this.segmentPath());return this.rows=t?qt(t):[],this.rows}async rowsSince(t){if(this.rows||t<=0)return this.logRows();const e=await At(this.adapter,this.segmentPath(),{start:t}).catch(()=>null);return e?qt(e):[]}async append(t,e){const n=e??await this.read(),r=await this.logRows();if(((await this.adapter.stat(this.segmentPath()))?.size??0)>n.log.size){const i=qt(await At(this.adapter,this.segmentPath(),{start:n.log.size}).catch(()=>new Uint8Array));for(const s of xn(r,i))r.push(s)}const o=xn(r,t);if(o.length>0){await this.appendBytes(this.segmentPath(),fy(o));for(const i of o)r.push(i)}return this.rows=r,n.log.rows=r.length,n.log.digest=hy(r),n.log.size=(await this.adapter.stat(this.segmentPath()))?.size??n.log.size,n}async appendBytes(t,e){if(e.byteLength===0)return;if(this.adapter.append){await this.adapter.append(t,e);return}const n=await this.readFile(t)??new Uint8Array;if(this.adapter.writeIf&&this.adapter.tag){const r=n.byteLength>0?await this.adapter.tag(t):null;if(await this.adapter.writeIf(t,Zt([n,e]),r)!==null)return;const a=await this.readFile(t)??new Uint8Array;await this.adapter.write(t,Zt([a,e]));return}await this.adapter.write(t,Zt([n,e]))}async shouldRotate(t){return(t??await this.read()).log.size>=this.rotateAt}async rotate(t){const e=t??await this.read(),n=e.log.segment,r=await this.logRows(),a=new Map;for(const c of await this.readSnapshot(e))a.set(c.uuid,c);for(const c of e.entries){const d=a.get(c.uuid);(!d||c.updated>=d.updated)&&a.set(c.uuid,c)}const o=[...a.values()],i=Math.max(this.now(),n+1),s=`vfs-${i}.json`;await this.adapter.write(this.path(s),Vg({entries:o}));const l=[...e.log.archives??[]];return r.length>0?(await this.adapter.rename(this.segmentPath(),this.segmentPath(n)),l.push(n)):await this.adapter.delete(this.segmentPath()).catch(()=>{}),this.snapshot=o,this.rows=[],e.log={segment:i,digest:Fa,rows:0,size:0,snapshot:s,...l.length>0?{archives:l}:{}},e}async readSnapshot(t){if(this.snapshot)return this.snapshot;const e=(t??await this.read()).log.snapshot;if(!e)return this.snapshot=[];const n=await this.readFile(this.path(e));return this.snapshot=n?Jg(n).entries??[]:[],this.snapshot}async readArchive(t){const e=this.archives.get(t);if(e)return e;const n=await this.readFile(this.segmentPath(t)),r=n?qt(n):[];return this.archives.set(t,r),r}basePath(t){return this.path("base",t)}async putBase(t,e){await this.adapter.write(this.basePath(t),e)}async getBase(t){return this.readFile(this.basePath(t))}async pruneBase(t,e=256){const n=(await this.adapter.list(this.path("base")).catch(()=>[])).filter(i=>i.kind==="file"),r=n.filter(i=>!t.has(i.name)),a=n.filter(i=>t.has(i.name)),o=a.length-e;o>0&&r.push(...[...a].sort((i,s)=>(i.stat?.mtime??0)-(s.stat?.mtime??0)).slice(0,o));for(const i of r)await this.adapter.delete(i.path).catch(()=>{})}invalidate(){this.file=null,this.rows=null,this.snapshot=null}},St=class tc{content=new Map;location=new Map;latest=new Map;static from(e){const n=new tc;for(const r of e)n.add(r);return n}add(e){for(const n of e){const r=n,a=r.uuid;if(!a)continue;const o=r.at??r.updated??0,i=r.type==="delete"||r.deleted===!0;if(r.hash&&this.link(a,r.hash,r.prev??null,r.prev2??null),r.prevPath&&r.path&&r.prevPath!==r.path){let l=this.location.get(a);l||this.location.set(a,l=new Map),l.set(r.path,r.prevPath)}const s=this.latest.get(a);(!s||o>=s.at)&&this.latest.set(a,{at:o,deleted:i,path:r.path??s?.path??""})}return this}link(e,n,r,a){let o=this.content.get(e);o||this.content.set(e,o=new Map);let i=o.get(n);i||o.set(n,i=new Set),r&&i.add(r),a&&i.add(a)}knows(e){return this.latest.has(e)||this.content.has(e)||this.location.has(e)}last(e){return this.latest.get(e)}descends(e,n,r,a=[]){if(!r)return!1;if(n===r)return!0;const o=this.content.get(e),i=[];for(const l of a)l&&i.push(l);for(const l of o?.get(n??"")??[])i.push(l);const s=new Set(i);for(;i.length>0;){const l=i.pop();if(l===r)return!0;for(const c of o?.get(l)??[])s.has(c)||(s.add(c),i.push(c))}return!1}commonAncestor(e,n,r){const a=s=>{const l=this.content.get(e),c=[],d=new Set,f=[];for(const h of[s.prev,s.prev2])h&&f.push(h);for(const h of l?.get(s.hash??"")??[])f.push(h);for(;f.length>0;){const h=f.shift();if(!d.has(h)){d.add(h),c.push(h);for(const y of l?.get(h)??[])f.push(y)}}return c},o=a(n),i=new Set(a(r));return o.find(s=>i.has(s))??null}movedFrom(e,n,r,a){if(n===r)return!0;const o=this.location.get(e);let i=a??o?.get(n);const s=new Set([n]);for(;i!==void 0&&!s.has(i);){if(i===r)return!0;s.add(i),i=o?.get(i)}return!1}},ot=1024*1024,gy=4e6;function mr(t){const e=[];let n=0;for(let r=0;r<t.length;r++)t[r]===`
`&&(e.push(t.slice(n,r+1)),n=r+1);return n<t.length&&e.push(t.slice(n)),e}function gr(t){const e=(t.match(/\n/g)??[]).length;if(e===0)return"none";const n=(t.match(/\r\n/g)??[]).length;return n===0?"lf":n===e?"crlf":"mixed"}function yy(t,e,n){if(t.length>ot||e.length>ot||n.length>ot)return{ok:!1,reason:"size"};const r=new Set([gr(t),gr(e),gr(n)]);if(r.delete("none"),r.has("mixed")||r.size>1)return{ok:!1,reason:"eol"};const a=mr(t),o=mr(e),i=mr(n),s=Zo(a,o),l=Zo(a,i);if(!s||!l)return{ok:!1,reason:"size"};const c=[];let d=0,f=0,h=0;for(;f<s.length||h<l.length;){const y=Math.min(s[f]?.start??1/0,l[h]?.start??1/0),u={start:y,end:y},g=[],S=[],v=p=>p.start<u.end||p.start===u.end&&u.end===u.start;for(;;){let p=!1;for(;f<s.length&&v(s[f]);){const w=s[f++];u.end=Math.max(u.end,w.end),g.push(w),p=!0}for(;h<l.length&&v(l[h]);){const w=l[h++];u.end=Math.max(u.end,w.end),S.push(w),p=!0}if(!p)break}if(c.push(...a.slice(d,u.start)),g.length===0)c.push(...Gt(a,S,u.start,u.end));else if(S.length===0)c.push(...Gt(a,g,u.start,u.end));else{const p=Gt(a,g,u.start,u.end),w=Gt(a,S,u.start,u.end);if(p.length!==w.length||p.some((A,P)=>A!==w[P]))return{ok:!1,reason:"block"};c.push(...p)}d=u.end}return c.push(...a.slice(d)),{ok:!0,text:c.join("")}}function Gt(t,e,n,r){const a=[];let o=n;for(const i of e)a.push(...t.slice(o,i.start)),a.push(...i.lines),o=Math.max(o,i.end);return a.push(...t.slice(o,r)),a}function Zo(t,e){let n=0;for(;n<t.length&&n<e.length&&t[n]===e[n];)n++;let r=0;for(;r<t.length-n&&r<e.length-n&&t[t.length-1-r]===e[e.length-1-r];)r++;const a=t.slice(n,t.length-r),o=e.slice(n,e.length-r);if(a.length===0&&o.length===0)return[];if(a.length===0)return[{start:n,end:n,lines:o}];if(o.length===0)return[{start:n,end:n+a.length,lines:[]}];if(a.length*o.length>gy)return null;const i=vy(a,o),s=[];let l=0,c=0;for(const[d,f]of i)(d>l||f>c)&&s.push({start:n+l,end:n+d,lines:o.slice(c,f)}),l=d+1,c=f+1;return(l<a.length||c<o.length)&&s.push({start:n+l,end:n+a.length,lines:o.slice(c)}),s}function vy(t,e){const n=e.length+1,r=new Uint32Array((t.length+1)*n);for(let s=t.length-1;s>=0;s--)for(let l=e.length-1;l>=0;l--)r[s*n+l]=t[s]===e[l]?r[(s+1)*n+l+1]+1:Math.max(r[(s+1)*n+l],r[s*n+l+1]);const a=[];let o=0,i=0;for(;o<t.length&&i<e.length;)t[o]===e[i]?(a.push([o,i]),o++,i++):r[(o+1)*n+i]>=r[o*n+i+1]?o++:i++;return a}async function wy(t,e={}){const n=e.controlDir??at,r=e.ignore,a=[],o=async i=>{for(const s of await t.list(i)){if(s.path===n||s.path.startsWith(`${n}/`)||r?.(s.path))continue;if(s.kind==="directory"){e.directories&&a.push({path:s.path,stat:s.stat??{kind:"directory",size:0,mtime:0}}),await o(s.path);continue}const l=s.stat??await t.stat(s.path);l&&l.kind==="file"&&a.push({path:s.path,stat:l})}};return await o(""),a.sort((i,s)=>i.path<s.path?-1:i.path>s.path?1:0),a}var ei=`${at}/tmp`,yr=class nc{adapter;store;id;streamThreshold;ignore;now;constructor(e,n,r,a){this.adapter=e,this.store=a,this.id=n,this.ignore=r.ignore,this.now=r.now??(()=>Date.now()),this.streamThreshold=r.streamThreshold??Yg}static async open(e,n={}){const r={...n.now?{now:n.now}:{}};n.rotateAt!==void 0&&(r.rotateAt=n.rotateAt);const a=new my(e,at,r),o=await a.init(n.id?{peer:n.id}:{});return n.id&&o.peer!==n.id&&(o.peer=n.id,await a.write(o)),new nc(e,o.peer,n,a)}get name(){return this.adapter.name}streams(e){return e>=this.streamThreshold&&Zg(this.adapter)}file(){return this.store.read()}async entries(){return(await this.store.read()).entries}async live(){return(await this.entries()).filter(e=>!e.deleted)}async state(){return(await this.store.read()).state}async history(){const e=await this.store.read();return St.from([e.entries,await this.store.logRows(),await this.store.readSnapshot(e)])}async isText(e){const n=Vr(e);return n!==""&&(await this.store.read()).text.includes(n)}async externalChanges(){if(!this.adapter.changes)return null;const e=await this.store.read(),n=e.local.driveChangeToken;if(n===void 0){const s=await this.adapter.changes(null);return e.local.driveChangeToken=s.token,await this.store.write(e),null}const r=await this.adapter.changes(n);if(e.local.driveChangeToken=r.token,await this.store.write(e),r.reset)return null;const a=new Map,o=new Map;for(const s of e.entries)s.deleted||(s.native&&a.set(s.native,s),o.set(s.path,s));const i=new Set;for(const s of r.changes){const l=a.get(s.native)??(s.path?o.get(s.path):void 0),c=l?.path??s.path;if(c&&!this.ignore?.(c)&&!(c===at||c.startsWith(`${at}/`))&&!(!l&&!s.path)){if(s.removed){l&&i.add(c);continue}l&&s.stat&&s.stat.size===l.size&&l.mtime===s.stat.mtime||i.add(c)}}return[...i].sort()}stamp(e){let n=0;for(const r of e.entries)r.updated>n&&(n=r.updated);return Math.max(this.now(),n+1)}read(e){return this.adapter.read(e)}write(e,n){return this.adapter.write(e,n)}stat(e){return this.adapter.stat(e)}async mkdir(e){await this.adapter.mkdir?.(e)}readRange(e,n){return At(this.adapter,e,n)}readStream(e,n){return ur(this.adapter,e,n)}writeStream(e){return pr(this.adapter,e)}delete(e){return this.adapter.delete(e)}async rename(e,n){await this.adapter.rename(e,n);const r=await this.store.read();(r.local.pendingRenames??(r.local.pendingRenames=[])).push({from:e,to:n}),await this.store.write(r)}async scan(){const e=await this.store.read(),n=this.stamp(e),r=_t(),a=e.entries,o=a.filter(p=>!p.deleted),i=new Map(o.map(p=>[p.path,p])),s=new Map(o.filter(p=>p.native).map(p=>[p.native,p])),l=await wy(this.adapter,{directories:!0,...this.ignore?{ignore:this.ignore}:{}}),c=[];for(const p of l){const w=i.get(p.path);let A=null;p.stat.kind==="file"&&(w&&w.mtime===p.stat.mtime&&w.size===p.stat.size&&w.hash?A=w.hash:this.streams(p.stat.size)?A=await Xg(await ur(this.adapter,p.path)):A=await Rt(await this.adapter.read(p.path))),c.push({path:p.path,stat:p.stat,hash:A})}const d=new Set(c.map(p=>p.path)),f=o.filter(p=>!d.has(p.path)),h=new Map;for(const p of f){if(!p.hash)continue;const w=h.get(p.hash);w?w.push(p):h.set(p.hash,[p])}const y=new Map;for(const p of e.local.pendingRenames??[]){const w=y.get(p.from)??p.from;y.delete(p.from),w!==p.to&&y.set(p.to,w)}const u=new Set(y.values()),g=new Set,S=[],v=[];for(const p of c){const w=this.adapter.fileId?await this.adapter.fileId(p.path):null;let A;if(w&&(A=s.get(w)),!A){const O=y.get(p.path);O&&(A=i.get(O)),!A&&!u.has(p.path)&&(A=i.get(p.path)),!A&&p.hash&&(A=by(h,p.hash,g))}A&&g.has(A.uuid)&&(A=void 0);const P=A?.uuid??_t();g.add(P);const C=A!==void 0&&A.path!==p.path,B=A===void 0||A.hash!==p.hash||A.kind!==p.stat.kind,b={uuid:P,kind:p.stat.kind,path:p.path,hash:p.hash,size:p.stat.kind==="file"?p.stat.size:0,created:A?.created??n,updated:B||C?n:A?.updated??n,peer:B||C?this.id:A?.peer??this.id,mtime:p.stat.mtime};B?b.prev=A?.hash??null:A?.prev!==void 0&&(b.prev=A.prev),!B&&A?.prev2&&(b.prev2=A.prev2),C&&A?b.prevPath=A.path:!C&&A?.prevPath&&(b.prevPath=A.prevPath),w&&(b.native=w),A?.conflictOf&&!B&&(b.conflictOf=A.conflictOf,A.reason&&(b.reason=A.reason),A.base&&(b.base=A.base),A.held&&(b.held=A.held)),S.push(b),(B||C)&&v.push({batch:r,at:n,peer:this.id,uuid:P,type:B?"write":"rename",kind:b.kind,path:b.path,hash:b.hash,size:b.size,...B?{prev:A?.hash??null}:{},...C&&A?{prevPath:A.path}:{}})}for(const p of a)if(!g.has(p.uuid)){if(p.deleted){S.push(p);continue}S.push({uuid:p.uuid,kind:p.kind,path:p.path,hash:null,size:0,created:p.created,updated:n,peer:this.id,deleted:!0,prev:p.hash}),v.push({batch:r,at:n,peer:this.id,uuid:p.uuid,type:"delete",kind:p.kind,path:p.path,hash:null,prev:p.hash})}return{entries:S,rows:await Promise.all(v.map(ec)),batch:r}}async commit(){const{entries:e,rows:n,batch:r}=await this.scan(),a=await this.store.read();return n.length===0&&ky(a.entries,e)?(a.local.pendingRenames?.length&&(a.local.pendingRenames=[],await this.store.write(a)),null):(await this.keepText(e,a),a.entries=e,a.local.pendingRenames=[],a.local.verifiedAt=this.now(),n.length>0&&await this.store.append(n,a),await this.settle(a),r)}async keepText(e,n){const r=n.text;if(r.length===0)return;const a=new Map(n.entries.map(s=>[s.uuid,s.hash])),o=new Set;let i=0;for(const s of e){if(s.deleted||s.kind!=="file"||!s.hash)continue;const l=Vr(s.path);if(l===""||!r.includes(l)||(o.add(s.hash),s.prev&&o.add(s.prev),s.prev2&&o.add(s.prev2),s.size>ot||a.get(s.uuid)===s.hash))continue;const c=await this.adapter.read(s.path).catch(()=>null);c&&(await this.store.putBase(s.hash,c),i++)}i>0&&await this.store.pruneBase(o)}async settle(e){await this.store.shouldRotate(e)&&await this.store.rotate(e),e.entries=await this.pruneTombstones(e),await this.store.write(e)}async pruneTombstones(e){const n=Object.values(e.peers);if(n.length===0)return e.entries;const r=Math.min(...n.map(o=>o.lastSync)),a=new Set;for(const o of await this.store.logRows())o.type==="delete"&&a.add(o.uuid);for(const o of await this.store.readSnapshot(e))o.deleted&&a.add(o.uuid);return e.entries.filter(o=>!o.deleted||o.updated>=r||!a.has(o.uuid))}async apply(e,n){const r=await this.store.read(),a=new Map(r.entries.map(u=>[u.uuid,u])),o=new Set(r.entries.filter(u=>!u.deleted).map(u=>u.path)),i=[],s=[],l=[],c=[];for(const u of e){const g=a.get(u.uuid),S=g&&!g.deleted;if(u.deleted){S&&c.push({path:g.path,kind:g.kind});continue}if(!(u.held&&u.held!==this.id)){if(S&&g.path!==u.path&&i.push({from:g.path,to:u.path,uuid:u.uuid}),u.kind==="directory"){S||l.push(u);continue}(!S||g.hash!==u.hash)&&s.push(u)}}const d=new Map;for(const u of a.values())u.deleted||u.kind!=="file"||!u.hash||d.has(u.hash)||d.set(u.hash,{path:u.path,size:u.size});const f=new Set([...c.map(u=>u.path),...i.flatMap(u=>[u.from,u.to]),...s.map(u=>u.path)]),h=new Map;for(const u of s){const g=u.hash?d.get(u.hash):void 0;if(!g||!f.has(g.path)||h.has(u.hash))continue;const S=`${ei}/${u.hash}`;await this.copy(g.path,S,g.size),h.set(u.hash,S)}c.sort((u,g)=>g.path.length-u.path.length);for(const u of c)await this.adapter.delete(u.path),o.delete(u.path);const y=[];for(const u of i){if(!o.has(u.to))continue;const g=`${ei}/${u.uuid}`;await this.adapter.rename(u.from,g),o.delete(u.from),y.push({temp:g,to:u.to})}for(const u of i)y.some(g=>g.to===u.to)||(await this.adapter.rename(u.from,u.to),o.delete(u.from),o.add(u.to));for(const u of y)await this.adapter.rename(u.temp,u.to),o.add(u.to);for(const u of l)await this.adapter.mkdir?.(u.path);for(const u of s){const g=u.hash,S=h.get(g)??d.get(g)?.path;if(S!==void 0&&S!==u.path){await this.copy(S,u.path,u.size);continue}const v=await n.open(g,u);if(v)if(this.streams(v.size)){const p=new Wl;if(await Xo(await v.stream(),await pr(this.adapter,u.path),w=>p.update(w)),p.digest()!==g)throw await this.adapter.delete(u.path),new Error(`${u.path} arrived as ${p.digest()} in ${this.adapter.name}`)}else{const p=await v.read(),w=await Rt(p);if(w!==g)throw new Error(`${u.path} arrived as ${w} in ${this.adapter.name}`);await this.adapter.write(u.path,p)}}for(const u of h.values())await this.adapter.delete(u).catch(()=>{})}async copy(e,n,r){if(this.streams(r)){await Xo(await ur(this.adapter,e),await pr(this.adapter,n));return}await this.adapter.write(n,await this.adapter.read(e))}async adopt(e,n){const r=n??await this.store.read(),a=new Map(r.entries.map(i=>[i.uuid,i])),o=[];for(const i of e){const s={...i};delete s.native,delete s.mtime;const l=a.get(i.uuid);if(l&&!i.deleted&&l.path===i.path&&l.hash===i.hash)l.mtime!==void 0&&(s.mtime=l.mtime),l.native&&(s.native=l.native);else if(!i.deleted&&!(i.held&&i.held!==this.id)){const c=await this.adapter.stat(i.path);if(c&&(s.mtime=c.mtime),this.adapter.fileId){const d=await this.adapter.fileId(i.path);d&&(s.native=d)}}o.push(s)}return await this.keepText(o,r),r.entries=o,r.local.verifiedAt=this.now(),r}async conflicts(){const e=await this.entries(),n=new Map(e.map(a=>[a.uuid,a])),r=[];for(const a of e){if(!a.conflictOf||a.deleted)continue;const o=n.get(a.conflictOf);r.push({uuid:a.uuid,of:a.conflictOf,reason:a.reason??"binary",path:o?.path??a.path,copyPath:a.path,peer:a.peer,...a.held?{held:a.held}:{},...a.base?{base:a.base}:{},mine:{hash:o?.hash??null,size:o?.size??0,updated:o?.updated??0},theirs:{hash:a.hash,size:a.size,updated:a.updated}})}return r}async resolve(e,n){const r=await this.store.read(),a=r.entries.find(i=>i.uuid===e&&i.conflictOf);if(!a)throw new Error(`no pending conflict ${e}`);const o=r.entries.find(i=>i.uuid===a.conflictOf);if(n==="theirs"&&a.held&&a.held!==this.id)throw new Error(`the losing version of ${a.path} is held on ${a.held}`);if(n!=="mine"&&o){const i=n instanceof Uint8Array?n:await this.adapter.read(a.path);await this.adapter.write(o.path,i)}await this.adapter.delete(a.path).catch(()=>{}),await this.commit()}async baseOf(e){return this.store.getBase(e)}};function by(t,e,n){const r=t.get(e);if(r)for(;r.length>0;){const a=r.shift();if(!n.has(a.uuid))return a}}function ky(t,e){if(t.length!==e.length)return!1;const n=new Map(t.map(r=>[r.uuid,r]));return e.every(r=>{const a=n.get(r.uuid);return a!==void 0&&a.path===r.path&&a.hash===r.hash&&a.size===r.size&&!!a.deleted==!!r.deleted})}var rc=64*1024*1024;function Ay(t){const e=tt(t.path),[n,r]=ty(yt(t.path)),a=`${n} (conflict ${t.peer} ${t.hash.slice(0,8)})${r}`;return e?`${e}/${a}`:a}function Sy(t,e){const n=new Map,r=c=>{let d=n.get(c);return d||n.set(c,d={uuid:c}),d};for(const c of t.entries)r(c.uuid).a=c;for(const c of e.entries)r(c.uuid).b=c;const a=new Set(t.entries.map(c=>c.uuid)),o=new Set(e.entries.map(c=>c.uuid)),i=c=>!a.has(c)&&!t.knows?.(c),s=c=>!o.has(c)&&!e.knows?.(c),l=new Map;for(const c of n.values()){const d=c.b;!d||c.a||d.deleted||!i(d.uuid)||l.set(`${d.kind}:${d.path}`,c)}for(const c of[...n.values()]){const d=c.a;if(!d||c.b||d.deleted||!s(d.uuid))continue;const f=`${d.kind}:${d.path}`,h=l.get(f);if(!h)continue;l.delete(f);const y=c.uuid<h.uuid?c.uuid:h.uuid;n.delete(c.uuid),n.delete(h.uuid),n.set(y,{uuid:y,a:c.a,b:h.b})}return[...n.values()]}function ti(t,e,n={}){const r=n.history??new St,a=n.conflictCopies??"edits",o=n.conflictName??Ay,i=n.heldAt??rc,s=[],l=[],c=[];for(const d of Sy(t,e)){const f=d.a,h=d.b;if(f&&!h){l.push(ni(d.uuid,f,r));continue}if(h&&!f){l.push(ni(d.uuid,h,r));continue}if(!f||!h)continue;const y=Jr(f,h),u=y===f?h:f,g=f.hash===h.hash&&!!f.deleted==!!h.deleted;let S=null,v=y,p;g?v=y:ri(r,d.uuid,y,u)?(v=y,p=u.hash??void 0):ri(r,d.uuid,u,y)?(v=u,p=y.hash??void 0):(v=y,S=f.deleted||h.deleted?"delete-edit":"content");let w,A;if(f.path===h.path)w=f.path,A=v.prevPath;else{const U=r.movedFrom(d.uuid,f.path,h.path,f.prevPath),H=r.movedFrom(d.uuid,h.path,f.path,h.prevPath),$=U===H?Jr(f,h):U?f:h;w=$.path,A=$.prevPath??($===f?h.path:f.path),U===H&&!S&&(S="location")}const P={uuid:d.uuid,kind:v.kind,path:w,hash:v.hash,size:v.size,created:Math.min(f.created,h.created),updated:v.updated,peer:v.peer};if(v.deleted&&(P.deleted=!0),v.prev!==void 0&&(P.prev=v.prev),v.prev2&&(P.prev2=v.prev2),A&&A!==w&&!P.deleted&&(P.prevPath=A),v.conflictOf&&(P.conflictOf=v.conflictOf,v.reason&&(P.reason=v.reason),v.base&&(P.base=v.base),v.held&&(P.held=v.held)),l.push(P),!S)continue;const C=v===f?"a":"b",B=C==="a"?h:f,b={uuid:d.uuid,kind:S,path:w,winner:C,a:f,b:h,...p?{base:p}:{}},O=S!=="location"&&!!B.hash,R=a==="always"?O:a==="edits"?O&&!!v.hash:!1;if(S==="content"&&n.text?.(w)&&f.hash&&h.hash&&(b.text=!0),R){const U=xy(d.uuid,B,w,S,o,i);c.push(U),b.copy=U}s.push(b)}for(const d of c)l.some(f=>f.uuid===d.uuid)||l.push(d);return{entries:Gn(Ey(l,s,o)),conflicts:s}}function ni(t,e,n){const r=n.last(t);return r?.deleted&&r.at>e.updated&&!e.deleted?{...e,hash:null,size:0,updated:r.at,deleted:!0,prev:e.hash}:{...e,uuid:t}}function ri(t,e,n,r){return r.hash?t.descends(e,n.hash,r.hash,[n.prev,n.prev2]):!1}function xy(t,e,n,r,a,o){const i=r==="delete-edit"?"delete-edit":r==="kind"?"kind":"binary",s={uuid:`conflict:${t}:${e.hash}`,kind:e.kind,path:a({path:n,peer:e.peer,hash:e.hash,entry:e}),hash:e.hash,size:e.size,created:e.updated,updated:e.updated,peer:e.peer,conflictOf:t,reason:i};return e.prev&&(s.base=e.prev),e.size>=o&&(s.held=e.peer),s}function Ey(t,e,n){const r=new Map;for(const o of t){if(o.deleted)continue;const i=r.get(o.path);i?i.push(o):r.set(o.path,[o])}const a=[];for(const[o,i]of r){if(i.length<2)continue;const s=[...i].sort((c,d)=>Jr(c,d)===c?-1:1),l=s[0];for(const c of s.slice(1)){const d=n({path:o,peer:c.peer,hash:c.hash??c.uuid,entry:c});a.push({from:c.path,to:d}),c.prevPath=c.path,c.path=d,c.conflictOf??=l.uuid,c.reason??=l.kind===c.kind?"binary":"kind",e.push({uuid:c.uuid,kind:l.kind===c.kind?"content":"kind",path:o,winner:"a",a:l,b:c,copy:c})}}for(const o of a)for(const i of t)i.path.startsWith(`${o.from}/`)&&(i.prevPath=i.path,i.path=`${o.to}${i.path.slice(o.from.length)}`);return t}function Jr(t,e){if(t.updated!==e.updated)return t.updated>e.updated?t:e;const n=`${t.hash??""}|${t.peer}|${t.uuid}`,r=`${e.hash??""}|${e.peer}|${e.uuid}`;return n>=r?t:e}async function Iy(t,e,n={}){const r=n.now??(()=>Date.now()),a={toA:0,toB:0};if(await t.commit(),await e.commit(),t===e)return{changed:!1,conflicts:[],transferred:a,merged:0,state:await t.state()};const o=await t.file(),i=await e.file(),s=[o.storeId,i.storeId].sort()[0],l=[...new Set([...o.text,...i.text])].sort(),c=o.storeId!==s||i.storeId!==s||o.text.join()!==l.join()||i.text.join()!==l.join();o.storeId=i.storeId=s,o.text=[...l],i.text=[...l];const d=r();if(o.state===i.state&&o.log.digest===i.log.digest)return await ai(t,e,o,i,[],[],d),{changed:c,conflicts:[],transferred:a,merged:0,state:o.state};const f=[o.entries,i.entries];let h=[],y=[];const u=St.from([o.entries]),g=St.from([i.entries]);if(Cy(o.entries,i.entries)){h=await t.store.logRows(),y=await $y(e,o.peers[e.id]);const N=await t.store.readSnapshot(o),T=await e.store.readSnapshot(i);u.add(h).add(N),g.add(y).add(T),f.push(h,y,N,T)}const S=St.from(f),v={peer:t.id,entries:o.entries,knows:N=>u.knows(N)},p={peer:e.id,entries:i.entries,knows:N=>g.knows(N)},w={history:S,heldAt:n.heldAt??rc,text:N=>{const T=Vr(N);return T!==""&&l.includes(T)},...n.conflictCopies!==void 0?{conflictCopies:n.conflictCopies}:{},...n.conflictName?{conflictName:n.conflictName}:{}};let A=ti(v,p,w);if(n.archives!==!1){const N=Oy(A.conflicts);if(N!==null){const T=[...await oi(t,o,N),...await oi(e,i,N)];T.length>0&&(S.add(T),A=ti(v,p,w))}}const P=new Map,C=[],B=_t(),b=await My(t,e,A,S,{overlay:P,rows:C,batch:B,at:d,enabled:n.autoMerge!==!1,...n.resolveText?{resolveText:n.resolveText}:{}}),O=A.entries,R={toA:0,toB:0},U=i.entries;await t.apply(O,si(P,[{node:e,entries:U}],()=>R.toA++)),await e.apply(O,si(P,[{node:t,entries:O},{node:t,entries:o.entries}],()=>R.toB++));const H=[...await Promise.all(C.map(ec))],$=[...H];return(h.length>0||y.length>0)&&(H.push(...xn(h,y)),$.push(...xn(y,h))),await t.adopt(O,o),await e.adopt(O,i),await ai(t,e,o,i,H,$,d),{changed:!0,conflicts:A.conflicts,transferred:R,merged:b,state:(await t.file()).state}}async function ai(t,e,n,r,a,o,i){a.length>0&&await t.store.append(a,n),o.length>0&&await e.store.append(o,r),n.peers[e.id]={lastSync:i,segment:r.log.segment,offset:r.log.size,digest:r.log.digest},r.peers[t.id]={lastSync:i,segment:n.log.segment,offset:n.log.size,digest:n.log.digest},await t.store.write(n),await e.store.write(r)}function Cy(t,e){const n=new Map(e.map(a=>[a.uuid,a]));for(const a of t){const o=n.get(a.uuid);if(!o||o.hash!==a.hash)return!0}const r=new Set(t.map(a=>a.uuid));return e.some(a=>!r.has(a.uuid))}function Oy(t){let e=null;for(const n of t){if(n.kind==="location"||n.kind==="kind")continue;const r=n.winner==="a"?n.b:n.a;r&&(e===null||r.updated<e)&&(e=r.updated)}return e}async function oi(t,e,n){const r=[];for(const a of e.log.archives??[])a<n||r.push(...await t.store.readArchive(a));return r}async function $y(t,e){const n=await t.file();return e&&e.digest===n.log.digest||!e||e.segment!==n.log.segment?t.store.logRows():t.store.rowsSince(e.offset)}async function My(t,e,n,r,a){let o=0;for(const i of n.conflicts){if(!i.text||!i.a||!i.b||!a.enabled&&!a.resolveText)continue;const s=i.a,l=i.b;if(s.size>ot||l.size>ot)continue;const c=i.base??r.commonAncestor(i.uuid,s,l),d=c?await t.baseOf(c)??await e.baseOf(c):null,f=await ii(t,s.path),h=await ii(e,l.path);if(!f||!h)continue;const y=d?Be(d):null;let u=null;if(a.enabled&&y!==null){const A=yy(y,Be(f),Be(h));A.ok&&(u=A.text)}if(u===null&&a.resolveText&&(u=await a.resolveText({path:i.path,base:y,a:Be(f),b:Be(h),peerA:t.id,peerB:e.id})),u===null)continue;const g=zt(u),S=await Rt(g);a.overlay.set(S,g);const v=i.winner==="a"?s:l,p=i.winner==="a"?l:s,w=n.entries.find(A=>A.uuid===i.uuid);if(w){if(w.hash=S,w.size=g.byteLength,w.updated=Math.max(a.at,s.updated,l.updated)+1,w.peer=t.id,w.prev=v.hash,p.hash&&(w.prev2=p.hash),i.copy){const A=n.entries.indexOf(i.copy);A>=0&&n.entries.splice(A,1),delete i.copy}i.text=!0,a.rows.push({batch:a.batch,at:w.updated,peer:t.id,uuid:w.uuid,type:"write",kind:"file",path:w.path,hash:S,size:g.byteLength,prev:v.hash??null,...p.hash?{prev2:p.hash}:{}}),o++}}return o}async function ii(t,e){try{return await t.read(e)}catch{return null}}function si(t,e,n){return{async open(r){const a=t.get(r);if(a)return{size:a.byteLength,read:async()=>a,stream:async()=>new Response(a).body};for(const o of e){const i=o.entries.find(c=>!c.deleted&&c.kind==="file"&&c.hash===r&&!c.held);if(!i)continue;const s=await o.node.stat(i.path);if(!s||s.kind!=="file")continue;n();const l=i.path;return{size:s.size,read:()=>o.node.read(l),stream:()=>o.node.readStream(l)}}return null}}}new TextEncoder;new TextDecoder;var ac=class{name;root;constructor(t,e=t.name||"handle"){this.root=t,this.name=e}async dir(t,e=!1){let n=this.root;for(const r of $e(t).split("/").filter(Boolean))try{n=await n.getDirectoryHandle(r,{create:e})}catch{return null}return n}async file(t,e=!1){const n=$e(t),r=await this.dir(tt(n),e);if(!r)return null;try{return await r.getFileHandle(yt(n),{create:e})}catch{return null}}async mkdir(t){await this.dir(t,!0)}async list(t){const e=await this.dir(t);if(!e)return[];const n=$e(t),r=[];for await(const[a,o]of e)r.push({name:a,path:n?`${n}/${a}`:a,kind:o.kind==="directory"?"directory":"file"});return r}async read(t){const e=await this.file(t);if(!e)throw new Error(`ENOENT: ${t}`);return new Uint8Array(await(await e.getFile()).arrayBuffer())}async write(t,e){const n=await this.file(t,!0);if(!n)throw new Error(`cannot write ${t}`);const r=await n.createWritable();try{await r.write(e)}finally{await r.close()}}async append(t,e){const n=await this.file(t,!0);if(!n)throw new Error(`cannot write ${t}`);const r=(await n.getFile()).size,a=await n.createWritable({keepExistingData:!0});try{await a.write({type:"write",position:r,data:e})}finally{await a.close()}}async readRange(t,e={}){const n=await this.getFile(t),r=n.slice(e.start??0,e.end??n.size);return new Uint8Array(await r.arrayBuffer())}async readStream(t,e={}){const n=await this.getFile(t);return(e.start!==void 0||e.end!==void 0?n.slice(e.start??0,e.end??n.size):n).stream()}async writeStream(t){const e=await this.file(t,!0);if(!e)throw new Error(`cannot write ${t}`);const n=await e.createWritable();return new WritableStream({write:r=>n.write(r),close:()=>n.close(),abort:r=>n.abort(r)})}async getFile(t){const e=await this.file(t);if(!e)throw new Error(`ENOENT: ${t}`);return e.getFile()}async delete(t){const e=$e(t),n=await this.dir(tt(e));if(n)try{await n.removeEntry(yt(e),{recursive:!0})}catch{}}async rename(t,e){const n=$e(t),r=$e(e);if(n===r)return;const a=await this.file(n);if(!a)throw new Error(`ENOENT: ${t}`);const o=await this.dir(tt(r),!0);if(!o)throw new Error(`cannot create ${tt(r)}`);const i=a;if(typeof i.move=="function"){await i.move(o,yt(r));return}await this.write(r,await this.read(n)),await this.delete(n)}async stat(t){const e=$e(t);if(e==="")return{kind:"directory",size:0,mtime:0};const n=await this.dir(tt(e));if(!n)return null;const r=yt(e);try{const o=await(await n.getFileHandle(r)).getFile();return{kind:"file",size:o.size,mtime:o.lastModified}}catch{}try{return await n.getDirectoryHandle(r),{kind:"directory",size:0,mtime:0}}catch{return null}}};function oc(){return typeof navigator<"u"&&!!navigator.storage?.getDirectory}var By=class ic extends ac{static async open(e={}){if(!oc())throw new Error("OPFS is not available in this environment");let n=await navigator.storage.getDirectory();const r=$e(e.path??"");for(const a of r.split("/").filter(Boolean))n=await n.getDirectoryHandle(a,{create:!0});return new ic(n,e.name??(r||"opfs"))}};function Ry(){return typeof window<"u"&&typeof window.showDirectoryPicker=="function"}var li=class Xr extends ac{static async pick(e={}){if(!Ry())throw new Error("The File System Access API is not available in this browser");const n=window.showDirectoryPicker,r=await n({mode:"readwrite",...e});return new Xr(r)}static fromHandle(e,n){return new Xr(e,n)}async hasPermission(e="readwrite"){const n=this.root;return n.queryPermission?await n.queryPermission({mode:e})==="granted":!0}async ensurePermission(e="readwrite"){if(await this.hasPermission(e))return!0;const n=this.root;return n.requestPermission?await n.requestPermission({mode:e})==="granted":!0}};const sc="rom-manager/library",_y="library";function Py(){try{return oc()}catch{return!1}}function Ny(){return typeof globalThis.showDirectoryPicker=="function"}const zy=new Set([".vfs",".roms",".meta"]);class lc{node=null;adapter=null;path="";storageKind="folder";get kind(){return this.storageKind}async initializeLibrary(e=sc){const n=await By.open({path:e});await this.attach(n,"library","library")}async attach(e,n,r){this.adapter=e,this.node=await yr.open(e),this.storageKind=n,this.path=r}async syncWith(e){return Iy(this.requireNode(),e.requireNode())}async initialize(){try{this.adapter=await li.pick()}catch(e){if(e instanceof DOMException&&e.name==="AbortError")return!1;throw e}return this.node=await yr.open(this.adapter),this.storageKind="folder",this.path=this.adapter.root.name||"Folder",!0}async initializeFromHandle(e){const n=li.fromHandle(e);return this.adapter=n,await n.ensurePermission()?(this.node=await yr.open(n),this.storageKind="folder",this.path=e.name||"Folder",!0):!1}getHandle(){return this.storageKind!=="folder"?null:this.adapter?this.adapter.root??null:null}getPath(){return this.path}getNode(){return this.node}requireNode(){if(!this.node)throw new Error("Storage not initialized");return this.node}async list(e=""){return(await this.requireNode().adapter.list(e)).filter(r=>!zy.has(r.name)).map(({name:r,path:a,kind:o})=>({name:r,path:a,kind:o})).sort((r,a)=>r.kind!==a.kind?r.kind==="directory"?-1:1:r.name.localeCompare(a.name))}async stat(e){return this.requireNode().stat(e)}async exists(e){return await this.stat(e)!==null}async readFile(e){return this.requireNode().read(e)}async readStream(e){return this.requireNode().readStream(e)}async*walkFiles(e=""){for(const n of await this.list(e))n.kind==="directory"?yield*this.walkFiles(n.path):yield n}async writeFile(e,n){await this.requireNode().write(e,n)}async createDirectory(e){await this.requireNode().mkdir(e)}async remove(e){await this.requireNode().delete(e)}async move(e,n){const r=this.requireNode();if((await r.stat(e))?.kind==="directory"){await r.mkdir(n);for(const o of await r.adapter.list(e))await this.move(o.path,`${n}/${o.name}`);await r.delete(e);return}await r.rename(e,n)}}class qe{static instance;constructor(){}static getInstance(){return qe.instance||(qe.instance=new qe),qe.instance}createNodeInstance(){return new lc}}const Ly=qe.getInstance(),Ty=Object.freeze(Object.defineProperty({__proto__:null,LIBRARY_ORIGIN_ID:_y,LIBRARY_PATH:sc,StorageNode:lc,StorageService:qe,canOpenFolders:Ny,isLibraryAvailable:Py,storageService:Ly},Symbol.toStringTag,{value:"Module"}));function Dy(t){const e=new Map;for(const n of t){const r=n.crc32.toUpperCase(),a=e.get(r);a?a.push(n):e.set(r,[n])}return e}function Fy(t,e){const n=e.get(t.crc.toUpperCase());return n?n.find(r=>t.size===void 0||r.size===t.size||r.path.toLowerCase().endsWith(".zip")||r.path.toLowerCase().endsWith(".7z"))??null:null}function jy(t,e){return t===0?"missing":t===e?"complete":"partial"}function Uy(t,e){const n=Dy(e),r=new Set;return{groups:t.map(o=>{const i=o.variants.map(c=>{const d=c.files.map(f=>{const h=Fy(f,n);return h&&r.add(h.path),{entry:f,local:h}});return{variant:c,status:jy(d.filter(f=>f.local).length,d.length),files:d}}),s=i.some(c=>c.status==="complete"),l=i.some(c=>c.status!=="missing");return{group:o,status:s?"complete":l?"partial":"missing",variants:i}}),unmatched:e.filter(o=>!r.has(o.path))}}function qy(t){return t.filter(e=>typeof e.crc=="string").map(e=>({name:e.name,fileName:e.fileName,size:e.size,crc:e.crc,md5:e.md5,sha1:e.sha1,region:e.region,videoStandard:e.videoStandard,cover:e.cover}))}class cc{static catalogues=new Map;static covers=new Map;static async catalogueOf(e){const n=this.catalogues.get(e);if(n)return n;const r=Xt.listSystemRoms(e).then(a=>dm(qy(a)));return this.catalogues.set(e,r),r.catch(()=>this.catalogues.delete(e)),r}static async coversOf(e){const n=this.covers.get(e);if(n)return n;const r=Xt.gameCoversOf(e).catch(()=>new Map);return this.covers.set(e,r),r}static async load(e,n,r){const a=await Xt.mediaOf(n);if(!a)throw new Error(`No dataset available for system: ${n}`);const[o,i]=await Promise.all([this.catalogueOf(n),vg(e,n,a,r)]);return Uy(o,i)}}const ja=Object.freeze(Object.defineProperty({__proto__:null,GameCatalogService:cc},Symbol.toStringTag,{value:"Module"})),Gy=8*1024*1024;function Qt(t,e){return t?`${V}/${t}/${e}`:`${V}/${e}`}class Qy{static listings=new WeakMap;static async entriesOf(e,n){const r=this.listings.get(e)??new Map;this.listings.set(e,r);const a=r.get(n);if(a)return a;const o=e.list(n?`${V}/${n}`:V).catch(()=>[]);return r.set(n,o),o}static forget(e,n){this.listings.get(e)?.delete(n)}static async storedCovers(e,n,r){const a={byRegion:{}};for(const o of await this.entriesOf(e,n)){const i=dl(o.name);!i||i.kind!==Fn||i.gameId!==r||(i.region?a.byRegion[i.region]=o.name:a.game=o.name)}return a}static async stored(e,n,r,a){for(const o of wl(r,a))try{const i=await e.readFile(Qt(n,o));return URL.createObjectURL(new Blob([i]))}catch{}}static async save(e,n,r,a,o){const i=jn(r,a);return await e.createDirectory(`${V}/${n}`),await e.writeFile(Qt(n,i),o),this.forget(e,n),i}static async download(e){try{const n=await fetch(e);if(!n.ok)return;const r=await n.blob();return r.size===0||r.size>Gy?void 0:new Uint8Array(await r.arrayBuffer())}catch{return}}static async cache(e,n,r,a,o=!1){return a.url?await this.write(e,n,[Bt(r,a)],a.url,o)>0:!!a.file}static async write(e,n,r,a,o=!1){const i=[];for(const l of r)(o||!await e.exists(Qt(n,l)))&&i.push(l);if(i.length===0)return r.length;const s=await this.download(a);if(!s)return r.length-i.length;await e.createDirectory(`${V}/${n}`);for(const l of i)await e.writeFile(Qt(n,l),s);return this.forget(e,n),r.length}static async cacheAll(e,n,r,a){const o=new Map;for(const s of bl(a)){const l=o.get(s.url)??[];l.push(s),o.set(s.url,l)}return(await Promise.all(Array.from(o,([s,l])=>this.write(e,n,l.map(c=>Bt(r,c)),s,!0)))).reduce((s,l)=>s+l,0)}static async resolve(e,n,r,a){if(!a)return;const o=await this.stored(e,n,r,a);if(o)return{url:o,stored:!0};if(a.url)return this.cache(e,n,r,a),{url:a.url,stored:!1}}}const Hy=Object.freeze(Object.defineProperty({__proto__:null,CoverService:Qy},Symbol.toStringTag,{value:"Module"})),Wy="rom-manager-handles",Vy=1,En="handles";function Ht(){return new Promise((t,e)=>{const n=indexedDB.open(Wy,Vy);n.onupgradeneeded=()=>{const r=n.result;r.objectStoreNames.contains(En)||r.createObjectStore(En,{keyPath:"id"})},n.onsuccess=()=>t(n.result),n.onerror=()=>e(n.error)})}function Wt(t,e){return t.transaction(En,e).objectStore(En)}class Jy{static async save(e){const n=await Ht();try{await new Promise((r,a)=>{const o=Wt(n,"readwrite").put(e);o.onsuccess=()=>r(),o.onerror=()=>a(o.error)})}finally{n.close()}}static async remove(e){const n=await Ht();try{await new Promise((r,a)=>{const o=Wt(n,"readwrite").delete(e);o.onsuccess=()=>r(),o.onerror=()=>a(o.error)})}finally{n.close()}}static async loadAll(){const e=await Ht();try{return await new Promise((n,r)=>{const a=Wt(e,"readonly").getAll();a.onsuccess=()=>n(a.result),a.onerror=()=>r(a.error)})}finally{e.close()}}static async clear(){const e=await Ht();try{await new Promise((n,r)=>{const a=Wt(e,"readwrite").clear();a.onsuccess=()=>n(),a.onerror=()=>r(a.error)})}finally{e.close()}}}const Xy=Object.freeze(Object.defineProperty({__proto__:null,HandleStoreService:Jy},Symbol.toStringTag,{value:"Module"}));function Ky(t){return t.slice(t.lastIndexOf("/")+1)}function Yy(t,e){const n=[];for(let r=t.lastIndexOf("/");r>e.length;r=t.lastIndexOf("/",r-1))n.push(t.slice(0,r));return n}function Zy(t){return t.fileName??t.name}function ev(t,e,n,r=new Map,a="cartridge"){const o=t?`${t}/`:"",i=[],s=new Set,l=new Set;for(const c of n.groups){if(c.status==="missing")continue;const d=c.group.id,f=[],h=[],y=new Set,u=new Set;for(const g of c.variants){const S=g.files.map(v=>{const p=v.local?.path,w=v.entry.crc;if(p===void 0||!p.startsWith(o))return{label:Zy(v.entry),crc:w};h.push(p);for(const b of g.variant.regions)y.add(b);s.add(p);for(const b of Yy(p,t))l.add(b);const A=p.includes("/")?p.slice(0,p.indexOf("/")):"",P=v.entry.fileName??v.entry.name,C=qn(A,a,c.group,g.variant,P),B=p===C;return{label:Ky(p),path:p,crc:w,isConsolidated:B}});S.some(v=>v.path)&&u.add(g.variant.key),f.push({key:g.variant.key,status:g.status,regions:g.variant.regions,videoStandards:g.variant.videoStandards,files:S,cover:$a(g.variant)})}h.length!==0&&i.push({kind:"group",key:`group:${d}`,id:d,label:d,title:c.group.title,status:c.status,variants:f,paths:h,covers:vl(c.group,r.get(yl(c.group)),u),presentRegions:Ct.filter(g=>y.has(g))})}for(const c of e)(c.kind==="file"?s.has(c.path):l.has(c.path))||i.push({kind:"entry",key:c.path,label:c.name,entry:c});return i}const tv=Object.freeze(Object.defineProperty({__proto__:null,buildWizardTree:ev},Symbol.toStringTag,{value:"Module"})),nv=1,en=t=>`${V}/${t}/index.json`,Ua=t=>`${V}/${t}/mods.json`,Kr=t=>new TextEncoder().encode(`${JSON.stringify(t,null,2)}
`);async function dc(t,e){try{return JSON.parse(new TextDecoder().decode(await t.readFile(e)))}catch{return}}async function fc(t,e){for(const n of[V,`${V}/${e}`])try{await t.createDirectory(n)}catch{}}const rv=/^[0-9A-F]{8}$/;function av(t){if(!t||typeof t!="object")return;const e=t;if(typeof e.sha1!="string"||!/^[0-9a-f]{40}$/.test(e.sha1)||e.format!=="ips"&&e.format!=="bps"&&e.format!=="ups"||typeof e.file!="string"||e.file!==`${e.sha1}.${e.format}`)return;const n=a=>typeof a=="string"&&rv.test(a)?a:void 0,r=a=>typeof a=="number"&&a>=0?a:void 0;return{sha1:e.sha1,name:typeof e.name=="string"&&e.name?e.name:e.sha1.slice(0,8),format:e.format,file:e.file,...n(e.sourceCrc)?{sourceCrc:n(e.sourceCrc)}:{},...n(e.targetCrc)?{targetCrc:n(e.targetCrc)}:{},...r(e.sourceSize)!==void 0?{sourceSize:r(e.sourceSize)}:{},...r(e.targetSize)!==void 0?{targetSize:r(e.targetSize)}:{},...typeof e.gameId=="string"&&e.gameId?{gameId:e.gameId}:{},addedAt:typeof e.addedAt=="string"?e.addedAt:new Date(0).toISOString()}}async function Ge(t,e){const n=await dc(t,Ua(e));return!n||!Array.isArray(n.mods)?[]:n.mods.flatMap(r=>av(r)??[])}async function tn(t,e,n){await fc(t,e),await t.writeFile(Ua(e),Kr({version:nv,mods:n}))}class Qe{static async read(e,n){return El(await dc(e,en(n)))}static async readAll(e){let n=[];try{n=(await e.list(V)).filter(a=>a.kind==="directory").map(a=>a.name)}catch{return[]}return(await Promise.all(n.map(a=>this.read(e,a)))).filter(a=>!!a)}static async write(e,n,r){const a=xl(n,r,await Ge(e,n));return await fc(e,n),await e.writeFile(en(n),Kr(a)),a}static async refresh(e,n){try{return await this.write(e,n,await cc.load(e,n))}catch{return}}static async refreshMany(e,n){for(const r of new Set(n))r&&await this.refresh(e,r)}static async updateMods(e,n){const r=await this.read(e,n);if(!r){await this.refresh(e,n);return}_a(r,await Ge(e,n)),r.generatedAt=new Date().toISOString(),await e.writeFile(en(n),Kr(r))}}const ov=Object.freeze(Object.defineProperty({__proto__:null,LibraryIndexService:Qe,indexPathOf:en,modsRegistryPathOf:Ua,readMods:Ge,writeMods:tn},Symbol.toStringTag,{value:"Module"})),hc=[".ips",".bps",".ups"];class he extends Error{constructor(e,n){super(n),this.code=e,this.name="PatchError"}}const iv=(()=>{const t=new Uint32Array(256);for(let e=0;e<256;e++){let n=e;for(let r=0;r<8;r++)n=n&1?3988292384^n>>>1:n>>>1;t[e]=n>>>0}return t})();function ft(t,e=0,n=t.length){let r=4294967295;for(let a=e;a<n;a++)r=iv[(r^t[a])&255]^r>>>8;return(r^4294967295)>>>0}const Je=t=>(t>>>0).toString(16).toUpperCase().padStart(8,"0"),nn=(t,e,n)=>String.fromCharCode(...t.subarray(e,e+n)),vr=(t,e)=>(t[e]|t[e+1]<<8|t[e+2]<<16|t[e+3]<<24)>>>0;function uc(t){const e=t.toLowerCase();return hc.some(n=>e.endsWith(n))}function pc(t){return t.length>=8&&nn(t,0,5)==="PATCH"?"ips":t.length>=16&&nn(t,0,4)==="BPS1"?"bps":t.length>=16&&nn(t,0,4)==="UPS1"?"ups":null}class qa{constructor(e,n){this.bytes=e,this.pos=n}byte(){if(this.pos>=this.bytes.length)throw new he("truncated","The patch ends too early");return this.bytes[this.pos++]}number(){let e=0,n=1;for(;;){const r=this.byte();if(e+=(r&127)*n,r&128)break;n*=128,e+=n}return e}}function Ga(t){const e=pc(t);if(!e)throw new he("not-a-patch","Not an IPS, BPS or UPS patch");if(e==="ips")return{format:e,sourceSize:null,targetSize:null,sourceCrc:null,targetCrc:null,valid:!0};const n=new qa(t,4),r=n.number(),a=n.number(),o=t.length-12;return{format:e,sourceSize:r,targetSize:a,sourceCrc:vr(t,o),targetCrc:vr(t,o+4),valid:ft(t,0,t.length-4)===vr(t,o+8)}}function sv(t,e){let n=new Uint8Array(t),r=t.length;const a=i=>{if(i<=n.length)return;const s=new Uint8Array(Math.max(i,n.length*2));s.set(n),n=s};let o=5;for(;;){if(o+3>e.length)throw new he("truncated","IPS without its EOF mark");if(nn(e,o,3)==="EOF"){o+=3;break}if(o+5>e.length)throw new he("truncated","IPS record cut short");const i=e[o]<<16|e[o+1]<<8|e[o+2],s=e[o+3]<<8|e[o+4];if(o+=5,s){if(o+s>e.length)throw new he("truncated","IPS record cut short");a(i+s),n.set(e.subarray(o,o+s),i),o+=s,r=Math.max(r,i+s)}else{if(o+3>e.length)throw new he("truncated","IPS record cut short");const l=e[o]<<8|e[o+1],c=e[o+2];o+=3,a(i+l),n.fill(c,i,i+l),r=Math.max(r,i+l)}}return o+3===e.length&&(r=e[o]<<16|e[o+1]<<8|e[o+2]),r>n.length&&a(r),n.slice(0,r)}function lv(t,e,n){const r=new qa(e,4);r.number(),r.number();const a=r.number();r.pos+=a;const o=new Uint8Array(n.targetSize??0),i=e.length-12;let s=0,l=0,c=0;const d=()=>new he("out-of-bounds","BPS reads or writes outside the ROM");for(;r.pos<i;){const f=r.number(),h=f%4,y=Math.floor(f/4)+1;if(s+y>o.length)throw d();if(h===0){if(s+y>t.length)throw d();o.set(t.subarray(s,s+y),s),s+=y}else if(h===1)for(let u=0;u<y;u++)o[s++]=r.byte();else{const u=r.number(),g=(u&1?-1:1)*Math.floor(u/2);if(h===2){if(l+=g,l<0||l+y>t.length)throw d();for(let S=0;S<y;S++)o[s++]=t[l++]}else{if(c+=g,c<0)throw d();for(let S=0;S<y;S++)o[s++]=o[c++]}}}return o}function cv(t,e,n){const r=new qa(e,4);r.number(),r.number();const a=new Uint8Array(n.targetSize??0);a.set(t.subarray(0,Math.min(t.length,a.length)));const o=e.length-12;let i=0;for(;r.pos<o;)for(i+=r.number();;){const s=r.byte();if(s===0){i++;break}i<a.length&&(a[i]^=s),i++}return a}function dv(t,e){const n=Ga(e);if(n.format==="ips")return sv(t,e);if(!n.valid)throw new he("damaged","The patch is damaged (its own CRC does not match)");if(ft(t)!==n.sourceCrc)throw new he("wrong-source",`The patch is for another ROM (expects CRC32 ${Je(n.sourceCrc)})`);const r=n.format==="bps"?lv(t,e,n):cv(t,e,n);if(ft(r)!==n.targetCrc)throw new he("wrong-result","The result is not the ROM the patch promises");return r}function mc(t){const e=t.slice(t.lastIndexOf("/")+1);return uc(e)?e.slice(0,e.lastIndexOf(".")):e}const fv=Object.freeze(Object.defineProperty({__proto__:null,PATCH_EXTENSIONS:hc,PatchError:he,applyPatch:dv,crc32:ft,crcHex:Je,formatOf:pc,isPatchName:uc,modNameOf:mc,parsePatch:Ga},Symbol.toStringTag,{value:"Module"})),xt=t=>`${V}/${t}/mods`;async function hv(t,e){for(const n of[V,`${V}/${e}`,xt(e)])try{await t.createDirectory(n)}catch{}}class gc{static list(e,n){return Ge(e,n)}static async import(e,n,r={}){const a={added:[],duplicates:[],rejected:[]},o=await Qe.readAll(e),i=new Map,s=async l=>{let c=i.get(l);return c||i.set(l,c=await Ge(e,l)),c};for(const l of n){const c=new Uint8Array(await l.arrayBuffer());let d;try{d=Ga(c)}catch(p){a.rejected.push({name:l.name,reason:p instanceof he&&p.code==="not-a-patch"?"not-a-patch":"damaged"});continue}if(!d.valid){a.rejected.push({name:l.name,reason:"damaged"});continue}const f=d.sourceCrc===null?void 0:Je(d.sourceCrc),h=f?Pa(o,f):void 0,y=h?.system??r.system;if(!y){a.rejected.push({name:l.name,reason:"no-system"});continue}const u=h?.gameId??(r.system===y?r.gameId:void 0),g=(await Dn(c.buffer)).toLowerCase(),S=await s(y);if(S.some(p=>p.sha1===g)){a.duplicates.push(l.name);continue}const v={sha1:g,name:mc(l.name),format:d.format,file:`${g}.${d.format}`,...f?{sourceCrc:f}:{},...d.targetCrc!==null?{targetCrc:Je(d.targetCrc)}:{},...d.sourceSize!==null?{sourceSize:d.sourceSize}:{},...d.targetSize!==null?{targetSize:d.targetSize}:{},...u?{gameId:u}:{},addedAt:new Date().toISOString()};await hv(e,y),await e.writeFile(`${xt(y)}/${v.file}`,c),S.push(v),a.added.push({name:v.name,system:y,...u?{gameId:u}:{}})}for(const[l,c]of i)a.added.some(d=>d.system===l)&&(await tn(e,l,c),await Qe.updateMods(e,l));return a}static async update(e,n,r,a){const i=(await Ge(e,n)).map(s=>{if(s.sha1!==r)return s;const l={...s},c=a.name?.trim();return c&&(l.name=c),"gameId"in a&&(a.gameId?l.gameId=a.gameId:delete l.gameId),l});return await tn(e,n,i),await Qe.updateMods(e,n),i}static async remove(e,n,r){const a=await Ge(e,n),o=a.find(s=>s.sha1===r),i=a.filter(s=>s.sha1!==r);return await tn(e,n,i),o&&await e.remove(`${xt(n)}/${o.file}`).catch(()=>{}),await Qe.updateMods(e,n),i}static read(e,n,r){return e.readFile(`${xt(n)}/${r.file}`)}}const uv=Object.freeze(Object.defineProperty({__proto__:null,ModService:gc,modsDirOf:xt},Symbol.toStringTag,{value:"Module"})),pv=["megadrive","snes","gba","neogeo"],Oe=t=>typeof t=="object"&&t!==null,ci=/^[0-9a-f]{40}$/,di=t=>typeof t=="string"&&/^[0-9a-f]{40}\.[a-z0-9]{1,5}$/.test(t);function mv(t){if(!Oe(t)||!Oe(t.games))return;const e={};for(const[r,a]of Object.entries(t.games)){if(!Oe(a)||!Array.isArray(a.versions))continue;const o=a.versions.flatMap(i=>!Oe(i)||typeof i.sha1!="string"||!ci.test(i.sha1)||!di(i.file)?[]:[{sha1:i.sha1,file:i.file,...typeof i.name=="string"?{name:i.name}:{},...typeof i.crc32=="number"?{crc32:i.crc32>>>0}:{},...i.platform==="gba"||i.platform==="gb"||i.platform==="gbc"?{platform:i.platform}:{},...Oe(i.dat)&&typeof i.dat.name=="string"?{dat:{name:i.dat.name}}:{}}]);o.length!==0&&(e[r]={title:typeof a.title=="string"&&a.title?a.title:r,renamed:a.renamed===!0,versions:o})}const n=Object.entries(Oe(t.mods)?t.mods:{}).flatMap(([r,a])=>!ci.test(r)||!Oe(a)||!di(a.file)?[]:[{sha1:r,name:typeof a.name=="string"&&a.name?a.name:r.slice(0,8),file:a.file,gameId:typeof a.gameId=="string"&&a.gameId?a.gameId:null}]);return{games:e,mods:n,bios:Oe(t.bios)}}const gv=t=>t.slice(t.lastIndexOf("."));function yv(t,e,n){const r=gv(n.file);return n.dat?.name?`${fi(n.dat.name)}${r}`:t==="neogeo"&&n.name?`${fi(n.name)}${r}`:`${ct(e.title)}${r}`}function fi(t){return t.replace(/[\\/:*?"<>|]/g,"").trim()||"rom"}function wr(t,e){if(t==="megadrive")return"MegaDrive";if(t==="snes")return"SNES";if(t==="neogeo")return"NEOGEO";const n=e.platform??(/\.gbc$/i.test(e.file)?"gbc":/\.gb$/i.test(e.file)?"gb":"gba");return n==="gb"?"GAMEBOY":n==="gbc"?"GBC":"GBA"}const Yr=`${V}/migrated-from-play-germade.json`;function yc(){return{async read(t,e){try{let n=await navigator.storage.getDirectory();const r=["library",t,...e.split("/")];for(const o of r.slice(0,-1))n=await n.getDirectoryHandle(o);const a=await(await n.getFileHandle(r[r.length-1])).getFile();return new Uint8Array(await a.arrayBuffer())}catch{return}}}}async function vv(t,e){const n=await t.read(e,"index.json");if(n)try{return mv(JSON.parse(new TextDecoder().decode(n)))}catch{return}}const wv=()=>({added:[],duplicates:[],rejected:[]});class bv{static async done(e){return e.exists(Yr)}static async run(e,n=yc(),r){if(await this.done(e))return;const a=new Map;for(const g of pv){const S=await vv(n,g);S&&(Object.keys(S.games).length>0||S.mods.length>0||S.bios)&&a.set(g,S)}if(a.size===0)return;const o={at:new Date().toISOString(),placed:0,copied:0,already:0,missing:0,mods:wv(),renamed:0,systems:[]},i=[];for(const[g,S]of a){for(const[v,p]of Object.entries(S.games))for(const w of p.versions){const A=await n.read(g,`roms/${w.file}`);if(!A){o.missing+=1;continue}const P=w.crc32!==void 0?Je(w.crc32):Je(ft(A)),C=new File([A],yv(g,p,w));i.push({system:g,gameId:v,game:p,version:w,file:C,crc:P})}if(S.bios){const v=await n.read(g,"bios/neogeo.zip");if(v){const p={title:"neogeo",versions:[]},w={sha1:"0".repeat(40),file:`${"0".repeat(40)}.zip`,name:"neogeo"};i.push({system:g,gameId:"neogeo",game:p,version:w,file:new File([v],"neogeo.zip"),crc:Je(ft(v))})}else o.missing+=1}}const s=i.length;r?.({done:0,total:s});const l=s>0?await Wr.identify(e,i.map(g=>g.file)):[],c=await Wr.apply(e,l),d=new Map,f=new Set;let h=0;for(const g of i){const S=Ta(g.file,l),v=S.filter(dt).map(w=>w.path).filter(w=>c.includes(w)),p=S.filter(w=>w.match&&w.taken&&w.path).map(w=>w.path);if(v.length>0)o.placed+=1,d.set(g,v);else if(p.length>0)o.already+=1,d.set(g,p);else{const w=wr(g.system,g.version),A=`${w}/${g.file.name}`;if(await e.exists(A))o.already+=1;else{try{await e.createDirectory(w)}catch{}await e.writeFile(A,new Uint8Array(await g.file.arrayBuffer())),o.copied+=1}d.set(g,[A])}for(const w of d.get(g)??[])f.add(w.slice(0,w.indexOf("/")));r?.({done:++h,total:s})}await Qe.refreshMany(e,f);const y=await Qe.readAll(e);for(const[g,S]of a)for(const v of S.mods){const p=await n.read(g,`patches/${v.file}`);if(!p){o.missing+=1;continue}const w=v.file.slice(v.file.lastIndexOf(".")),A=new File([p],`${v.name}${w}`),P=v.gameId?i.filter(O=>O.system===g&&O.gameId===v.gameId):[],C=P.map(O=>Pa(y,O.crc)).find(Boolean),B=P[0]?wr(g,P[0].version):wr(g,{file:v.file}),b=await gc.import(e,[A],C??{system:B});o.mods.added.push(...b.added),o.mods.duplicates.push(...b.duplicates),o.mods.rejected.push(...b.rejected)}const u=new ba(e);for(const g of i)if(g.game.renamed)for(const S of d.get(g)??[]){const v=await u.read(S)??Is();await u.write(S,{...v,title:g.game.title}),o.renamed+=1}o.systems=[...f].sort();try{await e.createDirectory(V)}catch{}return await e.writeFile(Yr,new TextEncoder().encode(`${JSON.stringify(o,null,2)}
`)),o}}const kv=Object.freeze(Object.defineProperty({__proto__:null,MIGRATION_MARKER:Yr,PlayGermadeMigration:bv,opfsOldLibrary:yc},Symbol.toStringTag,{value:"Module"})),Av=`<!--
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
`,Sv={"./Header.html":wu,"./WelcomePanel.html":Ru,"./FileTree.html":fp,"./RomDetails.html":Pm,"./MobilePanels.html":qm,"./PreferencesModal.html":Jm,"./MediaDropModal.html":Ng,"./RomIntakeModal.html":Dg,"./OrganizePanel.html":qg,"../components/ConfirmModal.html":Ln,"../lib/StorageService":Ty,"../lib/LibraryStorageService":Bl,"../lib/RomLibraryService":ka,"../lib/GameCatalogService":ja,"../lib/CoverService":Hy,"../lib/OrganizeService":Og,"../lib/RomIntakeService":Da,"../lib/ROMDatasetService":Ve,"../lib/WizardConfigService":Jh,"../lib/ThemeService":Us,"../lib/I18nService":zs,"../lib/HandleStoreService":Xy,"../helpers/wizard-tree":tv,"../helpers/rom-covers":Ma,"../helpers/rom-media":Oa,"../helpers/rom-organize":xg,"../lib/StoreService":Kh,"../lib/ui-state":de,"../lib/LibraryIndexService":ov,"../lib/ModService":uv,"../helpers/library-index":Na,"../helpers/patch":fv,"../lib/host":Ol,"../lib/PlayGermadeMigration":kv},xv="views/ROMExplorer.html";let vc;vc=new J(Av,{modules:Sv,filename:xv});const Ev=vc,Iv=`<!--
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
`,Cv={"./ROMExplorer.html":Ev,"../lib/ThemeService":Us,"../lib/I18nService":zs},Ov="views/App.html";let wc;wc=new J(Iv,{modules:Cv,filename:Ov});const $v=wc;$v.mount("#app");
