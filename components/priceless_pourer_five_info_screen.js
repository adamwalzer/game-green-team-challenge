import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'priceless-pourer-five-info',
        content: (
            <p>
                Let's take this<br/>
                to the next level!<br/>
                <br/>
                You are about to<br/>
                become a<br/>
                Priceless Pourer!
            </p>
        ),
        vo: 'TakeItTotheNextLevel',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG2',
    });
}
