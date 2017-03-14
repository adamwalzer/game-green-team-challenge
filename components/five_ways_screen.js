import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'five-ways',
        className: 'right',
        content: (
            <p>
                With 5 ways<br/>
                to sort let's test<br/>
                your knowledge!
            </p>
        ),
        vo: '5Ways',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG6',
    });
}
