import {AnimalFilters, IAnimalRepository} from "$domain/interfaces/repositories/animalRepository.interface";
import {Animal, AnimalData} from "$domain/entities/Animals";
import {PrismaClient} from "@prisma/client";

export class PostgresAnimalRepository implements IAnimalRepository{
    constructor(private prisma: PrismaClient) {}

    async findAll(): Promise<Animal[]> {
        const animals = await this.prisma.animal.findMany({
            include: {owner: true}
        });

        return animals.map(animal => this.toDomain(animal));
    }

    async findById(id: string): Promise<Animal | null> {
        const animal = await this.prisma.animal.findUnique({
            where: { id },
            include: {
                likes: { select: { id: true } }
            }
        });

        return animal ? this.toDomain(animal) : null;
    }

    async findByOwnerId(ownerId: string, page: number, limit: number): Promise<Animal[]> {
        const animals = await this.prisma.animal.findMany({
            where: { ownerId },
            include: {
                likes: { select: { id: true } }
            },
            orderBy: {
                createdAt: "desc"
            },
            skip: page * limit,
            take: limit
        });

        return animals.map(animal => this.toDomain(animal));
    }

    async save(animal: Animal): Promise<Animal> {
        // Upsert = create or update
        const saved = await this.prisma.animal.upsert({
            where: { id: animal.id },
            create: {
                id: animal.id,
                ownerId: animal.ownerId,
                name: animal.name,
                type: animal.type,
                race: animal.race,
                age: animal.age,
                picture: animal.picture,
                description: animal.description,
                createdAt: animal.createdAt,
            },
            update: {
                name: animal.name,
                type: animal.type,
                race: animal.race,
                age: animal.age,
                picture: animal.picture,
                description: animal.description,
                updatedAt: new Date()
            },
            include: {
                likes: { select: { id: true } }
            }
        });

        return this.toDomain(saved);
    }

    async update(id: string, updates: Partial<AnimalData>): Promise<Animal | null> {
        try {
            // Exclut les champs de relation (gérés par Prisma automatiquement)
            const { likes, ...updateData } = updates;

            const updated = await this.prisma.animal.update({
                where: { id },
                data: {
                    ...updateData,
                    updatedAt: new Date()
                },
                include: {
                    likes: { select: { id: true } }
                }
            });

            return this.toDomain(updated);
        } catch (error) {
            return null;
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await this.prisma.animal.delete({
                where: { id }
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async findByFilters(filters: AnimalFilters): Promise<Animal[]> {
        const where: any = {};

        if (filters.name) {
            where.name = { contains: filters.name, mode: 'insensitive' };
        }

        const animals = await this.prisma.animal.findMany({
            where,
            include: {
                likes: { select: { id: true } }
            }
        });

        return animals.map(animal => this.toDomain(animal));
    }

    async count(): Promise<number> {
        return await this.prisma.animal.count();
    }

    /**
     * Convertit un animal Prisma en entité Animal du domaine
     */
    private toDomain(prismaAnimal: any): Animal {
        return new Animal({
            id: prismaAnimal.id,
            ownerId: prismaAnimal.ownerId,
            name: prismaAnimal.name,
            type: prismaAnimal.type,
            race: prismaAnimal.race,
            age: prismaAnimal.age,
            picture: prismaAnimal.picture ?? undefined,
            description: prismaAnimal.description ?? undefined,
            likes: prismaAnimal.likes?.map((l: any) => l.id) || [],
            createdAt: prismaAnimal.createdAt,
            updatedAt: prismaAnimal.updatedAt
        });
    }
}