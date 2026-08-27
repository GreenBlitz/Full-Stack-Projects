interface User {
  id: number;
  name: string;
  email: string;
}

interface UserDB {
  users: User[];
  admin: User;
  isSql: boolean;
}

function userSortFunction(user1: User, user2: User): number {
  return user1.id - user2.id;
}

function printUser(user: User): void {
  console.log("id: " + user.id);
  console.log("name: " + user.name);
  console.log("email: " + user.email);
}

function getName(user: User): string {
  return user.name;
}

function isUniqueArray<T>(array: T[], item: T) {
  if (array.length == 0) {
    return true;
  }
  if (array[0] === item) {
    return false;
  }
  return isUniqueArray(array.slice(1), array[0]);
}

function verifyEmails(users: User[]): boolean {
  if (users.length <= 1) return true;
  return isUniqueArray(
    users.slice(1).map((user: User) => user.email),
    users[0].email,
  );
}

function getUserById(users: User[], id: number): User | undefined {
  return users.find((user: User) => user.id === id);
}

function getLowestId(users: User[], start_id: number = 1): number {
  return getUserById(users, start_id) === undefined
    ? start_id
    : getLowestId(users, start_id + 1);
}

function addUser(users: User[], name: string, email: string): void {
  const user: User = { id: getLowestId(users), name: name, email: email };
  users.push(user);
}

function getEmails(db: UserDB): string[] {
  return db.users.map((user: User) => user.email);
}

function choosePreferedAdmin(db1: UserDB, db2: UserDB): User {
  return db1.admin.id > db2.admin.id ? db1.admin : db2.admin;
}

function removeUser(db: UserDB, user: User): User[] {
  return db.users.filter((currentUser: User) => currentUser !== user);
}

function combineUsers(users1: User[], users2: User[]): User[] {
  return [...users1, ...users2];
}

function combineDB(db1: UserDB, db2: UserDB): UserDB {
  const adminUser: User = choosePreferedAdmin(db1, db2);
  const users1: User[] = removeUser(db1, adminUser);
  const users2: User[] = removeUser(db2, adminUser);
  const users: User[] = combineUsers(users1, users2);
  users.unshift(adminUser);
  for (let i = 0; i < users.length; i++) {
    users[i].id = i + 1;
  }
  return { users: users, admin: adminUser, isSql: db1.isSql || db2.isSql };
}

const users: User[] = [
  { id: 3, name: "Merav", email: "dfdsjfsdojhfjo@fjofsjf" },
];
const names: string[] = ["Alon", "Alice", "Kovler", "Lior"];
const emails: string[] = [
  "fsdpjfnhsj@fjdkj",
  "dknsjf@adnjsnfj",
  "fskdnjks@adfdndsn",
  "sdfsnhdj@asrjff",
];

for (let i = 0; i < names.length; i++) {
  addUser(users, names[i], emails[i]);
}

users.forEach(printUser);
