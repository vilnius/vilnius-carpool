Feature: uc9 Notify on matching trip
  As a rider
  I want to get proposals when driver enters matching trips
  So that quickly reach the driver

  Background: Cleanup old trips
    Given Trip removed
    And Stops exists
    And Assure "user1@tiktai.lt" trip:
      | fromAddress        | toAddress               | role   |
      | Krivių 68, Vilnius | Muitinės g. 35, Vilnius | rider  |
      | Dzūkų 54, Vilnius  | Šeškinės g. 10, Vilnius | driver |

  @focus
  Scenario: Driver enters the same route
    Given Login with "user2@tiktai.lt"
    And I see "#trip-toAddress" in "/"
    When I enter:
      | trip-fromAddress   | trip-toAddress          |
      | Krivių 68, Vilnius | Muitinės g. 35, Vilnius |
    And I see ".from-geo-location"
    And I see ".to-geo-location"
    And Click on "[value='driver']"
    Then User "user1@tiktai.lt" get notification
