<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class TransactionTest extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'name' => 'Sender User',
                'phone' => '+9779800000001',
                'password' => Hash::make('password'),
                'role' => 'user',
                'balance' => 15000,
                'tpin' => '1234',
                'created_at' => now(),
                'verified_at' => now(),
            ],
            [
                'name' => 'Recipient User',
                'phone' => '+9779800000002',
                'password' => Hash::make('password'),
                'role' => 'user',
                'balance' => 10000,
                'tpin' => '1234',
                'created_at' => now(),
                'verified_at' => now(),
            ]
        ]);
    }
}
