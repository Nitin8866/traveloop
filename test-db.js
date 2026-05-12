import db from './server/config/db.js';
async function test() {
    try {
        const [trips] = await db.execute('SELECT id, user_id, name FROM trips');
        console.log(trips);
        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}
test();
