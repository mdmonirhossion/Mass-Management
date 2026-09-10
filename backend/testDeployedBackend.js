async function testBackend() {
    try {
        console.log('Fetching https://backend-nu-pied-68.vercel.app/api/summary?month=September%202026...');
        const res = await fetch('https://backend-nu-pied-68.vercel.app/api/summary?month=September%202026');
        console.log('HTTP Status:', res.status);
        const data = await res.json();
        console.log('Response Body:', data);
    } catch (err) {
        console.error('Fetch Error:', err.message);
    }
}

testBackend();
