const places = [
  {name: 'Грузия', folio: 'GE', color: '#75392e', foil: '#ffdfaa', image: 'georgia.jpg', alt: 'Зелёная долина между горами в Грузии', caption: 'Казбеги', title: 'Утро в горах', text: 'Выйти пораньше, пока деревня только просыпается. Взять с собой хлеб из пекарни и найти камень с видом на долину. Завтрак может подождать ещё один кадр.'},
  {name: 'Териберка', folio: 'RU', color: '#244c63', foil: '#cbebf3', image: 'teriberka.jpg', alt: 'Берег Баренцева моря под облачным небом', caption: 'Баренцево море', title: 'На краю воды', text: 'Спуститься к каменному пляжу, спрятать руки в рукава и слушать, как волна перекатывает гальку. Чай из термоса здесь заканчивается подозрительно быстро.'},
  {name: 'Дагестан', folio: 'RU', color: '#344c39', foil: '#e0edaf', image: 'dagestan.jpg', alt: 'Горный пейзаж в Дагестане', caption: 'Дагестан', title: 'Дорога к аулу', text: 'За каждым поворотом хочется выйти из машины. Где-то дорога сужается до одной полосы, где-то горы вдруг расступаются. Остановимся там, где все разом скажут «вот здесь».'},
  {name: 'Париж', folio: 'FR', color: '#563e62', foil: '#f5d6ee', image: 'paris.jpg', alt: 'Вид на Париж и Эйфелеву башню', caption: 'Париж', title: 'Вдоль Сены', text: 'Купить ещё тёплый багет и свернуть к воде. Пройти под мостом, присесть на парапет и решить, на каком берегу проведём остаток дня.'},
  {name: 'Венеция', folio: 'IT', color: '#884730', foil: '#ffe2be', image: 'venice.jpg', alt: 'Дома вдоль канала в Венеции', caption: 'Венеция', title: 'Через мостик', text: 'Утром город слышно по шагам на мостовых. Свернём в переулок за первым запахом кофе, а потом выберем мостик, с которого видно, как лодки расходятся в тесном канале.'}
];

const symbols = [
  '<path d="M6 49 25 19l9 14 7-10 17 26M18 30l7 3 4-6"/>',
  '<path d="M5 35q7-8 14 0t14 0t14 0t14 0M5 44q7-8 14 0t14 0t14 0t14 0M24 25a8 8 0 0 1 16 0"/>',
  '<path d="m5 44 18-8 6-14 7 3 5-10 13 4M9 51l19-8 7-11 7 3 6-9 11 3"/>',
  '<path d="M31 8h2l2 17 3 10 10 17H16l10-17 3-10zM25 37h14M27 31h10M25 52q7-17 14 0"/>',
  '<path d="M6 37h52M7 32l8-2c8-18 26-18 34 0l8 2M11 38v8m42-8v8M8 51q7-5 13 0t13 0t13 0t11 0"/>'
];

function cover(place, index) {
  return `<span class="pp-serial">СВОЯК <span>№ 0${index + 1}</span></span>
    <span class="pp-emblem"><svg aria-hidden="true" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${symbols[index]}</svg></span>
    <span class="pp-cover-name">${place.name}</span><span class="pp-cover-small">Паспорт места</span>`;
}

function ink(element, place) {
  element.style.setProperty('--pp-color', place.color);
  element.style.setProperty('--pp-foil', place.foil);
}

function install(trips) {
  const section = document.createElement('section');
  section.id = 'passports';
  section.className = 'pp-section shell';
  section.setAttribute('aria-labelledby', 'pp-heading');
  section.innerHTML = `<div class="pp-intro"><h2 id="pp-heading">Паспорта <em>мест.</em></h2>
    <p>Выбери обложку, чтобы заглянуть внутрь.</p></div>
    <div class="pp-fan"></div><div class="pp-index" aria-label="Выбор паспорта"></div>`;
  trips.before(section);
  const heroLink = document.querySelector('.hero-copy a[href="#trips"]');
  if (heroLink) heroLink.href = '#passports';
  const fan = section.querySelector('.pp-fan');
  const list = section.querySelector('.pp-index');
  const cards = places.map((place, i) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'pp-card pp-cover';
    card.setAttribute('aria-label', 'Открыть паспорт — ' + place.name);
    card.setAttribute('aria-haspopup', 'dialog');
    card.style.setProperty('--pp-i', i - 2);
    card.style.setProperty('--pp-y', Math.abs(i - 2) ** 2);
    ink(card, place);
    card.innerHTML = cover(place, i);
    fan.append(card);
    const choice = document.createElement('button');
    choice.type = 'button';
    choice.setAttribute('aria-haspopup', 'dialog');
    choice.innerHTML = `<small>0${i + 1}</small>${place.name}`;
    list.append(choice);
    for (const trigger of [card, choice]) trigger.addEventListener('click', () => open(i, trigger));
    return card;
  });

  const dialog = document.createElement('dialog');
  dialog.className = 'pp-dialog';
  dialog.setAttribute('aria-labelledby', 'pp-place');
  dialog.innerHTML = `<button class="pp-dismiss" type="button" aria-label="Закрыть паспорт" autofocus>×</button>
    <div class="pp-spread"><div class="pp-book">
      <div class="pp-page pp-right"><div class="pp-page-text"><small class="pp-code"></small><h2 id="pp-place"></h2><h3 class="pp-title"></h3><p class="pp-story"></p></div></div>
      <div class="pp-leaf"><div class="pp-front pp-cover" aria-hidden="true"></div>
        <figure class="pp-page pp-back"><img alt=""><figcaption></figcaption></figure>
      </div></div></div>`;
  document.body.append(dialog);
  const book = dialog.querySelector('.pp-book');
  const leaf = dialog.querySelector('.pp-leaf');
  const front = dialog.querySelector('.pp-front');
  const photo = dialog.querySelector('img');
  let animations = [];
  let triggerButton, selected, closing = false;
  function open(index, trigger) {
    if (dialog.open) return;
    const p = places[index];
    triggerButton = trigger;
    selected = cards[index];
    const start = selected.getBoundingClientRect();
    const tilt = (index - 2) * 10;
    ink(book, p);
    front.innerHTML = cover(p, index);
    photo.src = './' + p.image;
    photo.alt = p.alt;
    dialog.querySelector('figcaption').textContent = p.caption;
    dialog.querySelector('.pp-code').textContent = p.folio + ' / 0' + (index + 1);
    dialog.querySelector('#pp-place').textContent = p.name;
    dialog.querySelector('.pp-title').textContent = p.title;
    dialog.querySelector('.pp-story').textContent = p.text;
    dialog.showModal();
    selected.classList.add('pp-selected');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !book.animate) return;
    const end = book.getBoundingClientRect();
    const dx = start.left + start.width / 2 - end.left - end.width / 2;
    const dy = start.top + start.height / 2 - end.top - end.height / 2;
    const first = `translate(${dx}px, ${dy}px) rotate(${tilt}deg) scale(${selected.offsetWidth / end.width}, ${selected.offsetHeight / end.height})`;
    const timing = {duration: 840, fill: 'both'};
    const easing = 'cubic-bezier(.22,.76,.22,1)';
    animations = [
      book.animate([{transform:first, easing}, {offset:.46, transform:'translateX(-50%)', easing}, {transform:'none'}], timing),
      leaf.animate([{transform:'rotateY(0deg)'}, {offset:.46, transform:'rotateY(0deg)', easing}, {transform:'rotateY(-180deg)'}], timing)
    ];
  }
  async function close() {
    if (closing || !dialog.open) return;
    closing = true;
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (const animation of animations) { animation.playbackRate = -1.7; animation.play(); }
      await Promise.allSettled(animations.map(a => a.finished));
    }
    dialog.close();
  }
  dialog.addEventListener('cancel', e => { e.preventDefault(); close(); });
  dialog.addEventListener('click', e => { if (e.target === dialog || e.target.closest('.pp-dismiss')) close(); });
  dialog.addEventListener('close', () => {
    animations.forEach(a => a.cancel());
    animations = [];
    selected.classList.remove('pp-selected');
    triggerButton.focus({preventScroll:true});
    closing = false;
  });
  if (location.hash === '#passports') section.scrollIntoView({behavior:'instant'});
}

function mount() {
  const trips = document.getElementById('trips');
  if (!trips) return false;
  install(trips);
  return true;
}
if (!mount()) {
  const observer = new MutationObserver(() => { if (mount()) observer.disconnect(); });
  observer.observe(document.getElementById('root'), {childList:true, subtree:true});
}
