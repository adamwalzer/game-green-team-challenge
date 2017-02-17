import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'priceless-pourer-five-info',
        content: (
            <p>
                You are about to Win<br/>
                the highest honor for the<br/>
                Green Team Challenge!<br/>
                <br/>
                Win this level to become<br/>
                a Master Sorter!
            </p>
        ),
        vo: 'HighestHonor',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG5',
    });
}
