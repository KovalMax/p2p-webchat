<?php

namespace App\Entity;

use App\Entity\Traits\CreatedAtTrait;
use App\Entity\Traits\IdentityTrait;
use Symfony\Component\Security\Core\User\UserInterface;

class Message
{
    use CreatedAtTrait, IdentityTrait;

    private UserInterface $user;

    private string $message;

    /**
     * @throws \Exception
     */
    public function __construct()
    {
        $this->generateRandomId();
    }

    /**
     * @return UserInterface
     */
    public function getUser(): UserInterface
    {
        return $this->user;
    }

    /**
     * @param UserInterface $user
     *
     * @return Message
     */
    public function setUser(UserInterface $user): self
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