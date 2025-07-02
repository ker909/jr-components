import Board from './Board';

Board.install = function(Vue) {
  Vue.component(Board.name, Board);
};

export default Board;
