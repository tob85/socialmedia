@ready
Feature: Frontend smoke

  Scenario: Welcome page loads
    Given the user opens the app
    Then the welcome heading is visible

  Scenario: Register page has input fields
    Given the user opens the register page
    When the user types an email and password
    Then the email and password fields show the typed values

  Scenario: Login page has input fields
    Given the user opens the login page
    When the user types an email and password
    Then the email and password fields show the typed values
