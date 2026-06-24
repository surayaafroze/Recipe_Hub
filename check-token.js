const fetch = require('axios');
fetch.get('http://localhost:3000/api/auth/token')
  .then(res => console.log(res.data))
  .catch(err => console.error(err.response ? err.response.status : err.message));
