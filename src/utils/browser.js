import Bowser from "bowser";

export function browser(ua) {
  ua = ua || window.navigator.userAgent;
  const parser = Bowser.getParser(ua);
  return {
    os: parser.getOSName(),
    platform: parser.getPlatformType(),
    name: parser.getBrowserName(),
    parser,
  };
}
