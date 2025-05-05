<?php
// Включаем отладку для разработки
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Конфигурация Telegram бота
$botToken = "7869221801:AAGG2HXp7s6AtKkWmxTkLrQ6Ys95h-ziqjU"; // Токен бота
$chatId = "87625346"; // ID чата для личного сообщения (без префикса)

// Заголовки для предотвращения кэширования
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// Создаем файл для лога
$logFile = 'telegram_log.txt';
// Лог вызова скрипта
file_put_contents($logFile, date('[Y-m-d H:i:s] ') . "Скрипт вызван. Метод: " . $_SERVER['REQUEST_METHOD'] . "\n", FILE_APPEND);
// Логируем POST-данные
file_put_contents($logFile, date('[Y-m-d H:i:s] ') . "POST данные: " . print_r($_POST, true) . "\n", FILE_APPEND);

// Проверяем метод запроса, но для отладки разрешаем и GET
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    file_put_contents($logFile, date('[Y-m-d H:i:s] ') . "Неверный метод: " . $_SERVER['REQUEST_METHOD'] . "\n", FILE_APPEND);
    http_response_code(405);
    echo "Метод не поддерживается. Используйте POST-запрос.";
    exit;
}

// Получаем данные из POST-запроса
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';

// Временно отключаем проверку полей для отладки
/*
if (empty($name) || empty($phone) || empty($email)) {
    file_put_contents($logFile, date('[Y-m-d H:i:s] ') . "Отсутствуют обязательные поля. name: {$name}, phone: {$phone}, email: {$email}\n", FILE_APPEND);
    http_response_code(400);
    echo "Пожалуйста, заполните все обязательные поля.";
    exit;
}
*/

// Защита от XSS-атак
$name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$phone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
$email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');

// Формируем сообщение для Telegram
$message = "📋 *Новая заявка с сайта*\n\n";
$message .= "👤 *Имя*: {$name}\n";
$message .= "📱 *Телефон*: {$phone}\n";
$message .= "📧 *Email*: {$email}\n\n";
$message .= "📝 *Ответы на вопросы*:\n\n";

// Получаем количество вопросов
$questionCount = isset($_POST['question_count']) ? intval($_POST['question_count']) : 0;
file_put_contents($logFile, date('[Y-m-d H:i:s] ') . "Количество вопросов: {$questionCount}\n", FILE_APPEND);

// Добавляем вопросы и ответы в сообщение
for ($i = 0; $i < $questionCount; $i++) {
    $questionKey = "question_{$i}";
    $answerKey = "answer_{$i}";
    
    $question = isset($_POST[$questionKey]) ? trim($_POST[$questionKey]) : '';
    $answer = isset($_POST[$answerKey]) ? trim($_POST[$answerKey]) : '';
    
    file_put_contents($logFile, date('[Y-m-d H:i:s] ') . "Проверка пары вопрос-ответ {$i}: {$questionKey}={$question}, {$answerKey}={$answer}\n", FILE_APPEND);
    
    if (!empty($question) && !empty($answer)) {
        $message .= "❓ *Вопрос*: " . htmlspecialchars($question, ENT_QUOTES, 'UTF-8') . "\n";
        $message .= "✅ *Ответ*: " . htmlspecialchars($answer, ENT_QUOTES, 'UTF-8') . "\n\n";
    }
}

// Лог для отладки сформированного сообщения
file_put_contents($logFile, date('[Y-m-d H:i:s] ') . "Сформировано сообщение: " . $message . "\n", FILE_APPEND);

// URL для API Telegram
$url = "https://api.telegram.org/bot{$botToken}/sendMessage";

// Сначала проверим бота - убедимся что он существует
$checkBotUrl = "https://api.telegram.org/bot{$botToken}/getMe";
file_put_contents($logFile, date('[Y-m-d H:i:s] ') . "Проверка бота: " . $checkBotUrl . "\n", FILE_APPEND);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $checkBotUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
$botResponse = curl_exec($ch);
$botHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

file_put_contents($logFile, date('[Y-m-d H:i:s] ') . "Ответ от API при проверке бота: HTTP код {$botHttpCode}, Содержимое: {$botResponse}\n", FILE_APPEND);

$botInfo = json_decode($botResponse, true);
if (!isset($botInfo['ok']) || $botInfo['ok'] !== true) {
    file_put_contents($logFile, date('[Y-m-d H:i:s] ') . "Ошибка при проверке бота: " . $botResponse . "\n", FILE_APPEND);
    http_response_code(500);
    echo "Ошибка: Бот недоступен или токен неверный";
    exit;
}

// Проверим последние обновления бота, чтобы убедиться, что пользователь начал диалог
$updatesUrl = "https://api.telegram.org/bot{$botToken}/getUpdates";
file_put_contents($logFile, date('[Y-m-d H:i:s] ') . "Проверка обновлений бота: " . $updatesUrl . "\n", FILE_APPEND);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $updatesUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
$updatesResponse = curl_exec($ch);
$updatesHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

file_put_contents($logFile, date('[Y-m-d H:i:s] ') . "Ответ от API при проверке обновлений: HTTP код {$updatesHttpCode}, Содержимое: {$updatesResponse}\n", FILE_APPEND);

// Попробуем разные форматы ID чата
$chatIds = [
    $chatId,                  // Как есть
    "-" . $chatId,            // С минусом
    "-100" . $chatId,         // С -100 префиксом
];

$success = false;
foreach ($chatIds as $tryId) {
    file_put_contents($logFile, date('[Y-m-d H:i:s] ') . "Попытка отправки с ID чата: {$tryId}\n", FILE_APPEND);
    
    // Параметры запроса
    $params = [
        'chat_id' => $tryId,
        'text' => $message,
        'parse_mode' => 'Markdown'
    ];
    
    // Дополнительный лог параметров
    file_put_contents($logFile, date('[Y-m-d H:i:s] ') . "Параметры запроса: " . print_r($params, true) . "\n", FILE_APPEND);
    
    // Инициализируем cURL сессию
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    
    // Выполняем запрос
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    file_put_contents($logFile, date('[Y-m-d H:i:s] ') . "Ответ API: HTTP код {$httpCode}, Содержимое: {$response}\n", FILE_APPEND);
    
    curl_close($ch);
    
    // Проверяем ответ от Telegram API
    $result = json_decode($response, true);
    
    if (isset($result['ok']) && $result['ok'] === true) {
        file_put_contents($logFile, date('[Y-m-d H:i:s] ') . "Сообщение успешно отправлено с ID: {$tryId}\n", FILE_APPEND);
        $success = true;
        break;
    }
}

if (!$success) {
    file_put_contents($logFile, date('[Y-m-d H:i:s] ') . "Все попытки отправки сообщения не удались\n", FILE_APPEND);
    file_put_contents($logFile, date('[Y-m-d H:i:s] ') . "ВАЖНО: Убедитесь, что пользователь начал диалог с ботом, отправив /start\n", FILE_APPEND);
    
    http_response_code(400);
    echo "Ошибка при отправке сообщения. Убедитесь, что бот был запущен пользователем (/start).";
    exit;
}

// Лог успешной отправки
file_put_contents($logFile, date('[Y-m-d H:i:s] ') . "Сообщение успешно отправлено\n", FILE_APPEND);

// Возвращаем успешный ответ
echo "Сообщение успешно отправлено!";
?> 