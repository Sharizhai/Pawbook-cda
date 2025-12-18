import {DateHelper} from "$utils/dateUtils.utils";
import {Follow} from "$domain/entities/Follows";

export const UnitFollow = {
    johnModette: new Follow({
        id: "67164a84291bcc737b9a7e2a",
        followerId: "67164a84291bcc737b9a7e3a",
        followingId: "67164a84291bcc737b9a7e3d",
        createdAt: DateHelper.daysAgo(10),
})
};