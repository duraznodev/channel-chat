<?php

use App\Http\Controllers\Api\AuthenticatedUserController;
use App\Http\Controllers\Api\ChannelController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\UserController;
use App\Models\Channel;
use Illuminate\Http\Request;

Route::post('login', [AuthenticatedUserController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn (Request $request) => $request->user());

    Route::get('messages/{channel}', [MessageController::class, 'show']);
    Route::post('messages', [MessageController::class, 'store']);
    Route::get('channels', [ChannelController::class, 'index']);
});
