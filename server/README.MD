README
========

Config
------
Configuration is under src/const.js file.
1. passcode. we can login or use passcode as auth.
2.

Goal
------
1. Easy to deploy light CMS for host a blog
2. Use as development mock server.

Install
------
Add the default admin user (username: `admin`, password: `pass1234`):

    node install.js

The script hashes the password with `hasha` (sha512) and stores the user in the
LMDB `users` store. It is safe to re-run — it skips if an `admin` user already
exists.