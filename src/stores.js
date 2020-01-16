import { readable } from "svelte/store";
import moment from "moment";
import { isDev } from "app/utils/env";
import { serialize, deserialize } from "app/utils/serialization";

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

function storage(key) {
  const storage = window.localStorage;
  return {
    get: () => storage.getItem(key),
    set: value => storage.setItem(key, value),
    clear: () => storage.removeItem(key)
  };
}

const eventsStorage = storage("events");
const groupsStorage = storage("groups");

class EventsStore /* implements SvelteStore */ {
  constructor() {
    this.events = [];
    this.groupState = {};
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

        this.groupState = JSON.parse(groupsStorage.get() || "[]").reduce(
          (state, group) => {
            state[group] = true;
            return state;
          },
          {}
        );

        this.notifyAll();
      } catch (e) {
        if (isDev) {
          console.error(e);
        } else {
          /* die silently */
          eventsStorage.clear();
        }
      }
    }
  }

  // NOTE: naive way but good at this point
  groupCollpse(name, collapsed) {
    this.groupState[name] = collapsed;
    const collapsedGroups = Object.keys(this.groupState).filter(
      group => this.groupState[group] === true
    );
    groupsStorage.set(JSON.stringify(collapsedGroups));
  }

  isGroupCollapsed(name) {
    return this.groupState[name] === true;
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

  replace(event, newEvent) {
    if (!isValidEvent(newEvent)) {
      return false;
    }

    let index = this.events.indexOf(event);
    if (index !== -1) {
      this.events[index] = newEvent;
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
