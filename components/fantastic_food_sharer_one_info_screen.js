import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'priceless-pourer-one-info',
        className: 'small',
        content: (
            <p>
                Sharing snacks is just a<br/>
                kind thing to do for others.<br/>
                <br/>
                Identify those items that<br/>
                are ready to eat-not waste<br/>
                as Food Share items.
            </p>
        ),
        vo: 'SharningSnacks',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG3',
    });
}
