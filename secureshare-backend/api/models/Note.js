const mongoose = require("mongoose");
const noteSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    encryptionKey: { type: String, required: false },
    expiresAt: { type: Date, required: false },
    // isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("note", noteSchema);
