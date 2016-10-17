Feature: uc8 Crud trips
As an user
I I want to search for a trip
So that quickly find matching ride

Background: Cleanup old trips
  Given Trips removed
  And Stops exists
  And Notifications for "ron@tiktai.lt" removed
  And Notifications for "dick@tiktai.lt" removed

  @trip
  Scenario: Driver saves the trip passing the stop
    Given Login through "/loginUsername" with "dick@tiktai.lt"
    When I add trip as "dick@tiktai.lt":
      | trip-fromAddress     | trip-toAddress          | type   |
      | 3 Paplaujos. Vilnius | Muitinės g. 33, Vilnius | drive  |
    And I see the stops on the route:
      | name                 |
      | Kauno                |
      | Audejo               |
