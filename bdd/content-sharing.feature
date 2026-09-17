Feature: Content Sharing and Posts

  As a circle member
  I want to share content and messages with my circle
  So that we can communicate and stay connected

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
