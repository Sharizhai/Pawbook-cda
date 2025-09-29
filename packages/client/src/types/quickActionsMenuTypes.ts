export type QuickActionsMenuActionProperties = {
    icon: string,
    label: string,
    onClick: () => void,
    disabled?: boolean,
    isWarningAction?: boolean
}