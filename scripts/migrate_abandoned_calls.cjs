const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Manually defining schemas to avoid import issues from backend files
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    abandonedCalls: { type: Number, default: 0 },
});
const User = mongoose.models.User || mongoose.model("User", userSchema);

const abandonedCallSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});
const AbandonedCall = mongoose.models.AbandonedCall || mongoose.model('AbandonedCall', abandonedCallSchema);

// Load env from backend folder
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const migrate = async () => {
    await connectDB();

    try {
        const users = await User.find({});
        console.log(`Found ${users.length} users.`);

        for (const user of users) {
            const legacyCount = user.abandonedCalls || 0;
            const actualDocs = await AbandonedCall.countDocuments({ user: user._id });

            if (legacyCount > actualDocs) {
                const missing = legacyCount - actualDocs;
                console.log(`User ${user.username}: Has ${legacyCount} legacy count, but only ${actualDocs} records. Creating ${missing} backfilled records.`);

                const docsToCreate = [];
                const now = new Date();

                for (let i = 0; i < missing; i++) {
                    const d = new Date(now);
                    docsToCreate.push({
                        user: user._id,
                        date: d
                    });
                }

                await AbandonedCall.insertMany(docsToCreate);
                console.log(`   Created ${missing} records.`);
            } else {
                console.log(`User ${user.username}: Data is in sync (${legacyCount} == ${actualDocs}).`);
            }
        }

        console.log("Migration complete.");
        process.exit(0);

    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

migrate();
