import { test, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/svelte";
import "@testing-library/jest-dom";
import NavbarButton from "$components/navbar/NavbarButton.svelte";
import addIcon from "$assets/icons/navbar/add.svg?raw";

test("Should render with the good label", () => {
  const { getByText } = render(NavbarButton, { props: { label: "Click", onClick: () => {} } });
  expect(getByText("Click")).toBeInTheDocument();
});

test("Should render with a SVG icon", () => {
    const { container } = render(NavbarButton, {
        props: { icon: addIcon, label: "Click", onClick: () => {} }
    });
  
    const svg = container.querySelector(".icon-button svg");
    expect(svg).toBeInTheDocument();
});

test("Should render with a material icon", () => {
    const { getByText } = render(NavbarButton, {
        props: { icon: "home", label: "Accueil", onClick: () => {} }
    });

  expect(getByText("home")).toBeInTheDocument();
});

test("onClick should run properly", async () => {
  const handleClick = vi.fn();
  const { getByText } = render(NavbarButton, { props: { label: "Click", onClick: handleClick } });
  await fireEvent.click(getByText("Click"));
  expect(handleClick).toHaveBeenCalled();
});