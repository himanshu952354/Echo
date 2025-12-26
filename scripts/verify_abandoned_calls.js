const API_URL = 'http://localhost:5000';

async function verify() {
    try {
        console.log('1. Creating test user...');
        const signupRes = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: `test_${Math.random().toString(36).substring(7)}`,
                email: `test_${Math.random().toString(36).substring(7)}@example.com`,
                password: 'password123'
            })
        });

        if (!signupRes.ok) throw new Error(`Signup failed: ${signupRes.statusText}`);
        const userData = await signupRes.json();
        const userId = userData.user._id;
        console.log(`   User created: ${userId}`);

        console.log('2. logging abandoned call...');
        const logRes = await fetch(`${API_URL}/log-abandoned`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });
        if (!logRes.ok) throw new Error(`Log failed: ${logRes.statusText}`);
        console.log('   Abandoned call logged.');

        console.log('3. Fetching abandoned history...');
        const historyRes = await fetch(`${API_URL}/abandoned-history?userId=${userId}`);
        if (!historyRes.ok) {
            if (historyRes.status === 404) {
                console.error("   FAILURE: /abandoned-history endpoint not found. Backend might not be updated.");
                process.exit(1);
            }
            throw new Error(`Fetch history failed: ${historyRes.statusText}`);
        }
        const history = await historyRes.json();

        console.log(`   Fetched ${history.length} records.`);

        if (history.length === 1 && history[0].user === userId) {
            console.log('   SUCCESS: Abandoned call found in history.');
        } else {
            console.error('   FAILURE: Abandoned call not found or incorrect count.');
            process.exit(1);
        }

    } catch (error) {
        console.error('Verification failed:', error.message);
        process.exit(1);
    }
}

verify();
