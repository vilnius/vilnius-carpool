// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by carpool-chat.js.
import { name as packageName } from "meteor/carpool-chat";

// Write your tests here!
// Here is an example.
Tinytest.add('carpool-chat - example', function (test) {
  test.equal(packageName, "carpool-chat");
});
