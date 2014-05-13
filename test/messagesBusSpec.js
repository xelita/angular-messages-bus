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
    });
});