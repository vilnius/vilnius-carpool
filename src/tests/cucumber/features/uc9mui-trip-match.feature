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
    Scenario: Driver Dick enters the same route and rider Ron gets notification
      Given Login through "/loginUsername" with "dick@tiktai.lt"
      And I see "[data-cucumber='addTrip']" in "/"
      And Click on "[data-cucumber='addTrip']"
      When I enter:
        | trip-fromAddress     | trip-toAddress          |
        | 1 Paplaujos. Vilnius | Muitinės g. 35, Vilnius |
      And Click on ".saveTrip"
      And I see my MUI trip
        | fromAddress          | toAddress               | role   |
        | 1 Paplaujos. Vilnius | Muitinės g. 35, Vilnius | rider  |
      Then User "ron@tiktai.lt" gets mui notification and sends request
      And user "dick@tiktai.lt" confirms request on mui

    Scenario: Out of focus
