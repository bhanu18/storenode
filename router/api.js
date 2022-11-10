const express = require("express");
const router = express.Router();
const { getapi, redir, view } = require("../controller/api");

router.get('/get', getapi);

router.get('/redir', redir);

router.get('/view', view);

module.exports = router;