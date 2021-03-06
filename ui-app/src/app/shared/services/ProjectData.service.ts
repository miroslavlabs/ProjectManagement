import { Injectable } from '@angular/core';
import { Project } from '../../data-model/Project';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProjectDataService {
    // FIMXE create service which discovers this
    private static readonly HTTP_SERVER_URL = 'http://localhost:8080/api/v1';
    private static readonly HTTP_PROJECT_ENDPOINT = '/project/';
    private static readonly HTTP_OPTIONS = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private httpClient: HttpClient) {
    }

    public getProjects(): Observable<Project[]> {
        let url = this.createUrlForProjectEndpoint();

        return this.httpClient.get<Project[]>(url);
    }

    public getProject(projectId: number): Observable<Project> {
        let url = this.createUrlForProjectEndpoint(projectId);

        return this.httpClient.get<Project>(url);
    }

    public updateProject(projectId: number, project: Project): Observable<Project> {
        let url = this.createUrlForProjectEndpoint(projectId);

        let httpResponse =
            this.httpClient.put<Project>(
                url,
                project,
                ProjectDataService.HTTP_OPTIONS);

        return httpResponse;
    }

    public deleteProject(projectId: number): Observable<Project> {
        let url = this.createUrlForProjectEndpoint(projectId);

        let httpResponse =
            this.httpClient.delete<Project>(
                url,
                ProjectDataService.HTTP_OPTIONS);

        return httpResponse;
    }

    public createProject(project: Project): Observable<Project> {
        let url = this.createUrlForProjectEndpoint();

        let httpResponse =
            this.httpClient.post<Project>(
                url,
                project,
                ProjectDataService.HTTP_OPTIONS
            );

        return httpResponse;
    }

    private createUrlForProjectEndpoint(projectId?: number): string {
        let url =
            `${ProjectDataService.HTTP_SERVER_URL}${ProjectDataService.HTTP_PROJECT_ENDPOINT}`;

        if (typeof (projectId) != "undefined") {
            url = `${url}${projectId}`;
        }

        return url;
    }
}