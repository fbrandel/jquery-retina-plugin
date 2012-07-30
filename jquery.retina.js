/*
 * jQuery plugin to replace image sources with high res images
 * Author: Florian Brandel
 * 
 * Usage: $("img").retina();
 * 
 * TODO: Set image dimension if not already set as attribute
 */

;(function($, window, undefined) {

    var pluginName = 'retina';

    var defaults = {
        suffix: "@2x",
        doRemoteCheck: true
    };

    function Plugin(element, options) {
        this.el = element;
        this.$el = $(this.el);
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }
    
    Plugin.prototype.init = function() {
        var self = this;
        var src = this.$el.attr("src");
        var retinaSrc = src.replace(/(.+)(\.\w{3,4})$/, "$1" + this.options.suffix + "$2");

        if (this.options.doRemoteCheck) {
            $.ajax({
                url: retinaSrc,
                type: "HEAD",
                success: function() {
                    self.$el.attr("src", retinaSrc);
                }
            });
        } else {
            this.$el.attr("src", retinaSrc);
        }
    };

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            
            if ($(this).is("img") == false) {
                return;
            }
            
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };

}(jQuery, window));