import InfoScreenComponent from './info_screen_component';

import itemsCompost from './items_compost';

let audioRefs = _.uniq(_.map(itemsCompost, v =>
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
        id: 'five-ways',
        className: 'right',
        content: (
            <p>
                With 5 ways<br/>
                to sort let's test<br/>
                your knowledge!
            </p>
        ),
        vo: '5Ways',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG6',
        extras: arrayOfAudio,
    });
}
