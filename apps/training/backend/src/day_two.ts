// part 3

console.log(" ")
console.log("part 3")
console.log(" ")


1

interface User1 { id: Number; name_p3: string; email: string};

//a

function getUserName(user: User1): string {
    return user.name_p3
}

const lery: User1 = {id: 1.1, name_p3: "lery", email: "lerygram@gmail.com"}
console.log("1.a test ", getUserName(lery))

//b

const poll: User1 = {id: 1.2, name_p3: "poll", email: "polgo@gmail.com"}
const polld: User1 = {id: 2.2, name_p3: "polld", email: "polgo@gmail.com"}

let all_users: User1[] = [lery, poll, polld]
function verifyEmails(users: User1[]): boolean{
    let OK = true
    users.forEach((user) => {
        for (let i = 0; i < users.length; i++){
            if (user.email !== users[i].email){
            }
            else if (user !== users[i]){
                OK = false
            }
        }
    })
    return OK
}

console.log(verifyEmails(all_users))

//c

console.log(" ")

function findUserById(users: User1[], id: number): User1{
    users.forEach((user) => {
        console.log(user.id, " = ", id, " ? ")
        if (user.id === id){
            return user
            console.log("trigged")
        }
    })
}

console.log(findUserById(all_users, 1.1))