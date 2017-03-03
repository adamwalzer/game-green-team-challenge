import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'dynamic-diverter-one-info',
        className: 'exhaust',
        content: (
            <skoash.Component>
                <p>
                    Just because it's in the bin-<br/>
                    doesn't mean it should be.<br/>
                    <br/>
                    Drag items to the vent<br/>
                    that should not be in<br/>
                    the bin to be resorted.
                </p>
                <div className="compost-item frame-0" />
            </skoash.Component>
        ),
        vo: 'DragToBin',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG4',
        image: `${CMWN.MEDIA.IMAGE}exhaust.png`,
    });
}
