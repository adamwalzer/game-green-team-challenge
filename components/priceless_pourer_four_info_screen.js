import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'priceless-pourer-four-info',
        content: (
            <p>
                Hey Super Sorter!<br/>
                <br/>
                Things are about<br/>
                to get crazy.<br/>
                <br/>
                I hope you're ready!
            </p>
        ),
        vo: 'HeySuperSorter',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG2',
    });
}
