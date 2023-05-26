<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;

use Illuminate\Queue\SerializesModels;
use App\Repositories\FacebookAutomationRepository;

class FacebookCreateAnnotation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $userId;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($userId)    
    {
        set_time_limit(8000000);
        $this->userId = $userId;

    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        (new FacebookAutomationRepository())->handleFacebookAutomation($this->userId);
    }
}
