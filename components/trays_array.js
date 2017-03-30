import Catchable from 'shared/components/catchable/0.2';
import itemsCompost from './items_compost';
import itemsFoodShare from './items_food_share';
import itemsLandfill from './items_landfill';
import itemsLiquids from './items_liquids';
import itemsRecycle from './items_recycle';
import traysData from './trays_data';

let itemsToSort = []
    .concat(itemsCompost)
    .concat(itemsFoodShare)
    .concat(itemsLandfill)
    .concat(itemsLiquids)
    .concat(itemsRecycle);

let onSelect = function (key) {
    let ref = this.refs[key];
    let rect = ReactDOM.findDOMNode(ref).getBoundingClientRect();
    this.updateScreenData({
        key: 'item',
        data: {
            name: _.startCase(_.replace(ref.props.className, /\d+/g, '')),
            new: true,
            ref,
            top: rect.top,
            left: rect.left,
        }
    });
    skoash.trigger(
        'playMedia',
        {ref: _.kebabCase(_.replace(ref.props.className, /\d+/g, ''))}
    );
};

let onBootstrap = function () {
    this.invokeChildrenFunction('markCatchable');
};

let getName = name => {
    if (!_.includes(name, 'tray')) {
        return [
            'tray-blue',
            'tray-pink',
        ][_.random(0, 1)];
    }

    return name;
};

let getChildren = v => {
    if (v.children) return v.children;

    return (
        <div className={`sprite ${v.bin}-item frame-${v.frame}`}/>
    );
};

let mapItems = function (itemNames) {
    let items = _.uniqBy(_.filter(itemsToSort, item => _.includes(itemNames, item.name)), 'name');

    return _.map(items, item =>
        <Catchable
            className={item.name}
            message={item.bin}
            reCatchable={true}
            becomes={item.becomes}
            children={getChildren(item)}
        />
    );
};

export default _.map(traysData, data => {
    let bin = _.includes(data.name, 'tray') ? 'tray-stacking' : 'home';
    let name = getName(data.name);

    return {
        type: Catchable,
        props: {
            className: name,
            message: bin,
            reCatchable: true,
            children: getChildren({
                name,
                bin,
                children: [
                    <skoash.Selectable
                        onSelect={onSelect}
                        onBootstrap={onBootstrap}
                        list={mapItems(data.items)}
                    />
                ]
            }),
        },
    };
});
