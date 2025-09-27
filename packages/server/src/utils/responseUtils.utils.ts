import { Response } from "express"

export const APIResponse = (response: Response, data: any, message: string, status = 200) => {
    response.status(status).json({
        success: status >= 200 && status < 300,
        message,
        data
    });
};