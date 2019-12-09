<?php
namespace App\Entity\Traits;

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
        $this->setCreatedAt(new \DateTimeImmutable());
    }
}