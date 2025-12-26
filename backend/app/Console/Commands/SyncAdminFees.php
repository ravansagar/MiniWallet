<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SyncAdminFees extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-admin-fees';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $buffer = Redis::getset('admin_fees_buffer', 0);
    
        if ($buffer > 0) {
            DB::table('users')->where('role', 'admin')->increment('balance', $buffer);
        }
    }
}
