const libgen = require('libgen');

async function search(){
    const urlString = await libgen.mirror()
    console.log(`${urlString} is currently fastest`)
    const options = {
        mirror: urlString,
        query: 'cats',
        count: 5,
        sort_by: 'year',
        reverse: true
    }
    try {
        async function search(){
            const data = await libgen.search(options)
            let n = data.length
            console.log(`${n} results for "${options.query}"`)
            while (n--){
            console.log('');
            console.log('Title: ' + data[n].title)
            console.log('Author: ' + data[n].author)
            console.log('Download: ' +
                      `${options.mirror}/book/index.php?md5=` +
                      data[n].md5.toLowerCase())
        }
        }
        search()
    } catch (err) {
        console.error(err)
    }
}
search()