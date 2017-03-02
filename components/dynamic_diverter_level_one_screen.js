import DynamicDiverterGameComponent from './dynamic_diverter_game_component';
import defaultOpts from './default_dynamic_diverter_opts';

let binItems = defaultOpts.getBinItems();

export default function (props, ref, key) {
    return DynamicDiverterGameComponent(props, ref, key, _.defaults({
        level: 1,
        scoreToWin: 665,
        binItems,
    }, defaultOpts));
}
