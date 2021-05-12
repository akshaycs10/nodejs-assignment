const axios = require('axios')
axios
   .post('http://localhost:8080/convoso', {
      todo: 'convoso req data'
   })
   .then(res => {
      console.log(`Server response, statusCode: ${res.status} data: ${res.data}`)
   })
   .catch(error => {
      console.error(error)
   })