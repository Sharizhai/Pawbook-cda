import { test, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/svelte";
import "@testing-library/jest-dom";
import Navbar from "$components/navbar/Navbar.svelte";
import * as messages from "$lib/paraglide/messages";
import {push} from "svelte-spa-router";

const panelTitle = messages.post_creation_dialog_panel_title();

vi.mock("svelte-spa-router", () => ({
    push: vi.fn()
}));

vi.mock("$services/userServices.svelte", () => ({
    fetchUserInformations: vi.fn().mockResolvedValue({
        id: "test-user",
        username: "testuser",
    })
}));

vi.mock("$stores/stores.svelte", () => {
    const user = {
        information: {
            id: "test-user",
            username: "testuser",
        },
        accessToken: "",
        isAdmin: false,
        setAccessToken: vi.fn(),
        clearInformations: vi.fn(),
    };

    return { user };
});

beforeEach(() => {
    vi.clearAllMocks();
});

test("Navbar should render the logo", () => {
    const { getByAltText } = render(Navbar);

    expect(getByAltText("Pawbook Logo")).toBeInTheDocument();
});

test("Navbar should render all navigation buttons", async () => {
    const { container } = render(Navbar);

    const navbarButtons = container.querySelectorAll('.navbar-items-container button, .navbar-more-container button');
    expect(navbarButtons.length).toBe(6);
  
    expect(container.querySelector('.navbar-logo-container')).not.toBeNull();
    expect(container.querySelector('.navbar-items-container')).not.toBeNull();
    expect(container.querySelector('.navbar-more-container')).not.toBeNull();
});

test("Home button should navigate to feed page when clicked", async () => {
    const { getByText } = render(Navbar);
    
    const homeButton = getByText("Accueil");
    
    await fireEvent.click(homeButton);
    expect(push).toHaveBeenCalledWith("/feed");
});

test("Profile button should navigate to profile page when clicked", async () => {
    const { getByText } = render(Navbar);
    
    const profilButton = getByText("Profil");
    
    await fireEvent.click(profilButton);
    expect(push).toHaveBeenCalledWith("/profile/test-user");
});

test("Search button should trigger a console.log", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    const { getByText } = render(Navbar);
    const searchButton = getByText("Rechercher");
    
    await fireEvent.click(searchButton);
    expect(consoleSpy).toHaveBeenCalledWith("Search button clicked");

    consoleSpy.mockRestore();
});

test("Add button should open PostCreationDialogPanel", async () => {
    const { getByText, queryByText } = render(Navbar);
    const addButton = getByText("Publier");

    const panelTitle = messages.post_creation_dialog_panel_title();

    expect(queryByText(panelTitle)).not.toBeInTheDocument();

    await fireEvent.click(addButton);

    expect(getByText(panelTitle)).toBeInTheDocument();
});

test("Notifications button should trigger a console.log", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    const { getByText } = render(Navbar);
    const notificationButton = getByText("Notifications");
    
    await fireEvent.click(notificationButton);
    expect(consoleSpy).toHaveBeenCalledWith("Notification button clicked");

    consoleSpy.mockRestore();
});

test("Menu button should trigger a console.log", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    const { getByText } = render(Navbar);
    const menuButton = getByText("Menu");
    
    await fireEvent.click(menuButton);
    expect(consoleSpy).toHaveBeenCalledWith("Menu button clicked");

    consoleSpy.mockRestore();
});