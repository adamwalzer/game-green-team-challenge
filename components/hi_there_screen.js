import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'hi-there',
        content: (
            <p>
                Hi there!<br/>
                I'm here to<br/>
                teach you about<br/>
                sorting waste at<br/>
                your school!
            </p>
        ),
        vo: 'HiThere',
        sfx: 'InfoFrameMove1',
        backgroundAudio: 'BKG6',
    });
}
