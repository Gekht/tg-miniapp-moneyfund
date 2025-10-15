/* MoneyFund Mini-App — non-admin */
const tg = window.Telegram.WebApp;
tg.expand();

const qs = new URLSearchParams(location.search);
const cid = qs.get('cid') || '';

document.getElementById('cid-line').textContent =
  cid ? `Сбор #${cid}` : 'ID сбора не передан';

// отметка перевода
document.getElementById('submit').addEventListener('click', () => {
  const payload = {
    t: 'payment',
    cid,
    amount: document.getElementById('amount').value.trim() || null,
    note: document.getElementById('note').value.trim() || null
  };
  tg.sendData(JSON.stringify(payload));
  tg.close();
});

// создание сбора
document.getElementById('create').addEventListener('click', () => {
  const payload = {
    t: 'create_collection',
    exclude: document.getElementById('excl').value.trim(),
    title: document.getElementById('c_title').value.trim(),
    collector: document.getElementById('c_collector').value.trim(),
    beneficiary: document.getElementById('c_beneficiary').value.trim(),
    target: document.getElementById('c_target').value.trim(),
    requisites: document.getElementById('c_requisites').value.trim(),
    copy_text: document.getElementById('c_copy').value.trim(),
  };
  tg.sendData(JSON.stringify(payload));
  tg.close();
});
