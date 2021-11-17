<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ChecklistItem;
use App\Models\UserChecklistItem;
use App\Models\User;

class AddChecklistItemToUserChecklist extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gaa:add-checklist-item-to-user-checklist 
                                {checklist_item : ID of checklist item}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command can be used to add a selected checklist item to all users checklist';

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

        $checklistItem = ChecklistItem::findOrFail($this->argument('checklist_item'));
        $this->info("Adding check list item '$checklistItem->label' to users checklist.");

        $users = User::with('userChecklistItems')->orderBy('name')->get();
        $this->info("Fetched " . count($users) . " users.");

        $changeCount = 0;
        foreach ($users as $user) {
            $userChecklistItemIds = $user->userChecklistItems->pluck('checklist_item_id');
            if (!$userChecklistItemIds->contains($checklistItem->id)) {
                UserChecklistItem::create([
                    'checklist_item_id' => $checklistItem->id,
                    'user_id' => $user->id
                ]);
                $changeCount++;
            }
        }

        $this->info("$changeCount user checklists affected.");


        return Command::SUCCESS;
    }
}
