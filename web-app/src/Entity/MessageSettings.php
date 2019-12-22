<?php


namespace App\Entity;

use App\Entity\Traits\CreatedAtTrait;
use App\Entity\Traits\IdentityTrait;

class MessageSettings
{
    use IdentityTrait, CreatedAtTrait;

    /**
     * @throws \Exception
     */
    public function __construct()
    {
        $this->generateRandomId();
    }
}