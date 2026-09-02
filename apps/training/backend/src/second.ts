// interface User {
//   id: number;
//   name: string;
//   email: string;
// }
// // // function getUserName(user:User):string{
// // //     return user.name
// // // }

// const hi: User = { id: "7", name: "Ori", email: "dnkjdskjdkj@" };
// const hii: User = { id: "8", name: "Or", email: "dnkjdskjdkj@" };

// let users: User[] = [hi, hii];
// // // function verifyemails(allusers:User[]){
// // //     let y= true;
// // //     for(let i=0; )
// // //     for(let i=0; allusers.length;i++){
// // //         if (allusers.email!==){

// // //         }
// // //         else if(allusers[i].email!==hii.email){
// // //              y=false};
// // //         }
// // //     return(y)}
// // //     console.log (verifyemails(users))

// // function findUserByld(users: User[], id: string) {
// //   for (let i = 0; i < users.length; i++) {
// //     if (id === users[i].id) {
//       return users[i];
//     }
//   }
//   return "undfined";
// }
// console.log(findUserByld(users, "7"));

// function finds(users:User[]){
// const hi=users[0].id
// const us= hi.length
//      for(let i=1; i < users.length ;i++)
//           if(users[i].id.length>us){
//                let us =users[i].id.length}
//           else if(users[i].id.length>us)}

// function addUser(users:User[],name:string,email:string){

// let id=0
//      while (users.some(user=> user.id ===id)){
//           id++}

// const user1: User = { id, name: "Or", email: "dnkjdskjdkj@"};
//  users.push(user1)}

//  interface userdb {
//      users:User[]
//      admin:User[]
//      issql:boolean
//  }
// const db: userdb= {
//      users:{
//           id:[58678,6896]
//           name:["jtgkj","jhyy"]
//           email:["gkghjk","jyjk"]
//      }
//      admin:{
//           id:[58678,478]
//           name:["jtgkj","hh"]
//           email:["gkghjk","ui"]
//      }
//      isql: true
// }

//  function getemails(db:userdb){
//      let emails= ""
//           for(let y =0;y<db.users.length;y++){
//               emails+=users[y].email}
//           for(let i =0;i<db.admin.length;i++){
//               emails+=users[i].email}
//            }
//      return(emails)
// getemails(db)

// function combinedb(db1:userdb,db2:userdb){
//      let allusers=""
//      let hi=admin[0].id
//      let hi1=admin[0].id
//      for(let i=0;i<db1.users.length;i++)
//           allusers+=users[i].email
//      for(let i=0;i<db2.users.length;i++)
//           allusers+=users[i].email
//      for(let i=1;i<db1.admin.length;i++)
//           if (admin[i].id<hi){
//                hi+=admin[i].id
//           let lowest1=hi
//      for(let i=1;i<db2.admin.length;i++)
//           if (admin[i].id<hi){
//                hi1+=admin[i].id
//           let lowest2=hi1
//      if (hi<hi1){
//           let lowest=hi
//      }
//      else if(hi<hi1){
//           let lowest=hi1
//      }
//      if (db1.issql===true||db2.issql===true)
//           let newissql:Boolean=true

//           }}
// interface product{
//      id:number
//      name:string
//      price:number
// }
// interface productWithDiscount{
//      id:number
//      name:string
//      price:number
//      dp:number
// }
// interface store{
//      products:product[]
//      discounts:productWithDiscount[]}

// function getlowestitem(storee:store, regular:productWithDiscount){
// let first=storee.products[0].price
// let low=storee.products[0].price
//      for(let i=1;i<storee.products.length;i++){
//           if (storee.products[i].price<low){
//               let low=storee.products[i].price}
//      for(let i=1;i<storee.products.length;i++){
//           if (storee.products[i].price*(regular.dp)/100<first){
//           let first=storee.products[i].price*(regular.dp)/100}}
//  }
// return("gdry"+first+"hjfgn"+low)
// }

// function getProuctbyld(store: store,id:number){
//      for(let i=0;i<store.products.length;i++){
//           if (id==store.products[i].id)
//                return(store.products[i])
//           return("undefrined")}

// }
// console.log(getProuctbyld(storee, 686))

// function GetTotalPrice(store1:store,dp1:productWithDiscount){
//      for(let i=0;i<store1.products.length;i++){
//           return((store1.products[i].price)*dp1.dp/100)
// }
// console.log(GetTotalPrice(store1,dp1))
// }

// function applyStoreDiscount(store:store,dp2:number,dp1:productWithDiscount){
//        for(let i=0;i<store.products.length;i++){
//            let dp3=store.products[i].price*dp1.dp/100
//                if(dp3!==store.products[i].price){
//                     for(let i=0;i<store.products.length;i++){
//                     let dp3=+store.products[i].price*dp2/100}}
//           else if(dp3!==store.products[i].price){
//                return(dp3)}
//      return(dp3)
// }
// console.log(applyStoreDiscount(store,dp2,dp1))

type GameState = "win" | "lose" | "draw";
type Suit = "heart" | "diamonds" | "clubs" | "spades";
type Rank =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "k";
interface card {
  suit: Suit;
  rank: Rank;
}
interface flippable {
  isFaceUp: boolean;
}
type Flippablecard = "card" & "flippable";
type OptionalCard = "win" | "lose" | "draw";
type Deck = card | flippablecard;
function getCardName(cards: card) {
  for (let i = 0; i < cards.rank.length; i++) {
    return cards.rank[i];
  }
  console.log(getCardName(cards));
}
