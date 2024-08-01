const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const router = new express.Router();
const multer = require("multer");
const { findOne, findById } = require("../models/task");
const sharp = require("sharp");
const sendWelcomeEmail = require("../utils/resend");

const upload = multer({
  limits: {
    fileSize: 20000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please, upload an image"));
    }
    cb(undefined, true);
  },
});

router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    const token = await user.generateAuthToken();
    await sendWelcomeEmail(user.name, user.email);
    user.save().then(() => {
      res.status(201);
      res.send({ user, token });
    });
  } catch (e) {
    res.status(400);
    res.send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });

    console.log("Logged / ran");
  } catch (e) {
    console.log("Not logged / ran");
    res.status(401).send(e.message);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send("Logged Out");
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send("Logged Out");
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/users/me", auth, (req, res) => {
  res.send(req.user);
});

router.get("/users/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404);
        res.send("Not Found");
      } else {
        res.status(200);
        res.send(user);
      }
    })
    .catch((e) => {
      res.status(500);
      res.send(e);
    });
});

router.patch("/users/me", auth, (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(404).send("Update Not Allowed");
  }

  try {
    User.findById(req.user.id).then((user) => {
      if (!user) {
        return res.status(404).send("Not Found");
      }

      updates.forEach((update) => {
        user[update] = req.body[update];
      });
      user.save().then(() => res.send(user));
    });
  } catch (e) {
    res.status(401).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.deleteOne();
    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("upload"),
  async (req, res) => {
    try {
      const buffer = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();

      req.user.avatar = buffer;

      await req.user.save();
      res.send(req.user);
    } catch (e) {
      res.status(500).send();
    }
  },
  (error, req, res, next) => {
    res.status(405).send({ error: error.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user && !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;
