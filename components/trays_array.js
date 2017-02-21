import Catchable from 'shared/components/catchable/0.2';
import ItemsToSort from './items_to_sort';

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
        <skoash.Sprite
            src={`${CMWN.MEDIA.SPRITE}_${_.replace(v.bin, '-', '')}`}
            frame={v.frame || 0}
            static
        />
    );
};

let mapItems = function (itemNames) {
    let items = _.filter(ItemsToSort, item => _.includes(itemNames, item.name));

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
            'empty-cracker-wrapper',
            'bag-of-potato-chips',
            'half-full-milk-carton',
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
            'empty-yogurt-container',
            'ham-sandwich',
            'whole-banana',
            'half-full-chocolate-milk-carton',
        ],
    },
    {
        name: 'tray',
        items: [
            'empty-yogurt-container',
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
            'half-full-milk-carton',
        ],
    },
    {
        name: 'lunchbox',
        items: [
            'empty-yogurt-container',
            'fruit-snack-wrapper',
        ],
    },
    {
        name: 'lunchbox',
        items: [
            'empty-yogurt-container',
            'used-paper-sandwich-wrapper',
            'fruit-snack-wrapper',
            'package-of-dried-fruit',
            'half-full-lemonade-box',
        ],
    },
    {
        name: 'tray',
        items: [
            'napkin',
            'styrofoam-container',
            'packaged-dinner-roll',
            'full-plastic-water-bottle',
        ],
    },
    {
        name: 'tray',
        items: [
            'empty-yogurt-container',
            'empty-raisin-box',
            'empty-cracker-wrapper',
            'unopened-granola-bar',
            'half-full-milk-carton',
        ],
    },
    {
        name: 'lunchbox',
        items: [
            'fruit-snack-wrapper',
            'sealed-bag-of-carrots',
            'full-plastic-water-bottle',
        ],
    },
    {
        name: 'tray',
        items: [
            'clean-aluminum-foil',
            'banana-peel',
            'empty-chip-bag',
            'fresh-unopened-sandwich',
            'half-full-orange-juice',
        ],
    },
    {
        name: 'tray',
        items: [
            'teabag',
            'empty-snack-wrapper',
            'sealed-applesauce',
        ],
    },
    {
        name: 'lunchbox',
        items: [
            'metal-food-can',
            'celery-stick',
            'energy-bar-wrapper',
            'bag-of-potato-chips',
            'half-full-milk-carton',
        ],
    },
    {
        name: 'tray',
        items: [
            'empty-box-of-crackers',
            'plastic-spork',
            'box-of-cheddar-crackers',
            'half-full-orange-juice',
        ],
    },
    {
        name: 'tray',
        items: [
            'napkin',
            'plastic-baggie',
            'whole-apple',
            'half-full-milk-carton',
        ],
    },
    {
        name: 'lunchbox',
        items: [
            'plastic-cup',
            'dirty-paper-food-container',
            'applesauce-pouch',
        ],
    },
    {
        name: 'tray',
        items: [
            'metal-food-can',
            'chicken-leg',
            'whole-orange',
            'half-full-lemonade-box',
        ],
    },
    {
        name: 'lunchbox',
        items: [
            'plastic-cup',
            'napkin',
            'empty-chip-bag',
        ],
    },
    {
        name: 'tray',
        items: [
            'empty-yogurt-container',
            'celery-stick',
            'plastic-spoon',
            'sealed-milk',
            'half-full-milk-carton',
        ],
    },
    {
        name: 'lunchbox',
        items: [
            'clean-aluminum-foil',
            'empty-raisin-box',
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
            'empty-cookie-box',
            'ketchup-packet',
            'full-plastic-water-bottle',
        ],
    },
    {
        name: 'lunchbox',
        items: [
            'plastic-cup',
            'napkin',
        ],
    },
    {
        name: 'tray',
        items: [
            'aluminum-beverage-can',
            'food-soiled-paper-plate',
            'empty-cracker-wrapper',
            'packaged-vegetables',
            'half-full-chocolate-milk-carton',
        ],
    },
    {
        name: 'tray',
        items: [
            'empty-yogurt-container',
            'carrot-sticks',
            'empty-chip-bag',
            'half-full-orange-juice',
        ],
    },
    {
        name: 'lunchbox',
        items: [
            'used-paper-sandwich-wrapper',
            'graham-cookie-wrapper',
            'unopened-pack-of-grapes',
        ],
    },
    {
        name: 'lunchbox',
        items: [
            'empty-milk-carton',
            'ham-sandwich',
            'package-of-dried-fruit',
            'half-full-lemonade-box',
        ],
    },
    {
        name: 'tray',
        items: [
            'banana-peel',
            'burrito-wrapper',
            'half-full-milk-carton',
        ],
    },
    {
        name: 'tray',
        items: [
            'empty-plastic-package',
            'celery-stick',
            'cereal-lid-wrapper',
            'sealed-fruit-drink',
        ],
    },
    {
        name: 'lunchbox',
        items: [
            'burrito-wrapper',
            'packaged-dinner-roll',
            'half-full-orange-juice',
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
            'applesauce-pouch',
            'mustard-packet',
            'full-plastic-water-bottle',
        ],
    },
    {
        name: 'tray',
        items: [
            'plastic-cup',
            'orange-slice',
            'half-full-milk-carton',
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
            'empty-box-of-crackers',
            'ham-sandwich',
            'half-full-chocolate-milk-carton',
        ],
    },
    {
        name: 'tray',
        items: [
            'empty-yogurt-container',
            'carrot-sticks',
            'plastic-spoon',
            'mayo-packet',
            'half-full-orange-juice',
        ],
    },
    {
        name: 'lunchbox',
        items: [
            'empty-plastic-bottle',
            'soiled-paper-tray',
            'empty-cracker-wrapper',
            'sealed-applesauce',
        ],
    },
    {
        name: 'tray',
        items: [
            'empty-cookie-box',
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
            'metal-food-can',
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
