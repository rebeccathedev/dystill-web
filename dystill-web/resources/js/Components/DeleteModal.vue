<template>
  <modal name="delete-modal" :height="'auto'" @before-open="beforeOpen">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Delete Rule</h5>
        <button type="button" class="close" aria-label="Close" @click="cancel">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>Are you sure you want to delete this rule?</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="cancel">Close</button>
        <button type="button" class="btn btn-danger" @click="doDelete">Delete</button>
      </div>
    </div>
  </modal>
</template>

<script>
export default {
  name: "DeleteModal",

  props: {
    onDelete: {
      type: Function,
      required: true
    }
  },

  methods: {
    beforeOpen(event) {
      this.filter = event.params.filter;
    },

    cancel() {
      this.$modal.hide('delete-modal');
    },

    doDelete() {
      this.$modal.hide('delete-modal');
      this.onDelete(this.filter);
    }
  },

  data() {
    return {
      filter: {}
    };
  }
}
</script>

<style>

</style>
