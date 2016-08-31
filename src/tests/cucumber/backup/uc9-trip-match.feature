Feature: uc9 Notify on matching trip
  As a rider
  I want to get proposals when driver enters matching trips
  So that quickly reach the driver

  Background: Cleanup old trips and add new ones
    Given Trips removed
    And Notifications for "user1@tiktai.lt" removed
    And Notifications for "user2@tiktai.lt" removed
    And Stops exists
    And Assure "user1@tiktai.lt" trip:
      | fromAddress          | toAddress               | role   |
      | 1 Paplaujos. Vilnius | Muitinės g. 35, Vilnius | rider  |
      | Dzūkų 54, Vilnius    | Šeškinės g. 10, Vilnius | driver |

  @trip @ignore
  Scenario: Driver Bob enters the same route and rider Ana gets notification
    Given Login with "user2@tiktai.lt"
    And I see "#trip-toAddress" in "/"
    When I enter:
      | trip-fromAddress     | trip-toAddress          |
      | 54 Krivių g. Vilnius | Muitinės g. 35, Vilnius |
    And I see ".from-geo-location"
    And I see ".to-geo-location"
    And Click on "[value='driver']"
    And I see my trip
      | from                 | to                     |
      | 54 Krivių g. Vilnius | 35 Muitinės g. Vilnius |
    Then User "user1@tiktai.lt" gets notification and sends request
    And user "user2@tiktai.lt" aproves request
    And user "user1@tiktai.lt" sees pickup stop
