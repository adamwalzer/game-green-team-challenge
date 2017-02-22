import defaultGameOpts from './default_game_opts';
import ItemsToSort from './items_to_sort';

const binNames = [
    'recycle',
    'landfill',
    'compost',
];

let itemsToSort = _.filter(ItemsToSort, item => _.includes(binNames, item.bin));

export default _.defaults({
    gameName: 'recycling-champion',
    gameNumber: 1,
    binNames,
    itemsToSort,
    getExtraComponents() {
        return [
            <skoash.Image className="hidden" scr={`${CMWN.MEDIA.IMAGE}pipe01.png`} />,
        ];
    },
}, defaultGameOpts);
