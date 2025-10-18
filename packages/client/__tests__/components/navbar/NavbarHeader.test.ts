import { test, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/svelte";
import "@testing-library/jest-dom";
import NavbarHeader from "$components/navbar/NavHeader.svelte";

test("Should render the logo", () => {
    const { container } = render(NavbarHeader);
    const logo = container.querySelector(".feed-header-logo");

    expect(logo).toBeInTheDocument();
});

test("Should render the title", () => {
    const { getByText } = render(NavbarHeader);

    expect(getByText("Pawbook")).toBeInTheDocument();
});

test("Should render the menu button with the good label", () => {
    const { getByText } = render(NavbarHeader);

    expect(getByText("Menu")).toBeInTheDocument();
});

test("onClick should run properly", async () => {
    const logSpy = vi.spyOn(console, "log");
    const { getByText } = render(NavbarHeader);
    const menuButton = getByText("Menu");
    await fireEvent.click(menuButton);

    expect(logSpy).toHaveBeenCalledWith("Menu button clicked");
});