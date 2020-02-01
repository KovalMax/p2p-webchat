'use strict';
(($) => {
    $(() => {
        const messenger = window.messenger;
        const socket = io.connect(messenger.socketDsn);
        const windowDom = $(window);
        const messagesContainer = $('#messages-container');
        const messageInput = $('#messageInput');
        const messengerForm = $('#messageForm');

        if ($('#messages-container > li').length > 7) {
            messagesContainer[0].scrollTop = messagesContainer[0].scrollHeight;
        }

        socket.emit(messenger.events.userConnected, {id: messenger.user.id, username: messenger.user.name});

        windowDom.on('keydown', (event) => {
            if (event.which === 13 && event.ctrlKey) {
                sendMessage(messagesContainer, messageInput, messenger, socket);
            }
        });

        messengerForm.on('submit', (event) => {
            event.preventDefault();
            sendMessage(messagesContainer, messageInput, messenger, socket);
        });

        socket.on(messenger.events.message, (message) => {
            appendMessage(messagesContainer, message);
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
            message = {username: messenger.user.name, message: message, datetime: new Date().toISOString()};
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
        let msg = $('<li class="list-group-item"><p>@' + message.username + '</p><p>' + message.datetime + '</p>><p>' + message.message + '</p></li>');

        container.append(msg.hide().fadeIn(600));
        container[0].scrollTop = container[0].scrollHeight;
    }

    function saveMessage(data) {
        $.ajax({
            url: messenger.routes.saveMessage,
            type: 'POST',
            data: {
                message: data.message,
                datetime: data.datetime,
            },
            success: (res) => {
                if (parseInt(res.status, 10) > 200) {
                    console.error('Error saving data with code %s: %s', res.status, res.details);
                } else {
                    console.log('Data saved successfully ', res.status);
                }
            }
        });
    }
})(jQuery);

