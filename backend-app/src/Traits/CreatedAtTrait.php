<?php

namespace App\Traits;

trait CreatedAtTrait
{
    protected \DateTimeInterface $createdAt;

    public function getCreatedAt(): \DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Called on prePersist event
     */
    public function setupCreatedAt(): void
    {
        if (!isset($this->createdAt)) {
            $this->createdAt = new \DateTimeImmutable();
        }
    }
}