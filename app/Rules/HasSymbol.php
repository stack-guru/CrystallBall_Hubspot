<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class HasSymbol implements Rule
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

        // - must include at least one symbol

        return (preg_match('@[!|#|\@|$|%]@', $value));
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'Must contain one special symbol (!, @, #, $, %).';
    }
}
