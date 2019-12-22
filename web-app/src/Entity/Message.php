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

    /**
     * @return User
     */
    public function getUser(): User
    {
        return $this->user;
    }

    /**
     * @param User $user
     *
     * @return Message
     */
    public function setUser(User $user): self
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return string
     */
    public function getMessage(): string
    {
        return $this->message;
    }

    /**
     * @param string $message
     *
     * @return Message
     */
    public function setMessage(string $message): self
    {
        $this->message = $message;

        return $this;
    }
}