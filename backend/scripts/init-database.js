// Database Initialization Script
// This creates the collections and indexes in MongoDB

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Review = require('./models/Review');

async function initializeDatabase() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Create collections with indexes
        console.log('\n📦 Creating collections and indexes...');

        // Create Users collection
        await User.createIndexes();
        console.log('✅ Users collection created with indexes:');
        console.log('   - Compound index: { authProvider: 1, providerId: 1 } (unique)');
        console.log('   - Index: { email: 1 }');

        // Create Reviews collection
        await Review.createIndexes();
        console.log('✅ Reviews collection created with indexes:');
        console.log('   - Index: { state: 1 }');
        console.log('   - Index: { userId: 1 }');
        console.log('   - Index: { createdAt: -1 }');
        console.log('   - Index: { isApproved: 1 }');
        console.log('   - Index: { rating: -1 }');

        // Check if collections exist
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\n📊 Current collections in database:');
        collections.forEach(col => {
            console.log(`   - ${col.name}`);
        });

        // Display database stats
        const userCount = await User.countDocuments();
        const reviewCount = await Review.countDocuments();

        console.log('\n📈 Database Statistics:');
        console.log(`   - Users: ${userCount}`);
        console.log(`   - Reviews: ${reviewCount}`);

        console.log('\n✅ Database initialization complete!');
        console.log('\nDatabase is ready to accept connections.');
        console.log('Collection structure:');
        console.log('\n1. users collection:');
        console.log('   {');
        console.log('     authProvider: "google" | "facebook",');
        console.log('     providerId: String,');
        console.log('     email: String,');
        console.log('     firstName: String,');
        console.log('     profilePicture: String,');
        console.log('     createdAt: Date,');
        console.log('     lastLogin: Date');
        console.log('   }');
        console.log('\n2. reviews collection:');
        console.log('   {');
        console.log('     userId: ObjectId (ref: User),');
        console.log('     userFirstName: String,');
        console.log('     state: String,');
        console.log('     jobTitle: String,');
        console.log('     employer: String,');
        console.log('     city: String,');
        console.log('     wages: Number,');
        console.log('     hoursPerWeek: Number,');
        console.log('     rating: Number (1-5),');
        console.log('     experience: String,');
        console.log('     isApproved: Boolean,');
        console.log('     createdAt: Date');
        console.log('   }');

    } catch (error) {
        console.error('❌ Error initializing database:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit(0);
    }
}

// Run initialization
initializeDatabase();
