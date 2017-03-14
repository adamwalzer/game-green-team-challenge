import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'key-is-sorting',
        className: 'right',
        content: (
            <p>
                The key is SORTING!<br/>
                There are 5 WAYS<br/>
                you can sort<br/>
                the food waste<br/>
                at your school...
            </p>
        ),
        vo: 'TheKey',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG6',
    });
}
