(()=>{"use strict";const e=()=>"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(e=>{const t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)})),t=e=>"string"!=typeof e?"":`${e[0].toUpperCase()}${e.slice(1)}`;class s{#e=0;#t;#s;#a;#i;constructor(e={}){this.#t=document.createElement("div"),this.#t.classList.add("progressbar-wrapper"),this.#s=document.createElement("div"),this.#s.setAttribute("role","progressbar"),this.#s.setAttribute("aria-label",e.l10n.uploadProgress),this.#s.classList.add("progressbar-background"),this.#t.appendChild(this.#s),this.#a=document.createElement("div"),this.#a.classList.add("progressbar-fill"),this.#s.appendChild(this.#a),this.#i=document.createElement("span"),this.#i.classList.add("progress-value"),this.#t.appendChild(this.#i),this.setProgress(0)}getDOM(){return this.#t}show(){this.#t.classList.remove("display-none")}hide(){this.#t.classList.add("display-none")}setProgress(e){"number"==typeof e&&(e=Math.max(0,Math.min(e,100)),this.#e=e,this.#t.setAttribute("aria-valuenow",this.#e),this.#a.style.width=`${this.#e}%`,this.#i.innerText=`${Math.floor(this.#e)}%`)}getProgress(){return this.#e}}class a{#n=!1;#l;#o;#r;#d;#c;#h;#p;#m;#u;#g;constructor(e={},t={}){this.#l=e,this.#l.selectorDropzone&&(this.#o=t??{},this.#o.upload=this.#o.upload??(()=>{}),this.#o.reset=this.#o.reset??(()=>{}),this.#b())}#b(){if(this.#r=document.querySelector(this.#l.selectorDropzone),!this.#r)return;if(this.#r.innerHTML="",this.#r.addEventListener("click",(e=>{this.#f(e)})),this.#r.addEventListener("dragover",(e=>{this.#x(e)})),this.#r.addEventListener("dragleave",(()=>{this.#v()})),this.#r.addEventListener("drop",(e=>{this.#y(e)})),this.#c=document.createElement("div"),this.#c.classList.add("upload-wrapper"),this.#l.sessionKeyName&&this.#l.sessionKeyValue){const e=document.createElement("input");e.type="hidden",e.name=this.#l.sessionKeyName,e.value=this.#l.session,this.#c.append(e)}this.#h=document.createElement("input"),this.#h.classList.add("file-input"),this.#h.id="file-input",this.#h.type="file",this.#h.accept=".h5p",this.#h.addEventListener("change",(e=>{this.#L(e)})),this.#c.append(this.#h);const e=document.createElement("label");e.classList.add("upload-button"),e.htmlFor="file-input",e.innerText=this.#l.l10n.uploadYourH5Pfile,this.#c.append(e),this.#r.append(this.#c),this.#p=document.createElement("div"),this.#p.classList.add("file-info"),this.#p.classList.add("display-none");const t=document.createElement("div");t.classList.add("file-data"),this.#p.append(t),this.#m=document.createElement("div"),this.#m.classList.add("file-name"),t.append(this.#m),this.#u=document.createElement("div"),this.#u.classList.add("file-value"),t.append(this.#u);const a=document.createElement("button");a.classList.add("remove-button"),a.setAttribute("aria-label",this.#l.l10n.removeFile),a.addEventListener("click",(()=>{this.reset()})),this.#p.append(a),this.#r.append(this.#p),this.#g=new s({l10n:{uploadProgress:this.#l.l10n.uploadProgress}}),this.hideProgress(),this.#r.append(this.#g.getDOM()),this.#d=document.createElement("p"),this.#d.classList.add("status"),this.#d.innerText=this.#l.l10n.orDragTheFileHere,this.#r.append(this.#d)}#E(e={}){e.name&&(this.#w(),this.#m.innerText=e.name,e.size&&(this.#u.innerText=`${(e.size/1024).toFixed(2)} KB`),this.#c.classList.add("display-none"),this.#p.classList.remove("display-none"))}#k(){this.#n=!1,this.#r.removeAttribute("disabled")}#w(){this.#n=!0,this.#r.setAttribute("disabled","disabled")}reset(){this.#p.classList.add("display-none"),this.#c.classList.remove("display-none"),this.setStatus(this.#l.l10n.orDragTheFileHere),this.#k(),this.#o.reset()}setStatus(e="",t=""){this.#d.classList.toggle("display-none",!e),this.#d.classList.toggle("error","error"===t),this.#d.classList.toggle("pulse","pulse"===t),this.#d.innerText=e}showProgress(){this.#g.show()}hideProgress(){this.#g.hide()}setProgress(e){this.#g.setProgress(e)}#f(e){this.#n||e.target===this.#r&&(this.#h.click(),this.#r.classList.add("active"))}#x(e){e?.preventDefault(),this.#r.classList.add("dragging")}#v(){this.#r.classList.remove("dragging")}#y(e){e.preventDefault(),e?.dataTransfer.files.length&&(this.#r.classList.remove("dragging"),this.upload(e.dataTransfer.files))}#L(e){this.#S(e.target.files[0])}upload(e){this.#h.files=e,this.#S(this.#h.files[0])}#S(e){e&&(this.#E(e),this.#h.value="",this.#r.classList.remove("active"),this.#o.upload(e))}}const i=100,n={5:"good",10:"neutral",100:"bad"};class l{#t;#M;#C;#l;constructor(e={}){this.#l=e,"number"==typeof e.size&&(e.size=`${e.size}px`),this.#l.size=e.size??"5rem",this.#l.strokeWidth=e.strokeWidth??"0.5rem",this.#l.max=e.max??i,this.#t=document.createElement("div"),this.#t.classList.add("progress-circle-wrapper"),this.#t.style.setProperty("--size",this.#l.size),this.#t.style.setProperty("--stroke-width",this.#l.strokeWidth);const t=document.createElementNS("http://www.w3.org/2000/svg","svg");t.classList.add("progress-circle"),t.setAttribute("width","100%"),t.setAttribute("height","100%"),this.#t.append(t);const s=document.createElementNS("http://www.w3.org/2000/svg","circle");s.setAttribute("class","progress-circle-background"),t.append(s);const a=document.createElementNS("http://www.w3.org/2000/svg","circle");a.setAttribute("class","progress-circle-foreground"),t.append(a),this.setColor(this.#l.color),this.#M=document.createElement("span"),this.#M.classList.add("progress-circle-value"),this.setValue(this.#l.value,this.#l.max,this.#l.percentage),this.#t.append(this.#M),this.#C=document.createElement("span"),this.#C.classList.add("progress-circle-label"),this.setLabel(this.#l.label,this.#l.link),this.#t.append(this.#C)}getDOM(){return this.#t}setValue(e,t=100,s=!0){"number"==typeof e&&(("number"!=typeof t||t<0)&&(t=i),"boolean"!=typeof s&&(s=!0),e=Math.max(0,Math.min(t,e)),s&&(e=e/t*i),e=Math.round(e),this.#l.value=e,s?this.#t.style.setProperty("--progress",e):this.#t.style.setProperty("--progress",e/t*i),this.#t.classList.toggle("empty",0===e),this.#M.innerText=s?`${e}%`:`${e}`,0===e?this.setColor("transparent"):this.setColor(this.#l.color))}setLabel(e,t){"string"==typeof e&&("string"!=typeof t?this.#C.innerText=e:this.#C.innerHTML=`<a href="${t}">${e}</a>`)}setColor(e){if("string"==typeof e&&(this.#t.style.setProperty("--stroke-color",e),"transparent"!==e&&"status"!==e&&(this.#l.color=e),"status"===e)){const e=this.#l.value/this.#l.max*i;for(const t in n)if(e<=t){this.#t.style.setProperty("--stroke-color",`var(--color-status-${n[t]})`);break}}}}class o{#t;#I;#T={};constructor(e={}){this.#t=document.createElement("div"),this.#t.classList.add("results-row");const t=document.createElement("div");t.classList.add("overview"),this.#t.append(t);const s=document.createElement("div");s.classList.add("overview-header"),s.textContent=e.header,t.append(s),this.#I=document.createElement("div"),this.#I.classList.add("overview-value"),this.#I.textContent=e.value,t.append(this.#I);const a=document.createElement("div");a.classList.add("progress-circles"),this.#t.append(a),e.items.forEach((e=>{const t=new l({id:e.id,value:e.value,max:e.max,percentage:e.percentage,label:e.label,link:e.link,color:e.color});a.append(t.getDOM()),this.#T[e.id]=t}))}getDOM(){return this.#t}update(e={}){"number"==typeof e.messageCount&&e.items&&(this.#I.textContent=e.messageCount,Object.keys(this.#T).forEach((t=>{const s=e.items.find((e=>e.id===t));s?this.#T[t].setValue(s.value,s.max,s.percentage):this.#T[t].setValue(0,e.messageCount,!1)})))}}class r{#t;#A;#l;#o;#$;constructor(e={},t={}){this.#l=e,this.#o=t,this.#o.onResultsTypeChanged=this.#o.onResultsTypeChanged??(()=>{}),this.#o.onDownload=this.#o.onDownload??(()=>{}),this.#$=this.#D(this.#l.results),this.#t=document.createElement("div"),this.#t.classList.add("results"),this.#t.classList.add("block-visible");const s=document.createElement("div");s.classList.add("results-header"),s.textContent=e.l10n.results,this.#t.append(s),this.#A=document.createElement("div"),this.#A.classList.add("results-box"),this.#t.append(this.#A),this.#A.append(this.#$[Object.keys(this.#l.results)[0]].getDOM()),this.#A.append(this.#O())}getDOM(){return this.#t}update(e){for(const t in e)this.#$[t].update({messageCount:e[t].value,items:e[t].items})}#D(e){const t={};for(const s in e)t[s]=new o(e[s]);return t}#O(){const e=document.createElement("div");e.classList.add("navigation-row");const s=document.createElement("select");s.name="select-results-type",s.classList.add("select-results-type"),s.addEventListener("change",(e=>{this.#B(e)})),e.append(s);for(const e in this.#l.results){const a=document.createElement("option");a.value=e;const i=this.#l.results[e].type,n=t(this.#l.results[e].label??e);a.textContent="filter"===i?`${this.#l.l10n.filterBy}: ${n}`:"group"===i?`${this.#l.l10n.groupBy}: ${n}`:n,s.append(a)}const a=document.createElement("button");return a.classList.add("button-download"),a.textContent=this.#l.l10n.download,a.addEventListener("click",(()=>{this.#o.onDownload()})),e.append(a),e}#B(e){this.#A.querySelector(".results-row").remove(),this.#A.prepend(this.#$[e.target.value].getDOM()),this.#o.onResultsTypeChanged(e.target.value)}}class d{#l;#t;#o;#z=!1;#F=!1;constructor(e={},t={}){this.#l=e,this.#l.l10n=this.#l.l10n??{},this.#l.l10n.expandAllMessages=this.#l.l10n.expandAllMessages??"Expand all messages",this.#l.l10n.collapseAllMessages=this.#l.l10n.collapseAllMessages??"Collapse all messages",this.#o=t,this.#o.expandedStateChanged=this.#o.expandedStateChanged??(()=>{}),this.#t=document.createElement("button"),this.#t.classList.add("expand-button"),this.#t.addEventListener("click",(()=>{this.toggle()})),this.#R()}getDOM(){return this.#t}toggle(e,t=!1){("boolean"==typeof e?e:!this.#z)?this.#P(t):this.#R(t)}#R(e=!1){this.#t.innerHTML=this.#l.l10n.expandAllMessages,this.#t.classList.remove("expanded"),this.#z=!1,e||this.#o.expandedStateChanged(this.#z)}#P(e=!1){this.#t.innerHTML=this.#l.l10n.collapseAllMessages,this.#t.classList.add("expanded"),this.#z=!0,e||this.#o.expandedStateChanged(this.#z)}setWidth=()=>{if(this.#F)return;const e=document.createElement("div");e.classList.add("offsite");const t=document.createElement("button");t.classList.add("expand-button"),t.innerHTML=this.#l.l10n.expandAllMessages,e.append(t);const s=document.createElement("button");s.classList.add("expand-button"),s.classList.add("expanded"),s.innerHTML=this.#l.l10n.collapseAllMessages,e.append(s),document.body.append(e),document.fonts.ready.then((()=>{const a=t.getBoundingClientRect().width,i=s.getBoundingClientRect().width;this.fixedButtonWidth=Math.ceil(Math.max(a,i)),this.#t.style.width=`${this.fixedButtonWidth}px`,this.#F=!0,e?.remove()}))};show(){this.#t.classList.remove("display-none")}hide(){this.#t.classList.add("display-none")}}class c{#t;#V;constructor(e={}){if(this.#t=document.createElement("div"),this.#t.classList.add("message-content"),this.#V=e.message.subContentId,(e=JSON.parse(JSON.stringify(e))).message.category){const t=document.createElement("div");t.classList.add("message-content-item");const s=document.createElement("p");s.classList.add("message-content-item-label"),s.innerText=e.translations.category,t.append(s);const a=document.createElement("p");a.classList.add("message-content-item-text");let i=e.translations[e.message.category];e.message.type&&(i=`${i} > ${e.translations[e.message.type]}`),a.innerText=i,t.append(a),this.#t.append(t)}if(e.message.recommendation){const t=document.createElement("div");t.classList.add("message-content-item");const s=document.createElement("p");s.classList.add("message-content-item-label"),s.innerText=e.translations.recommendation,t.append(s);const a=document.createElement("p");a.classList.add("message-content-item-text"),a.innerText=e.message.recommendation,t.append(a),this.#t.append(t)}if("libreText"===e.message.type){const t=`<h3>${e.translations.status}</h3><p>${e.message.details.status}</p>`;e.message.details.description=`${e.message.details.description}${t}`;const s=`<h3>${e.translations.licenseNote}</h3><p>${e.message.details.licenseNote}</p>`;e.message.details.description=`${e.message.details.description}${s}`;this.#N(e.message.details.description).forEach((e=>{const t=document.createElement("div");t.classList.add("message-content-item");const s=document.createElement("p");s.classList.add("message-content-item-label"),s.innerText=e.headline,t.append(s);const a=document.createElement("div");a.classList.add("message-content-details"),a.innerHTML=e.html,t.append(a),this.#t.append(t)}))}else if(e.message.details){const t=document.createElement("div");t.classList.add("message-content-item");const s=document.createElement("p");s.classList.add("message-content-item-label"),s.innerText=e.translations.details,t.append(s);const a=document.createElement("ul");a.classList.add("message-content-details"),Object.keys(e.message.details).forEach((t=>{if("reference"===t||"base64"===t)return;const s=document.createElement("li");s.classList.add("message-content-detail"),s.innerText=`${t}: ${e.message.details[t]}`,a.append(s)})),t.append(a),this.#t.append(t)}if(e.message.details?.base64){const t=document.createElement("div");t.classList.add("message-content-item");const s=document.createElement("p");s.classList.add("message-content-item-label"),s.innerText=e.translations.image,t.append(s);const a=document.createElement("img");a.classList.add("message-content-image"),a.src=e.message.details.base64,t.append(a),this.#t.append(t)}if(e.message.details?.reference){const t=document.createElement("a");t.classList.add("message-content-reference"),t.href=e.message.details.reference,t.target="_blank",t.innerText=e.translations.learnMore,this.#t.append(t)}}getDOM(){return this.#t}getSubContentId(){return this.#V}#N(e){const t=(new DOMParser).parseFromString(e,"text/html").querySelectorAll("h2, h3, h4, h5, h6"),s=[];return t.forEach(((e,t)=>{const a=e.textContent.trim();let i="",n=e.nextElementSibling;for(;n&&!n.matches("h2, h3, h4, h5, h6");)i+=n.outerHTML,n=n.nextElementSibling;s.push({headline:a,html:i.trim()})})),s}}class h{#t;#H;#U;#W;#K=!0;#o;constructor(t={},s={}){this.#o=s,this.#o.expandedStateChanged=this.#o.expandedStateChanged??(()=>{}),this.#t=document.createElement("div"),this.#t.classList.add("message-accordion-panel");const a=e(),i=e(),n=document.createElement("div");n.classList.add("message-accordion-panel-header"),n.setAttribute("Id",a);const l=document.createElement("span");if(l.classList.add("message-accordion-panel-icon"),n.append(l),this.#U=document.createElement("button"),this.#U.classList.add("message-accordion-panel-button"),this.#U.setAttribute("aria-expanded","false"),this.#U.setAttribute("aria-controls",i),this.#U.innerText=t.message.summary,n.append(this.#U),t.message.level&&t.translations[t.message.level]){const e=document.createElement("span");e.classList.add("message-accordion-panel-level"),e.classList.add(t.message.level),e.innerText=t.translations[t.message.level],n.append(e)}this.#t.append(n),this.#H=document.createElement("div"),this.#H.setAttribute("Id",i),this.#H.classList.add("message-accordion-panel-content-grid"),this.#H.setAttribute("role","region"),this.#H.setAttribute("aria-labelledby",a),this.#H.setAttribute("hidden","");const o=document.createElement("div");o.classList.add("message-accordion-panel-content-wrapper"),this.#W=new c({message:t.message,translations:t.translations}),o.append(this.#W.getDOM()),this.#H.append(o),this.#t.append(this.#H),this.#t.addEventListener("click",(()=>{this.toggle()}))}getDOM(){return this.#t}isVisible(){return this.#K}isExpanded(){return"true"===this.#U.getAttribute("aria-expanded")}toggle(e){("boolean"==typeof e?e:"true"!==this.#U.getAttribute("aria-expanded"))?this.expand():this.collapse()}filter(e){!e||e.includes(this.#W.getSubContentId())?this.show():(this.collapse(),this.hide())}show(){this.#t.classList.remove("display-none"),this.#K=!0}hide(){this.#t.classList.add("display-none"),this.#K=!1}expand(){this.#H.removeAttribute("hidden"),this.#U.setAttribute("aria-expanded","true"),this.#o.expandedStateChanged(!0)}collapse(){this.#H.setAttribute("hidden",""),this.#U.setAttribute("aria-expanded","false"),this.#o.expandedStateChanged(!1)}}class p{#t;#q;#G;#Y=[];constructor(e={}){this.#t=document.createElement("div"),this.#t.classList.add("message-accordion");const t=document.createElement("a");t.classList.add("message-accordion-header-anchor"),t.setAttribute("name",`${e.type}`),this.#t.append(t);const s=document.createElement("div");s.classList.add("message-accordion-header"),this.#t.append(s);const a=document.createElement("p");a.classList.add("message-accordion-header-text"),a.innerText=e.header,s.append(a),this.#q=new d({l10n:{expandAllMessages:e.l10n.expandAllMessages,collapseAllMessages:e.l10n.collapseAllMessages}},{expandedStateChanged:e=>{this.#Y.forEach((t=>{t.toggle(e)}))}}),this.#q.setWidth(),s.append(this.#q.getDOM());const i=document.createElement("ul");i.classList.add("message-accordion-panels-list"),this.#t.append(i),e.messages.forEach((t=>{const s=document.createElement("li");s.classList.add("message-accordion-panels-list-item");const a=new h({message:t,translations:e.translations},{expandedStateChanged:e=>{this.#Y.every((e=>!e.isExpanded()))?this.#q.toggle(!1,!0):this.#q.toggle(!0,!0)}});s.append(a.getDOM()),this.#Y.push(a),i.append(s)})),this.#G=document.createElement("div"),this.#G.classList.add("message-accordion-all-filtered"),this.#G.classList.add("display-none"),this.#G.innerHTML=e.l10n.allFilteredOut,this.#t.append(this.#G)}getDOM(){return this.#t}filter(e){this.#Y.forEach((t=>{t.filter(e)})),this.#Y.some((e=>e.isVisible()))?(this.#q.show(),this.#G.classList.add("display-none")):(this.#q.hide(),this.#G.classList.remove("display-none"))}}class m{#t;#j=[];constructor(e={}){this.#t=document.createElement("div"),this.#t.classList.add("message-set"),e.sections.forEach((t=>{const s=e.messages.filter((s=>s[e.id]===t.id));if(!s.length)return;const a=new p({type:t.id,header:t.header,messages:s,translations:e.translations,l10n:{expandAllMessages:e.l10n.expandAllMessages,collapseAllMessages:e.l10n.collapseAllMessages,allFilteredOut:e.l10n.allFilteredOut}});this.#j.push(a),this.#t.append(a.getDOM())}))}getDOM(){return this.#t}filter(e){this.#j.forEach((t=>{t.filter(e)}))}show(){this.#t.classList.remove("display-none")}hide(){this.#t.classList.add("display-none")}}class u{#t;#J;constructor(e={}){this.#t=document.createElement("div"),this.#t.classList.add("message-sets"),this.#J={};for(const t in e.sets)e.sets[t]=e.sets[t].filter((e=>"string"==typeof e||"string"==typeof e?.id)).map((t=>("string"==typeof t&&(t={id:t}),t.header=t.header??e.translations[t.id],t))),e.sets[t].length||delete e.sets[t];if(0!==Object.keys(e.sets).length){for(const t in e.sets)this.#J[t]=new m({id:t,sections:e.sets[t],messages:e.messages,translations:e.translations,l10n:{expandAllMessages:e.l10n.expandAllMessages,collapseAllMessages:e.l10n.collapseAllMessages,allFilteredOut:e.l10n.allFilteredOut}}),this.#t.append(this.#J[t].getDOM());this.show(Object.keys(this.#J)[0])}}getDOM(){return this.#t}show(e){if(this.#J[e])for(const t in this.#J)t===e?this.#J[t].show():this.#J[t].hide()}filter(e){for(const t in this.#J)this.#J[t].filter(e)}}class g{#_;#X;#Q;constructor(e={}){this.#_=e.messages,this.#X=e.translations,this.#Q=e.title}get(e={}){return e.type=e.type??"markdown","markdown"===e.type?this.#Z():""}download(e={}){e.type=e.type??"markdown";const t=document.createElement("a");if("markdown"===e.type){if(t.href=`data:text/plain;charset=utf-8,${encodeURIComponent(this.#Z())}`,"string"==typeof e.filename&&e.filename.length>0)t.download=e.filename;else{const e=(new Date).toISOString().split(".")[0].replace(/[-T:]/g,"");t.download=`h5p-caretaker-report-${e}.md`}t.style.display="none",document.body.append(t),t.click(),t.remove()}}#Z(){let e=`# ${this.#Q}\n\n`;const s=["error","warning","info"].filter((e=>this.#_.some((t=>t.level===e)))).map((e=>({headline:t(this.#X[e]),messages:this.#_.filter((t=>t.level===e))}))).reduce(((e,t)=>`${e}${`## ${t.headline}\n\n`}${t.messages.map((e=>this.#ee(e))).join("\n")}\n\n`),"");return`${e}${s}`}#ee(e){let s=`### ${e.summary}\n\n`;if(s=`${s}${`#### ${t(this.#X.category)}\n${this.#X[e.category]} > ${this.#X[e.type]}\n`}\n`,e.recommendation){s=`${s}${`#### ${t(this.#X.recommendation)}\n${e.recommendation}\n`}\n`}if(e.details){let a=`#### ${t(this.#X.details)}\n`;for(const t in e.details)"base64"!==t&&(a="libreText"!==e.type||"description"!==t?`${a}* ${t}: ${e.details[t]}\n`:`${a}* ${this.#X[t]}: ${this.#te(e.details[t])}\n`);s=`${s}${a}`}return s}#te(e){e=e.replace(/<\/h[1-6]>/g,": ").replace(/<\/li>\n*<\/ul>/g," ").replace(/<\/li>/g,", ").replace(/\r?\n|\r/g," ");const t=document.createElement("div");return t.innerHTML=e,(t.textContent||t.innerText||"").replace(/\s+/g," ")}}class b{#t;#se;#ae;#ie;#ne=!1;#le=!1;#K=!1;#oe=[];#l;constructor(e={}){this.#l=e,this.#t=document.createElement("li"),this.#t.classList.add("content-filter-item"),this.#t.setAttribute("role","treeitem"),this.#t.setAttribute("tabindex","-1"),this.#t.setAttribute("aria-checked","true");const t=document.createElement("div");if(t.classList.add("content-filter-item-wrapper"),this.#t.append(t),this.#ie=document.createElement("div"),this.#ie.classList.add("content-filter-item-panel"),t.append(this.#ie),this.#le=e.items?.length>0,this.#le){this.#ie.classList.add("expandable"),this.#se=document.createElement("button"),this.#se.classList.add("content-filter-item-expander"),this.#se.setAttribute("tabindex","-1"),this.#ie.append(this.#se),this.#t.setAttribute("aria-expanded",this.#ne);const s=document.createElement("ul");s.classList.add("content-filter-group"),s.setAttribute("role","group"),t.append(s),e.items.forEach((e=>{const t=new b(e);s.append(t.getDOM()),this.#oe.push(t)}))}else{const e=document.createElement("div");this.#ie.append(e)}this.#ae=document.createElement("input"),this.#ae.name=e.subcontentId,this.#ae.classList.add("content-filter-item-checkbox"),this.#ae.setAttribute("tabindex","-1"),this.#ae.type="checkbox",this.#ae.checked=!0,this.#ie.append(this.#ae);const s=document.createElement("span");s.classList.add("content-filter-item-label"),s.innerText=e.label,this.#ie.append(s)}getDOM(){return this.#t}getName(){return this.#l.name}getSubcontentId(){return this.#l.subcontentId}getLevel(){return this.#l.level}getLabel(){return this.#l.label}getItems(){return this.#oe}isSelected(){return this.#ae.checked}isExpandable(){return this.#le}isExpanded(){return this.#ne}isVisible(){return this.#K}toggleSelectedState(e){e=e??!this.#ae.checked,this.#ae.checked=e,this.#ae.dispatchEvent(new Event("change",{bubbles:!0})),this.#t.setAttribute("aria-checked",e)}toggleTabbable(e){this.#t.setAttribute("tabindex",e?"0":"-1")}focus(){this.#t.focus()}toggleBorder(e,t){["top","bottom","left"].includes(e)&&"boolean"==typeof t&&this.#ie.classList.toggle(`border-${e}`,t)}toggleExpandedState(e){this.#le&&(void 0===e&&(e=!this.#ne),this.#t.setAttribute("aria-expanded",e),this.#ne=e,this.#oe.forEach((t=>{t.toggleVisibility(e)})))}toggleVisibility(e){"boolean"==typeof e&&(this.#K=e,this.#oe.forEach((t=>{t.toggleVisibility(e&&this.isExpanded())})))}}class f{#t;#re;#de;#ce;#oe=[];#o={};#he;constructor(e={},t={}){const s=(e,t=0)=>{e.level=t,e.items?.forEach((e=>{s(e,t+1)}))};s(e.item),this.#ce=e.l10n,this.#o=t??{},this.#o.onFilterChange=this.#o.onFilterChange??(()=>{}),this.#t=document.createElement("div"),this.#t.classList.add("content-filter"),this.#t.classList.add("block-visible");const a=document.createElement("div");a.classList.add("content-filter-header");const i=document.createElement("span");i.classList.add("content-filter-header-intro"),i.innerHTML=this.#ce.filterByContent,a.append(i),this.#re=document.createElement("span"),this.#re.classList.add("content-filter-header-selected"),this.#re.innerHTML=this.#ce.showAll,a.append(this.#re),this.#de=document.createElement("button"),this.#de.classList.add("button-reset"),this.#de.classList.add("display-none"),this.#de.textContent=this.#ce.reset,this.#de.addEventListener("click",(()=>{this.#pe()})),a.append(this.#de),this.#t.append(a);const n=document.createElement("ul");n.classList.add("content-filter-tree"),n.setAttribute("role","tree"),n.setAttribute("aria-multiselectable","true"),n.setAttribute("aria-label",this.#ce.contentFilter),this.#t.append(n);const l=new b(e.item);l.toggleVisibility(!0),n.append(l.getDOM()),this.#oe=this.flattenItems(l),this.#t.addEventListener("click",(e=>{this.#f(e)})),this.#t.addEventListener("change",(e=>{this.#me(e)})),this.#t.addEventListener("keydown",(e=>{this.#ue(e)})),this.#he=this.#oe[0],this.#he.toggleTabbable(!0),this.#ge()}flattenItems(e,t=[]){return t.push(e),e.getItems().forEach((e=>{this.flattenItems(e,t)})),t}getDOM(){return this.#t}#f(e){if(e.target.classList.contains("content-filter-item-wrapper")||e.target.classList.contains("content-filter-item-checkbox"))return;const t=this.#oe.find((t=>t.getDOM()===e.target.closest(".content-filter-item")));t&&(t.toggleExpandedState(),this.#ge())}#me(e){e.target.classList.contains("content-filter-item-checkbox")&&this.#be()}#ue(e){if("Enter"!==e.code&&"Space"!==e.code||this.#he.toggleSelectedState(),"ArrowRight"===e.code){if(!this.#he.isExpandable())return;this.#he.isExpanded()?this.#fe(this.#xe()):this.#f(e)}else if("ArrowLeft"===e.code)this.#he.isExpandable()&&this.#he.isExpanded()?this.#f(e):this.#fe(this.#ve());else if("ArrowDown"===e.key)this.#fe(this.#xe());else if("ArrowUp"===e.key)this.#fe(this.#ye());else if("Home"===e.key)this.#fe(this.#Le()[0]);else if("End"===e.key)this.#fe(this.#Le().slice(-1)[0]);else if("*"===e.key){if(!this.#he.isExpandable())return;[...this.#he,...this.#Ee(this.#he)].filter((e=>e.isExpandable())).forEach((e=>{e.toggleExpandedState(!0)})),this.#ge()}else if(1===e.key.length&&e.key.match(/\S/)&&!e.ctrlKey&&!e.metaKey){const t=this.#Le().indexOf(this.#he),s=this.#Le().slice(t+1).find((t=>t.getLabel().toLowerCase().startsWith(e.key.toLowerCase())));s&&this.#fe(s)}}#be(){const e=this.#oe.filter((e=>e.isSelected()));let t;0===e.length?(t=this.#ce.showNone,this.#de.classList.remove("display-none")):e.length===this.#oe.length?(t=this.#ce.showAll,this.#de.classList.add("display-none")):(t=this.#ce.showSelected,this.#de.classList.remove("display-none")),this.#re.innerHTML=t,this.#o.onFilterChange(e.map((e=>e.getSubcontentId())))}#pe(){this.#oe.forEach((e=>{e.toggleSelectedState(!0)})),this.#be()}#fe(e){e&&(this.#he.toggleTabbable(!1),this.#he=e,this.#he.toggleTabbable(!0),this.#he.focus())}#Ee(e){if(!e||!e.isVisible())return[];const t=this.#Le(),s=t.indexOf(e),a=e.getLevel(),i=e=>{const t=[];for(const s of e){const e=s.getLevel();if(e===a)t.push(s);else if(e<a)break}return t};return[...i(t.slice(0,s).reverse()),...i(t.slice(s+1))]}#Le(){return this.#oe.filter((e=>e.isVisible()))}#ve(){const e=this.#Le();for(let t=e.indexOf(this.#he)-1;t>=0;t--)if(e[t].isExpandable())return e[t];return null}#ye(){const e=this.#Le(),t=e.indexOf(this.#he);return-1===t||0===t?null:e[t-1]}#xe(){const e=this.#Le(),t=e.indexOf(this.#he);return-1===t||t===e.length-1?null:e[t+1]}#ge(){this.#Le().forEach(((e,t,s)=>{e.toggleBorder("top",0===t||e.getLevel()<s[t-1].getLevel()),e.toggleBorder("bottom",t!==s.length-1&&e.getLevel()<=s[t+1].getLevel()),e.toggleBorder("left",0!==t)}))}}const x="locale",v={orDragTheFileHere:"or drag the file here",removeFile:"Remove file",selectYourLanguage:"Select your language",uploadProgress:"Upload progress",uploadYourH5Pfile:"Upload your H5P file",yourFileIsBeingChecked:"Your file is being checked",yourFileWasCheckedSuccessfully:"Your file was checked successfully",totalMessages:"Total messages",issues:"issues",results:"results",filterBy:"Filter by",groupBy:"Group by",download:"Download",expandAllMessages:"Expand all messages",collapseAllMessages:"Collapse all messages",allFilteredOut:"All messages have been filtered out by content.",reportTitleTemplate:"H5P Caretaker report for @title",contentFilter:"Content filter",showAll:"Show all",showSelected:"Various selected contents",showNone:"Show none",filterByContent:"Filter by content:",reset:"Reset"},y=200,L=300;window.H5PCaretaker=class{#r;#we;#J;#ke;#Se;#Me;#ce;#o={};constructor(e={},t={}){if(this.#ce={...v,...window.H5P_CARETAKER_L10N,...e.l10n},this.#ke=e.endpoint,this.#Se=e.sessionKeyName,this.#Me=e.sessionKeyValue,!this.#ke){const e=document.querySelector(".h5p-caretaker");this.#ke=e?.dataset.uploadEndpoint??"./upload"}this.#o=t,this.#o.onInitialized=this.#o.onInitialized??(()=>{}),this.#o.onUploadStarted=this.#o.onUploadStarted??(()=>{}),this.#o.onUploadEnded=this.#o.onUploadEnded??(()=>{}),this.#o.onReset=this.#o.onReset??(()=>{}),"loading"===document.readyState?document.addEventListener("DOMContentLoaded",(()=>{this.#Ce()})):this.#Ce()}#Ce(){const e=document.querySelector(".h5p-caretaker .select-language");e?.setAttribute("aria-label",v.selectYourLanguage),e?.addEventListener("change",(e=>{this.#Ie(e)})),this.#r=new a({selectorDropzone:".h5p-caretaker .dropzone",...this.#Se&&{sessionKeyName:this.#Se},...this.#Me&&{sessionKeyValue:this.#Me},l10n:{orDragTheFileHere:this.#ce.orDragTheFileHere,removeFile:this.#ce.removeFile,uploadProgress:this.#ce.uploadProgress,uploadYourH5Pfile:this.#ce.uploadYourH5Pfile}},{upload:async e=>{this.#S(e)},reset:()=>{this.#pe()}}),window.setTimeout((()=>{this.#o.onInitialized()}),0)}async uploadByURL(e){if(this.#pe(),"string"==typeof e){e=encodeURI(e);try{const t=await fetch(e),s=await t.arrayBuffer(),a=new Uint8Array(s),i=e.split("/").pop(),n=new File([a],i,{type:"application/zip"}),l=new DataTransfer;l.items.add(n),this.#r.upload(l.files)}catch(e){this.#o.onUploadEnded(!1)}}else this.#o.onUploadEnded(!1)}#S(e){this.#o.onUploadStarted();const t=new FormData;t.append("file",e),t.set("locale",document.querySelector(".select-language")?.value??"en"),this.#r.setStatus(""),this.#r.showProgress();const s=new XMLHttpRequest;s.open("POST",this.#ke,!0),s.upload.addEventListener("progress",(e=>{e.lengthComputable&&this.#Te(e.loaded/e.total*100)})),s.addEventListener("load",(()=>{this.#Ae(s),this.#o.onUploadEnded(!0)})),s.addEventListener("error",(()=>{this.#$e(s.statusText)})),s.send(t)}#pe(){const e=new URLSearchParams(window.location.search);for(const t of e.keys())t!==x&&e.delete(t);window.history.replaceState({},document.title,`${window.location.pathname}?${e.toString()}${window.location.hash}`),document.querySelector(".filter-tree").innerHTML="",document.querySelector(".output").innerHTML="",this.#o.onReset()}#Ie(e){const t=new URLSearchParams(window.location.search);t.set(e.target.dataset.localeKey??x,e.target.value),window.location.href=`${window.location.pathname}?${t.toString()}${window.location.hash}`}#Te(e){this.#r.setProgress(e),100===e&&(this.#r.hideProgress(),this.#r.setStatus(this.#ce.yourFileIsBeingChecked,"pulse"))}#Ae(e){if(this.#r.hideProgress(),e.status>=y&&e.status<L){const t=JSON.parse(e.responseText);this.#ce={...this.#ce,...t.client.translations},this.#r.setStatus(this.#ce.yourFileWasCheckedSuccessfully);const s=e=>{const t={label:e.label,subcontentId:e.subContentId};return Array.isArray(e.children)&&(t.items=e.children.map((e=>s(e)))),t},a=new f({item:s(t.contentTree),l10n:{contentFilter:this.#ce.contentFilter,showAll:this.#ce.showAll,showSelected:this.#ce.showSelected,showNone:this.#ce.showNone,filterByContent:this.#ce.filterByContent,reset:this.#ce.reset}},{onFilterChange:e=>{const s=this.#De(t.messages.filter((t=>e.includes(t.subContentId))));this.#we.update(s),this.#J.filter(e)}});document.querySelector(".filter-tree").append(a.getDOM()),t.messages=t.messages.map((e=>{e.issues=("error"===e.level||"warning"===e.level)&&"issues";const s=e.details?.path;return s&&s.startsWith("images/")?(e.details?.path&&e.details?.path.startsWith("images/")&&(e.details.base64=t.raw.media.images[s.split("/").pop()].base64),e):e})),this.#we=new r({results:this.#De(t.messages),l10n:{results:this.#ce.results,filterBy:this.#ce.filterBy,groupBy:this.#ce.groupBy,download:this.#ce.download}},{onResultsTypeChanged:e=>{this.#J.show(e)},onDownload:()=>{const e=this.#ce.reportTitleTemplate.replace("@title",`${t.raw.h5pJson.title} (${t.raw.h5pJson.mainLibrary})`);new g({title:e,messages:t.messages,l10n:this.#ce,translations:t.client.translations}).download()}}),document.querySelector(".output").append(this.#we.getDOM());const i=[...new Set(t.messages.map((e=>e.category)))];this.#J=new u({sets:{issues:[{id:"issues",header:this.#ce.issues}],level:["error","warning","info"],category:i},messages:t.messages,translations:t.client.translations,l10n:{expandAllMessages:this.#ce.expandAllMessages,collapseAllMessages:this.#ce.collapseAllMessages,allFilteredOut:this.#ce.allFilteredOut}}),document.querySelector(".output").append(this.#J.getDOM())}else this.#$e(e.responseText)}#De(e){const s=[{id:"error",value:e.filter((e=>"error"===e.level)).length,max:e.length,label:t(this.#ce.errors),link:"#error",color:"var(--color-error)",percentage:!1},{id:"warning",value:e.filter((e=>"warning"===e.level)).length,max:e.length,label:t(this.#ce.warnings),link:"#warning",color:"var(--color-warning)",percentage:!1},{id:"info",value:e.filter((e=>"info"===e.level)).length,max:e.length,label:t(this.#ce.infos),link:"#info",color:"var(--color-info)",percentage:!1}],a=[...new Set(e.map((e=>e.category)))].map((s=>({id:s,value:e.filter((e=>e.category===s)).length,max:e.length,label:t(this.#ce[s]),link:`#${s}`,color:"var(--color-primary)",percentage:!1}))),i=[{id:"issues",value:e.filter((e=>e.issues)).length,max:e.length,label:t(this.#ce.issues),link:"#issues",color:"status",percentage:!1}];return{issues:{label:this.#ce.issues,header:this.#ce.totalMessages,value:e.length,items:i,type:"filter"},level:{label:this.#ce.level,header:this.#ce.totalMessages,value:e.length,items:s,type:"group"},category:{label:this.#ce.category,header:this.#ce.totalMessages,value:e.length,items:a,type:"group"}}}#$e(e){this.#r.setStatus(e,"error"),this.#o.onUploadEnded(!1)}}})();