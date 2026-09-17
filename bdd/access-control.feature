Feature: Access Control and Permissions

  As a circle member or owner
  I want to control who can see posts and what actions they can take
  So that our circle maintains privacy and appropriate boundaries

  @circles
  @permissions
  Scenario Outline: Circle visibility settings

    Given user owns a circle
    When user sets visibility to "public"
    Then anyone can view the circle page and join if invited

    And when user sets visibility to "private"
    Then only approved members can view and post
    Then non-members see "Request to Join" button

  @circles
  @permissions
  Scenario Outline: Post visibility within circles

    When posting content with "Everyone in circle" visibility
    Then all current members can see the post
    And posts are not visible outside the circle

    When posting content as admin with moderation enabled
    Then posts awaiting approval are hidden from default view
    And only admins/operators can approve or reject


  @circles
  @permissions
  Scenario Outline: Action permissions by role

    Given roles: admin, moderator, member, viewer

    Examples:
      | role      | can_post | can_delete_own | can_delete_others | can_approve_posts |
      |-----------|----------|----------------|-------------------|-------------------|
      | admin     | Yes      | Yes            | Yes with reason   | Yes               |
      | moderator | Yes      | Yes            | No                | Yes if configured |
      | member    | Yes      | Yes            | No                | No                |
      | viewer    | No       | N/A            | N/A               | No                |
