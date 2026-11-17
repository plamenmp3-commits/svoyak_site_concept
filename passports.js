const places = [
  {name: 'Грузия', folio: 'GE', color: '#75392e', foil: '#ffdfaa', image: 'georgia.jpg', alt: 'Зелёная долина между горами в Грузии', caption: 'Казбеги', title: 'Утро в горах', text: 'Тёплый хлеб из пекарни берём с собой. Позавтракаем на камне с видом на долину.'},
  {name: 'Териберка', folio: 'RU', color: '#244c63', foil: '#cbebf3', image: 'teriberka.jpg', alt: 'Берег Баренцева моря под облачным небом', caption: 'Баренцево море', title: 'На краю воды', text: 'Море перекатывает гальку. Прячем руки в рукава и греемся чаем из термоса.'},
  {name: 'Дагестан', folio: 'RU', color: '#344c39', foil: '#e0edaf', image: 'dagestan.jpg', alt: 'Горный пейзаж в Дагестане', caption: 'Дагестан', title: 'Дорога к аулу', text: 'За поворотом горы расступаются. Остановимся там, где все разом скажут «вот здесь».'},
  {name: 'Париж', folio: 'FR', color: '#563e62', foil: '#f5d6ee', image: 'paris.jpg', alt: 'Вид на Париж и Эйфелеву башню', caption: 'Париж', title: 'Вдоль Сены', text: 'Тёплый багет под мышкой, Сена за парапетом. На другой берег успеем после завтрака.'},
  {name: 'Венеция', folio: 'IT', color: '#884730', foil: '#ffe2be', image: 'venice.jpg', alt: 'Дома вдоль канала в Венеции', caption: 'Венеция', title: 'Через мостик', text: 'За первым мостиком пахнет кофе. За вторым слышно, как лодка задевает веслом камень.'}
];

const symbols = [
  '<path d="M6 49 25 19l9 14 7-10 17 26M18 30l7 3 4-6"/>',
  '<path d="M5 35q7-8 14 0t14 0t14 0t14 0M5 44q7-8 14 0t14 0t14 0t14 0M24 25a8 8 0 0 1 16 0"/>',
  '<path d="m5 44 18-8 6-14 7 3 5-10 13 4M9 51l19-8 7-11 7 3 6-9 11 3"/>',
  '<path d="M31 8h2l2 17 3 10 10 17H16l10-17 3-10zM25 37h14M27 31h10M25 52q7-17 14 0"/>',
  '<path d="M6 37h52M7 32l8-2c8-18 26-18 34 0l8 2M11 38v8m42-8v8M8 51q7-5 13 0t13 0t13 0t11 0"/>'
];

function cover(place, index) {
  return `<span class="pp-serial"><i aria-hidden="true"></i> <span>№ 0${index + 1}</span></span>
    <span class="pp-emblem"><svg aria-hidden="true" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${symbols[index]}</svg></span>
    <span class="pp-cover-name">${place.name}</span>`;
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
  section.innerHTML = `<div class="pp-intro"><h2 id="pp-heading">Где ещё <em>не бывали?</em></h2>
    </div>
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
    card.style.setProperty('--pp-angle', `${(i - 2) * 10}deg`);
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
        <figure class="pp-page pp-back"><img alt=""><figcaption></figcaption><span class="pp-stamp" aria-hidden="true"><i></i><b></b></span></figure>
      </div></div></div>`;
  document.body.append(dialog);
  const book = dialog.querySelector('.pp-book');
  const leaf = dialog.querySelector('.pp-leaf');
  const front = dialog.querySelector('.pp-front');
  const photo = dialog.querySelector('img');
  const dismiss = dialog.querySelector('.pp-dismiss');
  const shade = document.createElement('div');
  shade.className = 'pp-shade';
  dialog.prepend(shade);
  const motion = matchMedia('(prefers-reduced-motion: no-preference)');
  const easing = 'cubic-bezier(.4,0,.2,1)';
  let animations = [], selected, triggerButton, closing = false;

  function origin() {
    const card = selected.getBoundingClientRect();
    const slot = book.parentElement.getBoundingClientRect();
    const dx = card.left + card.width / 2 - (slot.left + slot.width * .75);
    const dy = card.top + card.height / 2 - (slot.top + slot.height / 2);
    const angle = selected.style.getPropertyValue('--pp-angle');
    return `translate(${dx}px, ${dy}px) rotate(${angle}) scale(${selected.offsetWidth / book.offsetWidth}, ${selected.offsetHeight / book.offsetHeight})`;
  }

  function animateOpen() {
    const timing = {duration: 760, fill: 'both'};
    animations = [
      book.animate([{transform:origin(),easing}, {offset:.5,transform:'translateX(-50%)',easing}, {transform:'none'}], timing),
      leaf.animate([{transform:'rotateY(0deg)'}, {offset:.42,transform:'rotateY(0deg)',easing}, {transform:'rotateY(-180deg)'}], timing),
      shade.animate([{opacity:0},{offset:.58,opacity:1},{opacity:1}], timing),
      dismiss.animate([{opacity:0},{opacity:1}], timing)
    ];
  }

  function open(index, trigger) {
    if (dialog.open || closing) return;
    const p = places[index];
    triggerButton = trigger;
    selected = cards[index];
    ink(book, p);
    front.innerHTML = cover(p, index);
    dialog.querySelector('.pp-stamp b').textContent = p.folio + ' · 0' + (index + 1);
    photo.src = './' + p.image;
    photo.alt = p.alt;
    dialog.querySelector('figcaption').textContent = p.caption;
    dialog.querySelector('.pp-code').textContent = p.folio + ' / 0' + (index + 1);
    dialog.querySelector('#pp-place').textContent = p.name;
    dialog.querySelector('.pp-title').textContent = p.title;
    dialog.querySelector('.pp-story').textContent = p.text;
    dialog.showModal();
    selected.classList.add('pp-selected');
    if (motion.matches && book.animate) animateOpen();
  }

  async function close() {
    if (closing || !dialog.open) return;
    closing = true;
    if (animations.length && motion.matches) {
      const flight = animations[0];
      if (flight.playState === 'finished') {
        // The viewport may have resized while the passport was open.
        const frames = flight.effect.getKeyframes();
        frames[0].transform = origin();
        flight.effect.setKeyframes(frames);
      }
      for (const animation of animations) animation.reverse();
      await Promise.allSettled(animations.map(a => a.finished));

      // Both covers now occupy the same slot. Paint the lower one before fading the upper.
      const fade = {duration:480, fill:'both'};
      const reveal = selected.animate([{opacity:0, easing:'ease-out'}, {offset:.2,opacity:1}, {opacity:1}], fade);
      const dissolve = book.animate([{opacity:1}, {offset:.25,opacity:1, easing:'ease-in-out'}, {opacity:0}], fade);
      animations.push(reveal, dissolve);
      await Promise.allSettled([reveal.finished, dissolve.finished]);
    }
    selected.classList.remove('pp-selected');
    dialog.close();
    animations.forEach(a => a.cancel());
    animations = [];
    triggerButton.focus({preventScroll:true});
    closing = false;
  }
  dialog.addEventListener('cancel', e => { e.preventDefault(); close(); });
  dialog.addEventListener('click', e => { if (e.target === dialog || e.target === shade || e.target === dismiss) close(); });
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
