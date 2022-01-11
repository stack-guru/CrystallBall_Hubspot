<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\Log;

class ValidateCaptcha implements Rule
{
    private $reCaptchaSecretKey;

    public function __construct()
    {
        $this->reCaptchaSecretKey = config('services.recaptcha.server.key');
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        return $this->checkRequest($value);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'Captcha is required';
    }

    public function checkRequest($captchaResponse)
    {

        $ch = curl_init("https://www.google.com/recaptcha/api/siteverify");
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        //curl_setopt($ch, CURLOPT_CRLF, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, ['secret' => $this->reCaptchaSecretKey, 'response' => $captchaResponse]);
        $result = json_decode(stripcslashes(curl_exec($ch)));
        curl_close($ch);
        return $result->{'success'};
    }
}
