import { test, expect } from "vitest";
import { render, fireEvent } from "@testing-library/svelte";
import LanguageDropdown from "$components/LanguageDropdown.svelte";
import { app } from "../../src/stores/stores.svelte";

test("opens and closes the dropdown", async () => {
    const { getByRole, queryByText } = render(LanguageDropdown);
    const toggleButton = getByRole("button");
  
    expect(queryByText("🇪🇸 Español")).not.toBeInTheDocument();
  
    await fireEvent.click(toggleButton);
    expect(queryByText("🇪🇸 Español")).toBeInTheDocument();
  
    await fireEvent.click(toggleButton);
    expect(queryByText("🇪🇸 Español")).not.toBeInTheDocument();
  });
  
  test("changes the active locale when selecting an option", async () => {
    const { getByRole, getByText } = render(LanguageDropdown);
    const toggleButton = getByRole("button");
  
    await fireEvent.click(toggleButton);
  
    const espaOption = getByText("🇪🇸 Español");
    await fireEvent.click(espaOption);
  
    expect(app.activeLocale).toBe("es");
  
    expect(toggleButton).toHaveTextContent("🇪🇸 Español");
  });