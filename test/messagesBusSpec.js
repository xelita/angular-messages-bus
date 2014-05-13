describe("messageBusModule Tests Suite", function () {

    // messagesBusConstants

    describe("messagesBusConstants Tests", function () {

        var messagesBusConstants;

        beforeEach(function () {
            module('messageBusModule');
            inject(function (_messagesBusConstants_) {
                messagesBusConstants = _messagesBusConstants_;
            });
        });

        it("apiVersion", function () {
            expect(messagesBusConstants.apiVersion).toBe('1.0.0');
        });
    });

    // messagesBusService

    describe("messagesBusService Tests", function () {

        var messagesBusService;
        var messagesBusConstants;

        beforeEach(function () {
            module('messageBusModule');
            inject(function (_messagesBusService_, _messagesBusConstants_, _$document_, _$httpBackend_) {
                messagesBusService = _messagesBusService_;
                messagesBusConstants = _messagesBusConstants_;
            });
        });

        it("apiVersion should return apiVersion defined in messagesBusConstants", function () {
            expect(messagesBusService.apiVersion()).toBe('1.0.0');
        });

        it("registry should not be null", function () {
            expect(messagesBusService.registry()).not.toBeNull();
        });

        it("register should store subscriber only once in registry", function () {
            var eventName = 'event';
            var subscriber = {
                name: 'event-subscriber1',
                handler: function () {
                    alert('event received');
                }
            };

            messagesBusService.register(eventName, subscriber);

            // This second call should have no effect
            messagesBusService.register(eventName, subscriber);

            // Check registry length
            expect(messagesBusService.registry().length).toBe(1);

            // Check event
            var event = messagesBusService.registry()[0];
            expect(event.eventName).toBe(eventName);

            // Check subscribers
            expect(event.subscribers.length).toBe(1);
            expect(event.subscribers[0].name).toBe(subscriber.name);
            expect(event.subscribers[0].handler).toBe(subscriber.handler);
        });

        it("unregister should remove subscriber from registry if it exists", function () {
            var eventName = 'event';
            var subscriber = {
                name: 'event-subscriber1',
                handler: function () {
                    alert('event received');
                }
            };

            // Register a subscriber
            messagesBusService.register(eventName, subscriber);

            // Check registry length
            expect(messagesBusService.registry().length).toBe(1);
            var event = messagesBusService.registry()[0];

            // Remove a non existing subscriber
            messagesBusService.unregister(eventName, 'unknown');
            messagesBusService.unregister('unknown', subscriber.name);
            expect(event.subscribers.length).toBe(1);

            // Remove an existing subscriber
            messagesBusService.unregister(eventName, subscriber.name);
            expect(event.subscribers.length).toBe(0);
        });

        it("publish should notify appropriate subscribers", function () {
            var eventName1 = 'event1';
            var event1Data = 'event1 data';

            var eventName2 = 'event2';
            var event2Data = 'event2 data';

            var subscriber1 = {
                name: 'event-subscriber1',
                handler: function (data) {
                    alert('event received on subscriber1: ' + data);
                }
            };
            var subscriber2 = {
                name: 'event-subscriber2',
                handler: function (data) {
                    alert('event received on subscriber2: ' + data);
                }
            };
            var subscriber3 = {
                name: 'event-subscriber3',
                handler: function (data) {
                    alert('event received on subscriber3: ' + data);
                }
            };

            // Spies
            spyOn(subscriber1, 'handler');
            spyOn(subscriber2, 'handler');
            spyOn(subscriber3, 'handler');

            // Register subscribers
            messagesBusService.register(eventName1, subscriber1);
            messagesBusService.register(eventName1, subscriber2);
            messagesBusService.register(eventName2, subscriber3);

            // Check registry length
            expect(messagesBusService.registry().length).toBe(2);
            var event1 = messagesBusService.getEvent(eventName1);

            // Publish event for subscribers of event1
            messagesBusService.publish(eventName1, event1Data);

            // Verification
            expect(subscriber1.handler).toHaveBeenCalledWith(event1Data);
            expect(subscriber2.handler).toHaveBeenCalledWith(event1Data);
            expect(subscriber3.handler).not.toHaveBeenCalled();
        });

        it("getEvent should return event if it exists", function () {
            var event = {eventName: 'event', subscribers: []};
            messagesBusService.registry().push(event);
            expect(messagesBusService.getEvent('event')).toBe(event);
        });

        it("getEvent should return null if it does not exist and creationIfNotExist is set to false", function () {
            expect(messagesBusService.getEvent('unknown')).toBeNull();
        });

        it("getEvent should return null if it does not exist and creationIfNotExist is set to true", function () {
            var event = messagesBusService.getEvent('unknown', true);
            expect(event.eventName).toBe('unknown');
            expect(event.subscribers.length).toBe(0);
        });

        it("getSubscriber should return subscriber if it exists", function () {
            var subscriber = {name: 'subscriber'};
            var event = {eventName: 'event', subscribers: [subscriber]};
            messagesBusService.registry().push(event);
            expect(messagesBusService.getSubscriber(event, 'subscriber')).toBe(subscriber);
        });

        it("getSubscriber should return null if it does not exist", function () {
            var subscriber = {name: 'subscriber'};
            var event = {eventName: 'event', subscribers: [subscriber]};
            messagesBusService.registry().push(event);
            expect(messagesBusService.getSubscriber(event, 'unknown')).toBeNull();
        });
    });
});