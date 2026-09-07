const hasha = require('hasha');
const randomstring = require('randomstring');
const dbHelper = require('./src/db');

// Usage: node install.js [username] [password] [--role=admin]
// Defaults: username=admin, password=pass1234, role=admin.
// Re-runnable: updates the user if it already exists, and
// backfills missing roles to 'user'.
function parseArgs(argv) {
    const out = {};
    for (const a of argv) {
        if (a.startsWith('--role=')) out.role = a.slice('--role='.length);
        else if (a.startsWith('--username=')) out.username = a.slice('--username='.length);
        else if (a.startsWith('--password=')) out.password = a.slice('--password='.length);
        else if (!out.username) out.username = a;
        else if (!out.password) out.password = a;
    }
    return out;
}

const cli = parseArgs(process.argv.slice(2));
const admin = {
    username: cli.username || 'admin',
    password: cli.password || 'pass1234',
    role: cli.role || 'admin'
};

// Hash the password the same way login() does (sha512, hex by default).
admin.password = hasha(admin.password);

// Upsert: update if the user already exists, else create.
// Also backfills missing roles on all users to 'user'.
const existing = dbHelper.findOne(dbHelper.stores.users, { username: admin.username });
if (existing) {
    existing.password = admin.password;
    existing.role = admin.role;
    existing.updateDate = new Date();
    dbHelper.stores.users.putSync(existing._id, existing);
    console.log(`User "${admin.username}" updated (_id = ${existing._id}, role = ${existing.role}).`);
} else {
    // Generate a unique _id like the other modules do.
    admin._id = randomstring.generate({
        length: 16,
        charset: 'alphanumeric'
    });
    admin.createDate = new Date();
    dbHelper.stores.users.putSync(admin._id, admin);
    console.log(`User "${admin.username}" created with _id = ${admin._id}, role = ${admin.role}.`);
}

// Backfill: default any user without a role to 'user'.
for (const u of dbHelper.find(dbHelper.stores.users)) {
    if (!u.role) {
        u.role = 'user';
        u.updateDate = new Date();
        dbHelper.stores.users.putSync(u._id, u);
        console.log(`Backfilled role="user" for "${u.username}" (_id = ${u._id}).`);
    }
}
process.exit(0);