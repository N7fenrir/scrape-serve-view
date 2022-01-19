import { ICarModel, IConfigModelContainer, IGetPaginatedModel } from '../models';
import express, { Express, NextFunction, Request, Response } from 'express';
import * as path from 'path';
import cors from 'cors';
import { processPageNumberAndModel } from './getPaginatedModels';
import { getModelsByModelName } from './getModelsByModelName';
import { getModelsByBodyStyle } from './getModelsByBodyStyle';

class CarService {
  private config: IConfigModelContainer;
  private readonly server: Express;
  private readonly db: ICarModel[];

  constructor(configFile: IConfigModelContainer, db: ICarModel[]) {
    this.config = configFile;
    this.server = express();
    this.db = db;
    this.configureExpressApp();
  }

  private configureExpressApp(): void {
    this.server.use(express.json());
    this.server.use(
      express.urlencoded({
        extended: true,
      }),
    );
    this.server.use(
      cors({
        origin: '*',
      }),
    );
    this.server.use(function (_request: Request, res: Response, next: NextFunction) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      next();
    });
    this.registerEndpoints(this.server);
  }

  private registerEndpoints(server: Express): void {

    server.get('/getdata', async (request: Request, response: Response) => {
      if (response.headersSent) return;
      response.statusCode = 200;
      response.send(this.db).end();
    });

    server.get('/searchbymodelname', async (request: Request, response: Response) => {
      let searchTerm = '';
      const qArray: string[] = Object.keys(request.query);
      if (qArray.length > 0 && qArray.includes('name')) {
        searchTerm = request.query['name'] ? request.query['name'].toString() : '';
      }
      let cars: ICarModel[];
      if (searchTerm !== '') {
        cars = getModelsByModelName(this.db, searchTerm);
      } else {
        cars = this.db;
      }
      const items: IGetPaginatedModel = processPageNumberAndModel(cars, 1);
      if (response.headersSent) return;
      response.statusCode = 200;
      response.send(items).end();
    });

    server.get('/searchbybodystyle', async (request: Request, response: Response) => {
      let searchTerm = '';
      const qArray: string[] = Object.keys(request.query);
      if (qArray.length > 0 && qArray.includes('class')) {
        searchTerm = request.query['class'] ? request.query['class'].toString() : '';
      }
      let cars: ICarModel[];
      if (searchTerm !== '') {
        cars = getModelsByBodyStyle(this.db, searchTerm);
      } else {
        cars = this.db;
      }
      const items: IGetPaginatedModel = processPageNumberAndModel(cars, 1);
      if (response.headersSent) return;
      response.statusCode = 200;
      response.send(items).end();
    });

    server.use('/', express.static(path.join(__dirname + '../../../public')));

    server.get('/', (_, response: Response) => {
      response.sendFile(path.join(__dirname + '../../../public/index.html'));
    });

    server.get('*', function (_, response: Response) {
      response.status(404).send('Page Not Found 404');
    });
  }

  public start() {
    this.server.listen(this.config.port, () => {
      console.log('Listening to', this.config.port);
    });
  }
}

export default CarService;
