Feature: uc9 Match-Request-Confirm-Pickup on MUI
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
      | Dzūkų 50, Vilnius    | Šeškinės g. 10, Vilnius | driver |

    @ignore
    Scenario: Driver Bob enters the same route and rider Ana gets notification
      Given Login with "user2@tiktai.lt"
      And I see ".addTrip" in "/mui"
      And Click on ".addTrip"
      When I enter:
        | trip-fromAddress     | trip-toAddress          |
        | 1 Paplaujos. Vilnius | Muitinės g. 35, Vilnius |
      And Click on ".saveTrip"
      And I see my MUI trip
        | from                   | to                     |
        | 1 Paplaujos g. Vilnius | 35 Muitinės g. Vilnius |
      Then User "user1@tiktai.lt" gets mobile notification and sends request
      And user "user2@tiktai.lt" aproves request on mobile
