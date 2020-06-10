<template>
  <div class="app">
    <progress-bar v-if="progressCount > 0"></progress-bar>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import axios from "axios";
const ProgressBar = () => import("~/Components/ProgressBar");

export default {
  components: {
    ProgressBar
  },

  data() {
    return {
      progressCount: 0
    }
  },

  mounted() {
    axios.interceptors.request.use(config => {
      this.progressCount++;
      return config;
    });

    axios.interceptors.response.use(response => {
      this.progressCount--;
      return response;
    });
  }
}
</script>

<style>
.vm--modal {
  border-radius: 0.3rem !important;
}
</style>
