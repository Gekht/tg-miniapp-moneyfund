const tg = window.Telegram.WebApp;
tg.expand();

const qs = new URLSearchParams(location.search);
const membersEncoded = qs.get("m") || "";
const members = [];

try {
  // формат m: URL-encoded строка "id:Имя,id:Имя,..."
  const raw = decodeURIComponent(membersEncoded);
  raw.split(",").forEach(pair => {
    const [id, ...nameParts] = pair.split(":");
    const name = nameParts.join(":");
    if (id && name) members.push({ id: id.trim(), name: name.trim() });
  });
} catch(e) {
  // оставим пустым список — мини-ап покажет подсказку
}

const exclBox = document.getElementById("exclude-list");
function renderMembers(list) {
  const box = document.getElementById("exclude-list");
  box.innerHTML = "";
  if (!list.length) {
    box.innerHTML = `<div class="muted">Список участников не передан. Открой через /app, чтобы подставились чекбоксы.</div>`;
    return;
  }
  list.forEach(m => {
    const row = document.createElement("div");
    row.className = "check-item";
    row.innerHTML = `
      <input type="checkbox" value="${m.id}">
      <div class="name">${m.name}</div>
      <div class="id">${m.id}</div>
    `;
    box.appendChild(row);
  });
}



// переключатель «выбрать/снять всех»
document.getElementById("toggle-all").addEventListener("click", () => {
  const boxes = exclBox.querySelectorAll('input[type="checkbox"]');
  const allChecked = [...boxes].every(b => b.checked);
  boxes.forEach(b => b.checked = !allChecked);
});

// отправка данных на бота
document.getElementById("create").addEventListener("click", () => {
  const excludeIds = [...document.querySelectorAll('#exclude-list input:checked')].map(el => el.value).join(',');
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
