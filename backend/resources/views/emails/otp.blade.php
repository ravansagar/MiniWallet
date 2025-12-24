<!DOCTYPE html>
<html>

<head>
    <title>Verification Code</title>
</head>

<body class="font-sans bg-gray-100">
    <div class="min-h-screen flex items-center justify-center px-4">
        <div class="bg-white max-w-md w-full p-6 rounded-lg shadow text-center">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800">Otp Code</h2>
            <p class="text-gray-600 mb-6">Use the code below to complete your registration. This code is valid for 10
                minutes.</p>
            <div
                class="inline-block text-2xl font-bold tracking-widest text-blue-500 px-6 py-3 border border-dashed border-gray-300 rounded mb-6">
                {{ $otp }}</div>
            <p class="text-sm text-gray-500">If you did not request this, please ignore this email.</p>
        </div>
    </div>
</body>

</html>
