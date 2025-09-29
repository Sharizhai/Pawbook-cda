import QuickActionsMenu from "../../../../src/components/generic/quickActionsMenu/QuickActionsMenu.svelte";
import {QuickActionsMenuActionProperties} from "../../../../src/types/quickActionsMenuTypes";
import { render, fireEvent } from "@testing-library/svelte";
import {describe, beforeEach, it, expect, vi } from "vitest";

describe("QuickActionsMenu Component", () => {
    let mockActions: QuickActionsMenuActionProperties[];
    let mockOnClose: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockOnClose = vi.fn();
        mockActions = [
            {
                icon: '<svg data-testid="icon-edit"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/></svg>',
                label: "Modifier",
                onClick: vi.fn()
            },
            {
                icon: '<svg data-testid="icon-delete"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z"/></svg>',
                label: "Supprimer",
                onClick: vi.fn(),
                isWarningAction: true
            },
            {
                icon: '<svg data-testid="icon-disabled"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>',
                label: "Action désactivée",
                onClick: vi.fn(),
                disabled: true
            }
        ];
    });

    it("Should render the component with all elements", () => {
        const { container, getByText } = render(QuickActionsMenu, {
            props: {
                isVisible: true,
                actions: mockActions,
                top: "1rem",
                left: "2rem"
            }
        });

        const menu = container.querySelector('.quick-actions-menu');
        expect(menu).toBeInTheDocument();
        expect(menu).toHaveStyle({ top: '1rem', left: '2rem' });

        expect(getByText("Modifier")).toBeInTheDocument();
        expect(getByText("Supprimer")).toBeInTheDocument();
        expect(getByText("Action désactivée")).toBeInTheDocument();
    });

    it("Should not render when isVisible is false", () => {
        const { container } = render(QuickActionsMenu, {
            props: {
                isVisible: false,
                actions: mockActions
            }
        });

        const menu = container.querySelector('.quick-actions-menu');
        expect(menu).not.toBeInTheDocument();
    });

    it("Should render the buttons component with icon, label, and click function", async () => {
        const { getByText, container } = render(QuickActionsMenu, {
            props: {
                isVisible: true,
                actions: mockActions
            }
        });

        const editButton = getByText("Modifier").closest('button');
        expect(editButton).toBeInTheDocument();

        const icon = container.querySelector('[data-testid="icon-edit"]');
        expect(icon).toBeInTheDocument();

        await fireEvent.click(editButton!);
        expect(mockActions[0].onClick).toHaveBeenCalledTimes(1);
    });

    it("Should render warning style if isWarningAction is true", () => {
        const { getByText } = render(QuickActionsMenu, {
            props: {
                isVisible: true,
                actions: mockActions
            }
        });

        const warningButton = getByText("Supprimer").closest('button');
        expect(warningButton).toHaveClass('warning-action');

        const normalButton = getByText("Modifier").closest('button');
        expect(normalButton).not.toHaveClass('warning-action');
    });

    it("Should render language dropdown if haslanguageDropdown is true", () => {
        const { container } = render(QuickActionsMenu, {
            props: {
                isVisible: true,
                actions: mockActions,
                haslanguageDropdown: true
            }
        });

        const menu = container.querySelector('.quick-actions-menu');
        expect(menu?.children.length).toBeGreaterThan(mockActions.length);
    });

    it("Should not render language dropdown if haslanguageDropdown is false", () => {
        const { container } = render(QuickActionsMenu, {
            props: {
                isVisible: true,
                actions: mockActions,
                haslanguageDropdown: false
            }
        });

        const buttons = container.querySelectorAll('.quick-actions-menu-button');
        expect(buttons.length).toBe(mockActions.length);
    });

    it("Should disable the buttons which have disabled option property on true", async () => {
        const { getByText } = render(QuickActionsMenu, {
            props: {
                isVisible: true,
                actions: mockActions
            }
        });

        const disabledButton = getByText("Action désactivée").closest('button');
        expect(disabledButton).toBeDisabled();
        expect(disabledButton).toHaveAttribute('disabled');

        const enabledButton = getByText("Modifier").closest('button');
        expect(enabledButton).not.toBeDisabled();

        await fireEvent.click(enabledButton!);
        expect(mockActions[0].onClick).toHaveBeenCalledTimes(1);
    });

    it("Should apply custom positioning with right property", () => {
        const { container } = render(QuickActionsMenu, {
            props: {
                isVisible: true,
                actions: mockActions,
                top: "2rem",
                right: "3rem"
            }
        });

        const menu = container.querySelector('.quick-actions-menu');
        expect(menu).toHaveStyle({ top: '2rem', right: '3rem' });
    });
});