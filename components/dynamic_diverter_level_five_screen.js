import DynamicDiverterGameComponent from './dynamic_diverter_game_component';
import defaultOpts from './default_dynamic_diverter_opts';

let binItems = defaultOpts.getBinItems();

export default function (props, ref, key) {
    return DynamicDiverterGameComponent(props, ref, key, _.defaults({
        level: 5,
        scoreToWin: 1045,
        binItems,
    }, defaultOpts));
}
