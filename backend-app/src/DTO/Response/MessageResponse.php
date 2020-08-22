<?php

namespace App\DTO\Response;

final class MessageResponse
{
    private string $displayName;

    private string $message;

    private \DateTimeInterface $createdAt;

    public function __construct(string $displayName, string $message, \DateTimeInterface $createdAt)
    {
        $this->displayName = $displayName;
        $this->message = $message;
        $this->createdAt = $createdAt;
    }

    /**
     * @return string
     */
    public function getDisplayName(): string
    {
        return $this->displayName;
    }

    /**
     * @return string
     */
    public function getMessage(): string
    {
        return $this->message;
    }

    /**
     * @return \DateTimeInterface
     */
    public function getCreatedAt(): \DateTimeInterface
    {
        return $this->createdAt;
    }


}
