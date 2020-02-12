"use strict";
(($, io, window) => {
    $(() => {
        const dom = $(window);
        const settings = window.messenger;
        const socket = io.connect(settings.socket.dsn);
        const handler = new ChatHandler(socket, settings, dom);

        handler.run();
    });

    function ChatHandler(socket, settings, dom) {
        const scrollContainer = $('#scroller');
        const messagesContainer = $('#messageContainer');
        const messengerForm = $('#messageForm');
        const messageInput = $('#messageInput');
        const messageSubmit = $('#messageSubmit');

        return {
            registerEvents() {
                messagesContainer.on('scrollToLast', () => this.scrollToLastMessage());

                socket.on(settings.events.userJoined, (data) => console.log('Users stat', data));

                socket.on(settings.events.message, (message) => this.appendMessage(message));

                dom.on('keydown', (event) => {
                    if (event.which === 13 && event.ctrlKey) {
                        this.sendMessage();
                    }
                });

                messengerForm.on('submit', (event) => {
                    event.preventDefault();
                    this.sendMessage();
                });
            },
            run() {
                this.registerEvents();
                this.emitEvent(settings.events.userConnected, {id: settings.user.id, username: settings.user.name});
                if (messagesContainer.find('li').length > 7) {
                    this.scrollToLastMessage();
                }
            },
            sendMessage() {
                let message = messageInput.val();
                messageInput.val('');

                message = filterXSS(message).trim();
                if (message) {
                    message = {username: messenger.user.name, message: message, datetime: new Date()};
                    this.emitEvent(messenger.events.message, message);
                    this.appendMessage(message);
                    this.saveMessage(message);
                }
            },
            appendMessage(message) {
                let msg = $('<li>', {class: 'list-group-item message mb-1 rounded-lg border'});
                msg.append($('<p>', {text: '@'.concat(message.username, ' at ', this.formatDateTime(message.datetime))}));
                msg.append($('<p>', {text: message.message}));

                messagesContainer.append(msg.hide().fadeIn(400));
                messagesContainer.trigger('scrollToLast');
            },
            saveMessage(data) {
                $.ajax({
                    url: settings.routes.saveMessage,
                    method: 'POST',
                    dataType: 'json',
                    beforeSend: () => {
                        messageSubmit.html('<span class="spinner-grow spinner-grow" role="status" aria-hidden="true" />Loading...');
                        messageSubmit.attr('disabled', 'disabled');
                    },
                    complete: () => {
                        messageSubmit.html('Send');
                        messageSubmit.removeAttr('disabled');
                    },
                    data: {message: data.message, datetime: data.datetime.toISOString()},
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
            },
            emitEvent(eventName, event) {
                socket.emit(eventName, event);
            },
            scrollToLastMessage() {
                scrollContainer[0].scrollTop = scrollContainer[0].scrollHeight;
            },
            formatDateTime(datetime) {
                if (!(datetime instanceof Date)) {
                    datetime = new Date(datetime);
                }
                let year = datetime.getFullYear();
                let month = this.addLeadingZeroes(datetime.getMonth() + 1);
                let day = this.addLeadingZeroes(datetime.getDate());
                let hour = this.addLeadingZeroes(datetime.getHours());
                let minute = this.addLeadingZeroes(datetime.getMinutes());
                let sec = this.addLeadingZeroes(datetime.getSeconds());

                return `${day}/${month}/${year} ${hour}:${minute}:${sec}`;
            },
            addLeadingZeroes(number) {
                if (number <= 9) {
                    number = '0' + number;
                }

                return number;
            },
        };
    }
})(window.jQuery, window.io, window);

