import {Container} from "$types/container";

export interface IFixture {
    load(container: Container): Promise<void>
}