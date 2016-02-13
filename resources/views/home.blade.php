@extends('app')

@section('content')
<div class="container">
	@foreach ($filters as $filter)
	<div class="row">
		<div class="col-md-2">
			<button class="btn btn-success">Edit</button>
			<button class="btn btn-danger">Delete</button>
		</div>
		<div class="col-md-5">
			{{$filter->field}}

			@if ($filter->comparison == 0)
			starts with
			@endif
			@if ($filter->comparison == 1)
			ends with
			@endif
			@if ($filter->comparison == 2)
			contains
			@endif
			@if ($filter->comparison == 3)
			is
			@endif
			@if ($filter->comparison == 4)
			matches regular expression
			@endif

			{{$filter->value}}
		</div>
		<div class="col-md-8">

		</div>
	</div>
	@endforeach
</div>
@endsection
