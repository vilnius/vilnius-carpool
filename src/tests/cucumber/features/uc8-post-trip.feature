Feature: uc8 Crud trips
As an user
I I want to search for a trip
So that quickly find matching ride

Background: Cleanup old trips
  Given Trips removed
  And Stops exists
  And Notifications for "ron@tiktai.lt" removed
  And Notifications for "dick@tiktai.lt" removed

  @trip  @focus
  Scenario: Driver saves the trip passing the stop
    Given Login through "/loginUsername" with "dick@tiktai.lt"
    And I see "[data-cucumber='addTrip']" in "/m/all/offers"
    And Click on "[data-cucumber='addTrip']"
    When I enter:
      | trip-fromAddress     | trip-toAddress          |
      | 3 Paplaujos. Vilnius | Muitinės g. 33, Vilnius |
    And Clicked on ".saveTrip" to see saved drive
      | fromAddress          | toAddress               | role   |
      | 3 Paplaujos. Vilnius | Muitinės g. 33, Vilnius | rider  |
    And I see the stops on the route:
      | name                 |
      | Kauno                |
      | Audejo               |

  @recurrent
  Scenario: Dick enters recurrent trip, Ron enters matching and gets notification
    Given Login through "/loginUsername" with "dick@tiktai.lt"
    And I see "[data-cucumber='addTrip']" in "/m/all/offers"
    And Click on "[data-cucumber='addTrip']"
    And I enter:
      | trip-fromAddress     | trip-toAddress          |
      | 1 Traidenio. Vilnius | Muitinės g. 33, Vilnius |
    And Set recurrent trips "0,1,4"
    And Element is gone "[data-cucumber='set-recurrent']"
    And Clicked on ".saveTrip" to see saved drive
      | fromAddress          | toAddress               | role    |
      | 1 Traidenio. Vilnius | Muitinės g. 33, Vilnius | driver  |
    When Login through "/loginUsername" with "ron@tiktai.lt"
    And I see "[data-cucumber='addTrip']" in "/m/all/offers"
    And Click on "[data-cucumber='addTrip']"
    When I enter into "[data-cucumber='add-trip-form']":
      | trip-fromAddress     | trip-toAddress          |
      | 2 Traidenio. Vilnius | Muitinės g. 32, Vilnius |
    And Click on "[value='rider']"
    And Clicked on ".saveTrip" to see saved ride
      | fromAddress          | toAddress               | role   |
      | 2 Traidenio. Vilnius | Muitinės g. 32, Vilnius | rider  |
    Then User "dick@tiktai.lt" gets notification and reviews drive

  #  Currently recurrent trip is matching only because it have bTime also
  # thus notification will be send only once
  @recurrent
  Scenario: Dick enters trip, Ron - recurrent matching and Dick gets notification
    Given Login through "/loginUsername" with "dick@tiktai.lt"
    And I see "[data-cucumber='addTrip']" in "/m/all/offers"
    And Click on "[data-cucumber='addTrip']"
    And I enter:
      | trip-fromAddress     | trip-toAddress          |
      | 1 Traidenio. Vilnius | Muitinės g. 33, Vilnius |
    And Clicked on ".saveTrip" to see saved drive
      | fromAddress          | toAddress               | role    |
      | 1 Traidenio. Vilnius | Muitinės g. 33, Vilnius | driver  |
    When Login through "/loginUsername" with "ron@tiktai.lt"
    And I see "[data-cucumber='addTrip']" in "/m/all/offers"
    And Click on "[data-cucumber='addTrip']"
    When I enter:
      | trip-fromAddress     | trip-toAddress          |
      | 2 Traidenio. Vilnius | Muitinės g. 32, Vilnius |
    And Click on "[data-cucumber='recurrent-date']"
    And Click on "[data-cucumber='day-1']"
    And Click on "[data-cucumber='set-recurrent']"
    And Element is gone "[data-cucumber='set-recurrent']"
    And Click on "[value='rider']"
    And Clicked on ".saveTrip" to see saved ride
      | fromAddress          | toAddress               | role   |
      | 2 Traidenio. Vilnius | Muitinės g. 32, Vilnius | rider  |
    Then User "dick@tiktai.lt" gets notification and reviews drive
