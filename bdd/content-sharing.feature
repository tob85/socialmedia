Feature: Content Sharing and Posts

  As a circle member
  I want to share content and messages with my circle
  So that we can communicate and stay connected

  @wip
  @circles
  @posts
  Scenario Outline: User creates a new post within their circle
  
    Given user is logged into a specific circle
    And the circle has active posting enabled
    When user writes and submits a post with content
    Then the post should appear in the feed for all circle members
    
    Examples:
      | post_content                | media_type    | visibility_scope | requires_approval |
      |-----------------------------|---------------|------------------|-------------------|
      | Happy birthday Sarah!       | text          | all_circle       | No                |
      | Project milestone achieved! | text + image  | all_circle       | No                |
      | Personal achievement update | text only     | friends_only     | Yes               |


  @wip
  @circles
  @posts
  Scenario Outline: User attaches media to a post
  
    Given circle allows media uploads
    And user has chosen an image/document/video
    When user submits post with media attachment
    Then media should be displayed in the post for all viewers
    
    Examples:
      | file_type   | max_size_mb | display_result               | compression_needed |
      |-------------|-------------|------------------------------|--------------------|
      | jpeg        | 5           | thumbnail + full view        | Yes                |
      | png         | 10          | original quality             | No                 |
      | mp4 video   | 50          | streamed, not full download  | Yes                |

  @ready
  @circles
  @posts
  Scenario: User creates a text post in a circle

    Given user opens the circle "Weekend Hangouts"
    When user writes and submits a post with content "Happy birthday Sarah!"
    Then the post "Happy birthday Sarah!" should appear in the feed
