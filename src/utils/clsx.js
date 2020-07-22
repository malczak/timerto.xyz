// NOTE: poor man's clsx replacement to remove clsx dependency

const getEnabledKeys = (obj) =>
  Object.keys(obj).filter((key) => obj[key] === true);

const toArrray = (...params) => {
  const composed = params
    .reduce((accum, item) => {
      let value;

      if (Array.isArray(item)) {
        value = cn(...item);
      } else {
        const typeOf = typeof item;
        switch (typeOf) {
          case "string":
            value = item.split(" ");
            break;
          case "object":
            value = getEnabledKeys(item);
            break;
          default:
            value = "";
        }
      }

      value = Array.isArray(value) ? value : [value];
      return accum.concat(value);
    }, [])
    .filter((value) => value != null);
  const cls = [...new Set(composed)];
  return cls;
};

export const cn = (...params) => toArrray(...params).join(" ");
