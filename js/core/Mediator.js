define([], /** @lends Mediator */ function(){
    // https://carldanley.com/js-mediator-pattern/
    // + added support for context
    // + added remove all handlers at _topics

    return ( function ( window, undefined ) {

        /**
         * Mediator class
         * This is the interface class for user related modules
         * @class Mediator
         * @constructs Mediator
         * @return {Mediator}
         */
        function Mediator() {
            this._topics = {};
        }

        /**
         * subscribe
         * @function
         * @public
         * */
        Mediator.prototype.subscribe = function mediatorSubscribe( topic, callback, context ) {
            if( ! this._topics.hasOwnProperty( topic ) ) {
                this._topics[ topic ] = [];
            }

            this._topics[ topic ].push( { callback: callback, context: context } );
            return true;
        };
        /**
         * unsubscribe
         * @function
         * @public
         * */
        Mediator.prototype.unsubscribe = function mediatorUnsubscrive( topic, callback ) {
            if( ! this._topics.hasOwnProperty( topic ) ) {
                return false;
            }

            if ( ! callback ){
                this._topics[ topic ] = [];
                return true;
            }

            for( var i = 0, len = this._topics[ topic ].length; i < len; i++ ) {
                if( this._topics[ topic ][ i ].callback === callback ) {
                    this._topics[ topic ].splice( i, 1 );
                    return true;
                }
            }

            return false;
        };
        /**
         * publish
         * @function
         * @public
         * */
        Mediator.prototype.publish = function mediatorPublish() {
            var args = Array.prototype.slice.call( arguments );
            var topic = args.shift();

            if( ! this._topics.hasOwnProperty( topic ) ) {
                return false;
            }

            for( var i = 0, len = this._topics[ topic ].length; i < len; i++ ) {
                this._topics[ topic ][ i ].callback.apply( this._topics[ topic ][ i ].context, args );
            }
            return true;
        };

        return Mediator;

    } )( window );
});