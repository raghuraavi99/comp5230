const Note = require("../models/Note");
const envUtil = require("../util/envUtil");
const cryptoUtil = require("../util/cryptoUtil");

exports.getNote = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("id", id);
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.expiresAt && note.expiresAt < new Date()) {
      await Note.findByIdAndDelete(req.params.id);
      return res
        .status(410)
        .json({ message: "Note has expired or already been read" });
    }

    console.log(note.content);
    const decryptedContent = cryptoUtil.decrypt(
      note.content,
      note.encryptionKey ?? envUtil.getEncryptionKey()
    );

    if (!note.expiresAt) await Note.findByIdAndDelete(req.params.id);

    res.json({ content: decryptedContent, expiresAt: note.expiresAt });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving note", error: error.message });
  }
};

exports.noteExists = async (req, res) => {
  try {
    const id = req.params.id;
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note exists" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Error retrieving note",
      error: "Something went wrong !!!",
    });
  }
};

exports.createNote = async (req, res) => {
  try {
    const { content, expiresIn, password } = req.body;
    console.log(password);

    if (!content) {
      res.status(400).json({ message: "content is required" });
      return;
    }

    console.log(req.body);
    const key = password
      ? cryptoUtil.createCustomKey(password)
      : envUtil.getEncryptionKey();
    const encryptedContext = cryptoUtil.encrypt(content, key);

    const note = new Note({
      content: encryptedContext,
      expiresAt: expiresIn ? new Date(Date.now() + expiresIn * 60000) : null,
      encryptionKey: password ? key : null,
    });

    const savedNote = await note.save(note);

    res.json({ id: savedNote._id, expiresAt: savedNote.expiresAt });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error retrieving note", error: error.message });
  }
};

exports.forceDeleteNote = async (req, res) => {
  try {
    const id = req.params.id;
    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Note Deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Error deleting note",
      error: "Something went wrong !!!",
    });
  }
};
