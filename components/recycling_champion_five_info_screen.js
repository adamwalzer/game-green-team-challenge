import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'recycling-champion-five-info',
        content: (
            <p>
                Master this level<br/>
                and win the<br/>
                Recycle Champion Flip!<br/>
                <br/>
                Accuracy is important...
            </p>
        ),
        vo: 'ChampionFlip',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG1'
    });
}
