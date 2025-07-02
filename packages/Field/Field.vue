<template>
  <span class="jr-field" :class="myClass">
  	<span class="t-gray" v-if="rowLabel">{{ keyItem.label }}: </span>
    <span v-if="isHtml" v-html="myValue"></span>
    <template v-else-if="overflowTooltip">
      <el-tooltip v-bind="overflowTooltip">
        <span >{{ myValue }}<span v-if="unit">{{ unit }}</span></span>
      </el-tooltip>
    </template>
    <template v-else-if="moreArray.length">
      <span >{{ myValue }}</span><span v-if="unit">{{ unit }}</span>
      <el-tooltip effect="dark" placement="right">
        <div slot="content" style="max-width: 400px;white-space:pre-wrap;line-height:1.4;">
          {{ moreText }}
        </div>
        <el-tag disable-transitions size="mini" class="p-hover p-cursor" type="default"
          style="padding:0 3px;line-height:14px;height:16px;margin-left:5px;">
          <span style="zoom:0.9;">+{{ moreArray.length }}</span>
        </el-tag>
      </el-tooltip>
    </template>
    <template v-else>
      <template v-if="keyItem.inputType == 'file' && value">
        <template v-if="myValue instanceof Array">
            <span class="p-cursor t-active" @click="handleDownload(item)" v-for="(item, index) of myValue">
              <i class="my-icon-fujian1"></i> 附件{{ index + 1 }}
            </span>
        </template>
        <template v-else>
            <span class="p-cursor t-active" @click="handleDownload">
              <i class="my-icon-fujian1"></i> {{ myValue }}
            </span>
        </template>
      </template>
      <span v-else>{{ myValue }}<span v-if="unit">{{ unit }}</span></span>
    </template>
  </span>
</template>

<script>
  import { findItemInTree, findItemInTreePath, getStrParam, parseTime, initUploadConfig } from '@/utils/jhr';

  const DATE_COMPONENTS = ['year','month','date','dates','week','datetime','datetimerange','daterange','monthrange'];

  export default {

    name: "OwField",

    props: {
      value: [String, Number, Array, Boolean],   // 值
      keyItem: {  // 字段信息
        type: Object,
        default: _ => {
          return {}
        }
      },
      options: Object,    // 外部提供备选项
      emptyText: String,   // 空值时默认显示内容
      rowLabel: Boolean,
      isHtml: Boolean,
      line: Number,
      privacy: String,
      dict: {
        type: Object,
        default: _ => {
          return {}
        }
      }
    },

    data() {
      return {
        moreArray: []
      }
    },

    computed: {

      myOptions(){
        let res;
        if(this.options && this.options[this.keyItem.name]) {
          res = this.options[this.keyItem.name];
        } else if(this.keyItem.dict && this.dict[this.keyItem.dict]) {
          res = this.dict[this.keyItem.dict];
        } else if(this.keyItem.dict && this.dict){
          // 联合使用了字典集合
          const dict = this.keyItem.dict.split('|').map((m) => m.trim());
          dict.forEach((each)=>{
            if(this.dict[each]) {
              if(!res) res = [];
              res = res.concat(this.dict[each]);
            }
          })
        } else if(this.keyItem.options) {
          res = this.keyItem.options;
        }
        return res;
      },

      isEmpty(){
        if(this.value === undefined) return true;
        if(this.value && this.value instanceof Array && !this.value.length) return true;
        if(this.value === null || this.value === ''){
          if(this.myOptions && this.myOptions.some(s => { return s.value === this.value })) return false;
          return true;
        }
        return false;
      },

      myLine(){
        if(this.line && [1,2,3].includes(this.line)) return this.line;
        if(this.keyItem.line && [1,2,3].includes(this.keyItem.line)) return this.keyItem.line;
        return 0;
      },

      myClass(){
        if(this.isEmpty) return 't-italic t-placeholder';
        // if(this.keyItem.inputType == 'textarea' || !this.myLine) return 't-word-break';
        return !this.myLine ? '' : this.myLine == 1 ? 't-overflow' : 't-line-' + this.myLine;
      },

      myValue(){
        this.moreArray = [];
        if(this.isEmpty) return this.emptyText || this.keyItem.emptyText || '';
        let res, value = this.value;
         // 时间类型
        if(DATE_COMPONENTS.includes(this.keyItem.inputType)){
          res = '';
          if(value){
            if(typeof value === 'string' && value.includes('[')) value = JSON.parse(value);
            if(Array.isArray(value)){
              res = value.map(m => this.initDate(m)).join(value.length == 2 ? '~' : '/');
            } else {
              res = this.initDate(value);
            }
          }
        } else if(this.myOptions){    // 有备选项类型
          const valueName = this.keyItem?.props?.value || 'value';
          const labelName = this.keyItem?.props?.label || 'label';
          const childName = this.keyItem?.props?.children || 'children';
          const showAllLevels = this.keyItem.props?.showAllLevels;
          if(this.keyItem.multiple){
            if(typeof value === 'string' && value.includes('[')) value = JSON.parse(value);
            const split = this.keyItem.multipleSplit || ',', limit = this.keyItem.multipleLimit === undefined ? 3 : this.keyItem.multipleLimit;
            let valueArray = [];
            if(value){
              if(Array.isArray(value)){
                valueArray = value;
              } else {
                valueArray = split ? value?.toString().split(split) : [value];
              }
            }
            let labelArray = [], moreArray = [];
            valueArray.forEach((v, i) => {
              let $find;
              if(this.keyItem.inputType == 'cascader'){
                $find = showAllLevels ? this.initAllLevels(v) : findItemInTree(v, this.myOptions, valueName, childName);
              } else {
                $find = this.myOptions.find(f => f[valueName] == v);
              }
              const label = $find ? typeof $find === 'string' ? $find : $find[labelName] || v : v;
              if(i < limit || !limit) labelArray.push(label);
              else moreArray.push(label);
            });
            res = labelArray.join(split);
            this.moreArray = moreArray;
          } else {
            let find;
            if(this.keyItem.inputType == 'cascader'){
              find = showAllLevels ? this.initAllLevels(value) : findItemInTree(value, this.myOptions, valueName, childName);
            } else {
              find = this.myOptions.find(item => { return item[valueName] == value });
            }
            res = find ? typeof find === 'string' ? find : find[labelName] || value : value;
          }
        }
        return res === undefined ? this.initShow(value) : this.initShow(res);
      },
      unit(){
        return this.keyItem.props?.unit || this.keyItem.unit;
      },
      overflowTooltip(){
        if(!this.keyItem?.showOverflowTooltip) return null;
        const res = { content: this.myValue};
        if(typeof this.keyItem.showOverflowTooltip != 'object' ) return res;
        return Object.assign(res, this.keyItem.showOverflowTooltip, );
      },
      moreText(){
        return this.moreArray.join(this.keyItem.multipleSplit || ',');
      }
    },

    methods: {
      initShow(val){
        if(!val  && val !== 0) return this.emptyText || this.keyItem.emptyText || '';
        let res = val.toString();
        if(this.keyItem.inputType == 'file') {
          if (this.matchFileUrl(res)){
            res = getStrParam(res, 'fileName') || res;
            res = res.replace('/common/jhrFile/getFile/', '');
            if(res.length >= 32) res = '附件';
          }else {
            res = res.split(",");
          }
        } else if(this.privacy){
          let length = res.length;
          if(length == 1){
            res = '*';
          } else {
            if(length > 11) length = 11;
            if(this.privacy == 'half') {
              const beforeCount = Math.floor(length * 0.3);
              const afterCount = length > 4 ? beforeCount : 0;
              const middleCount = length - beforeCount - afterCount;
              res = res.substring(0,beforeCount) + (new Array(middleCount).fill('*').join('') + res.substring(length - afterCount, length));
            } else {
              res = new Array(length).fill('*').join('');
            }
          }
        }
        return res;
      },
      initDate(val){
        let pattern = '{y}-{m}-{d} {h}:{i}:{s}';
        switch(this.keyItem.inputType){
          case 'year': pattern = '{y}'; break;
          case 'month':
          case 'monthrange': pattern = '{y}-{m}'; break;
          case 'date':
          case 'dates':
          case 'daterange':
          case 'week': pattern = '{y}-{m}-{d}'; break;
          default: break;
        }
        return parseTime(val, pattern);
      },
      initAllLevels(val){
        const valueName = this.keyItem?.props?.value || 'value';
        const labelName = this.keyItem?.props?.label || 'label';
        const childName = this.keyItem?.props?.children || 'children';
        let myFind = findItemInTreePath(val, this.myOptions, valueName, childName);
        return myFind && myFind.length ? myFind.map((m) => m[labelName]).join(this.keyItem?.props?.separator || '/') : null;
      },
      handleDownload(item){
        if(!this.value) return;
        if(this.dowloadFun && typeof this.dowloadFun === 'function') {
          this.dowloadFun(item);
        } else {
          this.$emit('download', item);
        }
      },
      matchFileUrl(fileUrl){
        const regex = /^(https?:\/\/|\/common\/jhrFile\/getFile|\/dev-api\/common\/jhrFile\/getFile|\/stage-api\/common\/jhrFile\/getFile|\/prod-api\/common\/jhrFile\/getFile)/;
        return regex.test(fileUrl);
      }
    }
  };
</script>
<style scoped lang="scss">
  .jr-field{
    white-space: pre-wrap;
    word-break: break-word;
    &.t-word-break{
      white-space: pre-wrap;
    }
  }
</style>
