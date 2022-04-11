<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Mail\UserInviteMail;
use App\Models\User;
use App\Models\UserGaAccount;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', User::class);

        return view('ui/app');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function uiIndex()
    {
        $this->authorize('viewAny', User::class);
        $user = Auth::user();
        $users = $user->user_id ? $user->user->users : $user->users;

        return ['users' => $users];
    }

    public function show(User $user)
    {

        $this->authorize('view', $user);

        if ($user->user_id !== Auth::id()) {
            abort(404, "Unable to find user with the given id.");
        }

        $user->load('userGaAccounts');
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
        $this->authorize('create', User::class);

        $parentUser = Auth::user();

        if ($parentUser->pricePlan->user_per_ga_account_count == -1) {
            abort(402);
        } else if ($parentUser->pricePlan->user_per_ga_account_count == 0) {
            // unlimited users allowed
            // do nothing
        } else if (count($parentUser->users) >= $parentUser->pricePlan->user_per_ga_account_count) {
            abort(402);
        }

        $user = new User;
        $user->fill($request->validated());
        $user->password = Hash::make($request->password);
        $user->user_id = $parentUser->id;
        $user->price_plan_id = $parentUser->price_plan_id;
        $user->price_plan_expiry_date = $parentUser->price_plan_expiry_date;
        $user->save();

        Mail::to($user)->send(new UserInviteMail($user, $request->password));

        if ($request->google_analytics_account_id !== null && !in_array("", $request->google_analytics_account_id)) {
            foreach ($request->google_analytics_account_id as $gAAId) {
                $uGAA = new UserGaAccount;
                $uGAA->user_id = $user->id;
                $uGAA->google_analytics_account_id = $gAAId;
                $uGAA->save();
            }
        } else {
            $uGAA = new UserGaAccount;
            $uGAA->user_id = $user->id;
            $uGAA->google_analytics_account_id = null;
            $uGAA->save();
        }

        event(new \App\Events\UserInvitedTeamMember($parentUser));
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

        $this->authorize('update', $user);

        $user->fill($request->validated());
        if ($request->has('password')) {
            $user->password = Hash::make($request->password);
        }

        $parentUser = Auth::user();
        $user->user_id = $parentUser->id;
        $user->price_plan_id = $user->price_plan_id;
        $user->price_plan_expiry_date = $user->price_plan_expiry_date;
        $user->save();

        $uGAAs = $user->userGaAccounts;
        $oldGAAIds = $uGAAs->pluck('google_analytics_account_id')->toArray();
        $newGAAIds = $request->google_analytics_account_id;

        foreach ($uGAAs as $uGAA) {
            if (!in_array($uGAA->google_analytics_account_id, $newGAAIds)) {
                $uGAA->delete();
            }
        }

        if ($request->has('google_analytics_account_id')) {
            if ($request->google_analytics_account_id !== null && !in_array("", $request->google_analytics_account_id)) {
                foreach ($newGAAIds as $gAAId) {
                    if (!in_array($gAAId, $oldGAAIds)) {
                        $uGAA = new UserGaAccount;
                        $uGAA->user_id = $user->id;
                        $uGAA->google_analytics_account_id = $gAAId;
                        $uGAA->save();
                    }
                }
            } else {
                if (!in_array("", $oldGAAIds)) {
                    $uGAA = new UserGaAccount;
                    $uGAA->user_id = $user->id;
                    $uGAA->google_analytics_account_id = null;
                    $uGAA->save();
                }
            }
        }

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
        $this->authorize('delete', $user);

        $user->delete();

        return ['success' => true];
    }

    public function getTeamName()
    {
        return ['team_names' => DB::table('users')->where('user_id', Auth::id())->whereNotNull('team_name')->select('team_name')->distinct()->get()];
    }
}
