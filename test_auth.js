require('dotenv').config();
import('./src/lib/auth.js')
  .then(m => {
    console.log("Successfully loaded auth module");
    process.exit(0);
  })
  .catch(err => {
    console.error("Error loading auth module:", err);
    process.exit(1);
  });
