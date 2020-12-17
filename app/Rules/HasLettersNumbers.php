<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class HasLettersNumbers implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
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
        // Make the password strongest. Fix the function and also the text error alert

        // - must include letters and numbers

        return (preg_match('@[0-9]@', $value) && preg_match("@[a-z|A-Z]@", $value));
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'Must contain letters and numbers.';
    }
}
