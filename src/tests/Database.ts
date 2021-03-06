import { Pin, PinActivity, PinDetails, PinReview, PinPhoto } from "../data/Pin";

import { Database } from "../data/Database";
import { Timestamp } from "firebase/firestore";

const database = new Database();
var passedCount = 0;
var totalCount = 0;

const pin1 = new Pin(
  1,
  { latitude: 0, longitude: 1 },
  new PinDetails("nice", "a damn fine spot", 10, "good one", "red", false),
  [new PinReview("key1", "comment comment", 4.5, new Date().toJSON())],
  [new PinPhoto("url1", new Date().toJSON())],
  new PinActivity(false, 0, 10)
);

const pin2 = new Pin(
  2,
  { latitude: 3, longitude: 1 },
  new PinDetails("Bad", "a damn bad spot", 1, "bad one", "red", false),
  [new PinReview("key2", "comment comment", 1.5, new Date().toJSON())],
  [new PinPhoto("url2", new Date().toJSON())],
  new PinActivity(false, 0, 0)
);

const pin3 = new Pin(
  3,
  { latitude: 1, longitude: 2 },
  new PinDetails("funky", "a damn funky spot", 1, "funky one", "red", false),
  [new PinReview("key3", "comment comment", 3.5, new Date().toJSON())],
  [new PinPhoto("url3", new Date().toJSON())],
  new PinActivity(true, 3, 15)
);

const pin4 = new Pin(
  4,
  { latitude: 2, longitude: 2 },
  new PinDetails("a", "another pin", 1, "funny pin", "red", false),
  [new PinReview("key4", "comment comment", 3.5, new Date().toJSON())],
  [new PinPhoto("url4", new Date().toJSON())],
  new PinActivity(true, 1, 3)
);

async function TestGetAllPinCoordinates() {
  await database.addPin(pin1);
  await database.addPin(pin2);
  await database.addPin(pin3);

  console.log("Test get all pin coordinates:\n");

  const result = await database.getAllPinCoordinates();
  var passed = result.succeeded == true;

  if (passed) passedCount++;
  totalCount++;

  console.log(`Passed: ${passed}. ${result.message}`);
  console.log(`data:\n`);

  if (result.data != undefined) {
    result.data.forEach((coordinate) => {
      console.log(coordinate);
    });
  }
}

async function TestGetAllPins() {
  await database.addPin(pin1);
  await database.addPin(pin2);
  await database.addPin(pin3);

  console.log("Test get all pins:\n");

  const result = await database.getAllPins();
  var passed = result.succeeded == true;

  if (passed) passedCount++;
  totalCount++;

  console.log(`Passed: ${passed}. ${result.message}`);
  console.log(`data:\n`);

  if (result.data != undefined) {
    result.data.forEach((pin) => {
      console.log(pin);
    });
  }
}

async function TestDeletePin() {
  console.log("Test delete pin\n");

  await database.addPin(pin1);

  console.log("delete existing pin");
  var result = await database.deletePin({ latitude: 0, longitude: 1 });
  var passed = result.succeeded == true;
  console.log(`Passed: ${passed}. ${result.message}`);
  console.log("\n");

  if (passed) passedCount++;
  totalCount++;

  console.log("delete non-existent pin");
  result = await database.deletePin({ latitude: 5, longitude: 0 });
  passed = result.succeeded == false;
  console.log(`Passed: ${passed}. ${result.message}`);
  console.log("\n");

  if (passed) passedCount++;
  totalCount++;
}

async function TestGetPin() {
  console.log("Test getPin:\n");
  await database.addPin(pin1);

  console.log("get existing pin");
  var result = await database.getPin(pin1.coordinate);
  var passed = result.succeeded == true;
  console.log(`Passed: ${passed}. ${result.message}`);
  console.log(`data:\n${result.data}\n`);

  if (passed) passedCount++;
  totalCount++;

  console.log("get non-existent pin");
  result = await database.getPin({ latitude: 5, longitude: 0 });
  passed = result.succeeded == false;
  console.log(`Passed: ${passed}. ${result.message}`);
  console.log(`data:\n${result.data}\n`);

  if (passed) passedCount++;
  totalCount++;
}

async function TestAddPin() {
  console.log("Test add pin");

  await database.deletePin(pin1.coordinate);
  await database.deletePin(pin2.coordinate);
  await database.deletePin(pin3.coordinate);

  console.log("add new pin 1");
  var result = await database.addPin(pin1);
  var passed = result.succeeded == true;
  console.log(`Passed: ${passed}. ${result.message}`);
  console.log("\n");

  if (passed) passedCount++;
  totalCount++;

  console.log("add new pin 2");
  result = await database.addPin(pin2);
  passed = result.succeeded == true;
  console.log(`Passed: ${passed}. ${result.message}`);
  console.log("\n");

  if (passed) passedCount++;
  totalCount++;

  console.log("add new pin 3");
  result = await database.addPin(pin3);
  passed = result.succeeded == true;
  console.log(`Passed: ${passed}. ${result.message}`);
  console.log("\n");

  if (passed) passedCount++;
  totalCount++;

  console.log("try to add pin 1");
  result = await database.addPin(pin1);
  passed = result.succeeded == false;
  console.log(`Passed: ${passed}. ${result.message}`);
  console.log("\n");

  if (passed) passedCount++;
  totalCount++;
}

async function TestEditPinDetails() {
  console.log("Test edit pin\n");

  await database.deletePin(pin1.coordinate);
  await database.deletePin(pin2.coordinate);
  await database.addPin(pin1);

  console.log("edit existing pin");

  var existingResult = await database.getPin(pin1.coordinate);
  var existingPin = existingResult.data;

  console.log(`pin before edit:\n${existingPin}`);

  var result = await database.editPinDetails(
    pin1.coordinate,
    new PinDetails(
      "edit",
      "edited description",
      420,
      "edited slackline type",
      "red",
      false
    )
  );

  existingResult = await database.getPin(pin1.coordinate);
  existingPin = existingResult.data;

  console.log(`pin after edit:\n${existingPin}`);

  var passed = result.succeeded == true;
  console.log(`Passed: ${passed}. ${result.message}`);
  console.log("\n");

  if (passed) passedCount++;
  totalCount++;

  console.log("edit non-existent pin");
  result = await database.editPinDetails(
    pin2.coordinate,
    new PinDetails(
      "edit",
      "edited description",
      420,
      "edited slackline type",
      "red",
      false
    )
  );
  passed = result.succeeded == false;
  console.log(`Passed: ${passed}. ${result.message}`);
  console.log("\n");

  if (passed) passedCount++;
  totalCount++;
}

async function TestEditPinReviews() {
  console.log("Test edit pin reviews\n");

  await database.deletePin(pin1.coordinate);
  await database.deletePin(pin2.coordinate);
  await database.addPin(pin1);

  console.log("edit existing pin reviews");

  var existingResult = await database.getPin(pin1.coordinate);
  var existingPin = existingResult.data;

  console.log(`pin before edit:\n${existingPin}`);

  pin1.reviews.push(
    new PinReview("key1", "Pretty decent spot", 4, new Date().toJSON())
  );

  var result = await database.editPinReviews(pin1.coordinate, pin1.reviews);

  existingResult = await database.getPin(pin1.coordinate);
  existingPin = existingResult.data;

  console.log(`pin after edit:\n${existingPin}`);

  var passed = result.succeeded == true;
  console.log(`Passed: ${passed}. ${result.message}`);
  console.log("\n");

  if (passed) passedCount++;
  totalCount++;

  console.log("add another existing pin reviews");

  var existingResult = await database.getPin(pin1.coordinate);
  var existingPin = existingResult.data;

  console.log(`pin before edit:\n${existingPin}`);

  pin1.reviews.push(
    new PinReview("key2", "Horrible spot", 2, new Date().toJSON())
  );

  var result = await database.editPinReviews(pin1.coordinate, pin1.reviews);

  existingResult = await database.getPin(pin1.coordinate);
  existingPin = existingResult.data;

  console.log(`pin after edit:\n${existingPin}`);

  var passed = result.succeeded == true;
  console.log(`Passed: ${passed}. ${result.message}`);
  console.log("\n");

  if (passed) passedCount++;
  totalCount++;

  console.log("edit non-existent pin");

  pin2.reviews.push(
    new PinReview("key2", "Where are ya", 4, new Date().toJSON())
  );

  result = await database.editPinReviews(pin2.coordinate, pin2.reviews);
  passed = result.succeeded == false;
  console.log(`Passed: ${passed}. ${result.message}`);
  console.log("\n");

  if (passed) passedCount++;
  totalCount++;
}
async function TestEditPinPhotos() {
  console.log("Test edit pin photos\n");

  await database.deletePin(pin1.coordinate);
  await database.deletePin(pin2.coordinate);
  await database.addPin(pin1);

  console.log("edit existing pin photos");

  var existingResult = await database.getPin(pin1.coordinate);
  var existingPin = existingResult.data;

  console.log(`pin before edit:\n${existingPin}`);

  pin1.photos.push(
    new PinPhoto("image1", new Date().toJSON())
  );

  var result = await database.editPinPhotos(pin1.coordinate, pin1.photos);

  existingResult = await database.getPin(pin1.coordinate);
  existingPin = existingResult.data;

  console.log(`pin after edit:\n${existingPin}`);

  var passed = result.succeeded == true;
  console.log(`Passed: ${passed}. ${result.message}`);
  console.log("\n");

  if (passed) passedCount++;
  totalCount++;

  console.log("edit non-existent pin");

  pin2.photos.push(
    new PinPhoto("imageNotFound", new Date().toJSON())
  );

  result = await database.editPinPhotos(pin2.coordinate, pin2.photos);
  passed = result.succeeded == false;
  console.log(`Passed: ${passed}. ${result.message}`);
  console.log("\n");

  if (passed) passedCount++;
  totalCount++;
}

async function TestAll() {
  console.log("TEST ALL");

  passedCount = 0;
  totalCount = 0;

  await TestAddPin();
  await TestGetPin();
  await TestDeletePin();
  await TestGetAllPins();
  await TestGetAllPinCoordinates();
  await TestEditPinDetails();
  await TestEditPinReviews();
  await TestEditPinPhotos();

  console.log(`PASSED: ${passedCount}/${totalCount}`);
}

export {
  TestAddPin,
  TestGetPin,
  TestDeletePin,
  TestGetAllPins,
  TestGetAllPinCoordinates,
  TestEditPinDetails,
  TestEditPinReviews,
  TestEditPinPhotos,
  TestAll,
};
