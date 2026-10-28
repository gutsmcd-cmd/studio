let L=localStorage.getItem("studio-lang")||((navigator.language||"").startsWith("ja")?"ja":"en");
const t=k=>T[L][k];const $=s=>document.querySelector(s);
const R=ROOMS.map(([id,n,en,ja,den,dja,nen,nja])=>({id,n,name:{en,ja},desc:{en:den,ja:dja},note:{en:nen,ja:nja}}));
const pad=i=>String(i).padStart(2,"0");
const src=(r,i,s)=>`art/${r.id}/${pad(i)}${s?"-s":""}.webp`;
const label=(r,i)=>`${r.name[L]} ${i}`;
let kept=JSON.parse(localStorage.getItem("studio-kept")||"[]");
const isKept=k=>kept.includes(k);
function toggleKeep(k){kept=isKept(k)?kept.filter(x=>x!==k):[...kept,k];localStorage.setItem("studio-kept",JSON.stringify(kept));}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function nav(cur){$("#nav").innerHTML=[["work","#/work"],["about","#/about"],["process","#/process"],["notes","#/notes"],["enquire","#/enquire"]].map(([k,h])=>`<a href="${h}" class="${cur===k?"on":""}">${t(k)}</a>`).join("");}
function tile(r,i,list,idx){return `<button class="tile" data-i="${idx}" aria-label="${esc(label(r,i))}"><img loading="lazy" src="${src(r,i,1)}" alt="${esc(label(r,i))}"><span>${pad(i)}</span>${isKept(r.id+"/"+i)?'<em>♥</em>':""}</button>`}
let LIST=[];
function grid(items){LIST=items;return `<div class="grid">${items.map(([r,i],x)=>tile(r,i,items,x)).join("")}</div>`}
const views={
home(){return `<section class="hero"><h1>${t("hero")}</h1></section><div class="rooms">${R.map((r,x)=>`<a class="room" href="#/room/${r.id}"><img loading="lazy" src="${src(r,1,1)}" alt=""><div><small>${t("room")} ${pad(x+1)}</small><h2>${r.name[L]}</h2><p>${r.desc[L]}</p><span class="count">${r.n} ${t("pics")}</span></div></a>`).join("")}</div>`},
work(q){const f=q||"all";const chips=[["all",t("all")],["kept",t("kept")+" ("+kept.length+")"],...R.map(r=>[r.id,r.name[L]])].map(([id,n])=>`<a class="chip ${f===id?"on":""}" href="#/work/${id}">${n}</a>`).join("");
 let items;if(f==="kept")items=kept.map(k=>{const[a,b]=k.split("/");return[R.find(r=>r.id===a),+b]}).filter(x=>x[0]);
 else items=R.filter(r=>f==="all"||r.id===f).flatMap(r=>Array.from({length:r.n},(_,i)=>[r,i+1]));
 return `<div class="chips">${chips}</div>`+(items.length?grid(items):`<p class="empty">${t("noKept")}</p>`)},
room(id){const r=R.find(x=>x.id===id);if(!r)return views.lost();const x=R.indexOf(r);
 const nx=R[(x+1)%R.length],pv=R[(x+R.length-1)%R.length];
 return `<section class="roomhead"><small>${t("room")} ${pad(x+1)} · ${r.n} ${t("pics")}</small><h1>${r.name[L]}</h1><p>${r.desc[L]}</p><p class="note">${r.note[L]}</p></section>${grid(Array.from({length:r.n},(_,i)=>[r,i+1]))}<div class="pager"><a href="#/room/${pv.id}">‹ ${pv.name[L]}</a><a href="#/room/${nx.id}">${nx.name[L]} ›</a></div>`},
about(){return `<article class="prose"><small>${t("about")}</small><h1>Mat McDaniel</h1><p>${t("aboutP")}</p><h2>${t("whereT")}</h2><p>${t("whereP")}</p><h2>${t("askT")}</h2><p>${t("askP")}</p><a class="btn" href="#/enquire">${t("enquire")}</a></article>`},
process(){return `<article class="prose"><small>${t("process")}</small><h1>${t("procT")}</h1><ol class="steps">${["p1","p2","p3"].map(k=>`<li><h2>${t(k)[0]}</h2><p>${t(k)[1]}</p></li>`).join("")}</ol></article>`},
notes(){return `<article class="prose"><small>${t("notes")}</small><h1>${t("notesT")}</h1><dl class="notes">${R.map(r=>`<div><dt><a href="#/room/${r.id}">${r.name[L]}</a></dt><dd>${r.note[L]}</dd></div>`).join("")}</dl></article>`},
enquire(q){const opts=`<option value="">${t("none")}</option>`+R.map(r=>`<optgroup label="${r.name[L]}">${Array.from({length:r.n},(_,i)=>{const k=r.id+"/"+(i+1);return`<option value="${k}" ${q===k?"selected":""}>${label(r,i+1)}</option>`}).join("")}</optgroup>`).join("");
 const pr=q&&q.includes("/")?(()=>{const[a,b]=q.split("/");const r=R.find(x=>x.id===a);return r?`<img class="enqimg" src="${src(r,+b,1)}" alt="">`:""})():"";
 return `<article class="prose"><small>${t("enquire")}</small><h1>${t("enqT")}</h1><p>${t("enqP")}</p>${pr}<form id="enq" class="form"><label>${t("name")}<input name="n" autocomplete="name" required></label><label>${t("piece")}<select name="p">${opts}</select></label><label>${t("msg")}<textarea name="m" rows="6" placeholder="${t("msgPh")}" required></textarea></label><button class="btn big" type="submit">✉ ${t("send")}</button></form><div id="fb" class="fb" hidden><p>${t("fallback")} <b>${EMAIL}</b></p><textarea readonly rows="6"></textarea><button class="pill" id="cp">${t("copy")}</button></div></article>`},
lost(){return `<section class="lost"><div class="door">🚪</div><h1>${t("lost")}</h1><p>${t("lostP")}</p><a class="btn" href="#/">${t("back")}</a></section>`}};
function render(){const h=location.hash.replace(/^#\/?/,"");const[v,a,b]=h.split("/");const arg=b?a+"/"+b:a;
 const key=v===""?"home":v;const fn=views[key]&&key!=="lost"?views[key]:views.lost;
 nav(key);document.documentElement.lang=L;$("#lang").textContent=L==="en"?"日本語":"English";
 document.querySelectorAll("[data-t]").forEach(e=>e.textContent=t(e.dataset.t));
 $("#app").innerHTML=fn(arg?decodeURIComponent(arg):"");window.scrollTo(0,0);
 const f=$("#enq");if(f)f.onsubmit=e=>{e.preventDefault();const d=new FormData(f);const p=d.get("p");let pn=t("none");if(p){const[a,b]=p.split("/");const r=R.find(x=>x.id===a);pn=label(r,b)}
  const subj=`${t("subj")}: ${pn}`;const body=`${d.get("m")}\n\n— ${d.get("n")}\n(${t("piece")}: ${pn})\n${location.href.split("#")[0]}#/room/${p?p.split("/")[0]:""}`;
  const fb=$("#fb");fb.hidden=false;fb.querySelector("textarea").value=`${subj}\n\n${body}`;
  $("#cp").onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText(`${subj}\n\n${body}`);$("#cp").textContent=t("copied")};
  location.href=`mailto:${EMAIL}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;};}
// lightbox
let cur=0;const lb=$("#lb");
function show(i){cur=(i+LIST.length)%LIST.length;const[r,n]=LIST[cur];const img=lb.querySelector("img");img.src=src(r,n);img.alt=label(r,n);
 lb.querySelector("figcaption").textContent=`${label(r,n)}  ·  ${cur+1}/${LIST.length}`;
 const k=r.id+"/"+n;lb.querySelector(".keep").textContent=isKept(k)?t("keptBtn"):t("keepBtn");lb.querySelector(".keep").classList.toggle("on",isKept(k));
 lb.querySelector(".ask").textContent=t("askBtn");lb.hidden=false;document.body.classList.add("noscroll");}
function close(){lb.hidden=true;document.body.classList.remove("noscroll");}
document.addEventListener("click",e=>{const tl=e.target.closest(".tile");if(tl)show(+tl.dataset.i)});
lb.querySelector(".x").onclick=close;lb.querySelector(".pv").onclick=()=>show(cur-1);lb.querySelector(".nx").onclick=()=>show(cur+1);
lb.onclick=e=>{if(e.target===lb||e.target.tagName==="FIGURE")close()};
lb.querySelector(".keep").onclick=()=>{const[r,n]=LIST[cur];toggleKeep(r.id+"/"+n);show(cur)};
lb.querySelector(".ask").onclick=()=>{const[r,n]=LIST[cur];close();location.hash=`#/enquire/${r.id}/${n}`};
lb.querySelector(".light").oninput=e=>lb.querySelector("img").style.filter=`brightness(${e.target.value}%)`;
document.addEventListener("keydown",e=>{if(lb.hidden)return;if(e.key==="Escape")close();if(e.key==="ArrowRight")show(cur+1);if(e.key==="ArrowLeft")show(cur-1)});
let sx=null;lb.addEventListener("touchstart",e=>sx=e.touches[0].clientX,{passive:true});
lb.addEventListener("touchend",e=>{if(sx==null)return;const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)show(cur+(d<0?1:-1));sx=null});
$("#lang").onclick=()=>{L=L==="en"?"ja":"en";localStorage.setItem("studio-lang",L);render()};
addEventListener("hashchange",()=>{close();render()});render();
if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js");
