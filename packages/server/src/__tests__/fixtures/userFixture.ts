import {User} from "$domain/entities/Users";
import {IFixture} from "./fixture.interface";
import {Container} from "$types/container";

export class UserFixture implements IFixture {
    constructor(public entity: User) {}

    async load(container: Container): Promise<void> {
        const repository = container.resolve("userRepository");
        await repository.save(this.entity)
    }
}