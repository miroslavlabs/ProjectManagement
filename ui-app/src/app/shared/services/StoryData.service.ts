import { Injectable } from '@angular/core';
import { Board } from '../../data-model/Board';
import { Story } from '../../data-model/Story';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Project } from '../../data-model/Project';

@Injectable()
export class StoryDataService {
    // FIMXE create service which discovers this
    private static readonly HTTP_SERVER_URL = 'http://localhost:8080/api/v1';
    private static readonly HTTP_STATE_ENDPOINT = '/state/';
    private static readonly HTTP_STORY_ENDPOINT = 'story';
    private static readonly HTTP_OPTIONS = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private httpClient: HttpClient) {
    }

    public getStories(stateId: number): Observable<Story[]> {
        let url = this.createUrlForStoryEndpoint(stateId);

        return this.httpClient.get<Story[]>(url);
    }

    public createStory(story: Story, stateId: number): Observable<Story> {
        let url = this.createUrlForStoryEndpoint(stateId);

        let httpResponse =
            this.httpClient.post<Story>(
                url,
                story,
                StoryDataService.HTTP_OPTIONS
            );

        return httpResponse;
    }

    private createUrlForStoryEndpoint(stateId: number): string {
        let url =
            `${StoryDataService.HTTP_SERVER_URL}${StoryDataService.HTTP_STATE_ENDPOINT}${StoryDataService.HTTP_STORY_ENDPOINT}?stateId=${stateId}`;

        return url;
    }
}