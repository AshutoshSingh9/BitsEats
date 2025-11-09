const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env');
const examplePath = path.resolve(process.cwd(), '.env.example');

console.log('🔍 Environment Setup Verification\n');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env file NOT FOUND!');
  console.log('\n📝 To fix this:');
  if (fs.existsSync(examplePath)) {
    console.log('   1. Copy .env.example to .env');
    console.log('   2. On Windows: copy .env.example .env');
    console.log('   3. On Mac/Linux: cp .env.example .env\n');
  } else {
    console.log('   1. Create a .env file in the project root');
    console.log('   2. Add all required secrets (see LOCAL_SETUP_GUIDE.md)\n');
  }
  process.exit(1);
}

console.log('✅ .env file exists');

require('dotenv').config({ path: envPath });

const requiredVars = [
  'DATABASE_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'SESSION_SECRET'
];

let allPresent = true;

console.log('\n🔐 Checking required environment variables:\n');

requiredVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`   ✅ ${varName}`);
  } else {
    console.log(`   ❌ ${varName} - MISSING!`);
    allPresent = false;
  }
});

console.log('');

if (allPresent) {
  console.log('🎉 All environment variables are set correctly!\n');
  console.log('You can now run: npm run dev\n');
  process.exit(0);
} else {
  console.log('⚠️  Some environment variables are missing!');
  console.log('Please check your .env file and add the missing values.\n');
  process.exit(1);
}
