import InfoScreenComponent from './info_screen_component';

import itemsRecycle from './items_recycle';

let audioRefs = _.uniq(_.map(itemsRecycle, v =>
    _.kebabCase(_.replace(v.name, /\d+/g, '')))
);

var arrayOfAudio = _.map(audioRefs, (v, k) =>
    <skoash.Audio
        type="voiceOver"
        ref={v}
        key={k}
        src={`${CMWN.MEDIA.GAME + 'sound-assets/_vositems/' + v}.mp3`}
        complete
    />
);

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'key-is-sorting',
        className: 'right',
        content: (
            <p>
                The key is SORTING!<br/>
                There are 5 WAYS<br/>
                you can sort<br/>
                the food waste<br/>
                at your school...
            </p>
        ),
        vo: 'TheKey',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG6',
        extras: arrayOfAudio,
    });
}
