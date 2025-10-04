import {Comment} from "$domain/entities/Comments";

export const UnitComment = {
    comment1: new Comment({
        id: "comment-1",
        postId: "post-5",
        authorId: "67164a84291bcc737b9a7e3a",
        textContent: "Super post !",
        updated: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    }),
    comment2: new Comment({
        id: "comment-2",
        postId: "post-5",
        authorId: "67164a84291bcc737b9a7e3b",
        textContent: "Je suis d'accord",
        updated: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    }),
};