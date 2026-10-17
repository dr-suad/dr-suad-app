/* ===== بيانات أساسية ===== */
const FALLBACK=[
 {id:1,color:'#F4A261',emoji:'🧮',description:'الأعداد من 1 إلى 9، المقارنة، الجمع والطرح ضمن 9'},
 {id:2,color:'#E9C46A',emoji:'🔢',description:'الأعداد ضمن 99، الجمع والطرح، مفهوم الضرب والقسمة'},
 {id:3,color:'#6A994E',emoji:'➗',description:'الكسور، القسمة، المسائل الحياتية، وحدات القياس'},
 {id:4,color:'#2A9D8F',emoji:'📐',description:'ضرب الأعداد، الكسور العشرية، المحيط والمساحة، تنظيم البيانات'}
];
let classes=FALLBACK.slice();
const D='٠١٢٣٤٥٦٧٨٩',$=s=>document.querySelector(s);
const n=x=>String(x).replace(/\d/g,d=>D[d]).replace('.','٫');
const r=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const shuf=a=>a.sort(()=>Math.random()-.5);
let grade=0,mode='train',stars=0,Q=[],i=0,score=0,sk={},lock=false,mvAns='';
try{stars=+localStorage.getItem('sq-stars')||0}catch(e){}

/* ===== مولّد الأسئلة لكل صف ===== */
const GEN=[
[()=>{const a=r(1,5),b=r(1,9-a);return{t:`${n(a)} + ${n(b)} = ؟`,a:a+b,s:'الجمع'}},
 ()=>{const a=r(2,9),b=r(1,a-1);return{t:`${n(a)} − ${n(b)} = ؟`,a:a-b,s:'الطرح'}},
 ()=>{const t=r(5,9),a=r(1,t-1);return{t:`${n(a)} + ؟ = ${n(t)}`,a:t-a,s:'العدد الناقص'}}],
[()=>{const a=r(10,60),b=r(10,39);return{t:`${n(a)} + ${n(b)} = ؟`,a:a+b,s:'الجمع'}},
 ()=>{const a=r(30,99),b=r(10,a-5);return{t:`${n(a)} − ${n(b)} = ؟`,a:a-b,s:'الطرح'}},
 ()=>{const a=r(2,5),b=r(2,5);return{t:`${n(a)} × ${n(b)} = ؟`,a:a*b,s:'الضرب'}}],
[()=>{const b=r(2,9),c=r(2,9);return{t:`${n(b*c)} ÷ ${n(b)} = ؟`,a:c,s:'القسمة'}},
 ()=>{const a=r(3,9),b=r(3,9);return{t:`${n(a)} × ${n(b)} = ؟`,a:a*b,s:'الضرب'}},
 ()=>{const h=r(2,25);return{t:`نصف العدد ${n(h*2)} = ؟`,a:h,s:'الكسور'}},
 ()=>{const m=r(2,9);return{t:`${n(m)} م = كم سنتيمتراً؟`,a:m*100,st:100,s:'القياس'}}],
[()=>{const a=r(12,45),b=r(2,9);return{t:`${n(a)} × ${n(b)} = ؟`,a:a*b,s:'الضرب'}},
 ()=>{const a=r(3,15),b=r(2,12);return{t:`محيط مستطيل طوله ${n(a)} وعرضه ${n(b)} = ؟`,a:2*(a+b),s:'المحيط'}},
 ()=>{const a=r(3,12),b=r(2,9);return{t:`مساحة مستطيل طوله ${n(a)} وعرضه ${n(b)} = ؟`,a:a*b,s:'المساحة'}},
 ()=>{const a=r(1,6),b=r(1,3);return{t:`${n(a/10)} + ${n(b/10)} = ؟`,a:+((a+b)/10).toFixed(1),s:'الكسور العشرية'}}]];
function opts(a,st){const dec=!Number.isInteger(a),s=st||(dec?.1:1),S=new Set([a]);
 while(S.size<4){const v=+(a+r(-4,4)*s*(dec||st?1:r(1,2))).toFixed(1);if(v>=0)S.add(v)}return shuf([...S])}

/* ===== محرك الأسئلة ===== */
function start(m){mode=m;const f=GEN[grade];
 Q=Array.from({length:m==='test'?8:10},()=>{const q=f[r(0,f.length-1)]();q.o=opts(q.a,q.st);return q});
 i=0;score=0;sk={};sync();show()}
function show(){const a=$('#arena');
 if(!Q.length){a.innerHTML=`<p class="mv">اختر الصف ثم اضغط «ابدأ» ${classes[grade]?.emoji ?? FALLBACK[grade]?.emoji}</p><br><button class="btn lg" data-a="go" data-m="${mode}">ابدأ</button>`;return}
 if(i>=Q.length)return end();
 const q=Q[i];
 a.innerHTML=`<div class="pr"><i style="width:${i/Q.length*100}%"></i></div><p>السؤال ${n(i+1)} من ${n(Q.length)}</p><div class="q">${q.t}</div><div class="opts">${q.o.map(o=>`<button class="opt" data-v="${o}">${n(o)}</button>`).join('')}</div>`}
function answer(b){if(lock)return;lock=true;const q=Q[i],ok=+b.dataset.v===q.a;
 (sk[q.s]=sk[q.s]||[0,0])[1]++;if(ok){score++;sk[q.s][0]++}
 if(mode==='train'){b.classList.add(ok?'ok':'bad');if(!ok)[...document.querySelectorAll('.opt')].find(x=>+x.dataset.v===q.a).classList.add('ok')}
 setTimeout(()=>{i++;lock=false;show()},mode==='train'?1000:250)}
function end(){const p=score/Q.length,gain=score*(mode==='test'?2:1);stars+=gain;save();
 const [e,m]=p>=.8?['🏆','ممتاز! أنت بطل الرياضيات']:p>=.5?['🌟','جيد جداً، قليل من التدريب ويصبح ممتازاً']:['🌱','بداية جميلة، تابع التدريب وستتقدم'];
 let rep='';
 if(mode==='test')rep='<div class="sk">'+Object.entries(sk).map(([k,[c,t]])=>`<div><span>${k}</span><span>${c/t>=.8?'متمكن ✅':c/t>=.5?'قيد التطور 🔸':'يحتاج تدريباً 🔻'} (${n(c)}/${n(t)})</span></div>`).join('')+'</div>';
 $('#arena').innerHTML=`<div class="big">${e}</div><div class="q">${n(score)} من ${n(Q.length)}</div><p>${m}</p><p>ربحت ${n(gain)} ⭐</p>${rep}<br><button class="btn lg" data-a="go" data-m="${mode}">جولة جديدة</button>`}
function save(){$('#stars').textContent='⭐ '+n(stars);try{localStorage.setItem('sq-stars',stars)}catch(e){}}

/* ===== واجهة التحكم ===== */
function sync(){document.querySelectorAll('#gs button').forEach((b,k)=>b.setAttribute('aria-pressed',k===grade));
 document.querySelectorAll('#ms button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===mode))}
function setGrade(g){grade=+g;Q=[];sync()}
const chips=(id,a,extra='')=>$(id).innerHTML=classes.map((g,k)=>`<button class="chip" style="--k:${g.color}" data-a="${a}" data-g="${g.id}" ${extra}>${g.name}</button>`).join('');
function renderClasses(){
  $('#gc').innerHTML=classes.map((g,k)=>`<button class="card gc" style="--k:${g.color}" data-a="go" data-g="${g.id}" data-m="train"><span class="num">${n(g.id)}</span><span class="em">${g.emoji}</span><h3>${g.name}</h3><p>${g.description}</p></button>`).join('');
  $('#gs').innerHTML=classes.map((g,k)=>`<button style="--k:${g.color}" data-a="pick" data-g="${g.id}">${g.name}</button>`).join('');
}
function renderPlans(content){
  $('#pl').innerHTML=content.plans.map(p=>`<article class="card" style="--k:var(--ol)"><h3>${p.title}</h3><p class="mv">${p.summary}</p><button class="btn" data-a="soon">عرض الخطة</button></article>`).join('');
}
function renderPreparations(content){
  $('#ls').innerHTML=content.preparations.map(p=>`<article class="card" style="--k:var(--ol)"><h3>${p.title}</h3><p class="mv">${p.summary}</p><button class="btn" data-a="soon">عرض التحضير</button></article>`).join('');
}
function renderWorksheets(content){
  $('#w1').innerHTML=content.worksheets.normal.map(w=>`<button class="chip" style="--k:var(--or)" data-a="soon">${w.title}</button>`).join('');
  $('#w2').innerHTML=content.worksheets.interactive.map(w=>`<button class="chip" style="--k:var(--ol)" data-a="soon">${w.title}</button>`).join('');
}
function renderGames(content){
  $('#g1').innerHTML=content.games.interactive.map(g=>`<button class="chip" style="--k:var(--or)" data-a="soon">${g.title}</button>`).join('');
  $('#g2').innerHTML=content.games.kinetic.map(g=>`<button class="chip" style="--k:var(--ol)" data-a="soon">${g.title}</button>`).join('');
}
function renderVideos(content){
  const cols=classes.slice(0,4).map(c=>c.color);
  $('#vd').innerHTML=content.videos.map((v,k)=>`<article class="card" style="--k:${cols[k%4]}"><div class="th"><span class="pl">▶</span><span class="du">${v.duration}</span></div><h3>${v.title}</h3><p>${v.description}</p></article>`).join('');
}
function renderFromContent(content){
  classes=content.classes||[];
  renderClasses();
  renderPlans(content);
  renderPreparations(content);
  renderWorksheets(content);
  renderGames(content);
  renderVideos(content);
}
async function loadContent(){
  try{
    const r=await fetch('data/content.json');
    if(!r.ok) throw new Error('HTTP '+r.status);
    const content=await r.json();
    renderFromContent(content);
  }catch(e){
    console.warn('تعذر تحميل content.json، تفعيل وضع الاحتياطي: '+e.message);
    if(!classes.length) classes=FALLBACK.slice();
    renderClasses();
    $('#pl').innerHTML=`<p class="mv">⚠️ المحتوى الحقيقي تعطل التحميل، تفعيل المحتوى الاحتياطي.</p>`;
    $('#ls').innerHTML=`<p class="mv">⚠️ المحتوى الحقيقي تعطل التحميل، تفعيل المحتوى الاحتياطي.</p>`;
    $('#w1').innerHTML=`<p class="mv">⚠️ المحتوى الحقيقي تعطل التحميل، تفعيل المحتوى الاحتياطي.</p>`;
    $('#g1').innerHTML=`<p class="mv">⚠️ المحتوى الحقيقي تعطل التحميل، تفعيل المحتوى الاحتياطي.</p>`;
    $('#vd').innerHTML=`<p class="mv">⚠️ المحتوى الحقيقي تعطل التحميل، تفعيل المحتوى الاحتياطي.</p>`;
  }
}

/* تحدٍّ حركي: نفس مستوى الصف */
function move(){const A=['اقفز','صفّق','دُر حول نفسك','المس الأرض','خُذ خطوات للأمام'],a=A[r(0,4)];let x,y,op,v;
 if(grade<1){x=r(1,5);y=r(1,4);op='+';v=x+y}else{x=r(2,grade+4);y=r(2,grade+4);op='×';v=x*y}
 if(grade===2){x=r(2,5)*2;y=2;op='÷';v=x/2;}
 $('#mv').textContent=`${a} بعدد ${grade===2?'نصف العدد '+n(x):n(x)+' '+op+' '+n(y)} مرة!`;mvAns=n(v);$('#rv').hidden=false;$('#rv').textContent='اكشف العدد'}

document.addEventListener('click',e=>{
 const o=e.target.closest('.opt');if(o)return answer(o);
 const m=e.target.closest('#ms button');if(m){mode=m.dataset.m;Q=[];sync();return show()}
 if(e.target.id==='rv'){e.target.textContent='العدد: '+mvAns;return}
 if(e.target.id==='bg'||e.target.closest('#bg')){const b=$('#nav').classList.toggle('o');$('#bg').setAttribute('aria-expanded',b);return}
 const l=e.target.closest('a[href^="#"]');
 if(l){e.preventDefault();$(l.getAttribute('href')).scrollIntoView({behavior:'smooth'});$('#nav').classList.remove('o');return}
 const t=e.target.closest('[data-a]');if(!t)return;const a=t.dataset.a;
 if(a==='soon')return toast('قريباً إن شاء الله 🌟');
 if(t.dataset.g!==undefined)setGrade(t.dataset.g);
 if(a==='pick'){show()}
 if(a==='move')move();
 if(a==='go'){start(t.dataset.m);$('#train').scrollIntoView({behavior:'smooth'})}});

let tm;function toast(s){const t=$('#toast');t.textContent=s;t.classList.add('s');clearTimeout(tm);tm=setTimeout(()=>t.classList.remove('s'),2500)}
save();sync();show();
loadContent();
