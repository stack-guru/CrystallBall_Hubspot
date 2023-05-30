<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;

use Illuminate\Queue\SerializesModels;
use App\Repositories\InstagramAutomationRepository;

class InstagramCreateAnnotation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $userId, $confId, $forceSave;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($userId, $confId, $forceSave)    
    {
        set_time_limit(8000000);
        $this->userId = $userId;
        $this->confId = $confId;
        $this->forceSave = $forceSave;

    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        (new InstagramAutomationRepository())->handleInstagramAutomation($this->userId, $this->confId, $this->forceSave);
    }
}
