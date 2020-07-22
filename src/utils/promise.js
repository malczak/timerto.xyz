import queryString from "query-string";

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const waitAtLeast = (promise, ms) =>
  Promise.all([promise, sleep(ms)]).then(([value]) => value);

export const api = (url) => {
  const _request = (url, init = {}) => {
    const { headers = {}, body = null } = init;
    return waitAtLeast(
      fetch(url, {
        ...init,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(headers || {}),
        },
        ...(body && { body: JSON.stringify(body) }),
      }),
      2000
    ).then((response) => response.json());
  };
  return {
    get: (params) =>
      _request(`${url}?${queryString.stringify(params)}`, { method: "GET" }),
    post: (params) =>
      _request(url, {
        method: "POST",
        body: params ? JSON.stringify(params) : undefined,
      }),
  };
};
