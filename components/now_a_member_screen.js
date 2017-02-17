import InfoScreenComponent from './info_screen_component';

export default function (props, ref, key) {
    return InfoScreenComponent(props, ref, key, {
        id: 'now-a-member',
        content: (
            <p>
                You are now a member<br/>
                of the Green Team!<br/>
                <br/>
                It's time to share<br/>
                it with your<br/>
                family and community!
            </p>
        ),
        vo: 'MemberOfGreenTeam',
    });
}
