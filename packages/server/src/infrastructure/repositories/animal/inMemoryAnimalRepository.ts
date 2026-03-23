import {AnimalFilters, IAnimalRepository} from "$domain/interfaces/repositories/animalRepository.interface";
import {IUserRepository} from "$domain/interfaces/repositories/userRepository.interface";
import {ILikeRepository} from "$domain/interfaces/repositories/likeRepository.interface";
import {Animal, AnimalData} from "$domain/entities/Animals";

export class InMemoryAnimalRepository implements IAnimalRepository
{
    private animals: Animal[] = [];
    private userRepository?: IUserRepository;
    private likeRepository?: ILikeRepository;

    setLikeRepository(repo: ILikeRepository): void {
        this.likeRepository = repo;
    }

    async findAll(): Promise<Animal[]> {
        return Promise.resolve(this.animals);
    }

    async findById(id: string): Promise<Animal | undefined> {
        return Promise.resolve(this.animals.find(animal => animal.id === id));
    }

    async findByOwnerId(ownerId: string, page: number, limit: number): Promise<Animal[]> {
        const filtered = this.animals.filter(animal => animal.ownerId === ownerId);
        const sorted = filtered.sort((a, b) =>
            b.createdAt.getTime() - a.createdAt.getTime()
        );
        const paginated = sorted.slice(page, page + limit);

        return await this.populateAnimals(paginated);
    }

    async save(animal: Animal): Promise<Animal> {
        const index = this.animals.findIndex(a => a.id === animal.id);

        if (index !== -1) {
            this.animals[index] = animal;
        } else {
            this.animals.push(animal);
        }

        return animal;
    }

    async update(id: string, animalData: Partial<AnimalData>): Promise<Animal | null> {
        return Promise.resolve(null);
    }

    async delete(id: string): Promise<boolean> {
        return Promise.resolve(false);
    }

    async findByFilters(filters: AnimalFilters): Promise<Animal[]> {
        return this.animals.filter(a => {
            if (filters.name) {
                return a.name.toLowerCase().includes(filters.name.toLowerCase());
            }
            return true;
        });
    }

    async count(): Promise<number> {
        return Promise.resolve(this.animals.length);
    }

    private async populateAnimals(animals: Animal[]): Promise<Animal[]> {
        if (!this.userRepository) {
            return animals;
        }

        return Promise.all(animals.map(async (animal) => {
            const animalData: any = { ...animal };

            if (typeof animal.ownerId === "string") {
                const owner = await this.userRepository!.findById(animal.ownerId);
                if (owner) {
                    animalData.ownerId = {
                        id: owner.id,
                        name: owner.name,
                        firstName: owner.firstName,
                        profilePicture: owner.profilePicture
                    };
                }
            }

            if (Array.isArray(animal.likes) && animal.likes.length > 0) {
                animalData.likes = await Promise.all(
                    animal.likes.map(async (userId) => {
                        if (typeof userId === "string") {
                            const user = await this.userRepository!.findById(userId);
                            if (user) {
                                return {
                                    id: user.id,
                                    name: user.name,
                                    firstName: user.firstName,
                                    profilePicture: user.profilePicture
                                };
                            }
                        }
                        return userId;
                    })
                );
            }

            return new Animal(animalData as AnimalData);
        }));
    }
}