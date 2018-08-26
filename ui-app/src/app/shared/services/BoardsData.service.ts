import { Injectable } from '@angular/core';
import { Board } from '../../data-model/Board';
import { State } from '../../data-model/State';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Project } from '../../data-model/Project';

@Injectable()
export class BoardDataService {
    // FIMXE create service which discovers this
    private static readonly HTTP_SERVER_URL = 'http://localhost:8080/api/v1';
    private static readonly HTTP_BOARD_ENDPOINT = '/board/';
    private static readonly HTTP_STATE_ENDPOINT = '/state/';
    private static readonly HTTP_OPTIONS = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private httpClient: HttpClient) {
    }

    public getBoards(projectId: number): Observable<Board[]> {
        let url = this.createUrlForBoardEndpoint(projectId);

        return this.httpClient.get<Board[]>(url);
    }

    public getBoard(projectId: number, boardId: number): Observable<Board> {
        let url = this.createUrlForBoardEndpoint(projectId, boardId);

        return this.httpClient.get<Board>(url);
    }

    public getColumns(boardId: number): Observable<State[]> {
        let url = this.createUrlForStateEndpoint(boardId);

        return this.httpClient.get<State[]>(url);
    }

    public createColumn(state: State, boardId: number): Observable<State> {
        let url = this.createUrlForStateEndpoint(boardId);

        let httpResponse =
            this.httpClient.post<State>(
                url,
                state,
                BoardDataService.HTTP_OPTIONS
            );

        return httpResponse;
    }

    public createBoard(board: Board, projectId: number): Observable<Board> {
        let url = this.createUrlForBoardEndpoint(projectId);

        let httpResponse =
            this.httpClient.post<Board>(
                url,
                board,
                BoardDataService.HTTP_OPTIONS
            );

        return httpResponse;
    }

    private createUrlForBoardEndpoint(projectId: number, boardId?: number): string {
        let url =
            `${BoardDataService.HTTP_SERVER_URL}${BoardDataService.HTTP_BOARD_ENDPOINT}`;

        if (boardId) {
            url = `${url}${boardId}`;
        }

        url = `${url}?projectId=${projectId}`;

        return url;
    }

    private createUrlForStateEndpoint(boardId: number): string {
        let url =
            `${BoardDataService.HTTP_SERVER_URL}${BoardDataService.HTTP_STATE_ENDPOINT}?boardId=${boardId}`;

        return url;
    }
}