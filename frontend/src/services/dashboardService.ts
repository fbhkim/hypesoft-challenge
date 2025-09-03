
import api from '@/lib/apiClient';

export const dashboardService = {
  async getDashboardData() {
    return api.get('/dashboard').then(res => res.data);
  },
};