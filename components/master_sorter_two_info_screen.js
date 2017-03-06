import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'priceless-pourer-two-info',
        className: 'small',
        content: (
            <p>
                Not all lunches are<br/>
                created equally.<br/>
                <br/>
                Some lunches come from<br/>
                home and there is<br/>
                no tray stacking needed!
            </p>
        ),
        vo: 'LunchesCreatedEqually',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG5',
    });
}
