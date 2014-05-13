/**
 * Angular Module defining a global messages bus.
 *
 */
var messageBusModule = angular.module('messageBusModule', []);

// Constants

/**
 * Constants service used in the whole module.
 */
messageBusModule.constant('messagesBusConstants', {
    apiVersion: '1.0.0'
});

// Services

/**
 * Main service where happens all the magic!
 */
messageBusModule.factory('messagesBusService', ['$rootScope', '$log', 'messagesBusConstants', function ($rootScope, $log, messagesBusConstants) {

    /* Registry containing all events subscribers. */
    /*
     *  [
     *      {
     *          eventName: 'tick-event',
     *          subscribers: [
     *              { name: 'subscriber1', handler: function(){ // job goes here! } },
     *              { name: 'subscriber2', handler: function(){ // job goes here! } },
     *          ]
     *      },
     *      {
     *          eventName: 'dummy-event',
     *          subscribers: []
     *      }
     *  ]
     */
    var registry = [];

    return {
        /**
         * Return the current API version.
         */
        apiVersion: function () {
            $log.debug('IN messagesBusService.apiVersion.');
            return messagesBusConstants.apiVersion;
        },

        /**
         * Return the events subscribers registry.
         */
        registry: function () {
            $log.debug('IN messagesBusService.registry.');
            return registry;
        },

        /**
         * Register a subscriber to the given eventName.
         * If a subscriber with the same name is already registered, it will not be replaced.
         * @param eventName the event name the subscriber will be listening to
         * @param subscriber the subscriber
         */
        register: function (eventName, subscriber) {
            $log.debug('IN messagesBusService.register.');

            // Get the event with the given event name or create it if it does not exist
            var event = this.getEvent(eventName, true);

            // Attach a subscriber to this event if it does not already exist
            if (!this.getSubscriber(event, subscriber.name)) {
                event.subscribers.push(subscriber);
            } else {
                $log.debug('Subscriber: ' + subscriber.name + ' is already registered on event: ' + eventName);

            }
            $log.debug('Registry content is: ' + angular.toJson(registry));
        },

        /**
         * Remove a subscriber from the given eventName listeners.
         * @param eventName the event name the subscriber to remove is currently listening to.
         * @param subscriberName the name of the subscriber to be removed
         */
        unregister: function (eventName, subscriberName) {
            $log.debug('IN messagesBusService.unregister.');

            // Get the event with the given event name or null if it does not exist
            var event = this.getEvent(eventName, false);

            // If the event was found, try to remove the given subscriber
            if (event) {
                // The subscriber needs to exist in order to be removed
                var subscriber = this.getSubscriber(event, subscriberName);
                if (!subscriber) {
                    $log.debug('Subscriber: ' + subscriberName + ' is not registered on event: ' + eventName);
                } else {
                    event.subscribers = event.subscribers.filter(function (item) {
                        return item.name != subscriberName;
                    });
                }
            }
            $log.debug('Registry content is: ' + angular.toJson(registry));
        },

        /**
         * Publish a new message to the bus.
         * A call to this function will invoked all event subscribers by calling their handle function.
         * @param eventName the event name to dispatch
         * @param eventData the data the event comes with
         */
        publish: function (eventName, eventData) {
            $log.debug('IN messagesBusService.publish.');

            // Get the event with the given event name or null if it does not exist
            var event = this.getEvent(eventName, false);

            // If the event exists, call each of its subscribers
            if (event) {
                event.subscribers.forEach(function (item) {
                    $log.debug('Invoking subscriber: ' + item.name);
                    if (item.handler) {
                        item.handler(eventData);
                    }
                });
            }
            $log.debug('Registry content is: ' + angular.toJson(registry));
        },

        /**
         * Return the event with the given name from the registry.
         * If the event does not exist, it will be created if the createIfNotExist is set to true.
         * @param eventName the name of the event to find
         * @param createIfNotExist if set to true, the event will be created in the registry if not found
         * @returns {*}
         */
        getEvent: function (eventName, createIfNotExist) {
            $log.debug('IN messagesBusService.getEvent.');

            // Get the subscribers matching the given event name
            var events = $.grep(registry, function (item) {
                return item.eventName == eventName;
            });

            // If the event does not exist, create it if createIfNotExist is set to true
            var event = events ? events[0] : null;
            if (!event && createIfNotExist) {
                event = {eventName: eventName, subscribers: []};
                registry.push(event);
            }

            // Return the event
            return event;
        },

        /**
         * Return the subscriber with the given name from the event subscribers list or null if it does not exist.
         * @param event the event the subscriber is intended to be listening to
         * @param subscriberName the subscriber name to found
         * @returns {*}
         */
        getSubscriber: function (event, subscriberName) {
            $log.debug('IN messagesBusService.getSubscriber.');

            // Get the subscribers matching the given subscriber name
            var subscribers = $.grep(event.subscribers, function (item) {
                return item.name == subscriberName;
            });

            // Return the subscriber
            return subscribers ? subscribers[0] : null;
        }
    };
}]);