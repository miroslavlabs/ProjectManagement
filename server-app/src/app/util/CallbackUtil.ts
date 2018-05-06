import { Response, NextFunction } from "express";

export class CallbackUtil {
    public static simpleRestSuccessCallback<T>(res: Response, next: NextFunction);
    public static simpleRestSuccessCallback<T>(res: Response, next: NextFunction, data: T)
    public static simpleRestSuccessCallback<T>(res: Response, next: NextFunction, data?: T) {
        if (data != null || data != undefined) {
            return () => {
                res.json(data);
                next();
            }
        } else {
            return (result: T) => {
                res.json(result);
                next();
            }
        }
    }

    public static simpleRestErrorCallback(res: Response, next: NextFunction) {
        return (error: Error) => {
            res.json(this.wrapErrorObject(error));
            next();
        }
    }

    private static wrapErrorObject(error: Error) {
        return {
            success: false,
            err: error
        }
    }
}