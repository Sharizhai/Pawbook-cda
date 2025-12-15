import {Animal} from "$domain/entities/Animals";
import {DateHelper} from "$utils/dateUtils.utils";

export const UnitAnimal = {
    puppy: new Animal({
        id: "67164a84291bcc737b9a7e4a",
        ownerId: "67164a84291bcc737b9a7e3a",
        name: "Puppy",
        type: "Dog",
        race: "Labrador",
        age: 1,
        picture: "",
        description:"",
        likes: [],
        createdAt: DateHelper.daysAgo(15),
        updatedAt: new Date(),
    }),
}