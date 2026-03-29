import {DateHelper} from "$utils/dateUtils.utils";
import {PostLike} from "$domain/entities/PostLike";

export const UnitPostLike = {
    johnPost1: new PostLike({
        id: "550e8400-e29b-41d4-a716-446655442000",
        authorId: "550e8400-e29b-41d4-a716-446655440000",
        postId: "550e8400-e29b-41d4-a716-446655440100",
        createdAt: DateHelper.daysAgo(10),
    }),
    janePost1: new PostLike({
        id: "550e8400-e29b-41d4-a716-446655442001",
        authorId: "550e8400-e29b-41d4-a716-446655440001",
        postId: "550e8400-e29b-41d4-a716-446655440100",
        createdAt: DateHelper.daysAgo(10),
    }),
};