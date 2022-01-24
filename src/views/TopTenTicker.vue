<script setup>
  import MNFTTickerFooter from '../components/MNFTTickerFooter.vue';
  import MNFTTickerTitleHeader from '../components/MNFTTickerTitleHeader.vue';
  import MNFTTickerTopTenBody from '../components/MNFTTickerTopTenBody.vue';

</script>

<template>
    <section class="hero is-fullheight p-5" v-if="tokenInfos">
      <m-n-f-t-ticker-title-header 
        :title="'Top 10'"/>
      <m-n-f-t-ticker-top-ten-body
        :tokenInfos="tokenInfos"/>
      <m-n-f-t-ticker-footer />
    </section>
</template>

<script>
export default {
  components: {
    MNFTTickerFooter,
    MNFTTickerTitleHeader,
    MNFTTickerTopTenBody
  },
  data() {
    return {
      tokenInfos: null,
    }
  },
  computed: {
  },
  methods: {
    
  },
  mounted() {
    this.tokenInfos = JSON.parse(this.$route.query.tokenInfos);
  }
};
</script>

<style lang="scss" scoped>
section {
  padding: 50px !important;
}
.hero {
  background-image: url('../assets/cmf_transp.png');
  background-repeat: no-repeat;
  object-fit: contain;
  background-color: black;
  background-size: contain;
  background-position: center;
}
</style>
