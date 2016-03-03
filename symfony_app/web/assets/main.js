/**
 * Created by KMax on 29.01.2016.
 */
$(function() {
    var chatHolder = $(".chat-holder");

    if ($('.chat-screen > li').length > 7) {
        chatHolder[0].scrollTop = chatHolder[0].scrollHeight;
    }

    var socket = io.connect('http://symfony.local:3000');

    $("#messageForm").submit(function () {
        event.preventDefault();

        var msgInput = $("#messageInput"),
            userName = $("#nameInput").data('user'),
            message = msgInput.val();

        message = filterXSS(message);

        msgInput.val('');

        socket.emit('message',
            {
                name: userName,
                message: message,
                time: moment().format('YY-MM-DD HH:mm:ss')
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
                time: moment().format('YY-MM-DD HH:mm:ss')
            },
            success: function (data) {
                console.log('Data saved successfully', data);
            }
        });

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
            + '</li>').hide().fadeIn(800);
        chatScreen.append(newMsgContent);
        chatHolder[0].scrollTop = chatHolder[0].scrollHeight;
    });
});