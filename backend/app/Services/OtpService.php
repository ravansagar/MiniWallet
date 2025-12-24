<?php

namespace App\Services;
use Twilio\Rest\Client;
use Illuminate\Support\Facades\Mail;
use App\Mail\OtpMail;

class OtpService
{
    public function generateOtp()
    {
        return rand(1000, 9999);
    }

    public function sendOtp($user, $type='whatsapp')
    {
        $otp = $this->generateOtp();
        $user->update([
            'otp' => $otp,
            'otp_expires_at' => now()->addMinutes(10),
        ]);

        try{
            if($type == 'whatsapp'){
                $this->sendWhatsAppOtp($user->phone, $otp);
            }else{
                Mail::to($user->email)->send(new OtpMail($otp));
            }
        }catch(Exception $e){
            Log::error("OTP Sending Failed: " . $e->getMessage());
            return false;
        }
        return true;
    }

    protected function sendWhatsAppOtp($phone, $otp)
    {
        $sid   = config('services.twilio.account_sid');
        $token = config('services.twilio.auth_token');
        $from  = config('services.twilio.whatsapp_number');

        $client = new Client($sid, $token);
            $client->messages->create(
                "whatsapp:$phone",
                [
                    'from' => "whatsapp:$from", 
                    'body' => "Your OTP is: $otp",
            ]
        );
}
}