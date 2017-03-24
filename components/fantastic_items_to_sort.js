import itemsCompost from './items_compost';
import itemsFoodShare from './items_food_share';
import itemsLandfill from './items_landfill';
import itemsLiquids from './items_liquids';
import itemsRecycle from './items_recycle';

let itemsToSort = []
    .concat(itemsCompost)
    .concat(itemsLandfill);

itemsToSort = _.take(_.shuffle(itemsToSort), itemsToSort.length - 40)
    .concat(itemsFoodShare).concat(itemsFoodShare).concat(itemsFoodShare)
    .concat(itemsLiquids).concat(itemsLiquids).concat(itemsLiquids).concat(itemsLiquids).concat(itemsLiquids)
    .concat(itemsRecycle);

export default itemsToSort;
