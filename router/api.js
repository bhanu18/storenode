const express = require("express");
const router = express.Router();
const { getapi, redir, view } = require("../controller/api");
const { postData } = require("../controller/post");

router.get('/get', getapi);

router.get('/redir', redir);

router.get('/view', view);

router.get('/post', postData);

module.exports = router;