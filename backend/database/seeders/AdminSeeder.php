<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'System Admin',
            'phone' => '+9779746899004',
            'password' => Hash::make('admin123'),
            'tpin' => '0000',
            'balance' => 0.00,
            'role' => 'admin',
            'verified_at' => now(),
        ]);
    }
}
