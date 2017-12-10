var CustomedEvent = {
    event: {},
    addCustomEvent: function (options) {
        //options: name、data、callback
        document.addEventListener(options.name, function (e) {
            options.callback(e);
        });
        
        if (window.CustomEvent) {
            this.event[options.name] = new CustomEvent(options.name, {
                detail: options.data
            });
        } else {
            this.event[options.name] = document.createEvent('CustomEvent');
            this.event[options.name].initCustomEvent(options.name, true, true, options.data);
        }
    },

    trigger: function (name) {
        if (this.event[name]) {
            document.dispatchEvent(this.event[name]);
        }
    }
};