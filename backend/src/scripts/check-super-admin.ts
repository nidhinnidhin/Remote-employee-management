import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { Schema } from 'mongoose';

dotenv.config();

// --- Inline Definitions to avoid import issues ---
const UserSchema = new Schema(
  {
    companyId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    role: { type: String, required: true },
    passwordHash: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true },
);

async function check() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI as string);

  const UserModel = mongoose.model('User', UserSchema);
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  console.log(`Checking user: ${email}`);

  const user = await UserModel.findOne({ email });

  if (!user) {
    console.error('❌ User NOT found in database!');
  } else {
    console.log('   User found:');
    console.log(`   ID: ${user._id}`);
    console.log(`   Role: ${user.get('role')}`);
    console.log(`   Status: ${user.get('status')}`);
    console.log(`   Password Hash: ${user.get('passwordHash')}`);

    if (password) {
      console.log(`Testing password '${password}' against hash...`);
      const isMatch = await bcrypt.compare(password, user.get('passwordHash'));
      console.log(`Passowrd Match: ${isMatch ? 'YES' : 'NO'}`);
    }
  }

  await mongoose.disconnect();
}

check().catch(console.error);
