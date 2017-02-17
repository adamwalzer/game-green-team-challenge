import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'want-to-stack',
        className: 'right',
        content: (
            <p>
                Why would you<br/>
                want to stack<br/>
                your tray?
            </p>
        ),
        vo: 'WhyStack',
    });
}
