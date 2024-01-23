import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UpdateUserDto } from "src/users/dto/update-user.dto";
import { User } from "src/users/entities/user.entity";

export interface IUserRepository {
    createUser(user: CreateUserDto): Promise<User>;
    SignIn(user: CreateUserDto): Promise<User>;
    userFindId(userId: string): Promise<User>;
    findAlluser(): Promise<User[]>;
    userBlock_and_unblock(id: string, userdata: UpdateUserDto): Promise<User>;
    userDetails(id: string): Promise<User>;
    verified(id: string): Promise<User>;
    loadWallet(id: string): Promise<User>;
    userData(user: string): Promise<User>;
    updateName(user: string, name: string): Promise<User>;

}