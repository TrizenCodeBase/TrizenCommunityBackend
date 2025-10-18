const mongoose = require('mongoose');
const Event = require('../models/Event');
require('dotenv').config();

const connectDB = async () => {
    try {
        // Use environment variable or default to local MongoDB
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/trizen_community';
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

const seedEvents = async () => {
    await connectDB();

    console.log('\nSeeding events...');

    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');

    const events = [
        {
            _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439011"),
            title: "AI & Machine Learning Workshop",
            description: "Learn the latest in AI and ML technologies",
            startDate: new Date("2025-03-25T14:00:00Z"),
            endDate: new Date("2025-03-25T17:00:00Z"),
            location: {
                venue: "Virtual Event",
                onlineLink: "https://zoom.us/j/123456789"
            },
            category: "Workshop",
            type: "Online",
            difficulty: "Beginner",
            timezone: "UTC",
            duration: 180,
            organizer: {
                _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439011"),
                name: "Tech Academy"
            },
            coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
            currentAttendees: 0,
            maxAttendees: 100,
            price: 0,
            currency: "USD",
            isFeatured: false,
            isPublic: true,
            registrationOpen: true,
            requiresApproval: false,
            tags: ["AI", "Machine Learning", "Workshop"],
            topics: ["Machine Learning", "AI", "Data Science"],
            prerequisites: ["Basic programming knowledge"],
            requirements: ["Laptop", "Internet connection"],
            whatYouWillLearn: ["AI fundamentals", "ML algorithms", "Practical applications"],
            targetAudience: ["Developers", "Students", "Tech enthusiasts"],
            speakers: [],
            likes: [],
            bookmarks: [],
            shares: 0,
            views: 0,
            reviews: [],
            averageRating: 0,
            totalReviews: 0,
            analytics: {
                registrations: [],
                attendance: { registered: 0, attended: 0, noShow: 0 },
                engagement: { pageViews: 0, uniqueVisitors: 0, timeOnPage: 0 }
            },
            status: "Published"
        },
        {
            _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439012"),
            title: "Research Symposium 2025",
            description: "Present your research and network with peers",
            startDate: new Date("2025-04-10T09:00:00Z"),
            endDate: new Date("2025-04-10T18:00:00Z"),
            location: {
                venue: "Innovation Hub",
                address: "123 Tech Street",
                city: "New York",
                state: "NY",
                country: "USA"
            },
            category: "Conference",
            type: "In-Person",
            difficulty: "Advanced",
            timezone: "UTC",
            duration: 540,
            organizer: {
                _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439012"),
                name: "Research Institute"
            },
            coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
            currentAttendees: 0,
            maxAttendees: 200,
            price: 0,
            currency: "USD",
            isFeatured: false,
            isPublic: true,
            registrationOpen: true,
            requiresApproval: false,
            tags: ["Research", "Conference", "Networking"],
            topics: ["Research", "Academic", "Innovation"],
            prerequisites: ["Research background"],
            requirements: ["Presentation materials"],
            whatYouWillLearn: ["Research methodologies", "Academic networking", "Publication strategies"],
            targetAudience: ["Researchers", "Academics", "PhD students"],
            speakers: [],
            likes: [],
            bookmarks: [],
            shares: 0,
            views: 0,
            reviews: [],
            averageRating: 0,
            totalReviews: 0,
            analytics: {
                registrations: [],
                attendance: { registered: 0, attended: 0, noShow: 0 },
                engagement: { pageViews: 0, uniqueVisitors: 0, timeOnPage: 0 }
            },
            status: "Published"
        },
        {
            _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439013"),
            title: "Startup Pitch Competition",
            description: "Pitch your startup idea to investors",
            startDate: new Date("2025-04-20T15:00:00Z"),
            endDate: new Date("2025-04-20T20:00:00Z"),
            location: {
                venue: "Tech Center",
                address: "456 Startup Ave",
                city: "San Francisco",
                state: "CA",
                country: "USA"
            },
            category: "Meetup",
            type: "In-Person",
            difficulty: "Intermediate",
            timezone: "UTC",
            duration: 300,
            organizer: {
                _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439013"),
                name: "Startup Hub"
            },
            coverImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop",
            currentAttendees: 0,
            maxAttendees: 50,
            price: 0,
            currency: "USD",
            isFeatured: false,
            isPublic: true,
            registrationOpen: true,
            requiresApproval: false,
            tags: ["Startup", "Pitch", "Competition"],
            topics: ["Entrepreneurship", "Pitching", "Investment"],
            prerequisites: ["Startup idea"],
            requirements: ["Pitch deck", "Business plan"],
            whatYouWillLearn: ["Pitch techniques", "Investor relations", "Business development"],
            targetAudience: ["Entrepreneurs", "Startup founders", "Business students"],
            speakers: [],
            likes: [],
            bookmarks: [],
            shares: 0,
            views: 0,
            reviews: [],
            averageRating: 0,
            totalReviews: 0,
            analytics: {
                registrations: [],
                attendance: { registered: 0, attended: 0, noShow: 0 },
                engagement: { pageViews: 0, uniqueVisitors: 0, timeOnPage: 0 }
            },
            status: "Published"
        }
    ];

    try {
        const createdEvents = await Event.insertMany(events);
        console.log(`✅ Successfully created ${createdEvents.length} events:`);
        createdEvents.forEach(event => {
            console.log(`   - ${event.title} (${event.category})`);
        });
    } catch (error) {
        console.error('❌ Error creating events:', error);
    }

    console.log('\n✅ Event seeding completed');
    mongoose.disconnect();
};

seedEvents();
