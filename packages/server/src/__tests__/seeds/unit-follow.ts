import {DateHelper} from "$utils/dateUtils.utils";
import {Follow} from "$domain/entities/Follows";

export const UnitFollow = {
    johnModette: new Follow({
        id: "67164a84291bcc737b9a7e2a",
        followerId: "550e8400-e29b-41d4-a716-446655440000",
        followingId: "550e8400-e29b-41d4-a716-446655440003",
        createdAt: DateHelper.daysAgo(10),
    }),
    johnLoly: new Follow({
        id: "67164a84291bcc737b9a7e2b",
        followerId: "550e8400-e29b-41d4-a716-446655440000",
        followingId: "550e8400-e29b-41d4-a716-446655440002",
        createdAt: DateHelper.daysAgo(10),
    }),
};