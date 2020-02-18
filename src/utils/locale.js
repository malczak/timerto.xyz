import moment from "moment";
import getUserLocale from "get-user-locale";

export function detectLocale(knownLocales) {
  window.moment = moment;

  const locale = (getUserLocale() || "").toLowerCase();

  // find matchin known locale 'xx-XX' or 'xx'
  const locales = [locale, locale.substring(0, 2)];
  while (locales.length && !knownLocales.includes(locales[0])) {
    locales.shift();
  }
  const matchedLocale = locales[0];
  if (matchedLocale) {
    return new Promise(resolve => {
      var script = document.createElement("script");
      script.onload = function() {
        moment.locale(matchedLocale);
        resolve(matchedLocale);
      };
      script.src = `/locale/${matchedLocale}.js`;
      document.head.appendChild(script);
    });
  }

  return Promise.resolve(null);
}
