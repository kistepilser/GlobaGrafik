/* =========================================================
   Красивые выпадающие списки вместо системных
   Нативный <select> остаётся в DOM (весь код работает как раньше),
   но визуально его заменяет кастомная кнопка со списком.
   ========================================================= */
function closeAllXSel(){
  Array.prototype.forEach.call(document.querySelectorAll('.xsel.open'),function(w){w.classList.remove('open');});
}
function buildXSel(sel){
  if(sel.getAttribute('data-xs')==='1')return;
  sel.setAttribute('data-xs','1');
  var wrap=document.createElement('div');
  wrap.className='xsel';
  sel.parentNode.insertBefore(wrap,sel);
  wrap.appendChild(sel);

  var btn=document.createElement('button');
  btn.type='button';
  btn.className='xsel-btn';
  var val=document.createElement('span');val.className='xsel-val';
  var arr=document.createElement('i');arr.className='xsel-arrow';
  btn.appendChild(val);btn.appendChild(arr);
  wrap.appendChild(btn);

  var pop=document.createElement('div');
  pop.className='xsel-pop';
  wrap.appendChild(pop);

  function sync(){
    var o=sel.options[sel.selectedIndex];
    val.textContent=o?o.text:'';
    btn.classList.toggle('placeholder',!o||!o.value);
  }
  function fill(){
    pop.innerHTML='';
    Array.prototype.forEach.call(sel.options,function(o,i){
      var it=document.createElement('button');
      it.type='button';
      it.className='xsel-opt'+(i===sel.selectedIndex?' on':'');
      it.textContent=o.text;
      it.addEventListener('click',function(ev){
        ev.preventDefault();ev.stopPropagation();
        sel.selectedIndex=i;
        sync();
        wrap.classList.remove('open');
        sel.dispatchEvent(new Event('change',{bubbles:true}));
      });
      pop.appendChild(it);
    });
  }
  function open(){
    closeAllXSel();
    fill();
    wrap.classList.add('open');
    var r=wrap.getBoundingClientRect();
    wrap.classList.toggle('up',(window.innerHeight-r.bottom)<230&&r.top>260);
    var on=pop.querySelector('.xsel-opt.on');
    if(on&&on.scrollIntoView)on.scrollIntoView({block:'nearest'});
  }
  btn.addEventListener('click',function(ev){
    ev.preventDefault();ev.stopPropagation();
    if(sel.disabled)return;
    if(wrap.classList.contains('open'))wrap.classList.remove('open');else open();
  });
  sel.addEventListener('change',sync);
  sync();
}
function enhanceSelects(root){
  root=root||document;
  if(!root.querySelectorAll)return;
  Array.prototype.forEach.call(root.querySelectorAll('select'),buildXSel);
}
document.addEventListener('click',closeAllXSel);
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeAllXSel();});
window.addEventListener('resize',closeAllXSel);
document.addEventListener('DOMContentLoaded',function(){enhanceSelects();});
