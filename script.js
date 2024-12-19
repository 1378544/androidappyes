document.addEventListener('deviceready', function() {
    const scanButton = document.getElementById('scanButton');
    const status = document.getElementById('status');
    const scanResult = document.getElementById('scanResult');

    scanButton.addEventListener('click', function() {
        status.textContent = 'Ожидание сканирования...';
        scanButton.disabled = true; // Отключаем кнопку во время сканирования

        nfc.addNdefListener(
            function(nfcEvent) {
                const tag = nfcEvent.tag;
                const ndefMessage = tag.ndefMessage;

                // Преобразование NDEF-сообщения в читаемый формат
                let message = '';
                ndefMessage.forEach(record => {
                    if (record.payload) {
                        // Предполагаем, что данные закодированы в формате UTF-8
                        const text = nfc.bytesToString(record.payload).substring(3); // Пропустить первые 3 байта (T, en)
                        message += text + '\n';
                    }
                });

                scanResult.textContent = message || 'Данные не распознаны.';
                status.textContent = 'Сканирование завершено.';
                scanButton.disabled = false; // Включаем кнопку после сканирования
                nfc.removeNdefListener(); // Отключить слушатель после сканирования
            },
            function() {
                status.textContent = 'Готов к сканированию.';
            },
            function(error) {
                status.textContent = 'Ошибка при добавлении слушателя: ' + JSON.stringify(error);
                scanButton.disabled = false;
            }
        );

        // Инициируем сканирование
        nfc.scanTag();
    });
}, false);
