import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'dynamic-diverter-four-info',
        className: 'small',
        content: (
            <p>
                It's getting messy in here!<br/>
                <br/>
                These bins are full<br/>
                of things that shouldn't<br/>
                have landed here.<br/>
                <br/>
                Let's get sorting!
            </p>
        ),
        vo: 'GettingMessy',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG4',
    });
}
