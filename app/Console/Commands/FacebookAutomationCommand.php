<?php

namespace App\Console\Commands;

use App\Repositories\FacebookAutomationRepository;
use Illuminate\Console\Command;

class FacebookAutomationCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:execute-facebook-automation';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get configurations for facebook automation of all GA users and create annotations if data is changed.';

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
     * @return void
     */
    public function handle()
    {
        return (new FacebookAutomationRepository())->handleFacebookAutomation();
    }
}
