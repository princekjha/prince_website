// const API_BASE = '/api';

// async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
//   const token = localStorage.getItem('admin_token');
  
//   const headers: Record<string, string> = {
//     ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
//     ...(options.headers as Record<string, string>),
//   };

//   // Only set default Content-Type if not already set and not FormData
//   const isFormData = options.body instanceof FormData;
//   if (!headers['Content-Type'] && !isFormData) {
//     headers['Content-Type'] = 'application/json';
//   }

//   // If we're sending FormData, we MUST let fetch set the Content-Type with the boundary
//   if (isFormData) {
//     delete headers['Content-Type'];
//   }

//   const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  
//   if (response.status === 401 && path !== '/login') {
//     localStorage.removeItem('admin_token');
//     window.location.href = '/login';
//     throw new Error('Unauthorized - Session expired');
//   }

//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({ message: response.statusText }));
//     throw new Error(errorData.message || `API Error: ${response.statusText}`);
//   }
//   return response.json();
// }

// export const api = {
//   authGoogle: (idToken: string) => request<{ success: boolean; email: string }>('/auth/google', {
//     method: 'POST',
//     body: JSON.stringify({ idToken }),
//   }),

//   login: (password: string, email: string) => request<{ success: boolean; token: string }>('/login', {
//     method: 'POST',
//     body: JSON.stringify({ password, email }),
//   }),
  
//   projects: {
//     list: () => request<any[]>('/projects'),
//     create: (data: any) => request<any>('/projects', { method: 'POST', body: JSON.stringify(data) }),
//     update: (id: string, data: any) => request<any>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
//     delete: (id: string) => request<any>(`/projects/${id}`, { method: 'DELETE' }),
//   },
  
//   blog: {
//     list: () => request<any[]>('/blog'),
//     create: (data: any) => request<any>('/blog', { method: 'POST', body: JSON.stringify(data) }),
//     update: (id: string, data: any) => request<any>(`/blog/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
//     delete: (id: string) => request<any>(`/blog/${id}`, { method: 'DELETE' }),
//   },
  
//   creative: {
//     list: () => request<any[]>('/creative'),
//     create: (data: any) => request<any>('/creative', { method: 'POST', body: JSON.stringify(data) }),
//     update: (id: string, data: any) => request<any>(`/creative/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
//     delete: (id: string) => request<any>(`/creative/${id}`, { method: 'DELETE' }),
//   },
  
//   topics: {
//     list: () => request<any[]>('/learning/topics'),
//     create: (data: any) => request<any>('/learning/topics', { method: 'POST', body: JSON.stringify(data) }),
//     update: (id: string, data: any) => request<any>(`/learning/topics/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
//     delete: (id: string) => request<any>(`/learning/topics/${id}`, { method: 'DELETE' }),
//   },
  
//   lessons: {
//     list: () => request<any[]>('/learning/lessons'),
//     create: (data: any) => request<any>('/learning/lessons', { method: 'POST', body: JSON.stringify(data) }),
//     update: (id: string, data: any) => request<any>(`/learning/lessons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
//     delete: (id: string) => request<any>(`/learning/lessons/${id}`, { method: 'DELETE' }),
//   },

//   experience: {
//     list: () => request<any[]>('/experience'),
//     create: (data: any) => request<any>('/experience', { method: 'POST', body: JSON.stringify(data) }),
//     update: (id: string, data: any) => request<any>(`/experience/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
//     delete: (id: string) => request<any>(`/experience/${id}`, { method: 'DELETE' }),
//   },
  
//   skills: {
//     list: () => request<any[]>('/skills'),
//     create: (data: any) => request<any>('/skills', { method: 'POST', body: JSON.stringify(data) }),
//     update: (id: string, data: any) => request<any>(`/skills/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
//     delete: (id: string) => request<any>(`/skills/${id}`, { method: 'DELETE' }),
//   },
  
//   profile: {
//     get: () => request<any>('/profile'),
//     update: (data: any) => request<any>('/profile', { method: 'POST', body: JSON.stringify(data) }),
//   },

//   upload: (file: File) => {
//     const formData = new FormData();
//     formData.append('image', file);
//     return request<{ url: string }>('/upload', {
//       method: 'POST',
//       body: formData,
//     });
//   },
  
//   contact: (data: any) => request<any>('/contact', { method: 'POST', body: JSON.stringify(data) }),
// };

const API_BASE = '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('admin_token');
  
  const headers: Record<string, string> = {
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  // Only set default Content-Type if not already set and not FormData
  const isFormData = options.body instanceof FormData;
  if (!headers['Content-Type'] && !isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  // If we're sending FormData, we MUST let fetch set the Content-Type with the boundary
  if (isFormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  
  if (response.status === 401 && path !== '/login') {
    localStorage.removeItem('admin_token');
    window.location.href = '/login';
    throw new Error('Unauthorized - Session expired');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `API Error: ${response.statusText}`);
  }
  return response.json();
}

export const api = {
  authGoogle: (idToken: string) => request<{ success: boolean; email: string }>('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ idToken }),
  }),

  login: (password: string, email: string) => request<{ success: boolean; token: string }>('/login', {
    method: 'POST',
    body: JSON.stringify({ password, email }),
  }),
  
  projects: {
    list: () => request<any[]>('/projects'),
    create: (data: any) => request<any>('/projects', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/projects/${id}`, { method: 'DELETE' }),
  },
  
  blog: {
    list: () => request<any[]>('/blog'),
    create: (data: any) => request<any>('/blog', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/blog/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/blog/${id}`, { method: 'DELETE' }),
  },
  
  creative: {
    list: () => request<any[]>('/creative'),
    create: (data: any) => request<any>('/creative', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/creative/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/creative/${id}`, { method: 'DELETE' }),
  },
  
  topics: {
    list: () => request<any[]>('/learning/topics'),
    create: (data: any) => request<any>('/learning/topics', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/learning/topics/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/learning/topics/${id}`, { method: 'DELETE' }),
  },
  
  lessons: {
    list: () => request<any[]>('/learning/lessons'),
    create: (data: any) => request<any>('/learning/lessons', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/learning/lessons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/learning/lessons/${id}`, { method: 'DELETE' }),
  },

  experience: {
    list: () => request<any[]>('/experience'),
    create: (data: any) => request<any>('/experience', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/experience/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/experience/${id}`, { method: 'DELETE' }),
  },
  
  skills: {
    list: () => request<any[]>('/skills'),
    create: (data: any) => request<any>('/skills', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/skills/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/skills/${id}`, { method: 'DELETE' }),
  },
  
  profile: {
    get: () => request<any>('/profile'),
    update: (data: any) => request<any>('/profile', { method: 'POST', body: JSON.stringify(data) }),
  },

  contact: (data: any) => request<any>('/contact', { method: 'POST', body: JSON.stringify(data) }),
};
