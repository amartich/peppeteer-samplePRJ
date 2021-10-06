const puppeteer = require('puppeteer')
const fs = require('fs/promises')
const cron = require('node-cron')
async function start(){
    const browser = await puppeteer.launch()
    const page = await  browser.newPage()
    await page.goto("https://learnwebcode.github.io/practice-requests/")
   // await page.screenshot({path: "prueba.png", fullPage: true})
    
    //const names = ['red', 'orange', 'bolue']
    
    const names = await page.evaluate(() =>{
     return Array.from(document.querySelectorAll(".info strong")).map(x => x.textContent)

    }) 
    await fs.writeFile("names.txt", names.join("\r\n"))
    //await browser.close()

    await page.click("#clickme")
    const clikcedData = await page.$eval("#data", el => el.textContent)
    console.log(clikcedData)

    const photos = await page.$$eval("img", (imgs) => {
        return imgs.map(x => x.src)


    })

    await page.type("#ourfield", "blue")

    await Promise.all([page.click("#ourform button"), page.waitForNavigation() ])
 
    const info = await page.$eval("#message", el => el.textContent )

    console.log(info)

    for (photo of photos ){
        const imagepage = await page.goto(photo)
        await fs.writeFile(photo.split("/").pop(), await imagepage.buffer())


    }
 
}
//setInterval(start, 5000)
cron.schedule("*/5* * * * *", start)

