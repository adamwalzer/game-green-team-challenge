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

let audioArray = [
    <skoash.Audio ref="drop" type="sfx" src={`${CMWN.MEDIA.EFFECT}ClickRecButton.mp3`} />,
    <skoash.Audio ref="correct" type="sfx" src={`${CMWN.MEDIA.EFFECT}ConveyorBelt.mp3`} />,
    <skoash.Audio ref="resort" type="sfx" src={`${CMWN.MEDIA.EFFECT}ResortWarning.mp3`} />,
    <skoash.Audio ref="retry" type="sfx" src={`${CMWN.MEDIA.EFFECT}level-fail.mp3`} />,
    <skoash.Audio ref="pickUp" type="sfx" src={`${CMWN.MEDIA.EFFECT}ItemFlip.mp3`} />,
    <skoash.Audio ref="pour" type="sfx" src={`${CMWN.MEDIA.EFFECT}LiquidPour.mp3`} />,
    <skoash.Audio ref="timer" type="sfx" src={`${CMWN.MEDIA.EFFECT}SecondTimer.mp3`} />,
];

let onAnimationComplete = function () {
    setTimeout(() => this.setState({frame: this.props.frame}), 500);
};

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
                <skoash.Animation
                    className="priceless-belt"
                    frames={_.get(opts.props, 'gameState.data.priceless-belt.frames.length', 1)}
                    frame={0}
                    loop={false}
                    duration={250}
                    animate={opts.next}
                    onComplete={onAnimationComplete}
                />
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
    itemsToSort,
    getAudioArray() {
        return audioArray;
    },
    getCatchablesArray() {
        return catchablesArray;
    },
}, defaultGameOpts);
