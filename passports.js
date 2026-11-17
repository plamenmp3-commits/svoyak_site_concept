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
    <div class="pp-rail"><div class="pp-fan"></div></div><div class="pp-index" aria-label="Выбор паспорта"></div>`;
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
        <figure class="pp-page pp-back"><img alt=""><figcaption></figcaption><span class="pp-stamp" aria-hidden="true"><i></i><b></b></span></figure>
      </div></div></div>`;
  document.body.append(dialog);
  const book = dialog.querySelector('.pp-book');
  const leaf = dialog.querySelector('.pp-leaf');
  const front = dialog.querySelector('.pp-front');
  const photo = dialog.querySelector('img');
  const rail = section.querySelector('.pp-rail');
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
    const angle = Number(selected.style.getPropertyValue('--pp-i')) * 5;
    return `translate(${dx}px, ${dy}px) rotate(${angle}deg) scale(${selected.offsetWidth / book.offsetWidth}, ${selected.offsetHeight / book.offsetHeight})`;
  }

  function animate(opening) {
    const closed = origin();
    const timeline = {duration: opening ? 800 : 720, fill: 'both'};
    const flight = opening
      ? [{transform: closed}, {offset: .5, transform:'translateX(-50%)'}, {transform:'none'}]
      : [{transform:getComputedStyle(book).transform}, {offset:.46, transform:'translateX(-50%)'}, {offset:.91, transform:closed}, {transform:closed}];
    const turn = opening
      ? [{transform:'rotateY(0deg)'}, {offset:.42, transform:'rotateY(0deg)'}, {transform:'rotateY(-180deg)'}]
      : [{transform:'rotateY(-180deg)'}, {offset:.46, transform:'rotateY(0deg)'}, {transform:'rotateY(0deg)'}];
    const frames = (items) => items.map(frame => ({...frame, easing}));
    const dim = opening ? [0,1] : [Number(getComputedStyle(shade).opacity),0];
    animations.forEach(a => a.cancel());
    animations = [
      book.animate(frames(flight),timeline),
      leaf.animate(frames(turn),timeline),
      shade.animate([{opacity:dim[0]}, {offset:opening ? .58 : .88,opacity:dim[1]}, {opacity:dim[1]}], timeline),
      dismiss.animate([{opacity:opening ? 0 : 1}, {opacity:opening ? 1 : 0}], timeline)
    ];
    if (!opening) {
      // The real cover comes back under its neighbours while the flying cover is already at rest.
      animations.push(selected.animate([{opacity:0},{offset:.909,opacity:0},{offset:.91,opacity:1},{opacity:1}],timeline));
      animations.push(book.animate([{opacity:1},{offset:.91,opacity:1},{opacity:0}],timeline));
    }
  }

  function open(index, trigger) {
    if (dialog.open || closing) return;
    const p = places[index];
    triggerButton = trigger;
    selected = cards[index];
    const bounds = selected.getBoundingClientRect();
    const railBox = rail.getBoundingClientRect();
    if (bounds.left < railBox.left || bounds.right > railBox.right) {
      rail.scrollLeft += bounds.left + bounds.width / 2 - railBox.left - railBox.width / 2;
    }
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
    if (motion.matches && book.animate) animate(true);
  }

  async function close() {
    if (closing || !dialog.open) return;
    closing = true;
    if (animations.length && motion.matches) {
      if (animations[0].playState === 'finished') {
        animate(false);
      } else {
        // Close from the current frame when tapped during lift-off.
        for (const a of animations) a.reverse();
      }
      await Promise.allSettled(animations.map(a => a.finished));
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
