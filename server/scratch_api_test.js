import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
async function test() {
  const tokenRes = await fetch('http://localhost:5174/api/test/token'); // Assuming there might be a way or I can grab a token
}
