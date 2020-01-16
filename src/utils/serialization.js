import moment from "moment";

export const Version = 1;

export const serialize = events => {
  const groups = [
    ...events
      .filter(event => event.group)
      .reduce((set, event) => set.add(event.group), new Set())
  ];
  return JSON.stringify({
    v: Version,
    g: groups,
    e: events.map(event => ({
      n: event.name,
      t: moment.utc(event.date).unix(),
      ...(event.group && { g: groups.indexOf(event.group) }),
      ...(event.autoremove === true && { a: true })
    }))
  });
};

export const deserialize = data => {
  const { v, g: groups, e: events } = JSON.parse(data);
  if (v == Version) {
    return events.map(e => ({
      name: e.n,
      date: moment.unix(e.t).utc(),
      ...(e.g != null && { group: groups[e.g] }),
      ...(e.a === true && { autoremove: true })
    }));
  }
};
