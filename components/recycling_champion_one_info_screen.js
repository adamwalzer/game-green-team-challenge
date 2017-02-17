import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'recycling-champion-one-info',
        className: 'small',
        content: (
            <p>
                Let's start with simple sorting<br/>
                of Recyclables, Compostables<br/>
                and Landfill items.<br/>
                <br/>
                Push the correct button to land<br/>
                items in the bin they belong to.
            </p>
        ),
        vo: 'LetsStart',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG1'
    });
}
