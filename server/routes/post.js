const express = require("express");
const postController = require("../controllers/post");
const { verify } = require("../auth");

const router = express.Router();

router.get("/getPosts", postController.getAllPosts);
router.get("/getPost/:id", postController.getPostById);

router.post("/addPost", verify, postController.addPost);
router.patch("/updatePost/:id", verify, postController.updatePost);
router.delete("/deletePost/:id", verify, postController.deletePost);

module.exports = router;
