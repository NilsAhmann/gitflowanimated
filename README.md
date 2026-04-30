An experimental React app to visualize and animate Gitflow.

## Requirements

- Node.js 24

## Current status

- Upgraded from the old Create React App setup to Vite
- Updated to a Node.js 24-compatible toolchain
- Fixed connection rendering for larger feature/release histories
- Centralized branch naming in `src/branch-config.js`
- Default primary branch label is now `main`

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

Try it here: [https://veerasundar.com/blog/gitflow-animated](https://veerasundar.com/blog/gitflow-animated)

![Gitflow animated](https://i.imgur.com/c2rZy5E.gif)
