import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";

// Initialize the database store for users
const db = initStore("users");

// Define the userStore object with various functions to interact with user data
export const userStore = {
  // Function to add a new user
  async addUser(user) {
    await db.read();
    user.id = v4(); // Generate a unique ID for the user
    db.data.users.push(user); // Add the user to the database
    await db.write(); // Write the updated data to the database
    return user; // Return the added user
  },

  // Function to retrieve a user by their ID
  async getUserById(id) {
    await db.read();
    return db.data.users.find((user) => user.id === id);
  },

  // Function to retrieve a user by their email
  async getUserByEmail(email) {
    await db.read();
    return db.data.users.find((user) => user.email === email);
  },

  // Function to delete a user by their ID
  async deleteUserById(id) {
    await db.read();
    const index = db.data.users.findIndex((user) => user.id === id);
    db.data.users.splice(index, 1); // Remove the user from the database
    await db.write(); // Write the updated data to the database
  },
  //Function to update update user data.
  async updateUser(updatedUser) {
    await db.read();
    const index = db.data.users.findIndex((user) => user.id === updatedUser.id);
    db.data.users[index] = updatedUser;
    await db.write(); // Write the updated data to the database
  }
};
