const { Client } = require('pg');

const regions = [
  'us-east-1','us-east-2','us-west-1','eu-west-1','eu-west-2',
  'eu-central-1','ap-south-1','ap-northeast-1','ap-southeast-1','ca-central-1'
];

const REF  = 'emuznxqmemutrodgsesz';
const PASS = 'QewpRKcsWhpemhkJ';

(async () => {
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    const client = new Client({
      host, port: 5432,
      database: 'postgres',
      user: `postgres.${REF}`,
      password: PASS,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
    });
    try {
      await client.connect();
      const res = await client.query('SELECT current_database()');
      console.log(`✅ MATCH: ${region} → db: ${res.rows[0].current_database}`);
      await client.end();
      process.exit(0);
    } catch (e) {
      console.log(`❌ ${region}: ${e.message.split('\n')[0]}`);
    }
  }
  console.log('No matching region found');
})();
