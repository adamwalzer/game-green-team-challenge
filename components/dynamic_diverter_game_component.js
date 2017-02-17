import classNames from 'classnames';

import ManualDropper from 'shared/components/manual_dropper/0.1';
import Carousel from 'shared/components/carousel/0.1';
import Dropzone from 'shared/components/dropzone/0.4';
import Draggable from 'shared/components/draggable/0.4';

const PTS = 'pts';

let getChildren = v => {
    if (v.children) return v.children;

    return (
        <skoash.Sprite
            src={`${CMWN.MEDIA.SPRITE}_${_.replace(v.bin, '-', '')}`}
            frame={v.frame || 1}
            static
        />
    );
};

export default function (props, ref, key, opts = {}) {
    if (Math.abs(props.gameState.currentScreenIndex - parseInt(key, 10)) > 2) {
        return (
            <skoash.Screen
                {...props}
                ref={ref}
                key={key}
                id={`${opts.gameName}-${opts.level}`}
                backgroundAudio={`BKG${opts.gameNumber}`}
            />
        );
    } else {
        let screenProps;
        let timerProps;
        let dropperProps;
        let revealProps;
        let lifeProps;
        let draggableProps;
        let dropzoneProps;

        let binComponents;

        const LEVEL_PATH = `gameState.data.${_.camelCase(opts.gameName)}.levels.${opts.level}`;

        let start = _.get(props, `${LEVEL_PATH}.start`, false);
        let gameComplete = _.get(props, `${LEVEL_PATH}.complete`, false);
        let dropped = _.get(props, 'data.draggable.dropped');
        let dragging = _.get(props, 'data.draggable.dragging');
        let itemName = _.startCase(
            _.replace(_.get(dragging, 'props.className', ''), /\d+/g, '')
        );
        let binName = _.get(props, 'data.manual-dropper.binName', '');
        let revealOpen = _.get(props, 'data.reveal.open', false);
        let revealClose = _.get(props, 'data.reveal.close', false);
        let carouselNext = _.get(props, 'data.manual-dropper.next', false);
        let play = _.get(props, 'data.play', null);

        let answers = _.filter(opts.binNames, name => name !== binName);

        let audioArray = opts.getAudioArray();

        opts.score = _.get(props, `${LEVEL_PATH}.score`, 0);
        opts.highScore = _.get(props, `${LEVEL_PATH}.highScore`, 0);
        opts.hits = _.get(props, `${LEVEL_PATH}.hits`, 0);
        opts.selectableMessage = _.get(props, 'data.selectable.message', '');
        opts.playAudio = (
            play ? play :
            revealOpen === 'resort' ? 'resort' :
            _.kebabCase(itemName) : null
        );

        screenProps = opts.getScreenProps(opts);
        timerProps = opts.getTimerProps(opts);
        dropperProps = opts.getDropperProps(opts);
        revealProps = opts.getRevealProps(opts);
        lifeProps = opts.getLifeProps(opts);
        draggableProps = opts.getDraggableProps(opts);
        dropzoneProps = opts.getDropzoneProps(opts);

        binComponents = _.map(opts.binItems, bin => ({
            type: Carousel,
            props: {
                className: bin.name,
                message: bin.name,
                showNum: 20,
                nextOnStart: false,
                bin: {
                    type: skoash.Randomizer,
                    props: {
                        remain: true,
                        bin: _.map(bin.objects, v => ({
                            type: Draggable,
                            props: _.defaults({
                                className: v.name,
                                message: v.bin,
                                becomes: v.becomes,
                                children: getChildren(v),
                            }, draggableProps),
                        })),
                    }
                },
            }
        }));

        return (
            <skoash.Screen
                {...props}
                ref={ref}
                key={key}
                id={`${opts.gameName}-${opts.level}`}
                complete={gameComplete}
                checkComplete={!gameComplete}
                backgroundAudio={`BKG${opts.gameNumber}`}
                {...screenProps}
            >
                <skoash.Component
                    className="top-left"
                >
                    <skoash.Score
                        className="level-score"
                        correct={opts.score}
                        setScore={true}
                    >
                        {PTS}
                    </skoash.Score>
                    <skoash.Timer
                        className={classNames({
                            final: _.get(props, 'data.timer.final')
                        })}
                        countDown
                        format="mm:ss"
                        timeout={opts.timeout}
                        complete={gameComplete}
                        pause={revealOpen}
                        resume={!revealOpen}
                        restart={start}
                        {...timerProps}
                    />
                </skoash.Component>
                <skoash.Component
                    className="item-name"
                >
                    <span>
                        {itemName}
                    </span>
                </skoash.Component>
                <skoash.Component
                    className="bin-name"
                >
                    <span>
                        {binName}
                    </span>
                </skoash.Component>
                <skoash.Score
                    className="life"
                    max={0}
                    incorrect={opts.maxHits}
                    correct={opts.hits}
                    setScore={true}
                    {...lifeProps}
                />
                <Dropzone
                    dropped={dropped}
                    dragging={dragging}
                    {...dropzoneProps}
                    incorrectOnOutOfBounds={false}
                    dropzones={[<skoash.Component answers={answers} />]}
                />
                <ManualDropper
                    className="bins"
                    amount={opts.dropperAmount}
                    next={carouselNext}
                    bin={<skoash.Randomizer
                        remain
                        bin={binComponents}
                    />}
                    {...dropperProps}
                />
                <skoash.Reveal
                    openTarget="reveal"
                    openReveal={revealOpen}
                    closeReveal={revealClose}
                    {...revealProps}
                    list={[
                        <skoash.Component
                            ref="resort"
                            type="li"
                        />,
                        <skoash.Component
                            ref="retry"
                            type="li"
                        />,
                        <skoash.Component
                            ref="complete"
                            type="li"
                        />,
                    ]}
                />
                <skoash.MediaCollection
                    play={opts.playAudio}
                    children={audioArray}
                    checkComplete={false}
                    checkReady={false}
                    complete={true}
                />
            </skoash.Screen>
        );
    }
}
