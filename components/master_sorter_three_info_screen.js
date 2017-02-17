import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'priceless-pourer-three-info',
        content: (
            <p>
                Items from home<br/>
                can be tricky!<br/>
                <br/>
                They are unique and you<br/>
                are on your own to sort!<br/>
                Ask for help if you<br/>
                are unsure of items.
            </p>
        ),
        vo: 'ItemsFromHome',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG5',
    });
}
