const envUtil = require("./envUtil");
const crypto = require("crypto");


const encryptionAlgo = "aes-256-cbc";

module.exports = {
  createCustomKey: function (text) {
    return this.createHash(text);
  },
  encrypt: (text, key) => {
    const iv = crypto.randomBytes(16);
    console.log(iv);
    const cipher = crypto.createCipheriv(
      encryptionAlgo,
      Buffer.from(key, "hex"),
      iv
    );
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + envUtil.getIvAndContentDelimiter() + encrypted;
  },
  decrypt: (text, key) => {
    const textParts = text.split(":");
    const iv = Buffer.from(textParts.shift(), "hex");
    const encryptedText = Buffer.from(
      textParts.join(envUtil.getIvAndContentDelimiter()),
      "hex"
    );
    const decipher = crypto.createDecipheriv(
      encryptionAlgo,
      Buffer.from(key, "hex"),
      iv
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  },
  createHash: function (text) {
    return crypto.createHash("sha256").update(text).digest("hex");
  },
};
