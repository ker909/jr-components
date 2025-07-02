<template>
  <div class="jr-board" :class="['board-mode-' + mode, 'type-' + type]">
    <div class="board-inner clearfix"  >
      <div class="board-item fl" v-for="(item,index) in model" :key="index + ''" 
        :class="[item.enabled ? 'enabled' : '', { 'border-top': index < col }, 'size-' + size]"
        :style="itemStyle">
        <div class="f-col">
          <div class="board-top-bar f-aside">
            <div class="f-row">
              <div class="f-aside" style="width:18px;">
                <div v-if="selectable" style="padding: 1px 0 0 3px;">
                  <el-checkbox class="round-checkbox" :value="selected && selected.includes(item)" @change="handleCardClick(item)"></el-checkbox>
                </div>
              </div>
              <div class="f-main">
                <div v-if="!selectable"><slot name="topBar" :row="item" :$index="index"></slot></div>
              </div>
              <div class="f-aside" style="width:18px;">
                <div class="border-operator" v-if="!selectable && initOperator(item) && initOperator(item).length" style="padding-top:2px;">
                  <el-dropdown>
                    <span class="operator-btn t-large t-placeholder"><i class="my-icon-moreandroid"></i></span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-for="btn in initOperator(item)" :key="btn.name" @click.native.stop="handleOperatorClick(btn,item)">
                        <i v-if="btn.icon" :class="btn.icon"></i>{{ btn.label }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
            </div>
          </div>
          <div class="f-main" @click="handleCardClick(item)">
            <div class="f-col">
              <div class="board-icon f-main">
                <div class="p-center">
                  <span v-if="$scopedSlots.icon"><slot name="icon" :row="item" :$index="index"></slot></span>
                  <i v-else-if="checkIsIcon(item)" :class="initIcon(item)"></i>
                  <span v-else>{{ initIcon(item) }}</span>
                </div>
              </div>
              <div class="board-label f-aside t-center">
                <div :class="size == 'large' ? 't-line-3' : size == 'medium' ? 't-line-2' : 't-overflow'">{{ item[labelName]}}</div>
              </div>
            </div>
          </div>
          <div class="board-bottom-bar f-aside">
            <div v-if="!selectable"><slot name="bottomBar" :row="item" :$index="index"></slot></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { setCssValue, mixColor, initNumber } from '@/utils/jhr';

  export default {

    name: "OwBoard",

    props: {
      model: Array,
      size: {
        type: String,
        default: 'medium'
      },
      mode: {
        type: String,
        default: 'default'
      },
      type: {
        type: String,
        default: 'primary'
      },
      selectable: Boolean,
      selected: Array,
      color: String,
      colorDirection: {
        type: String,
        default: 'top right'
      },
      icon: {
        type: [String, Boolean],
        default: 'my-icon-gongnengdingyi'
      },
      iconName: {
        type: String,
        default: 'icon'
      },
      labelName: {
        type: String,
        default: 'label'
      },
      rowIconMethod: Function,
      operator: [Array, Function],
      colors: {
        type: Object,
        default: _ => {
          return {
            primary: "#428BCA",
            info: "#5BC0DE",
            success: "#5CB85C",
            warning: "#F0AD4E",
            danger: "#D9534F",
            special: "#455866",
            default: "#909399"
          }
        }
      }
    },

    computed: {

      itemBaseWidth(){
        switch(this.size){
          case 'mini': return 90;
          case 'small': return 120;
          case 'large': return 200;
          default: return 160;
        }
      },

      col(){
        return Math.floor(this.boxWidth / this.itemBaseWidth);
      },

      itemWidth(){
        const gap = this.boxWidth - this.col * this.itemBaseWidth;
        return this.itemBaseWidth + Math.floor(gap / this.col);
      },

      itemStyle(){
        const width = this.itemWidth && this.itemWidth > 80 ? this.itemWidth : 80;
        let res = {
          width: width + 'px',
          height: width + 'px'
        };
        if(this.mode == 'color' || this.mode == 'gradient'){
          const color = this.color || this.colors[this.type] || '#409EFF';
          if(this.mode == 'gradient'){
            const subColor = mixColor(color, '#FFFFFF', 0.3);
            res.backgroundImage = `linear-gradient(to ${ this.colorDirection },${ color },${subColor})`;
          } else {
            res.backgroundColor = color;
          }
        }
        return res;
      },
    },

    data(){
      return {
        boxWidth: 1000
      }
    },

    mounted(){
      this.initBoxWidth();
      this.$el.addEventListener('resize', this.initBoxWidth);
    },

    beforeDestroy() {
      this.$el.removeEventListener('resize', this.initBoxWidth);
    },

    methods: {
      initBoxWidth(){
        this.boxWidth = this.$el?.getBoundingClientRect().width || 1000;
      },
      initIcon(row){
        let res = row && row[this.iconName] || this.icon;
        if(this.rowIconMethod && typeof this.rowIconMethod === 'function') {
          const temp = this.rowIconMethod(row);
          if(temp) res = temp;
        }
        return res.toString();
      },

      initOperator(row){
        if(!this.operator) return [];
        return typeof this.operator === 'function' ? this.operator(row) : this.operator;
      },

      checkIsIcon(row){
        const icon = this.initIcon(row);
        return icon.includes('el-icon-') || icon.includes('my-icon-');
      },

      handleSelect(item){
        if(!item) return;
        let res = this.selected || [];
        const index = this.selected.indexOf(item);
        index < 0 ? res.push(item) : res.splice(index, 1);
        this.$emit('update:selected', res);
      },

      handleCardClick(item){
        if(this.selectable) this.handleSelect(item);
        else this.$emit('card-click', item);
      },

      handleOperatorClick(btn, item){
        this.$emit('operator-click', btn, item);
      }
    }
  };
</script>
<style scoped lang="scss">
  .jr-board{
    color: $text-color-base;
    .board-inner{
      cursor: default;
      box-sizing: border-box;
      .board-item{
        box-sizing: border-box;
        margin-right: 6px;
        margin-bottom: 6px;
        cursor: pointer;
        position: relative;
        border :1px solid $border-color-base;
        border-radius: 5px;
        .board-top-bar, .board-bottom-bar{
          height: 20px;
          color: $text-color-lighter;
        }
        .board-icon{
          position: relative;
          font-size: 50px;
        }
        .board-label{
          font-size: 15px;
          padding: 0 10px;
          height: 36px;
          line-height: 1.2;
        }
        &:hover{
          .board-top-bar, .board-bottom-bar, .operator-btn, .board-icon, .board-label{
            color: $hover-color;
          }
        }
        &.size-large{
          .board-icon{
            font-size: 60px;
          }
          .board-label{
            font-size: 16px;
            padding: 0 15px;
            height: 60px;
          }
        }
        &.size-small{
          .board-icon{
            font-size: 40px;
          }
          .board-label{
            font-size: 13px;
            padding: 0 7px;
            height: 16px;
          }
        }
        &.size-mini{
          .board-icon{
            font-size: 30px;
          }
          .board-label{
            font-size: 12px;
            padding: 0 5px;
            height: 14px;
          }
        }
      }
      .enabled{
        border-bottom: 4px solid #428BCA;

      }
    }
    &.board-mode-hover{
      .board-item{
        &:hover{
          color: white;
        }
      }
      &.type-primary{
        .board-item{
          &:hover{
            background-color: #428BCA;
          }
        }
      }
      &.type-success{
        .board-item{
          &:hover{
            background-color: #5CB85C;
          }
        }
      }
      &.type-warning{
        .board-item{
          &:hover{
            background-color: #F0AD4E;
          }
        }
      }
      &.type-danger{
        .board-item{
          &:hover{
            background-color: #D9534F;
          }
        }
      }
      &.type-info{
        .board-item{
          &:hover{
            background-color: #5BC0DE;
          }
        }
      }
    }
    &.board-mode-color,
    &.board-mode-gradient{
      .boraer-inner{
        border-color: white;
        color: white;
        .board-item{
          &:hover{
            opacity: 0.9;
          }
        }
      }
    }
  }
</style>
