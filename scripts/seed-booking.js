const mongoose = require('mongoose');

// MongoDB URI
const MONGODB_URI = 'mongodb://127.0.0.1:27017/eventhub';

async function seedData() {
    console.log('Attempting to connect to:', MONGODB_URI);
    try {
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('✅ Connected to MongoDB');

        const testUserId = 'test-user-id-123'; // Matches the backdoor ID in routes
        const organizerId = 'org-user-id-456';

        // 1. Create a Test Event
        const EventSchema = new mongoose.Schema({
            organizerId: String,
            title: String,
            location: String,
            startsAt: Date,
            capacity: Number,
            availableSeats: Number,
            description: String,
            coverImageUrl: String
        }, { timestamps: true });

        const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);

        const event = await Event.findOneAndUpdate(
            { title: 'Tech Conference 2025' },
            {
                organizerId: organizerId,
                title: 'Tech Conference 2025',
                location: 'San Francisco, CA',
                startsAt: new Date('2025-06-15T10:00:00Z'),
                capacity: 100,
                availableSeats: 99,
                description: 'A massive tech event to test our feedback system.',
                coverImageUrl: 'https://images.unsplash.com/photo-1540575861501-7ad0582373f2?q=80&w=2070&auto=format&fit=crop'
            },
            { upsert: true, new: true }
        );

        console.log('✅ Event created/updated:', event.title, event._id);

        // 2. Create a Booking for the test user
        const BookingSchema = new mongoose.Schema({
            user: mongoose.Schema.Types.ObjectId,
            event: mongoose.Schema.Types.ObjectId,
            seats: Number,
            status: String,
            bookingDate: { type: Date, default: Date.now },
            name: String,
            email: String,
            phone: String
        }, { timestamps: true });

        const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

        // Since our test user is a 'mock' user with string ID 'test-user-id-123' 
        // but the DB expects an ObjectId, we need a real ID in the DB.
        // However, the routes use String(decoded.userId) to query.
        // Let's create a real DB user with that ID or use a persistent ObjectId.

        // Actually, for simplicity, I'll use a valid ObjectId string for 'user' 
        // that matches what the backdoor will eventually rely on if it hits the DB.
        // But wait, the backdoor returns a mock user. 
        // If the user goes to /bookings, the GET /api/bookings will try to find bookings in the DB.
        // It uses: const { userId } = authResult.user!; which is 'test-user-id-123'.
        // mongoose.Types.ObjectId('test-user-id-123') will fail because it's not 24 chars.

        console.log('Note: test-user-id-123 is not a valid ObjectId. I will use a valid 24-char ID for the DB.');
        const validObjectId = '507f1f77bcf86cd799439011'; // A random valid ObjectId

        // I should update the backdoor to use this valid ID too.

        const booking = await Booking.findOneAndUpdate(
            { user: new mongoose.Types.ObjectId(validObjectId), event: event._id },
            {
                user: new mongoose.Types.ObjectId(validObjectId),
                event: event._id,
                seats: 1,
                status: 'confirmed',
                name: 'Test Tester',
                email: 'eventhub172@gmail.com',
                phone: '1234567890'
            },
            { upsert: true, new: true }
        );

        console.log('✅ Booking created/updated for user:', validObjectId);
        console.log('--- ACTION REQUIRED ---');
        console.log('I will now update the login backdoor to use this valid ObjectId:', validObjectId);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
}

seedData();
