import {User} from "$domain/entities/Users"
import {DateHelper} from "$utils/dateUtils.utils";

export const UnitUser = {
    john: new User({
        id: "67164a84291bcc737b9a7e3a",
        name: "Doe",
        firstName: "John",
        email: "john.doe@johndoe.com",
        password: "$argon2id$v=19$m=1024,t=4,p=2$Zsd3m9/6awmtUbyNBP92jQ$nvJo/KhXqQvV7SZLgCSc+UmPSU3rSqjmSxrL8fZ7HnA",
        role: "USER",
        posts: ["6717d2f6ef8e529324d93121"],
        animals: [],
        follows: ["671c1864e01d7d5e4dfedd23"],
        followers: ["674239db1a72b373742596b6"],
        createdAt: DateHelper.daysAgo(30),
        updatedAt: DateHelper.hoursAgo(2),
        profileDescription: "",
        profilePicture: "",
        refreshToken: "",
    }),
    jane: new User({
        id: "67164a84291bcc737b9a7e3b",
        name: "Doe",
        firstName: "Jane",
        email: "jane.doe@janedoe.com",
        password: "$argon2id$v=19$m=1024,t=4,p=2$Zsd3m9/6awmtUbyNBP92jQ$nvJo/KhXqQvV7SZLgCSc+UmPSU3rSqjmSxrL8fZ7HnA",
        role: "USER",
        posts: [],
        animals: [],
        follows: [],
        followers: [],
        createdAt: DateHelper.daysAgo(15),
        updatedAt: DateHelper.minutesAgo(30),
        profileDescription: "",
        profilePicture: "",
        refreshToken: "",
    })
}