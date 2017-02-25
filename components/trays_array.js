import Catchable from 'shared/components/catchable/0.2';
import itemsCompost from './items_compost';
import itemsFoodShare from './items_food_share';
import itemsLandfill from './items_landfill';
import itemsLiquids from './items_liquids';
import itemsRecycle from './items_recycle';

let itemsToSort = []
    .concat(itemsCompost)
    .concat(itemsFoodShare)
    .concat(itemsLandfill)
    .concat(itemsLiquids)
    .concat(itemsRecycle);

let onSelect = function (key) {
    let ref = this.refs[key];
    let rect = ReactDOM.findDOMNode(ref).getBoundingClientRect();
    this.updateScreenData({
        key: 'item',
        data: {
            name: _.startCase(_.replace(ref.props.className, /\d+/g, '')),
            new: true,
            ref,
            top: rect.top,
            left: rect.left,
        }
    });
};

let onBootstrap = function () {
    this.invokeChildrenFunction('markCatchable');
};

let getName = name => {
    if (!_.includes(name, 'tray')) {
        return [
            'tray-blue',
            'tray-pink',
        ][_.random(0, 1)];
    }

    return name;
};

let getChildren = v => {
    if (v.children) return v.children;

    return (
        <div className={`sprite ${v.bin}-item frame-${v.frame}`}/>
    );
};

let mapItems = function (itemNames) {
    let items = _.uniqBy(_.filter(itemsToSort, item => _.includes(itemNames, item.name)), 'name');

    return _.map(items, item =>
        <Catchable
            className={item.name}
            message={item.bin}
            reCatchable={true}
            becomes={item.becomes}
            children={getChildren(item)}
        />
    );
};

let trayData = [
    {
        name: 'tray',
        items: [
            'clean-aluminum-foil',
            'apple-core',
            'empty-cracker-wrapper-1',
            'bag-of-potato-chips-2',
            'half-full-milk-carton-2-1',
        ],
    },
    {
        name: 'lunchbox',
        items: [
            'chicken-leg',
            'empty-chip-bag',
            'sealed-pretzel',
        ],
    },
    {
        name: 'tray',
        items: [
            'empty-yogurt-container-2',
            'ham-sandwich',
            'whole-banana',
            'half-full-chocolate-milk-carton',
        ],
    },
    {
        name: 'tray',
        items: [
            'empty-yogurt-container-3',
            'ham-sandwich',
            'empty-bag-of-chips',
            'half-full-chocolate-milk-carton',
        ],
    },
    {
        name: 'tray',
        items: [
            'paper-packaging',
            'orange-slice',
            'graham-cookie-wrapper',
            'sealed-popcorn',
            'half-full-milk-carton-1',
        ],
    },
    {
        name: 'lunchbox',
        items: [
            'empty-yogurt-container-10',
            'fruit-snack-wrapper-2',
        ],
    },
    {
        name: 'lunchbox',
        items: [
            'empty-yogurt-container-5',
            'used-paper-sandwich-wrapper-2',
            'fruit-snack-wrapper-2',
            'package-of-dried-fruit',
            'half-full-lemonade-box-4',
        ],
    },
    {
        name: 'tray',
        items: [
            'napkin',
            'styrofoam-container',
            'packaged-dinner-roll',
            'full-plastic-water-bottle-1',
        ],
    },
    {
        name: 'tray',
        items: [
            'empty-yogurt-container-6',
            'empty-raisin-box-1',
            'empty-cracker-wrapper-1',
            'unopened-granola-bar',
            'half-full-milk-carton-3',
        ],
    },
    {
        name: 'lunchbox',
        items: [
            'fruit-snack-wrapper-2',
            'sealed-bag-of-carrots',
            'full-plastic-water-bottle-2',
        ],
    },
    {
        name: 'tray',
        items: [
            'clean-aluminum-foil',
            'banana-peel',
            'empty-chip-bag',
            'fresh-unopened-sandwich',
            'half-full-orange-juice-2',
        ],
    },
    {
        name: 'tray',
        items: [
            'teabag',
            'empty-snack-wrapper-1',
            'sealed-applesauce',
        ],
    },
    {
        name: 'lunchbox',
        items: [
            'metal-food-can-1',
            'celery-stick',
            'energy-bar-wrapper',
            'bag-of-potato-chips-3',
            'half-full-milk-carton-4',
        ],
    },
    {
        name: 'tray',
        items: [
            'empty-box-of-crackers-3',
            'plastic-spork',
            'box-of-cheddar-crackers',
            'half-full-orange-juice-2',
        ],
    },
    {
        name: 'tray',
        items: [
            'napkin',
            'plastic-baggie',
            'whole-apple',
            'half-full-milk-carton-5',
        ],
    },
    {
        name: 'lunchbox',
        items: [
            'plastic-cup-4',
            'dirty-paper-food-container',
            'applesauce-pouch-2',
        ],
    },
    {
        name: 'tray',
        items: [
            'metal-food-can-2',
            'chicken-leg',
            'whole-orange',
            'half-full-lemonade-box-4',
        ],
    },
    {
        name: 'lunchbox',
        items: [
            'plastic-cup-5',
            'napkin',
            'empty-chip-bag',
        ],
    },
    {
        name: 'tray',
        items: [
            'empty-yogurt-container-7',
            'celery-stick',
            'plastic-spoon',
            'sealed-milk-1',
            'half-full-milk-carton-6',
        ],
    },
    {
        name: 'lunchbox',
        items: [
            'clean-aluminum-foil',
            'empty-raisin-box-2',
            'half-full-chocolate-milk-carton',
        ],
    },
    {
        name: 'tray',
        items: [
            'orange-slice',
            'plastic-straws',
            'sealed-pretzel',
        ],
    },
    {
        name: 'tray',
        items: [
            'empty-cookie-box-1',
            'ketchup-packet',
            'full-plastic-water-bottle-3',
        ],
    },
    {
        name: 'lunchbox',
        items: [
            'plastic-cup-6',
            'napkin',
        ],
    },
    {
        name: 'tray',
        items: [
            'aluminum-beverage-can',
            'food-soiled-paper-plate',
            'empty-cracker-wrapper-2',
            'packaged-vegetables',
            'half-full-chocolate-milk-carton',
        ],
    },
    {
        name: 'tray',
        items: [
            'empty-yogurt-container-8',
            'carrot-sticks',
            'empty-chip-bag',
            'half-full-orange-juice-2',
        ],
    },
    {
        name: 'lunchbox',
        items: [
            'used-paper-sandwich-wrapper-4',
            'graham-cookie-wrapper-2',
            'unopened-pack-of-grapes',
        ],
    },
    {
        name: 'lunchbox',
        items: [
            'empty-milk-carton',
            'ham-sandwich',
            'package-of-dried-fruit',
            'half-full-lemonade-box-4',
        ],
    },
    {
        name: 'tray',
        items: [
            'banana-peel',
            'burrito-wrapper-1',
            'half-full-milk-carton-7',
        ],
    },
    {
        name: 'tray',
        items: [
            'plastic-packaging-2',
            'celery-stick',
            'cereal-lid-wrapper',
            'sealed-fruit-drink',
        ],
    },
    {
        name: 'lunchbox',
        items: [
            'burrito-wrapper-1',
            'packaged-dinner-roll',
            'half-full-orange-juice-2',
        ],
    },
    {
        name: 'tray',
        items: [
            'paper-packaging',
            'napkin',
            'empty-fruit-juice-plastic',
        ],
    },
    {
        name: 'tray',
        items: [
            'empty-aluminum-can',
            'apple-core',
            'applesauce-pouch-3',
            'mustard-packet',
            'full-plastic-water-bottle-4',
        ],
    },
    {
        name: 'tray',
        items: [
            'plastic-cup-7',
            'orange-slice',
            'half-full-milk-carton-8',
        ],
    },
    {
        name: 'lunchbox',
        items: [
            'box-of-cookies',
            'unopened-energy-bar',
        ],
    },
    {
        name: 'tray',
        items: [
            'empty-box-of-crackers-3',
            'ham-sandwich',
            'half-full-chocolate-milk-carton',
        ],
    },
    {
        name: 'tray',
        items: [
            'empty-yogurt-container-9',
            'carrot-sticks',
            'plastic-spoon',
            'mayo-packet',
            'half-full-orange-juice-2',
        ],
    },
    {
        name: 'lunchbox',
        items: [
            'empty-plastic-bottle',
            'soiled-paper-tray',
            'empty-cracker-wrapper-3',
            'sealed-applesauce',
        ],
    },
    {
        name: 'tray',
        items: [
            'empty-cookie-box-2',
            'juice-box',
            'sealed-popcorn',
        ],
    },
    {
        name: 'tray',
        items: [
            'banana-peel',
            'empty-bag-of-chips',
            'half-full-carton-of-milk',
        ],
    },
    {
        name: 'lunchbox',
        items: [
            'metal-food-can-3',
            'food-soiled-paper-plate',
            'plastic-spork',
            'box-of-cheddar-crackers',
        ],
    },
];

export default _.map(trayData, data => {
    let bin = _.includes(data.name, 'tray') ? 'tray-stacking' : 'home';
    let name = getName(data.name);

    return {
        type: Catchable,
        props: {
            className: name,
            message: bin,
            reCatchable: true,
            children: getChildren({
                name,
                bin,
                children: [
                    <skoash.Selectable
                        onSelect={onSelect}
                        onBootstrap={onBootstrap}
                        list={mapItems(data.items)}
                    />
                ]
            }),
        },
    };
});
