@extends('app')

@section('scripts')
<script src="/js/dystill-web.js"></script>
@endsection

@section('nav-form')
<form class="navbar-form navbar-left" role="search">
    <div class="form-group">
      	<input ng-model="searchText" type="text" class="form-control" placeholder="Search">
    </div>
</form>
@endsection

@section('content')
<script type="text/ng-template" id="edit-modal.html">
	<div class="modal-header">
		<div class="pull-right">
			<i ng-show="currentlyProcessing" class="fa fa-2x fa-circle-o-notch fa-spin"></i>
		</div>
		<h3 class="modal-title">Edit Rule</h3>
	</div>
	<div class="modal-body">
        <h4>If</h4>
        <form class="form">
            <div class="row">
                <div class="col-lg-3 form-group">
                    <select class="form-control" name="field">
                        <option value="From">From</option>
                        <option value="To">To</option>
                        <option value="Subject">Subject</option>
                        <option value="Return-Path">Return Path</option>
                        <option value="X-Spam-Flag">X-Spam-Flag</option>
                    </select>
                </div>
                <div class="col-lg-3 form-group">
                    <select name="comparison" class="form-control">
                        <option value="0">Starts With</option>
                        <option value="1">Ends With</option>
                        <option value="2">Contains</option>
                        <option value="3">Is</option>
                        <option value="4">Matches Regex</option>
                    </select>
                </div>
                <div class="col-lg-6 form-group">
                    <input type="text" class="form-control" />
                </div>
            </div>
        </form>
        <button class="pull-right btn btn-success" ng-click="addAction()">Add Action</button>
        <h4>Then</h4>
        <div class="clearfix"></div>
	</div>
	<div class="modal-footer">
		<button ng-disabled="currentlyProcessing" class="btn btn-success" ng-click="save()">Save</button>
		<button ng-disabled="currentlyProcessing" class="btn btn-danger" ng-click="cancel()">Cancel</button>
	</div>
</script>

<div class="container">
	<div ng-controller="rules">
        <div class="pull-right">
            <button class="btn btn-success" ng-click="addRule()">Add Rule</button>
        </div>
        <div class="clearfix"></div>
		<div class="row rule-row" ng-repeat="rule in rules | filter:searchText:strict">
			<div class="col-md-2">
				<button class="btn btn-success" ng-click="editRule(rule.filter_id)">Edit</button>
				<button class="btn btn-danger">Delete</button>
			</div>
			<div class="col-md-10">
                <h5>
    				<span>If <strong>@{{ rule.field }}</strong></span>
    				<span ng-show="rule.comparison == 0">starts with</span>
    				<span ng-show="rule.comparison == 1">ends with</span>
    				<span ng-show="rule.comparison == 2">contains</span>
    				<span ng-show="rule.comparison == 3">is</span>
    				<span ng-show="rule.comparison == 4">matches regular expression</span>
    				<span>@{{ rule.value }}, then:</span>
                </h5>
                <ul>
                    <li ng-repeat="action in rule.actions">
                        <span ng-show="action.action == 'to'">Move to</span>
                        <span ng-show="action.action == 'markasread'">Mark as read</span>
                        <span ng-show="action.action == 'flag'">Flag</span>
                        <span ng-show="action.action == 'delete'">Delete</span>
                        <span ng-show="action.action == 'prependsub'">Prepend the subject with</span>
                        <span ng-show="action.action == 'header'">Add the header</span>
                        <span ng-show="action.action == 'forward'">Forward to</span>
                        <span ng-show="action.action == 'block'">Block delivery</span>
                        <span ng-show="action.action == 'blocknote'">Block delivery with the note: </span>
                        <span ng-show="action.action == 'copyto'">Copy to</span>
                        <span ng-show="action.argument != ''">"@{{ action.argument }}"</span>
                    </li>
                </ul>
			</div>
		</div>
	</div>
</div>
@endsection
