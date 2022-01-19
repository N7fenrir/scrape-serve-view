export interface IConfigModelContainer {
  env: string;
  address: string;
  port: number;
  carStore: string;
}

export interface ICarModel {
  modelName: string;
  modelUrl: string;
  bodyClass: string;
  modelImage: string;
  productionYears: string[];
}

export interface IGetPaginatedModel {
  page: number;
  per_page: number;
  pre_page: number | null;
  next_page: number | null;
  total: number;
  total_pages: number;
  data: ICarModel[];
}
