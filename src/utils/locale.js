import moment from "moment";
import getUserLocale from "get-user-locale";

export function detectLocale(knownLocales) {
  window.moment = moment;

  const locale = getUserLocale().toLowerCase();
  const [, s1, s2] = locale.match(
    /^(?:(?:([a-z]{2})(?:\-\1)?)|([a-z]{2}\-[a-z]{2}))$/i
  );

  let matchedLocale = null;
  // eq. en
  if (s1) {
    if (knownLocales.includes(s1)) {
      matchedLocale = s1;
    }
  } else if (s2) {
    // find -> if not s2 = locale.substring(0,2)
    if (knownLocales.includes(s2)) {
      matchedLocale = s2;
    } else {
      const s3 = locale.substring(0, 2);
      if (knownLocales.includes(s3)) {
        matchedLocale = s3;
      }
    }
  } else {
    // unexpected locale
  }

  console.log(" Detected ->", locale);
  console.log(" Matched ->", matchedLocale);

  if (matchedLocale) {
    return new Promise(resolve => {
      var script = document.createElement("script");
      script.onload = function() {
        console.log("LOADED LOCALE", moment.locale());
        moment.locale(matchedLocale);
        resolve(matchedLocale);
      };
      script.src = `/locale/${matchedLocale}.js`;
      document.head.appendChild(script);
    });
  }

  return Promise.resolve(null);
}
