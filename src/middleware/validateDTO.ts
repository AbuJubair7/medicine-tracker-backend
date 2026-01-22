import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

export const validateDTO = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // 1. Transform JSON to Class
    const dtoInstance = plainToInstance(dtoClass, req.body);

    // 2. Validate (whitelist removes extra fields not in DTO)
    const errors = await validate(dtoInstance, { whitelist: true });

    // 3. Handle Errors
    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors.map((e) => ({
          field: e.property,
          issues: e.constraints,
        })),
      });
    }

    // 4. Success - replace body with cleaned DTO
    req.body = dtoInstance;
    next();
  };
};
