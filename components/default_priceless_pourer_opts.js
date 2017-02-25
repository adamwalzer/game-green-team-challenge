import classNames from 'classnames';

import Catchable from 'shared/components/catchable/0.2';

import defaultGameOpts from './default_game_opts';
import ItemsToSort from './items_to_sort';

const binNames = [
    'liquids',
    'recycle',
    'landfill',
    'compost',
];

let itemsToSort = _.filter(
    ItemsToSort,
    item => _.includes(binNames, item.bin)
);

let getChildren = v => {
    if (v.children) return v.children;

    return (
        <div className={`sprite ${v.bin}-item frame-${v.frame}`}/>
    );
};

let catchablesArray = _.map(itemsToSort, v => ({
    type: Catchable,
    props: {
        className: v.name,
        message: v.bin,
        reCatchable: true,
        becomes: v.becomes,
        children: getChildren(v),
    },
}));

let audioRefs = _.uniq(_.map(itemsToSort, v =>
    _.kebabCase(_.replace(v.name, /\d+/g, '')))
);

let audioArray = _.map(audioRefs, (v, k) => ({
    type: skoash.Audio,
    ref: v,
    key: k,
    props: {
        type: 'voiceOver',
        src: `${CMWN.MEDIA.GAME + 'sound-assets/_vositems/' + v}.mp3`,
        onPlay: function () {
            this.updateScreenData({
                keys: ['item', 'new'],
                data: false,
            });
        }
    },
}));

audioArray = audioArray.concat([
    <skoash.Audio ref="drop" type="sfx" src={`${CMWN.MEDIA.EFFECT}ClickRecButton.mp3`} />,
    <skoash.Audio ref="correct" type="sfx" src={`${CMWN.MEDIA.EFFECT}ConveyorBelt.mp3`} />,
    <skoash.Audio ref="resort" type="sfx" src={`${CMWN.MEDIA.EFFECT}ResortWarning.mp3`} />,
    <skoash.Audio ref="retry" type="sfx" src={`${CMWN.MEDIA.EFFECT}level-fail.mp3`} />,
    <skoash.Audio ref="pickUp" type="sfx" src={`${CMWN.MEDIA.EFFECT}ItemFlip.mp3`} />,
    <skoash.Audio ref="pour" type="sfx" src={`${CMWN.MEDIA.EFFECT}LiquidPour.mp3`} />,
    <skoash.Audio ref="timer" type="sfx" src={`${CMWN.MEDIA.EFFECT}SecondTimer.mp3`} />,
]);

export default _.defaults({
    gameName: 'priceless-pourer',
    gameNumber: 2,
    dropperAmount: 4,
    binNames,
    getSelectableProps(opts) {
        return {
            onSelect: function (binRefKey) {
                this.updateScreenData({
                    key: 'manual-dropper',
                    data: {
                        drop: true,
                        dropClass: _.toUpper(opts.binNames[binRefKey])
                    }
                });
            },
        };
    },
    getDropperProps(opts) {
        let props = defaultGameOpts.getDropperProps.call(this, opts);

        props.onTransitionEnd = function (e) {
            let itemRef = this.refs['items-' + this.firstItemIndex];
            let DOMNode;
            let onAnimationEnd;

            if (e.propertyName !== 'left') return;
            if (this.props.dropClass !== 'LIQUIDS') return;
            if (itemRef.props.message !== 'liquids') {
                let hits = opts.hits + 1;

                this.updateGameData({
                    keys: [_.camelCase(opts.gameName), 'levels', opts.level],
                    data: {
                        start: false,
                        score: opts.score - opts.pointsPerMiss,
                        hits,
                    }
                });

                if (hits === opts.maxHits) {
                    setTimeout(() => {
                        this.updateScreenData({
                            keys: ['manual-dropper', 'pickUp'],
                            data: true,
                        });
                    }, 1000);
                    return;
                }

                this.updateScreenData({
                    keys: ['reveal', 'open'],
                    data: 'resort',
                    callback: () => {
                        setTimeout(() => {
                            this.updateScreenData({
                                data: {
                                    reveal: {
                                        open: null,
                                        close: true,
                                    },
                                    'manual-dropper': {
                                        pickUp: true,
                                    },
                                    catcher: {
                                        caught: false,
                                    }
                                }
                            });
                        }, 1000);
                    }
                });

                return;
            }

            DOMNode = ReactDOM.findDOMNode(itemRef);

            if (DOMNode !== e.target) return;

            onAnimationEnd = () => {
                this.pickUp(_.defaults({
                    onPickUp: function () {
                        let items = this.state.items;
                        let index = this.firstItemIndex;
                        let item = items[index];
                        item.props.className = item.props.becomes.name;
                        item.props.message = item.props.becomes.bin;
                        item.props['data-message'] = item.props.becomes.bin;
                        items[index] = item;
                        this.setState({items}, () => {
                            this.afterNext();
                        });
                        this.updateScreenData({
                            data: {
                                item: {
                                    name: _.startCase(_.replace(item.props.becomes.name, /\d+/g, '')),
                                    pour: false,
                                },
                                'manual-dropper': {
                                    dropClass: '',
                                },
                            }
                        });
                        this.updateGameData({
                            keys: [_.camelCase(opts.gameName), 'levels', opts.level, 'score'],
                            data: opts.score + opts.pointsPerItem,
                        });
                        DOMNode.removeEventListener('animationend', onAnimationEnd);
                    }
                }, this.props));
            };

            if (!itemRef.state.className || itemRef.state.className.indexOf('POUR') === -1) {
                DOMNode.addEventListener('animationend', onAnimationEnd);
                itemRef.addClassName('POUR');
                this.updateScreenData({
                    key: ['item', 'pour'],
                    data: true,
                });
            }
        };

        return props;
    },
    getCatcherProps(opts) {
        var props = defaultGameOpts.getCatcherProps.call(this, opts);

        props.onCorrect = function (bucketRef) {
            this.updateGameData({
                keys: [_.camelCase(opts.gameName), 'levels', opts.level, 'score'],
                data: opts.score + opts.pointsPerItem,
            });

            if (bucketRef.props.message !== 'liquids') {
                this.updateScreenData({
                    keys: ['manual-dropper', 'next'],
                    data: true,
                });
                return;
            }
        };

        return props;
    },
    getExtraComponents(opts) {
        let color = 'milk';

        switch (true) {
            case _.includes(opts.itemName, 'Chocolate'):
                color = 'chocolate';
                break;
            case _.includes(opts.itemName, 'Orange'):
                color = 'orange';
                break;
            case _.includes(opts.itemName, 'Fruit'):
                color = 'fruit';
                break;
        }

        return (
            <skoash.Component>
                <skoash.Sprite
                    className="belt"
                    src={`${CMWN.MEDIA.SPRITE}level.1.conveyor.belt`}
                    animate={opts.next}
                    loop={false}
                    duration={250}
                    frame={0}
                    onComplete={function () {
                        this.setState({frame: this.props.frame});
                    }}
                />
                <skoash.Sprite
                    className={classNames('pour', {show: opts.pour && color === 'chocolate'})}
                    src={`${CMWN.MEDIA.SPRITE}level.2.chocolate.milk`}
                    animate={opts.pour}
                    loop={false}
                    duration={600}
                    frame={0}
                    onComplete={function () {
                        this.setState({frame: this.props.frame});
                    }}
                />
                <skoash.Sprite
                    className={classNames('pour', {show: opts.pour && color === 'fruit'})}
                    src={`${CMWN.MEDIA.SPRITE}level.2.fruit.juice`}
                    animate={opts.pour}
                    loop={false}
                    duration={600}
                    frame={0}
                    onComplete={function () {
                        this.setState({frame: this.props.frame});
                    }}
                />
                <skoash.Sprite
                    className={classNames('pour', {show: opts.pour && color === 'milk'})}
                    src={`${CMWN.MEDIA.SPRITE}level.2.milk`}
                    animate={opts.pour}
                    loop={false}
                    duration={600}
                    frame={0}
                    onComplete={function () {
                        this.setState({frame: this.props.frame});
                    }}
                />
                <skoash.Sprite
                    className={classNames('pour', {show: opts.pour && color === 'orange'})}
                    src={`${CMWN.MEDIA.SPRITE}level.2.orange.juice`}
                    animate={opts.pour}
                    loop={false}
                    duration={600}
                    frame={0}
                    onComplete={function () {
                        this.setState({frame: this.props.frame});
                    }}
                />
            </skoash.Component>
        );
    },
    itemsToSort,
    getAudioArray() {
        return audioArray;
    },
    getCatchablesArray() {
        return catchablesArray;
    },
}, defaultGameOpts);
