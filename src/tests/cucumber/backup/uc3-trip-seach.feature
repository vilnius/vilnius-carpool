Feature: uc3 Search for the trip
  As an user
  I want to enter the trip
  So that other users can get matches to share the ride

  Background: Cleanup old trips
    Given Trips removed
    And Stops exists
    And Assure "user1@tiktai.lt" trip:
      | fromAddress        | toAddress               |
      | Krivių 68, Vilnius | Muitinės g. 35, Vilnius |
      | Dzūkų 54, Vilnius  | Šeškinės g. 10, Vilnius |

  @ignore
  Scenario: User searches by exact address
    Given Login with "user2@tiktai.lt"
    And I see "#trip-toAddress" in "/"
    When I enter:
      | trip-fromAddress   | trip-toAddress          |
      | Krivių 68, Vilnius | Muitinės g. 35, Vilnius |
    And I see ".from-geo-location"
    And I see ".to-geo-location"
    Then I see active trip
      | from               | to                      |
      | Krivių 68, Vilnius | Muitinės g. 35, Vilnius |
    #And I see the stop "Filaretu" on the route
    And I see the stops on the route:
      | name     |
      | Filaretu |
      | Kauno    |

  @ignore @trip
  Scenario: User enters destination for no trips
    Given Login with "user2@tiktai.lt"
    And I see "#trip-toAddress" in "/"
    When I enter:
      | trip-fromAddress   | trip-toAddress          |
      | Krivių 68, Vilnius | Architektų 3, Vilnius |
    And I see ".from-geo-location"
    And I see ".to-geo-location"
    Then I see no trips filtered
