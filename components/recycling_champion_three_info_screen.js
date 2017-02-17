import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'recycling-champion-three-info',
        content: (
            <p>
                Now that you have<br/>
                the hang of this let's<br/>
                add some speed.<br/>
                <br/>
                Good luck<br/>
                Speed Sorting!
            </p>
        ),
        vo: 'SpeedSorting',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG1'
    });
}
