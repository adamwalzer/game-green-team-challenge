import defaultGameOpts from './default_game_opts';

import itemsCompost from './items_compost';
import itemsLandfill from './items_landfill';
import itemsRecycle from './items_recycle';

let itemsToRemove = 8;

let shuffledItemsCompost = _.shuffle(itemsCompost);
let shuffledItemsLandfill = _.shuffle(itemsLandfill);
let shuffledItemsRecycle = _.shuffle(itemsRecycle);

let audioArray = [
    <skoash.Audio ref="resort" type="sfx" src={`${CMWN.MEDIA.EFFECT}ResortWarning.mp3`} />,
    <skoash.Audio ref="retry" type="sfx" src={`${CMWN.MEDIA.EFFECT}level-fail.mp3`} />,
    <skoash.Audio ref="timer" type="sfx" src={`${CMWN.MEDIA.EFFECT}SecondTimer.mp3`} />,
];

export default _.defaults({
    gameName: 'dynamic-diverter',
    gameNumber: 4,
    scoreToWin: 1200,
    timeout: 240000,
    dropperAmount: 2,
    getDropperProps() {
        return {
            onNext: function () {
                itemsToRemove = 8;
                this.updateScreenData({
                    keys: ['manual-dropper', 'binName'],
                    data: this.state.items[this.firstItemIndex].props.message,
                });
            },
        };
    },
    getDraggableProps() {
        return {
            onReady: function () {
                this.setState({
                    style: {
                        top: _.random(30, 70) + '%',
                        left: _.random(30, 70) + '%',
                    },
                    scale: _.random(1, 1.5),
                    rotate: _.random(-30, 30),
                });
            },
            onDrag: function () {
                skoash.trigger(
                    'playMedia',
                    {ref: _.kebabCase(_.replace(this.props.className, /\d+/g, ''))}
                );
            },
        };
    },
    getDropzoneProps(opts) {
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
                            }
                        });
                    }, 1000);
                };
            },
            onCorrect: function (draggable) {
                let score = opts.score + opts.pointsPerItem;

                itemsToRemove--;

                if (itemsToRemove < 0) return;

                draggable.markCorrect();

                this.updateGameData({
                    keys: [_.camelCase(opts.gameName), 'levels', opts.level],
                    data: {
                        score
                    }
                });

                if (!itemsToRemove) {
                    this.updateScreenData({
                        data: {
                            'manual-dropper': {
                                next: true,
                            },
                            reveal: {
                                open: 'next',
                            },
                        },
                        callback: this.closeRevealCallback
                    });
                }
            },
            onIncorrect: function (draggable, dropzoneArray) {
                if (!dropzoneArray) return;

                draggable.setState({
                    endX: draggable.state.endX + 200,
                    endY: draggable.state.endY + 200,
                });

                this.updateScreenData({
                    keys: ['reveal', 'open'],
                    data: 'resort',
                    callback: this.closeRevealCallback
                });

                this.updateGameData({
                    keys: [_.camelCase(opts.gameName), 'levels', opts.level],
                    data: {
                        hits: opts.hits + 1,
                        score: opts.score - opts.pointsPerMiss,
                    }
                });
            },
            assets: [
                <skoash.Audio ref="correct" type="sfx" src={`${CMWN.MEDIA.EFFECT}CorrectSelect.mp3`} />,
                <skoash.Audio ref="incorrect" type="sfx" src={`${CMWN.MEDIA.EFFECT}WrongSelect.mp3`} />,
                <skoash.Audio ref="drag" type="sfx" src={`${CMWN.MEDIA.EFFECT}Drag.mp3`} />,
                <skoash.Audio ref="drop" type="sfx" src={`${CMWN.MEDIA.EFFECT}Vacuum.mp3`} />,
            ],
            onDrag: function () {
                this.playMedia('drag');
            },
            onDrop: function () {
                this.playMedia('drop');
            },
        };
    },
    getAudioArray() {
        return audioArray;
    },
    binItems: [],
    getBinItems: function () {
        if (shuffledItemsCompost.length < 20) {
            shuffledItemsCompost = shuffledItemsCompost.concat(_.shuffle(itemsCompost));
        }

        if (shuffledItemsLandfill.length < 20) {
            shuffledItemsLandfill = shuffledItemsLandfill.concat(_.shuffle(itemsLandfill));
        }

        if (shuffledItemsRecycle.length < 20) {
            shuffledItemsRecycle = shuffledItemsRecycle.concat(_.shuffle(itemsRecycle));
        }

        return [
            {
                name: 'recycle',
                objects: []
                    .concat(shuffledItemsRecycle.splice(0, 12))
                    .concat(shuffledItemsLandfill.splice(0, 4))
                    .concat(shuffledItemsCompost.splice(0, 4)),
            },
            {
                name: 'landfill',
                objects: []
                    .concat(shuffledItemsRecycle.splice(0, 4))
                    .concat(shuffledItemsLandfill.splice(0, 12))
                    .concat(shuffledItemsCompost.splice(0, 4)),
            },
            {
                name: 'compost',
                objects: []
                    .concat(shuffledItemsRecycle.splice(0, 4))
                    .concat(shuffledItemsLandfill.splice(0, 4))
                    .concat(shuffledItemsCompost.splice(0, 12)),
            },
        ];
    }
}, defaultGameOpts);
