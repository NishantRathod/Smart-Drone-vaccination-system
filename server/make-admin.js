/**
 * Script to grant admin role to a user by email
 * Usage: node make-admin.js <email>
 * Example: node make-admin.js yourname@example.com
 */

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email address.');
  console.error('   Usage: node make-admin.js <email>');
  process.exit(1);
}

async function makeAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-vaccination');
    console.log('✅ Connected to MongoDB');

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role: 'admin' },
      { new: true }
    );

    if (!user) {
      console.error(`❌ No user found with email: ${email}`);
    } else {
      console.log(`✅ User "${user.name}" (${user.email}) has been granted admin privileges.`);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

makeAdmin();
