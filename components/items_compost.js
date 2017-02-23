let bin = 'compost';
let names = [
    'apple-core',
    'banana-peel',
    'carrot-sticks',
    'celery-stick',
    'chicken-leg',
    'coffee-cup-2',
    'coffee-cup',
    'coffee-grounds',
    'dirty-paper-food-container',
    'empty-raisin-box-1',
    'empty-raisin-box-2',
    'empty-raisin-box-3',
    'empty-raisin-box-4',
    'food-soiled-paper-plate',
    'ham-sandwich',
    'napkin-1',
    'napkin-2',
    'napkin-3',
    'napkin-4',
    'orange-slice',
    'pencil-shavings-1',
    'pencil-shavings-2',
    'pencil-shavings-3',
    'pencil-shavings',
    'pizza-crust',
    'soiled-paper-trays-1',
    'soiled-paper-trays-2',
    'soiled-paper-trays-3',
    'soiled-paper-trays-4',
    'teabag',
    'used-paper-food-container',
    'used-paper-sandwich-wrapper-1',
    'used-paper-sandwich-wrapper-2',
    'used-paper-sandwich-wrapper-4',
    'used-takeout-containers',
    'white-paper-towel-sheet',
];

export default _.map(names, (name, frame) => ({
    name,
    bin,
    frame,
}));