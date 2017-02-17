import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'priceless-pourer-five-info',
        content: (
            <p>
                The title of<br/>
                Fantastic Food-Sharer<br/>
                is on the horizon!<br/>
                <br/>
                Let's make this happen.
            </p>
        ),
        vo: 'OnTheHorizon',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG3',
    });
}
