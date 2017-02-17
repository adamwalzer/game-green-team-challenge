import itemLandfill from './items_landfill';

let binNames = [
    'recycle',
    'landfill',
    'liquids',
    'compost',
    'food-share',
];

let revealContent = {
    recycle: (
        <p>
            RECYCLING items are those<br/>
            that can be reprocessed and<br/>
            made into new products.<br/>
            Paper, metal, and plastic are<br/>
            common recyclable materials.
        </p>
    ),
    landfill: (
        <p>
            LANDFILL items are things that<br/>
            just can't be reused in any way.<br/>
            Put your thinking cap on!<br/>
            Look for ways to make<br/>
            different choices that<br/>
            reduce landfill waste.
        </p>
    ),
    liquids: (
        <p>
            LIQUIDS must be separated<br/>
            from their containers!<br/>
            This allows for the containers<br/>
            to be properly processed.<br/>
            Get pouring!
        </p>
    ),
    compost: (
        <p>
            COMPOSTING is<br/>
            fertilizer in the making!<br/>
            It's made from food scraps<br/>
            and organic materials<br/>
            that decay and become<br/>
            food for plants!
        </p>
    ),
    'food-share': (
        <p>
            FOOD SHARING is<br/>
            a great way to keep<br/>
            from wasting food!<br/>
            Leave items that others<br/>
            can make into a snack!
        </p>
    ),
};

let revealVOs = {
    recycle: 'RecyclingMaterials',
    landfill: 'ThinkingCap',
    liquids: 'GetPouring',
    compost: 'CompostingExplain',
    'food-share': 'FoodSharingExplain',
};

let binComponents = _.map(binNames, bin =>
    <skoash.Component className={bin} message={bin} />
);

let revealList = _.map(revealContent, (content, ref) =>
    <skoash.Component ref={ref}>
        {content}
    </skoash.Component>
);

let mediaCollectionList = _.map(revealVOs, (content, ref) =>
    <skoash.Audio type="voiceOver" ref={ref} src={`${CMWN.MEDIA.VO + content}.mp3`} />
);

let imageSrcs = [
    {src: `${CMWN.MEDIA.IMAGE}lights.png`},
    {src: `${CMWN.MEDIA.SPRITE}sprite.bins.png`},
    {src: `${CMWN.MEDIA.SPRITE}sprite.btn.png`},
];

let audioRefs = _.uniq(_.map(itemLandfill, v =>
    _.kebabCase(_.replace(v.name, /\d+/g, '')))
);

let arrayOfAudio = _.map(audioRefs, (v, k) =>
    <skoash.Audio
        type="voiceOver"
        ref={v}
        key={k}
        src={`${CMWN.MEDIA.GAME + 'sound-assets/_vositems/' + v}.mp3`}
        complete
    />
);

export default function (props, ref, key) {
    return (
        <skoash.Screen
            {...props}
            ref={ref}
            key={key}
            id="lights"
            backgroundAudio="BKG6"
        >
            <skoash.Repeater
                amount={imageSrcs.length}
                item={<skoash.Image className="hidden" />}
                props={imageSrcs}
            />
            <skoash.Component
                className="lights"
                children={binComponents}
            />
            <skoash.Component
                className="bins"
                children={binComponents}
            />
            {skoash.mixins.SelectableReveal(props, {
                selectables: binComponents,
                reveals: revealList,
                media: mediaCollectionList,
                SelectableProps: {
                    selectClass: 'HIGHLIGHTED',
                }
            })}
            <skoash.MediaCollection
                play={_.get(props, 'data.selectable.target') && 'click'}
            >
                <skoash.MediaSequence
                    ref="click"
                >
                    <skoash.Audio
                        type="sfx"
                        src={`${CMWN.MEDIA.EFFECT}ClickRecButton.mp3`}
                    />
                    <skoash.Audio
                        type="sfx"
                        src={`${CMWN.MEDIA.EFFECT}InfoFrameMove1.mp3`}
                    />
                </skoash.MediaSequence>
            </skoash.MediaCollection>
            <skoash.Compoent
                checkComplete={false}
                complete={true}
                children={[].concat(arrayOfAudio || [])}
            />
        </skoash.Screen>
    );
}
