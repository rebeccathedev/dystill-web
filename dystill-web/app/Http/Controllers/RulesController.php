<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Filter;
use App\FilterAction;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class RulesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $username = $request->user()->email;
        $filters = Filter::with('actions')->whereEmail($username)->get();

        return response()->json($filters);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'field' => 'required',
            'comparison' => 'required',
            'value' => 'required',
            'actions' => 'required|array',
        ]);

        $input_filter = $request->all();

        $filter = new Filter;
        $filter->field = $input_filter['field'];
        $filter->comparison = $input_filter['comparison'];
        $filter->value = $input_filter['value'];
        $filter->email = $request->user()->email;
        $filter->save();

        foreach ($input_filter["actions"] as $input_action) {
            $action = new FilterAction;
            $action->action = $input_action["action"];

            if (!empty($input_action["argument"])) {
                $action->argument = $input_action["argument"];
            }

            $filter->actions()->save($action);
        }

        return response()->json($filter);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
        $username = $request->user()->email;
        $filters = Filter::with('actions')
            ->whereEmail($username)
            ->find($id);

        return response()->json($filters);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'field' => 'required',
            'comparison' => 'required',
            'value' => 'required',
            'actions' => 'required|array',
        ]);

        $input_filter = $request->all();
        $username = $request->user()->email;

        $filter = Filter::whereEmail($username)->findOrFail($id);
        $filter->field = $input_filter['field'];
        $filter->comparison = $input_filter['comparison'];
        $filter->value = $input_filter['value'];
        $filter->email = $request->user()->email;
        $filter->actions()->delete();
        $filter->save();

        foreach ($input_filter["actions"] as $input_action) {
            $action = new FilterAction;
            $action->action = $input_action["action"];

            if (!empty($input_action["argument"])) {
                $action->argument = $input_action["argument"];
            }

            $filter->actions()->save($action);
        }

        return response()->json($filter);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $username = $request->user()->email;
        $filter = Filter::whereEmail($username)->findOrFail($id);
        $filter->actions()->delete();
        $filter->delete();
    }
}
