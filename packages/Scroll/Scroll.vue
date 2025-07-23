<template>
	<overlay-scrollbars ref="scroll" class="ow-scroll" :options="myOptions">
    <div class="scroll-inner" ref="inner" :style="myStyle">
      <div v-if="!showEmpty && load && reverse" class="t-mini t-placeholder t-center" style="padding:5px 10px 10px;">
        <span v-if="loading"><i class="el-icon-loading"></i> 正在加载</span>
        <span v-else-if="complete">— 没有更多了 —</span>
        <el-button v-else class="t-hover clean-btn" type="text" @click="handleLoad">加载更多</el-button>
      </div>
      <div v-else-if="!load && loading"class="t-center t-mini t-placeholder"style="padding:5px 10px 10px;">
        <i class="el-icon-loading"></i> 正在加载
      </div>
    	<slot></slot>
      <el-empty v-if="showEmpty" :image-size="emptySize" description="暂无内容"></el-empty>
      <div v-else-if="load && !reverse" class="t-small t-placeholder t-center" style="padding:10px 10px 20px;">
        <span v-if="loading"><i class="el-icon-loading"></i> 正在加载</span>
        <span v-else-if="complete">— 没有更多了 —</span>
        <el-button v-else class="t-hover clean-btn" type="text" @click="handleLoad">滚动加载更多</el-button>
      </div>
    </div>
  </overlay-scrollbars>
</template>

<script>
  import Vue from 'vue';
  import "overlayscrollbars/css/OverlayScrollbars.css";
  import { OverlayScrollbarsComponent, OverlayScrollbarsPlugin } from "overlayscrollbars-vue";
	import { setCssValue } from '@/utils/jhr';

  Vue.component("overlay-scrollbars", OverlayScrollbarsComponent);
  Vue.use(OverlayScrollbarsPlugin);

	export default {

  name: 'OwScroll',

  components: {
    "overlay-scrollbars": OverlayScrollbarsComponent,
  },

  props:{
    load: [Function, Boolean],
  	loading: Boolean,
  	complete: Boolean,
    reverse: Boolean,
    empty: Boolean,
    emptySize: {
      type: Number,
      default: 90
    },
    padding: {
      type: [Number, String],
      default: 10
    }
  },

  data(){
    return {
      timer: null,
      overflow: {
        y: false,
        x: false
      }
    }
  },

  computed: {
    myOptions(){
      return {
        callbacks: { 
          onScrollStop: this.handleScrollStop, 
          onOverflowChanged: this.handleOverflowChanged,
          onUpdated: this.handleUpdated
        }
      }
    },
    myStyle(){
      return {
        padding: setCssValue(this.padding)
      }
    },
    showEmpty(){
      return this.empty && (this.load && this.complete && !this.loading || !this.load);
    },
    loadAgain(){
      return this.load && !this.loading && !this.complete && !this.overflow.y;
    }
  },

  watch: {
    loadAgain: {
      handler: function(val){
        clearTimeout(this.timer);
        if(val){
          this.timer = setTimeout(_ => {
            this.handleLoad();
          }, 1000)
        }
      }
    }
  },

  methods: {
    scroll(e){
      if(!this.$refs.scroll || !this.$refs.inner) return;
      if(e && typeof e === 'object'){
        this.$refs.scroll.osInstance().scroll(e);
      } else {
        const inner = this.$refs.inner.getBoundingClientRect();
        let x, y;
        if(!e) { y = 0 }
        else if(e == 'bottom') { y = inner.bottom - inner.top }
        else if(e == 'left') { x = 0 }
        else if(e == 'right') { x = inner.right - inner.left }
        else {
          const el = document.getElementById(e)?.getBoundingClientRect();
          const padding = typeof this.padding === 'number' ? this.padding : 10;
          if(el) y = el.top - inner.top - padding;
        }
        if(y === undefined && x === undefined) return;
        let res = {};
        if(y !== undefined) res.y = y;
        if(x !== undefined) res.x = x;
        this.$refs.scroll.osInstance().scroll(res);
      }
    },
    scrollStop(){
      this.$refs.scroll?.osInstance()?.scrollStop();
    },
    getState(state = 'hasOverflow'){
      return this.$refs.scroll?.osInstance().getState(state);
    },
    handleLoad(){
      typeof this.load === 'function' ? this.load() : this.$emit('load');
    },
    handleScrollStop(e){
      if(!this.load || this.loading ||  this.complete) return;
      const options =  this.$refs.scroll.osInstance().scroll();
      let positionY = options.position.y;
      clearTimeout(this.timer);
      if(this.reverse){
        if(!positionY){
          this.timer = setTimeout(_ => {
            this.scroll({ y: 100 });
            this.handleLoad();
          }, 300);
        } 
      } else {
        if(positionY > options.max.y - 5) {
          this.timer = setTimeout(_ => {
            this.handleLoad();
          }, 300);
        }
      }
    },
    handleOverflowChanged(e){
      if(!this.load) return;
      if(this.reverse && !this.overflow.y && e.y){
        this.$nextTick(_ => {
          this.scroll('bottom');
        });
      }
      this.overflow = e;
    },
    handleUpdated(e){
      // console.log('update', e)
    }
  }
};
</script>
<style scoped lang="scss">
  
</style>
