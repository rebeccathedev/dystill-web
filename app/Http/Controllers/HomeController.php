<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

use Ddeboer\Imap\Server;
use Ddeboer\Imap\Exception\AuthenticationFailedException;

use Auth;
use Session;
use App\Filter;

class HomeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $username = $request->user()->email;
        $password = $request->user()->clear;
        $server = new Server(env("IMAP_SERVER", "localhost"));
        $connection = $server->authenticate($username, $password);

        $mailboxes = $connection->getMailboxes();

        $mb_array = [];
        if (!empty($mailboxes)) {
            foreach ($mailboxes as $mailbox) {
                $mb_array[] = $mailbox->getName();
            }
        }

        $filters = Filter::whereEmail($username)->get();

        return view("home", [
            "mailboxes" => $mb_array,
            "filters" => $filters
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
