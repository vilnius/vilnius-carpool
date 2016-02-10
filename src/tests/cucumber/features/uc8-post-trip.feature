Feature: Post the trip
  As an user
  I want to enter the trip
  So that other users can get matches to share the ride

  Background: Cleanup old trips
    Given Trip removed

  Scenario: Driver saves the trip
    Given Login with "user1@tiktai.lt"
    When I enter:
      | trip-fromAddress      | trip-toAddress   |
      | Kauno g., 11, Vilnius | Muitines 35      |
    And I see ".from-geo-location"
    And I see ".to-geo-location"
    And Click on "[value='driver']"
