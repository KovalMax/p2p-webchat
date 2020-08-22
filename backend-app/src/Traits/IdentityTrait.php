<?php

namespace App\Traits;

use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;

trait IdentityTrait
{
    protected UuidInterface $id;

    /**
     * @return UuidInterface
     */
    public function getId(): UuidInterface
    {
        return $this->id;
    }

    /**
     * @throws \Exception
     */
    protected function generateId(): void
    {
        $this->id = Uuid::uuid4();
    }
}