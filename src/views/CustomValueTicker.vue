<script setup>
import getSymbolFromCurrency from 'currency-symbol-map';
import { chartOptions, generateChart } from '../helpers/chartOptions.js';

import MNFTTickerFooter from '../components/MNFTTickerFooter.vue';
import MNFTTickerHeader from '../components/MNFTTickerHeader.vue';
import MNFTTickerBody from '../components/MNFTTickerBody.vue';
</script>

<template>
    <section class="hero is-fullheight p-5" v-if="lineChartUrl">
      <m-n-f-t-ticker-header
        :tokenImage="tokenImage"
        :tokenName="tokenName"
        :tokenSymbol="tokenSymbol && tokenSymbol"
        :tokenRank="tokenRank"
        :changePercentage="Number.parseFloat(tokenChangePercentage)"
        :days="timespan" />
      <m-n-f-t-ticker-body
        :abbreviateValue="abbreviateValue == 'true'"
        :currencySymbol="getSymbolFromCurrency(conversionCurrency)"
        :caption="caption"
        :value="Number.parseFloat(tokenValue)"
        :backgroundChartUrl="lineChartUrl"/>
      <m-n-f-t-ticker-footer />
    </section>
</template>

<script>
export default {
  components: {
    MNFTTickerFooter,
    MNFTTickerHeader,
    MNFTTickerBody,
  },
  data() {
    return {
      tokenImage: '',
      tokenSymbol: 'BTC',
      tokenName: 'Bitcoin',
      tokenRank: null,
      tokenValue: 0,
      tokenChangePercentage: 0,
      conversionCurrency: 'USD',
      timespan: '24h',
      abbreviateValue: 'false',
      graphdata: [],
      lineChartUrl: null,
      chartOptions,
      generateChart,
      getSymbolFromCurrency,
    };
  },
  computed: {
  },
  methods: {

  },
  mounted() {
    this.tokenSymbol = this.$route.query.tokenSymbol;
    this.tokenImage = this.$route.query.tokenImage;
    this.tokenName = this.$route.query.tokenName;
    this.tokenRank = this.$route.query.tokenRank;
    this.tokenValue = this.$route.query.tokenValue;
    this.conversionCurrency = this.$route.query.conversionCurrency;
    this.caption = this.$route.query.caption;
    this.timespan = this.$route.query.timespan;
    this.abbreviateValue = this.$route.query.abbreviateValue;
    this.graphdata = JSON.parse(this.$route.query.graphdata);
    this.tokenChangePercentage = this.$route.query.tokenChangePercentage;
    const lineChart = this.generateChart(548, 1400, this.graphdata);
    this.lineChartUrl = lineChart;
  },
};
</script>

<style lang="scss" scoped>
section {
  padding: 50px !important;
}
.hero {
  background-image: url('../assets/baddays_ticker_background_1.png');
  background-repeat: no-repeat;
  object-fit: contain;
  background-color: black;
  background-size: contain;
  background-position: center;
}
</style>
