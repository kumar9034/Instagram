const express = require("express")
const Usermodel = require("../model/User")
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")
const otpStore  = require("../config/otp")
const jwt = require("jsonwebtoken")
const isloggedIn = require("../config/isloggedin")
const Upload = require("../config/multer")
const postModel = require("../model/post")


const router = express.Router()
let blacklist = [];

router.post("/", async (req, res )=>{
 try{
    const {fullname, email, password, username} = req.body

 const hashedPassword = await bcrypt.hash(password, 10)

     const user =  await Usermodel.create({
        fullname,
        email,
        password: hashedPassword,
        username
     })

     res.status(200).json({"message": "Users successfully sign up"})

 }catch(error){
    console.error("somethig want wrong! ", error);
    
 }
 

})
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
router.post("/send-otp",async (req, res)=>{
  
const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const otp = generateOTP();

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Mail options
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    otpStore[email] = otp;

    res.status(200).json({ message: "OTP sent successfully", }); // normally OTP ko client me na bheje
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send OTP" });
  }


})
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP required" });
  }

  const storedOtp = otpStore[email];

  if (!storedOtp) {
    return res.status(400).json({ error: "OTP expired or not found" });
  }

  if (String(storedOtp) === String(otp)) {
    delete otpStore[email]; // One-time use
    return res.status(200).json({ message: "OTP verified successfully", otp });
  } else {
    return res.status(400).json({ error: "Invalid OTP" });
  }
});

router.post("/login", async (req, res)=>{
 const {identifier, password } = req.body

 if(!identifier || !password){
  return res.status(400).json({ error: "Username/Email and password required" });
 }

 const isEmail = identifier.includes("@")

 const user = isEmail ? await Usermodel.findOne({email: identifier}) : await Usermodel.findOne({username: identifier})
 
 if(!user){
  return  res.status(400).json({ error: "User not found" });
 }
 const isMatch = await bcrypt.compare(password, user.password)

 if(!isMatch){
  return res.status(400).json({ error: "Invalid password" });
 }

 const token = jwt.sign({
  id: user.id,
  email: user.email
 },
 process.env.JWT_SECRET,
 {expiresIn: "24h"}
);
res.status(200).json({
      message: "Login successful",
      token,
    });
})

// router.post("/followers", )

router.post("/logout", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(400).json({ message: "No token provided" });

  blacklist.push(token); // add token to blacklist
  res.status(200).json({ message: "Logged out successfully" });
});

router.put( "/profile", isloggedIn, Upload.single("cover"),  async (req, res) => {
    try {
      const userId = req.user._id;
      if (!userId) {
        return res.status(400).json({ message: "User not logged in" });
      }

      const { bio } = req.body;

      // image multer/cloudinary se
      const image = req.file ? req.file.path : undefined;

      const updatedUser = await Usermodel.findByIdAndUpdate(
        userId,
        {
          $set: {
            "profile.bio": bio,
            ...(image && { "profile.image": image }), // agar image bheji gayi ho to hi update ho
          },
        },
        { new: true }
      );

      res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
);
router.get("/profiledetail", isloggedIn, async(req, res)=>{
  const userId = req.user._id;
  if(!userId){
    return res.status(400).json({ message: "User not logged in" });
  }

  const user = await Usermodel.findById(userId).select("-password",)
  res.status(200).json({ user })
})

router.post("/:id/follower", isloggedIn, async (req, res) => {
  const userid = req.user.id;         // logged in user
  const followerid = req.params.id;   // jis user ko follow karna hai

  if (!userid) {
    return res.status(401).json({ message: "Please log in" });
  }

  if (userid === followerid) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  try {
    const user = await Usermodel.findById(followerid);
    const currentuser = await Usermodel.findById(userid);

    if (!user || !currentuser) {
      return res.status(404).json({ message: "User not found" });
    }

    let following = false;

    if (user.followers.includes(userid)) {
      // unfollow
      user.followers = user.followers.filter(id => id.toString() !== userid);
      currentuser.following = currentuser.following.filter(id => id.toString() !== followerid);
      following = false;
    } else {
      // follow
      user.followers.push(userid);
      currentuser.following.push(followerid);
      following = true;
    }

    await user.save();
    await currentuser.save();

    return res.json({
      message: following ? "User followed" : "User unfollowed",
      following,
      followersCount: user.followers.length,
      followingCount: currentuser.following.length
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id/userprofile", isloggedIn, async (req, res) => {
  const userid = req.user.id;
  const id = req.params.id;

  if (!userid) {
    return res.status(404).json({ message: "please logged in" });
  }

  try {
    const user = await Usermodel.findById(id)
      .select("-password")
      .populate("followers", "username profile.image")
      .populate("following", "username profile.image");

       const posts = await postModel.find({ user: id })
      .populate("user", "username profile.image")
      .populate("likes", "username profile.image")
      .populate("comments.user", "username profile.image")
      .sort({ createdAt: -1 });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if(!posts){
       return res.status(404).json({ message: "posts not found" });
    }

    return res.json({user, posts} );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/friendschats", isloggedIn, async (req, res) => {
  try {
    const userid = req.user.id;

    if (!userid) {
      return res.status(404).json({ message: "please logged in" });
    }

    const detail = await Usermodel.findById(userid)
      .select("fullname username profile followers following") // ✅ sab fields select karo
      .populate("followers", "fullname username profile.image")
      .populate("following", "fullname username profile.image");

    if (!detail) {
      return res.status(401).json({ message: "user not found" });
    }

    // followers + following merge
    const friends = [...detail.followers, ...detail.following];

    res.status(200).json({
      user: {
        id : detail.id,
        fullname: detail.fullname,
        username: detail.username,
        avatar: detail.profile?.image || null,
      },
      friends: friends.map(friend => ({
        id: friend._id,
        fullname: friend.fullname,
        username: friend.username,
        avatar: friend.profile?.image || null
      }))
    });
  } catch (err) {
    res.status(500).json({ message: "server error", error: err.message });
  }
});





module.exports = router