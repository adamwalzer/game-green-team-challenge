import classNames from 'classnames';

import Catchable from 'shared/components/catchable/0.2';

import defaultGameOpts from './default_game_opts';
import ItemsToSort from './items_to_sort';

const PICKUP = 'PICKUP';
const DROPPED = 'DROPPED';
const TILT = 'TILT';
const ITEMS = 'items-';

const TRUCK_SRC = CMWN.MEDIA.SPRITE + 'dumptruck.png';

const binNames = [
    'food-share',
    'recycle',
    'landfill',
    'compost',
    'liquids',
];

const onTruckTransitionEnd = function (opts, e) {
    skoash.trigger('updateScreenData', {
        data: {
            'manual-dropper': {
                drop: _.includes(e.target.className, TILT),
                dropClass: _.toUpper(_.snakeCase(opts.selectableMessage)),
            },
            'selectable': {
                message: ''
            }
        }
    });
};

const onItemPickUpTransitionEnd = function (itemRef) {
    if (_.includes(itemRef.state.className, PICKUP)) {
        itemRef.removeAllClassNames();
        skoash.trigger('updateScreenData', {
            key: 'truckClassName',
            data: '',
        });
    }
};

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

let audioArray = [
    <skoash.MediaSequence ref="drop" silentOnStart>
        <skoash.Audio delay={2600} type="sfx" src={`${CMWN.MEDIA.EFFECT}ItemFunnel.mp3`} />
        <skoash.Audio type="sfx" src={`${CMWN.MEDIA.EFFECT}TruckDump.mp3`} />
    </skoash.MediaSequence>,
    <skoash.Audio ref="correct" type="sfx" src={`${CMWN.MEDIA.EFFECT}ConveyorBelt.mp3`} />,
    <skoash.Audio ref="resort" type="sfx" src={`${CMWN.MEDIA.EFFECT}ResortWarning.mp3`} />,
    <skoash.Audio ref="retry" type="sfx" src={`${CMWN.MEDIA.EFFECT}level-fail.mp3`} />,
    <skoash.Audio ref="pickUp" type="sfx" src={`${CMWN.MEDIA.EFFECT}ItemFlip.mp3`} />,
    <skoash.Audio ref="pour" type="sfx" src={`${CMWN.MEDIA.EFFECT}LiquidPour.mp3`} />,
    <skoash.Audio ref="timer" type="sfx" src={`${CMWN.MEDIA.EFFECT}SecondTimer.mp3`} />,
];

let onAnimationComplete = function () {
    this.setState({frame: this.props.frame});
};

let onAnimationClawComplete = function () {
    this.setState({frame: this.props.frame});
    this.updateScreenData({
        key: 'moveClaw',
        data: false,
    });
};

let filterHelper = (v, k) => !k.indexOf(ITEMS);

export default _.defaults({
    gameName: 'fantastic-food-sharer',
    gameNumber: 3,
    binNames,
    getSelectableProps() {
        return {
            onSelect: function (dataRef) {
                this.updateScreenData({
                    data: {
                        'manual-dropper': {
                            drop: true,
                        },
                        selectable: {
                            message: this.props.list[dataRef].props.message
                        },
                        moveClaw: true,
                    }
                });
            },
        };
    },
    getDropperProps(opts) {
        return {
            onStart() {
                this.afterSetItems = () => {
                    this.getFirstItem().removeAllClassNames();
                    this.updateScreenData({
                        keys: [this.props.refsTarget, 'refs'],
                        data: _.filter(this.refs, filterHelper),
                    });
                };

                this.onMaxHits = () => {
                    this.updateScreenData({
                        keys: ['manual-dropper', 'pickUp'],
                        data: true,
                    });
                };

                this.resortCallbackHelper = () => {
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
                };

                this.resortCallback = () => {
                    setTimeout(this.resortCallbackHelper, 1000);
                };
            },
            onTransitionEnd: function (e) {
                if (e.propertyName === 'top' && _.includes(e.target.className, DROPPED)) {
                    let itemRef = this.refs[ITEMS + this.firstItemIndex];
                    let DOMNode = ReactDOM.findDOMNode(itemRef);
                    let onAnimationEnd;

                    this.updateScreenData({
                        key: 'truckClassName',
                        data: TILT,
                    });
                    if (DOMNode !== e.target) return;

                    if (itemRef.props.message === 'liquids') {
                        if (!itemRef.state.className || !_.includes(itemRef.state.className, 'POUR')) {
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
                                        this.setState({items}, this.afterSetItems);
                                        skoash.trigger(
                                            'playMedia',
                                            {ref: _.kebabCase(_.replace(item.props.becomes.name, /\d+/g, ''))}
                                        );
                                        this.updateScreenData({
                                            data: {
                                                item: {
                                                    name: _.startCase(
                                                        _.replace(item.props.becomes.name, /\d+/g, '')
                                                    ),
                                                    pour: false,
                                                },
                                                'manual-dropper': {
                                                    dropClass: '',
                                                },
                                                truckClassName: '',
                                            }
                                        });
                                        DOMNode.removeEventListener('animationend', onAnimationEnd);
                                    }
                                }, this.props));
                            };

                            DOMNode.addEventListener('animationend', onAnimationEnd);
                            itemRef.addClassName('POUR');
                            this.updateScreenData({
                                key: ['item', 'pour'],
                                data: true,
                            });
                        }
                    }

                    if (!this.props.dropClass) return;
                    if (this.props.dropClass === DROPPED) return;

                    if (!_.includes(_.kebabCase(this.props.dropClass), itemRef.props.message)) {
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
                            setTimeout(this.onMaxHits, 1000);
                            return;
                        }

                        this.updateScreenData({
                            keys: ['reveal', 'open'],
                            data: 'resort',
                            callback: this.resortCallback,
                        });

                        return;
                    }

                    if (this.props.dropClass !== 'LIQUIDS') {
                        this.updateGameData({
                            keys: [_.camelCase(opts.gameName), 'levels', opts.level, 'score'],
                            data: opts.score + opts.pointsPerItem,
                        });
                        this.updateScreenData({
                            keys: ['manual-dropper', 'next'],
                            data: true,
                        });
                        return;
                    }

                }
            },
            onPickUp: function (itemRef) {
                itemRef.removeAllClassNames(() => {
                    if (!itemRef.DOMNode) itemRef.DOMNode = ReactDOM.findDOMNode(itemRef);
                    itemRef.DOMNode.addEventListener(
                        'transitionend',
                        onItemPickUpTransitionEnd.bind(null, itemRef)
                    );
                    itemRef.addClassName(PICKUP);
                });
            },
            onNext: function () {
                skoash.trigger(
                    'playMedia',
                    {ref: _.kebabCase(_.replace(this.getFirstItem().props.className, /\d+/g, ''))}
                );
                this.updateScreenData({
                    data: {
                        item: {
                            name: _.startCase(_.replace(this.getFirstItem().props.className, /\d+/g, '')),
                            new: true,
                        },
                        selectable: {
                            message: ''
                        },
                        truckClassName: '',
                    },
                });
            },
        };
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
            <skoash.Component
                className="extras"
            >
                <skoash.Image
                    className="hidden"
                    src={TRUCK_SRC}
                />
                <skoash.Animation
                    className="fantastic-claw"
                    frames={_.get(opts.props, 'gameState.data.fantastic-claw.frames.length', 1)}
                    frame={0}
                    loop={false}
                    duration={[
                        200, 200, 200, 500, 100, 1000, 200, 200, 200, 200, 200, 200
                    ]}
                    animate={opts.moveClaw}
                    onComplete={onAnimationClawComplete}
                />
                <skoash.Animation
                    className="fantastic-belt"
                    frames={_.get(opts.props, 'gameState.data.fantastic-belt.frames.length', 1)}
                    frame={0}
                    loop={false}
                    duration={500}
                    animate={opts.next}
                    onComplete={onAnimationComplete}
                />
                <skoash.Animation
                    className={classNames('pour fantastic-chocolate', {
                        show: opts.pour && color === 'chocolate'
                    })}
                    frames={_.get(opts.props, 'gameState.data.fantastic-chocolate.frames.length', 1)}
                    frame={0}
                    loop={false}
                    duration={600}
                    animate={opts.pour}
                    onComplete={onAnimationComplete}
                />
                <skoash.Animation
                    className={classNames('pour fantastic-fruit', {
                        show: opts.pour && color === 'fruit'
                    })}
                    frames={_.get(opts.props, 'gameState.data.fantastic-fruit.frames.length', 1)}
                    frame={0}
                    loop={false}
                    duration={600}
                    animate={opts.pour}
                    onComplete={onAnimationComplete}
                />
                <skoash.Animation
                    className={classNames('pour fantastic-milk', {
                        show: opts.pour && color === 'milk'
                    })}
                    frames={_.get(opts.props, 'gameState.data.fantastic-milk.frames.length', 1)}
                    frame={0}
                    loop={false}
                    duration={600}
                    animate={opts.pour}
                    onComplete={onAnimationComplete}
                />
                <skoash.Animation
                    className={classNames('pour fantastic-orange', {
                        show: opts.pour && color === 'orange'
                    })}
                    frames={_.get(opts.props, 'gameState.data.fantastic-orange.frames.length', 1)}
                    frame={0}
                    loop={false}
                    duration={600}
                    animate={opts.pour}
                    onComplete={onAnimationComplete}
                />
                <div className="funnel back" />
                <div className="funnel front" />
                <skoash.Component
                    className={classNames('truck', opts.truckClassName, opts.selectableMessage)}
                    onTransitionEnd={onTruckTransitionEnd.bind(null, opts)}
                />
                <div className="truck-stand" />
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
