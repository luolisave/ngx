README
========

Config
------
Configuration is under src/const.js file.
1. passcode. we can login or use passcode as auth.

Goal
------
1. Easy to deploy light CMS for host a blog
2. Use as development mock server.

Install
------
Add the default admin user (username: `admin`, password: `pass1234`, role: `admin`):

    node install.js
    node install.js [username] [password] [--role=admin] [--username=x] [--password=y]

The script hashes the password with `hasha` (sha512) and stores the user in the
LMDB `users` store. It is safe to re-run — it upserts (updates password/role if
the user already exists, else creates) and backfills any existing user missing
`role` to `'user'`.

Run
---
    npm run serve-prod  # node index.js, port 3333
    npm run serve       # dev with node-dev

Server listens on port `3333` (`index.js`). Serves static from
`C:\workspace\ngx\my-ng-21\dist\my-ng-21\browser` if it exists, else `public/`.

Auth
----
`src/auth.js` `isloggedIn(req,res,db,dbX,options,cb)`:

- `token`: from `req.headers.token` | `req.params.token` | `req.query.token` |
  `req.body.token`. Obtained from login. Expires after `USER_LOGIN_TIMEOUT`
  (30 mins). Errors: `auth: not log in yet.`, `auth: login expired.`
  On success the callback receives the current user doc as 4th arg:
  `cb(req, res, dbX, currentUser)` (used for ownership / `role` checks).
- `passcode`: from `req.headers.passcode` | `req.query.passcode` |
  `req.params.passcode` | `req.body.passcode`. Must equal `PASSCODE`
  (`passcode1234` in `src/const.js`). Error: `auth: wrong passcode.`
- `null`: no check, always passes.

All responses are JSON: `{ status: 0|1, info: string, data: object|array }`.

Common CRUD rules (`src/crud.js`, LMDB in `src/db.js` stores `users/userInfo/pages/mocks`)
------------------------------------------------------------------
- `_id`: 16-char alphanumeric auto-generated if missing on create.
- Doc body size (without `___bulk`) must be < `PAGE_DOC_BYTES_LIMIT` (4096 bytes),
  else `Error: exceeding document limits...`
- `___bulk`: optional large payload (object or string). Stripped from LMDB doc,
  saved to `./private/uploads/___bulks/<_id>.json`. Re-attached (parsed if JSON)
  on `getX`.
- `updateX`: merges `existing + body`, forces `_id = :xId`.
- `delX`: removes doc + bulk file if exists.

APIs
----
### 0. Postman Collection file:
```
liCMS.postman_collection.json
```

### 1. User — `src/user.js`, store `users`

| Method | Path | Auth | Body | Description |
| ------ | ---- | ---- | ---- | ----------- |
| POST | `/api/v1/user/login` | none | `{"username":"admin","password":"pass1234"}` | Login. Hashes `password` with `hasha` (sha512), looks up `users` by `username`. On success returns user doc (password stripped) with `token`, `tokenTime`, `updateDate`. On fail `status:0`. |
| POST | `/api/v1/user/register` | token | `{"username":"new","password":"secret", ...extra}` | Register new user (logged-in only). Rejects duplicate `username`/`_id`. Auto-generates `_id` if missing. Password stored as `hasha` sha512. `role` defaults to `'user'` when omitted. Extra fields (e.g. `displayName`) are kept; `token`/`tokenTime` ignored. |
| GET | `/api/v1/user/list` | token | - | List all users (passwords stripped). Header `token`. |
| GET | `/api/v1/user/:xId` | token | - | Get one user by `_id` (password stripped). Header `token`. |
| PATCH | `/api/v1/user/:xId` | token | JSON partial, e.g. `{"displayName":"Li","password":"newpass"}` | Update user. `password` re-hashed if present. `username` change checked for duplicates. `token`/`tokenTime`/`_id` cannot be set directly. |
| DELETE | `/api/v1/user/:xId` | token | - | Delete user by `_id`. |

Example:

    curl -X POST http://localhost:3333/api/v1/user/login \
      -H "Content-Type: application/json" \
      -d '{"username":"admin","password":"pass1234"}'
    # then use returned data.token as header `token`:
    curl -X POST http://localhost:3333/api/v1/user/register \
      -H "Content-Type: application/json" -H "token: <token>" \
      -d '{"username":"bob","password":"bob1234"}'
    curl http://localhost:3333/api/v1/user/list -H "token: <token>"
    curl http://localhost:3333/api/v1/user/<xId> -H "token: <token>"
    curl -X PATCH http://localhost:3333/api/v1/user/<xId> \
      -H "Content-Type: application/json" -H "token: <token>" \
      -d '{"displayName":"Bob"}'
    curl -X DELETE http://localhost:3333/api/v1/user/<xId> -H "token: <token>"

### 2. UserInfo — `src/user-info.js`, store `userInfo`, Auth `token`

1-to-1 with `users`: `userInfo._id` always equals the owner's `users._id`.
Free-form JSON fields allowed (plus optional `___bulk`); server enforces
ownership and strips `_id/token/tokenTime/password/username/role` from client body.

Ownership: every caller defaults to their own doc only — including `admin`.
Admin cross-user access requires `role === 'admin'` AND explicit flag `?all=true`
(`true/1/all/yes`). Without the flag, mismatched `:xId` returns
`Error: forbidden, you can only access your own user information...`.

| Method | Path | Description |
| ------ | ---- | ----------- |
| POST | `/api/v1/user-info/create` | Create own doc (`_id` = caller `_id`). Fails if it already exists — use PATCH. Header `token`. |
| GET | `/api/v1/user-info/list` | Own doc as 1-item array (empty if none). Admin + `?all=true` returns all docs. Header `token`. |
| GET | `/api/v1/user-info/:xId` | Get one by `_id`. Must equal own `_id` unless admin + `?all=true`. Includes `___bulk` if file exists. |
| PATCH | `/api/v1/user-info/:xId` | Upsert by `_id` (merge if exists, create if missing). Same ownership rule. Optional `___bulk` saved to file. |
| DELETE | `/api/v1/user-info/:xId` | Delete by `_id` + bulk file. Same ownership rule. |

Examples:

    # login, save token + own _id
    curl -X POST http://localhost:3333/api/v1/user/login \
      -H "Content-Type: application/json" \
      -d '{"username":"bob","password":"bob1234"}'
    # create own info
    curl -X POST http://localhost:3333/api/v1/user-info/create \
      -H "Content-Type: application/json" -H "token: <token>" \
      -d '{"displayName":"Bob","email":"bob@example.com"}'
    # list own info
    curl http://localhost:3333/api/v1/user-info/list -H "token: <token>"
    # get / update / delete own info
    curl http://localhost:3333/api/v1/user-info/<myId> -H "token: <token>"
    curl -X PATCH http://localhost:3333/api/v1/user-info/<myId> \
      -H "Content-Type: application/json" -H "token: <token>" \
      -d '{"phone":"123"}'
    curl -X DELETE http://localhost:3333/api/v1/user-info/<myId> -H "token: <token>"
    # admin: access everything with ?all=true
    curl "http://localhost:3333/api/v1/user-info/list?all=true" -H "token: <adminToken>"
    curl "http://localhost:3333/api/v1/user-info/<otherId>?all=true" -H "token: <adminToken>"

### 3. Page — `src/page.js`, store `pages`, Auth `token`

| Method | Path | Body | Description |
| ------ | ---- | ---- | ----------- |
| POST | `/api/v1/page/create` | JSON doc + optional `___bulk` | Create page. Header `token: <token>`. |
| GET | `/api/v1/page/list` | - | List all pages. Header `token`. |
| GET | `/api/v1/page/:xId` | - | Get one by `_id`. Header `token`. Includes `___bulk` if file exists. |
| PATCH | `/api/v1/page/:xId` | JSON partial + optional `___bulk` | Update by `_id`. Header `token`. |
| DELETE | `/api/v1/page/:xId` | - | Delete by `_id` + bulk file. Header `token`. |

Examples:

    curl http://localhost:3333/api/v1/page/list -H "token: <token>"
    curl http://localhost:3333/api/v1/page/<xId> -H "token: <token>"
    curl -X POST http://localhost:3333/api/v1/page/create \
      -H "Content-Type: application/json" -H "token: <token>" \
      -d '{"pageTitle":"hello","pageContent":"...","___bulk":{"data":"big..."}}'
    curl -X PATCH http://localhost:3333/api/v1/page/<xId> \
      -H "Content-Type: application/json" -H "token: <token>" \
      -d '{"pageTitle":"new title"}'
    curl -X DELETE http://localhost:3333/api/v1/page/<xId> -H "token: <token>"

### 4. Mock with Passcode — `src/mock-passcode.js`, store `mocks`, Auth `passcode`

Pass `passcode` via query `?passcode=passcode1234`, header, params, or body.

| Method | Path | Description |
| ------ | ---- | ----------- |
| GET | `/api/v1/mock/list?passcode=passcode1234` | List all mocks. |
| GET | `/api/v1/mock/:xId?passcode=passcode1234` | Get one mock. |
| POST | `/api/v1/mock/create?passcode=passcode1234` | Create mock. JSON body + optional `___bulk`. |
| PATCH | `/api/v1/mock/:xId?passcode=passcode1234` | Update mock. |
| DELETE | `/api/v1/mock/:xId?passcode=passcode1234` | Delete mock. |

Example:

    curl "http://localhost:3333/api/v1/mock/list?passcode=passcode1234"
    curl -X POST "http://localhost:3333/api/v1/mock/create?passcode=passcode1234" \
      -H "Content-Type: application/json" \
      -d '{"pageTitle":"mock 1","pageContent":"..."}'

### 5. Mock (open) — `src/mock.js`, store `mocks`, Auth `null` (no auth)

For dev mock server / free-style use. Same CRUD semantics as above, no token/passcode.

| Method | Path | Description |
| ------ | ---- | ----------- |
| GET | `/mock/list` | List all mocks. |
| GET | `/mock/:xId` | Get one mock. |
| POST | `/mock/create` | Create mock. |
| PATCH | `/mock/:xId` | Update mock. |
| DELETE | `/mock/:xId` | Delete mock. |
| PATCH | `/mock/business` | Demo hook. Looks up `_id=1lcyijBFZdahhXpQ`, returns it with `modify='modified according to business'`, else `{err:null,doc:null}`. |

Examples:

    curl http://localhost:3333/mock/list
    curl http://localhost:3333/mock/<xId>
    curl -X POST http://localhost:3333/mock/create \
      -H "Content-Type: application/json" -d '{"pageTitle":"m1"}'
    curl -X PATCH http://localhost:3333/mock/business -H "Content-Type: application/json" -d '{}'

Postman
-------
See `liCMS.postman_collection.json` (collections: Auth, Page, Mock with Passcode, Mock).