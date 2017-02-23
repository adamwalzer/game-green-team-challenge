let bin = 'food-share';
let names = [
    'bag-of-potato-chips-2',
    'bag-of-potato-chips-3',
    'box-of-cheddar-crackers',
    'box-of-cookies',
    'fresh-unopened-sandwich',
    'ketchup-packet',
    'mayo-packet',
    'mustard-packet',
    'package-of-dried-fruit',
    'packaged-dinner-roll',
    'packaged-vegetables',
    'sealed-applesauce',
    'sealed-bag-of-carrots',
    'sealed-popcorn',
    'sealed-chocolate-milk',
    'sealed-fruit-drink-1',
    'sealed-fruit-drink-2',
    'sealed-fruit-drink-3',
    'sealed-milk-1',
    'sealed-milk-2',
    'sealed-milk-3',
    'sealed-orange-juice',
    'sealed-pretzel',
    'single-serve-cereal',
    'single-serve-cereal-2',
    'single-serve-cereal-3',
    'single-serve-cookies',
    'unopened-box-of-raisins',
    'unopened-cookies-package',
    'unopened-crackers-1',
    'unopened-crackers-2',
    'unopened-crackers-3',
    'unopened-energy-bar',
    'unopened-graham-cookies-1',
    'unopened-graham-cookies-2',
    'unopened-graham-cookies-3',
    'unopened-granola-bar',
    'unopened-juice-box-1',
    'unopened-juice-box-2',
    'unopened-juice-box-3',
    'unopened-pack-of-grapes',
    'whole-apple',
    'whole-banana',
    'whole-orange',
    'yogurt-cup-1',
    'yogurt-cup-2',
];

export default _.map(names, (name, frame) => ({
    name,
    bin,
    frame,
}));