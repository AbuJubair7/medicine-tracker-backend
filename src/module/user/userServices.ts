import { AppDataSource } from "../../database/data-source";
import { User } from "./userEntity";
import { UserDTO } from "./user.dto";

export default class UserServices {
  private userRepository = AppDataSource.getRepository(User);

  userGreet = (): string => {
    return "Hello this is User";
  };

  // Create a new user
  createUser = async (userData: UserDTO): Promise<User> => {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  };

  // Get all users
  getAllUsers = async (): Promise<User[]> => {
    return await this.userRepository.find();
  };

  // Get user by ID
  getUserById = async (id: number): Promise<User | null> => {
    return await this.userRepository.findOneBy({ id });
  };
}
