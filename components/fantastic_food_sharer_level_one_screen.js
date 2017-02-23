import DropperGameComponent from './dropper_game_component';
import defaultOpts from './default_fantastic_food_sharer_opts';

export default function (props, ref, key) {
    return DropperGameComponent(props, ref, key, _.defaults({
        level: 1,
        timeout: 120000,
        scoreToWin: 100,
    }, defaultOpts));
}