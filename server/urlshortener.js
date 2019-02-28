const crypto = require('crypto')

const urlshort = {
  short: function(url) {
    let code = crypto
      .createHash('md5')
      .update(url)
      .digest('hex')
    return code
  },
  enhanced: function(url) {
    if (url === '46aaab2081983c4553980869b98d6dd0')
      return 'https://5c7589b20ebb4b7b60ffbeb2--serene-aryabhata-8aefe1.netlify.com/'

    //To do : stuff to query database and find shorted url according to the enhanced one
    // let code = crypto
    //   .createHash('md5')
    //   .update(data)
    //   .digest('hex')
    return data
  },
}

module.exports = urlshort
