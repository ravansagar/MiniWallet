<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Carbon\Carbon;
use App\Services\OtpService;

class UserController extends Controller
{
    public function __construct(protected OtpService $otpService) {}

    // 1. Register
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'email', 'max:255', 'unique:users'],
            'phone' => ['required', 'string', 'max:15', 'unique:users'],
            'tpin' => ['required', 'string', 'max:4'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first(),
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'phone' => '+977'.$request->phone,
            'password' => bcrypt($request->password),
            'tpin' => $request->tpin,
            'otp' => $this->otpService->generateOtp(),
            'otp_expires_at' => now()->addMinutes(10),
        ]);

        $this->otpService->sendOtp($user, 'whatsapp');

        return response()->json([
            'status' => 'success',
            'message' => 'User registered successfully',
            'data' => $user,
        ], 201);
    }

    // 2. Login
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => ['required', 'string', 'max:15'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first(),
            ], 422);
        }

        $user = User::where('phone', $request->phone)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials',
            ], 401);
        }

        $this->otpService->sendOtp($user, 'whatsapp');

        return response()->json([
            'status' => 'success',
            'message' => 'OTP sent successfully to your whatsapp',
        ]);
    }

    // 3. Verify Otp
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'phone' => ['required', 'string'],
            'otp'   => ['required', 'string', 'size:4'],
        ]);

        $user = User::where('phone', $request->phone)
                ->where('otp', $request->otp)
                ->where('otp_expires_at', '>=', now())
                ->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid or expired OTP code.',
            ], 401);
        }

        $user->update([
            'otp' => null,
            'otp_expires_at' => null,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'OTP verified successfully',
            'data' => $user,
            'token' => $token,
        ]);
    }
    // 4. Logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully',
        ]);
    }
}
