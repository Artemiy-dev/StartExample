"use strict";

/* ==========================================================================
   Настройки: укажите свои контакты
   WhatsApp — номер в международном формате без «+»
   Telegram — username без «@»
   ========================================================================== */
const CONFIG = {
  whatsappPhone: "77770000000",
  telegramUser: "devstudio_kz",
  minPhoneDigits: 10,
};

const form = document.getElementById("lead");
const status = document.getElementById("status");

/** Показывает сообщение под формой. */
function showStatus(text, isError = false) {
  status.textContent = text;
  status.classList.toggle("is-error", isError);
}

/** Собирает текст заявки из полей формы. */
function buildMessage({ name, phone, size, note }) {
  const lines = [
    "Заявка с сайта ЛанчБокс",
    `Имя: ${name.trim()}`,
    `Телефон: ${phone.trim()}`,
    `Команда: ${size}`,
  ];

  if (note.trim()) {
    lines.push(`Комментарий: ${note.trim()}`);
  }

  return lines.join("\n");
}

/** Возвращает ссылку на мессенджер с готовым текстом. */
function buildLink(channel, text) {
  const encoded = encodeURIComponent(text);

  return channel === "wa"
    ? `https://wa.me/${CONFIG.whatsappPhone}?text=${encoded}`
    : `https://t.me/${CONFIG.telegramUser}?text=${encoded}`;
}

/** Проверяет обязательные поля. */
function isValid({ name, phone }) {
  const digits = phone.replace(/\D/g, "");
  return name.trim() !== "" && digits.length >= CONFIG.minPhoneDigits;
}

/** Обработчик кнопок отправки. */
function handleSend(event) {
  const data = Object.fromEntries(new FormData(form));

  if (!isValid(data)) {
    showStatus("Укажите имя и телефон, чтобы мы могли связаться.", true);
    return;
  }

  const link = buildLink(event.currentTarget.dataset.channel, buildMessage(data));
  window.open(link, "_blank", "noopener");
  showStatus("Открываем мессенджер. Нажмите «Отправить», и заявка у нас.");
}

form
  .querySelectorAll("[data-channel]")
  .forEach((button) => button.addEventListener("click", handleSend));
