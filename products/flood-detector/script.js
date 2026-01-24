// Small demo script to animate the gauge and show alert styling.
(function(){
  const waterEl   = document.getElementById('water');
  const statusRow = document.getElementById('statusRow');
  const statusText= document.getElementById('statusText');
  const randomBtn = document.getElementById('randomBtn');
  const alertBtn  = document.getElementById('alertBtn');
  const gauge     = document.querySelector('.gauge');

  // unified setLevel function
  function setLevel(percent){
    percent = Math.max(0, Math.min(100, percent));
    waterEl.style.setProperty('--level', percent + '%');
    waterEl.textContent = percent + '%';
    updateStatus(percent);
    applyGaugeClass(percent);
  }
  window.setLevel = setLevel; // expose globally for other scripts

  function updateStatus(p){
    const threshold = 70; // demo threshold for alert
    if (p >= threshold) {
      statusRow.classList.add('alert');
      statusText.textContent = 'Status: Flood ALERT';
    } else if (p >= 45) {
      statusRow.classList.remove('alert');
      statusText.textContent = 'Status: High';
    } else {
      statusRow.classList.remove('alert');
      statusText.textContent = 'Status: Normal';
    }
  }

  function applyGaugeClass(p){
    gauge.classList.remove('alert','high');
    if (p >= 75) gauge.classList.add('alert');
    else if (p >= 50) gauge.classList.add('high');
  }

  // demo animation loop
  let current = 30;
  setLevel(current);
  setInterval(()=>{
    current += (Math.random()*14 - 7);
    current = Math.round(current);
    current = Math.max(0, Math.min(100, current));
    setLevel(current);
  }, 2200);

  randomBtn.addEventListener('click', ()=>{
    const r = Math.floor(Math.random()*101);
    setLevel(r);
  });
  alertBtn.addEventListener('click', ()=>{
    setLevel(85);
  });

  // observe text changes as fallback
  const observer = new MutationObserver(muts=>{
    muts.forEach(m=>{
      if (m.target === waterEl) {
        const txt = (m.target.textContent||'').replace('%','').trim();
        const val = parseInt(txt,10);
        if (!isNaN(val)) applyGaugeClass(val);
      }
    });
  });
  observer.observe(waterEl,{ characterData:true, subtree:true, childList:true });

  // small click feedback for download buttons
  document.querySelectorAll('.download-grid a[download]').forEach(a=>{
    a.addEventListener('click', ()=>{
      a.style.opacity = 0.7;
      setTimeout(()=> a.style.opacity = 1, 400);
    });
  });
})();

// Smooth scroll for anchor links
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
})();