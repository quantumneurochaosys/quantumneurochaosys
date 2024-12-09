// Константа для включения/отключения уведомления (используй true или false для активации)
const showNotificationForTesting = true; // Установи true, чтобы показать уведомление, false — чтобы скрыть

// Определяем текущий язык страницы (например, через тег <html lang="...">)
const currentLanguage = document.documentElement.lang || 'en'; // Убедитесь, что в <html> задан атрибут lang

// Проверяем, нужно ли показывать уведомление
if (!localStorage.getItem(`notification_accepted_${currentLanguage}`) && showNotificationForTesting) {
    const notificationBanner = document.createElement('div');
    notificationBanner.id = 'notification-banner';
    notificationBanner.style.position = 'fixed';
    notificationBanner.style.bottom = '0';
    notificationBanner.style.left = '0';
    notificationBanner.style.width = '100%';
    notificationBanner.style.backgroundColor = '#0d47a1'; // Соответствующий цвет фона сайта
    notificationBanner.style.color = '#fff';
    notificationBanner.style.padding = '10px';
    notificationBanner.style.textAlign = 'center';
    notificationBanner.style.fontSize = '14px';

    // Текст уведомления для текущего языка
    const messages = {
        en: `This website does not use cookies and does not collect personal data. All features of the website are available without registration.
        <button id="accept-notification" style="margin-left: 10px; background-color: #1565c0; color: white; border: none; padding: 5px 15px; border-radius: 5px;">Close</button>`,
        ru: `Этот сайт не использует файлы cookie и не собирает персональные данные. Все функции сайта доступны без регистрации.
        <button id="accept-notification" style="margin-left: 10px; background-color: #1565c0; color: white; border: none; padding: 5px 15px; border-radius: 5px;">Закрыть</button>`
    };

    notificationBanner.innerHTML = `<p>${messages[currentLanguage]}</p>`;
    document.body.appendChild(notificationBanner);

    // Добавляем обработчик на кнопку "Закрыть"
    document.getElementById('accept-notification').addEventListener('click', () => {
        localStorage.setItem(`notification_accepted_${currentLanguage}`, 'true'); // Сохраняем состояние с учетом языка
        notificationBanner.style.display = 'none'; // Скрываем уведомление
    });
}

// Функция для сброса состояния уведомления для отладки (очистить localStorage)
function resetNotificationState() {
    Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('notification_accepted_')) {
            localStorage.removeItem(key);
        }
    });
    console.log('Notification state reset for all languages. You can now test the notification again.');
}
// Для отладки можно вызвать resetNotificationState() в консоли браузера, чтобы сбросить состояние уведомления.