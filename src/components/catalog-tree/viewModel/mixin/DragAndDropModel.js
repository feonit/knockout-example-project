/**
 * Created by Feonit on 13.07.15.
 */

define(['knockout'], function(ko){

    /**
     * This provides methods used for event handling. It's not meant to
     * be used directly.
     * @class DragAndDropModel
     * @constructs DragAndDropModel
     * */
    function DragAndDropModel(){

        // only for folders
        this.isTaking = ko.observable(false);
        this.isTaken = ko.observable(false);
        this.isFailed = ko.observable();

        // folders and files
        this.isMoving = ko.observable(false);
        this.isMoved = ko.observable(false);
        this.isSelected = ko.observable(false);

        this.containsInSelectedFolder = ko.observable(false);

        // если папка выбрана, она не может уже быть приемником, это поведение постоянно (задача - исключить выбранные папки и все дочерние из возможных приемников)
        this.mayTake = ko.computed(function(){
            return !this.isSelected();
        }, this);
    }

    DragAndDropModel.prototype =
    /** @lends DragAndDropModel.prototype */
    {
        constructor: DragAndDropModel,
        /**
         * Handler
         * @public
         * @param {Object} model
         * @param {Event} event
         * */
        onToggleSelectStateClick : function(model, event){
            this.isSelected(!this.isSelected());
            event.stopImmediatePropagation();
        },
        /**
         * Хранилище
         * */
        _storeData: {},
        /**
         * Режим вбрасывания файлов, при котором файлы либо скручиваются либо нет
         * @value {String} NORMAL_STUFFING | QUICK_STUFFING
         * */
        mode: '',
        /**
         * Handler
         * @public
         * @param {Object} model
         * @param {Event} event
         * */
        ondragstart : function(model, event){
            var count = API_VirtualFileSystem.getSelectedTotalItemsLength();

            this.mode = 'NORMAL_STUFFING';

            if (count === 0){
                // case: перетаскиваем всегда хотябы один элемент
                model.isSelected(true);
            }
            if (count === 0){
                this.mode = 'QUICK_STUFFING';
            }

            // todo вынести отсюда обработку ошибок

            API_VirtualFileSystem.setIsMovingAllSelectedItemsState(true);

            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData(DragAndDropModel._MIME_TYPE, "fake data");

            this._createDragabbleElemView(event);

            this._storeData.documentHandler = this._onDocumentDragover.bind(this);

            document.addEventListener('dragover', this._storeData.documentHandler);

            var that = this;

            var _handlerOnOvercomeDistance = function(){
                DragAndDropModel._effectOnBodyScroll.start();

                if(that.mode === 'NORMAL_STUFFING'){
                    setTimeout(function(){
                        API_VirtualFileSystem.isEnabledProcessTransfer(true);
                    }, 10);
                }
            };

            this._saveCoordinates(event, _handlerOnOvercomeDistance);

            return true;
        },

        ondrag: function(m, e){
            console.log(e);
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
         * @param {Object} model
         * @param {Event} event
         * */
        ondrop : function(model, event){
            // reset state
            this.isTaking(false);

            // if available for taking
            if (this.mayTake()) {
                this.isTaken(true);

                var that = this;
                this.open({
                    callback: function(){
                        that._dropData(event);
                    }
                });
            } else {
                this.isFailed(true);
                return false;
            }
        },
        /**
         * Handler
         * @public
         * @param {Object} model
         * @param {Event} event
         * */
        ondragend : function(model, event){
            if(this.mode === 'QUICK_STUFFING'){
                model.isSelected(false);
                model.isMoving(false);
            }

            if(this.mode === 'NORMAL_STUFFING'){
                API_VirtualFileSystem.setIsMovingAllSelectedItemsState(false); //1
                API_VirtualFileSystem.isEnabledProcessTransfer(false);
            }

            // очистка данных...
            event.dataTransfer.clearData(DragAndDropModel._MIME_TYPE);

            // выключить скролл эффект
            DragAndDropModel._effectOnBodyScroll.stop();

            // выключить отслеживание курсора
            document.removeEventListener('mousemove', this._storeData.documentHandler);

            // очистить хранилище
            this._clearStore();
        },
        /**
         * Запоминаем координаты и обработчик
         * */
        _saveCoordinates: function(event, handler){
            this._storeData.firstX = event.pageX;
            this._storeData.firstY = event.pageY;
            this._storeData.handler = handler;
        },
        /**
         * Проверяем, превышено ли ограничение при меремещении
         * */
        _isOvercomeDistanceBarrier: function (){
            var STEP_PX = 100,
                height = Math.abs(this._storeData.firstX - this._storeData.currentX),
                width = Math.abs(this._storeData.firstY - this._storeData.currentY),
                passed = Math.floor(Math.sqrt(height*height + width*width));

            return STEP_PX < passed;
        },
        /**
         * Очищаем хранилище
         * */
        _clearStore: function(){
            this._storeData = {};
        },
        /**
         * Отслеживает движения мыши по документу, сохраняет текущее положение, и проверяет
         * превышен ли барьер, если превышен, вызывает обработчик
         * */
        _onDocumentDragover: function(event){
            this._storeData.currentX = event.pageX;
            this._storeData.currentY = event.pageY;

            if ( !this._storeData.isAllow ){
                this._storeData.isAllow = this._isOvercomeDistanceBarrier(event);

                // only one time
                if ( this._storeData.isAllow ){
                    if ( this._storeData.handler ){
                        this._storeData.handler();
                    }
                }
            }
        },
        /**
         * Handler
         * @private
         * */
        _createDragabbleElemView : function (event){
            var count = API_VirtualFileSystem.getSelectedTotalItemsLength();

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
        /**
         * Handler
         * @private
         * */
        _dropData : function (){
            var that = this;

            function callback(){
                API_VirtualFileSystem.moveSelectedToFolder(that);
                API_VirtualFileSystem.setIsMovedAllSelectedItemsState(true);
                API_VirtualFileSystem.unselectAll();
            }

            API_VirtualFileSystem.updateRequest(this, callback);
        }
    };
    /**
     * @memberof DragAndDropModel
     * @param {String} string
     */
    DragAndDropModel._serializationData = function(numbers){
        return JSON.stringify(numbers);
    };
    /**
     * @memberof DragAndDropModel
     * @param {String} string
     */
    DragAndDropModel._deserializationData = function(string){
        return JSON.parse(string);
    };

    DragAndDropModel._effectOnBodyScroll = (function(){

        function destroy(){
            document.body.draggable = false;
            document.removeEventListener('dragover', _scrolling);
        }

        function _scrolling(event){
            var CONST_OFFSET = 5;

            var a = document.body;
            var height = window.innerHeight;
            var FrameTop = Math.round(height/CONST_OFFSET);

            if (event.pageY < FrameTop){
                a.scrollTop = ( a.scrollTop - 2);
            }

            if (event.pageY > (CONST_OFFSET-1)*FrameTop){
                a.scrollTop = ( a.scrollTop + 2);
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
    })();

    DragAndDropModel._MIME_TYPE = 'text/plain';//https://msdn.microsoft.com/en-us/library/ms536352(v=vs.85).aspx

    return DragAndDropModel;
});
