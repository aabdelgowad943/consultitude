import { Injectable } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { Agent } from '../models/agent';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AgentsService {
  constructor(private apiService: ApiService) {}

  createAgent(agent: Agent): Observable<Agent> {
    return this.apiService.post('/agents', agent);
  }

  getAllAgents(page: number, limit: number): Observable<Agent[]> {
    return this.apiService.get(`/agents?page=${page}&limit=${limit}`);
  }

  updateAgent(agent: Agent): Observable<Agent> {
    return this.apiService.put(`/agents/${agent.id}`, agent);
  }

  toggleStatus(id: string, agent: Agent): Observable<Agent> {
    return this.apiService.patch(`/agents/${id}/status`, agent);
  }
}
