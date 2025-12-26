const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '.env') });

// Define minimal schemas
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    profilePicture: String
});
const User = mongoose.model('User', userSchema);

const analysisSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sentimentScore: Number
});
const Analysis = mongoose.model('Analysis', analysisSchema);

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected.");

        const username = "dj952354";
        const user = await User.findOne({ username });

        if (!user) {
            console.log(`User ${username} NOT FOUND.`);
            process.exit(0);
        }

        console.log(`User: ${user.username}`);
        console.log(`Profile Pic: ${user.profilePicture || "NOT SET"}`);

        const count = await Analysis.countDocuments({ user: user._id });
        console.log(`Call Count: ${count}`);

        // Check leaderboard cut-off
        const leaderboard = await Analysis.aggregate([
            { $group: { _id: "$user", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        console.log("Top 5 Counts:");
        leaderboard.forEach(e => console.log(` - ${e.count}`));

        const cutOff = leaderboard.length < 5 ? 0 : leaderboard[leaderboard.length - 1].count;
        console.log(`Cut-off to enter leaderboard: ${cutOff}`);

        if (count >= cutOff && count > 0) {
            console.log("Status: SHOULD BE VISIBLE");
        } else {
            console.log("Status: NOT RANKED HIGH ENOUGH");
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

check();
