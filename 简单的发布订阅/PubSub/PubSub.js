var PubSub = {
	eventCollection: [],

	//订阅
	subscribe: function(option) {
		for(var i = 0, len = this.eventCollection.length; i < len; i++) {
			var eventItem = this.eventCollection[i];
            if(eventItem.eventName === option.eventName) { return; }
        };
        this.eventCollection.push(option);
	},

	//发布
	deliver: function(eventName) {
		for(var i = 0, len = this.eventCollection.length; i < len; i++) {
			var eventItem = this.eventCollection[i];
            if(eventName === eventItem.eventName) {
                eventItem.callback(arguments);
            }
        };
	}
};