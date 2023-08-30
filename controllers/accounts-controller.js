// Import the userStore module for user-related operations
import { userStore } from "../models/user-store.js";

// Define the accountsController object to handle account-related actions
export const accountsController = {
  // Controller action to display the initial index page
  index(request, response) {
    const viewData = {
      title: "Login or Signup", // Set the title for the view
    };
    response.render("home-view", viewData); // Render the "home-view" template with viewData
  },

  // Controller action to display the login page
  login(request, response) {
    const viewData = {
      title: "Login to the Service", // Set the title for the view
    };
    response.render("login-view", viewData); // Render the "login-view" template with viewData
  },

  // Controller action to handle user logout
  logout(request, response) {
    response.cookie("station", ""); // Clear the "station" cookie
    response.redirect("/"); // Redirect to the home page
  },

  // Controller action to display the signup page
  signup(request, response) {
    const viewData = {
      title: "Login to the Service", // Set the title for the view
    };
    response.render("signup-view", viewData); // Render the "signup-view" template with viewData
  },

  // Controller action to handle user registration
  async register(request, response) {
    const user = request.body; // Extract user data from the request body

    // Check if the email is already registered
    const existingUser = await userStore.getUserByEmail(user.email);
    if (existingUser) {
      // If the email is already registered, show an error message on the signup page
      const viewData = {
        title: "Login to the Service",
        errorMessage: "This email is already registered. Please log in or use a different email.",
      };
      response.render("signup-view", viewData);
      return;
    }

    // If the email is not registered, add the new user to the database
    await userStore.addUser(user);
    response.redirect("/login"); // Redirect to the home page
  },

  // Controller action to authenticate user login
  async authenticate(request, response) {
    const { email, password } = request.body;
    const user = await userStore.getUserByEmail(email);

    if (user && user.password === password) {
      response.cookie("station", user.email); // Set the "station" cookie
      response.redirect("/dashboard"); // Redirect to the dashboard
    } else {
      // If login fails, show an error message on the login page
      const viewData = {
        title: "Login to the Service",
        errorMessage: "Incorrect email or password. Please try again.",
      };
      response.render("login-view", viewData);
    }
  },

  // Function to get the currently logged-in user
  async getLoggedInUser(request) {
    const userEmail = request.cookies.station;
    return await userStore.getUserByEmail(userEmail);
  },

  // Middleware function to ensure user authentication
  async ensureAuthenticated(request, response, next) {
    const user = await accountsController.getLoggedInUser(request);
    if (user) {
      return next(); // Continue to the next middleware or route handler
    }
    response.redirect("/login"); // Redirect to the login page if not authenticated
  },

  // Controller action to render the user's account page
  async accountPage(request, response) {
    // Get the currently logged-in user
    const loggedInUser = await accountsController.getLoggedInUser(request);

    // If the user is not logged in, redirect to the login page
    if (!loggedInUser) {
      response.redirect("/login");
      return;
    }

    const viewData = {
      title: "Account",
      user: loggedInUser,
    };

    // Render the "account-view" template with the viewData
    response.render("account-view", viewData);
  },

  // Function to update the user's account information
  async updateAccount(request, response) {
    // Get the currently logged-in user
    const loggedInUser = await accountsController.getLoggedInUser(request);

    // If the user is not logged in, redirect to the login page
    if (!loggedInUser) {
      response.redirect("/login");
      return;
    }

    // exxtract data from body
    const { firstName, lastName, email, newPassword, confirmNewPassword } = request.body;

    // check if the new email already exists
    const existingUserWithEmail = await userStore.getUserByEmail(email);
    // check if the existing email belongs to a different user
    if (existingUserWithEmail && existingUserWithEmail.id !== loggedInUser.id) {
      // If email exist, prepare the view data with an error message
      const viewData = {
        title: "Edit Account",
        errorMessage: "This email is already registered. Please use a different email.",
        user: loggedInUser, 
      };
      // Render the "account-view" template with the error message
      response.render("account-view", viewData);
      return;
    }

    // Check if the password from fields match between them
    if (newPassword !== confirmNewPassword) {
      // If not, pass an error message
      const viewData = {
        title: "Edit Account",
        errorMessage: "New passwords do not match.",
        user: loggedInUser,
      };
      // render the "account-view" template with the error message
      response.render("account-view", viewData);
      return;
    }

    // ipdate the user's information with the new data
    loggedInUser.firstName = firstName;
    loggedInUser.lastName = lastName;
    loggedInUser.email = email;
    loggedInUser.password = newPassword;

    // call the updateUser function to update the user's data in the store
    await userStore.updateUser(loggedInUser);

    // redirect the user to the dashboard after updating their account
    response.redirect("/dashboard");
  }
};
