const express = require("express");
const router = express.Router();
const { getapi, redir } = require("../controller/api");

router.get('/get', getapi);

router.get('/redir', redir);

module.exports = router;