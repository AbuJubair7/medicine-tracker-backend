import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserServices from "../../modules/user/userServices";


describe("UserServices", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("throws when email is already in use", async () => {
    const repo: any = {
      findOneBy: jest.fn().mockResolvedValue({ id: 1 }),
    };
    const services = new UserServices(repo);

    await expect(
      services.createUser({
        name: "A",
        email: "a@example.com",
        password: "secret1",
      }),
    ).rejects.toThrow("Email already in use");
  });

  it("hashes password and returns a JWT on createUser", async () => {
    const fixedDate = new Date("2024-02-09T10:00:00Z");
    jest.useFakeTimers().setSystemTime(fixedDate);
    jest.spyOn(bcrypt, "hash").mockResolvedValue("hashed" as never);

    const repo: any = {
      findOneBy: jest.fn().mockResolvedValue(null),
      create: jest.fn((data: any) => ({ ...data })),
      save: jest.fn(async (user: any) => {
        user.id = 7;
        return user;
      }),
    };

    const services = new UserServices(repo);
    const token = await services.createUser({
      name: "A",
      email: "a@example.com",
      password: "secret1",
    });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "test-secret",
    ) as jwt.JwtPayload;

    expect(decoded).toMatchObject({ id: 7, email: "a@example.com" });
    expect(repo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        createdAt: fixedDate,
        updatedAt: fixedDate,
        password: "hashed",
      }),
    );
  });

  it("throws when login credentials are invalid", async () => {
    const repo: any = {
      findOneBy: jest.fn().mockResolvedValue(null),
    };
    const services = new UserServices(repo);

    await expect(
      services.loginUser({ email: "a@example.com", password: "secret1" }),
    ).rejects.toThrow("Invalid email or password");
  });

  it("returns token when login credentials are valid", async () => {
    const repo: any = {
      findOneBy: jest.fn().mockResolvedValue({
        id: 11,
        email: "a@example.com",
        password: "hashed",
      }),
    };
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);

    const services = new UserServices(repo);
    const token = await services.loginUser({
      email: "a@example.com",
      password: "secret1",
    });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "test-secret",
    ) as jwt.JwtPayload;
    expect(decoded).toMatchObject({ id: 11, email: "a@example.com" });
  });
});
