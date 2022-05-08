var express = require('express');
var router = express.Router();

/* GET request */
router.get('/', function(req, res, next) {
  res.send("Send users Github or Gitlab repo details");
});

//Router is exported
module.exports = router;
