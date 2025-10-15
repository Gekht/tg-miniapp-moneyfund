/* MoneyFund Mini‑App */
const tg = window.Telegram.WebApp;
tg.expand();

const qs = new URLSearchParams(location.search);
const cid = qs.get('cid') || '';
const isAdmin = qs.get('admin') === '1';

const cidLine = document.getElementById('cid-line');
cidLine.textContent = cid ? `Сбор #${cid}` : 'ID сбора не передан';

const adminBox = document.getElementById('admin-create');
if (isAdmin && adminBox) adminBox.classList.remove('hide');

const amount = document.getElementById('amount');
const note = document.getElementById('note');
const submit = document.getElementById('submit');
const statusEl = document.getElementById('status');

submit.addEventListener('click', () => {
  const payload = { t:'payment', cid, amount: amount.value.trim() || null, note: note.value.trim() || null };
  tg.sendData(JSON.stringify(payload));
  tg.close();
});

// admin
const cTitle = document.getElementById('c_title');
const cCollector = document.getElementById('c_collector');
const cReq = document.getElementById('c_requisites');
const createBtn = document.getElementById('create');

createBtn?.addEventListener('click', () => {
  if (!isAdmin) { statusEl.textContent = 'Только админ.'; return; }
  const title = cTitle.value.trim();
  const collector = cCollector.value.trim();
  const requisites = cReq.value.trim();
  if (!title || !collector || !requisites) { statusEl.textContent = 'Заполни все поля.'; return; }
  tg.sendData(JSON.stringify({ t:'create_collection', title, collector, requisites }));
  tg.close();
});
