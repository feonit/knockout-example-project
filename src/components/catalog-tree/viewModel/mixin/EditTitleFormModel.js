/**
 * Created by Feonit on 13.07.15.
 */

define(['_', 'knockout'], function(
    _, ko){

    "use strict";

    /**
     * @class EditTitleFormModel
     * @constructs EditTitleFormModel
     * @param {Object} options — Optional Object with extra parameters (see below)
     * */
    function EditTitleFormModel(options){
        /**
         * @public
         * @param {Function}
         * @return {Boolean}
         * */
        this.renamed = ko.observable(false);
        /**
         * @public
         * @param {Function}
         * @return {Boolean}
         * */
        this.isEditing = ko.observable(false);
        /**
         * @public
         * @param {Function}
         * @return {String}
         * */
        this.newTitle = ko.observable('');
    }

        /** @lends EditTitleFormModel.prototype */
    EditTitleFormModel.prototype = {
        constructor: EditTitleFormModel,
        /**
         * Редактировать название
         * @public
         * */
        onClickEditTitle: function (model, event) {
            event.stopPropagation();
            this.isEditing(true);
        },
        /**
         * Отменить редактирование имени
         * @public
         * */
        onClickResetTitle: function (model, event) {
            event.stopPropagation();
            this._resetForm();
        },
        /**
         * Сохранить новое имя
         * @public
         * */
        onClickSaveTitle: function (model, event) {
            event.stopPropagation();
            this._confirmForm();
        },
        /**
         * Обработчик клавиши Enter
         * @public
         * */
        onEnterKeyDown: function (model, event) {
            event.stopPropagation();
            this._confirmForm();
        },
        /**
         * Обработчик клавиши Esc
         * @public
         * */
        onEscKey: function (model, event) {
            event.stopPropagation();
            this._resetForm();
        },
        /**
         * @private
         * */
        _confirmForm: function () {
            this._saveTitle();
            this._resetForm();
        },
        /**
         * @private
         * */
        _saveTitle: function () {
            var newTitle = this.newTitle();

            if (newTitle !== '') {
                this.title(newTitle);
            }
        },
        /**
         * @private
         * */
        _resetForm: function () {
            this.newTitle('');
            this.isEditing(false);
        }
    };

    return EditTitleFormModel;
});