"use strict";
(($, io, window) => {
    $(() => {
        const settings = window.messenger;
        const dom = $(window);
        const messagesContainer = $('#messages-container');
        const messageInput = $('#messageInput');

        const socket = io.connect(settings.socket.dsn);
        socket.emit(settings.events.userConnected, {id: settings.user.id, username: settings.user.name});

        const messengerForm = $('#messageForm');
        if ($('#messages-container > li').length > 7) {
            scrollBottom(messagesContainer);
        }

        socket.on(settings.events.userJoined, (data) => console.log('Users stat', data));
        socket.on(settings.events.message, (message) => appendMessage(messagesContainer, message));

        dom.on('keydown', (event) => {
            if (event.which === 13 && event.ctrlKey) {
                sendMessage(messagesContainer, messageInput, settings, socket);
            }
        });

        messengerForm.on('submit', (event) => {
            event.preventDefault();
            sendMessage(messagesContainer, messageInput, settings, socket);
        });
    });

    /**
     * @param container Element
     * @param input Element
     * @param messenger Object
     * @param socket SocketIOClient
     */
    function sendMessage(container, input, messenger, socket) {
        let message = input.val();
        input.val('');

        message = filterXSS(message).trim();
        if (message) {
            message = {username: messenger.user.name, message: message, datetime: new Date()};
            socket.emit(messenger.events.message, message);
            appendMessage(container, message);
            saveMessage(message);
        }
    }

    /**
     * @param container Element
     * @param message Object
     */
    function appendMessage(container, message) {
        let msg = $('<li>', {class: 'list-group-item message mb-1 rounded-lg border'});
        msg.append($('<p>', {text: '@'.concat(message.username, ' at ', formatDateTime(message.datetime))}));
        msg.append($('<p>', {text: message.message}));

        container.append(msg.hide().fadeIn(400));
        scrollBottom(container);
    }

    function saveMessage(data) {
        $.ajax({
            url: messenger.routes.saveMessage,
            method: 'POST',
            dataType: 'json',
            data: {
                message: data.message,
                datetime: data.datetime.toISOString(),
            },
            success: (res) => {
                if (parseInt(res.status, 10) > 200) {
                    console.error('Error saving data with code %s: %s', res.status, res.details);
                } else {
                    console.log('Data saved successfully ', res.status);
                }
            },
            error: (err) => {
                console.error('Server error. ', err);
            }
        });
    }

    function scrollBottom(element) {
        element[0].scrollTop = element[0].scrollHeight;
    }

    function formatDateTime(datetime) {
        if (!(datetime instanceof Date)) {
            datetime = new Date(datetime);
        }
        let year = datetime.getFullYear();
        let month = addLeadingZeroes(datetime.getMonth() + 1);
        let day = addLeadingZeroes(datetime.getDate());
        let hour = addLeadingZeroes(datetime.getHours());
        let minute = addLeadingZeroes(datetime.getMinutes());
        let sec = addLeadingZeroes(datetime.getSeconds());

        return `${day}/${month}/${year} ${hour}:${minute}:${sec}`;
    }

    function addLeadingZeroes(number) {
        if (number <= 9) {
            number = '0' + number;
        }

        return number;
    }
})(window.jQuery, window.io, window);

