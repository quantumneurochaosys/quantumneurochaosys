const scripts = ['js/notificationBanner_ru.js', 'js/QuantumNeuroChaOSys.js', 'js/animation.js'];

// Функция для последовательной загрузки скриптов
function loadScriptSequentially(scripts, index = 0) {
    if (index >= scripts.length) return; // Все скрипты загружены

    const script = document.createElement('script');
    script.src = scripts[index];

    // После загрузки текущего скрипта, загружаем следующий
    script.onload = function () {
        loadScriptSequentially(scripts, index + 1);
    };

    // Добавляем скрипт в head
    document.head.appendChild(script);
}

// Начать загрузку скриптов
loadScriptSequentially(scripts);
