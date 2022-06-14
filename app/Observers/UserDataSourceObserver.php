<?php

namespace App\Observers;

use App\Events\UserDataSourceUpdatedOrCreated;
use App\Models\UserDataSource;

class UserDataSourceObserver
{

    /**
     * Handle events after all transactions are committed.
     *
     * @var bool
     */
    public $afterCommit = true;

    /**
     * Handle the UserDataSource "created" event.
     *
     * @param UserDataSource $userDataSource
     * @return void
     */
    public function created(UserDataSource $userDataSource)
    {
        if ($userDataSource->ds_code == 'keyword_tracking'){
//            UserDataSourceUpdatedOrCreated::dispatch($userDataSource);
        }
    }

    /**
     * Handle the UserDataSource "updated" event.
     *
     * @param UserDataSource $userDataSource
     * @return void
     */
    public function updated(UserDataSource $userDataSource)
    {
        if ($userDataSource->ds_code == 'keyword_tracking'){
//            UserDataSourceUpdatedOrCreated::dispatch($userDataSource);
        }
    }

    /**
     * Handle the UserDataSource "deleted" event.
     *
     * @param UserDataSource $userDataSource
     * @return void
     */
    public function deleted(UserDataSource $userDataSource)
    {
        //
    }

    /**
     * Handle the UserDataSource "restored" event.
     *
     * @param UserDataSource $userDataSource
     * @return void
     */
    public function restored(UserDataSource $userDataSource)
    {
        //
    }

    /**
     * Handle the UserDataSource "force deleted" event.
     *
     * @param UserDataSource $userDataSource
     * @return void
     */
    public function forceDeleted(UserDataSource $userDataSource)
    {
        //
    }
}
