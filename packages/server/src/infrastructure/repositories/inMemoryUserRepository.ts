import {IUserRepository, UserFilters} from "$domain/interfaces/userRepository.interface";
import {User, UserData} from "$domain/entities/Users";

export class InMemoryUserRepository implements IUserRepository {
    private users: User[] = [];

    findAll(): Promise<User[]> {
        return Promise.resolve(this.users);
    }

    findById(id: string): Promise<User | null> {
        return Promise.resolve(this.users.find(user => user.id === id) || null);
    }

    findByEmail(email: string): Promise<User | null> {
        return Promise.resolve(this.users.find(user => user.email === email) || null);
    }

    emailExists(email: string, excludeId?: string): Promise<boolean> {
        return Promise.resolve(this.users.some(user => user.email === email && user.id !== excludeId));
    }

    save(userData: UserData): Promise<User> {
        const user = new User(userData);

        this.users.push(user);

        return Promise.resolve(user);
    }

    update(id: string, userData: Partial<UserData>): Promise<User | null> {
        return Promise.resolve(null);
    }

    delete(id: string): Promise<boolean> {
        return Promise.resolve(false);
    }

    findByFilters(filters: UserFilters): Promise<User[]> {
        return Promise.resolve([]);
    }

    findFollowers(userId: string): Promise<User[]> {
        return Promise.resolve([]);
    }

    findFollowing(userId: string): Promise<User[]> {
        return Promise.resolve([]);
    }

    searchByName(query: string): Promise<User[]> {
        return Promise.resolve([]);
    }

    count(): Promise<number> {
        return Promise.resolve(this.users.length);
    }
}
