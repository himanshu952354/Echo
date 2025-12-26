const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '.env') });

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    profilePicture: String
});
// Use a different model name to avoid conflicts if previously compiled
const User = mongoose.models.User || mongoose.model('User', userSchema);

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB.");

        const username = "dj952354";
        const user = await User.findOne({ username });

        if (!user) {
            console.log(`User ${username} NOT FOUND.`);
        } else {
            console.log("--- User Details ---");
            console.log(`ID: ${user._id}`);
            console.log(`Username: ${user.username}`);
            // Explicitly print the value with quotes to see empty strings or whitespace
            console.log(`ProfilePicture: "${user.profilePicture}"`);

            if (!user.profilePicture) {
                console.log(">> Profile picture field is EMPTY or UNDEFINED.");
            } else {
                console.log(">> Profile picture field DOES exist.");
            }
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

check();
