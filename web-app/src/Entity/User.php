<?php

namespace App\Entity;

use App\Entity\Traits\CreatedAtTrait;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class User implements UserInterface
{
    use CreatedAtTrait;

    private UuidInterface $id;

    private string $email;

    private string $password;

    private array $roles = [];

    public function __construct(
        UuidInterface $id,
        string $email,
        string $password,
        array $roles = [],
        \DateTimeInterface $createdAt = null
    ) {
        $this->id = $id;
        $this->email = $email;
        $this->password = $password;
        $this->roles = $roles;
        $this->createdAt = $createdAt;
    }

    public function getId(): UuidInterface
    {
        return $this->id;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getUsername(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt(): void
    {
        return;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        return;
    }
}
