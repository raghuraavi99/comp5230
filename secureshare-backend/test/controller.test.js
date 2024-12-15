const request = require("supertest");
const { server, app } = require("../api/index");
const Note = require("../api/models/Note");
const User = require("../api/models/User");
const cryptoUtil = require("../api/util/cryptoUtil");
const authenticationMiddleware = require("../api/middleware/authenticationMiddleware");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

jest.mock("../api/models/Note");
jest.mock("../api/util/cryptoUtil");
jest.mock("../api/middleware/authenticationMiddleware");
jest.mock("../api/models/User");
jest.mock("../api/util/cryptoUtil");
jest.mock("jsonwebtoken");

describe("Express.js Notes API Test Cases", () => {
  // Test cases for getNote
  describe("GET /:id", () => {
    it("should return the note if it exists and is not expired", async () => {
      const mockNote = {
        _id: "noteId",
        content: "encrypted content",
        encryptionKey: "encryptionKey",
        expiresAt: null,
      };

      Note.findById.mockResolvedValue(mockNote);
      cryptoUtil.decrypt.mockReturnValue("decrypted content");

      const res = await request(app).get("/api/notes/noteId");

      expect(res.statusCode).toBe(200);
      expect(res.body.content).toBe("decrypted content");
      expect(Note.findById).toHaveBeenCalledWith("noteId");
    });

    it("should return 404 if the note does not exist", async () => {
      Note.findById.mockResolvedValue(null);

      const res = await request(app).get("/api/notes/noteId");

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Note not found");
    });

    it("should return 410 if the note is expired", async () => {
      const mockNote = {
        _id: "noteId",
        content: "encrypted content",
        expiresAt: new Date(Date.now() - 1000),
      };

      Note.findById.mockResolvedValue(mockNote);

      const res = await request(app).get("/api/notes/noteId");

      expect(res.statusCode).toBe(410);
      expect(res.body.message).toBe("Note has expired or already been read");
    });

    it("should return 500 if there is an error", async () => {
      Note.findById.mockRejectedValue(new Error("Error retrieving note"));

      const res = await request(app).get("/api/notes/noteId");

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("Error retrieving note");
    });
  });

  // Test cases for noteExists
  describe("GET /exists/:id", () => {
    it("should return 200 if the note exists", async () => {
      const mockNote = { _id: "noteId", content: "some content" };
      Note.findById.mockResolvedValue(mockNote);

      const res = await request(app).get("/api/notes/exists/noteId");

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Note exists");
    });

    it("should return 404 if the note does not exist", async () => {
      Note.findById.mockResolvedValue(null);

      const res = await request(app).get("/api/notes/exists/noteId");

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Note not found");
    });

    it("should return 500 if there is an error", async () => {
      Note.findById.mockRejectedValue(new Error("Error retrieving note"));

      const res = await request(app).get("/api/notes/exists/noteId");

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe("Something went wrong !!!");
    });
  });

  // Test cases for createNote
  describe("POST /create", () => {
    beforeEach(() => {
      authenticationMiddleware.mockImplementation((req, res, next) => next());
    });

    it("should create a note and return 200 with the note ID", async () => {
      const mockNote = { _id: "noteId", expiresAt: null };
      Note.prototype.save = jest.fn().mockResolvedValue(mockNote);

      cryptoUtil.createCustomKey = jest.fn().mockReturnValue("customKey");
      cryptoUtil.encrypt = jest.fn().mockReturnValue("encryptedContent");

      const newNote = {
        content: "Test content",
        expiresIn: 5,
        password: "123456",
      };

      const res = await request(app).post("/api/notes/create").send(newNote);

      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe("noteId");
      expect(Note.prototype.save).toHaveBeenCalled();
    });

    it("should return 400 if content is missing", async () => {
      const res = await request(app).post("/api/notes/create").send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("content is required");
    });

    it("should return 500 if there is an error", async () => {
      Note.prototype.save = jest
        .fn()
        .mockRejectedValue(new Error("Error creating note"));

      const newNote = {
        content: "Test content",
        expiresIn: 5,
        password: "123456",
      };

      const res = await request(app).post("/api/notes/create").send(newNote);

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("Error retrieving note");
    });
  });

  // Test cases for forceDeleteNote
  describe("DELETE /:id", () => {
    it("should delete the note and return 200", async () => {
      Note.findByIdAndDelete = jest.fn().mockResolvedValue({});

      const res = await request(app).delete("/api/notes/noteId");

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Note Deleted");
    });

    it("should return 500 if there is an error", async () => {
      Note.findByIdAndDelete = jest
        .fn()
        .mockRejectedValue(new Error("Error deleting note"));

      const res = await request(app).delete("/api/notes/noteId");

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe("Something went wrong !!!");
    });
  });
});

describe("User Registration and Login API Test Cases", () => {
  describe("POST /api/auth/register", () => {
    it("should register a user successfully", async () => {
      User.findOne.mockResolvedValue(null); // No existing user
      cryptoUtil.createHash.mockReturnValue("hashedPassword");
      User.prototype.save.mockResolvedValue({});

      const newUser = {
        name: "John Doe",
        username: "johndoe",
        password: "password123",
      };
      const res = await request(app).post("/api/auth/register").send(newUser);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Registered successfully ");
      expect(User.findOne).toHaveBeenCalledWith({ username: "johndoe" });
      expect(User.prototype.save).toHaveBeenCalled();
    });

    it("should return 400 if name, username, or password is missing", async () => {
      const res = await request(app).post("/api/auth/register").send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe(
        "Name, Username and Password are required to register !"
      );
    });

    it("should return 400 if the username is already in use", async () => {
      User.findOne.mockResolvedValue({ username: "johndoe" });

      const newUser = {
        name: "John Doe",
        username: "johndoe",
        password: "password123",
      };
      const res = await request(app).post("/api/auth/register").send(newUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe(
        "This email is already in use, please use a different one !"
      );
    });

    it("should return 500 if there is a server error", async () => {
      User.findOne.mockRejectedValue(new Error("Server error"));

      const newUser = {
        name: "John Doe",
        username: "johndoe",
        password: "password123",
      };
      const res = await request(app).post("/api/auth/register").send(newUser);

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe(
        "Something went wrong in registering you, please try again !"
      );
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login the user successfully and return a token", async () => {
      const mockUser = {
        _id: "userId",
        username: "johndoe",
        password: "hashedPassword",
        name: "John Doe",
      };

      User.findOne.mockResolvedValue(mockUser);
      cryptoUtil.createHash.mockReturnValue("hashedPassword");
      jwt.sign.mockReturnValue("mockToken");

      const loginData = { username: "johndoe", password: "password123" };
      const res = await request(app).post("/api/auth/login").send(loginData);

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBe("mockToken");
      expect(res.body.name).toBe("John Doe");
      expect(User.findOne).toHaveBeenCalledWith({ username: "johndoe" });
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser._id, username: mockUser.username },
        expect.any(String), // JWT secret
        { expiresIn: "1h" }
      );
    });

    it("should return 400 if the username or password is incorrect", async () => {
      User.findOne.mockResolvedValue(null); // User not found

      const loginData = { username: "johndoe", password: "password123" };
      const res = await request(app).post("/api/auth/login").send(loginData);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Invalid username or password");
    });

    it("should return 400 if the password is incorrect", async () => {
      const mockUser = { username: "johndoe", password: "hashedPassword" };
      User.findOne.mockResolvedValue(mockUser);
      cryptoUtil.createHash.mockReturnValue("wrongHashedPassword");

      const loginData = { username: "johndoe", password: "wrongpassword" };
      const res = await request(app).post("/api/auth/login").send(loginData);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Invalid username or password");
    });

    it("should return 500 if there is a server error", async () => {
      User.findOne.mockRejectedValue(new Error("Server error"));

      const loginData = { username: "johndoe", password: "password123" };
      const res = await request(app).post("/api/auth/login").send(loginData);

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("Internal server error");
    });
  });
});

afterAll(async () => {
  // Cleanup code here
  mongoose.connection
    .close()
    .then(() => console.log("Closed mongoose"))
    .catch(() => {}); // Close MongoDB connection
  await server.close(); // Close the server
});
