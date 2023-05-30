<?php

namespace App\Console\Commands;

use App\Repositories\InstagramAutomationRepository;
use Illuminate\Console\Command;

class InstagramAutomationCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:execute-instagram-automation';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get configurations for instagram automation of all GA users and create annotations if data is changed.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // get all ga users whose insta automation is on
        return (new InstagramAutomationRepository())->handleInstagramAutomation();
    }

}
