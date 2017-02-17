import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'priceless-pourer-two-info',
        content: (
            <p>
                Share Some More!<br/>
                <br/>
                Your sorting skills are<br/>
                actions of kindness.<br/>
                Share the love!
            </p>
        ),
        vo: 'ShareTheLove',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG3',
    });
}
