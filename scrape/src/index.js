import fetch from "node-fetch";
import * as cheerio from 'cheerio';
import fs from 'fs';
import readline from "readline";
import process from 'process';

const SCRAPE_HOST = "https://en.wikipedia.org/";
const SCRAPE_ENDPOINT = "wiki/List_of_automobile_sales_by_model";
const SCRAPE_SAVE = "./cars.json";


function scrapper() {
    return new Promise((resolve, reject) => {
        const address = SCRAPE_HOST.concat(SCRAPE_ENDPOINT);
        makeRequest(address).then((rawData) => {
            if (rawData.status !== 200) reject({status: rawData.status, data: ''})
            resolve({status: rawData.status, data: rawData.data})
        })
    })
}

async function makeRequest(address) {
    const response = await fetch(address);
    return {status: response.status, data: await response.text()};
}

async function scrapeModelDetails(data) {
    return new Promise((resolve) => {
        extractModels(data).then((completeData) => {
            resolve(completeData);
        });
    });
}

function extractModels(html) {
    return new Promise(async (resolve) => {
        const modelArray = [];
        const cheer = cheerio.load(html);
        const items = cheer('table.wikitable tr > th a:first-child');
        for (let i = 0; i < items.length; i++) {
            const modelName = cheer(items[i]).text().trim();
            const modelUrl = cheer(items[i]).attr('href');
            if (modelUrl && modelUrl.includes('redlink=1') === false) {
                const modelDataExtended = await makeRequest(SCRAPE_HOST.concat(modelUrl));
                const modelDetails = extractModelDetails(modelDataExtended.data);

                if (modelDetails.productionYears.length < 1 || (modelDetails.productionYears.length === 0 && modelDetails.productionYears.includes("")) ) {
                    const prodYear = cheer(items[i]).parent().parent().next('td').html();

                    if (prodYear !== null && prodYear.includes('<br>')) {
                        modelDetails.productionYears = prodYear.split('<br>').map(part => cheerio.load(part).text().trim());
                    }
                    if (prodYear !== null && !prodYear.includes('<br>')) {
                        modelDetails.productionYears = [cheer(items[i]).parent('th').next('td').text().trim()]
                    } else if (prodYear === null) {
                        modelDetails.productionYears = [cheer(items[i]).parent('th').next('td').text()]
                    }
                }
                modelArray.push({
                    modelName,
                    modelUrl: modelUrl ? modelUrl.trim() : '',
                    bodyClass: modelDetails.bodyClass,
                    modelImage: modelDetails.image,
                    productionYears: modelDetails.productionYears,
                });
                writeWaitingPercent(`${i}/${items.length} => ${modelName} redlink = ${modelUrl.includes('redlink=1')}`);
            }
        }
        resolve(modelArray);
    });
}


function extractModelDetails(html) {
    const modelDetails = {
        image: '', bodyClass: '', productionYears: []
    };
    let years = [];
    const infoBoxElement = '.infobox > tbody:nth-child(1) tr';
    const cheer = cheerio.load(html);
    const imgUrl = cheer(infoBoxElement).find('.infobox-image > a:nth-child(1) > img:nth-child(1)').attr('src');
    const carClassification = cheer(infoBoxElement).find('th:contains(Class)').siblings('td').text();
    const prodYears = cheer(infoBoxElement).find('th:contains(Production)').siblings('td').get(0);


    // If there is a br  in the production years
    if (cheer(prodYears).html() !== null && cheer(prodYears).html().includes('<br>')) {
        let td = cheer(prodYears).html();
        years = td.split('<br>').map(part => cheerio.load(part).text().trim());
    } else {
        const year = cheer(prodYears).text().trim();
        years = year === "" ? [] : [year];
    }

    // If there is an ul List in the production years
    if (cheer(prodYears).children("div:nth-child(1)").children('ul').children('li').length > 0) {
        years = [];
        cheer(prodYears).children("div:nth-child(1)").children('ul').children('li').each((i, item) => {
            years.push(cheer(item).text().trim());
        })
    }

    modelDetails.image = imgUrl ? imgUrl : '';
    modelDetails.bodyClass = carClassification ? carClassification : '';
    modelDetails.productionYears = years;
    return modelDetails;
}


function writeWaitingPercent(p) {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`scraped ... ${p}`);
}


scrapper().then(async (response) => {
    const data = await scrapeModelDetails(response.data);
    fs.writeFileSync(SCRAPE_SAVE, JSON.stringify(data), 'utf-8');
});