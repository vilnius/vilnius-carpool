Feature: uc8 Post the trip
As an user
I I want to search for a trip
So that quickly find matching ride

Background: Cleanup old trips
  Given Trip removed
  And Stops exists

  #@focus
  Scenario: Driver saves the trip passing the stop
    Given Login with "user1@tiktai.lt"
    And I see "#trip-toAddress" in "/"
    When I enter:
      | trip-fromAddress   | trip-toAddress          |
      | Krivių 68, Vilnius | Muitinės g. 35, Vilnius |
    And I see ".from-geo-location"
    And I see ".to-geo-location"
    And Click on "[value='driver']"
    Then I see my trip
      | from               | to                      |
      | Krivių 68, Vilnius | Muitinės g. 35, Vilnius |
    And I see the stop "Filaretu" on the route
