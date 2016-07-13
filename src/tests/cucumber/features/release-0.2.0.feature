Feature: uc9 Match-Request-Confirm-Pickup
  As a rider
  I want to get proposals when driver enters matching trips
  So that quickly reach the driver

  Background: Cleanup old trips and add new ones
    Given Trips removed
    And Notifications for "ron@tiktai.lt" removed
    And Notifications for "dick@tiktai.lt" removed
    And Assure stops:
      | Name              | Location                              |
      | Ciurlionio        | 25.2655, 54.6818                      |

    @focus
    Scenario: Match-request-confirm for Driver Dick and rider Ron
      Given I add trip as "ron@tiktai.lt":
        | trip-fromAddress        | trip-toAddress           | type  |
        | Muitinės g. 30, Vilnius | 3 Konstitucijos, Vilnius | ride  |
      When I add trip as "dick@tiktai.lt":
        | trip-fromAddress         | trip-toAddress       | type  |
        | Kauno g. 11, Vilnius     | 20 Krokuvos, Vilnius | drive |
      Then User "ron@tiktai.lt" gets notification, reviews ride and requests
      And user "dick@tiktai.lt" gets notification and confirms request
      And user "ron@tiktai.lt" gets confirmation and sends message "My phone 61122333"

    @ignore
    Scenario: Out of focus
      And Assure "ron@tiktai.lt" trip:
        | fromAddress          | toAddress               | role   |
        | 1 Paplaujos. Vilnius | Muitinės g. 35, Vilnius | rider  |
        | Dzūkų 50, Vilnius    | Šeškinės g. 10, Vilnius | driver |
