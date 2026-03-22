import * as messages from "$lib/paraglide/messages";

const errorMap: Record<string, () => string> = {
    "Invalid password": messages.password_update_error_invalid_password,
    "New password must be different from current password": messages.password_update_error_same_password,
    "Password must be at least 12 characters long": messages.password_update_error_long,
    "Password must contain at least one uppercase letter": messages.password_update_error_missing_uppercase_letter,
    "Password must contain at least one lowercase letter": messages.password_update_error_missing_lowercase_letter,
    "Password must contain at least one number": messages.password_update_error_missing_number,
    "Password must contain at least one special character": messages.password_update_error_missing_special_character,
};

export const getTranslatedError = (message: string): string => {
    return errorMap[message]?.() ?? messages.error_generic_message();
};