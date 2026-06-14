import axios from 'axios';

const run = async () => {
    try {
        console.log('Fetching /api/classrooms...');
        const res = await axios.get('http://localhost:5000/api/classrooms');
        console.log('Success data:', res.data);
    } catch (e: any) {
        if (e.response) {
            console.error('Error response:', e.response.status, e.response.data);
        } else {
            console.error('Error:', e.message);
        }
    }
};

run();
