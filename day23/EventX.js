class EventX {
    constructor() {
        this.events = new Map();
    }

    on(name, fn) {
        if (!this.events.has(name)) {
            this.events.set(name, []);
        }
        this.events.get(name).push(fn);
        return this;
    }

    emit(name, ...args) {
        if (this.events.has(name)) {
            this.events.get(name).forEach(fn => fn(...args));
        }
        return this;
    }

    off(name, fn) {
        const listeners = this.events.get(name);
        if (!listeners) return this;

        const index = listeners.indexOf(fn);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
        if (listeners.length === 0) {
            this.events.delete(name);
        }
        return this;
    }

    once(name, fn) {
        const wrapper = (...args) => {
            fn(...args);
            this.off(name, wrapper);
        };
        this.on(name, wrapper);
        return this;
    }

    listeners(name) {
        return this.events.get(name) || [];
    }

    eventNames() {
        return Array.from(this.events.keys());
    }

    listenerCount(name) {
        return this.events.get(name)?.length || 0;
    }

    removeAllListeners(name) {
        if (name) {
            this.events.delete(name);
        } else {
            this.events.clear();
        }
        return this;
    }
}

module.exports = { EventX };
