var express = require('express');
var router = express.Router();

router.get('/:address', function(req, res, next) {
    res.send(req.params.address);
});

module.exports = router;
