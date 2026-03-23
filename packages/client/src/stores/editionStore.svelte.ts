export function createEditableSlice() {
    let current: unknown = $state(null);
    let snapshot: unknown = $state(null);

    const isEditing = $derived(snapshot !== null);

    const hasChanges = $derived(
        snapshot !== null &&
        JSON.stringify($state.snapshot(current)) !== JSON.stringify(snapshot)
    );

    function startEditing<T>(value: T) {
        current = value;
        snapshot = $state.snapshot(value) as T;
    }

    function cancelEditing() {
        if (snapshot) current = structuredClone(snapshot);
    }

    function stopEditing() {
        current = null;
        snapshot = null;
    }

    function patch<T>(partial: Partial<T>) {
        current = { ...(current as T), ...partial };
    }

    return {
        get current() { return current; },
        get hasChanges() { return hasChanges; },
        get isEditing() { return isEditing; },
        startEditing,
        cancelEditing,
        stopEditing,
        patch,
    };
}