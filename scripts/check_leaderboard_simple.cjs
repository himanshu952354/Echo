const http = require('http');

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/leaderboard',
    method: 'GET'
};

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const leaderboard = JSON.parse(data);
            console.log("--- Leaderboard Data ---");
            leaderboard.forEach((entry, index) => {
                console.log(`#${index + 1}: ${entry.name} (${entry.calls} calls)`);
                console.log(`    Pic: '${entry.profilePicture}'`);
            });

            const found = leaderboard.find(e => e.name === 'dj952354');
            if (!found) {
                console.log("\nCONCLUSION: 'dj952354' is NOT in the top 5.");
            } else {
                console.log("\nCONCLUSION: 'dj952354' IS in the list.");
            }
        } catch (e) {
            console.error("Error parsing JSON:", e.message);
            console.log("Raw Data:", data);
        }
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();
