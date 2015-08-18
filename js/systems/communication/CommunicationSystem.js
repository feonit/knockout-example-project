define(['knockout'], function(ko){

    var XHR = window.XMLHttpRequest;

    function CommunicationSystem(){
        /** ожидание : начальное состояние, не выполнено и не отклонено. */
        this.isPending = ko.observable(false);
        /** выполнено : операция завершена успешно. */
        this.isFulfilled = ko.observable(false);
        /** отклонено : операция завершена с ошибкой. */
        this.isRejected = ko.observable(false);
    }

    CommunicationSystem.prototype = {

        constructor: CommunicationSystem,

        /**
         * @param {object} options
         * @return {XMLHttpRequest}
         * */
        request: function(options){

            CommunicationSystem.prototype._makeRequest.call(this, options.method, options.url);

            throw new Error('must be implemented by subclass!');
        },

        _makeRequest: function(){
            var xhr = new XHR();

            xhr.open('GET', 'phones.json', false);

            xhr.send();

            if (xhr.status != 200) {
                // обработать ошибку
                alert( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
            } else {
                // вывести результат
                alert( xhr.responseText ); // responseText -- текст ответа.
            }

            return xhr;
        }
    };

    return CommunicationSystem;
});