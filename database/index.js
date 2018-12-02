const { Client } = require('pg');
const client = new Client({
  user: 'alexanderwiederin',
  host: 'localhost',
  database: 'mvp',
  password: ''
});

client.connect(() => console.log('connected to postgres'));

addUser = (username) => {
  const query = `INSERT INTO users (username) VALUES (${username})`
  client.query(query)
    .then(() => console.log('insertion completed'))
    .catch((error) => console.log('insertion failed', error))
}

addTrade = ({ userID, type, volume, price }, callback) => {
  console.log(`INSERT INTO trades (user_id, type, volume, price) VALUES (${userID}, '${type}', ${volume}, ${price})`);
  const query = `INSERT INTO trades (user_id, type, volume, price) VALUES (${userID}, '${type}', ${volume}, ${price})`
  client.query(query, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  })
}

getTrades = (user_id, callback) => {
  const query = `SELECT * FROM trades WHERE user_id = ${user_id}`
  client.query(query, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  })
}

module.exports = {
  addUser,
  addTrade,
  getTrades
}

