import { AppDataSource } from "../../database/data-source";
import { User } from "./entities/userEntity";
import { CreateUserDTO } from "./dto/createUser.dto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginUserDTO } from "./dto/loginUser.dto";
import { OAuth2Client } from "google-auth-library";
import { DateUtil } from "../../utils/DateUtil";

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
    user.createdAt = DateUtil.nowBD();
    user.updatedAt = DateUtil.nowBD();  
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

  // update user by id
  updateUserById = async (
    id: number,
    userData: Partial<CreateUserDTO>,
  ): Promise<User | null> => {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error("User not found");
    }
    user.updatedAt = DateUtil.nowBD();  
    this.userRepository.merge(user, userData);
    return await this.userRepository.save(user);
  };

  // Google Login
  googleLogin = async (token: string): Promise<User | any> => {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) {
      throw new Error("Invalid Google Token");
    }

    const { email, name, sub: googleId } = payload;

    // Check if user exists
    let user = await this.userRepository.findOneBy({ email });

    if (user) {
      if (!user.googleId) {
        // Link google account if not linked (optional, or just update)
        user.googleId = googleId;
        await this.userRepository.save(user);
      }
    } else {
      // Create new user
      user = this.userRepository.create({
        email,
        name: name || "Google User",
        googleId,
        createdAt: DateUtil.nowBD(),
        updatedAt: DateUtil.nowBD(),  
        password: "", // No password for Google users
      });
      await this.userRepository.save(user);
    }

    return this.createToken({ id: user.id, email: user.email });
  }; 

  // Generate JWT token
  createToken = (user: { id: number; email: string }): string => {
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] },
    );
    return token;
  };
}
