import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'priceless-pourer-three-info',
        content: (
            <p>
                Success is twice as nice<br/>
                when dual sorting!<br/>
                <br/>
                Let's kick it up a notch.
            </p>
        ),
        vo: 'KickItupANotch',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG2',
    });
}
