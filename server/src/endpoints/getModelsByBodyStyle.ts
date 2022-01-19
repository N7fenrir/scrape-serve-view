import { ICarModel } from '../models';

export function getModelsByBodyStyle(items: ICarModel[], searchTerm: string): ICarModel[] {
  const searches = searchTerm.split(';');
  let tempArray: ICarModel[] = [];
  if (searches.length === 1 && searches[0] === '') tempArray = items;
  searches.forEach((searchItem) => {
    if (searchItem !== '') {
      tempArray = tempArray.concat(
        items.filter((o) => o.bodyClass.toLowerCase().includes(searchItem.toLowerCase().trim())),
      );
    }
  });
  return tempArray;
}
