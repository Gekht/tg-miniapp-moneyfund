const tg = window.Telegram.WebApp;
tg.expand();

// ----- парсим участников из m= -----
const qs = new URLSearchParams(location.search);
const membersParam = qs.get("m") || "";
const members = [];

try {
  const raw = decodeURIComponent(membersParam); // "id:Имя,id:Имя,..."
  raw.split(",").forEach(s => {
    const i = s.indexOf(":");
    if (i > 0) {
      const id = s.slice(0, i).trim();
      const name = s.slice(i + 1).trim();
      if (id) members.push({ id, name });
    }
  });
} catch (e) {
  // игнорим: список останется пустым
}

// ----- рендер чекбоксов -----
const exclBox = document.getElementById("exclude-list");
function renderMembers(list) {
  row.innerHTML = `
  <input type="checkbox" value="${m.id}">
  <span class="name">${m.name}</span>
  <span class="id">${m.id}</span>
`;
  }
  list.forEach(m => {
    const row = document.createElement("div");
    row.className = "check-item";
    row.innerHTML = `
      <input type="checkbox" value="${m.id}">
      <div class="name">${m.name}</div>
      <div class="id">${m.id}</div>
    `;
    exclBox.appendChild(row);
  });
}
renderMembers(members);

// выбрать/снять всех
document.getElementById("toggle-all").addEventListener("click", () => {
  const boxes = exclBox.querySelectorAll('input[type="checkbox"]');
  const allChecked = [...boxes].every(b => b.checked);
  boxes.forEach(b => (b.checked = !allChecked));
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
