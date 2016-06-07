Feature: Send messages between users
  As a rider
  I want to send message to driver
  So that I could align pickup details

  Background: Clean old messages
    Given Messages removed

  Scenario: Send message from rider
    Given Login through "/loginUsername" with "ron@tiktai.lt"
    When I send messsage "Hello" to "dick@tiktai.lt"
    Then "dick@tiktai.lt" gets message "Hello" from "ron@tiktai.lt"

  @ignore
  Scenario: Out of scope
