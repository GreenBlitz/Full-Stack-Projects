// part 3

console.log(" ");
console.log("part 3");
console.log(" ");

1;

interface User1 {
  id: Number;
  name_p3: string;
  email: string;
}

//a

function getUserName(user: User1): string {
  return user.name_p3;
}

const lery: User1 = { id: 1.1, name_p3: "lery", email: "lerygram@gmail.com" };
console.log("1.a test ", getUserName(lery));

//b

const poll: User1 = { id: 1.2, name_p3: "poll", email: "polgo@gmail.com" };
const polld: User1 = { id: 2.2, name_p3: "polld", email: "polgo@gmail.com" };

let all_users: User1[] = [lery, poll, polld];
function verifyEmails(users: User1[]): boolean {
  let OK = true;
  users.forEach((user) => {
    for (let i = 0; i < users.length; i++) {
      if (user.email !== users[i].email) {
      } else if (user !== users[i]) {
        OK = false;
      }
    }
  });
  return OK;
}

console.log(verifyEmails(all_users));

//c

console.log(" ");
function findUserById(users: User1[], id: number): User1 | undefined {
  let foundUser: User1 | undefined;

  users.forEach((user) => {
    if (user.id === id) {
      foundUser = user;
    }
  });

  return foundUser;
}
console.log(findUserById(all_users, 1.1)?.name_p3);

// d

function findFirstUser(users: User1[]): User1 | undefined {
  let first_user = users[0];
  for (let i = 1; i < users.length; i++) {
    if (first_user.id > users[i].id) {
      first_user = users[i];
    }
  }
  return first_user;
}

console.log(findFirstUser(all_users));

//e
function lastUser(users: User1[]): User1 | undefined {
  let last_user = users[0];

  for (let i = 1; i < users.length; i++) {
    if (last_user.id < users[i].id) {
      last_user = users[i];
    }
  }
  return last_user;
}

function addUser(users: User1[], name: string, email: string): User1[] {
  let user_id = lastUser(users)?.id ?? 0;
  user_id++;
  const newUser: User1 = {
    id: user_id,
    name_p3: name,
    email: email,
  };
  users.push(newUser);
  return users;
}

addUser(all_users, "van", "van@gmail.com");

//q2

interface UserDB {
  users: User1[];
  admin: User1;
  issql: boolean;
}

//a

const all_lerys: UserDB = {
  users: [lery, poll, polld],
  admin: lery,
  issql: false,
};

function getEmails(db: UserDB): string[] {
  let all_emails: string[] = [];
  for (let i = 0; i < db.users.length; i++) {
    all_emails.push(db.users[i].email);
  }
  return all_emails;
}

console.log(getEmails(all_lerys));

//b

const all_lery_and_poll: UserDB = {
  users: [poll, polld],
  admin: poll,
  issql: false,
};

function combineDB(db1: UserDB, db2: UserDB): UserDB {
  let the_combined_lery_conspiracy: User1[] = [];
  let the_combined_lery_conspiracy_admin_id = db2.admin.id;
  let the_combined_lery_conspiracy_admin = db2.admin;
  let the_combined_lery_conspiracy_issql_fr = db1.issql;
  for (let i = 0; i < db1.users.length; i++) {
    the_combined_lery_conspiracy.push(db1.users[i]);
  }
  for (let i = 0; i < db2.users.length; i++) {
    the_combined_lery_conspiracy.push(db2.users[i]);
  }
  if (db1.admin.id < db2.admin.id) {
    the_combined_lery_conspiracy_admin_id = db1.admin.id;
    db2.admin;
  }
  if (db1.issql || db2.issql) {
    the_combined_lery_conspiracy_issql_fr = true;
  }
  const lery_and_pull_combined: UserDB = {
    users: the_combined_lery_conspiracy,
    admin: the_combined_lery_conspiracy_admin,
    issql: the_combined_lery_conspiracy_issql_fr,
  };
  return lery_and_pull_combined;
}

console.log(combineDB(all_lerys, all_lery_and_poll));
