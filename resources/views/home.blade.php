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
<div class="container">
	<div ng-controller="rules">
		<div class="row rule-row" ng-repeat="rule in rules | filter:searchText:strict">
			<div class="col-md-2">
				<button class="btn btn-success">Edit</button>
				<button class="btn btn-danger">Delete</button>
			</div>
			<div class="col-md-5">
				<span><strong>@{{ rule.field }}</strong></span>
				<span ng-show="rule.comparison == 0">starts with</span>
				<span ng-show="rule.comparison == 1">ends with</span>
				<span ng-show="rule.comparison == 2">contains</span>
				<span ng-show="rule.comparison == 3">is</span>
				<span ng-show="rule.comparison == 4">matches regular expression</span>
				<span>@{{ rule.value }}</span>
			</div>
		</div>
	</div>
</div>
@endsection
