import { User } from '../types';

const STORAGE_KEY = 'wealthwaves_users';
const MOCK_DELAY = 1000; // Simulate 1s network latency

export const userService = {
  // Simulate Backend Registration
  async register(user: User): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    const users = this._getStoredUsers();
    
    // Check for duplicates
    if (users.some(u => u.email === user.email || u.mobile === user.mobile)) {
      throw new Error('User already exists with this email or mobile.');
    }
    
    const newUser = { 
        ...user, 
        id: crypto.randomUUID(), 
        createdAt: new Date().toISOString(),
        isAdmin: false
    };
    
    users.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    return newUser;
  },

  // Simulate Backend Login
  async login(identifier: string, password: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    
    // Hardcoded Admin Credentials (Backend Logic)
    if (identifier === 'admin' && password === 'admin') {
        return {
            id: 'admin-001',
            name: 'System Administrator',
            email: 'admin@wealthwaves.com',
            mobile: '0000000000',
            countryCode: '+91',
            dob: '2000-01-01',
            age: 25,
            gender: 'Other',
            profession: 'Administrator',
            isAdmin: true,
            createdAt: new Date().toISOString()
        } as User;
    }

    const users = this._getStoredUsers();
    const user = users.find(u => 
      (u.email === identifier || u.mobile === identifier) && u.password === password
    );

    if (!user) throw new Error('Invalid credentials. Please check your username and password.');
    return user;
  },

  // Simulate Data Update
  async updateUser(email: string, updates: Partial<User>): Promise<User> {
    const users = this._getStoredUsers();
    const index = users.findIndex(u => u.email === email);
    
    if (index === -1) throw new Error('User not found');
    
    const updatedUser = { ...users[index], ...updates };
    users[index] = updatedUser;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    return updatedUser;
  },

  // Simulate fetching all users (Admin only)
  async getAllUsers(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    return this._getStoredUsers();
  },

  // Internal helper to read DB (LocalStorage)
  _getStoredUsers(): User[] {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
  }
};