const mongoos = require("mongoose")

const musicSchema = mongoos.Schema({
    title: { type: String, required: true },
  artist: { type: String },  // audio file saved name
  musicUrl: { type: String, required: true },    // e.g. /uploads/music/xxxxx.mp3
   publicId: { type: String },               // cover image saved name
  coverUrl: { type: String },                     // e.g. /uploads/covers/xxxxx.jpg
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoos.model("Music", musicSchema)
