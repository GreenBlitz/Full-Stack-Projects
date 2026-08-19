import { store } from "fp-ts";

interface user {
  id: number;
  name: string;
  email: string;
}
function getUserName(user: user): string {
  return user.name;
}
const a = { id: 123123, name: "it that betrays", email: "joe@gmail.com" };
console.log(getUserName(a));

function verifyEmails(users: user[]): boolean {
  for (let i = 0; i < users.length; i++) {
    if (users.filter((s) => s.email === users[i].email).length > 1) {
      return false;
    }
  }
  return true;
}

const b = { id: 456456, name: "wrathful mystic", email: "sarah@yahoo.com" };
const c = { id: 789789, name: "silent shadow", email: "mike88@outlook.com" };
const d = { id: 321321, name: "crimson vanguard", email: "elena@hotmail.com" };
const e = { id: 654654, name: "frostweaver", email: "david.k@gmail.com" };
const f = { id: 987987, name: "iron goliath", email: "boss_man@yahoo.com" };
const g = {
  id: 112233,
  name: "stellar voyager",
  email: "luna.space@gmail.com",
};
const h = { id: 445566, name: "phantom stalker", email: "ghost99@outlook.com" };
const i = { id: 778899, name: "apex predator", email: "hunter_j@hotmail.com" };
const j = { id: 990011, name: "eternal flame", email: "luna.space@gmail.com" };

const userss = [a, b, c, d, e, f, g, h, i, j];
console.log(verifyEmails(userss));

function finduserbyID(users: user[], id: number): string {
  if (users.filter((s) => s.id === id).length >= 1) {
    return users.filter((s) => s.id === id)[0].name;
  }
  return "undifned";
}
console.log(finduserbyID(userss, 123123));

function findFirstuser(users: user[]): string {
  for (let i = 0; i < users.length; i++) {
    if (users.filter((s) => s.id <= users[i].id).length === 1) {
      return finduserbyID(users, users[i].id);
    }
  }
  return "undifend";
}
console.log(findFirstuser(userss));

function adduser(users: user[], name: string, email: string) {
  let temp = true;
  let newID = 1;
  while (temp) {
    if (finduserbyID(users, newID) === "undifned") {
      temp = false;
    } else {
      newID = newID + 1;
    }
  }
  const temp2 = { id: newID, name: name, email: email };
  users.push(temp2);
  console.log(users[10].name);
}
adduser(userss, "ulalek fused atrosity", "greengiants@gmail.com");

interface userDB {
  users: user[];
  admin: user;
  isSql: boolean;
}

function getEmails(db: userDB): string[] {
  const tr: string[] = [];
  for (let i = 0; i < db.users.length; i++) {
    tr.push(db.users[i].email);
  }
  return tr;
}

function combineDB(db1: userDB, db2: userDB): userDB {
  let newSQL = false;
  if (db1.isSql || db2.isSql) {
    newSQL = true;
  }
  let newAdmin = db1.admin;
  if (db1.admin.id > db2.admin.id) {
    newAdmin = db2.admin;
  }
  const newusers: user[] = [newAdmin];
  for (let i = 0; i < db1.users.length; i++) {
    newusers.push(db1.users[i]);
  }
  for (let i = 0; i < db2.users.length; i++) {
    if (db2.users[i] !== db2.admin) {
      newusers.push(db2.users[i]);
    }
  }
  const db3: userDB = { users: newusers, admin: newAdmin, isSql: newSQL };
  return db3;
}

interface Product {
  id: number;
  name: string;
  price: number;
}
interface ProductWithDiscount extends Product {
  discountspercent: number;
}
interface Store {
  products: Product[];
  discounts: ProductWithDiscount[];
}

function addDiscounts(store: Store): ProductWithDiscount[] {
  const temp: ProductWithDiscount[] = [];
  for (let i = 0; i < store.discounts.length; i++) {
    temp.push(store.discounts[i]);
  }
  for (let i = 0; i < temp.length; i++) {
    temp[i].price = temp[i].price * temp[i].discountspercent;
  }
  return temp;
}

function getLowestItems(store: Store): (Product | ProductWithDiscount)[] {
  const tr: (Product | ProductWithDiscount)[] = [];
  for (let i = 0; i < store.products.length; i++) {
    if (
      store.products.filter((s) => s.price <= store.products[i].price).length >=
      1
    ) {
      tr.push(store.products[i]);
      i = store.products.length + 1;
    }
  }

  const temp: ProductWithDiscount[] = addDiscounts(store);
  for (let i = 0; i < temp.length; i++) {
    if (temp.filter((s) => s.price <= temp[i].price).length >= 1) {
      tr.push(temp[i]);
      i = temp.length + 1;
    }
  }
  return tr;
}

function findproductbuID(store: Store, id: number): Store | string{
  const tr: Store = { products: [], discounts: [] };
  for (let i = 0; i < store.products.length; i++) {
    if (store.products[i].id === id) {
      tr.products.push(store.products[i]);
      return tr;
    }
  }
  for (let i = 0; i < store.discounts.length; i++) {
    if (store.discounts[i].id === id) {
      tr.discounts.push(store.discounts[i]);
      return tr;
    }
  }
  return "unavilable";
}

function getTotalPrice(store: Store): number {
  let sum = 0;
  for (let i = 0; i < store.products.length; i++) {
    sum = sum + store.products[i].price;
  }
  const temp: ProductWithDiscount[] = addDiscounts(store);
  for (let i = 0; i < temp.length; i++) {
    sum = sum + temp[i].price;
  }
  return sum;
}

function storeWideDiscount(store: Store, discountPercent, number): Store {
  const tr: Store = { products: [], discounts: [] };
  tr.products = store.products;
  for (let i = 0; i < tr.products.length; i++) {
    tr.products[i].price = tr.products[i].price * discountPercent;
  }
  for (let i = 0; i < tr.discounts.length; i++) {
    tr.discounts[i].discountspercent = tr.discounts[i].discountspercent + discountPercent;
  }
  tr.discounts = addDiscounts(store);
  return tr;
}
