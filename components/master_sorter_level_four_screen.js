import DropperGameComponent from './dropper_game_component';
import defaultOpts from './default_master_sorter_opts';

export default function (props, ref, key) {
    return DropperGameComponent(props, ref, key, _.defaults({
        level: 4,
        scoreToWin: 950,
    }, defaultOpts));
}
