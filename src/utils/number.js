export const toZeroPadddedString = value =>
  `00${Math.abs(value).toString()}`.substr(-2);
