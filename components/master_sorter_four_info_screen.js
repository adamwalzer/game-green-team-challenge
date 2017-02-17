import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'priceless-pourer-four-info',
        content: (
            <p>
                This is a tough<br/>
                challenge but I see<br/>
                your new Flip<br/>
                on the horizon!<br/>
                Let's Go!
            </p>
        ),
        vo: 'ToughChallenge',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG5',
    });
}
