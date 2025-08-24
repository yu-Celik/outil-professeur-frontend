export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  subjects?: string; // JSON string of selected subjects
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthError {
  message: string;
  code?: string;
}
