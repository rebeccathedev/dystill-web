<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <div class="form-group">
           <input type="text" class="form-control" v-model="search">
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6" v-for="rule in filteredRules" :key="rule.filter_id" >
          <filter-item class="mt-3 mb-3" :filter="rule"></filter-item>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const FilterItem = () => import("~/Components/Filter");

export default {
  components: {
    FilterItem
  },

  computed: {
    filteredRules() {
      if (this.search) {
          return this.rules.filter(filter => !filter.value.search(this.search));
      }

      return this.rules;
    }
  },

  data() {
    return {
      rules: [],
      search: ""
    }
  },

  mounted() {
    axios.get('/srv/rules')
      .then(response => {
        this.rules = response.data;
      })
      .catch(error => {
          console.log(error);
      })
  }
}
</script>

<style>

</style>
