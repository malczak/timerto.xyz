import { readable } from "svelte/store";
import moment from "moment";

// -----------------------
// Readonly time store
// -----------------------
export const time = readable(new Date(), function start(set) {
  const interval = setInterval(() => {
    set(new Date());
  }, 1000);

  return function stop() {
    clearInterval(interval);
  };
});

// -----------------------
// Events store
// -----------------------
const isValidEvent = event =>
  event &&
  typeof event.name === "string" &&
  event.name.length > 1 &&
  (moment.isDate(event.date) ||
    (moment.isMoment(event.date) && event.date.isValid()));

const serialize = events => {
  return JSON.stringify({
    v: 1,
    e: events.map(event => ({
      n: event.name,
      t: moment.utc(event.date).unix()
    }))
  });
};

const deserialize = data => {
  const { v, e: events } = JSON.parse(data);
  if (v == EventsStore.version) {
    return events.map(e => ({ name: e.n, date: moment.unix(e.t).utc() }));
  }
};

function storage(key) {
  const storage = window.localStorage;
  return {
    get: () => storage.getItem(key),
    set: value => storage.setItem(key, value),
    clear: () => storage.removeItem(key)
  };
}

const eventsStorage = storage("events");

class EventsStore /* implements SvelteStore */ {
  static get version() {
    return 1;
  }

  constructor() {
    this.events = [];
    this.subscriptions = [];
  }

  get length() {
    return this.events.length;
  }

  load() {
    let data = eventsStorage.get();
    if (data) {
      try {
        const events = deserialize(data);
        this.events = [...events];
        this.notifyAll();
      } catch (e) {
        eventsStorage.clear();
        /* die silently */
      }
    }
  }

  save() {
    eventsStorage.set(serialize(this.events));
  }

  add(event) {
    if (!this.events.includes(event)) {
      if (!isValidEvent(event)) {
        return false;
      }

      this.events.push(event);
      this.save();
      this.notifyAll();
    }
    return true;
  }

  remove(event) {
    const index = this.events.indexOf(event);
    if (index !== -1) {
      this.events.splice(index, 1);
      this.save();
      this.notifyAll();
    }
  }

  subscribe(handler) {
    const index = this.findHandler(handler);
    if (index !== -1) {
      return this.subscriptions[index].unsubscribe;
    }

    const unsubscribe = () => {
      const index = this.findHandler(handler);
      index !== -1 && this.subscriptions.splice(index, 1);
    };

    this.subscriptions.push({ handler, unsubscribe });
    handler(this.events);
    return unsubscribe;
  }

  findHandler(handler) {
    return this.subscriptions.findIndex(
      subscription => subscription.handler === handler
    );
  }

  notifyAll() {
    this.subscriptions.forEach(subscription =>
      subscription.handler(this.events)
    );
  }
}

export const events = new EventsStore();
