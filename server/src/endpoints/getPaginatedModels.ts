import { ICarModel, IGetPaginatedModel } from '../models';

export function processPageNumberAndModel(model: ICarModel[], pageNumber: number): IGetPaginatedModel {
  return paginator(model, pageNumber, 10);
}

function paginator(model: ICarModel[], current_page: number, per_page_items: number): IGetPaginatedModel {
  const page = current_page || 1,
    per_page = per_page_items || 10,
    offset = (page - 1) * per_page;
  const paginatedItems: ICarModel[] = model.slice(offset).slice(0, per_page_items);
  const total_pages = Math.ceil(model.length / per_page);

  return {
    page: page,
    per_page: per_page,
    pre_page: page - 1 ? page - 1 : null,
    next_page: total_pages > page ? page + 1 : null,
    total: model.length,
    total_pages: total_pages,
    data: paginatedItems,
  };
}
