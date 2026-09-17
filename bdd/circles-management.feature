Feature: Circle Creation and Management

  As a user
  I want to create and join smaller groups called "circles"
  So that I can create focused communities with friends, colleagues, or family

  @circles
  @management
  Scenario Outline: User creates a new circle

    Given logged in user with valid authentication
    And the user is a member of at least one existing group
    When user creates a new circle via "Create Circle" button
    Then a new empty circle should be created
    And current user should be automatically added as owner

    Examples:
      | circle_name       | circle_type | visibility  | description                     |
      |-------------------|-------------|-------------|---------------------------------|
      | Weekend Hangouts  | friends     | private     | Friends who hangout on weekends |
      | Work Project Team | colleagues  | private     | Tech project team alpha         |
      | Family Reunion    | family      | invite_only | For upcoming reunion planning   |


  @circles
  @membership  
  Scenario Outline: User joins an existing circle

    When logged in user clicks "Join" button on a public circle page
    And the circle is set to accept direct join requests
    Then user is added as member after approval OR automatically if settings allow

    Examples:
      | circle_name       | invite_required | approval_needed    | join_result             |
      |-------------------|-----------------|--------------------|-------------------------|
      | Hiking Group      | Yes             | Admin approval req | Pending, awaiting admin |
      | Open Study Circle | No              | Automatic          | Joined immediately      |
      | Private Chat Room | Yes             | Admin approval req | Pending, awaiting admin |


  @circles
  @membership  
  Scenario: User views their own circles dashboard

    When user navigates to "My Circles" section
    Then all circles where user is a member should be listed
    And the circle owner status should highlight for owned circles
    And option to leave any circle (except owned ones) should appear
