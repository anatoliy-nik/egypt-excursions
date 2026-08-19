// ===== SunTrip Египет — единый скрипт =====
// Каждый модуль проверяет наличие своих элементов на странице

(function () {
  'use strict';

  // ---------- Мобильное меню (бургер) ----------
  var btn = document.getElementById('burgerBtn');
  var menu = document.getElementById('mobileMenu');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
    var mmClose = document.getElementById('mmClose');
    if (mmClose) mmClose.addEventListener('click', function () {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  }

  // ---------- FAQ (аккордеон) ----------
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      q.parentElement.classList.toggle('open');
    });
  });

  // ---------- Фильтры категорий ----------
  // применяет фильтр к сетке, следующей за панелью фильтров
  function applyCatFilter(panel, cat) {
    var grid = panel.nextElementSibling;
    if (!grid) return;
    grid.querySelectorAll('.tcard').forEach(function (card) {
      var cats = (card.getAttribute('data-cats') || '').split(' ');
      card.style.display = (cat === 'all' || cats.indexOf(cat) !== -1) ? '' : 'none';
    });
  }
  document.querySelectorAll('.cat-filters').forEach(function (panel) {
    panel.querySelectorAll('.cat').forEach(function (c) {
      c.addEventListener('click', function () {
        if (c.classList.contains('active')) {
          // снять фильтр -> показать все
          panel.querySelectorAll('.cat').forEach(function (x) { x.classList.remove('active'); });
          var grid = panel.nextElementSibling;
          if (grid) grid.querySelectorAll('.tcard').forEach(function (card) { card.style.display = ''; });
        } else {
          panel.querySelectorAll('.cat').forEach(function (x) { x.classList.remove('active'); });
          c.classList.add('active');
          applyCatFilter(panel, c.getAttribute('data-cat'));
        }
      });
    });
  });

  // ---------- Вкладки городов (главная) ----------
  var tabs = document.querySelectorAll('#cityTabs .tab');
  if (tabs.length) {
    function switchCity(city) {
      tabs.forEach(function (t) {
        t.classList.toggle('active', t.getAttribute('data-tab') === city);
      });
      var kh = document.getElementById('khurgada');
      var sh = document.getElementById('sharm');
      if (kh) kh.classList.toggle('hidden', city !== 'khurgada');
      if (sh) sh.classList.toggle('hidden', city !== 'sharm');
    }
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        switchCity(t.getAttribute('data-tab'));
      });
    });
    switchCity('khurgada');
  }

  // ---------- Карусель на первом экране ----------
  var car = document.getElementById('heroCar');
  if (car) {
    var slides = Array.prototype.slice.call(car.querySelectorAll('.hero-slide'));
    var dotsWrap = document.getElementById('heroDots');
    if (slides.length && dotsWrap) {
      var dots = [];
      slides.forEach(function (s, i) {
        var d = document.createElement('button');
        d.className = 'hero-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'Слайд ' + (i + 1));
        d.addEventListener('click', function () { show(i); });
        dotsWrap.appendChild(d);
        dots.push(d);
      });
      var cur = 0, timer;
      function show(i) {
        cur = i;
        slides.forEach(function (s, k) { s.classList.toggle('active', k === i); });
        dots.forEach(function (d, k) { d.classList.toggle('active', k === i); });
      }
      function next() { show((cur + 1) % slides.length); }
      function start() { timer = setInterval(next, 4500); }
      dots.forEach(function (d) {
        d.addEventListener('mouseenter', function () { clearInterval(timer); });
      });
      dotsWrap.addEventListener('mouseleave', start);
      start();
    }
  }

  // ---------- Подборщик (квиз) ----------
  var qStep1 = document.getElementById('qStep1');
  if (qStep1) {
    var QDATA = {
      khurgada: {
        history: ['Луксор и Долина царей', '⏱ 14 ч · от $40 · ★ 4.9 · 112 отзывов', 'от $40', 'img/luxor.jpg'],
        sea: ['Оранжевая бухта', '⏱ 7 ч · от $25 · ★ 4.9 · 140 отзывов', 'от $25', 'img/orange-bay.jpg'],
        extreme: ['Сафари на квадроциклах', '⏱ 3 ч · от $20 · ★ 4.7 · 88 отзывов', 'от $20', 'img/safari.jpg'],
        family: ['Оранжевая бухта', '⏱ 7 ч · от $25 · отлично с детьми', 'от $25', 'img/orange-bay.jpg']
      },
      sharm: {
        history: ['Каир и пирамиды', '⏱ 17 ч · от $45 · ★ 4.8 · 95 отзывов', 'от $45', 'img/kair.jpg'],
        sea: ['Рас-Мохаммед', '⏱ 7 ч · от $30 · ★ 4.9 · 176 отзывов', 'от $30', 'img/ras-mohammed.jpg'],
        extreme: ['Остров Тиран', '⏱ 8 ч · от $40 · ★ 4.8 · 121 отзыв', 'от $40', 'img/tiran.jpg'],
        family: ['Остров Тиран', '⏱ 8 ч · от $40 · отлично с детьми', 'от $40', 'img/tiran.jpg']
      }
    };
    var CITYNAME = { khurgada: 'Хургады', sharm: 'Шарм-эль-Шейха' };
    var qCity = 'khurgada', qInt = 'sea';
    function qShow(id) {
      document.querySelectorAll('.quiz-step').forEach(function (s) { s.classList.add('hidden'); });
      var el = document.getElementById(id);
      if (el) el.classList.remove('hidden');
    }
    function qProgress(txt) {
      var p = document.getElementById('qProg');
      if (p) p.textContent = txt;
    }
    function bindStep(stepId, attr, cb) {
      var step = document.getElementById(stepId);
      if (!step) return;
      step.querySelectorAll('.q-opt').forEach(function (o) {
        o.addEventListener('click', function () {
          step.querySelectorAll('.q-opt').forEach(function (x) { x.classList.remove('active'); });
          o.classList.add('active');
          cb(o.getAttribute(attr));
        });
      });
    }
    bindStep('qStep1', 'city', function (v) { qCity = v; qProgress('Шаг 2 из 3 · Что вам ближе?'); qShow('qStep2'); });
    bindStep('qStep2', 'int', function (v) { qInt = v; qProgress('Шаг 3 из 3 · Бюджет на человека'); qShow('qStep3'); });
    bindStep('qStep3', 'budget', function () {
      var d = QDATA[qCity][qInt];
      var img = document.getElementById('qImg');
      var name = document.getElementById('qName');
      var meta = document.getElementById('qMeta');
      var price = document.getElementById('qPrice');
      var wa = document.getElementById('qWa');
      if (img) img.src = d[3];
      if (name) name.textContent = d[0];
      if (meta) meta.textContent = d[1];
      if (price) price.textContent = d[2];
      if (wa) wa.href = 'https://wa.me/201000000000?text=' + encodeURIComponent('Здравствуйте! Хочу забронировать «' + d[0] + '» из ' + CITYNAME[qCity] + '. Подскажите по датам, трансферу и бронированию.');
      qProgress('Готово! Ваша рекомендация');
      qShow('qResult');
    });
    var qAgain = document.getElementById('qAgain');
    if (qAgain) qAgain.addEventListener('click', function () {
      document.querySelectorAll('.quiz-step .q-opt').forEach(function (x) { x.classList.remove('active'); });
      qCity = 'khurgada'; qInt = 'sea';
      qProgress('Шаг 1 из 3 · Где вы отдыхаете?');
      qShow('qStep1');
    });
  }

  // ---------- Попап бронирования ----------
  var overlay = document.getElementById('bookModal');
  if (overlay) {
    var mExc = document.getElementById('mExcursion');
    var mPrice = document.getElementById('mPrice');
    var mDate = document.getElementById('mDate');
    var mAdults = document.getElementById('mAdults');
    var mKids = document.getElementById('mKids');
    var mHotel = document.getElementById('mHotel');
    var mName = document.getElementById('mName');
    var mSendWa = document.getElementById('mSendWa');
    var mSendTg = document.getElementById('mSendTg');
    var mClose = document.getElementById('mClose');
    var curExc = '', curPrice = '', curCity = '';

    function buildMsg() {
      var s = 'Здравствуйте! Хочу забронировать экскурсию «' + curExc + '»';
      if (curCity) s += ', ' + curCity;
      s += '.\nДата: ' + (mDate && mDate.value ? mDate.value : 'не выбрана');
      s += '\nВзрослых: ' + (mAdults ? mAdults.value : '') + ', детей: ' + (mKids ? mKids.value : '');
      if (mHotel && mHotel.value) s += '\nОтель/зона: ' + mHotel.value;
      if (mName && mName.value) s += '\nИмя: ' + mName.value;
      s += '\nПрошу подтвердить бронь.';
      return s;
    }
    function openModal(card) {
      var h3 = card ? card.querySelector('h3') : null;
      var pt = card ? card.querySelector('.price-tag') : null;
      curExc = h3 ? h3.textContent.trim() : 'Экскурсия';
      curPrice = pt ? pt.textContent.trim() : '';
      // определить город: сначала по блоку, затем по содержимому страницы
      var cityBlock = card ? (card.closest('#khurgada') ? 'Хургада' : (card.closest('#sharm') ? 'Шарм-эль-Шейх' : '')) : '';
      if (!cityBlock) {
        var body = document.body.innerHTML || '';
        if (/из Хургады|из Хургада|Хургады/.test(body)) cityBlock = 'Хургада';
        else if (/Шарм-эль-Шейха|Шарм-эль-Шейх/.test(body)) cityBlock = 'Шарм-эль-Шейх';
      }
      curCity = cityBlock;
      if (mExc) mExc.textContent = curExc;
      if (mPrice) mPrice.textContent = curPrice;
      if (mDate) { var d = new Date(); d.setDate(d.getDate() + 1); mDate.value = d.toISOString().slice(0, 10); }
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
    document.querySelectorAll('.book-btn').forEach(function (b) {
      b.addEventListener('click', function () { openModal(b.closest('.tcard')); });
    });
    if (mSendWa) mSendWa.addEventListener('click', function () {
      window.open('https://wa.me/201000000000?text=' + encodeURIComponent(buildMsg()), '_blank');
    });
    if (mSendTg) mSendTg.addEventListener('click', function () {
      window.open('https://t.me/suntripegypt?text=' + encodeURIComponent(buildMsg()), '_blank');
    });
    if (mClose) mClose.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
  }

  // ---------- Форма обратной связи (контакты) ----------
  document.querySelectorAll('form.contact-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
      form.reset();
    });
  });
})();
