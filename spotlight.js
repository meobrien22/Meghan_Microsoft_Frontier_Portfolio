(()=>{
  const data=document.getElementById('spotlight-data');
  if(!data)return;
  const slides=JSON.parse(data.textContent);
  const image=document.getElementById('spotlight-image');
  const screen=document.querySelector('.spotlight-screen');
  const prev=document.getElementById('spotlight-prev');
  const next=document.getElementById('spotlight-next');
  const status=document.getElementById('spotlight-position');
  let index=0;
  function render(){
    const slide=slides[index];
    image.src=slide.image;image.alt=slide.title;
    screen.dataset.slide=String(index);
    screen.setAttribute('aria-label',`Open slide ${index+1}: ${slide.title} in full screen`);
    status.textContent=`${String(index+1).padStart(2,'0')} / ${slides.length}`;
    prev.disabled=index===0;next.disabled=index===slides.length-1;
  }
  prev.addEventListener('click',()=>{if(index>0){index--;render()}});
  next.addEventListener('click',()=>{if(index<slides.length-1){index++;render()}});
  document.querySelector('.spotlight-shell').addEventListener('keydown',event=>{
    if(event.key==='ArrowRight'&&index<slides.length-1){event.preventDefault();index++;render()}
    if(event.key==='ArrowLeft'&&index>0){event.preventDefault();index--;render()}
  });
  render();
})();
