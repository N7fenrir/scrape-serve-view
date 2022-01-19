import fs from 'fs';
import Ajv from 'ajv';
import {IConfigModelContainer} from '../models';
import {checkFileExistsSync} from "../utils";

/**
 * Config loader to load the configuration.
 */
export class ConfigLoader {
    /**
     * Loads the configuration file from the given path.
     *
     * @param configFilePath - File path to the configuration file.
     * @returns The loaded configuration.
     */
    public static load(configFilePath: string): IConfigModelContainer {
        const ajv = new Ajv();

        const schema = {
            type: 'object',
            properties: {
                env: { type: 'string' },
                port: { type: 'number' },
                address: { type: 'string' },
                carStore:  {type: "string"},

            },
            required: ['env', 'port', 'address', 'carStore'],
            additionalProperties: true,
        };
        const fileExists = checkFileExistsSync(configFilePath);
        if (!fileExists) {
            throw new Error('File Does not Exist');
        } else {
            const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
            const valid = ajv.validate(schema, config);
            if (!valid) {
                throw new Error('Invalid config file');
            } else {
                return {
                    env: config.env,
                    port: config.port,
                    address: config.address,
                    carStore: config.carStore,
                } as IConfigModelContainer;
            }
        }
    }
}
