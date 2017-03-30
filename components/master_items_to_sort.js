import traysData from './trays_data';

export default _.uniq(_.map(_.reduce(traysData, (a, v) =>
    a.concat(v.items)
, []), v =>
    _.kebabCase(_.replace(v, /\d+/g, ''))
));
