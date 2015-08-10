/**
 * @author Feonit feonitu@yandex.ru
 */
define(['knockout', 'knockout.mapping'], function(ko){

    /**
     * @class Предоставляет общие методы для всех моделей данных
     * @constructs Model
     * @param {Object} attributes - Хеш, содержащий состояние модели
     * @return {Model}
     * */
    function Model(attributes){
        this.setAttributes(attributes);
    }

    Model.prototype = {
        constructor: Model,
        /**
         * Способ передачи начальных значений атрибутов
         * @public
         * @param {Object} attributes - The attributes for an instance
         * */
        setAttributes: function(attributes){
            ko.mapping.fromJS(attributes, {}, this);
        },
        /**
         * Обновляет состояние модели данными с сервера
         * @abstract
         * @return {boolean}
         * */
        fetch : function(){
            throw new Error('must be implemented by subclass!');
        },
        /**
         * Парсит сырой ответ с сервера
         * @abstract
         * @return {boolean}
         * */
        parse : function(){
            throw new Error('must be implemented by subclass!');
        }
    };
    return Model;
});