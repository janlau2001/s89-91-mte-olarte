const mongoose = require("mongoose");
const Post = require("../models/Post");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

module.exports.addPost = async (req, res) => {
  try {
    const { _id, id, title, content } = req.body;

    if (_id !== undefined || id !== undefined) {
      return res
        .status(400)
        .send({ error: "Do not pass id in the request body" });
    }

    if (!title || !content) {
      return res.status(400).send({ error: "Title and content are required" });
    }

    const newPost = new Post({ title, content, author: req.user.id });
    const savedPost = await newPost.save();
    await savedPost.populate("author", "username");

    return res.status(201).send(savedPost);
  } catch (err) {
    console.error("Error in adding post:", err);
    return res.status(500).send({ error: "Failed to save the post" });
  }
};

module.exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate("author", "username");
    return res.status(200).send({ posts });
  } catch (err) {
    console.error("Error in fetching posts:", err);
    return res.status(500).send({ error: "Failed to fetch posts" });
  }
};

module.exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).send({ error: "Invalid post ID" });
    }

    const post = await Post.findById(id).populate("author", "username");
    if (!post) {
      return res.status(404).send({ error: "Post not found" });
    }

    return res.status(200).send(post);
  } catch (err) {
    console.error("Error in fetching post:", err);
    return res.status(500).send({ error: "Failed to fetch post" });
  }
};

module.exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id, id: bodyId, title, content } = req.body;

    if (!isValidId(id)) {
      return res.status(400).send({ error: "Invalid post ID" });
    }

    if (_id !== undefined || bodyId !== undefined) {
      return res
        .status(400)
        .send({ error: "Do not pass id in the request body" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).send({ error: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res
        .status(403)
        .send({ error: "You can only update your own posts" });
    }

    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;

    const updatedPost = await post.save();
    await updatedPost.populate("author", "username");

    return res
      .status(200)
      .send({ message: "Post updated successfully", updatedPost });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).send({ error: err.message });
    }
    console.error("Error in updating post:", err);
    return res.status(500).send({ error: "Failed to update post" });
  }
};

module.exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).send({ error: "Invalid post ID" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).send({ error: "Post not found" });
    }

    if (!req.user.isAdmin && post.author.toString() !== req.user.id) {
      return res
        .status(403)
        .send({ error: "You can only delete your own posts" });
    }

    await post.deleteOne();
    return res.status(200).send({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error in deleting post:", err);
    return res.status(500).send({ error: "Failed to delete post" });
  }
};
