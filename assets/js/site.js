// Loaded by _layouts/default.html. Configuration comes from _config.yml via
// window.SITE and window.TAG_LABELS — you should not need to edit this file.
(function(){
  var el=document.getElementById('tag-labels');
  try{ window.TAG_LABELS = el ? JSON.parse(el.textContent) : {}; }catch(e){ window.TAG_LABELS={}; }
})();

// generic search + keyword filter, used for publications and talks
function initFilter(cfg){
  var box=document.getElementById(cfg.ui); if(!box) return;
  var items=[].slice.call(document.querySelectorAll(cfg.items));
  if(items.length<cfg.min) return;
  box.hidden=false;

  var LABELS=window.TAG_LABELS||{};
  var q=document.getElementById(cfg.q), chipbox=document.getElementById(cfg.chips),
      count=document.getElementById(cfg.count), empty=document.getElementById(cfg.empty),
      more=cfg.more?document.getElementById(cfg.more):null,
      active=new Set(), expanded=false;

  items.forEach(function(p){
    p._kw=(p.getAttribute('data-kw')||'').split(/\s+/).filter(Boolean);
    p._text=p.textContent.toLowerCase();
    p._t=p.querySelector(cfg.titleSel);
    p._html=p._t?p._t.innerHTML:'';
  });

  var tally={};
  items.forEach(function(p){p._kw.forEach(function(k){tally[k]=(tally[k]||0)+1;});});
  Object.keys(tally).sort(function(a,b){return tally[b]-tally[a];}).forEach(function(k){
    var b=document.createElement('button');
    b.className='chip'; b.type='button'; b.setAttribute('aria-pressed','false');
    b.innerHTML=(LABELS[k]||k)+'<span class="n">'+tally[k]+'</span>';
    b.addEventListener('click',function(){
      if(active.has(k)){active.delete(k);b.setAttribute('aria-pressed','false');}
      else{active.add(k);b.setAttribute('aria-pressed','true');}
      apply();
    });
    chipbox.appendChild(b);
  });

  function highlight(p,term){
    if(!p._t) return;
    p._t.innerHTML=p._html;
    if(!term) return;
    var re=new RegExp('('+term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig');
    (function walk(n){
      [].slice.call(n.childNodes).forEach(function(c){
        if(c.nodeType===3){
          if(re.test(c.nodeValue)){
            var sp=document.createElement('span');
            sp.innerHTML=c.nodeValue.replace(re,'<mark>$1</mark>');
            c.parentNode.replaceChild(sp,c);
          }
        } else if(c.nodeType===1) walk(c);
      });
    })(p._t);
  }

  function apply(){
    var term=q.value.trim().toLowerCase(), filtering=!!(active.size||term), shown=0, kept=0;
    items.forEach(function(p){
      var okKw=!active.size || p._kw.some(function(k){return active.has(k);});
      var okQ=!term || p._text.indexOf(term)>-1;
      var match=okKw&&okQ;
      if(match) kept++;
      // when collapsed, render one extra row and clip it so the list visibly continues
      var collapsing = cfg.collapse && !filtering && !expanded;
      var vis = match && (!collapsing || kept<=cfg.collapse+1);
      var isPeek = collapsing && match && kept===cfg.collapse+1;
      p.classList.toggle('peek', !!isPeek);
      p.hidden=!vis; if(vis){shown++; highlight(p,term);}
    });
    if(cfg.groups){
      [].slice.call(document.querySelectorAll(cfg.groups)).forEach(function(g){
        g.hidden=!g.querySelector(cfg.items.split(' ').pop()+':not([hidden])');
      });
    }
    var collapsed = cfg.collapse && !filtering && !expanded && items.length>cfg.collapse;
    count.textContent = filtering ? kept+' of '+items.length
                      : collapsed ? 'showing '+cfg.collapse+' of '+items.length
                      : items.length+' '+cfg.noun;
    empty.hidden = kept>0;
    if(more){
      more.hidden = filtering || !(cfg.collapse && items.length>cfg.collapse);
      more.setAttribute('aria-expanded', expanded?'true':'false');
      more.innerHTML = (expanded ? 'show fewer' : 'show all '+items.length+' '+cfg.noun)
        + '<svg class="chev" width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">'
        + '<path d="M2 4 L6 8.5 L10 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
  }

  function reset(){
    active.clear(); q.value='';
    [].slice.call(chipbox.children).forEach(function(c){c.setAttribute('aria-pressed','false');});
    apply();
  }
  q.addEventListener('input',apply);
  q.addEventListener('keydown',function(e){if(e.key==='Escape'){q.value='';apply();}});
  document.getElementById(cfg.reset).addEventListener('click',reset);
  if(more) more.addEventListener('click',function(){expanded=!expanded;apply();});
  if(cfg.anchorPrefix){
    window.addEventListener('hashchange',function(){
      if(location.hash.indexOf(cfg.anchorPrefix)===1){
        var t=document.querySelector(location.hash);
        if(t&&t.hidden){reset();expanded=true;apply();t.scrollIntoView();}
      }
    });
  }
  apply();
}

initFilter({ui:'pubfilter',items:'#publications .pub',titleSel:'h3',groups:'#publications .pub-group',
            q:'pf-q',chips:'pf-chips',count:'pf-count',empty:'pf-empty',reset:'pf-reset',
            noun:'papers',min:6,anchorPrefix:'pub-'});

initFilter({ui:'talkfilter',items:'#talklist .talk',titleSel:'strong',
            q:'tf-q',chips:'tf-chips',count:'tf-count',empty:'tf-empty',reset:'tf-reset',
            more:'tf-more',collapse:(window.SITE&&window.SITE.talksCollapse)||8,noun:'talks',min:6});

// email reveal
document.getElementById('email-btn').addEventListener('click',function(){
  var c=(window.SITE||{}), addr=(c.emailUser||'')+'@'+(c.emailDomain||'');
  this.outerHTML='<a href="mailto:'+addr+'" style="font-family:var(--mono)">'+addr+'</a>';
});

// random photo
(function(){
  var pics=(window.SITE&&window.SITE.photos)||[];
  var img=document.getElementById('rand-photo'), cred=document.getElementById('photo-credit');
  if(!img||!pics.length) return;
  var pick=pics[Math.floor(Math.random()*pics.length)];
  img.addEventListener('error',function(){document.getElementById('photo-fig').style.display='none';});
  img.src=pick.src;
  if(cred&&pick.credit){ cred.textContent='Photo: '+pick.credit; cred.hidden=false; }
})();

// theme: follow OS preference by default, allow manual override (persisted where possible)
(function(){
  var root=document.documentElement, btn=document.getElementById('theme-btn');
  function apply(t){
    root.setAttribute('data-theme',t);
    btn.textContent = t==='dark' ? '☀' : '☾';
    btn.setAttribute('aria-label', t==='dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
  var saved=null;
  try{saved=localStorage.getItem('theme');}catch(e){}
  apply(saved || (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light'));
  btn.addEventListener('click',function(){
    var t = root.getAttribute('data-theme')==='dark' ? 'light':'dark';
    apply(t);
    try{localStorage.setItem('theme',t);}catch(e){}
  });
  if(window.matchMedia){
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(e){
      var s=null; try{s=localStorage.getItem('theme');}catch(err){}
      if(!s) apply(e.matches?'dark':'light');
    });
  }
})();
