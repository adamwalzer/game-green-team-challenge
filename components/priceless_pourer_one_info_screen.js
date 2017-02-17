import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'priceless-pourer-one-info',
        content: (
            <p>
                Hey Recycle Champion!<br/>
                <br/>
                Next up—it's Liquids!<br/>
                Pour the liquids and<br/>
                then sort the containers.
            </p>
        ),
        vo: 'HeyRecycleChampion',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG2',
    });
}
