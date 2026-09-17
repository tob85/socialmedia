Feature: User Roles and Profile

  As a registered user
  I want to manage my profile and understand my role in circles
  So that I can configure privacy settings appropriately

  @users
  @roles
  Scenario Outline: User profile information
  
    Given user account exists with basic data
    
    Examples:
      | field               | type          | visible_to_public   | visible_to_circle   |
      | display_name        | text (20 chars)| Yes (with approval) | All                  |
      | avatar              | image_url     | Yes                 | All                  |
      | join_date           | date          | No                  | All                  |
      | profile_bio         | text (500 char)| With moderation    | All                  |


  @users
  @roles
  Scenario: User upgrades to moderator role
  
    Given user is circle owner/admin
    
    When owner designates user as moderator
    And current permissions are notified
    Then user gains moderation capabilities
    And previous posts retain original authorship

  
  @users
  @privacy
  Scenario Outline: Privacy settings per user
  
    
    Examples:
      | email_visible        | visible_to         | show_online_status     |
      | No                   | Members only       | No                     |
      | Yes                  | Circle members     | Yes                    |
      | No (admin request)   | Admins only        | No                     |
