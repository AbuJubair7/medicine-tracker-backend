import { AppDataSource } from "../../database/data-source";
import { User } from "./entities/userEntity";
import { CreateUserDTO } from "./dto/createUser.dto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginUserDTO } from "./dto/loginUser.dto";

export default class UserServices {
  constructor(
    private readonly userRepository = AppDataSource.getRepository(User),
  ) {}

  userGreet = (): string => {
    return "User page";
  };

  // Create a new user
  createUser = async (userData: CreateUserDTO): Promise<User | any> => {
    const duplicateUser = await this.userRepository.findOneBy({
      email: userData.email,
    });
    if (duplicateUser) {
      throw new Error("Email already in use");
    }
    userData.password = await bcrypt.hash(userData.password, 10);
    const user = this.userRepository.create(userData);
    await this.userRepository.save(user);
    return this.createToken({ id: user.id, email: user.email });
  };

  // Get all users
  getAllUsers = async (): Promise<User[] | null> => {
    return await this.userRepository.find();
  };

  // Get user by ID
  getUserById = async (id: number): Promise<User | null> => {
    return await this.userRepository.findOneBy({ id });
  };

  // User login
  loginUser = async (userData: LoginUserDTO): Promise<User | any> => {
    const user = await this.userRepository.findOneBy({ email: userData.email });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isValid = await bcrypt.compare(userData.password, user.password);
    if (!isValid) {
      throw new Error("Invalid email or password");
    }
    return this.createToken({ id: user.id, email: user.email });
  };

  createToken = (user: { id: number; email: string }): string => {
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] },
    );
    return token;
  };
}
