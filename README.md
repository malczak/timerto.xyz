# Timerto.xyz

Clear and simple web application for creating timers to/since any date. No login. No ads.

See it in action on https://timerto.xyz

... or create your own private copy.

Created to learn how [Svelte](https://svelte.dev) works... and it works great.

Build with [svelte](https://svelte.dev), [moment](https://momentjs.com/),
[tailwind](https://tailwindcss.com/) & [webpack](https://webpack.js.org/)

**Limitations**

- Application does take time into account.
- Only en-US locale is available.
- No recurring events (eq. birthdays)
- Events are stored in local storage. So it's not possible to open a timer from browser different than the one it was created in.

## Development

Install the dependencies...

```bash
cd timerto.xyz
yarn install
```

...then start webpack:

```bash
yarn dev
```

Navigate to [localhost:8080](http://localhost:8080). You should see your app running.

## Deploy to the web with Now.sh

See [Now](https://zeit.co/docs/v2) for more details

```bash
yarn run now login
```

then

```bash
yarn run now
```
