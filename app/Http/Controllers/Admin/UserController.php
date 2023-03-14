<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PricePlan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Yajra\DataTables\Facades\DataTables;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        if (request()->ajax()) {
            $table = User::select([
                'id',
                'team_name',
                'department',
                'name',
                'email',
                'price_plan_id',
                'price_plan_expiry_date',
                'user_id',
                'created_at',
                'email_verified_at',
                'phone_verified_at',
                'password',
                'has_password',
                'price_plan_settings',
            ])->with([
                'pricePlan:id,name',
                'user:id,email',
            ]);

            return DataTables::eloquent($table)
                ->editColumn('team_name', function ($row) {
                    return $row->team_name ? ($row->team_name) . ($row->department ? $row->department : "") : "N/A";
                })
                ->editColumn('email', function ($row) {
                    $html = $row->email;
                    if ($row->user) {
                        $html .= '<span class="badge badge-primary">' . $row->user->email . '</span>';
                    }
                    return $html;
                })
                ->editColumn('price_plan.name', function ($row) {
                    $html = $row->pricePlan? $row->pricePlan->name: '';
                    if($row->price_plan_expiry_date){
                        $html .= ' (' . ($row->price_plan_expiry_date->format(config('app.format.date'))) . ')';
                    }
                    return $html;
                })
                ->editColumn('created_at', function ($row) {
                    return $row->created_at->format(config('app.format.datetime'));
                })
                ->addColumn('verification', function ($row) {
                    $html = '';
                    if ($row->email_verified_at) {
                        $html .= '<span class="badge badge-primary">Email verified at ' . $row->email_verified_at->format(config('app.format.datetime')) . '</span>';
                    } else {
                        $html .= '<span class="badge badge-danger">Email not verified</span>';
                    }

                    if ($row->phone_verified_at) {
                        $html .= '<span class="badge badge-primary">Phone number verified at ' . $row->phone_verified_at->format(config('app.format.datetime')) . '</span>';
                    } else {
                        $html .= '<span class="badge badge-danger">Phone not verified</span>';
                    }

                    if ($row->password == \App\Models\User::EMPTY_PASSWORD) {
                        if ($row->has_password == true) {
                            $html .= '<span class="badge badge-danger">Password not set</span>';
                        } else {
                            $html .= '<span class="badge badge-success">Google Account</span>';
                        }

                    } else {
                        $html .= '<span class="badge badge-success">Password has been set</span>';
                    }

                    if ($row->price_plan_settings && $row->price_plan_settings['extended_trial']['activation_count'] > 0) {
                        $html .= '<span class="badge badge-info">Trial Extended</span>';
                    }

                    return $html;
                })
                ->addColumn('action', function ($row) {
                    ob_start();
                    ?>
                        <div class="row ml-0 mr-0 d-flex flex-row ">
                            <a class="btn btn-primary m-2"
                                href="<?=route('admin.user.show', $row->id)?>">Show</a>
                            <a class="btn btn-primary m-2"
                                href="<?=route('admin.user.edit', $row->id)?>">Edit</a>
                            <form id="deleteUserForm<?=$row->id?>" method="POST"
                                action="<?=route('admin.user.destroy', $row->id)?>">
                                <?=csrf_field()?>
                                <?=method_field("DELETE")?>
                            </form>
                            <button type="button"
                                onclick="if(confirm('Do you really want to delete this entity?')) document.getElementById('deleteUserForm<?=$row->id?>').submit();"
                                class="btn btn-danger m-2">Delete</button>

                            <form id="loginUserForm<?=$row->id?>" method="POST"
                                action="<?=route('admin.user.login', $row->id)?>">
                                <?=csrf_field()?>
                            </form>
                            <button type="button"
                                onclick="document.getElementById('loginUserForm<?=$row->id?>').submit()"
                                class="btn btn-secondary m-2">Log</button>

                            <form id="makeOwnerUserForm<?=$row->id?>" method="POST"
                                action="<?=route('admin.user.make-owner', $row->id)?>">
                                <?=csrf_field()?>
                                <?=method_field("PUT")?>
                            </form>
                            <button type="button"
                                onclick="document.getElementById('makeOwnerUserForm<?=$row->id?>').submit()"
                                class="btn btn-secondary m-2">Make Owner</button>
                        </div>
                    <?php
                    return ob_get_clean();
                })
                ->rawColumns(['email', 'verification', 'action'])
                ->make();
        }

        return view('admin/user/index');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        $user->with(['pricePlan', 'pricePlanSubscriptions']);
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
            'name'                   => ['nullable', 'string', 'max:255'],
            'email'                  => ['nullable', 'string', 'email', 'max:255'],
            'password'               => ['nullable', 'string', 'min:8'],
            'user_level'             => ['in:admin,team,viewer'],
            'price_plan_id'          => 'nullable|exists:price_plans,id',
            'price_plan_expiry_date' => 'nullable|date',
        ]);
        $user->fill($request->all());
        $user->is_billing_enabled = $request->is_billing_enabled == 'on';
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
        $user->forceDelete();
        return redirect()->route('admin.user.index')->with('success', true);
    }

    public function login(User $user)
    {
        Auth::guard('web')->logout();
        Auth::guard('web')->loginUsingId($user->id);
        Auth::setDefaultDriver('web');
        return redirect()->route('annotation.index');
    }

    public function makeOwner(User $user)
    {
        $currentOwnerId = $user->user_id;
        $newOwnerId     = $user->id;
        $newOwner       = $user;

        if (is_null($currentOwnerId)) {
            return redirect()->route('admin.user.index')->with('error', "User is already an account owner.");
        }

        $currentOwner          = User::find($currentOwnerId);
        $currentOwner->user_id = $newOwnerId;
        $currentOwner->save();

        $newOwner->user_id    = null;
        $newOwner->user_level = User::ADMIN;
        $newOwner->save();

        User::where('user_id', $currentOwnerId)->update([
            'user_id' => $newOwnerId,
        ]);

        return redirect()->route('admin.user.index')->with('success', true);
    }
}
