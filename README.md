# sv

## Demo authentication

Copy `.env.example` to `.env` and replace `SESSION_SECRET` with any non-empty random string before using demo authentication. Demo account credentials remain in the supplied mock-data README.

## Mock data boundaries

The supplied JSON is statically imported on the server so malformed fixtures fail during startup rather than reaching page components. Executable Zod contracts validate posts, campaigns, users, and the tag taxonomy while providing the inferred TypeScript types. Tag slugs stay stable in filter URLs; labels are localized from `mocks/tags.json` at the API boundary.

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
npx sv@0.16.2 create --template minimal --types ts --add prettier eslint playwright tailwindcss="plugins:typography,forms" sveltekit-adapter="adapter:vercel" vitest="usages:unit,component" --install npm app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
