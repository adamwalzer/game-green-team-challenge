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
        <skoash.Sprite
            src={`${CMWN.MEDIA.SPRITE}_${_.replace(v.bin, '-', '')}`}
            frame={v.frame || 0}
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
    <skoash.Audio ref="drop" type="sfx" src={`${CMWN.MEDIA.EFFECT}ReleaseItem1.mp3`} />,
    <skoash.Audio ref="correct" type="sfx" src={`${CMWN.MEDIA.EFFECT}CorrectSelect.mp3`} />,
    <skoash.Audio ref="resort" type="sfx" src={`${CMWN.MEDIA.EFFECT}ResortWarning.mp3`} />,
    <skoash.Audio ref="retry" type="sfx" src={`${CMWN.MEDIA.EFFECT}level-fail.mp3`} />,
    <skoash.Audio ref="pickUp" type="sfx" src={`${CMWN.MEDIA.EFFECT}ItemFlip.mp3`} />,
    <skoash.Audio ref="timer" type="sfx" src={`${CMWN.MEDIA.EFFECT}SecondTimer.mp3`} />,
]);

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
                        keys: ['manual-dropper', 'drop'],
                        data: true,
                    });
                } else {
                    this.updateScreenData({
                        keys: ['manual-dropper', 'left'],
                        data: left,
                    });
                }
            },
        };
    },
    getDropperProps(opts) {
        return {
            onTransitionEnd: function (e) {
                if (this.DOMNode !== e.target || opts.left === 0) return;
                this.updateScreenData({
                    keys: ['manual-dropper', 'drop'],
                    data: true,
                });
            },
            onNext: function () {
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
    getCatcherProps(opts) {
        return {
            onCorrect: function () {
                this.updateGameData({
                    keys: [_.camelCase(opts.gameName), 'levels', opts.level, 'score'],
                    data: opts.score + opts.pointsPerItem,
                });
                this.updateScreenData({
                    keys: ['manual-dropper', 'next'],
                    data: true,
                });
            },
            onIncorrect: function () {
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
