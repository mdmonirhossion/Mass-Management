async function testAllEndpoints() {
    const baseUrl = 'https://backend-nu-pied-68.vercel.app/api';
    const endpoints = [
        '/health',
        '/members',
        '/summary?month=September%202026',
        '/meals?month=September%202026',
        '/bazar?month=September%202026',
        '/bills?month=September%202026'
    ];

    console.log('Testing Deployed Backend Endpoints...\n');
    for (const ep of endpoints) {
        try {
            const url = baseUrl + ep;
            const res = await fetch(url);
            console.log('[GET ' + ep + '] Status: ' + res.status);
        } catch (err) {
            console.error('[GET ' + ep + '] Error: ' + err.message);
        }
    }
}

testAllEndpoints();
