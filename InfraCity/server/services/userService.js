const { randomUUID } = require('crypto');

const User = require('../models/User');
const { generatePasswordHash, validatePassword } = require('../utils/password');

// Add debugging at the top of the file
console.log('=== UserService Loading Debug ===');

class UserService {
  constructor() {
    console.log('UserService constructor called');
  }

  // Add logging to see what methods are being defined
  static async authenticateUser(email, password) {
    console.log('UserService.authenticateUser called with email:', email);
    try {
      const user = await User.findOne({ email });
      if (!user) {
        console.log('User not found:', email);
        return null;
      }

      const isValidPassword = await validatePassword(password, user.password);
      if (!isValidPassword) {
        console.log('Invalid password for user:', email);
        return null;
      }

      console.log('User authenticated successfully:', email);
      return user;
    } catch (error) {
      console.error('Error in authenticateUser:', error);
      throw error;
    }
  }

  static async createUser(userData) {
    console.log('UserService.createUser called');
    try {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await generatePasswordHash(userData.password);
      const user = new User({
        ...userData,
        password: hashedPassword
      });

      await user.save();
      console.log('User created successfully:', userData.email);
      return user;
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  }

  static async getUserById(userId) {
    console.log('UserService.getUserById called with ID:', userId);
    try {
      return await User.findById(userId).select('-password -refreshToken');
    } catch (error) {
      console.error('Error in getUserById:', error);
      throw error;
    }
  }

  static async updateUser(userId, updateData) {
    console.log('UserService.updateUser called for user:', userId);
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password -refreshToken');
      
      if (!user) {
        throw new Error('User not found');
      }
      
      console.log('User updated successfully:', userId);
      return user;
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  }
}

console.log('UserService class defined');
console.log('UserService.authenticateUser exists:', typeof UserService.authenticateUser);

module.exports = UserService;