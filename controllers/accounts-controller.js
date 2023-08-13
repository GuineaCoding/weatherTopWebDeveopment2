import { userStore } from "../models/user-store.js";

export const accountsController = {
  index(request, response) {
    const viewData = {
      title: "Login or Signup",
    };
    response.render("home-view", viewData);
  },

  login(request, response) {
    const viewData = {
      title: "Login to the Service",
    };
    response.render("login-view", viewData);
  },

  logout(request, response) {
    response.cookie("station", "");
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Login to the Service",
    };
    response.render("signup-view", viewData);
  },

  async register(request, response) {
    const user = request.body;
    await userStore.addUser(user);
    console.log(`registering ${user.email}`);
    response.redirect("/");
  },

  async authenticate(request, response) {
    const { email, password } = request.body;
    const user = await userStore.getUserByEmail(email);
  
    if (user && user.password === password) {
      response.cookie("station", user.email);
      console.log(`logging in ${user.email}`);
      response.redirect("/dashboard");
    } else {
      const viewData = {
        title: "Login to the Service",
        errorMessage: "Incorrect email or password. Please try again.",
      };
      response.render("login-view", viewData);
    }
  },

  async getLoggedInUser(request) {
    const userEmail = request.cookies.station;
    return await userStore.getUserByEmail(userEmail);
  },

  async ensureAuthenticated(request, response, next) {
    const user = await accountsController.getLoggedInUser(request);
    if (user) {
      return next();
    }
    response.redirect("/login");
  },
};