 export const userData = [
{
    userId:1,
    username : "Vinni",
    email : "vinni@gmail.com",
    tokenData : {
     token:"123456",
     expiration : new Date(new Date().getTime() + 10 * 60 * 1000)
    }

},
{
    userId:2,
    username : "Raj",
    email : "raj@gmail.com",
    tokenData : {
        token :"123456",
        expiration : new Date(new Date().getTime() + 10 * 60 * 1000)
       }
},
{
    userId:3,
    username : "Pp",
    email : "pp@gmail.com",
    tokenData : {
        token :"123456",
        expiration : new Date(new Date().getTime() + 10 * 60 * 1000)
       }
}
]

export const tokenData =[
    {
        id:123,
        userId: 1,
        token:"123456",
        expiration : false,
        createdAt : new Date()
    },
    {
        id:123,
        userId: 2,
        token:"123456",
        expiration : false,
        createdAt : new Date()
    },
    {
        id:123,
        userId: 3,
        token:"123456",
        expiration : false,
        createdAt : new Date()
    }
]