import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'dynamic-diverter-three-info',
        content: (
            <p>
                Way to Sort!<br/>
                <br/>
                This next level takes<br/>
                Super Sorting Skills!
            </p>
        ),
        vo: 'WayToSort',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG4',
    });
}
