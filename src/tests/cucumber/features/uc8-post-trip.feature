Feature: uc8 Crud trips
As an user
I I want to search for a trip
So that quickly find matching ride

Background: Cleanup old trips
  Given Trips removed
  And Stops exists

  @trip @focus
  Scenario: Driver saves the trip passing the stop
    Given Login through "/loginUsername" with "dick@tiktai.lt"
    And I see "[data-cucumber='addTrip']" in "/m/all/offers"
    And Click on "[data-cucumber='addTrip']"
    When I enter:
      | trip-fromAddress     | trip-toAddress          |
      | 3 Paplaujos. Vilnius | Muitinės g. 33, Vilnius |
    And Clicked on ".saveTrip" to see saved trip
      | fromAddress          | toAddress               | role   |
      | 3 Paplaujos. Vilnius | Muitinės g. 33, Vilnius | rider  |
    And I see the stops on the route:
      | name                 |
      | 54 Krivių g. Vilnius |
      | Filaretu             |
      | Kauno                |
