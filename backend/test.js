require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing connection to YOUR database...');
console.log('Connection string (password hidden):', 
  process.env.DATABASE_URL.replace(/:[^:@]*@/, ':****@'));

mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('✅ SUCCESS! Connected to YOUR database');
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ FAILED to connect');
    console.log('Error:', err.message);
    process.exit(1);
  });