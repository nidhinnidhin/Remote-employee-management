import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Schema } from 'mongoose';

// --- Inline Definitions to avoid import issues ---

enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

enum UserStatus {
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

const UserSchema = new Schema(
  {
    companyId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    role: { type: String, required: true },
    passwordHash: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: Object.values(UserStatus),
      default: UserStatus.PENDING_VERIFICATION,
    },
  },
  { timestamps: true },
);

// ------------------------------------------------

async function bootstrap() {
  console.log('Connecting to MongoDB...');

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const UserModel = mongoose.model('User', UserSchema);

  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      'SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD not defined in .env',
    );
    process.exit(1);
  }

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    // We treat existingUser as 'any' or check properties manually since we don't have the interface
    const userRole = existingUser.get('role');

    if (userRole !== UserRole.SUPER_ADMIN) {
      console.log(
        `User with email ${email} exists but is not SUPER_ADMIN. Updating role...`,
      );
      existingUser.set('role', UserRole.SUPER_ADMIN);

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      existingUser.set('passwordHash', hash);

      await existingUser.save();
      console.log('User role and password updated to SUPER_ADMIN.');
    } else {
      console.log(
        'Super Admin user already exists. Updating password to ensure match...',
      );
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      existingUser.set('passwordHash', hash);
      await existingUser.save();
      console.log('Super Admin password updated.');
    }
  } else {
    console.log('Creating new Super Admin user...');

    const companyId = new mongoose.Types.ObjectId().toString();
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await UserModel.create({
      email,
      passwordHash,
      firstName: 'Super',
      lastName: 'Admin',
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      companyId: companyId,
      phone: '0000000000',
    });

    console.log(`Super Admin created with email: ${email}`);
  }

  await mongoose.disconnect();
  console.log('Done.');
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
