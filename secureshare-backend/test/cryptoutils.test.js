const cryptoUtil = require("../api/util/cryptoUtil");
const envUtil = require("../api/util/envUtil");

jest.mock("../api/util/envUtil");

describe("Crypto Utility Functions", () => {
  const mockKey =
    "6b8b4567d4a4357b4c2e3a0b6e9d45f3e8b3c7e9f1b2a2c2d9b7e6b8b6f9e2f5";
  const textToEncrypt = "Hello, World!";
  const delimiter = ":";

  beforeEach(() => {
    envUtil.getIvAndContentDelimiter.mockReturnValue(delimiter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createCustomKey", () => {
    it("should create a hash from the input text", () => {
      const inputText = "some text";
      const hash = cryptoUtil.createCustomKey(inputText);
      expect(hash).toEqual(cryptoUtil.createHash(inputText));
    });
  });

  describe("encrypt", () => {
    it("should encrypt text correctly", () => {
      const encrypted = cryptoUtil.encrypt(textToEncrypt, mockKey);
      expect(encrypted).toContain(delimiter); // Check if it contains the delimiter
      expect(encrypted.length).toBeGreaterThan(0); // Check if something was returned
    });

    it("should return a string with iv and encrypted content", () => {
      const encrypted = cryptoUtil.encrypt(textToEncrypt, mockKey);
      const parts = encrypted.split(delimiter);
      expect(parts.length).toBe(2); // Should have iv and encrypted content
      expect(parts[0]).toHaveLength(32); // Length of IV in hex (16 bytes = 32 hex characters)
    });
  });

  describe("decrypt", () => {
    it("should decrypt text correctly", () => {
      const encrypted = cryptoUtil.encrypt(textToEncrypt, mockKey);
      const decrypted = cryptoUtil.decrypt(encrypted, mockKey);
      expect(decrypted).toBe(textToEncrypt); // Decrypted text should match original
    });

    it("should throw an error if the input is invalid", () => {
      const invalidInput = "invalid:encrypted:string";
      expect(() => {
        cryptoUtil.decrypt(invalidInput, mockKey);
      }).toThrow(); // Expect it to throw an error on invalid decryption
    });
  });

  describe("createHash", () => {
    it("should create a SHA-256 hash from the input text", () => {
      const inputText = "some text";
      const hash = cryptoUtil.createHash(inputText);
      expect(hash).toHaveLength(64); // SHA-256 hash length in hex
      expect(hash).toMatch(/^[0-9a-fA-F]+$/); // Check if it's a valid hex string
    });
  });
});
