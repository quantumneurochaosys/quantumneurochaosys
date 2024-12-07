// Константа для включения/отключения уведомления (используй true или false для активации)
const showNotificationForTesting = true; // Установи true, чтобы показать уведомление, false — чтобы скрыть

// Проверяем, нужно ли показывать уведомление
if (!localStorage.getItem('notification_accepted') && showNotificationForTesting) {
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
    notificationBanner.innerHTML = `
        <p>Этот сайт не использует куки и не собирает личные данные. Все функции сайта доступны без регистрации. 
        <button id="accept-notification" style="margin-left: 10px; background-color: #1565c0; color: white; border: none; padding: 5px 15px; border-radius: 5px;">Закрыть</button></p>
    `;

    document.body.appendChild(notificationBanner);

    // Добавляем обработчик на кнопку "Закрыть"
    document.getElementById('accept-notification').addEventListener('click', () => {
        localStorage.setItem('notification_accepted', 'true'); // Сохраняем состояние в локальном хранилище
        notificationBanner.style.display = 'none'; // Скрываем уведомление
    });
}

// Функция для сброса состояния уведомления для отладки (очистить localStorage)
function resetNotificationState() {
    localStorage.removeItem('notification_accepted'); // Убираем флаг из localStorage, чтобы уведомление снова появилось
    console.log('Notification state reset. You can now test the notification again.');
}

// Для отладки можно вызвать resetNotificationState() в консоли браузера, чтобы сбросить состояние уведомления.
