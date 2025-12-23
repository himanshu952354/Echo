import fetch from 'node-fetch';

async function testSupport() {
    console.log("Testing Support Endpoint...");
    try {
        const response = await fetch('http://localhost:5000/support', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Test User',
                email: 'test@example.com',
                message: 'This is a test message from the local debugger.'
            })
        });

        const status = response.status;
        const text = await response.text();

        console.log("Status:", status);
        console.log("Response Body:", text);

    } catch (error) {
        console.error("Error:", error);
    }
}

testSupport();
