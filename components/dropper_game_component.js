import classNames from 'classnames';

import ManualDropper from 'shared/components/manual_dropper/0.1';

const PTS = 'pts';

let binComponentsHelper = (name) => <skoash.Component className={name} message={name} />;
let onPlay = function () {
    this.updateScreenData({
        key: 'play',
        data: null,
    });
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
        let revealProps;
        let selectableProps;
        let dropperProps;
        let lifeProps;
        let extraComponents;

        const LEVEL_PATH = `gameState.data.${_.camelCase(opts.gameName)}.levels.${opts.level}`;

        let catchablesArray = opts.getCatchablesArray();

        let binComponents = _.map(opts.binNames, binComponentsHelper);

        let scale = _.get(props, 'gameState.scale', 1);
        let start = _.get(props, `${LEVEL_PATH}.start`, false);
        let gameComplete = _.get(props, `${LEVEL_PATH}.complete`, false);
        let drop = _.get(props, 'data.manual-dropper.drop', false);
        let dropClass = _.get(props, 'data.manual-dropper.dropClass');
        let pickUp = _.get(props, 'data.manual-dropper.pickUp', false);
        let onPickUp = _.get(props, 'data.manual-dropper.onPickUp');
        let selectItem = _.get(props, 'data.manual-dropper.selectItem');
        let itemRef = _.get(props, 'data.item.ref');
        let removeItemClassName = _.get(props, 'data.item.removeClassName');
        let itemTop = _.get(props, 'data.item.top', 0) / scale;
        let itemLeft = _.get(props, 'data.item.left', 0) / scale || 'auto';
        let caught = _.get(props, 'data.catcher.caught', '');
        let play = _.get(props, 'data.play', null);

        let audioArray = opts.getAudioArray();

        opts.props = props;
        opts.revealOpen = _.get(props, 'data.reveal.open', false);
        opts.revealClose = _.get(props, 'data.reveal.close', false);
        opts.next = _.get(props, 'data.manual-dropper.next', false);
        opts.itemRef = itemRef;
        opts.itemName = _.get(props, 'data.item.name', '');
        opts.itemNew = _.get(props, 'data.item.new', false);
        opts.itemClassName = _.get(props, 'data.item.className');
        opts.itemAmount = _.get(props, 'data.item.amount', 0);
        opts.pour = _.get(props, 'data.item.pour', false);
        opts.score = _.get(props, `${LEVEL_PATH}.score`, 0);
        opts.highScore = _.get(props, `${LEVEL_PATH}.highScore`, 0);
        opts.left = _.get(props, 'data.manual-dropper.left', 0);
        opts.hits = _.get(props, `${LEVEL_PATH}.hits`, 0);
        opts.truckClassName = _.get(props, 'data.truckClassName', '');
        opts.selectableMessage = _.get(props, 'data.selectable.message', '');
        opts.moveClaw = _.get(props, 'data.moveClaw', false);
        opts.playAudio = (
            play ? play :
            drop && !opts.truckClassName ? 'drop' :
            pickUp ? 'pickUp' :
            opts.next ? 'next' :
            opts.pour ? 'pour' :
            opts.next ? 'correct' :
            opts.revealOpen === 'resort' ? 'resort' :
            opts.revealOpen === 'retry' ? 'retry' :
            dropClass === 'TRAY-STACKING' && _.includes(opts.itemName, 'tray') ? 'tray' :
            opts.itemName ? 'select' : null
        );

        screenProps = opts.getScreenProps(opts);
        timerProps = opts.getTimerProps(opts);
        revealProps = opts.getRevealProps(opts);
        selectableProps = opts.getSelectableProps(opts);
        dropperProps = opts.getDropperProps(opts);
        lifeProps = opts.getLifeProps(opts);
        extraComponents = opts.getExtraComponents(opts);

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
                        pause={opts.revealOpen}
                        resume={!opts.revealOpen}
                        restart={start}
                        {...timerProps}
                    />
                </skoash.Component>
                <skoash.Component
                    className={classNames('item-name', {
                        ACTIVE: opts.itemName,
                    })}
                    style={{
                        top: itemTop,
                        left: itemLeft,
                    }}
                    checkComplete={false}
                    complete={true}
                >
                    <span>
                        {opts.itemName}
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
                <ManualDropper
                    checkComplete={false}
                    complete={true}
                    amount={opts.dropperAmount}
                    drop={drop}
                    pickUp={pickUp}
                    onPickUp={onPickUp}
                    next={opts.next}
                    bin={
                        <skoash.Randomizer
                            bin={catchablesArray}
                            remain
                        />
                    }
                    style={{
                        transform: `translateX(${opts.left}px)`
                    }}
                    caught={caught}
                    dropClass={dropClass}
                    itemRef={itemRef}
                    itemClassName={opts.itemClassName}
                    removeItemClassName={removeItemClassName}
                    selectItem={selectItem}
                    {...dropperProps}
                />
                <skoash.Component
                    className={classNames('bins', {
                        DISABLED: !opts.itemName
                    })}
                >
                    <skoash.Component
                        className="catch"
                        completeOnStart
                        checkComplete={false}
                        children={binComponents}
                    />
                    <skoash.Selectable
                        {...selectableProps}
                        list={binComponents}
                    />
                </skoash.Component>
                {extraComponents}
                <skoash.Reveal
                    openTarget="reveal"
                    openReveal={opts.revealOpen}
                    closeReveal={opts.revealClose}
                    checkComplete={false}
                    complete={true}
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
                    onPlay={onPlay}
                />
            </skoash.Screen>
        );
    }
}
