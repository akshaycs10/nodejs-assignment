//child process to push a json data to remote(in this case: localhost) server
const axios = require('axios')
axios
   .post('http://localhost:8080/convoso', {
      todo: 'convoso req data'
   })
   .then(res => {
      console.log(`child-process response rcvd, statusCode: ${res.status} data: ${res.data}`)
   })
   .catch(error => {
      console.error(error)
   })