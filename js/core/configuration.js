/**
 * @module configuration
 * @requires jquery @see
 * */
define(['jquery'], function(jquery) {

    // configuration jquery
    jquery.event.props.push('dataTransfer');
    jquery.event.props.push('pageX');
    jquery.event.props.push('pageY');

});