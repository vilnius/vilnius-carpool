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

    @focus
    Scenario: Match-request-confirm for Driver Dick and rider Ron
      Given Login through "/loginUsername" with "dick@tiktai.lt"
      And I see "[data-cucumber='addTrip']" in "/m/all/offers"
      And Click on "[data-cucumber='addTrip']"
      When I enter:
        | trip-fromAddress     | trip-toAddress          |
        | 3 Paplaujos. Vilnius | Muitinės g. 33, Vilnius |
      And Clicked on ".saveTrip" to see saved drive
        | fromAddress          | toAddress               | role   |
        | 3 Paplaujos. Vilnius | Muitinės g. 33, Vilnius | rider  |
      Then User "ron@tiktai.lt" gets notification and sends request on MUI
      And user "dick@tiktai.lt" gets notification and confirms request on MUI
      And user "ron@tiktai.lt" gets confirmation and sends message "My phone 61122333"

    @notification
    Scenario: Driver Dick enters the same route and rider Ron gets notification
      Given Login through "/loginUsername" with "dick@tiktai.lt"
      And I see "[data-cucumber='addTrip']" in "/m/all/offers"
      And Click on "[data-cucumber='addTrip']"
      When I enter:
        | trip-fromAddress     | trip-toAddress          |
        | 3 Paplaujos. Vilnius | Muitinės g. 33, Vilnius |
      And Clicked on ".saveTrip" to see saved drive
        | fromAddress          | toAddress               | role   |
        | 3 Paplaujos. Vilnius | Muitinės g. 33, Vilnius | rider  |
      Then User "ron@tiktai.lt" gets notification and reviews ride


    @ignore
    Scenario: Out of focus
