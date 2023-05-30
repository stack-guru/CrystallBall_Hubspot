<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SharedReportEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $url;
    public $shared_report;
    public $property;
    public $data;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(string $url,$shared_report,$property,$data)
    {
        $this->url = $url;
        $this->shared_report = $shared_report;
        $this->property = $property;
        $this->data = $data;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $r = $this->view('mails/user/share-report')
            ->subject('Analytic Report')
            ->with('shared_report', $this->shared_report)
            ->with('property', $this->property)
            ->with('data', $this->data)
            ->attach($this->url);
        
        return $r;
    }
}
