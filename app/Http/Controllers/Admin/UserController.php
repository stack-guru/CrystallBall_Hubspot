<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PricePlan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        $data['users'] = User::with('pricePlan')->orderBy('created_at', 'DESC')->get();

        return view('admin/user/index', $data);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        $user->with('pricePlan');
        return view('admin/user/show')->with('user', $user);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function edit(User $user)
    {
        $user->with('pricePlan');
        return view('admin/user/edit')->with('user', $user)
            ->with('pricePlans', PricePlan::all());
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        $this->validate($request, [
            'name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'password' => ['nullable', 'string', 'min:8'],
            'user_level' => ['in:admin,team,viewer'],
            'price_plan_id' => 'nullable|exists:price_plans,id',
            'price_plan_expiry_date' => 'nullable|date',
        ]);
        $user->fill($request->all());
        $user->save();
        return redirect()->route('admin.user.index')->with('success', true);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('admin.user.index')->with('success', true);
    }

    public function login(User $user)
    {
        Auth::logout();
        Auth::guard('web')->loginUsingId($user->id);
        return redirect()->route('annotation.index');
    }
}
