import classNames from 'classnames';

import defaultGameOpts from './default_game_opts';
import ItemsToSort from './items_to_sort';
import traysArray from './trays_array';

let resort = function () {
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
};

let binNames = [
    'liquids',
    'food-share',
    'recycle',
    'landfill',
    'compost',
    'tray-stacking',
    'home',
];

let itemsToSort = _.filter(ItemsToSort, item => _.includes(binNames, item.bin));

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
    <skoash.Audio ref="next" type="sfx" src={`${CMWN.MEDIA.EFFECT}LunchboxSlide.mp3`} />,
    <skoash.Audio ref="correct" type="sfx" src={`${CMWN.MEDIA.EFFECT}ConveyorBelt.mp3`} />,
    <skoash.Audio ref="resort" type="sfx" src={`${CMWN.MEDIA.EFFECT}ResortWarning.mp3`} />,
    <skoash.Audio ref="retry" type="sfx" src={`${CMWN.MEDIA.EFFECT}level-fail.mp3`} />,
    <skoash.Audio ref="pickUp" type="sfx" src={`${CMWN.MEDIA.EFFECT}ItemFlip.mp3`} />,
    <skoash.Audio ref="pour" type="sfx" src={`${CMWN.MEDIA.EFFECT}LiquidPour.mp3`} />,
    <skoash.Audio ref="tray" type="sfx" src={`${CMWN.MEDIA.EFFECT}TrayStackerRack.mp3`} />,
    <skoash.Audio ref="select" type="sfx" src={`${CMWN.MEDIA.EFFECT}ItemSelect.mp3`} />,
    <skoash.Audio ref="timer" type="sfx" src={`${CMWN.MEDIA.EFFECT}SecondTimer.mp3`} />,
]);

export default _.defaults({
    gameName: 'master-sorter',
    gameNumber: 5,
    dropperAmount: 2,
    binNames,
    collideFraction: .4,
    getSelectableProps(opts) {
        return {
            onSelect: function (binRefKey) {
                var dropClass = _.toUpper(opts.binNames[binRefKey]);
                if (opts.itemRef) {
                    this.updateScreenData({
                        keys: ['item', 'className'],
                        data: dropClass,
                    });
                    return;
                }

                this.updateScreenData({
                    key: 'manual-dropper',
                    data: {
                        drop: true,
                        dropClass,
                    }
                });
            },
        };
    },
    getDropperProps(opts) {
        return {
            onTransitionEnd: function (e) {
                let tray = this.getFirstItem();
                let itemIndex = _.indexOf(tray.refs['children-0'].state.classes, 'SELECTED');
                let itemRef = !opts.itemRef ? tray : tray.refs['children-0'].refs[itemIndex];
                let DOMNode = ReactDOM.findDOMNode(itemRef);
                let onAnimationEnd;
                if (DOMNode !== e.target) return;
                if (!itemRef.state.className) return;

                if (e.propertyName !== 'top') return;

                if (opts.itemClassName && !opts.itemRef) {
                    this.pickUp();
                    this.updateScreenData({
                        key: 'manual-dropper',
                        data: {
                            drop: false,
                            dropClass: '',
                        }
                    });
                }

                if ((
                        !opts.itemClassName &&
                        !_.includes(_.kebabCase(this.props.dropClass), itemRef.props.message)
                    ) ||
                    (
                        opts.itemClassName &&
                        !_.includes(_.kebabCase(opts.itemClassName), itemRef.props.message)
                    )) {
                    let hits = opts.hits + 1;

                    this.updateGameData({
                        keys: [_.camelCase(opts.gameName), 'levels', opts.level],
                        data: {
                            start: false,
                            score: opts.score - opts.pointsPerMiss,
                            hits,
                        }
                    });

                    this.updateScreenData({
                        key: 'item',
                        data: {
                            removeClassName: true,
                            className: null,
                        },
                    });

                    if (hits === opts.maxHits) {
                        setTimeout(() => {
                            this.updateScreenData({
                                data: {
                                    'manual-dropper': {
                                        next: true,
                                    },
                                    item: {
                                        name: null,
                                        ref: null,
                                        className: null,
                                    }
                                }
                            });
                        }, 1000);
                        return;
                    }

                    resort.call(this);

                    return;
                }

                if (opts.itemClassName !== 'LIQUIDS' && this.props.dropClass !== 'LIQUIDS') {
                    let amount = opts.itemAmount - 1;

                    this.updateGameData({
                        keys: [_.camelCase(opts.gameName), 'levels', opts.level, 'score'],
                        data: opts.score + opts.pointsPerItem,
                    });

                    this.updateScreenData({
                        key: 'item',
                        data: {
                            className: 'CAUGHT',
                            amount,
                        },
                        callback: () => {
                            this.updateScreenData({
                                key: 'item',
                                data: {
                                    name: null,
                                    ref: null,
                                    className: null,
                                },
                                callback: () => {
                                    if (!amount) {
                                        this.updateScreenData({
                                            key: 'manual-dropper',
                                            data: {
                                                selectItem: true,
                                            },
                                        });
                                    }
                                }
                            });
                        }
                    });

                    if (!opts.itemClassName) this.next();

                    return;
                }

                onAnimationEnd = () => {
                    let items = this.state.items;
                    let index = this.firstItemIndex;
                    let item = items[index];
                    let selectable = item.props.children[0];
                    let selectedItem = selectable.props.list[itemIndex];
                    selectedItem.props.className = selectedItem.props.becomes.name;
                    selectedItem.props.message = selectedItem.props.becomes.bin;
                    selectedItem.props['data-message'] = selectedItem.props.becomes.bin;
                    items[index] = item;
                    this.setState({items}, () => {
                        this.afterNext();
                    });

                    this.updateGameData({
                        keys: [_.camelCase(opts.gameName), 'levels', opts.level, 'score'],
                        data: opts.score + opts.pointsPerItem,
                    });

                    this.updateScreenData({
                        key: 'item',
                        data: {
                            removeClassName: true,
                            className: null,
                            amount: opts.itemAmount - 1,
                        },
                        callback: () => {
                            tray.refs['children-0'].setState({classes: {}});
                            this.updateScreenData({
                                key: 'item',
                                data: {
                                    name: null,
                                    ref: null,
                                    className: null,
                                    pour: false,
                                }
                            });
                        }
                    });

                    DOMNode.removeEventListener('animationend', onAnimationEnd);
                };

                if (!_.includes(opts.itemClassName, 'POUR')) {
                    DOMNode.addEventListener('animationend', onAnimationEnd);
                    itemRef.addClassName('POUR');
                    this.updateScreenData({
                        key: ['item', 'pour'],
                        data: true,
                    });
                }
            },
            onComponentWillReceiveProps: function (nextProps) {
                if (nextProps.itemRef != null) {
                    if (nextProps.itemClassName != null &&
                        nextProps.itemClassName !== this.props.itemClassName) {
                        let selectable = this.refs['items-' + this.firstItemIndex].refs['children-0'];
                        let itemIndex = _.indexOf(selectable.state.classes, selectable.props.selectClass);
                        let item = selectable.refs[itemIndex];
                        if (!item) return;
                        item.addClassName(nextProps.itemClassName);
                    }

                    if (nextProps.removeItemClassName &&
                        nextProps.removeItemClassName !== this.props.itemClassName) {
                        let selectable = this.refs['items-' + this.firstItemIndex].refs['children-0'];
                        let itemIndex = _.indexOf(selectable.state.classes, selectable.props.selectClass);
                        let item = selectable.refs[itemIndex];
                        if (!item) return;
                        item.removeAllClassNames();
                        this.updateScreenData({
                            key: 'item',
                            data: {
                                className: null,
                                removeClassName: false,
                            }
                        });
                    }
                }

                if (nextProps.selectItem &&
                    nextProps.selectItem !== this.props.selectItem) {
                    let tray = this.getFirstItem();

                    if (tray.props.message === 'home') {
                        this.updateScreenData({
                            key: 'manual-dropper',
                            data: {
                                drop: true,
                                dropClass: 'HOME',
                            },
                        });
                    } else {
                        let rect = ReactDOM.findDOMNode(tray).getBoundingClientRect();
                        let name = _.startCase(_.replace(tray.props.className, /\d+/g, ''));
                        let left = rect.left + (rect.right - rect.left) * .8 / 2;
                        let top = rect.top + (rect.bottom - rect.top) * .8 / 2;

                        this.updateScreenData({
                            key: 'item',
                            data: {
                                name,
                                top,
                                left,
                            },
                        });
                    }
                }
            },
            onNext: function () {
                this.updateScreenData({
                    data: {
                        item: {
                            amount: _.reduce(this.getFirstItem().refs['children-0'].refs, (a, ref) =>
                                a + (ref.props.message === 'liquids' ? 2 : 1)
                            , 0),
                        },
                        'manual-dropper': {
                            selectItem: false,
                        },
                    }
                });
            },
        };
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
                <div className="tray-stacking-title">
                    <span>
                        Tray Stacking
                    </span>
                </div>
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
    getAudioArray() {
        return audioArray;
    },
    getCatchablesArray() {
        return traysArray;
    },
}, defaultGameOpts);
