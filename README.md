# ¿Si Escuchas?

¿Si Escuchas? aims to connect multiple Spotify players to have a joined listening experience.

This project contains the UI to interact with this system, you check the current build of `master` [here](https://si-escuchas.netlify.app).

## Required variables

To run this project locally you need to setup a .env.* file:

```shell
# .env.development for local npm run serve
# Without trailing slash '/'
VUE_APP_API_URL=<YOUR_API_URL>
```

Or set the `VUE_APP_API_URL` environment variable.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
