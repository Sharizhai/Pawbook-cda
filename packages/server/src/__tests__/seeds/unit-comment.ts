import {Comment} from "$domain/entities/Comments";

export const UnitComment = {
    comment1: new Comment({
        id: "550e8400-e29b-41d4-a716-446655441000",
        postId: "550e8400-e29b-41d4-a716-446655440500",
        authorId: "550e8400-e29b-41d4-a716-446655440000",
        textContent: "Super post !",
        updated: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    }),
    comment2: new Comment({
        id: "550e8400-e29b-41d4-a716-446655441100",
        postId: "550e8400-e29b-41d4-a716-446655440500",
        authorId: "550e8400-e29b-41d4-a716-446655440001",
        textContent: "Je suis d'accord",
        updated: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    }),
};