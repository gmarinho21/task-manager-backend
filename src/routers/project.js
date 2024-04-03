const express = require("express");
const Project = require("../models/project");
const router = new express.Router();
const auth = require("../middleware/auth");

router.post("/projects", auth, async (req, res) => {
  const project = new Project({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await project.save();
    res.status(201).send(project);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/projects", auth, async (req, res) => {
  const match = { owner: req.user._id };
  const sort = {};

  try {
    const projects = await Project.find(match, null, {
      limit: req.query.limit,
      skip: req.query.skip,
      sort,
    });
    if (!projects) {
      return res.status(404).send();
    }
    res.status(200).send(projects);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
