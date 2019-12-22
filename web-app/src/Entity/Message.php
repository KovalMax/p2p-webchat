<?php

namespace App\Entity;

use App\Entity\Traits\CreatedAtTrait;
use App\Entity\Traits\IdentityTrait;

class Message
{
    use CreatedAtTrait, IdentityTrait;

    private User $user;

    private string $message;

    /**
     * @throws \Exception
     */
    public function __construct()
    {
        $this->generateRandomId();
    }
}