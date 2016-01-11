/**
 * Created by Feonit on 24.07.15.
 */
define([
    '_',
    'knockout',
    'Model'
], function(
    _,
    ko,
    Model
){

    "use strict";

    var API = {
        dropToFolder : function (folder){
            API_VirtualFileSystem.updateRequest(folder, function (){
                API_VirtualFileSystem.moveSelectedToFolder(folder);
                API_VirtualFileSystem.setIsMovedAllSelectedItemsState(true);
                API_VirtualFileSystem.unselectAll();
            });
        },
        getSelectedCount : function(){
            return API_VirtualFileSystem.getSelectedTotalItemsLength();
        },
        setAllMoivingState : function(boolean){
            API_VirtualFileSystem.setIsMovingAllSelectedItemsState(boolean);
        }
    };

   return  _.defineSubclass(Model,

       /**
        * This provides methods used for event handling.
        * @class ItemModel
        * @constructor ItemModel
        * */
       function ItemModel(){
           /**
            * Новое название
            * */
            this.newTitle = ko.observable('');
           /**
            * Переключатель режима редактирования названия
            * */
           this.isEditing = ko.observable(false);
           /**
            * Элемент в состоянии перемещения
            * */
           this.isMoving = ko.observable(false);
           /**
            * Элемент завершил перемещение
            * */
           this.isMoved = ko.observable(false);
           /**
            * Элемент выбран
            * */
           this.isSelected = ko.observable(false);
        } ,

        /** @lends ItemModel.prototype */
        {
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
            },
            /**
             * Промежуточные данные
             * */
            _storeData: {},
            /**
             * Очищаем хранилище
             * */
            _clearStore: function(){
                // точка отсчета
                this._storeData.firstX = 0;
                this._storeData.firstY = 0;

                // текущая точка
                this._storeData.currentX = 0;
                this._storeData.currentY = 0;

                // пройдено ли растояние
                this._storeData.isAllow = false;
            },
            /**
             * Режим вбрасывания файлов, при котором файлы либо скручиваются либо нет
             * @value {String} NORMAL_STUFFING | QUICK_STUFFING
             * */
            mode: ko.observable(),
            /**
             * Handler
             * @public
             * @param {Object} model
             * @param {Event} event
             * */
            ondragstart : function(model, event){
                var that = this;

                /**
                 * Отслеживает движения мыши по документу, сохраняет текущее положение, и проверяет
                 * превышен ли порог при меремещении, если превышен, вызывает обработчик после прохождения порога
                 * @param {Event} event — Событие с текущеми координатами
                 * */
                function beforePassing(event){
                    if ( !that._storeData.isAllow ){
                        var testing = getStateMovement(event);

                        // запоминаем результат
                        that._storeData.isAllow = testing.isPassed;

                        if ( testing.isPassed ){
                            afterPassing();
                        }
                    }
                }
                /**
                 * Проверяем, превышен ли порог при меремещении
                 * @param {Event} event — Событие с текущеми координатами
                 * */
                function getStateMovement(event){
                    var firstX = that._storeData.firstX,
                        firstY = that._storeData.firstY,
                        currentX = event.clientX,
                        currentY = event.clientY,
                        STEP_PX = 200,
                        shiftX,
                        shiftY,
                        passed,
                        percent;

                    if (!firstX || !firstY || !currentX || !currentY)
                        return false;

                    shiftX = Math.abs(firstX - currentX);
                    shiftY = Math.abs(firstY - currentY);
                    passed = Math.floor(Math.sqrt(shiftY*shiftY + shiftX*shiftX));
                    percent = Math.floor((passed / STEP_PX) * 100);

                    return {
                        isPassed: STEP_PX < passed,
                        percent: percent > 100 ? 100 : percent
                    }
                }
                /**
                 * После прохождения порога
                 * */
                function afterPassing(){
                    that._effectOnBodyScroll.start();
                    if(that.mode() === 'NORMAL_STUFFING'){
                        that._saveTopScrollPosition();
                    }
                }


                var count = API.getSelectedCount();

                this._clearStore();

                // ставим режим обычного переноса
                this.mode('NORMAL_STUFFING');

                if (count === 0){
                    // case: перетаскиваем всегда хотябы один элемент
                    model.isSelected(true);

                    // режим быстрого переноса
                    this.mode('QUICK_STUFFING');
                }

                API.setAllMoivingState(true);

                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData(this._MIME_TYPE, "fake data");


                this._storeData.documentHandler = beforePassing;

                this._storeData.firstX = event.clientX;
                this._storeData.firstY = event.clientY;
                this._createDragabbleElemView(event);

                document.addEventListener('dragover', this._storeData.documentHandler);

                return true;
            },
            /**
             * Handler
             * @public
             * @param {Object} model
             * @param {Event} event
             * */
            ondragend : function(model, event){
                if(this.mode() === 'QUICK_STUFFING'){
                    //model.isSelected(false);
                    model.isMoving(false);
                }

                if(this.mode() === 'NORMAL_STUFFING'){
                    API.setAllMoivingState(false);

                    var TIME_CSS = 200;

                    setTimeout(function(){
                        this._restoreTopScrollPosition();
                    }.bind(this), TIME_CSS);
                }

                // очистка данных...
                event.dataTransfer.clearData(this._MIME_TYPE);

                // выключить скролл эффект
                this._effectOnBodyScroll.stop();

                // выключить отслеживание курсора
                document.removeEventListener('dragover', this._storeData.documentHandler);
            },

            topScrollPosition: undefined,

            _saveTopScrollPosition: function(){
                var content = document.querySelector('.middle_main_content');
                this.topScrollPosition = content.scrollTop;
            },

            _restoreTopScrollPosition: function(){
                var content = document.querySelector('.middle_main_content'),
                    currentScrollTop = content.scrollTop,
                    savedScrollTop = this.topScrollPosition,
                    dirrect = currentScrollTop > savedScrollTop;

                function nextStepScrollTop(){
                    currentScrollTop += (dirrect ? -10 : 10);
                    content.scrollTop = currentScrollTop;
                }

                var id = setInterval(function(){
                    Math.abs(currentScrollTop - savedScrollTop) > 11
                        ? nextStepScrollTop()
                        : clearInterval(id);
                }, 10);
            },
            /**
             * Handler
             * @public
             * @param {Object} model
             * @param {Event} event
             * */
            ondragover : function(model, event){
                this.isTaking(true);
                // Чтобы до элемента дошло событие drop, нужно запретить передачу по цепочке события dragover
                if (event.preventDefault) event.preventDefault();
                return false;
            },
            /**
             * Handler
             * @public
             * @param {Object} model
             * @param {Event} event
             * */
            ondragenter : function(model, event){
                event.dataTransfer.dropEffect  = 'copy';
                this.isTaken(false); // для рестарта эффекта
                if (this.mayTake()){
                    this.isTaking(true);
                }
            },
            /**
             * Handler
             * @public
             * @param {Object} model
             * @param {Event} event
             * */
            ondragleave : function(model, event){
                this.isTaking(false);
            },
            /**
             * Handler
             * @public
             * @param {Object} folder
             * @param {Event} event
             * */
            ondrop : function(folder, event){
                // reset state
                this.isTaking(false);

                // if available for taking
                if (this.mayTake()) {
                    this.open({
                        callback: function(){
                            this.isTaken(true);
                            API.dropToFolder(folder);
                        }.bind(this)
                    });
                } else {
                    return false;
                }
            },
            /**
             * Создает перетаскиваемый элемент
             * */
            _createDragabbleElemView : function (event){
                var count = API.getSelectedCount();

                var imageNode = document.getElementById('js_drag_item');
                var bodyNode = document.body;

                imageNode = imageNode.cloneNode(true);
                imageNode.innerHTML = '<span>' + count + '</span>';
                imageNode.classList.remove('none');

                // Добавляем imageNode на страницу
                bodyNode.appendChild(imageNode);

                // Устанавливаем imageNode в качестве картинки для перетаскивания
                event.dataTransfer.setDragImage(imageNode, imageNode.offsetWidth, imageNode.offsetHeight);

                // Удаляем imageNode через 1 милисекунду. Если удалить срзау,
                // то вызов setDragImage произойдет до того как отрендерится imageNode
                window.setTimeout(function() {
                    imageNode.parentNode.removeChild(imageNode);
                }, 1);

                return imageNode;
            },

            _effectOnBodyScroll : (function(){

                function destroy(){
                    document.body.draggable = false;
                    document.removeEventListener('dragover', _scrolling);
                }

                function _scrolling(event){
                    var CONST_OFFSET = 5;

                    var a = document.querySelector('.middle_main_content');
                    var height = window.innerHeight;
                    var FrameTop = Math.round(height/CONST_OFFSET);

                    if (event.pageY < FrameTop){
                        a.scrollTop =  a.scrollTop - 2;
                    }

                    if (event.pageY > (CONST_OFFSET-1)*FrameTop){
                        a.scrollTop =  a.scrollTop + 2;
                    }
                }

                function bindEventHandler(){
                    document.body.draggable = true;
                    document.addEventListener('dragover', _scrolling);
                }

                return {
                    start: bindEventHandler,
                    stop: destroy
                }
            })(),

            _MIME_TYPE : 'text/plain' //https://msdn.microsoft.com/en-us/library/ms536352(v=vs.85).aspx
        }
    );
});