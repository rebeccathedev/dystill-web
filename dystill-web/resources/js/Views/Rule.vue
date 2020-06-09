<template>
  <div>
    <h2>Edit Rule</h2>
    <h4>If</h4>
    <div class="row">
      <div class="col-lg-3 form-group">
        <select class="form-control" name="field" v-model="rule.field">
          <option value="From">From</option>
          <option value="To">To</option>
          <option value="Subject">Subject</option>
          <option value="Return-Path">Return Path</option>
          <option value="X-Spam-Flag">X-Spam-Flag</option>
        </select>
      </div>
      <div class="col-lg-3 form-group">
        <select name="comparison" class="form-control" v-model="rule.comparison">
          <option value="0">Starts With</option>
          <option value="1">Ends With</option>
          <option value="2">Contains</option>
          <option value="3">Is</option>
          <option value="4">Matches Regex</option>
        </select>
      </div>
      <div class="col-lg-6 form-group">
        <input type="text" class="form-control" v-model="rule.value" />
      </div>
    </div>

    <hr>

    <h4>Then</h4>
    <div class="row" v-for="(action, index) in actions" :key="action.action_id">
      <div class="col-lg-3 form-group">
        <select class="form-control" name="action" v-model="action.action">
          <option value="to" data-control="mailbox">Deliver To</option>
          <option value="markasread">Mark As Read</option>
          <option value="flag">Flag</option>
          <option value="delete">Delete</option>
          <option value="prependsub">Mark As Read</option>
          <option value="header">Add A Header</option>
          <option value="forward">Forward To</option>
          <option value="block">Block</option>
          <option value="blocknote">Block And Send Reply</option>
          <option value="copyto">Copy To</option>
        </select>
      </div>
      <div class="col-lg-7 form-group">
        <input v-model="action.argument" v-if="inputForType(action) == 'input'" type="text" class="form-control" />
        <select class="form-control" v-model="action.argument" v-if="inputForType(action) == 'mailbox'">
          <option v-for="mailbox in mailboxes" :key="mailbox" :value="mailbox">{{mailbox}}</option>
        </select>
      </div>
      <div class="col-lg-2 form-group">
        <div class="float-right">
          <button :disabled="actions.length == index - 1" class="btn btn-primary" @click="addAction()"><i class="fa fa-plus"></i></button>
          <button :disabled="actions.length == 1" class="btn btn-primary" @click="deleteAction(action)"><i class="fa fa-minus"></i></button>
        </div>
      </div>
    </div>
    <div v-if="actions.length == 0" class="col-lg-2 offset-lg-10 form-group">
      <div class="float-right">
        <button class="btn btn-primary" @click="addAction()"><i class="fa fa-plus"></i></button>
      </div>
    </div>
    <div class="clearfix"></div>
    <button type="submit" class="btn btn-success" @click="save">Save</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  methods: {
    inputForType(action) {
      switch (action.action) {
        case "to":
        case "copy":
          return "mailbox";
          break;
        case "header":
        case "forward":
        case "blocknote":
          return "input";
          break;
        default:
          return "none";
      }
    },

    addAction() {
      this.actions.push({"action": "to"});
    },

    deleteAction(action) {
      this.actions = this.actions.filter(act => act != action);
    },

    save() {
      var rule = this.rule;
      rule.actions = [];

      this.actions.forEach(action => {
        rule.actions.push({
          "action": action.action,
          "argument": action.argument || ""
        });
      });

      axios.post('/srv/rules/' + this.filterId, rule)
        .then(response => {
          this.$router.push({ name: 'rules'});
        })
    }
  },

  data() {
    return {
      filterId: "",
      mailboxes: [],
      rule: {
        field: "From",
        comparison: 2,
        value: ""
      },
      actions: []
    }
  },

  mounted() {
    if (this.$route.params.id) {
      axios.get('/srv/rules/' + this.$route.params.id)
        .then(response => {
          this.rule = response.data;
          this.actions = this.rule.actions;
          this.filterId = this.$route.params.id;
        })
        .catch(error => {
            console.log(error);
        });
    }

    axios.get('/srv/mailboxes')
      .then(response => {
        this.mailboxes = response.data;
      })
      .catch(error => {
          console.log(error);
      })
  }
};
</script>

<style>
</style>
