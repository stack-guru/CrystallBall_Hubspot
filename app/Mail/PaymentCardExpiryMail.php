<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PaymentCardExpiryMail extends Mailable
{
    use Queueable, SerializesModels;

    public $expiryYear, $expiryMonth, $cardNumber, $username;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($expiryYear, $expiryMonth, $cardNumber, $username)
    {
        $this->expiryMonth = $expiryMonth;
        $this->expiryYear = $expiryYear;
        $this->cardNumber = $cardNumber;
        $this->username = $username;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('mails/user/cardExpiry');
    }
}
