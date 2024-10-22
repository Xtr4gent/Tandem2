import axios, { AxiosError } from 'axios';

const XANO_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:VKRcbtpD';

const xanoInstance = axios.create({
  baseURL: XANO_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

xanoInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('xano_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

const handleApiError = (error: AxiosError) => {
  if (error.response) {
    console.error('API Error:', error.response.status, error.response.data);
    throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
  } else if (error.request) {
    console.error('No response received:', error.request);
    throw new Error('No response received from the server');
  } else {
    console.error('Error setting up request:', error.message);
    throw new Error(`Error setting up the request: ${error.message}`);
  }
};

export const xano = {
  auth: {
    signIn: async (email: string, password: string) => {
      try {
        const response = await xanoInstance.post('/auth/login', { email, password });
        localStorage.setItem('xano_token', response.data.authToken);
        return response.data;
      } catch (error) {
        return handleApiError(error as AxiosError);
      }
    },
    signOut: async () => {
      try {
        await xanoInstance.post('/auth/logout');
        localStorage.removeItem('xano_token');
      } catch (error) {
        return handleApiError(error as AxiosError);
      }
    },
    getUser: async () => {
      try {
        const response = await xanoInstance.get('/auth/me');
        return response.data;
      } catch (error) {
        return handleApiError(error as AxiosError);
      }
    },
  },
  from: (table: string) => ({
    select: async () => {
      try {
        const response = await xanoInstance.get(`/${table}`);
        return response.data;
      } catch (error) {
        return handleApiError(error as AxiosError);
      }
    },
    insert: async (data: any) => {
      try {
        const response = await xanoInstance.post(`/${table}`, data);
        return response.data;
      } catch (error) {
        return handleApiError(error as AxiosError);
      }
    },
    update: async (id: string, data: any) => {
      try {
        const response = await xanoInstance.patch(`/${table}/${id}`, data);
        return response.data;
      } catch (error) {
        return handleApiError(error as AxiosError);
      }
    },
    delete: async (id: string) => {
      try {
        const response = await xanoInstance.delete(`/${table}/${id}`);
        return response.data;
      } catch (error) {
        return handleApiError(error as AxiosError);
      }
    },
  }),
};