<script setup>
defineProps({
  caption: String,
  value: String
});
</script>

<template>
  <div class="hero-body is-flex is-justify-content-center" :style="'background-image:url('+backgroundChartUrl+')'">
    <div :class="{'is-flex-direction-column has-text-centered text-bordered':true, 'body-content': caption}">
      <div v-if="caption" class="token-market-cap"> {{ caption }}</div>
      <div class="token-price">{{ value }} </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TickerTextBody',
};
</script>

<style lang="scss" scoped>
.token-price {
  font-size: 75px;
  font-weight: bold;
}
.token-market-cap {
  font-size: 130px;
  font-weight: bold;
}
.hero-body {
  color: rgba(245, 180, 41, 0.87);
  background-position: center;
  background-repeat: no-repeat;
  background-size:contain;
}
</style>
