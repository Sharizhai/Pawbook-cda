import {PostReport} from "$domain/entities/PostReports";

export const unitPostReport = {
    postreport1: new PostReport({
        id: "550e8400-e29b-41d4-a716-446655441000",
        postId: "550e8400-e29b-41d4-a716-446655440100",
        reporterId: "550e8400-e29b-41d4-a716-446655440000",
        reason: "SPAM",
        description: "This post is spam and should be removed",
        createdAt: new Date(),}),
    postreport2: new PostReport({
        id: "550e8400-e29b-41d4-a716-446655442000",
        postId: "550e8400-e29b-41d4-a716-446655440200",
        reporterId: "550e8400-e29b-41d4-a716-446655440001",
        reason: "SPAM",
        description: "This post is spam and should be removed",
        createdAt: new Date(),}),
    postreport3: new PostReport({
        id: "550e8400-e29b-41d4-a716-446655443000",
        postId: "550e8400-e29b-41d4-a716-446655440300",
        reporterId: "550e8400-e29b-41d4-a716-446655440001",
        reason: "SPAM",
        description: "This post is spam and should be removed",
        createdAt: new Date(),}),
    postreport4: new PostReport({
        id: "550e8400-e29b-41d4-a716-446655444000",
        postId: "550e8400-e29b-41d4-a716-446655440400",
        reporterId: "550e8400-e29b-41d4-a716-446655440001",
        reason: "ANIMAL_ABUSE",
        description: "So much cruelty !",
        createdAt: new Date(),}),
    postreport5: new PostReport({
        id: "550e8400-e29b-41d4-a716-446655445000",
        postId: "550e8400-e29b-41d4-a716-446655440500",
        reporterId: "550e8400-e29b-41d4-a716-446655440001",
        reason: "SPAM",
        description: "This post is spam and should be removed",
        createdAt: new Date(),}),
}