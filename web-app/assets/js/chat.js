'use strict';
(($) => {
    const socket = io.connect('localhost:3001');
    const messengerForm = $('#messageForm');
    messengerForm.on('submit', (e) => {
        e.preventDefault();
    });
})(jQuery);

