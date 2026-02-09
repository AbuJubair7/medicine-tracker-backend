import { validateDTO } from "../../middleware/validateDTO";
import { CreateUserDTO } from "../../modules/user/dto/createUser.dto";

describe("validateDTO middleware", () => {
  const buildRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it("returns 400 when payload is invalid", async () => {
    const req: any = { body: { name: "A" } };
    const res = buildRes();
    const next = jest.fn();

    const middleware = validateDTO(CreateUserDTO);
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "Validation failed" }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next and strips extra fields when payload is valid", async () => {
    const req: any = {
      body: {
        name: "A",
        email: "a@example.com",
        password: "secret1",
        extra: "remove-me",
      },
    };
    const res = buildRes();
    const next = jest.fn();

    const middleware = validateDTO(CreateUserDTO);
    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.body).toMatchObject({
      name: "A",
      email: "a@example.com",
      password: "secret1",
    });
    expect((req.body as any).extra).toBeUndefined();
  });
});
