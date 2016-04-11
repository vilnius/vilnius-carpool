Feature: uc8 Crud trips
As an user
I I want to search for a trip
So that quickly find matching ride

Background: Cleanup old trips
  Given Trips removed
  And Stops exists

  @trip
  Scenario: Driver saves the trip passing the stop
    Given Login with "user1@tiktai.lt"
    And I see "#trip-toAddress" in "/"
    When I enter:
      | trip-fromAddress   | trip-toAddress          |
      | Krivių 54, Vilnius | Muitinės g. 35, Vilnius |
    And I see ".from-geo-location"
    And I see ".to-geo-location"
    And Click on "[value='driver']"
    Then I see my trip
      | from                 | to                     |
      | 54 Krivių g. Vilnius | 35 Muitinės g. Vilnius |
    And I see the stops on the route:
      | name                 |
      | 54 Krivių g. Vilnius |
      | Filaretu             |
      | Kauno                |
