import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'dynamic-diverter-five-info',
        content: (
            <p>
                Waste Diversion is the<br/>
                name of the game.<br/>
                <br/>
                The title of<br/>
                Dynamic Diverter is<br/>
                just around the corner.
            </p>
        ),
        vo: 'WasteDiversion',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG4',
    });
}
