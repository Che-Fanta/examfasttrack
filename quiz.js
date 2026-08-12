/* ExamFastTrack — tiny static quiz engine. Reads window.QUIZ = {cta:{href,label}, questions:[...]} */
(function(){
  var data = window.QUIZ;
  if(!data) return;
  var root = document.getElementById('quiz');
  var qs = data.questions, i = 0, score = 0, answered = false;
  var keys = ['A','B','C','D','E'];

  var card = document.createElement('div'); card.className='qcard';
  var bar = document.createElement('div'); bar.className='qbar';
  bar.innerHTML = '<span class="lbl"></span><div class="track2"><div class="fill"></div></div>';
  var result = document.createElement('div'); result.className='result';
  root.appendChild(bar); root.appendChild(card); root.appendChild(result);

  function render(){
    var q = qs[i];
    answered = false;
    bar.querySelector('.lbl').textContent = 'Question '+(i+1)+' of '+qs.length;
    bar.querySelector('.fill').style.width = (i/qs.length*100)+'%';
    var opts = q.options.map(function(o,idx){
      return '<button class="opt" data-idx="'+idx+'"><span class="key">'+keys[idx]+'</span><span>'+o+'</span></button>';
    }).join('');
    card.innerHTML =
      '<p class="qnum">'+(q.tag||'Practice question')+'</p>'+
      '<p class="qtext">'+q.q+'</p>'+
      '<div class="opts">'+opts+'</div>'+
      '<div class="explain"><b>Explanation</b><span>'+q.explain+'</span></div>'+
      '<div class="qnav"><button class="next">'+(i===qs.length-1?'See result':'Next question')+'</button></div>';
    card.querySelectorAll('.opt').forEach(function(b){ b.addEventListener('click', choose); });
    card.querySelector('.next').addEventListener('click', next);
  }

  function choose(e){
    if(answered) return;
    answered = true;
    var pick = +e.currentTarget.getAttribute('data-idx');
    var q = qs[i];
    if(pick===q.answer) score++;
    card.querySelectorAll('.opt').forEach(function(b){
      var idx = +b.getAttribute('data-idx');
      b.setAttribute('disabled','');
      if(idx===q.answer) b.classList.add('correct');
      else if(idx===pick) b.classList.add('wrong');
    });
    card.querySelector('.explain').classList.add('show');
    card.querySelector('.next').classList.add('show');
  }

  function next(){
    if(i<qs.length-1){ i++; render(); root.scrollIntoView({behavior:'smooth',block:'start'}); }
    else finish();
  }

  function finish(){
    bar.querySelector('.fill').style.width='100%';
    bar.querySelector('.lbl').textContent='Complete';
    card.style.display='none';
    var pct = Math.round(score/qs.length*100);
    var msg = pct>=70 ? "Nice — you'd likely pass this section. Ready for the full exam?"
                      : "Some gaps to close. The full question bank will get you there.";
    result.innerHTML =
      '<p class="score"><span>'+score+'</span> / '+qs.length+'</p>'+
      '<p>'+msg+'</p>'+
      '<a class="btn" href="'+data.cta.href+'" target="_blank" rel="noopener">'+data.cta.label+'</a>';
    result.classList.add('show');
    result.scrollIntoView({behavior:'smooth',block:'center'});
  }

  render();
})();
