//User
//1
interface User {
  id: number;
  name: string;
  email: string;
}
//a
function getUserName(user: User): string {
  return user.name;
}
//b
function verifyEmail(users: User[]): boolean {
  for (let i = 0; i < users.length; i++) {
    for (let j = i + 1; j < users.length; j++) {
      if (users[j].email === users[i].email) return false;
    }
  }
  return true;
}
//c
function findUserById(users: User[], id: number): any {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) return users[i];
  }
  return undefined;
}

function findUserPosById(users: User[], id: number): any {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) return i;
  }
  return undefined;
}
//d
function findFirstUser(users: User[]): User {
  let lowest = users[0].id;
  for (let i = 1; i < users.length; i++) {
    if (lowest > users[i].id) lowest = users[i].id;
  }
  return users[lowest];
}
//e
function addUser(users: User[], name: string, email: string) {
  let minId: any = null;
  let i = 0;
  while (minId === null) {
    if (findUserById(users, i) === undefined) minId = users[i].id;
    i++;
  }
  users.push({ name: name, email: email, id: minId });
}

//2
interface UserDB {
  users: User[];
  admin: User;
  isSql: boolean;
}
//a
function getEmails(db: UserDB): string[] {
  let emails: string[] = [];
  for (let i = 0; i < db.users.length; i++) {
    emails.push(db.users[i].email);
  }
  return emails;
}
//b
function combineDB(db1: UserDB, db2: UserDB) {
  let db3: UserDB = {
    users: db1.users.concat(db2.users),
    admin: findUserById(
      db1.users.concat(db2.users),
      Math.min(db1.admin.id, db2.admin.id),
    ),
    isSql: db1.isSql || db2.isSql,
  };
  let adminPosition = findUserPosById(db3.users, db3.admin.id);
  let tempU: User = db3.users[0];
  db3.users[0] = db3.admin;
  db3.users[adminPosition] = tempU;
}

//Product
//1
interface Product {
  id: number;
  name: string;
  price: number;
}
//2
interface ProductWithDiscount extends Product {
  discountPercentage: number;
}
//3
interface Store {
  products: Product[];
  discounts: ProductWithDiscount[];
}
//a
function getLowestItems(store: Store): {
  discounted: ProductWithDiscount;
  regular: Product;
} {
  let lowestRegular = store.products[0];
  let lowestDiscounted = store.discounts[0];
  for (let i = 0; i < store.products.length; i++) {
    if (store.products[i].price < lowestRegular.price)
      lowestRegular = store.products[i];
  }
  for (let i = 0; i < store.discounts.length; i++) {
    if (
      (store.discounts[i].price * store.discounts[i].discountPercentage) / 100 <
      (lowestDiscounted.discountPercentage * lowestDiscounted.price) / 100
    )
      lowestDiscounted = store.discounts[i];
  }
  if (
    (lowestDiscounted.price * lowestDiscounted.discountPercentage) / 100 >
    lowestRegular.price
  )
    lowestDiscounted = {
      id: lowestRegular.id,
      name: lowestRegular.name,
      price: lowestRegular.price,
      discountPercentage: 0,
    };
  return { discounted: lowestDiscounted, regular: lowestRegular };
}
