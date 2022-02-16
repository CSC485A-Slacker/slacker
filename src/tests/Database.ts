import { Pin, PinDetails } from "../data/Pin"

import { Database } from "../data/Database"
import { GeoPoint } from "firebase/firestore/lite";

const database = new Database();
var passedCount = 0;
var totalCount = 0;

const pin1 = new Pin(
    new GeoPoint(2, 0), 
    new PinDetails("a damn fine spot",10,"good one")
    );

const pin2 = new Pin(
  new GeoPoint(0, 1),
  new PinDetails("a damn bad spot", 1, "bad one")
);

const pin3 = new Pin(
  new GeoPoint(0, 0),
  new PinDetails("a damn funky spot", 1, "funky one")
);

const pin4 = new Pin(
  new GeoPoint(0, 2),
  new PinDetails("another pin", 1, "funny pin")
);

async function TestGetAllPinLocations()
{
    await database.addPin(pin1);
    await database.addPin(pin2);
    await database.addPin(pin3);

    console.log("Test get all pin locations:\n");

    const result = await database.getAllPinLocations();
    var passed = result.succeeded == true;

    if (passed) passedCount++;
    totalCount++;

    console.log(`Passed: ${passed}. ${result.message}`);
    console.log(`data:\n`);

    if (result.data != undefined) {
    result.data.forEach((location) => {
        console.log(location);
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

    if(result.data != undefined) {
        result.data.forEach((pin) => {
          console.log(pin);
        });
    }
    
}

async function TestDeletePin() {
    console.log("Test delete pin\n");
  
    await database.addPin(pin1);

    console.log("delete existing pin");
    var result = await database.deletePin(new GeoPoint(2, 0));
    var passed = result.succeeded == true;
    console.log(`Passed: ${passed}. ${result.message}`);
    console.log("\n");

    if (passed) passedCount++;
    totalCount++;

    console.log("delete non-existent pin");
    result = await database.deletePin(new GeoPoint(5, 0));
    passed = result.succeeded == false;
    console.log(`Passed: ${passed}. ${result.message}`);
    console.log("\n");

    if (passed) passedCount++;
    totalCount++;
}

async function TestGetPin () {
    console.log("Test getPin:\n");
    await database.addPin(pin1);

    console.log("get existing pin")
    var result = await database.getPin(new GeoPoint(2, 0));
    var passed = result.succeeded == true;
    console.log(`Passed: ${passed}. ${result.message}`);
    console.log(`data:\n${result.data}\n`);

    if (passed) passedCount++;
    totalCount++;

    console.log("get non-existent pin")
    result = await database.getPin(new GeoPoint(5, 0));
    passed = result.succeeded == false;
    console.log(`Passed: ${passed}. ${result.message}`);
    console.log(`data:\n${result.data}\n`);

    if (passed) passedCount++;
    totalCount++;
}

async function TestAddPin () {
    console.log("Test add pin");

    await database.deletePin(pin1.location);
    await database.deletePin(pin2.location);
    await database.deletePin(pin3.location);
    
    console.log("add new pin 1");
    var result = await database.addPin(pin1);
    var passed = result.succeeded == true;
    console.log(`Passed: ${passed}. ${result.message}`);
    console.log('\n');

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

    await database.deletePin(pin1.location);
    await database.deletePin(pin2.location);
    await database.addPin(pin1);
    
    console.log("edit existing pin");

    var existingResult = await database.getPin(pin1.location)
    var existingPin = existingResult.data

    console.log(`pin before edit:\n${existingPin}`)

    var result = await database.editPinDetails(pin1.location, new PinDetails("edited description", 420, "edited slackline type"));

    existingResult = await database.getPin(pin1.location)
    existingPin = existingResult.data;

    console.log(`pin after edit:\n${existingPin}`);

    var passed = result.succeeded == true;
    console.log(`Passed: ${passed}. ${result.message}`);
    console.log("\n");

    if (passed) passedCount++;
    totalCount++;

    console.log("edit non-existent pin");
    result = await database.editPinDetails(pin2.location, new PinDetails("edited description", 420, "edited slackline type"));
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
    await TestGetAllPinLocations();
    await TestEditPinDetails();

    console.log(`PASSED: ${passedCount}/${totalCount}`);
}

export { TestAddPin, TestGetPin, TestDeletePin, TestGetAllPins, TestGetAllPinLocations, TestEditPinDetails, TestAll }