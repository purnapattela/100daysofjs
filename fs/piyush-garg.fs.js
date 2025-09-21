const fs = require("node:fs")

// fs.writeFileSync("./test.txt", "Hey! there, This is sync")

// fs.writeFile("./test.txt", "Its a async", (err) => { })

// const data = fs.readFileSync("./test.txt", { encoding: "utf-8" })
// console.log(data)


// fs.readFile("./test.txt", { encoding: "utf-8" }, (err, data) => {
//     if (err) {
//         console.log("Error :", err)
//         return
//     }
//     console.log(data)
// })


// fs.appendFileSync("./test.txt", "@PPC - ")

// fs.copyFile("./test.txt", "./copy.xyz", (err) => {
//     console.log(err);
// })


// DELETE
// fs.unlink("./copy.xyz", (err) => {
//     if (err) {
//         console.log("Error : ", err)
//     }
// })


// const stats = fs.statSync("./test.txt")
// console.log(stats)

fs.mkdir("./test-dir", (err) => {
    if (err) {
        console.log("Error : ", err);
    }
})

fs.writeFileSync("./test-dir/.gitkeep", "")