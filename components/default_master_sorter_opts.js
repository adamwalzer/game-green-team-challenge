import classNames from 'classnames';

import defaultGameOpts from './default_game_opts';
import traysArray from './trays_array';

let binNames = [
    'liquids',
    'food-share',
    'recycle',
    'landfill',
    'compost',
    'tray-stacking',
    'home',
];

let audioArray = [
    <skoash.Audio ref="next" type="sfx" src={`${CMWN.MEDIA.EFFECT}LunchboxSlide.mp3`} />,
    <skoash.Audio ref="correct" type="sfx" src={`${CMWN.MEDIA.EFFECT}ConveyorBelt.mp3`} />,
    <skoash.Audio ref="resort" type="sfx" src={`${CMWN.MEDIA.EFFECT}ResortWarning.mp3`} />,
    <skoash.Audio ref="retry" type="sfx" src={`${CMWN.MEDIA.EFFECT}level-fail.mp3`} />,
    <skoash.Audio ref="pickUp" type="sfx" src={`${CMWN.MEDIA.EFFECT}ItemFlip.mp3`} />,
    <skoash.Audio ref="pour" type="sfx" src={`${CMWN.MEDIA.EFFECT}LiquidPour.mp3`} />,
    <skoash.Audio ref="tray" type="sfx" src={`${CMWN.MEDIA.EFFECT}TrayStackerRack.mp3`} />,
    <skoash.Audio ref="select" type="sfx" src={`${CMWN.MEDIA.EFFECT}ItemSelect.mp3`} />,
    <skoash.Audio ref="timer" type="sfx" src={`${CMWN.MEDIA.EFFECT}SecondTimer.mp3`} />,
];

let onAnimationComplete = function () {
    setTimeout(() => this.setState({frame: this.props.frame}), 500);
};

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
            onStart: function () {
                this.resortCallbackDefer = () => {
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
                    setTimeout(this.resortCallbackDefer, 1000);
                };

                this.resort = () => {
                    this.updateScreenData({
                        keys: ['reveal', 'open'],
                        data: 'resort',
                        callback: this.resortCallback
                    });
                };

                this.maxHits = () => {
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
                };

                this.liquidCallback = () => {
                    let tray = this.getFirstItem();
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
                };

                this.caughtCallback = () => {
                    this.updateScreenData({
                        key: 'item',
                        data: {
                            name: null,
                            ref: null,
                            className: null,
                        },
                        callback: this.newItemCallback,
                    });
                };

                this.newItemCallback = () => {
                    if (!this.amountLeft) {
                        this.updateScreenData({
                            key: 'manual-dropper',
                            data: {
                                selectItem: true,
                            },
                        });
                    }
                };
            },
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
                        setTimeout(this.maxHits, 1000);
                        return;
                    }

                    this.resort();

                    return;
                }

                if (opts.itemClassName !== 'LIQUIDS' && this.props.dropClass !== 'LIQUIDS') {
                    let amount = opts.itemAmount - 1;
                    this.amountLeft = amount;

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
                        callback: this.caughtCallback,
                    });

                    if (!opts.itemClassName) this.next();

                    return;
                }

                if (!_.includes(opts.itemClassName, 'POUR')) {
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
                        this.setState({items}, this.afterNext);

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
                            callback: this.liquidCallback,
                        });

                        DOMNode.removeEventListener('animationend', onAnimationEnd);
                    };

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
                <skoash.Animation
                    className={classNames('pour priceless-chocolate', {
                        show: opts.pour && color === 'chocolate'
                    })}
                    frames={_.get(opts.props, 'gameState.data.priceless-chocolate.frames.length', 1)}
                    frame={0}
                    loop={false}
                    duration={600}
                    animate={opts.pour}
                    onComplete={onAnimationComplete}
                />
                <skoash.Animation
                    className={classNames('pour priceless-fruit', {
                        show: opts.pour && color === 'fruit'
                    })}
                    frames={_.get(opts.props, 'gameState.data.priceless-fruit.frames.length', 1)}
                    frame={0}
                    loop={false}
                    duration={600}
                    animate={opts.pour}
                    onComplete={onAnimationComplete}
                />
                <skoash.Animation
                    className={classNames('pour priceless-milk', {
                        show: opts.pour && color === 'milk'
                    })}
                    frames={_.get(opts.props, 'gameState.data.priceless-milk.frames.length', 1)}
                    frame={0}
                    loop={false}
                    duration={600}
                    animate={opts.pour}
                    onComplete={onAnimationComplete}
                />
                <skoash.Animation
                    className={classNames('pour priceless-orange', {
                        show: opts.pour && color === 'orange'
                    })}
                    frames={_.get(opts.props, 'gameState.data.priceless-orange.frames.length', 1)}
                    frame={0}
                    loop={false}
                    duration={600}
                    animate={opts.pour}
                    onComplete={onAnimationComplete}
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
