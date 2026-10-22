(()=>{
  const root=document.querySelector('[data-feature-carousel]');
  if(!root)return;
  const projects=JSON.parse(root.querySelector('#feature-data').textContent);
  const base=new URL('.',document.currentScript.src);
  const resolve=path=>{
    if(/^https?:\/\//.test(path))return path;
    if(base.pathname!=='/'&&path.startsWith(base.pathname))return new URL(path,base.origin).href;
    return new URL(path.replace(/^\/+/,''),base).href;
  };
  const q=s=>root.querySelector(s);
  const image=q('[data-feature-image]'),imageButton=q('[data-feature-image-button]');
  const stage=q('.feature-stage'),selectors=[...root.querySelectorAll('[data-feature-select]')];
  let projectIndex=0,slideIndex=0,gesture=null,suppressClickUntil=0,lastWheel=0;
  function render(){
    const project=projects[projectIndex],slide=project.slides[slideIndex],multiple=project.slides.length>1;
    image.src=resolve(slide.image);image.alt=slide.alt;
    q('[data-feature-title]').textContent=project.title;
    q('[data-feature-category]').textContent=project.category;
    q('[data-feature-label]').textContent=project.label;
    q('[data-project-position]').textContent=`PROJECT ${projectIndex+1} / ${projects.length}`;
    q('[data-slide-position]').textContent=multiple?`Slide ${slideIndex+1} of ${project.slides.length}`:'1 image';
    q('[data-feature-case]').href=resolve(project.href);
    q('[data-feature-case]').setAttribute('aria-label',`View full case study: ${project.title}`);
    q('[data-slide-prev]').disabled=!multiple;q('[data-slide-next]').disabled=!multiple;
    imageButton.disabled=!multiple;
    imageButton.setAttribute('aria-label',multiple?`Next slide in ${project.title}; currently slide ${slideIndex+1} of ${project.slides.length}`:`${project.title}: single project image`);
    q('[data-image-action]').textContent=multiple?'Click for next slide →':'Single image';
    q('[data-feature-hint]').textContent=multiple?'Click the image, swipe, or use the slide arrows. Stay here to explore the deck.':'Single project image. View the full case study or choose the next project.';
    selectors.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===projectIndex)));
  }
  function moveSlide(delta){const count=projects[projectIndex].slides.length;if(count>1){slideIndex=(slideIndex+delta+count)%count;render()}}
  function showProject(next){projectIndex=(next+projects.length)%projects.length;slideIndex=0;render()}
  imageButton.addEventListener('click',()=>moveSlide(1));
  q('[data-slide-prev]').addEventListener('click',()=>moveSlide(-1));
  q('[data-slide-next]').addEventListener('click',()=>moveSlide(1));
  q('[data-project-next]').addEventListener('click',()=>showProject(projectIndex+1));
  selectors.forEach((button,i)=>button.addEventListener('click',()=>showProject(i)));
  root.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();moveSlide(event.key==='ArrowRight'?1:-1)}
    else if(event.key==='Home'||event.key==='End'){event.preventDefault();slideIndex=event.key==='Home'?0:projects[projectIndex].slides.length-1;render()}
    else if(event.key==='PageDown'||event.key==='PageUp'){event.preventDefault();showProject(projectIndex+(event.key==='PageDown'?1:-1))}
  });
  stage.addEventListener('pointerdown',event=>{if(event.pointerType==='touch'||event.pointerType==='pen')gesture={x:event.clientX,y:event.clientY}},{passive:true});
  stage.addEventListener('pointercancel',()=>{gesture=null},{passive:true});
  stage.addEventListener('pointerup',event=>{
    if(!gesture)return;const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;gesture=null;
    if(Math.abs(dx)<45||Math.abs(dx)<Math.abs(dy)*1.3)return;
    suppressClickUntil=performance.now()+500;moveSlide(dx<0?1:-1);
  },{passive:true});
  stage.addEventListener('click',event=>{if(performance.now()<suppressClickUntil){event.preventDefault();event.stopPropagation()}},true);
  stage.addEventListener('wheel',event=>{
    if(Math.abs(event.deltaX)<18||Math.abs(event.deltaX)<=Math.abs(event.deltaY))return;
    if(projects[projectIndex].slides.length<2)return;
    event.preventDefault();if(performance.now()-lastWheel<450)return;
    lastWheel=performance.now();moveSlide(event.deltaX>0?1:-1);
  },{passive:false});
  render();
})();
