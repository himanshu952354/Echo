
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import models
import User from './User.js';
import Analysis from './Analysis.js';

dotenv.config({ path: path.join(__dirname, '.env') });

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const targetUsername = "dj952354";
        const user = await User.findOne({ username: targetUsername });

        if (!user) {
            console.log(`User '${targetUsername}' not found.`);
        } else {
            console.log(`\nUser Found: ${user.username}`);
            console.log(`Profile Picture: '${user.profilePicture}'`);

            const callCount = await Analysis.countDocuments({ user: user._id });
            console.log(`Total Calls: ${callCount}`);

            // Check top 5 to see if they make the cut
            const leaderboard = await Analysis.aggregate([
                { $group: { _id: "$user", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ]);

            console.log("\nCurrent Leaderboard Counts:");
            leaderboard.forEach((entry, i) => {
                console.log(`${i + 1}. UserID: ${entry._id}, Calls: ${entry.count}`);
            });

            const isInLeaderboard = leaderboard.some(e => e._id.toString() === user._id.toString());
            console.log(`\nIs '${targetUsername}' in Top 5? ${isInLeaderboard ? "YES" : "NO"}`);
        }

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkUser();
