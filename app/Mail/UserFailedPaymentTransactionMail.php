<?php

namespace App\Mail;

use App\Models\PaymentDetail;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserFailedPaymentTransactionMail extends Mailable
{
    use Queueable, SerializesModels;

    public $paymentDetail;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(PaymentDetail $paymentDetail)
    {
        $this->paymentDetail = $paymentDetail;

    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $user = $this->paymentDetail->user;
        return $this->subject("Automatic plan subscription failed!")
            ->view('mails/user/paymentFailed')
            ->with('user', $user);
    }
}
