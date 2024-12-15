// authMiddleware.test.js
const express = require("express");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../api/middleware/authenticationMiddleware");
const envUtil = require("../api/util/envUtil");

jest.mock("jsonwebtoken");
jest.mock("../api/util/envUtil");

describe("Auth Middleware", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    app.get("/protected", authMiddleware, (req, res) => {
      res.status(200).json({ message: "Protected data" });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if no token is provided", async () => {
    const response = await request(app).get("/protected");
    expect(response.status).toBe(401);
  });

  it("should call next() if token is valid", async () => {
    envUtil.getJwtSecret.mockReturnValue("secret");
    const validToken = jwt.sign({ id: "testUser" }, "secret");

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { id: "testUser" });
    });

    const response = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Protected data" });
  });
});
