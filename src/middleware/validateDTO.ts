import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";

export function validateDTO<T extends object>(dtoClass: new () => T) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    // Transform plain object to class instance
    const dtoInstance = plainToInstance(dtoClass, req.body);

    // Run validation
    const errors: ValidationError[] = await validate(dtoInstance);

    if (errors.length > 0) {
      const messages = errors.map((error) => ({
        property: error.property,
        constraints: error.constraints,
      }));

      res.status(400).json({
        error: "Validation failed",
        details: messages,
      });
      return;
    }

    req.body = dtoInstance;
    next();
  };
}
