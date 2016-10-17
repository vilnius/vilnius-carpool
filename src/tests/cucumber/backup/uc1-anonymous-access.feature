Feature: Anonymous access
  As an user
  I want to reach app anonymously
  So that all users could use app imediatly

  @ignore
  Scenario: View public trips anonymously
    Given User "user1@domain.com" entered trip:
      | from        | to         |
      | Filaretu 45 | Muitines 3 |
    When I go to home page
    Then I see public trip to "Muitines 3 |
