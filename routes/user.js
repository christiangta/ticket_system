const router = require("express").Router();
const { auth } = require("./jwtVerification");
const User = require("../model/User");
const bcrypt = require('bcryptjs')
const { ticketValidation } = require("../validation");

router.post("/update/scopes", auth, async (req, res) => {
  if (!req.user.scopes.admin) return res.status(403).send("Unauthorized");
  if (!req.body.scopes) return res.status(400).send("Missing params");
  const user = await User.updateOne(
    { email: req.user.email },
    { scopes: req.body.scopes },
    (err, updated) => {
      if (err) return res.status(404).send("user not found");
      res.status(300).send(updated);
    }
  );
});

router.post("/update/password", auth, async (req, res) => {
  if (!req.user.scopes.includes("admin"))
    return res.status(403).send("Unauthorized");
  if (!req.body.password) return res.status(400).send("missing params");
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = await User.updateOne(
    { email: req.body.email },
    { password: hashedPassword },
    (err, updated) => {
      if (err) return res.status(404).send("user not found");
      res.status(300).send(updated);
    }
  );
});

module.exports = router;