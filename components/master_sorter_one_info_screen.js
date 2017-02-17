import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'priceless-pourer-one-info',
        content: (
            <p>
                Proper tray stacking<br/>
                is a game of space.<br/>
                <br/>
                How much space<br/>
                can you save?
            </p>
        ),
        vo: 'GameOfSpace',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG5',
    });
}
