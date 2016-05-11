// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by carpool-view-flow.js.
import { name as packageName } from "meteor/carpool-view-flow";

// Write your tests here!
// Here is an example.
Tinytest.add('carpool-view-flow - example', function (test) {
  test.equal(packageName, "carpool-view-flow");
});
