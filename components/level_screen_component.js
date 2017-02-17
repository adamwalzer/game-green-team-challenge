import classNames from 'classnames';

let levelKeys = [
    'recyclingChampion',
    'pricelessPourer',
    'fantasticFoodSharer',
    'dynamicDiverter',
    'masterSorter',
];

let levelNames = [
    <p>Recycling<br/>Champion</p>,
    <p>Priceless<br/>Pourer</p>,
    <p>Fantastic<br/>Food Sharer</p>,
    <p>Dynamic<br/>Diverter</p>,
    <p>Master<br/>Sorter</p>,
];

export default function (levelNumber) {
    let levelInt = _.floor(levelNumber);
    let levelKey = levelKeys[levelInt - 1];
    let levelName = levelNames[levelInt - 1];

    return function (props, ref, key, opts = {}) {
        let levelData = _.get(props, `gameState.data.${levelKey}.levels`, {});
        let repeaterProps = _.map(_.get(props, 'data.earned'), (level, index) =>
            ({className: level.playing && _.get(levelData, `${index}.complete`) ? 'earned' : ''})
        );
        let allEarned = repeaterProps.length === 5 && _.every(repeaterProps, v => v.className);

        return (
            <skoash.Screen
                {...props}
                ref={ref}
                key={key}
                id={`pre-level-${levelNumber}`}
                backgroundAudio={`BKG${levelInt}`}
                className={classNames(opts.className, {
                    ALL_EARNED: allEarned,
                    APPEAR: _.get(props, 'data.appear.playing'),
                })}
            >
                <skoash.MediaSequence
                    children={[
                        <skoash.Audio
                            playTarget="appear"
                            type="sfx"
                            src={`${CMWN.MEDIA.EFFECT}LevelAppear.mp3`}
                        />,
                        <skoash.Audio
                            type="sfx"
                            src={`${CMWN.MEDIA.EFFECT}LevelComplete.mp3`}
                        />,
                    ].concat(
                        _.map(levelData, (data, level) =>
                            <skoash.Audio
                                playTarget={['earned', level]}
                                type="sfx"
                                src={`${CMWN.MEDIA.EFFECT}GetStar.mp3`}
                                volume={data.complete ? 1 : 0}
                            />
                        )
                    )}
                />
                <skoash.Image className="hidden" src={`${CMWN.MEDIA.IMAGE}purple.ribbon.png`} />
                <skoash.Image className="hidden" src={`${CMWN.MEDIA.IMAGE}luggage.png`} />
                <skoash.Image className="hidden" src={`${CMWN.MEDIA.SPRITE}flips.png`} />
                <skoash.Repeater
                    className="stars"
                    amount={5}
                    props={repeaterProps}
                />
                <div className="frame">
                    <h3>Level {levelInt}</h3>
                    {levelName}
                </div>
            </skoash.Screen>
        );
    };
}
