import axios from 'axios';

  // Altere para o IP da sua máquina na rede
   const API_URL = 'http://192.168.100.8:5000/api';

  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Interceptor para logging (opcional)
  api.interceptors.request.use(
    (config) => {
      console.log('Request:', config);
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  

  export default api;