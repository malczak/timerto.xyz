// NOTE: poor man's clsx replacement to remove clsx dependency

export const cn = (cls, optionals) =>
  optionals
    ? Object.keys(optionals)
        .filter(key => optionals[key] === true)
        .reduce(($cls, key) => `${$cls} ${key}`, cls || "")
    : cls;
