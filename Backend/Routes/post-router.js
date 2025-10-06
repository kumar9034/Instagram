const express = require("express")
const isloggedIn = require("../config/isloggedin")
const postmodel = require("../model/post")
const upload = require("../config/multer")
const userModel = require("../model/User")

const router = express.Router()

router.post("/create", isloggedIn, async (req, res) => {
  const userid = req.user.id

  if (!userid) {
    return res.status(400).json({ "message": "user not logged " })
  }

  const { caption, image } = req.body;
  const newPost = await postmodel.create({
    user: userid,      // make sure your schema has a 'user' field
    caption,
    image
  });

  await userModel.findByIdAndUpdate(
    userid,
    { $push: { posts: newPost._id } }, // assuming user schema has 'posts' array
    { new: true }
  )

  res.status(200).json({ "message": "Users successfully post", newPost })

})


router.post("/image", upload.single("cover"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const image = req.file.path; // Cloudinary URL or local path


    res.status(200).json({
      message: "Image uploaded successfully",
      path: image
    });
  } catch (err) {
    console.error("Image upload error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/posts", isloggedIn, async (req, res) => {
  const userid = req.user.id

  if (!userid) {
    return res.status(400).json({ "message": "please logged in" })
  }

  const posts = await postmodel.find({ user: userid }).populate("user", "username email");

  res.status(200).json({ success: true, posts })
})

router.get("/allpost", isloggedIn, async (req, res) => {
  const userid = req.user.id
  if (userid) {
    try {
      const posts = await postmodel
        .find()
        .populate("user", "username profile.image") // populate user info (username + profile image)
        .sort({ createdAt: -1 }); // optional: latest first

      res.status(200).json({ message: "All posts fetched successfully", posts });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Something went wrong", error: err.message });

    }
  }
});

router.post("/:id/likes", isloggedIn, async (req, res) => {
  const userid = req.user.id;
  const postid = req.params.id;

  if (!userid || !postid) {
    return res.status(404).json({ message: "please logged in" });
  }

  const post = await postmodel.findById(postid);
  if (!post) return res.status(404).json({ message: "Post not found" });

  let liked = false;

  if (post.likes.includes(userid)) {
    // unlike
    post.likes = post.likes.filter(id => id.toString() !== userid);
    liked = false;
    await post.save();
  } else {
    // like
    post.likes.push(userid);
    liked = true;
    await post.save();
  }

  return res.json({
    message: liked ? "Post liked" : "Post unliked",
    likes: post.likes,   // return full array instead of just number
    liked
  });
});




module.exports = router


