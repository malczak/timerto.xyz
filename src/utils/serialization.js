import moment from "moment";

export const Version = 1;

export const serialize = events => {
  return JSON.stringify({
    v: Version,
    e: events.map(event => ({
      n: event.name,
      t: moment.utc(event.date).unix(),
      ...(event.group && { g: event.group }),
      ...(event.autoremove === true && { a: true })
    }))
  });
};

export const deserialize = data => {
  const { v, e: events } = JSON.parse(data);
  if (v == Version) {
    return events.map(e => ({
      name: e.n,
      date: moment.unix(e.t).utc(),
      ...(e.g && { group: e.g }),
      ...(e.a === true && { autoremove: true })
    }));
  }
};
