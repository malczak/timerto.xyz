export const toStylesStr = styles =>
  Object.keys(styles)
    .map(name => `${name}: ${styles[name]}`)
    .join(";");

export const styleWithRatio = (style, ratio) => {
  if (ratio) {
    ratio = Math.max(0, Math.min(ratio, 100));
    const rationStr = `${ratio}%`;
    style = {
      ...style,
      "flex-basis": rationStr
    };
  }
  return toStylesStr(style);
};
