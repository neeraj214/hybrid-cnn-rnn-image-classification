import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

// Mocking metrics endpoint for demonstration if needed
// In a real development environment, you would use a tool like MSW or a real backend.
// For this task, we handle the mock data directly in the component.

export default api
