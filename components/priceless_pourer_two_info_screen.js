import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'priceless-pourer-two-info',
        content: (
            <p>
                It's time to dual!<br/>
                <br/>
                Dual sorting is<br/>
                important for accuracy.<br/>
                <br/>
                Show what you know!
            </p>
        ),
        vo: 'ItsTimeToDual',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG2',
    });
}
