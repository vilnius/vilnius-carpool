Feature: uc9 Match-Request-Confirm-Pickup on MUI
  As a rider
  I want to get proposals when driver enters matching trips
  So that quickly reach the driver

  Background: Cleanup old trips and add new ones
    Given Trips removed
    And Notifications for "ron@tiktai.lt" removed
    And Notifications for "dick@tiktai.lt" removed
    And Stops exists
    And Assure "ron@tiktai.lt" trip:
      | fromAddress          | toAddress               | role   |
      | 1 Paplaujos. Vilnius | Muitinės g. 35, Vilnius | rider  |
      | Dzūkų 50, Vilnius    | Šeškinės g. 10, Vilnius | driver |
      | Kauno 11, Vilnius    | Vilniaus g. 13, Vilnius | rider |

    @ignore
    Scenario: Driver Dick enters two trips and  Ron gets correct notifications
      Given Login through "/loginUsername" with "dick@tiktai.lt"
      And I see "[data-cucumber='addTrip']" in "/"
      And Click on "[data-cucumber='addTrip']"
      When I enter:
        | trip-fromAddress     | trip-toAddress          |
        | 3 Paplaujos. Vilnius | Muitinės g. 33, Vilnius |
      And Click on ".saveTrip"
      And I see "[data-cucumber='screen-name']"
      And Click on "[data-cucumber='addTrip']"
      When I enter:
        | trip-fromAddress     | trip-toAddress          |
        | Kauno 11, Vilnius    | Vilniaus g. 13, Vilnius | driver |
      And Click on ".saveTrip" to see "[data-cucumber='screen-name']"
