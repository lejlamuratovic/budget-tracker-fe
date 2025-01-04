import React from "react";
import { mount } from "cypress/react18";
import LoginPage from "../../pages/LoginPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Match your `react-query` version
import { MemoryRouter } from "react-router-dom";

describe("LoginPage Component", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    // Create a new QueryClient for each test
    queryClient = new QueryClient();

    // Intercept API calls for login
    cy.intercept("POST", "/api/login", (req) => {
      if (req.body.email === "test@example.com") {
        req.reply({
          statusCode: 200,
          body: { id: 1, email: "test@example.com" },
        });
      } else {
        req.reply({
          statusCode: 401,
          body: { message: "Invalid credentials" },
        });
      }
    }).as("loginRequest");

    // Mount the LoginPage component with QueryClientProvider and MemoryRouter
    mount(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  it("renders the login form correctly", () => {
    // Validate the presence of login form elements
    cy.contains("Login").should("be.visible");
    cy.get('input[type="email"]').should("be.visible");
    cy.get('button').contains("Log In").should("be.visible");
  });

  it("displays error message for invalid login", () => {
    // Enter an invalid email and attempt login
    cy.get('input[type="email"]').type("invalid@example.com");
    cy.get('button').contains("Log In").click();

    // Wait for the login request and validate the error message
    cy.wait("@loginRequest").then(() => {
      cy.contains("Failed to log in. Please try again.").should("be.visible");
    });
  });

  it("logs in successfully and redirects to the dashboard", () => {
    // Enter a valid email and attempt login
    cy.get('input[type="email"]').type("test@example.com");
    cy.get('button').contains("Log In").click();

    // Wait for the login request and validate redirection
    cy.wait("@loginRequest").then(() => {
      cy.url().should("include", "/dashboard");
      expect(localStorage.getItem("userEmail")).to.equal("test@example.com");
    });
  });

  it("redirects to dashboard if user is already logged in", () => {
    // Simulate a logged-in state in localStorage
    localStorage.setItem("userId", "1");
    localStorage.setItem("userEmail", "test@example.com");

    // Reload the test and validate redirection
    mount(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    cy.url().should("include", "/dashboard");
  });
});
