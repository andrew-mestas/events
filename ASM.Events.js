if (typeof ASM == 'undefined')
    ASM = {};
if (typeof ASM.Events == 'undefined')
    ASM.Events = {};

(function (window) {
    var _window = window;
    var events = {};
    var On = function (name, element, type, fn) {
        if(element === null)
            events[name] = { type: type, fn: fn, obj: _window };
        else
            events[name] = { type: type, fn: fn, obj: element };
        events[name].obj.addEventListener(type, fn);
        return { limit: this.limit.bind(this, name, fn) }
    }
    this.register = function (name, element) {
        element = element || null;
        if (name === undefined) {
            throw "Name cannot be undefined";
        }
        if (events.hasOwnProperty(name)) {
            throw name + " is already defined";
        }
        return { on: On.bind(this, name, element) }
    }
    this.overwrite = function (name) {
        this.remove(name);
        return this.register(name);
    }
    this.removeAll = function () {
        this.list().forEach(name => {
            this.remove(name);
        });
        return true;
    }
    this.remove = function (name) {
        if (events.hasOwnProperty(name)) {
            events[name].obj.removeEventListener(events[name].type, events[name].fn);
            delete events[name];
            return true;
        }
        return false;
    }
    this.list = function () {
        return Object.keys(events);
    }
    this.fn = function () {
        return { params: this.params.bind(null, arguments[arguments.length - 1]) };
    }
    this.params = function (fn) {
        var args = [].slice.call(arguments, 1, arguments.length);
        return !(args[0] instanceof Object) && args.length < 1 ? fn.bind(null, args) : fn.bind(null, ...args);
    }
    this.volatile = function (type, fn) {
        var outer = function (event) {
            fn(event);
            this.removeEventListener(type, outer);
        }
        _window.addEventListener(type, outer);
    }
    var restrict = function* (name, times, _this) {
        for (var i = 1; i < times; i++)
            yield i;
        _this.remove(name);
        return i;
    }
    this.limit = function (name, fn, times, stats) {
        stats = stats || false;
        var restricted = restrict(name, times, this);
        var type = events[name].type;
        this.overwrite(name).on(type, function (event) {
            var result = restricted.next();
            var info = stats ? { clickedAmount: result.value, limit: times, done: result.done } : null;
            stats ? fn(event, info) : fn(event);
        })
        return true;
    }
    this.executeEvent = function (name) {
        try {
            events[name].fn();
            return true;
        }
        catch (err) {
            return false;
        }
    }
}).call(ASM.Events, window);