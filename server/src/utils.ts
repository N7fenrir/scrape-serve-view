
import {ICarModel, IConfigModelContainer} from "./models";
import {ConfigLoader} from "./config/ConfigLoader";
import fs from "fs";


/**
 * Function to read the file
 *
 * @param filepath - The file path to read
 *
 * @returns - Returns the config object
 *
 */
export function getConfigFile(filepath: string): IConfigModelContainer {
    return ConfigLoader.load(filepath);
}

/**
 * Function to check if a file Exists
 *
 * @param filepath - The file path to check for existence
 *
 * @returns - Returns true if file exists
 */
export function checkFileExistsSync(filepath: string): boolean {
    let flag = false;
    const folderExists = checkIfFolderExists(filepath);
    if (folderExists) {
        try {
            fs.accessSync(filepath, fs.constants.F_OK);
            flag = true;
        } catch (e) {
            flag = false;
        }
    }
    return flag;
}

export function getCarDBFile(fileAddress: string): {error: boolean, data: ICarModel[]}  {
    let data: string = '';
    try {
         data = fs.readFileSync(fileAddress, 'utf8');
    } catch (err) {
        console.error(err)
    }
    return {error: data === '' , data: JSON.parse(data) as ICarModel[]};
}





/**
 *  Check if folder exists
 *
 * @param filePath - The folder address path
 * @returns - Returns boolean
 */
function checkIfFolderExists(filePath: string): boolean {
    return fs.existsSync(filePath);
}