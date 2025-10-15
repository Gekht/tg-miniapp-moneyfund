// MoneyFund Mini-App (создание сбора + чекбоксы исключений)
const tg = window.Telegram.WebApp;
tg.expand();

// Берём список участников из параметра m (id:Имя,id:Имя,...) — URL-encoded
const qs = new URLSearchParams(location.search);
const membersEncoded = qs.get("m") || "";
const members = [];
try {
  // допускаем и base64, и url-строку — на всякий
  let raw = decodeURIComponent(membersEncoded || "");
  if (/^[A-Za-z0-9+/=]+$/.test(raw)) {
    // похоже на base64 — попробуем раскодировать
    raw = atob(raw);
  }
  // формат: id:Имя,id:Имя
  raw.split(",").forEach(pair => {
    const [id, ...nameParts] = pair.split(":");
    const name = nameParts.join(":");
    if (id && name) members.push({ id: id.trim(), name: name.trim() });
  });
} catch (e) {
  // тихо игнорим — список просто будет пустой
}

const exclBox = document.getElementById("exclude-list");
function renderMembers(list) {
  exclBox.innerHTML = "";
  if (!list.length) {
    exclBox.innerHTML = `<div class="muted">Список участников не передан. Открой через /app, чтобы подставились чекбоксы.</div>`;
    return;
  }
  list.forEach(m => {
    const div = document.createElement("label");
    div.className = "check-item";
    div.innerHTML = `
      <input type="checkbox" value="${m.id}">
      <span>${m.name} <i class="mid">${m.id}</i></span>
    `;
    exclBox.appendChild(div);
  });
}
renderMembers(members);

document.getElementById("toggle-all").addEventListener("click", () => {
  const boxes = exclBox.querySelectorAll('input[type="checkbox"]');
  const allChecked = [...boxes].every(b => b.checked);
  boxes.forEach(b => b.checked = !allChecked);
});

document.getElementById("create").addEventListener("click", () => {
  const excludeIds = [...document.querySelectorAll('#exclude-list input:checked')].map(el => el.value).join(',');
  const payload = {
    t: "create_collection",
    exclude: excludeIds, // отправляем только id
    title: document.getElementById("c_title").value.trim(),
    collector: document.getElementById("c_collector").value.trim(),
    beneficiary: document.getElementById("c_beneficiary").value.trim(),
    target: document.getElementById("c_target").value.trim(),
    requisites: document.getElementById("c_requisites").value.trim(),
    copy_text: document.getElementById("c_copy").value.trim(),
  };

  // простая валидация
  if (!payload.title || !payload.collector || !payload.requisites) {
    document.getElementById("status").textContent = "Название, сборщик и реквизиты — обязательны.";
    return;
  }

  tg.sendData(JSON.stringify(payload));
  tg.close();
});
