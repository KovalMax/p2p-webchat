/**
 * Created by KMax on 29.01.2016.
 */
$(function() {
    var chatHolder = $(".chat-holder");
    var TYPING_TIMER_LENGTH = 400; // ms
    var COLORS = [
        '#e21400', '#91580f', '#f8a700', '#f78b00',
        '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
        '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ];
    if ($('.chat-screen > li').length > 7) {
        chatHolder[0].scrollTop = chatHolder[0].scrollHeight;
    }

    var socket = io.connect('http://symfony.local:3000');

    function getUsernameColor (username) {
        var hash = 7;

        for (var i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + (hash << 5) - hash;
        }

        var index = Math.abs(hash % COLORS.length);

        return COLORS[index];
    }

    $("#messageForm").submit(function () {
        event.preventDefault();

        var msgInput = $("#messageInput"),
            userName = $("#nameInput").data('user'),
            message = msgInput.val();

        message = filterXSS(message);

        msgInput.val('');

        if (message) {
            socket.emit('message',
                {
                    name: userName,
                    message: message,
                    time: moment().format('YYYY-MM-DD HH:mm:ss')
                }
            );
            // Ajax call for saving data
            //pathname for dev version delete in production
            var path = document.location.pathname;
            $.ajax({
                url: path + 'save_msg',
                type: 'POST',
                data: {
                    name: userName,
                    message: message,
                    time: moment().format('YYYY-MM-DD HH:mm:ss'),
                    color: getUsernameColor(userName)
                },
                success: function (data) {
                    console.log('Data saved successfully', data);
                }
            });
        }
        return true;
    });

    socket.on('message', function (data) {
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
        chatHolder[0].scrollTop = chatHolder[0].scrollHeight;
    });
});