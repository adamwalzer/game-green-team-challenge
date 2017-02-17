import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'recycling-champion-four-info',
        content: (
            <p>
                That was some<br/>
                Speed Sorting!<br/>
                <br/>
                Let's kick it<br/>
                into high drive!
            </p>
        ),
        vo: 'HighDrive',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG1'
    });
}
