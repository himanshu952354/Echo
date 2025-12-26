const axios = require('axios');
require('dotenv').config({ path: '../backend/.env' });

async function checkLeaderboard() {
    try {
        const response = await axios.get('http://localhost:5000/leaderboard');
        console.log("Leaderboard Data:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("Error fetching leaderboard:", error.message);
    }
}

checkLeaderboard();
