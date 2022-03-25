import { assert } from "@firebase/util";
import { deleteUser } from "firebase/auth";
import { Database } from "../data/Database";
import { User } from "../data/User";

const userID1 = "1"
const UpdatedCheckInSPot = 27
const user1 = new User(userID1, 0, "user", []);

async function testUser() {
  const db = new Database();
  var retrievedUser = await db.getUser(userID1);

  if (retrievedUser._userID == userID1) {
    await db.deleteUser(userID1);
  }

  await db.addUser(new User(userID1, 0, "user" []));

  var retrievedUser = await db.getUser(userID1);

  console.log(retrievedUser._userID, userID1);

  await db.ChangeCheckInSpot(userID1, UpdatedCheckInSPot);

  retrievedUser = await db.getUser(userID1);

  console.log(retrievedUser._checkInSpot, UpdatedCheckInSPot);
}

async function testGetAllUsers()
{
    const db = new Database()
    const allUsers = await db.getAllUsers()
    allUsers.data?.forEach(user => {
        console.log(user)
    })
}

export default testGetAllUsers
