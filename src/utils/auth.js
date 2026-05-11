import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthService = {
  // Mock registration: saves user in a list in local storage
  register: async (userData) => {
    try {
      const existingUsersStr = await AsyncStorage.getItem('users');
      const users = existingUsersStr ? JSON.parse(existingUsersStr) : [];
      
      // Check if user already exists
      if (users.find(u => u.email === userData.email)) {
        return { success: false, message: "User with this email already exists." };
      }

      users.push(userData);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      await AsyncStorage.setItem('currentUser', JSON.stringify(userData));
      return { success: true };
    } catch (e) {
      return { success: false, message: "Registration failed." };
    }
  },

  // Mock login: checks against saved users
  login: async (email, password) => {
    try {
      const usersStr = await AsyncStorage.getItem('users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        await AsyncStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true };
      } else {
        return { success: false, message: "Invalid email or password." };
      }
    } catch (e) {
      return { success: false, message: "Login failed." };
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('currentUser');
  },

  getCurrentUser: async () => {
    const userStr = await AsyncStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }
};
