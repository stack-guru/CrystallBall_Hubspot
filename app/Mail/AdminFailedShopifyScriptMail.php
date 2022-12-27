<?php

namespace App\Mail;

use App\Models\Admin;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AdminFailedShopifyScriptMail extends Mailable
{
    use Queueable, SerializesModels;

    public $admin;
    public $scriptDetail;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Admin $admin, $scriptDetail)
    {
        $this->admin = $admin;
        $this->scriptDetail = $scriptDetail;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject("Shopify Script failed: Need to fix the code!")
            ->view('mails/admin/shopifyFailedProductScript')
            ->with('admin', $this->admin)
            ->with('scriptDetail', $this->scriptDetail);
    }
}
