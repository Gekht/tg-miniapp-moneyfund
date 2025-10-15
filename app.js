// Telegram WebApp bootstrap
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.expand();
  tg.ready();
}

// -------- UI panels
const panelMenu   = document.getElementById('menu');
const panelCreate = document.getElementById('create');

const showPanel = (which) => {
  panelMenu.classList.toggle('hidden', which !== 'menu');
  panelCreate.classList.toggle('hidden', which !== 'create');
  panelCreate.setAttribute('aria-hidden', which !== 'create');
};

document.getElementById('btn-open-create').addEventListener('click', () => showPanel('create'));
document.getElementById('btn-back').addEventListener('click', () => showPanel('menu'));

// -------- members list from URL (?m=uid:Имя,uid:Имя,…)
function getUrlParams() {
  const p = new URLSearchParams(location.search);
  return {
    cid: p.get('cid') || '',
    m:   p.get('m')   || ''
  };
}

function renderExcludeList(mParam) {
  const box = document.getElementById('exclude-list');
  box.innerHTML = '';

  if (!mParam) return;

  const parts = mParam.split(',')
    .map(s => s.trim())
    .filter(Boolean);

  parts.forEach(item => {
    const [id, ...nameParts] = item.split(':');
    const name = nameParts.join(':') || id;

    const row = document.createElement('label');
    row.className = 'exclude-item';

    const cb  = document.createElement('input');
    cb.type = 'checkbox';
    cb.value = id;

    const nm = document.createElement('span');
    nm.className = 'exclude-name';
    nm.textContent = name;

    const idSmall = document.createElement('span');
    idSmall.className = 'exclude-id';
    idSmall.textContent = id;

    row.append(cb, nm, idSmall);
    box.appendChild(row);
  });
}

(function initFromUrl(){
  const {cid, m} = getUrlParams();
  renderExcludeList(m);
  // если хотим открывать сразу создание
  if (cid || m) showPanel('create');
})();

// toggle all
document.getElementById('btn-toggle-all').addEventListener('click', () => {
  const boxes = [...document.querySelectorAll('#exclude-list input[type="checkbox"]')];
  const someUnchecked = boxes.some(b => !b.checked);
  boxes.forEach(b => { b.checked = someUnchecked; });
});

// -------- Menu buttons (remind/report last)
document.getElementById('btn-remind-last').addEventListener('click', () => {
  sendData({ t: 'remind_last' });
});
document.getElementById('btn-report-last').addEventListener('click', () => {
  sendData({ t: 'report_last' });
});

// -------- Create submit
document.getElementById('create-submit').addEventListener('click', () => {
  const excludeIds = [...document.querySelectorAll('#exclude-list input:checked')]
    .map(el => el.value).join(',');

  const payload = {
    t: 'create_collection',
    exclude: excludeIds,
    title:       document.getElementById('c_title').value.trim(),
    collector:   document.getElementById('c_collector').value.trim(),
    beneficiary: document.getElementById('c_beneficiary').value.trim(),
    target:      document.getElementById('c_target').value.trim(),
    requisites:  document.getElementById('c_requisites').value.trim(),
    copy_text:   document.getElementById('c_copy').value.trim(),
  };

  if (!payload.title || !payload.collector || !payload.requisites) {
    document.getElementById('status').textContent = 'Название, сборщик и реквизиты — обязательны.';
    return;
  }

  sendData(payload);
});

// helper to send data to the bot
function sendData(obj){
  if (tg && tg.sendData) {
    tg.sendData(JSON.stringify(obj));
    // закрываем только на create, меню пусть остаётся
    if (obj.t === 'create_collection') tg.close();
  } else {
    // для локальной отладки
    alert('Отправка:\n' + JSON.stringify(obj, null, 2));
  }
}
