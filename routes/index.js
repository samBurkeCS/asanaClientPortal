var express = require('express');
var router = express.Router();

const asanaController = require("../controllers/asanaController")

/* GET home page. */
router.get('/', asanaController.home);
router.post('/createTask', asanaController.createTask);
router.post('/updateTask', asanaController.updateTask);
router.post('/addComment', asanaController.addComment);

module.exports = router;
