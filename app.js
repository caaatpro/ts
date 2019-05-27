const gm = require("gm");
const Tesseract = require('tesseract.js');
const request = require('request');

console.log(1);

const width = 58;
const height = 18;

const position = {
    0 : {
        y: 373,
        x: 284
    },
    1 : {
        y: 14,
        x: 284
    }
};

const tesseractAsync = async (part) => {
    return Tesseract.recognize('t'+part+'.jpg')
        .progress(p => console.log('progress', p))
        .then(result => {
            return result;
        })
        .catch(err => {
            return 'err';
        });
};

const getTime = (img, part) => {
    return new Promise(resolve => {
        console.log('part ' + part);

        img.crop(width, height, position[part].x, position[part].y);
        img.resize(width * 10, height * 10)
        img.write('t'+part+'.jpg', async function (err) {
            if (err) {
                resolve('err');
            } else {
                var resultText = null;

                var result = await tesseractAsync(part);

                if (result.words.length) {
                    let text = result.words[0].text;
                    if (/^\d{1,2}:\d{1,2}$/.test(text)) {
                        resultText = text;
                    } else {
                        resultText = null;
                    }
                } else {
                    resultText = null
                }

                resolve(resultText);
            }
        });

    });
}


async function start() {

    var url = "https://game-tournaments.com/media/export/result/71930-1-8065.jpg"

    var t1 = await getTime(gm(request(url)), 0);
    var t2 = await getTime(gm(request(url)), 1);
    console.log(t1)
    console.log(t2)


}


start();