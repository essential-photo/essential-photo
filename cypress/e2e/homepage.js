const { When, Then } = require("@badeball/cypress-cucumber-preprocessor");

When("I visit essential photo", () => {
  cy.visit('/')
});

Then("I should see the Essential Photo header", () => {
  cy.contains('Essential Photo').should('be.visible');
});