import DynamicDiverterGameComponent from './dynamic_diverter_game_component';
import defaultOpts from './default_dynamic_diverter_opts';

export default function (props, ref, key) {
    return DynamicDiverterGameComponent(props, ref, key, _.defaults({
        level: 3,
        scoreToWin: 200,
    }, defaultOpts));
}
