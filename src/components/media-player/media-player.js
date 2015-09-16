define(['knockout', 'PlayerViewModel', '_', 'text!media-player.html'], function(ko, PlayerViewModel, _, template){

    var PlayerComponent = _.defineSubclass(PlayerViewModel, function PlayerComponent(){

        PlayerViewModel.call(this);
        this.prototype = {};
        _.mix(this.prototype, PlayerComponent.prototype);
        window.ROOT.playerViewModel(this);

        var that = this;

        API_MediaPlayer = {
            open: function(options){
                options = options || {};
                options.src = options.src || '';
                options.type = options.type || '';
                options.callback = options.callback || function(){};

                that.curSrcUrl(options.src);
                that.curSrcTypeName(options.type);
                that.openLayer(options.callback);
            },

            close: function(){
                that.curSrcUrl('');
                that.closeLayer();
            }
        }

    } , {
        dispose: function(){
            window.ROOT().playerViewModel('');
        }
    });

    return { viewModel: PlayerComponent, template: template }
});