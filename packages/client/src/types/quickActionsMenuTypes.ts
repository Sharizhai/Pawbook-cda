export type QuickActionsMenuActionProperties = {
    icon: string,
    label: string,
    onClick: () => void,
    disabled?: boolean,
    isWarningAction?: boolean
}

export enum QuickActionMenuPosition {
    BOTTOMLEFT = "bottom-right",
    BOTTOMRIGHT = "bottom-left",
    BOTTOMCENTER = "bottom-center",
}