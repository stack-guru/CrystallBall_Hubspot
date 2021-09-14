<?php

namespace App\Http\Controllers;

use App\Models\GoogleAccount;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use App\Http\Requests\GoogleAccountRequest;

class GoogleAccountController extends Controller
{

    public function index()
    {
        return view('ui/app');
    }

    public function uiIndex()
    {
        $googleAccounts = GoogleAccount::where('user_id', Auth::id())->get();
        return ['google_accounts' => $googleAccounts];
    }

    public function create()
    {
        $scopes = [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/analytics.readonly',
        ];

        // if (config('app.env') == 'development' || config('app.env') == 'local') {
        //     array_push($scopes, 'https://www.googleapis.com/auth/adwords');
        // }
        
        return Socialite::driver('google')
            ->scopes($scopes)
            ->with(['access_type' => 'offline'])
            ->redirect();
    }

    public function store()
    {
        $user = Socialite::driver('google')->stateless()->user();
        $googleAccountId = $user->getId();
        if (GoogleAccount::where('account_id', $googleAccountId)->where('user_id', \Auth::id())->first()) {
            return redirect()->route('google-account.index', ['success' => 'false', 'message' => 'Account already linked']);
        }

        $googleAccount = new GoogleAccount;

        $googleAccount->token = $user->token;
        $googleAccount->refresh_token = $user->refreshToken;
        $googleAccount->expires_in = \Carbon\Carbon::now()->addSeconds($user->expiresIn);
        $googleAccount->account_id = $googleAccountId;
        $googleAccount->nick_name = $user->getNickname();
        $googleAccount->name = $user->getName();
        $googleAccount->email = $user->getEmail();
        $googleAccount->avatar = $user->getAvatar();
        $googleAccount->user_id = Auth::id();

        $googleAccount->save();

        return redirect()->route('google-account.index', ['google_account_id' => $googleAccount->id, 'do-refresh' => true]);

    }

    public function update(GoogleAccountRequest $request, GoogleAccount $googleAccount){
        $googleAccount->fill($request->validated());
        $googleAccount->save();
        return $googleAccount;
    }

    public function destroy(GoogleAccount $googleAccount)
    {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, 'https://oauth2.googleapis.com/revoke?token=' . $googleAccount->token . '');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, "-X");
        curl_setopt($ch, CURLOPT_POST, 1);

        $headers = array();
        $headers[] = 'Content-Type: application/x-www-form-urlencoded';
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $result = curl_exec($ch);
        if (curl_errno($ch)) {
            echo 'Error:' . curl_error($ch);
        }
        curl_close($ch);

        return ['success' => $googleAccount->delete()];
    }

}
