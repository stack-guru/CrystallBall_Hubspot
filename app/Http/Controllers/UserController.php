<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Services\SendGridService;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('ui/app');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function uiIndex()
    {
        $users = User::ofCurrentUser()->get();
        return ['users' => $users];
    }

    public function show(User $user){
        if($user->user_id !== Auth::id()) abort(404);
        return ['user' => $user];
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(UserRequest $request)
    {
        $parentUser = Auth::user();
        if ($parentUser->user_level != 'admin') {
            abort(403);
        }

        $user = new User;
        $user->fill($request->validated());
        $user->password = Hash::make($request->password);
        $user->user_id = $parentUser->id;
        $user->price_plan_id = $parentUser->price_plan_id;
        $user->price_plan_expiry_date = $parentUser->price_plan_expiry_date;
        $user->save();


        $sGS = new SendGridService;
        $sGS->addUserToList($user, "1 GAa New registrations");

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
        if ($user->user_id !== Auth::id()) {
            abort(404);
        }

        $parentUser = Auth::user();
        if ($parentUser->user_level != 'admin') {
            abort(403);
        }

        $user->fill($request->validated());
        if ($request->has('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->user_id = $parentUser->id;
        $user->price_plan_id = $parentUser->price_plan_id;
        $user->price_plan_expiry_date = $parentUser->price_plan_expiry_date;
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
        if ($user->user_id !== Auth::id()) {
            abort(404);
        }

        if (Auth::user()->user_level !== 'admin') {
            abort(403);
        }

        $user->delete();

        return ['success' => true];
    }
}
