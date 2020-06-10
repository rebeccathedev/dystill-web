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
      <div class="col-md-12">
        <div class="float-right">
          <button class="btn btn-primary" @click="addRule">Add Rule</button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6" v-for="rule in filteredRules" :key="rule.filter_id" >
          <filter-item class="mt-3 mb-3" :filter="rule"></filter-item>
      </div>
    </div>
    <delete-modal :on-delete="deleteRule"></delete-modal>
  </div>
</template>

<script>
import axios from 'axios';

const FilterItem = () => import("~/Components/Filter");
const DeleteModal = () => import("~/Components/DeleteModal");

export default {
  components: {
    FilterItem,
    DeleteModal
  },

  computed: {
    filteredRules() {
      if (this.search) {
        return this.rules.filter(filter => !filter.value.search(this.search));
      }

      return this.rules;
    }
  },

  methods: {
    getRules() {
      axios.get('/srv/rules')
        .then(response => {
          this.rules = response.data;
        })
        .catch(error => {
            console.log(error);
        })
    },

    addRule() {
      this.$router.push({ name: 'editRule' });
    },

    deleteRule(filter) {
      axios.delete('/srv/rules/' + filter.filter_id).then(this.getRules);
    }
  },

  data() {
    return {
      rules: [],
      search: ""
    }
  },

  mounted() {
    this.getRules();
  }
}
</script>

<style>

</style>
