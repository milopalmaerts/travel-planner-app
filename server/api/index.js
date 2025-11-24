const app = require('../index.js');

module.exports = async (req, res) => {
  // Pass the request to the Express app
  return app(req, res);
};