import { Injectable } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { Agent } from '../models/agent';
import { Observable } from 'rxjs';

export interface AgentFilterParams {
  page?: number;
  limit?: number;
  type?: string[];
  search?: string;
  profileId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AgentsService {
  constructor(private apiService: ApiService) {}

  createAgent(agent: Agent): Observable<Agent> {
    return this.apiService.post('/agents', agent);
  }

  updateAgent(id: string, agent: Agent): Observable<Agent> {
    return this.apiService.put(`/agents/${id}`, agent);
  }

  toggleStatus(id: string, agent: Agent): Observable<Agent> {
    return this.apiService.patch(`/agents/${id}/status`, agent);
  }

  getAllAgents(params: AgentFilterParams): Observable<Agent[]> {
    // Create a query parameter object
    const queryParams: { [key: string]: string } = {};

    // Add page number if provided (default to 1 if not specified)
    queryParams['page'] = (params.page || 1).toString();

    // Add limit if provided (default to 10 if not specified)
    queryParams['limit'] = (params.limit || 10).toString();

    // Handle type (array of types)
    if (params.type && params.type.length > 0) {
      queryParams['type'] = params.type.join(',');
    }

    // Add search query if provided
    if (params.search) {
      queryParams['search'] = params.search;
    }

    // Add profile ID if provided
    if (params.profileId) {
      queryParams['profileId'] = params.profileId;
    }

    // Convert query parameters to URL string
    const queryString = Object.entries(queryParams)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join('&');

    // Make the API call with constructed query string
    return this.apiService.get(`/agents?${queryString}`);
  }
}
