import "reflect-metadata";

// Provide deterministic defaults for tests.
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
process.env.TZ = process.env.TZ || "UTC";
