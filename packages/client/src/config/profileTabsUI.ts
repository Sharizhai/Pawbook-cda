import { ProfileTab } from "$types/profileTabsTypes";
import * as messages from "$lib/paraglide/messages";

export const profileTabs = [
    { label: messages.profile_tab_animals(), value: ProfileTab.Animals },
    { label: messages.profile_tab_posts(), value: ProfileTab.Publications }
];