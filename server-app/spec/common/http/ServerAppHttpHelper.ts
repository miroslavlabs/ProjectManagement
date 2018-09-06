import * as request from 'request';

import { LogFactory } from '../../../src/app/log';
import { LoggerInstance } from 'winston';

import { HttpUtils } from './HttpUtils';

/**
 * This class methods for sending HTTP requests to the backend for creating model objects.
 */
export class ServerAppHttpHelper<T> {
    private baseUrl: string;
    private logger: LoggerInstance = LogFactory.createLogger(ServerAppHttpHelper.name);

    constructor(
        localServerAddress: string,
        localServerPort: string,
        path: string,
        private objectTypeCtor: new () => T) {

        this.baseUrl = `http://${localServerAddress}:${localServerPort}/${path}`;
    }
 
    public get(itemId?: number): Promise<T[]> {
        let itemUrl = this.baseUrl;
        if (itemId) {
            itemUrl = `${itemUrl}/${itemId}`;
        }

        let requestPromise: Promise<T[]> = new Promise((resolve, reject) => {
            request.get(
                itemUrl, 
                null /*options*/, 
                (error: any, response: request.Response, body: any) => {
                    if (error) {
                        reject(`The items could not be retrieved. ${error}`);

                    } else {
                        this.handleResponse(response, body, resolve, reject);
                    }
                });
            });

        return requestPromise;
    }

    public update(itemId: number, newItemData: T): Promise<[T, T[]]> {

        let requestPromise: Promise<[T, T[]]> = new Promise((resolve, reject) => {
            request.put(
                `${this.baseUrl}/${itemId}`, 
                { json: newItemData }, 
                (error: any, response: request.Response, body: any) => {
                    if (error) {
                        reject(`The items could not be updated. ${error}`);

                    } else {
                        this.handleResponse(response, body, resolve, reject, newItemData);
                    }
                });
            });

        return requestPromise;
    }

    public create(item: T, parentPropertyName?: string, parentId?: number): Promise<[T, T[]]> {
        let requestPromise: Promise<[T, T[]]> = new Promise((resolve, reject) => {
            request.post(
                this.getRequestUrl(parentPropertyName, parentId), 
                { json: item }, 
                (error: any, response: request.Response, body: any) => {
                    if (error) {
                        reject(`The item ${JSON.stringify(item)} could not be created. ${error}`);

                    } else {
                        this.handleResponse(response, body, resolve, reject, item);
                    }
                });
            });

        return requestPromise;
    }

    private handleResponse(response: request.Response, body: any, resolve, reject, item?: T) {
        if (response.statusCode && response.statusCode != 200) {
            reject(`The response status code is ${response.statusCode} with body ${body}`);
        } else {
            if (!body || body.length == 0) {
                reject("No data returned by the server.");
            } else if (body.success && (body.success == false)) {
                reject(body.err);
            } else {
                this.logger.info("The item data was successfully returned from the server.");

                let items: T[] = HttpUtils.convertReponseBodyToObjectsOfType(body, this.objectTypeCtor);

                if (item) {
                    resolve([item, items]);
                } else {
                    resolve(items);
                }
            }
        }
    }

    private getRequestUrl(parentPropertyName?: string, parentId?: number) {
        let requestProperties = '';
        if (parentPropertyName && parentId) {
            requestProperties = `?${parentPropertyName}=${parentId}`;
        }

        return `${this.baseUrl}${requestProperties}`;
    }
}