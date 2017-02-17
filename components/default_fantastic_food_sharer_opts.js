import classNames from 'classnames';

import Catchable from 'shared/components/catchable/0.2';

import defaultGameOpts from './default_game_opts';
import ItemsToSort from './items_to_sort';
import ItemsShare from './items_food_share';

const PICKUP = 'PICKUP';
const DROPPED = 'DROPPED';
const TILT = 'TILT';
const ITEMS = 'items-';

const BELT_SRC = CMWN.MEDIA.SPRITE + 'level.3.conveyor.belt';
const CLAW_SRC = CMWN.MEDIA.SPRITE + 'level3robotarm';
const FUNNEL_SRC = CMWN.MEDIA.SPRITE + 'front.back.funnel';

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
    ItemsToSort.concat(ItemsShare),
    item => _.includes(binNames, item.bin)
);

let getChildren = v => {
    if (v.children) return v.children;

    return (
        <skoash.Sprite
            src={`${CMWN.MEDIA.SPRITE}_${_.replace(v.bin, '-', '')}`}
            frame={v.frame || 1}
            static
        />
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
    <skoash.MediaSequence ref="drop" silentOnStart>
        <skoash.Audio delay={4600} type="sfx" src={`${CMWN.MEDIA.EFFECT}ItemFunnel.mp3`} />
        <skoash.Audio type="sfx" src={`${CMWN.MEDIA.EFFECT}TruckDump.mp3`} />
    </skoash.MediaSequence>,
    <skoash.Audio ref="correct" type="sfx" src={`${CMWN.MEDIA.EFFECT}ConveyorBelt.mp3`} />,
    <skoash.Audio ref="resort" type="sfx" src={`${CMWN.MEDIA.EFFECT}ResortWarning.mp3`} />,
    <skoash.Audio ref="pickUp" type="sfx" src={`${CMWN.MEDIA.EFFECT}ItemFlip.mp3`} />,
    <skoash.Audio ref="pour" type="sfx" src={`${CMWN.MEDIA.EFFECT}LiquidPour.mp3`} />,
    <skoash.Audio ref="timer" type="sfx" src={`${CMWN.MEDIA.EFFECT}SecondTimer.mp3`} />,
]);

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
            onTransitionEnd: function (e) {
                if (e.propertyName === 'top' && _.includes(e.target.className, DROPPED)) {
                    let itemRef = this.refs[ITEMS + this.firstItemIndex];
                    let DOMNode;
                    let onAnimationEnd;

                    this.updateScreenData({
                        key: 'truckClassName',
                        data: TILT,
                    });

                    if (opts.selectableMessage !== 'liquids') return;

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
                                    this.getFirstItem().removeAllClassNames();
                                    this.updateScreenData({
                                        keys: [this.props.refsTarget, 'refs'],
                                        data: _.filter(this.refs, (v, k) => !k.indexOf(ITEMS)),
                                    });
                                });
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

                    if (!itemRef.state.className || itemRef.state.className.indexOf('POUR') === -1) {
                        DOMNode.addEventListener('animationend', onAnimationEnd);
                        itemRef.addClassName('POUR');
                        this.updateScreenData({
                            key: ['item', 'pour'],
                            data: true,
                        });
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
                <skoash.Sprite
                    className="claw"
                    src={CLAW_SRC}
                    frame={0}
                    loop={false}
                    animate={opts.moveClaw}
                    duration={[
                        200, 200, 200, 500, 100, 3000, 200, 200, 200, 200, 200, 200
                    ]}
                    onComplete={function () {
                        this.setState({frame: this.props.frame});
                        this.updateScreenData({
                            key: 'moveClaw',
                            data: false,
                        });
                    }}
                />
                <skoash.Sprite
                    className="belt"
                    src={BELT_SRC}
                    frame={0}
                    loop={false}
                    duration={500}
                    animate={opts.next}
                    onComplete={function () {
                        this.setState({frame: this.props.frame});
                    }}
                />
                <skoash.Sprite
                    className={classNames('pour', {show: opts.pour && color === 'chocolate'})}
                    src={`${CMWN.MEDIA.SPRITE}level.3.chocolate.milk`}
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
                    src={`${CMWN.MEDIA.SPRITE}level.3.fruit.juice`}
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
                    src={`${CMWN.MEDIA.SPRITE}level.3.milk`}
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
                    src={`${CMWN.MEDIA.SPRITE}level.3.orange.juice`}
                    animate={opts.pour}
                    loop={false}
                    duration={600}
                    frame={0}
                    onComplete={function () {
                        this.setState({frame: this.props.frame});
                    }}
                />
                <skoash.Component className="funnel">
                    <skoash.Sprite
                        className="back"
                        src={FUNNEL_SRC}
                        frame={0}
                        static
                    />
                    <skoash.Sprite
                        className="front"
                        src={FUNNEL_SRC}
                        frame={1}
                        static
                    />
                </skoash.Component>
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
