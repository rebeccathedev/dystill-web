<template>
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">
                <span>If <strong>{{ filter.field }}</strong></span>
                <span v-if="filter.comparison == 0">starts with</span>
                <span v-if="filter.comparison == 1">ends with</span>
                <span v-if="filter.comparison == 2">contains</span>
                <span v-if="filter.comparison == 3">is</span>
                <span v-if="filter.comparison == 4">matches regular expression</span>
                <span>{{ filter.value }}, then:</span>
            </h5>
            <ul class="card-text">
                <li
                    v-for="action in filter.actions"
                    :key="action.id"
                >
                    <span v-if="action.action == 'to'">Move to</span>
                    <span v-if="action.action == 'markasread'">Mark as read</span>
                    <span v-if="action.action == 'flag'">Flag</span>
                    <span v-if="action.action == 'delete'">Delete</span>
                    <span v-if="action.action == 'prependsub'">Prepend the subject with</span>
                    <span v-if="action.action == 'header'">Add the header</span>
                    <span v-if="action.action == 'forward'">Forward to</span>
                    <span v-if="action.action == 'block'">Block delivery</span>
                    <span v-if="action.action == 'blocknote'">Block delivery with the note: </span>
                    <span v-if="action.action == 'copyto'">Copy to</span>
                    <span v-if="action.argument != ''">"{{ action.argument }}"</span>
                </li>
            </ul>
            <button
                class="btn btn-success"
                @click="editFilter(filter)"
            >Edit</button>
            <button
                class="btn btn-danger"
                @click="deletefilter(filter)"
            >Delete</button>
        </div>
    </div>
</template>

<script>
export default {
  name: "FilterItem",

  props: {
    filter: {
      type: Object,
      required: true
    }
  },

  methods: {
    editFilter(filter) {
      this.$router.push({ name: 'editRule', params: { id: filter.filter_id } })
    }
  }
};
</script>

<style lang="scss">
.card {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    background: white;
    border-radius: 8px;
    border: 0;
}
</style>
