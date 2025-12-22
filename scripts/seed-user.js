const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB URI - trying 127.0.0.1 to avoid DNS issues with localhost
const MONGODB_URI = 'mongodb://127.0.0.1:27017/eventhub';

async function seedUser() {
    console.log('Attempting to connect to:', MONGODB_URI);
    try {
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('✅ Connected to MongoDB');

        const email = 'eventhub172@gmail.com';
        const password = '1m984mmm';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Schema definition to match your User model
        const UserSchema = new mongoose.Schema({
            name: String,
            email: { type: String, unique: true },
            password: String,
            role: { type: String, default: 'user' },
            isVerified: { type: Boolean, default: true }
        }, { timestamps: true });

        // Handle existing model if script is run multiple times
        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        // Upsert the user
        const user = await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            {
                name: 'Test User',
                email: email.toLowerCase(),
                password: hashedPassword,
                role: 'user',
                isVerified: true
            },
            { upsert: true, new: true }
        );

        console.log('User created/updated successfully:');
        console.log(`Email: ${user.email}`);
        console.log(`Verified: ${user.isVerified}`);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error seeding user:', error);
        process.exit(1);
    }
}

seedUser();
