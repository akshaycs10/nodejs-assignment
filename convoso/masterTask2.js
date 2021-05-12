//parent process
const child_process = require('child_process');
const http = require('http');

for (let i = 0; i < 10; i++) {
   //spinning up 10 concurrent child processes
   let child = child_process.fork(__dirname + '/task2.js');

   child.on('message', onMessage);
   child.on('close', (code) => {
      console.error(`child process exited with code ${code}`);
   });
}

function onMessage(msg) {
   console.log('Parent process received:', msg);
}

http.createServer(function (req, res) {
   let data = '';
   req.on('data', chunk => {
      data += chunk;
   })
   req.on('end', () => {
      try {
         console.log("req body:", JSON.parse(data));
         res.writeHead(200, { 'Content-Type': 'text/html' });
         res.write("Response from server");
         res.end();
      }
      catch (err) {
         console.error("caught error:", err)
      }

   })
}).listen(8080);
