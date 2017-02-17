import 'shared/effects/index';

const FIREWORKS = 'fireworks';

let onStart = function () {
    this.effect = window.CMWN.makeEffect('fireworks', ReactDOM.findDOMNode(this), {
        backgroundImage: ReactDOM.findDOMNode(this.refs.image),
    });
};

let onStop = function () {
    _.invoke(this.effect, 'destroy');
    delete this.effect;
};

export default function (props, ref, key) {
    return (
        <skoash.Screen
            {...props}
            ref={ref}
            key={key}
            id="title"
            silentComplete
            backgroundAudio="BKG0"
        >
            <h3 content="Green Team Challenge" />
            <skoash.Image
                className="hidden"
                src={`${CMWN.MEDIA.IMAGE}gradient-texture.jpg`}
            />
            <skoash.Image
                className="trash"
                src={`${CMWN.MEDIA.IMAGE}titletrashcan.png`}
            />
            <skoash.Image
                className="character"
                src={`${CMWN.MEDIA.IMAGE}greenteamcharac.png`}
            />
            <skoash.Image
                className="tray"
                src={`${CMWN.MEDIA.IMAGE}titletray.png`}
            />
            <skoash.Component
                className={FIREWORKS}
                ref={FIREWORKS}
                onStart={onStart}
                onStop={onStop}
            >
                <skoash.Image
                    ref="image"
                    src={`${CMWN.MEDIA.IMAGE}titlescrnbg.jpg`}
                />
            </skoash.Component>
        </skoash.Screen>
    );
}
