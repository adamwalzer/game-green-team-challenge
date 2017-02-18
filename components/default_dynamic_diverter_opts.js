import defaultGameOpts from './default_game_opts';

import itemsCompost from './items_compost';
import itemsLandfill from './items_landfill';
import itemsRecycle from './items_recycle';

let shuffledItemsCompost = _.shuffle(itemsCompost);
let shuffledItemsLandfill = _.shuffle(itemsLandfill);
let shuffledItemsRecycle = _.shuffle(itemsRecycle);

let itemsToSort = [].concat(itemsCompost).concat(itemsLandfill).concat(itemsRecycle);

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
    <skoash.Audio ref="resort" type="sfx" src={`${CMWN.MEDIA.EFFECT}ResortWarning.mp3`} />,
    <skoash.Audio ref="retry" type="sfx" src={`${CMWN.MEDIA.EFFECT}level-fail.mp3`} />,
    <skoash.Audio ref="timer" type="sfx" src={`${CMWN.MEDIA.EFFECT}SecondTimer.mp3`} />,
]);

export default _.defaults({
    gameName: 'dynamic-diverter',
    gameNumber: 4,
    pointsPerBin: 400,
    scoreToWin: 1200,
    dropperAmount: 2,
    getDropperProps() {
        return {
            onNext: function () {
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
        };
    },
    getDropzoneProps(opts) {
        return {
            onCorrect: function (draggable) {
                let score = opts.score + opts.pointsPerItem;

                draggable.markCorrect();

                this.updateGameData({
                    keys: [_.camelCase(opts.gameName), 'levels', opts.level],
                    data: {
                        score
                    }
                });

                if ((score % opts.pointsPerBin) === 0) {
                    this.updateScreenData({
                        keys: ['manual-dropper', 'next'],
                        data: true,
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
                    callback: () => {
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
                    }
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
    binItems: [
        {
            name: 'recycle',
            objects: []
                .concat(shuffledItemsCompost.splice(0, 2))
                .concat(shuffledItemsLandfill.splice(0, 2))
                .concat(shuffledItemsRecycle.splice(0, 6)),
        },
        {
            name: 'landfill',
            objects: []
                .concat(shuffledItemsCompost.splice(0, 2))
                .concat(shuffledItemsLandfill.splice(0, 6))
                .concat(shuffledItemsRecycle.splice(0, 2)),
        },
        {
            name: 'compost',
            objects: []
                .concat(shuffledItemsCompost.splice(0, 6))
                .concat(shuffledItemsLandfill.splice(0, 2))
                .concat(shuffledItemsRecycle.splice(0, 2)),
        },
    ]
}, defaultGameOpts);
