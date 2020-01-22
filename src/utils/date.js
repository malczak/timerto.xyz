import moment from "moment";

export const WildcardSymbol = "*";

export const YearAgnosticMonthDaysCount = [
  31, // january
  29, // february
  31, // march
  30, // april
  31, // may
  30, // june
  31, // july
  31, // august
  30, // september
  31, // october
  30, // november
  31 // december
];

export function correctDate(components) {
  const date = getDateOrClosest(
    components.year,
    components.month,
    components.day
  );
  return { year: date.year(), month: date.month(), day: date.date() };
}

/**
 * Function tries to find a valid date by going back in time.
 * Used mainly to resolve Fabruary 28th / 29th problem.
 *
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {moment.Moment}
 */
export function getDateOrClosest(year, month, day) {
  const components = [year, month, day];
  let activeComponent = 0x001; //0x001 day 0x010 month 0x100 year

  let m = moment(components);

  while (!m.isValid()) {
    let completed = true;

    do {
      completed = true;
      switch (activeComponent) {
        case 0x001:
          {
            let newValue = components[2] - 1;
            if (newValue < 1) {
              newValue = 31;
              activeComponent = 0x010;
              completed = false;
            }
            components[2] = newValue;
          }
          break;
        case 0x010:
          {
            let newValue = components[1] - 1;
            if (newValue < 0) {
              newValue = 11;
              activeComponent = 0x100;
              completed = false;
            }
            components[1] = newValue;
          }
          break;
        case 0x100:
          {
            const newValue = components[0] - 1;
            if (newValue < 1970) {
              throw new Error("Lost in space & time");
            }
            components[0] = newValue;
            activeComponent = 0x001;
            completed = false;
          }
          break;
      }
    } while (!completed);

    m = moment(components);
  }

  return m;
}

/**
 * Function tries to create a valid date from provided components.
 * In simplest scenarion value is a valid date eq. [2020,0,12] ie. 12th Jan 2020
 * If value is a date pattern (eq. ['*', '*', 2020]) function will try
 * to find a next date matching that pattern, starting from `startingDate` date.
 *
 * @param {number[]} value
 * @param {moment.Moment|undefined} startingDate
 * @throws
 */
export function parseDate(value, startingDate = null) {
  if (!value) {
    return moment();
  }

  if (typeof value === "number") {
    return moment.unix(value);
  }

  if (moment.isMoment(value) || moment.isDate(value)) {
    return moment(value);
  }

  if (typeof value === "string") {
    const pattern = value.split("|").reverse(); // [yyyy,mm,dd]
    if (pattern.length == 3) {
      if (pattern.some(component => component === WildcardSymbol)) {
        const now = (startingDate ? moment(startingDate) : moment()).endOf(
          "day"
        );
        if (!now.isValid()) {
          throw new Error("Invalid starting date");
        }
        const nowComponents = [now.year(), now.month(), now.date()];
        const components = pattern.map((componentPattern, index) =>
          componentPattern === WildcardSymbol
            ? nowComponents[index]
            : parseInt(componentPattern)
        );

        let matchingDate;

        const componentFlags = [0x100, 0x010, 0x001];
        const componentsToModify = pattern
          .map((componentPattern, index) =>
            componentPattern === WildcardSymbol ? componentFlags[index] : false
          )
          .filter(flag => flag !== false);
        let activeComponentIndex;

        do {
          matchingDate = getDateOrClosest(...components).endOf("day");
          if (!now.isBefore(matchingDate)) {
            let completed;

            activeComponentIndex = componentsToModify.length - 1;
            do {
              if (activeComponentIndex === -1) {
                // if we got here we are unable to move next date component
                // eq. reached a max on days but month is locked
                throw new Error("Unable to move");
              }

              // move a single component (day,month,year) one unit ahead
              // also correct any overflows eq. move month if max days reached
              const activeComponent = componentsToModify[activeComponentIndex];

              completed = true;
              switch (activeComponent) {
                case 0x001:
                  {
                    let newValue = components[2] + 1;
                    // note: get days in month from components date
                    if (
                      newValue >
                      (matchingDate.daysInMonth() ||
                        YearAgnosticMonthDaysCount[components[1]])
                    ) {
                      newValue = 1;
                      activeComponentIndex -= 1;
                      completed = false;
                    }
                    components[2] = newValue;
                  }
                  break;
                case 0x010:
                  {
                    let newValue = components[1] + 1;
                    if (newValue > 11) {
                      newValue = 0;
                      activeComponentIndex -= 1;
                      completed = false;
                    }
                    components[1] = newValue;
                  }
                  break;
                case 0x100:
                  {
                    const newValue = components[0] + 1;
                    if (newValue > 3000) {
                      throw new Error("Lost in space & time");
                    }
                    components[0] = newValue;
                    completed = true;
                  }
                  break;
              } /* switch */
            } while (!completed);
            /* pattern */

            matchingDate = null;
          }
        } while (!matchingDate);

        return matchingDate;
      } else {
        return getDateOrClosest(...pattern);
      }
    }
  }

  return moment();
}

/**
 * Function returns a collection of `count` future dates matching `pattern`
 *
 * For more details @see `parseDate`
 *
 * @param {number[]} pattern
 * @param {number} count
 * @param {moment.Moment|undefined} startingDate
 */
export function getMatchingDates(pattern, count, startingDate = null) {
  startingDate = startingDate || moment();
  const result = [];
  while (count) {
    count -= 1;
    try {
      const matchingDate = parseDate(pattern, startingDate);
      result.push(matchingDate.clone());
      startingDate = matchingDate;
    } catch (e) {
      break;
    }
  }
  return result;
}
