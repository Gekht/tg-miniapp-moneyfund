// --- переключение панелей ---
function showSection(name) {
  const menu = document.getElementById('menu');
  const create = document.getElementById('create');
  if (name === 'create') {
    menu.classList.add('hidden');
    create.classList.remove('hidden');
  } else {
    create.classList.add('hidden');
    menu.classList.remove('hidden');
  }
}

// начальное состояние: показываем меню
showSection('menu');

// кнопки меню
document.getElementById('btn-open-create').addEventListener('click', () => {
  showSection('create');
});

document.getElementById('btn-remind-last').addEventListener('click', () => {
  tg.sendData(JSON.stringify({ t: 'remind_last' }));   // бот отправит напоминания по последнему сбору
  tg.close();
});

document.getElementById('btn-report-last').addEventListener('click', () => {
  tg.sendData(JSON.stringify({ t: 'report_last' }));   // бот пришлёт отчёт по последнему
  tg.close();
});

// кнопка «назад» из формы
document.getElementById('btn-back').addEventListener('click', () => {
  showSection('menu');
});

// отправка «создать сбор»
document.getElementById('create-submit').addEventListener('click', () => {
  const excludeIds = [...document.querySelectorAll('#exclude-list input:checked')].map(el => el.value).join(',');
  const payload = {
    t: 'create_collection',
    exclude: excludeIds,
    title: document.getElementById('c_title').value.trim(),
    collector: document.getElementById('c_collector').value.trim(),
    beneficiary: document.getElementById('c_beneficiary').value.trim(),
    target: document.getElementById('c_target').value.trim(),
    requisites: document.getElementById('c_requisites').value.trim(),
    copy_text: document.getElementById('c_copy').value.trim(),
  };

  if (!payload.title || !payload.collector || !payload.requisites) {
    document.getElementById('status').textContent = 'Название, сборщик и реквизиты — обязательны.';
    return;
  }

  tg.sendData(JSON.stringify(payload));
  tg.close();
});

const tg = window.Telegram.WebApp;
tg.expand();

const tg = window.Telegram.WebApp;
tg.expand();

function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// меню ↔ форма
document.getElementById('menu-create')?.addEventListener('click', ()=> show('screen-create'));
document.getElementById('back-menu')?.addEventListener('click', ()=> show('screen-menu'));

// действия по последнему сбору — шлём в бота web_app_data
document.getElementById('menu-remind')?.addEventListener('click', ()=>{
  tg.sendData(JSON.stringify({ t: 'remind_last' }));
  document.getElementById('menu-status').textContent = 'Отправил команду напоминания…';
});

document.getElementById('menu-report')?.addEventListener('click', ()=>{
  tg.sendData(JSON.stringify({ t: 'report_last' }));
  document.getElementById('menu-status').textContent = 'Запросил отчёт…';
});

// оставь весь твой существующий код create-формы,
// только он теперь находится на экране #screen-create

// ----- парсим участников из m= -----
const qs = new URLSearchParams(location.search);
const membersParam = qs.get("m") || "";
const members = [];
try {
  const raw = decodeURIComponent(membersParam); // "id:Имя,id:Имя"
  raw.split(",").forEach(s => {
    const i = s.indexOf(":");
    if (i > 0) {
      const id = s.slice(0, i).trim();
      const name = s.slice(i + 1).trim();
      if (id) members.push({ id, name });
    }
  });
} catch (e) {
  console.warn("Не смог распарсить m=", e);
}

// ----- рендерим мультиселект -----
const exclWrap = document.getElementById("exclude-list");

function renderMembersSelect(list) {
  exclWrap.innerHTML = "";
  if (!list.length) {
    exclWrap.innerHTML = `<div class="muted">Список участников не передан. Открой через /app, чтобы подставились участники.</div>`;
    return;
  }
  const sel = document.createElement("select");
  sel.id = "excludeSelect";
  sel.className = "multiselect";
  sel.multiple = true;
  // высота по количеству, но не выше 8 строк
  sel.size = Math.min(list.length, 8);

  list.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m.id;
    opt.textContent = `${m.name} — ${m.id}`;
    sel.appendChild(opt);
  });

  exclWrap.appendChild(sel);
}
renderMembersSelect(members);

// выбрать/снять всех
document.getElementById("toggle-all")?.addEventListener("click", () => {
  const sel = document.getElementById("excludeSelect");
  if (!sel) return;
  const allSelected = sel.options.length && Array.from(sel.options).every(o => o.selected);
  Array.from(sel.options).forEach(o => o.selected = !allSelected);
});


// отправка данных на бота
document.getElementById("create").addEventListener("click", () => {
  const sel = document.getElementById("excludeSelect");
  const excludeIds = sel ? Array.from(sel.selectedOptions).map(o => o.value).join(',') : '';

  const payload = {
    t: "create_collection",
    exclude: excludeIds, // отправляем только ID
    title: document.getElementById("c_title").value.trim(),
    collector: document.getElementById("c_collector").value.trim(),
    beneficiary: document.getElementById("c_beneficiary").value.trim(),
    target: document.getElementById("c_target").value.trim(),
    requisites: document.getElementById("c_requisites").value.trim(),
    copy_text: document.getElementById("c_copy").value.trim(),
  };

  if (!payload.title || !payload.collector || !payload.requisites) {
    document.getElementById("status").textContent = "Название, сборщик и реквизиты — обязательны.";
    return;
  }

  tg.sendData(JSON.stringify(payload));
  tg.close();
});
