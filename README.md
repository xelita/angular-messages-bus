# [angular-messages-bus][![Build Status](https://travis-ci.org/xelita/angular-messages-bus.png?branch=master)](https://travis-ci.org/xelita/angular-messages-bus)

This project defines a messages bus for AngularJS applications.

## Quick start

+ Include messagesBus.js in your Cordova application.

```html
<script src="js/messagesBus.js"></script>
```

or use the minified version:

```html
<script src="js/messagesBus.min.js"></script>
```

+ Add the module `messageBusModule` as a dependency to your app module:

```javascript
var myapp = angular.module('myapp', ['messageBusModule']);
```

+ Use the messagesBusService as controller dependency and call messagesBusService API:

Several steps need to be followed to make the dream come true!

### Registering subscriber to a specific event

The first thing you need to do is to register a subscriber to a specific event.
The subscriber will be called once the event it is registered will be dispatched.

**The subscriber needs to be composed at least of:**
+ a name that identifies it uniquely
+ a handler: a function that will be called once the event will be raised. The function has a parameter that is provided during the event publishing call...

```javascript

    // Define a subscriber
    var subscriber = {
        name: 'event-subscriber',
        handler: function (data) {
            $scope.result = data;
        }
    };

    // Register the subscriber to the event named 'event'
    messagesBusService.register('event', subscriber);
};
```

### Dispatching the event

Once the subscriber has been successfully registered to the event, invoking it is a breeze!
The `messageBusService` comes with the `publish` method which allow to make the job done...

```javascript

    // Publishing event (this will cause all the event subscribers to be invoked on their handler function)
    messagesBusService.publish('event', { msg: 'Hello World!' });
};
```

The second parameter constains arbitrary data which will be transmited to each subscribers.

A quick sample:

```javascript
$scope.result = 'nothing received yet...';

$scope.testSubscription = function() {
    // Define the subscriber
    var subscriber = {
        name: 'event-subscriber',
        handler: function (data) {
            // Store the given data in scope: { msg: 'Hello World!' }
            $scope.result = data;
        }
    };

    // Register it
    messagesBusService.register('event', subscriber);
    
    // Dispatch the event ($scope.result will change)
    messagesBusService.publish('event', { msg: 'Hello World!' });
};
```

## Developers

Clone the repo, `git clone git://github.com/xelita/angular-messages-bus.git`.
The project is tested with `jasmine` running on `karma`.

>
``` bash
$ npm install
$ bower install
$ npm test
```

## Contributing

Please submit all pull requests the against master branch. If your unit test contains JavaScript patches or features, you should include relevant unit tests. Thanks!

## Copyright and license

    The MIT License (MIT)

    Copyright (c) 2014 The Enlightened Developer

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
