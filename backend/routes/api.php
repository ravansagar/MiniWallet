<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\UserController;

Route::post('/register', [UserController::class, 'register']);
Route::middleware('throttle:3,1')->post('/login', [UserController::class, 'login']);
Route::post('/verify-otp', [UserController::class, 'verifyOtp']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/transaction', [TransactionController::class, 'store']);
    Route::get('/balance', [UserController::class, 'balance']);
    Route::post('/logout', [UserController::class, 'logout']);
});