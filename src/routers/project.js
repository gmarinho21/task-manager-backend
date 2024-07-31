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
      console.log("Nenhum Projeto encontrado");
      return res.status(404).send();
    }
    res.status(200).send(projects);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/projects/:id", auth, async (req, res) => {
  try {
    const projects = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!projects) {
      return res.status(404).send();
    }
    res.status(200).send(projects);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/projects/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "name"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(404).send("Update Not Allowed");
  }
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).send();
    }
    updates.forEach((update) => (project[update] = req.body[update]));

    await project.save();
    res.send(project);
  } catch (e) {
    res.status(401).send(e);
  }
});

module.exports = router;
