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
      When I add trip:
        | trip-fromAddress     | trip-toAddress          | type  |
        | 3 Paplaujos. Vilnius | Muitinės g. 33, Vilnius | drive |
      Then User "ron@tiktai.lt" gets notification, reviews ride and requests
      And user "dick@tiktai.lt" gets notification and confirms request
      And user "ron@tiktai.lt" gets confirmation and sends message "My phone 61122333"


    @ignore
    Scenario: Out of focus
