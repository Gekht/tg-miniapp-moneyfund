# Telegram Mini App (MoneyFund)

Мини‑ап открывается внутри Telegram и отправляет данные боту через `tg.sendData` (web_app_data).
Хостинг статических файлов — **GitHub Pages / Netlify** (бесплатно).

## Файлы
- `index.html`, `style.css`, `app.js` — фронтенд мини‑апа (без бэка).
- `bot_snippet.py` — пример бота, который показывает кнопку с Mini App и принимает `web_app_data`.
- `gas_api.js` — необязательный: пример Apps Script API, если хочешь писать в Google Sheets напрямую из Mini App.

## Сценарии работы
### Вариант А (проще)
1) Хостишь `index.html` на GitHub Pages.
2) Бот показывает кнопку `/app` → открывает Mini App.
3) Mini App отправляет данные обратно боту через `sendData` → бот пишет в Google Sheets.

### Вариант B (через API)
1) Mini App отправляет `fetch` на твой GAS endpoint (`doPost`) → там запись в таблицу.
2) Бот получает только уведомление/подтверждение.

## Быстрый старт на GitHub Pages
1. Сделай публичный репозиторий `tg-miniapp-moneyfund`.
2. Залей эти файлы в корень.
3. В настройках репозитория включи Pages (Deploy from branch, / root).
4. В `bot_snippet.py` укажи `MINIAPP_URL` на твой Pages-URL.

## Бот
- `/app` — показать кнопку, которая открывает Mini App
- при отправке формы в Mini App данные вернутся в `web_app_data`

