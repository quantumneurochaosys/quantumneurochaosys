// Инициализация канваса
const canvas = document.getElementById("neuro-canvas");
const ctx = canvas.getContext("2d");

// Настройка размера канваса
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Входная строка
const inputString = "QuantumNeuroChaos";

// Параметры для анимации
let numNodes = 10;  // Уменьшено количество узлов для оптимизации
let nodes = [];  // Массив для хранения значений для каждой точки
let connections = [];  // Массив для хранения динамических связей между узлами
let iterationCount = 0;  // Счётчик итераций для динамического изменения
let timeSinceLastUpdate = 0;  // Время с последнего обновления
const updateInterval = 150;    // Увеличен интервал между обновлениями (в миллисекундах)
let frameCounter = 0;  // Счётчик кадров для уменьшения частоты обновлений
let connectionUpdateCounter = 0;  // Счётчик для обновления связей

// Функция для генерации динамических значений
function getNextValues(input) {
    const nodeValues = [];
    for (let i = 0; i < numNodes; i++) {
        const modifiedInput = input + iterationCount + i;  // Уникальный вход для каждого узла
        const result = QuantumNeuroChaos.process(modifiedInput);  // Получаем результат из библиотеки
        nodeValues.push(result);  // Добавляем результат в массив
    }
    return nodeValues;
}

// Функция для плавного изменения радиуса
function smoothRadius(node) {
    const targetRadius = Math.max(5, Math.abs(node.value % 10) + Math.random() * 15); // Целевой радиус
    const radiusSpeed = 0.25;  // Скорость изменения радиуса

    // Плавно изменяем радиус
    node.radius += (targetRadius - node.radius) * radiusSpeed;
}

// Анимация
function animate(time) {
    frameCounter++;
    if (frameCounter % 2 === 0) {  // Обновляем каждый второй кадр
        const deltaTime = time - timeSinceLastUpdate;
        if (deltaTime > updateInterval) {
            drawBackground();
            const newValues = getNextValues(inputString);
            drawNeurons3D(newValues);  // Рисуем нейроны в 3D
            updateConnections3D();  // Обновляем связи в 3D
            drawConnections();  // Рисуем связи
            iterationCount++;
            timeSinceLastUpdate = time;
        }
    }
    requestAnimationFrame(animate);
}

// Рисуем динамический фон
function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "rgba(26, 35, 126, 0.7)");
    gradient.addColorStop(0.25, "rgba(13, 71, 161, 0.7)");
    gradient.addColorStop(0.5, "rgba(21, 101, 192, 0.7)");
    gradient.addColorStop(0.75, "rgba(0, 121, 107, 0.7)");
    gradient.addColorStop(1, "rgba(26, 35, 126, 0.7)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Функция для корректировки позиций с добавлением Z-координаты
function checkAndCorrectPosition3D(node) {
    if (node.x <= 0 || node.x >= canvas.width) {
        node.velocityX = -node.velocityX * 0.9;
        node.x = Math.max(0, Math.min(node.x, canvas.width));
    }
    if (node.y <= 0 || node.y >= canvas.height) {
        node.velocityY = -node.velocityY * 0.9;
        node.y = Math.max(0, Math.min(node.y, canvas.height));
    }
    if (node.z <= -canvas.width / 2 || node.z >= canvas.width / 2) {
        node.velocityZ = -node.velocityZ * 0.9;
        node.z = Math.max(-canvas.width / 2, Math.min(node.z, canvas.width / 2));
    }
}

// Обновление позиции узлов с учетом Z-координаты
function updateNodePosition3D(node) {
    node.x += node.velocityX + node.vibrateX;
    node.y += node.velocityY + node.vibrateY;
    node.z += node.velocityZ;

    // Радиус зависит от Z (глубины)
    node.size = Math.max(5, 15 - node.z / 20); // Уменьшение радиуса в зависимости от глубины
    checkAndCorrectPosition3D(node);
}

// Рисуем нейроны в 3D
function drawNeurons3D(values) {
    if (nodes.length === 0) {
        nodes = values.map((value, index) => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            z: Math.random() * canvas.width / 2,  // Начальная глубина
            velocityX: (Math.random() - 0.5) * 2,
            velocityY: (Math.random() - 0.5) * 2,
            velocityZ: (Math.random() - 0.5) * 1, // Скорость по оси Z
            value,
            vibrateX: (Math.random() * 2 - 1) * 2,  // Хаотичные вибрации по X
            vibrateY: (Math.random() * 2 - 1) * 2,  // Хаотичные вибрации по Y
            colorShift: Math.random() * 255,
            colorFactor: Math.random() * 255,
            radius: Math.random() * 10 + 5,  // Начальный радиус
            teleportChance: Math.random() * 0.01, // Вероятность телепортации
        }));
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    nodes.forEach((node, index) => {
        // Смешивание цветов с частотой, чтобы не слишком часто изменять
        if (Math.random() < 0.1) {  // Меняем цвета с 10% вероятностью
            const pairIndex = Math.floor(Math.random() * nodes.length);
            if (pairIndex !== index) {
                const pairNode = nodes[pairIndex];
                const colorMix = Math.random();
                node.colorShift = node.colorShift * colorMix + pairNode.colorShift * (1 - colorMix);
            }
        }

        // Плавное изменение радиуса
        smoothRadius(node);

        // Вибрации (хаотичные колебания)
        if (Math.random() < 0.1) {  // Генерируем вибрации только с 10% вероятностью
            node.vibrateX += (Math.random() - 0.5) * 0.5;
            node.vibrateY += (Math.random() - 0.5) * 0.5;
        }

        updateNodePosition3D(node);  // Обновляем позицию с учетом Z

        // Телепортация
        if (Math.random() < node.teleportChance) {
            node.x = Math.random() * canvas.width;
            node.y = Math.random() * canvas.height;
            node.z = Math.random() * canvas.width / 2;
        }

        // Радиус зависит от значения и случайных флуктуаций
        const radius = node.radius;

        // Цвет круга с изменениями
        const alpha = 0.6 + (Math.abs(node.value) % 100) / 200;
        const color = `rgba(${(Math.abs(node.value + node.colorShift) % 150 + 50)}, 
                            ${(Math.abs(node.value * 2 + node.colorShift) % 150 + 50)}, 
                            ${(Math.abs(node.value * 3 + node.colorShift) % 150 + 50)}, 
                            ${alpha})`;

        // Применяем размытие
        ctx.shadowBlur = 30; // Увеличиваем размытие
        ctx.shadowColor = color;

        // Применяем перспективу по Z
        const scaleFactor = (1 - node.z / canvas.width);
        const drawX = node.x * scaleFactor;
        const drawY = node.y * scaleFactor;

        // Эффект рваных краев
        for (let i = 0; i < 10; i++) {  // Уменьшаем количество частиц
            const offsetX = (Math.random() - 0.5) * 10;
            const offsetY = (Math.random() - 0.5) * 10;

            // Рисуем частицы с рваными краями
            ctx.beginPath();
            ctx.arc(drawX + offsetX, drawY + offsetY, radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        }
    });
}

// Обновление связей
function updateConnections3D() {
    // Логика для обновления связей между нейронами
    connections = []; // Для упрощения этого примера мы очищаем список связей
}

// Рисуем связи
function drawConnections() {
    connectionUpdateCounter++;
    if (connectionUpdateCounter % 3 === 0) {  // Обновляем связи раз в 3 кадра
        connections.forEach(connection => {
            const { node1, node2 } = connection;
            const gradient = ctx.createLinearGradient(node1.x, node1.y, node2.x, node2.y);
            gradient.addColorStop(0, "rgba(255, 255, 255, 0.3)");
            gradient.addColorStop(1, "rgba(0, 0, 0, 0.1)");

            ctx.beginPath();
            ctx.moveTo(node1.x, node1.y);
            ctx.lineTo(node2.x, node2.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }
}

// Начинаем анимацию
requestAnimationFrame(animate);
