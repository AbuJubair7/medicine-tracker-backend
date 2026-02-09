import jwt from "jsonwebtoken";
import { verifyToken } from "../../middleware/authMiddleware";

describe("verifyToken middleware", () => {
  const buildRes = () => {
    const res: any = {};
    res.locals = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it("returns 401 when no token provided", () => {
    const req: any = { headers: {} };
    const res = buildRes();
    const next = jest.fn();

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "No token provided" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when token is invalid", () => {
    const req: any = { headers: { authorization: "Bearer bad-token" } };
    const res = buildRes();
    const next = jest.fn();

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("sets res.locals.user and calls next when token is valid", () => {
    const token = jwt.sign(
      { id: 1, email: "a@example.com" },
      process.env.JWT_SECRET || "test-secret",
    );
    const req: any = { headers: { authorization: `Bearer ${token}` } };
    const res = buildRes();
    const next = jest.fn();

    verifyToken(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.locals.user).toMatchObject({ id: 1, email: "a@example.com" });
    expect(next).toHaveBeenCalled();
  });
});
