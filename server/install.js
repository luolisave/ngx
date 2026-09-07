const hasha = require('hasha');
const randomstring = require('randomstring');
const dbHelper = require('./src/db');

const admin = {
    username: 'admin',
    password: 'pass1234'
};

// Hash the password the same way login() does (sha512, hex by default).
admin.password = hasha(admin.password);

// Skip if an admin user already exists.
const existing = dbHelper.findOne(dbHelper.stores.users, { username: admin.username });
if (existing) {
    console.log(`Admin user "${admin.username}" already exists, skipping.`);
    process.exit(0);
}

// Generate a unique _id like the other modules do.
admin._id = randomstring.generate({
    length: 16,
    charset: 'alphanumeric'
});
admin.createDate = new Date();

dbHelper.stores.users.putSync(admin._id, admin);
console.log(`Admin user "${admin.username}" created with _id = ${admin._id}`);