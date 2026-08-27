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

interface Product {
  id: number;
  name: string;
  price: number;
}

interface ProductWithDiscount extends Product {
  discountPrecentage: number;
}

interface Store {
  products: Product[];
  discounts: ProductWithDiscount[];
}

function productSortFunction(product1: Product, product2: Product): number {
  return product1.price - product2.price;
}

function productWithDiscountSortFunction(
  discount1: ProductWithDiscount,
  discount2: ProductWithDiscount,
): number {
  return (
    discount1.price -
    discount1.price * discount1.discountPrecentage -
    discount2.price -
    discount2.price * discount2.discountPrecentage
  );
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

function getlowestItems(store: Store): {
  discounted: ProductWithDiscount;
  regular: Product;
} {
  return {
    discounted: [...store.discounts].sort(productWithDiscountSortFunction)[0],
    regular: [...store.products].sort(productSortFunction)[0],
  };
}

function getProductById(
  store: Store,
  id: number,
): Product | ProductWithDiscount | undefined {
  return (
    store.products.find((product: Product) => product.id === id) ??
    store.discounts.find(
      (discounted: ProductWithDiscount) => discounted.id === id,
    )
  );
}

function totalPrice(store: Store): number {
  return (
    store.products
      .map((product: Product) => product.price)
      .reduce((total: number, current: number) => total + current) +
    store.discounts
      .map(
        (discount: ProductWithDiscount) =>
          discount.price - discount.price * discount.discountPrecentage,
      )
      .reduce((total: number, current: number) => total + current)
  );
}

function applyStoreDiscount(store: Store, discount: number): Store {
  const products: Product[] = store.products.map((product: Product) => ({
    id: product.id,
    name: product.name,
    price: product.price - product.price * discount,
  }));
  const discounts: ProductWithDiscount[] = store.discounts.map(
    (discounted: ProductWithDiscount) => ({
      id: discounted.id,
      name: discounted.name,
      price: discounted.price - discounted.price * discount,
      discountPrecentage: discounted.discountPrecentage,
    }),
  );
  return { products: products, discounts: discounts };
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
