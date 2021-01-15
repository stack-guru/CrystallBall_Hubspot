<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\UserRequest;
use Auth;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::ofCurrentUser()->get();
        return ['users' => $users];
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(UserRequest $request)
    {
        $user = new User;
        $parentUser = Auth::user();
        $user->fill($request->validated());;
        $user->user_id = $parentUser->id;
        $user->save();

        return ['user' => $user];

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(UserRequest $request, User $user)
    {
        $parentUser = Auth::user();
        $user->fill($request->validated());;
        $user->user_id = $parentUser->id;
        $user->save();

        return ['user' => $user];
        
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        if($user->user_id !== Auth::id()) abort(404);
        if(Auth::user()->user_level !== 'admin') abort(403);

        $user->delete();

        return ['success' => true];
    }
}
