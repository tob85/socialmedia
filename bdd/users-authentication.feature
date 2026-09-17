Feature: User Authentication and Registration

  As a new user
  I want to create an account and log in securely
  So that I can access my circle(s) and share content

  @auth
  @account
  Scenario Outline: User registers a new account

    Given the user provides valid registration information
    And the email format is correct (@example.com, etc.)
    When user submits the registration form
    Then an account should be created with unique identifier
    And a confirmation email should be sent

    Examples:
      | username      | email                | phone_number | full_name   |
      |---------------|----------------------|--------------|-------------|
      | john_doe123   | john.doe@example.com | +46701234567 | John Doe    |
      | jane_smith    | jane.smith@demo.nu   | +46709876543 | Jane Smith  |
      | mike_wilson_x | mike.w@gmail.com     | +46701122334 | Mike Wilson |


  @auth
  @security
  Scenario: User logs in with valid credentials

    Given existing registered user account
    And correct username and password combination

    When user enters login credentials
    Then user should be successfully authenticated
    And user session should be created
    And home page for circles should be displayed


  @auth
  @security
  Scenario Outline: Failed login attempt handling

    When invalid login credentials are provided
    Then authentication should fail gracefully
    And appropriate error message should be shown

    Examples:
      | credential_type | expected_action                    |
      |-----------------|------------------------------------|
      | wrong_password  | show password incorrect message    |
      | wrong_username  | show user not found message        |
      | empty_fields    | require all fields to be populated |


  @auth
  @reset
  Scenario Outline: Password reset flow

    When registered user requests password reset via email
    And valid reset link is provided via email
    Then user should be able to set new password
    And password reset token should expire correctly

    Examples:
      | reset_email      | reset_success_expected             |
      |------------------|------------------------------------|
      | test@example.com | success, new password can be set   |
      | invalid@domain   | no account found, security warning |
