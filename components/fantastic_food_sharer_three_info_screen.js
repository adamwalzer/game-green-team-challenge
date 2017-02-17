import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'priceless-pourer-three-info',
        content: (
            <p>
                Speed Share!<br/>
                <br/>
                Get ready for a<br/>
                rush of kindness!
            </p>
        ),
        vo: 'Speedshare',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG3',
    });
}
