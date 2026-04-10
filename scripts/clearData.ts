import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env (the project root .env file)
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal';

async function main() {
  console.log('Connecting to MongoDB:', MONGODB_URI);
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });

  const db = mongoose.connection;
  console.log('Connected to database:', db.name);

  // WARNING: This will delete data permanently
  const collections = ['profiles', 'seekerprofiles', 'employerprofiles', 'jobs', 'applications'];
  for (const colName of collections) {
    try {
      console.log(`Clearing collection: ${colName}`);
      await db.collection(colName).deleteMany({});
      console.log(`✅ Cleared ${colName}`);
    } catch (err: any) {
      console.warn(`⚠️ Could not clear ${colName}:`, err.message || err);
    }
  }

  await mongoose.disconnect();
  console.log('Done. All selected collections cleared.');
}

main().catch(err => {
  console.error('Error clearing data:', err);
  process.exit(1);
});
