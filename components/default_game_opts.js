import Catchable from 'shared/components/catchable/0.2';

import ItemsToSort from './items_to_sort';

let binNames = [
    'recycle',
    'landfill',
    'compost',
];

let itemsToSort = _.filter(ItemsToSort, item => _.includes(binNames, item.bin));

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
    <skoash.Audio ref="drop" type="sfx" src={`${CMWN.MEDIA.EFFECT}ReleaseItem3.mp3`} />,
    <skoash.Audio ref="correct" type="sfx" src={`${CMWN.MEDIA.EFFECT}CorrectSelect.mp3`} />,
    <skoash.Audio ref="resort" type="sfx" src={`${CMWN.MEDIA.EFFECT}ResortWarning.mp3`} />,
    <skoash.Audio ref="retry" type="sfx" src={`${CMWN.MEDIA.EFFECT}level-fail.mp3`} />,
    <skoash.Audio ref="pickUp" type="sfx" src={`${CMWN.MEDIA.EFFECT}ItemFlip.mp3`} />,
    <skoash.Audio ref="timer" type="sfx" src={`${CMWN.MEDIA.EFFECT}SecondTimer.mp3`} />,
];

export default {
    gameName: 'recycling-champion',
    gameNumber: 1,
    level: 1,
    timeout: 120000,
    scoreToWin: 600,
    maxHits: 5,
    dropperAmount: 3,
    pointsPerItem: 95,
    pointsPerMiss: 250,
    collideFraction: 0,
    getScreenProps(opts) {
        return {
            onStart: function () {
                this.updateGameData({
                    keys: [_.camelCase(opts.gameName), 'levels', opts.level],
                    data: {
                        start: true,
                        score: 0,
                        hits: 0,
                    }
                });
            },
            onStop: function () {
                this.updateGameData({
                    keys: [_.camelCase(opts.gameName), 'levels', opts.level, 'start'],
                    data: false,
                });
            },
        };
    },
    getTimerProps(opts) {
        return {
            onComplete: function () {
                if (opts.score >= opts.scoreToWin) {
                    this.updateGameData({
                        keys: [_.camelCase(opts.gameName), 'levels', opts.level],
                        data: {
                            complete: true,
                            highScore: Math.max(opts.score, opts.highScore)
                        },
                    });
                    this.updateScreenData({
                        keys: ['reveal', 'open'],
                        data: 'complete',
                    });
                } else {
                    this.updateScreenData({
                        keys: ['reveal', 'open'],
                        data: 'retry',
                    });
                }
            },
            onIncrement: function () {
                let secondsLeft = (this.props.timeout - this.state.time) / 1000;
                if (secondsLeft === 10) {
                    this.updateScreenData({
                        data: {
                            play: 'timer',
                            timer: {
                                final: true,
                            },
                        }
                    });
                } else {
                    this.updateScreenData({
                        data: {
                            timer: {
                                final: false,
                            },
                        },
                    });
                }
            },
        };
    },
    getRevealProps(opts) {
        return {
            onOpen: function () {
                if (!opts.revealOpen || opts.revealOpen === 'next') return;
                this.updateGameData({
                    keys: [_.camelCase(opts.gameName), 'levels', opts.level, 'start'],
                    data: false,
                });
            },
            onClose: function (prevMessage) {
                var data = {
                    start: true,
                };

                if (!prevMessage || prevMessage === 'resort') return;

                if (prevMessage === 'retry') {
                    data.score = 0;
                    data.hits = 0;
                    data.start = true;
                }

                this.updateGameData({
                    keys: [_.camelCase(opts.gameName), 'levels', opts.level],
                    data,
                });
            },
        };
    },
    getSelectableProps(opts) {
        return {
            onSelect: function (binRefKey) {
                let left = ReactDOM.findDOMNode(this.refs[binRefKey]).offsetLeft - 785;
                if (opts.left === left) {
                    this.updateScreenData({
                        key: 'manual-dropper',
                        data: {
                            drop: true,
                            dropClass: `DROPPED ${_.toUpper(opts.binNames[binRefKey])}`,
                        },
                    });
                } else {
                    this.updateScreenData({
                        key: 'manual-dropper',
                        data: {
                            left,
                            dropClass: `DROPPED ${_.toUpper(opts.binNames[binRefKey])}`,
                        }
                    });
                }
            },
        };
    },
    getDropperProps(opts) {
        return {
            onStart: function () {
                this.closeRevealCallback = () => {
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
                };

                this.pickUpCallback = () => {
                    this.updateScreenData({
                        keys: ['manual-dropper', 'pickUp'],
                        data: true,
                    });
                };
            },
            onTransitionEnd: function (e) {
                let itemRef = this.refs['items-' + this.firstItemIndex];
                let DOMNode;
                let onAnimationEnd;

                if (this.DOMNode === e.target && opts.left !== 0) {
                    this.updateScreenData({
                        keys: ['manual-dropper', 'drop'],
                        data: true,
                    });
                    return;
                }

                DOMNode = ReactDOM.findDOMNode(itemRef);

                if (DOMNode !== e.target) return;
                if (!itemRef.state.className) return;

                if (e.propertyName !== 'left' && e.propertyName !== 'transform') return;
                if (!this.props.dropClass) return;

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
                        setTimeout(this.pickUpCallback, 1000);
                        return;
                    }

                    this.updateScreenData({
                        keys: ['reveal', 'open'],
                        data: 'resort',
                        callback: this.closeRevealCallback,
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

                if (!itemRef.state.className || itemRef.state.className.indexOf('POUR') === -1) {
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
                                skoash.trigger(
                                    'playMedia',
                                    {ref: _.kebabCase(_.replace(item.props.becomes.name, /\d+/g, ''))}
                                );
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

                    DOMNode.addEventListener('animationend', onAnimationEnd);
                    itemRef.addClassName('POUR');
                    this.updateScreenData({
                        key: ['item', 'pour'],
                        data: true,
                    });
                }
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
                        'manual-dropper': {
                            left: 0,
                        }
                    }
                });
            },
            onPickUp: function () {
                this.updateScreenData({
                    key: ['manual-dropper', 'dropClass'],
                    data: '',
                });
            },
        };
    },
    getLifeProps(opts) {
        return {
            onComplete: function () {
                if (opts.score >= opts.scoreToWin) {
                    this.updateGameData({
                        keys: [_.camelCase(opts.gameName), 'levels', opts.level],
                        data: {
                            complete: true,
                            highScore: Math.max(opts.score, opts.highScore)
                        },
                    });
                    this.updateScreenData({
                        keys: ['reveal', 'open'],
                        data: 'complete',
                    });
                } else {
                    this.updateScreenData({
                        keys: ['reveal', 'open'],
                        data: 'retry',
                    });
                }
            },
        };
    },
    getExtraComponents() {
        return null;
    },
    getAudioArray() {
        return audioArray;
    },
    getCatchablesArray() {
        return catchablesArray;
    },
    binNames,
    itemsToSort,
};
