// User types
export interface User {
  userid: number;
  username: string;
  email: string;
  role: 'admin' | 'cashier';
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'cashier';
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  role?: 'admin' | 'cashier';
  password?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: Omit<User, 'created_at' | 'updated_at'>;
    token: string;
    refreshToken: string;
  };
}

// Item types
export interface Item {
  itemid: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock_quantity: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateItemRequest {
  name: string;
  description?: string;
  price: number;
  category: string;
  stock_quantity: number;
}

export interface UpdateItemRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock_quantity?: number;
}

// Customer types
export interface Customer {
  customerid: number;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCustomerRequest {
  name: string;
  email?: string;
  phone: string;
  address?: string;
}

export interface UpdateCustomerRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

// Order types
export interface OrderItem {
  itemid: number;
  quantity: number;
  price: number;
}

export interface Order {
  orderid: number;
  customerid?: number;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

export interface CreateOrderRequest {
  customerid?: number;
  items: OrderItem[];
}

export interface UpdateOrderRequest {
  status?: 'pending' | 'completed' | 'cancelled';
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// JWT payload
export interface JWTPayload {
  userid: number;
  username: string;
  role: 'admin' | 'cashier';
}

// Request types with user info
export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationResult {
  isEmpty: boolean;
  errors: ValidationError[];
}