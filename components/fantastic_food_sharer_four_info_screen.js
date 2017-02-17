import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'priceless-pourer-four-info',
        content: (
            <p>
                Hey Super Sharer!<br/>
                Kindness just<br/>
                skyrocketed in<br/>
                the lunchroom!<br/>
                <br/>
                Let's do this!
            </p>
        ),
        vo: 'HeySuperSharerSkyrocketed',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG3',
    });
}
