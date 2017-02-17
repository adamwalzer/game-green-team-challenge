import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'recycling-champion-two-info',
        content: (
            <p>
                Your Sorting Skills<br/>
                are needed for<br/>
                this next round.<br/>
                <br/>
                Get Ready-Set-Go!
            </p>
        ),
        vo: 'ReadySetGo',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG1'
    });
}
