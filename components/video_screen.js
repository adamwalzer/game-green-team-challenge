import classNames from 'classnames';

let trayClassNames = _.times(12, () => ({className: `lunch-tray frame-${_.random(1, 4)}`}));

export default function (props, ref, key, content, gameState, data) {
    return (
        <skoash.Screen
            {...props}
            ref={ref}
            key={key}
            id="video"
            backgroundAudio="BKG5"
        >
            <skoash.MediaSequence>
                <skoash.Audio
                    type="voiceOver"
                    playTarget="bad"
                    src={`${CMWN.MEDIA.VO}BadStacking.mp3`}
                />
                <skoash.Audio
                    type="sfx"
                    playTarget="crash"
                    src={`${CMWN.MEDIA.EFFECT}metal-messy-falling-crash.mp3`}
                />
                <skoash.Audio
                    type="voiceOver"
                    playTarget="proper"
                    src={`${CMWN.MEDIA.VO}ProperStacking.mp3`}
                />
            </skoash.MediaSequence>
            <skoash.Component
                className={classNames('frame frame-1', {
                    SHOW: _.get(data, 'bad.playing')
                })}
            >
                <p>
                    Bad stacking can take up a lot of room and<br/>
                    cause a real mess!
                </p>
                <skoash.Image src={`${CMWN.MEDIA.IMAGE}frame-1.png`} />
            </skoash.Component>
            <skoash.Component
                className={classNames('frame crash', {
                    SHOW: _.get(data, 'crash.playing')
                })}
            >
                <skoash.Image src={`${CMWN.MEDIA.IMAGE}frame-3.png`} />
                <skoash.Repeater
                    className="trays"
                    amount={12}
                    props={trayClassNames}
                />
                <skoash.Image className="crash" src={`${CMWN.MEDIA.IMAGE}crash-01.png`} />
            </skoash.Component>
            <skoash.Component
                className={classNames('frame frame-2', {
                    SHOW: _.get(data, 'proper.playing')
                })}
            >
                <p>
                    But proper stacking keeps things neat<br/>
                    and provides space for all!
                </p>
                <skoash.Image src={`${CMWN.MEDIA.IMAGE}frame-2.png`} />
            </skoash.Component>
        </skoash.Screen>
    );
}
