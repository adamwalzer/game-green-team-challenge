import classNames from 'classnames';

let flipKeys = [
    'recycling-champion',
    'priceless-pourer',
    'fantastic-food-sharer',
    'dynamic-diverter',
    'master-sorter',
    'green-team-challenge',
];

let levelNames = [
    'Recycling Champion',
    'Priceless Pourer',
    'Fantastic Food Sharer',
    'Dynamic Diverter',
    'Master Sorter',
];

let numberWords = [
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
];

let getLevelHeader = levelNumberWord => {
    if (levelNumberWord) return <h3 className="animated">Level {levelNumberWord} Complete!</h3>;
    return (
        <div className="header animated">
            <h3>CONGRATULATIONS!</h3>
            <h4>You are a member of Green Team!</h4>
        </div>
    );
};

let listLevels = levelNumber =>
    _.map(levelNames, (name, number) =>
        <div className={levelNumber > number ? 'complete' : ''}>
            <p>Level {number + 1}</p>
            <p>{name}</p>
        </div>
    );

export default function (levelNumber) {
    let levelNumberWord = numberWords[levelNumber - 1];

    return function (props, ref, key, opts = {}) {
        return (
            <skoash.Screen
                {...props}
                ref={ref}
                key={key}
                id={`post-level-${levelNumber}`}
                className={classNames(opts.className, {
                    APPEAR: _.get(props, 'data.appear.playing'),
                })}
                backgroundAudio={`BKG${levelNumber}`}
                emitOnComplete={{
                    name: 'flip',
                    game: flipKeys[levelNumber - 1]
                }}
            >
                <skoash.Image
                    className="hidden"
                    src={`${CMWN.MEDIA.FRAME}transition.frame.png`}
                />
                <skoash.Image
                    className="hidden"
                    src={`${CMWN.MEDIA.SPRITE}sprite.levels.png`}
                />
                <skoash.MediaSequence>
                    <skoash.Audio
                        type="sfx"
                        src={`${CMWN.MEDIA.EFFECT}LevelAward.mp3`}
                    />
                    <skoash.Audio
                        type="sfx"
                        src={`${CMWN.MEDIA.EFFECT}FlipHover.mp3`}
                    />
                    <skoash.Audio
                        type="sfx"
                        playTarget="appear"
                        src={`${CMWN.MEDIA.EFFECT}FlipDropBounce.mp3`}
                    />
                </skoash.MediaSequence>
                <div className="frame">
                    {getLevelHeader(levelNumberWord)}
                    {listLevels(levelNumber)}
                </div>
            </skoash.Screen>
        );
    };
}
