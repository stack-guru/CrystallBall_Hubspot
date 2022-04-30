<?php

namespace App\Mail;

use App\Models\Admin;
use App\Models\PaymentDetail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AdminFailedPaymentTransactionMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $paymentDetail;
    public $admin;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(PaymentDetail $paymentDetail, Admin $admin)
    {
        $this->paymentDetail = $paymentDetail;
        $this->admin = $admin;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $user = $this->paymentDetail->user;
        return $this->subject("Automatic plan subscription failed for " . $user->name . "!")
            ->view('mails/admin/paymentFailed')
            ->with('user', $user);
    }
}
