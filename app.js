(()=>{const dialog=document.querySelector('#viewer');if(!dialog)return;let decks;let current;let pos=0;let trigger;const q=s=>dialog.querySelector(s);const render=()=>{const slide=current.slides[pos];q('#viewer-image').src=slide.image;q('#viewer-image').alt=slide.alt||slide.title||slide.text||`${current.title}, slide ${pos+1}`;q('#slide-position').textContent=`${pos+1} / ${current.slides.length}`;q('#slide-text').textContent=slide.text||slide.title;q('#prev').disabled=pos===0;q('#next').disabled=pos===current.slides.length-1;dialog.querySelectorAll('[data-thumb]').forEach((b,i)=>b.setAttribute('aria-current',i===pos?'true':'false'));const thumb=q(`[data-thumb="${pos}"]`);if(thumb)thumb.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});};async function open(button){trigger=button;const original=button.innerHTML;try{if(!decks){button.setAttribute('aria-busy','true');const r=await fetch('/Meghan_Microsoft_Frontier_Portfolio/decks/catalog.json');if(!r.ok)throw Error();decks=await r.json();}current=decks.find(d=>d.id===button.dataset.deck);if(!current)throw Error();pos=Number(button.dataset.slide||0);q('#viewer-title').textContent=current.title;q('#viewer-label').textContent=current.label;q('.slide-transcript summary').textContent=current.transcriptLabel||'Read slide text';q('#viewer-thumbs').replaceChildren(...current.slides.map((s,i)=>{const b=document.createElement('button');b.dataset.thumb=i;b.setAttribute('aria-label',`Slide ${i+1}`);const image=document.createElement('img');image.src=s.image;image.alt='';image.loading='lazy';b.append(image);b.addEventListener('click',()=>{pos=i;render()});return b}));dialog.showModal();document.body.classList.add('viewer-open');render();q('.close').focus();}catch{button.innerHTML='Unable to open slides. Try again ↗';setTimeout(()=>button.innerHTML=original,4000);}finally{button.removeAttribute('aria-busy');}}document.querySelectorAll('[data-deck]').forEach(b=>b.addEventListener('click',()=>open(b)));q('.close').addEventListener('click',()=>dialog.close());q('#prev').addEventListener('click',()=>{if(pos>0){pos--;render()}});q('#next').addEventListener('click',()=>{if(pos<current.slides.length-1){pos++;render()}});dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'&&pos<current.slides.length-1){e.preventDefault();pos++;render()}if(e.key==='ArrowLeft'&&pos>0){e.preventDefault();pos--;render()}});dialog.addEventListener('close',()=>{document.body.classList.remove('viewer-open');if(trigger)trigger.focus()});dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}})})();

// Experience stays a normal link unless native dialogs are available.
(()=>{
  const panel=document.querySelector('#experience-dialog');
  if(!panel||typeof panel.showModal!=='function')return;
  let opener;
  const close=panel.querySelector('[data-close-experience]');
  document.querySelectorAll('a[href="/Meghan_Microsoft_Frontier_Portfolio/experience/"]').forEach(link=>{
    link.addEventListener('click',event=>{
      if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      event.preventDefault();
      opener=link;
      panel.showModal();
      document.body.classList.add('experience-open');
      panel.querySelector('.experience-shell').scrollTop=0;
      close.focus();
    });
  });
  close.addEventListener('click',()=>panel.close());
  panel.addEventListener('close',()=>{
    document.body.classList.remove('experience-open');
    if(opener?.isConnected)opener.focus();
  });
  panel.addEventListener('click',event=>{
    if(event.target!==panel)return;
    const bounds=panel.getBoundingClientRect();
    if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)panel.close();
  });
})();
