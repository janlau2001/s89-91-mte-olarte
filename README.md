# s89-91 – Blog Application (MEVN)

A MEVN (MongoDB, Express, Vue 3, Node) blog application.

- `server/` – Backend REST API (Express + Mongoose, JWT authentication)
- `client/` – VueJS frontend (Vite, Vue Router, Bootstrap); see [client/README.md](./client/README.md)

## App Description

Users can register, log in, and manage blog posts. Anyone (including guests) can read posts. Logged-in users can create posts and edit or delete their own posts. Admins can delete any post.

Each post has a **title**, **content**, **author** (the user who created it) and a **creation date**. Passwords are hashed with bcrypt before being stored.

## Credentials

Login uses **email + password**. Admin can delete any post; a normal user can manage their own posts.

## Running the Server

```bash
cd server
npm install
cp .env.example .env   # set MONGODB_URI and JWT_SECRET
npm start              # http://localhost:4000
```

## Running the Client

```bash
cd client
npm install
cp .env.example .env   # VITE_API_URL points to the server
npm run dev            # http://localhost:5173
```

## API Endpoints

Authenticated routes require the header `Authorization: Bearer <token>`.

### Users

| Method | Endpoint          | Access | Description                                          |
| ------ | ----------------- | ------ | ---------------------------------------------------- |
| POST   | `/users/register` | Public | Register with `email`, `username`, `password` (min 8 chars) |
| POST   | `/users/login`    | Public | Log in with `email`, `password`; returns `{ access }` token |

### Posts

| Method | Endpoint                | Access                | Description                              |
| ------ | ----------------------- | --------------------- | ---------------------------------------- |
| GET    | `/posts/getPosts`       | Public                | Get all posts (newest first)             |
| GET    | `/posts/getPost/:id`    | Public                | Get a single post                        |
| POST   | `/posts/addPost`        | Logged-in user        | Create a post (`title`, `content`)       |
| PATCH  | `/posts/updatePost/:id` | Post author           | Update `title` and/or `content`          |
| DELETE | `/posts/deletePost/:id` | Post author or Admin  | Delete a post                            |

### Response handling

Successful responses return `200`/`201` with JSON. Errors return JSON `{ "error": "message" }` with `400` (validation / invalid ID), `401` (missing or invalid token), `403` (not allowed), `404` (not found), `409` (duplicate email or username) or `500` (server error).


### Admin User

| Field    | Value          |
| -------- | -------------- |
| Email    | admin@mail.com |
| Password | admin1234      |

### Normal User

| Field    | Value            |
| -------- | ---------------- |
| Email    | sample@mail.com  |
| Password | sample123        |