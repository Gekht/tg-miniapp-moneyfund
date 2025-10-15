// Telegram Mini App client
const tg = window.Telegram.WebApp;
tg.expand(); // максимально раскрыть
tg.MainButton.setParams({ text: "Отправить", is_visible: false });

const qs = new URLSearchParams(location.search);
const collection_id = qs.get("cid") || ""; // можно прокинуть ?cid=1 через кнопки бота

const amountInput = document.getElementById("amount");
const noteInput = document.getElementById("note");
const submitBtn = document.getElementById("submit");
const statusEl = document.getElementById("status");

// Отправка через sendData (вернётся боту как web_app_data)
function sendBackToBot(payload) {
  tg.sendData(JSON.stringify(payload));
  tg.close();
}

submitBtn.addEventListener("click", async () => {
  const amount = amountInput.value.trim();
  const note = noteInput.value.trim();
  const payload = {
    t: "payment",
    cid: collection_id,
    amount: amount || null,
    note: note || null
  };
  statusEl.textContent = "Отправляю...";
  try {
    sendBackToBot(payload);
  } catch (e) {
    statusEl.textContent = "Ошибка отправки. Попробуйте ещё раз.";
  }
});
