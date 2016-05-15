/**
 * Created by KMax on 29.01.2016.
 */
$(function() {
    var $window = $(window),
        $chatHolder = $(".chat-holder"),
        $nameInput = $("#nameInput"),
        $usersScreen = $(".chat-users"),
        $messageInput = $("#messageInput"),
        $userName = $nameInput.data('user'),
        $userId = $nameInput.data('uid'),
        TYPING_TIMER_LENGTH = 2000,
        typing = false,
        COLORS = [
            '#e21400', '#91580f', '#f8a700', '#f78b00',
            '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
            '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
        ];

    function getUsernameColor(username) {
        var hash = 7;

        for (var i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + (hash << 5) - hash;
        }

        var index = Math.abs(hash % COLORS.length);

        return COLORS[index];
    }

    function updateTyping() {
        if (!typing) {
            typing = true;
            socket.emit('typing', {id: $userId});
        }

        var lastTypingTime = (new Date()).getTime();

        setTimeout(function () {
            var typingTimer = (new Date()).getTime();
            var timeDiff = typingTimer - lastTypingTime;
            if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
                socket.emit('stopTyping', {id: $userId});
                typing = false;
            }
        }, TYPING_TIMER_LENGTH);
    }

    function sendMessage() {
        var message = $messageInput.val();
        message = filterXSS(message);
        message = message.trim();
        $messageInput.val('');
        socket.emit('stopTyping', {id: $userId});
        if (message) {
            socket.emit('message',
                {
                    name: $userName,
                    message: message,
                    time: moment().format('DD-MM-YYYY HH:mm:ss'),
                    userId: $userId
                }
            );
            // Ajax call for saving data
            //pathname for dev version delete in production
            var path = document.location.pathname;
            $.ajax({
                url: path + 'save_msg',
                type: 'POST',
                data: {
                    name: $userName,
                    message: message,
                    time: moment().format('DD-MM-YYYY HH:mm:ss'),
                    color: getUsernameColor($userName),
                    userId: $userId
                },
                success: function(data) {
                    if (!data.status) {
                        console.error('Error: ', data.error);
                    } else {
                        console.log('Data saved successfully ', data);
                    }
                }
            });
        }
    }

    if ($('.chat-screen > li').length > 7) {
        $chatHolder[0].scrollTop = $chatHolder[0].scrollHeight;
    }

    var socket = io.connect('http://symfony.local:3000');

    if ($userName) {
        socket.emit('userConnected', {user: $userName, id: $userId});
    }

    $("#messageForm").submit(function() {
        event.preventDefault();
        sendMessage();
        return true;
    });

    $messageInput.on('keyup focus', function() {
        updateTyping();
    });

    $window.on('keydown', function(event) {
        if (event.which === 13 && event.ctrlKey) {
            sendMessage();
        }
    });

    socket.on('message', function(data) {
        var chatScreen = $(".chat-screen");
        var newMsgContent = $('<li><strong>'
            + data.name
            + '</strong> : '
            + '<span class="time-right">'
            + data.time
            + '</span>'
            + '<br/>'
            + data.message
            + '</li>').hide().fadeIn(800)
            .css('color', getUsernameColor(data.name));

        chatScreen.append(newMsgContent);
        $chatHolder[0].scrollTop = $chatHolder[0].scrollHeight;
    });

    socket.on('userJoined', function(data) {
        for (var key in data.users) {
            if (key != $userId) {
                if (!$usersScreen.find('[data-id="' + key + '"]').length) {
                    var newUser = $('<li data-id="' + key + '">'
                        + data.users[key]
                        + '<span class="typing"></span></li>');

                    $usersScreen.append(newUser);
                }
            }
        }
        $('.count-users').text(data.usersCount);
    });

    socket.on('userLeft', function(data) {
        $usersScreen.find('[data-id="' + data.userLeft + '"]').remove();
        $('.count-users').text(data.usersCount);
    });

    socket.on('userTyping', function(data) {
        var user = $usersScreen.find('[data-id="' + data.id + '"]');
        user.children().show();
    });

    socket.on('userStopTyping', function(data) {
        var user = $usersScreen.find('[data-id="' + data.id + '"]');
        user.children().hide();
    });
});