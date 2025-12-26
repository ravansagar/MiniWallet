<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\Transaction;
use Illuminate\Support\Facades\Redis;

class TransactionController extends Controller
{
    public function store(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'senderPhone' => 'required|string',
            'recipientPhone' => 'required|string',
            'amount' => 'required|numeric|min:1',
            'tpin' => 'required|digits:4',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()->first(),
            ], 422);
        }
        return DB::transaction(function () use ($request) {
        // Validate the sender and receiver
        // $sender = DB::table('users')->where('phone', $request->senderPhone)->first();
        // $receiver = DB::table('users')->where('phone', $request->recipientPhone)->first();
        // $admin = DB::table('users')->where('role', 'admin')->first();
        $sender = DB::table('users')->where('phone', $request->senderPhone)->lockForUpdate()->first();
        $receiver = DB::table('users')->where('phone', $request->recipientPhone)->lockForUpdate()->first();
        
        if (!$sender || !$receiver) {
            return response()->json(['status' => 'error', 'message' => 'User not found'], 404);
        }

        // Validate the tpin
        // $user = $request->user();
        // $tpin = $request->tpin;

        // if ($tpin != $user->tpin) {
        //     return response()->json([
        //         'status' => 'error',
        //         'message' => 'Invalid tpin',
        //     ], 400);
        // }
        if ($request->tpin != $sender->tpin) {
            return response()->json(['status' => 'error', 'message' => 'Invalid tpin'], 400);
        }

        $commission = $request->amount * 0.015;
        $totalDeduction = $request->amount + $commission;

        if ($sender->balance < $totalDeduction) {
            return response()->json(['status' => 'error', 'message' => 'Insufficient balance'], 400);
        }
        // if (!$sender || !$receiver || !$admin) {
        //     return response()->json(['status' => 'error', 'message' => 'User or System Admin not found'], 404);
        // }

        // Validate the amount
        // $commission = $request->amount * 0.015;
        // $totalDeduction = $request->amount + $commission;

        // if ($sender->balance < $totalDeduction) {
        //     return response()->json(['status' => 'error', 'message' => 'Insufficient balance'], 400);
        // }

        try {
            // Record Transaction
            DB::table('transactions')->insert([
                'sender_id' => $sender->id,
                'receiver_id' => $receiver->id,
                'amount' => $request->amount,
                'commission_fee' => $commission,
                'description' => 'Transfer to ' . $request->recipientPhone,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Update Balances
            DB::table('users')->where('id', $sender->id)->decrement('balance', $totalDeduction);
            DB::table('users')->where('id', $receiver->id)->increment('balance', $request->amount);

            // HIGH SCALE OPTIMIZATION: 
            // Instead of hitting the 'admin' row every time (bottleneck), use Redis.
            Redis::incrbyfloat('admin_fees_buffer', $commission);

            return response()->json(['status' => 'success', 'message' => 'Transaction successful'], 200);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Transaction failed'], 500);
        }
    });
    }
}
        // Begin transaction
    //     DB::beginTransaction();

    //     try{
    //         DB::table('transactions')->insert([
    //             'sender_id' => $sender->id,
    //             'receiver_id' => $receiver->id,
    //             'amount' => $request->amount,
    //             'commission_fee' => $commission,
    //             'description' => 'Transfer to ' . $request->recipientPhone,
    //             'created_at' => now(),
    //             'updated_at' => now(),
    //         ]);

    //         DB::table('users')->where('id', $sender->id)->decrement('balance', $totalDeduction);
    //         DB::table('users')->where('id', $receiver->id)->increment('balance', $request->amount);
    //         DB::table('users')->where('role', 'admin')->increment('balance', $commission);
    //         DB::commit();

    //         return response()->json([
    //             'status' => 'success',
    //             'message' => 'Transaction successful',
    //         ], 200);
    //     } catch (\Exception $e){
    //         DB::rollBack();
    //         return response()->json([
    //             'status' => 'error',
    //             'message' => 'Transaction failed',
    //         ], 500);
    //     }
    // }
// }


//         $validator = Validator::make($request->all(), [
//             'senderPhone' => 'required|exists:users,phone',
//             'recipientPhone' => 'required|exists:users,phone',
//             'amount' => 'required|numeric|min:1',
//             'tpin' => 'required|digits:4',
//         ]);

//         if ($validator->fails()) {
//             return response()->json([
//                 'status' => 'error',
//                 'errors' => $validator->errors()->first(),
//             ], 422);
//         }

//         $user = $request->user();
//         $tpin = $request->tpin;

//         if ($tpin != $user->tpin) {
//             return response()->json([
//                 'status' => 'error',
//                 'message' => 'Invalid tpin',
//             ], 400);
//         }

//         $sender = DB::table('users')->where('phone', $request->senderPhone)->first();
//         $receiver = DB::table('users')->where('phone', $request->recipientPhone)->first();
//         $admin = DB::table('users')->where('role', 'admin')->first();

//         if (!$sender || !$receiver || !$admin) {
//             return response()->json([
//                 'status' => 'error',
//                 'message' => 'User not found',
//             ], 404);
//         }

//         $commission = $request->amount * 0.015;
//         $totalDeduction = $request->amount + $commission;

//         if ($sender->balance < $totalDeduction) {
//             return response()->json(['status' => 'error', 'message' => 'Insufficient balance'], 400);
//         }

//         $prevAmountSender = DB::table('users')->where('id', $senderId)->value('balance');
//         $prevAmountReciver = DB::table('users')->where('id', $reciverId)->value('balance');

//         if($prevAmountSender < $request->amount){
//             return response()->json([
//                 'status' => 'error',
//                 'message' => 'Insufficient balance',
//             ], 400);
//         }

//         $newAmountSender = $prevAmountSender - $request->amount;
//         $newAmountReciver = $prevAmountReciver + $request->amount;
//         $newAmountAdmin = DB::table('users')->where('id', $admin->id)->value('balance') + $commission;

//         DB::beginTransaction();
//         try {
//             DB::table('transactions')->insert([
//                 'sender_id' => $sender->id,
//                 'receiver_id' => $receiver->id,
//                 'amount' => $request->amount,
//                 'commission_fee' => $commission,
//                 'description' => 'Transaction',
//                 'created_at' => now(),
//                 'updated_at' => now(),
//             ]);

//             DB::table('users')->where('id', $sender->id)->update(['balance' => $newAmountSender]);
//             DB::table('users')->where('id', $receiver->id)->update(['balance' => $newAmountReciver]);
//             DB::table('users')->where('id', $admin->id)->update(['balance' => $newAmountAdmin]);
//             DB::commit();

//             return response()->json([
//                 'status' => 'success',
//                 'message' => 'Transaction successful',
//             ], 200);
//         } catch (\Exception $e) {
//             DB::rollBack();
//             return response()->json([
//                 'status' => 'error',
//                 'message' => 'Transaction failed',
//             ], 500);
//         }
//     }
// }
