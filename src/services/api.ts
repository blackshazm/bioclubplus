import { config } from '../config';
import { ApiResponse } from '../types';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.apiUrl;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      const data = await response.json();
      return {
        data,
        status: response.status,
      };
    } catch (error) {
      return {
        data: null as T,
        status: 500,
        message: 'Erro na requisição',
      };
    }
  }
}

export const apiService = new ApiService();
