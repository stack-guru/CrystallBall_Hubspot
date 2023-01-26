<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\CompanyInfo;
use App\Models\websiteTechnologyLookup;
use App\Providers\RouteServiceProvider;
use App\Rules\HasLettersNumbers;
use App\Rules\HasSymbol;
use Illuminate\Foundation\Auth\ConfirmsPasswords;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Sentry\Util\JSON;

class ConfirmPasswordController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Confirm Password Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password confirmations and
    | uses a simple trait to include the behavior. You're free to explore
    | this trait and override any functions that require customization.
    |
    */

    use ConfirmsPasswords;

    /**
     * Where to redirect users when the intended url fails.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth')->except(['generatePassword']);
    }

    public function generatePassword(Request $request)
    {
        $user = $request->user();

        if($user->password != User::EMPTY_PASSWORD)
            return redirect($this->redirectPath());

        $this->validate($request, [
            'name'     => ['required', 'string', 'max:255'],
            'password' => ['confirmed', 'required', 'string', 'min:8', new HasSymbol, new HasLettersNumbers]
        ], [
            'password.min' => 'Must be at least 8 characters.',
        ]);

        $user->forceFill([
            'name' => $request->name,
            'password' => Hash::make($request->password)
        ])->save();

        // $userEmail = $user->email;                                  //after email verified , when generate password  call wappalyzer api.
        // $companyDomain = explode("@", $userEmail)[1];
        
        // $ch = curl_init();
        // curl_setopt_array($ch, array(
        //     CURLOPT_URL => 'https://api.wappalyzer.com/v2/lookup/?sets=all&recursive=false&urls=https://www.' . $companyDomain . '&live=true',
        //     CURLOPT_RETURNTRANSFER => true,
        //     CURLOPT_ENCODING => '',
        //     CURLOPT_MAXREDIRS => 10,
        //     CURLOPT_TIMEOUT => 0,
        //     CURLOPT_FOLLOWLOCATION => true,
        //     CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        //     CURLOPT_CUSTOMREQUEST => 'GET',
        //     CURLOPT_HTTPHEADER => array(
        //       'x-api-key: UX3cAmxgPY8MhOMAhPtac6EjuoKeEmlH89SYpxD4'    //wappalyzer api key for our companyEmail
        //     ),
        // ));
        
        // $response = curl_exec($ch);
        // curl_close($ch);
        // $data = json_decode($response);

        // $companyInfo = new CompanyInfo();
        // $companyInfo -> user_name = $user->name;
        // $companyInfo -> company_name = $data[0]->companyName;
        // $companyInfo -> company_size = $data[0]->companySize;
        // $companyInfo -> industry = $data[0]->industry;
        // $companyInfo -> language = $data[0]->language;
        // $companyInfo -> ip = @$data[0]->ipCountry;
        // $companyInfo -> location = empty($data[0]->locations[0]) ? null : $data[0]->locations[0];
        // $companyInfo -> facebook = empty($data[0]->facebook[0]) ? null : $data[0]->facebook[0];
        // $companyInfo -> twitter = empty($data[0]->twitter[0]) ? null : $data[0]->twitter[0];
        // $companyInfo -> linkedin = empty($data[0]->linkedin[0]) ? null : $data[0]->linkedin[0];
        // $companyInfo -> instagram = empty($data[0]->instagram[0]) ? null : $data[0]->instagram[0];
        
        // $companyInfo -> save();                                         //save company info

        // $websiteTechLookup = new websiteTechnologyLookup();
        // $techArray = $data[0]-> technologies;
        // $websiteTechLookup -> site_url = $data[0]->url;
        // $websiteTechLookup -> tech1 = empty($techArray[0]->name) ? null : $techArray[0]->name;
        // $websiteTechLookup -> tech2 = empty($techArray[1]->name) ? null : $techArray[1]->name;
        // $websiteTechLookup -> tech3 = empty($techArray[2]->name) ? null : $techArray[2]->name;
        // $websiteTechLookup -> tech4 = empty($techArray[3]->name) ? null : $techArray[3]->name;
        // $websiteTechLookup -> tech5 = empty($techArray[4]->name) ? null : $techArray[4]->name;
        // $websiteTechLookup -> tech6 = empty($techArray[5]->name) ? null : $techArray[5]->name;
        // $websiteTechLookup -> tech7 = empty($techArray[6]->name) ? null : $techArray[6]->name;
        // $websiteTechLookup -> tech8 = empty($techArray[7]->name) ? null : $techArray[7]->name;
        // $websiteTechLookup -> tech9 = empty($techArray[8]->name) ? null : $techArray[8]->name;
        // $websiteTechLookup -> tech10 = empty($techArray[9]->name) ? null : $techArray[9]->name;
        // $websiteTechLookup -> tech11 = empty($techArray[10]->name) ? null : $techArray[10]->name;
        // $websiteTechLookup -> tech12 = empty($techArray[11]->name) ? null : $techArray[11]->name;
        // $websiteTechLookup -> tech13 = empty($techArray[12]->name) ? null : $techArray[12]->name;
        // $websiteTechLookup -> tech14 = empty($techArray[13]->name) ? null : $techArray[13]->name;
        // $websiteTechLookup -> tech15 = empty($techArray[14]->name) ? null : $techArray[14]->name;
        // $websiteTechLookup -> tech16 = empty($techArray[15]->name) ? null : $techArray[15]->name;
        // $websiteTechLookup -> tech17 = empty($techArray[16]->name) ? null : $techArray[16]->name;
        // $websiteTechLookup -> tech18 = empty($techArray[17]->name) ? null : $techArray[17]->name;
        // $websiteTechLookup -> tech19 = empty($techArray[18]->name) ? null : $techArray[18]->name;
        // $websiteTechLookup -> tech20 = empty($techArray[19]->name) ? null : $techArray[19]->name;


        // $websiteTechLookup -> save();                                       //save tech lookup (must improve later.)

        // event(new \Illuminate\Auth\Events\Registered($user));
        return ['user' => $user];
    }
}
