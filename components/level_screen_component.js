import classNames from 'classnames';

let levelNames = [
    <p>Recycling<br/>Champion</p>,
    <p>Priceless<br/>Pourer</p>,
    <p>Fantastic<br/>Food Sharer</p>,
    <p>Dynamic<br/>Diverter</p>,
    <p>Master<br/>Sorter</p>,
];

let flipKeys = [
    'recycling-champion',
    'priceless-pourer',
    'fantastic-food-sharer',
    'dynamic-diverter',
    'master-sorter',
    'green-team-challenge',
];

let allEarnedHelper = v => v.className;
let getStarMapHelper = level => (
    <skoash.Audio
        playTarget={['earned', level + 1]}
        type="sfx"
        src={`${CMWN.MEDIA.EFFECT}GetStar.mp3`}
    />
);

export default function (levelNumber) {
    let levelInt = _.floor(levelNumber);
    let starNum = _.round((levelNumber - levelInt) * 10);
    let levelName = levelNames[levelInt - 1];
    let emitOnComplete;

    if (starNum === 5) {
        emitOnComplete = {
            name: 'flip',
            game: flipKeys[levelInt - 1]
        };
    }

    return function (props, ref, key, opts = {}) {
        let repeaterProps = _.map(_.get(props, 'data.earned'), level =>
            ({className: level.playing ? 'earned' : ''})
        );
        let allEarned = repeaterProps.length === 5 && _.every(repeaterProps, allEarnedHelper);

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
                emitOnComplete={emitOnComplete}
            >
                <skoash.MediaSequence
                    children={[
                        <skoash.Audio
                            type="sfx"
                            src={`${CMWN.MEDIA.EFFECT}rolling-dumpser.mp3`}
                        />,
                        <skoash.Audio
                            playTarget="appear"
                            type="sfx"
                            src={`${CMWN.MEDIA.EFFECT}LevelAppear.mp3`}
                        />,
                        <skoash.Audio
                            type="sfx"
                            src={`${CMWN.MEDIA.EFFECT}LevelComplete.mp3`}
                        />,
                    ].concat(_.times(starNum, getStarMapHelper))}
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
