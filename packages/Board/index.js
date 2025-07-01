import Board from './Board';

/* istanbul ignore next */
Board.install = function(Vue) {
  Vue.component(Board.name, Board);
};

export default Board;
