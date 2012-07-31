/*
 * jQuery plugin to replace image sources with high res images
 * Author: Florian Brandel
 * 
 * Usage: $("img").retina();
 * 
 * The high res image path can be set as data attribute within the img tag 
 * OR can be loaded by a naming convention using a suffix. The type which 
 * is used can be set as an option.
 * 
 * TODO: Set image dimension if not already set as img attribute
 */

;
(function($, window, undefined) {

    var pluginName = 'retina';

    var defaults = {
        type: "suffix", // suffix, attribute
        suffix: "@2x",
        attribute: "data-high-res",
        doRemoteCheck: true,
        force: false
    };

    var supportsHighResImages = !!(window.devicePixelRatio > 1.5);

    function Plugin(element, options) {
        this.el = element;
        this.$el = $(this.el);
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype.init = function() {
        var highResImageSrc = this._getHighResImageSrc();
        this._replaceImageSrc(highResImageSrc);
    };

    /**
     * Replaces the image source with the given string.
     */
    Plugin.prototype._replaceImageSrc = function(imageSrc) {
        var self = this;

        if (!imageSrc) {
            return;
        }

        if (this.options.doRemoteCheck) {
            $.ajax({
                url: imageSrc,
                type: "HEAD",
                success: function() {
                    self.$el.attr("src", imageSrc);
                }
            });
        } else {
            this.$el.attr("src", imageSrc);
        }
    };

    /**
     * Returns the high res image source of the image
     * 
     * @return String
     */
    Plugin.prototype._getHighResImageSrc = function() {
        if (this.options.type === "attribute") {
            return this.$el.attr(this.options.attribute);
        } else {
            return this.$el.attr("src").replace(/(.+)(\.\w{3,4})$/, "$1" + this.options.suffix + "$2");
        }
    };

    $.fn[pluginName] = function(options) {

        // If device does not support retina graphics stop here as long as the
        // replacement is not forced
        if (!supportsHighResImages && !(options && options.force)) {
            return this;
        }

        return this.each(function() {

            if ($(this).is("img") === false) {
                return;
            }

            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };

}(jQuery, window));