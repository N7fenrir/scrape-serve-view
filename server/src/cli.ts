import {Command} from 'commander';
import {dirname} from 'path';
import {getCarDBFile, getConfigFile} from "./utils";
import CarService from "./endpoints/CarService";

const command = new Command('Carz');

interface ICmdLineArgs {
    config: string;
    database: string;
}

async function startScraping(options: ICmdLineArgs): Promise<void> {
    console.log('Starting ...');
    const configFile = getConfigFile(options.config);
    const dbFile = getCarDBFile(configFile.carStore);
    if (dbFile.error) {
        console.log(`No Cars file found at location ${configFile.carStore}`)
        process.exit(1);
    }
    const carService = new CarService(configFile, dbFile.data);
    await carService.start();
}


command
    .version("1")
    .command('start')
    .option(`-c, --config <path>`, 'File path to the config file', dirname(process.execPath))
    .action((options: ICmdLineArgs) => {
        startScraping(options);
    });

export default command;
