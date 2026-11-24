# Client (VueJS)

Vue 3 + Vite + Vue Router + Bootstrap frontend for the API in `../server`.

## Features

- **Design:** minimalist editorial look ("Field Notes") built on Bootstrap 5 with a custom theme in `src/assets/main.css` (serif headings, warm paper background, one accent colour).
- **Landing page** with the latest posts, plus a searchable post list ("Only my posts" filter when logged in).
- **Authentication:** register, login, logout. The JWT is stored in `localStorage` and sent as a Bearer token.
- **Posts CRUD:** anyone can view all posts and a single post; logged-in users can create posts and edit/delete their own; admins can delete any post (inline delete confirmation).
- Route guards: create/edit pages require login (and return you there after login); login/register redirect away when already logged in. Unknown URLs show a 404 page.
- Loading skeletons, empty states, and API errors shown as alerts.

## Run

```bash
cd client
npm install
cp .env.example .env   # VITE_API_URL points to the server (default http://localhost:4000)
npm run dev
```

The server must be running (see [../README.md](../README.md)).

For production (Vercel), set `VITE_API_URL` to the hosted API URL. `vercel.json` rewrites all routes to `index.html` so deep links work.

## Structure

```
src/
├── main.js             # app + router setup (auth guards)
├── App.vue
├── utils.js            # date, reading time, excerpt helpers
├── components/         # Navbar, Footer, PostRow
├── pages/              # Landing, Posts, PostDetail, PostForm, Login, Register, NotFound
├── services/api.js     # fetch wrapper adding the Bearer token
└── store/auth.js       # token + decoded user (id, username, isAdmin)
```
