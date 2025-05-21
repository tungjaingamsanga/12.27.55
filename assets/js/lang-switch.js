localStorage.removeItem('lang');
let translations = {};

function selectLanguage(lang) {
  localStorage.setItem('lang', lang);
  document.getElementById('language-popup').style.display = 'none';
  loadLanguage(lang);
}

function reinitTypedJS() {
  const typedEl = document.querySelector('.typed');
  if (!typedEl) return;


  if (typedEl._typed) typedEl._typed.destroy();


  const oldCursor = document.querySelector('.typed-cursor');
  if (oldCursor) oldCursor.remove();


  typedEl.textContent = '';


  const items = typedEl.getAttribute('data-typed-items');
  const strings = items ? items.split(',').map(s => s.trim()) : [];


  if (strings.length === 0) return;


  const typed = new Typed(typedEl, {
    strings,
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 1500,
    loop: true
  });

  typedEl._typed = typed;
}





function loadLanguage(lang) {
  fetch(`assets/lang/${lang}.json`)
    .then(res => res.json())
    .then(data => {
      translations = data;

      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (!translations[key]) return;

        if (el.classList.contains('quote-box')) {
          const icon = el.querySelector('i')?.outerHTML || '';
          el.innerHTML = `${icon} ${translations[key]}`;
        } else {
          if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
            el.textContent = translations[key];
          } else {
            for (let i = 0; i < el.childNodes.length; i++) {
              if (el.childNodes[i].nodeType === 3) {
                el.childNodes[i].textContent = translations[key];
                break;
              }
            }
          }
        }
      });

      // แปล title
      document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (translations[key]) el.setAttribute('title', translations[key]);
      });

      // แปล typed items
      document.querySelectorAll('[data-i18n-typed]').forEach(el => {
        const key = el.getAttribute('data-i18n-typed');
        if (translations[key]) {
          el.setAttribute('data-typed-items', translations[key]);
        }
      });

      reinitTypedJS();
    });
}




window.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('lang');
  if (savedLang) {
    document.getElementById('language-popup').style.display = 'none';
    loadLanguage(savedLang);
  }

  // ✅ เพิ่มแค่ครั้งเดียว
  document.getElementById('lang-en').addEventListener('click', () => selectLanguage('en'));
  document.getElementById('lang-th').addEventListener('click', () => selectLanguage('th'));
});

