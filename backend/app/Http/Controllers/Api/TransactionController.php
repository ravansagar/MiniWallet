<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\Transaction;

class TransactionController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'sender' => 'required|exists:users,phone',
            'reciver' => 'required|exists:users,phone',
            'amount' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()->first(),
            ], 422);
        }

        $senderId = DB::table('users')->where('phone', $request->sender)->value('id');
        $reciverId = DB::table('users')->where('phone', $request->reciver)->value('id');
        $prevAmountSender = DB::table('users')->where('id', $senderId)->value('balance');
        $prevAmountReciver = DB::table('users')->where('id', $reciverId)->value('balance');

        if($prevAmountSender < $request->amount){
            return response()->json([
                'status' => 'error',
                'message' => 'Insufficient balance',
            ], 400);
        }
        $commission = $request->amount * 0.015;
        $newAmountSender = $prevAmountSender - $request->amount - $commission;
        $newAmountReciver = $prevAmountReciver + $request->amount;

        DB::beginTransaction();
        try {
            DB::table('transactions')->insert([
                'sender_id' => $senderId,
                'reciver_id' => $reciverId,
                'amount' => $request->amount,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('users')->where('id', $senderId)->update(['balance' => $newAmountSender]);
            DB::table('users')->where('id', $reciverId)->update(['balance' => $newAmountReciver]);
            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Transaction successful',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Transaction failed',
            ], 500);
        }
    }
}
