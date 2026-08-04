const http = require('http');

function check() {
  const req = http.get('http://localhost:3000', (res) => {
    if (res.statusCode === 200 || res.statusCode === 404 || res.statusCode === 302 || res.statusCode === 301) {
      console.log('Server is up!');
      process.exit(0);
    } else {
      setTimeout(check, 1000);
    }
  });
  req.on('error', () => setTimeout(check, 1000));
}

check();
