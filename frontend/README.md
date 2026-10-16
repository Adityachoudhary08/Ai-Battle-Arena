# AI Battle Arena frontend

## Deployment

The frontend uses the deployed backend at:

`https://ai-battle-arena-2-kvku.onrender.com`

For a different backend, set the Vercel environment variable `VITE_API_URL` to the backend URL, then redeploy. The value is used for the models, authentication, battle, history, and leaderboard requests.

The backend accepts localhost origins, Vercel deployment origins, and any comma-separated origins configured through its `FRONTEND_URL` environment variable.

## Development

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
