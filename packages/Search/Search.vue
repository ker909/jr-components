<template>
  <div class="ow-search" v-click-outside="handleClickOutside"
    :class="[
      'size-' + size,
      { 'active': show },
      { 'no-border': !border },
      { 'search-border': border },
      { 'search-border-round': border == 'round' },
      { 'search-border-circle': border == 'circle' }
    ]">
    <div class="search-button" :class="{ 'p-cursor': !show || myClearable }"  @click="handleButtonClick">
      <span class="search-icon" :class="{ 'clearable': myClearable }">
        <i :class="loading ? 'el-icon-loading' : 'el-icon-search'"></i>
        <i class="el-icon-close clear-icon"></i>
      </span>
      <span class="search-label" v-if="border != 'circle' && label && !show">{{ label }}</span>
    </div>
    <el-input ref="input" :value="value"
      :size="size"
      :placeholder="show && placeholder"
      @input="handleInput"
      @change="handleChange"
      @clear="handleClear"></el-input>
  </div>
</template>

<script>
  import { Input } from 'element-ui';
  
  export default {

    name: 'OwSearch',

    components: {
      [Input.name]: Input
    },

    model: {
      prop: 'value',
      event: 'input'
    },

    props:{
      value: String,
      label: String,
      loading: Boolean,
      size: {
        type: String,
        default: 'medium'
      },
      border: [Boolean, String],
      placeholder: {
        type: String,
        default: '搜索'
      },
      clearable: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        show: false
      };
    },

    computed: {
      myClearable() {
        return this.clearable && this.show && !this.loading && this.value;
      }
    },

    watch:{
      value:{
        immediate: true,
        handler(){
          if(this.value) this.show = true;
        }
      }
    },

    methods: {
      handleShow(){
        this.show = true;
        this.$nextTick(_ => {
          this.$refs.input.focus();
          this.$emit('show', this.show);
        });
      },
      handleClose(){
        this.show = false;
        this.$emit('show', this.show);
      },
      handleButtonClick(){
        if(!this.show) this.handleShow();
        else if(this.myClearable) this.handleClear();
      },
      handleClickOutside(){
        if(this.value) return;
        this.handleClose();
      },
      handleInput(val){
        this.$emit('input', val);
      },
      handleChange(val){
        this.$emit('change', val);
      },
      handleClear(){
        this.$emit('input', '');
        this.$emit('change', '');
        this.$emit('clear');
      },
    }
  };
</script>
<style scoped lang="scss">
  @use '@/assets/styles/variables.scss';
  .ow-search{
    display: inline-block;
    position: relative;
    box-sizing: border-box;
    background: #fff;
    white-space: nowrap;
    ::v-deep{
      .el-input{
        width: inherit;
        .el-input__inner{
          border-width: 0;
          border-radius: 0;
          border-bottom-width: 1px;
          padding: 0 !important;
          margin: -1px 0;
          background-color: transparent;
          width: 0;
          transition: width .2s;
        }
      }
    }
    .search-button{
      display: inline-block;
      white-space: nowrap;
      color: $text-color-base;
      vertical-align: top;
    }
    .search-icon{
      .clear-icon{
        display: none;
      }
      &.clearable{
        &:hover{
          .el-icon-search{
            display: none;
          }
          .clear-icon{
            display: inline;
          }
        }
      }
    }
    .search-label{
      margin-left: 5px;
      font-weight: 500;
    }
    &.size-mini{
      font-size: 12px;
      .search-button{
        height: 26px;
        line-height: 26px;
      }
    } 
    &.size-small{
      font-size: 12px;
      .search-button{
        height: 30px;
        line-height: 30px;
      }
    }
    &.size-medium{
      font-size: 14px;
      .search-button{
        height: 34px;
        line-height: 34px;
      }
    }
    &.size-large{
      font-size: 14px;
      .search-button{
        height: 38px;
        line-height: 38px;
      }
    }
    &.no-border{
      background-color: transparent;
       .search-button{
          
        }
        &.size-mini{
          height: 24px;
          line-height: 24px;
          .search-button{
            font-size: 14px;
          }
          ::v-deep{
            .el-input .el-input__inner{
              height: 22px;
            }
          }
        }
        &.size-small{
          height: 28px;
          line-height: 28px;
          .search-button{
            font-size: 16px;
          }
          ::v-deep{
            .el-input .el-input__inner{
              height: 26px;
            }
          }
        }
        &.size-medium {
          height: 32px;
          line-height: 32px;
          .search-button{
            font-size: 18px;
          }
          ::v-deep{
            .el-input .el-input__inner{
              height: 30px;
            }
          }
        }
        &.size-large{
          height: 36px;
          line-height: 36px;
          .search-button{
            font-size: 20px;
          }
          ::v-deep{
            .el-input .el-input__inner{
              height: 34px;
            }
          }
        }
    }
    &.search-border{
      border-width: 1px;
      border-style: solid;
      border-color: $border-color-base;
      border-radius: 4px;
      ::v-deep{
        .el-input .el-input__inner{
          border-bottom-width: 0;
        }
      }
      &.size-mini, 
      &.size-small{
        .search-button{
          padding: 0 15px;
        }
      }
      &.size-medium, 
      &.size-large{
        .search-button{
          padding: 0 20px;
        }
      }
      &.search-border-circle{
        border-radius: 20px;
      }
      &.search-border-round{
        border-radius: 20px;
        .search-button{
          border-radius: 20px;
        }
        &.size-large{
          .search-button{
            padding: 0 23px;
          }
        }
      }
      &.search-border-circle{
        .search-button{
          padding-right: 5px;
        }
        &.size-mini{
          .search-button{
            padding-left: 7px;
            width: 26px;
          }
        }
        &.size-small{
          .search-button{
            padding-left: 9px;
            width: 30px;
          }
        }
        &.size-medium {
          .search-button{
            padding-left: 10px;
            width: 34px;
          }
        }
        &.size-large{
          .search-button{
            padding-left: 12px;
            width: 38px;
          }
        }
      }
    }
    &:hover, &.active{
      &.search-border{
        border-color: var(--primary-color);
      }
      .search-button{
        color: var(--primary-color);
      }
    }
    &.active{
      .search-button{
        text-align: left !important;
        width: inherit !important;
        padding-right: 5px !important;
      }
      &.size-mini, &.size-small{
        ::v-deep{
          .el-input{
            .el-input__inner{
              width: 90px;
            }
          }
        }
      }
      &.size-medium, &.size-large{
        ::v-deep{
          .el-input{
            .el-input__inner{
              width: 130px;
            }
          }
        }
      }
    }
  }
</style>
