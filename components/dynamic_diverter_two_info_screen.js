import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'dynamic-diverter-two-info',
        content: (
            <p>
                Send misplaced items<br/>
                back to be sorted!<br/>
                <br/>
                Help others by identifying<br/>
                items in the wrong bin.
            </p>
        ),
        vo: 'MisplacedItems',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG4',
    });
}
