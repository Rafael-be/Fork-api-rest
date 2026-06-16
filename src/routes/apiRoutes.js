const express = require('express');
const router = express.Router();

router.get('/status', (req, res) => {
  res.status(200).json({
    versao: "2.0.0",
    status: "online",
    banco: "MySQL"
  });
});

module.exports = router;