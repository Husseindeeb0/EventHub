# EventHub Database Schema - Improved Architecture

## 🎯 Problem Solved

**Previous Issue:** Data duplication - booking details were stored in both Event model AND User model's `myEvents` field.

**Solution:** Store booking data **only once** in the Event model. User model now only stores **references** (event IDs).

## 📊 Current Architecture

### Event Model (Single Source of Truth)

```typescript
{
  _id: ObjectId,
  title: string,
  organizerId: ObjectId,  // Who created this event
  bookings: [             // ALL booking data stored HERE
    {
      userId: ObjectId,
      userName: string,
      userEmail: string,
      seatsBooked: number,
      bookedAt: Date
    }
  ],
  availableSeats: number,
  // ... other event fields
}
```

### User Model (References Only)

```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  role: 'user' | 'organizer',

  // Normal user fields
  bookedEvents: [ObjectId],    // Events this user booked
  attendedEvents: [ObjectId],  // Past events

  // Organizer field
  createdEvents: [ObjectId],   // Events this organizer created (IDs only!)
}
```

## ✅ Benefits

### 1. No Data Duplication

- Booking details stored **once** in Event model
- User model only stores event IDs
- Reduces storage and prevents sync issues

### 2. Single Source of Truth

- Event model is authoritative for all event data
- No risk of conflicting data between models
- Easier to maintain and update

### 3. Simplified Queries

**Get organizer's events with bookings:**

```javascript
// Simple query - no duplication
const events = await Event.find({
  organizerId: user._id,
});

// Each event has complete booking data
events.forEach((event) => {
  console.log(`${event.title}: ${event.bookings.length} bookings`);
});
```

**Get user's booked events:**

```javascript
const events = await Event.find({
  _id: { $in: user.bookedEvents },
});
```

## 🔄 Data Flow Examples

### When User Books Event

```javascript
// 1. Add booking to Event
event.bookings.push({
  userId: user._id,
  userName: user.name,
  userEmail: user.email,
  seatsBooked: 2,
  bookedAt: new Date(),
});
event.availableSeats -= 2;
await event.save();

// 2. Add event reference to User
user.bookedEvents.push(event._id);
await user.save();

// 3. Organizer automatically sees booking (it's in Event.bookings)
// No need to update organizer's document!
```

### When Organizer Views Their Events

```javascript
// Query events by organizerId
const myEvents = await Event.find({
  organizerId: organizer._id,
}).populate("bookings.userId");

// All booking data is right there!
myEvents.forEach((event) => {
  console.log(`Event: ${event.title}`);
  console.log(`Bookings: ${event.bookings.length}`);
  event.bookings.forEach((booking) => {
    console.log(`  - ${booking.userName}: ${booking.seatsBooked} seats`);
  });
});
```

### When Event Finishes

```javascript
// Move from booked to attended for all users
const event = await Event.findById(eventId);

for (const booking of event.bookings) {
  const user = await User.findById(booking.userId);

  // Move event from booked to attended
  user.bookedEvents = user.bookedEvents.filter((id) => !id.equals(eventId));
  user.attendedEvents.push(eventId);

  await user.save();
}

// Event data stays unchanged (historical record)
```

## 📁 File Structure

```
models/
├── Event.ts
│   ├── IBookingDetails (interface)
│   ├── BookingDetailsSchema (schema)
│   └── IEvent (main event interface)
│
└── User.ts
    └── IUser (references Event IDs only)
```

## 🎨 Comparison

### ❌ Old Approach (Duplicated Data)

```typescript
// User model
{
  myEvents: [
    {
      eventId: "123",
      bookings: [...],        // DUPLICATED!
      totalSeatsBooked: 10    // DUPLICATED!
    }
  ]
}

// Event model
{
  _id: "123",
  bookings: [...],            // DUPLICATED!
  availableSeats: 40          // DUPLICATED!
}
```

### ✅ New Approach (References Only)

```typescript
// User model
{
  createdEvents: ["123"]      // Just IDs!
}

// Event model
{
  _id: "123",
  organizerId: "user123",
  bookings: [...],            // SINGLE SOURCE!
  availableSeats: 40          // SINGLE SOURCE!
}
```

## 💡 Key Insights

1. **Event model owns all event data** - including bookings
2. **User model only tracks relationships** - which events they're involved with
3. **Organizer sees bookings** by querying Event model with their organizerId
4. **No synchronization needed** - data exists in one place
5. **Simpler code** - fewer updates, less complexity

## 🚀 For Events Team

When implementing event management:

1. **Create Event**: Set `organizerId` and add to `user.createdEvents[]`
2. **Book Event**: Add to `event.bookings[]` and `user.bookedEvents[]`
3. **View Organizer's Events**: Query `Event.find({ organizerId })`
4. **Get Booking Details**: Already in `event.bookings[]`
5. **Update Event**: Only update Event model
6. **Delete Event**: Remove from both Event collection and user arrays

## ✨ Summary

- ✅ **Zero duplication** - booking data stored once
- ✅ **Simpler queries** - direct Event model queries
- ✅ **Better performance** - less data to store/transfer
- ✅ **Easier maintenance** - single source of truth
- ✅ **Scalable** - works for any number of events/bookings
