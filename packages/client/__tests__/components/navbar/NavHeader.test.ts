import { test, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/svelte";
import "@testing-library/jest-dom";
import NavHeader from "$components/navbar/NavHeader.svelte";

beforeEach(() => {
    delete (window as any).location;
    window.location = {
        href: 'http://localhost/#/',
        hash: '#/',
        pathname: '/',
    } as Location;
});

test("Should render the logo", () => {
    const { container } = render(NavHeader);
    const logo = container.querySelector(".feed-header-logo");

    expect(logo).toBeInTheDocument();
});

test("Should render the title", () => {
    const { getByText } = render(NavHeader);

    expect(getByText("Pawbook")).toBeInTheDocument();
});

test("Should render the menu button with the good label", () => {
    const { getByText } = render(NavHeader);

    expect(getByText("Menu")).toBeInTheDocument();
});

test("onClick should run properly", async () => {
    const logSpy = vi.spyOn(console, "log");
    const { getByText } = render(NavHeader);
    const menuButton = getByText("Menu");
    await fireEvent.click(menuButton);

    expect(logSpy).toHaveBeenCalledWith("Menu button clicked");
});

test("Should render logo as button on administration page", () => {
    window.location = {
        href: 'http://localhost/#/administration',
        hash: '#/administration',
        pathname: '/administration',
    } as Location;

    const { container } = render(NavHeader);
    const logoButton = container.querySelector(".feed-header-logo-button");

    expect(logoButton).toBeInTheDocument();
});