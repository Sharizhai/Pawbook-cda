import type {AnimalInformations} from "$types/animalTypes";

export function createAnimalSlice() {
    let informations: AnimalInformations = $state({} as AnimalInformations);
    let animals: AnimalInformations[] = $state([]);

    let hasMore = $state(true);
    let currentPage = $state(1);

    function setHasMore(value: boolean) {
        hasMore = value;
    }

    function setCurrentPage(value: number) {
        currentPage = value;
    }

    return {
        get informations() {
            return informations;
        },
        get animals() {
            return animals;
        },

        setHasMore,
        setCurrentPage,
    }
}