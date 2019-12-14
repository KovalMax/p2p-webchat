<?php

namespace App\Entity;

use App\Entity\Traits\CreatedAtTrait;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class User implements UserInterface, \Serializable
{
    use CreatedAtTrait;

    public const ROLE_USER = 'ROLE_USER';

    private UuidInterface $id;

    private string $email;

    private string $password;

    private string $firstName;

    private string $lastName;

    private array $roles;

    /**
     * @throws \Exception
     */
    public function __construct()
    {
        $this->id = Uuid::uuid4();
        $this->roles = [self::ROLE_USER];
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
        return $this->roles;
    }

    public function setRoles(array $roles): self
    {
        $this->roles = array_unique($roles);

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
     * @return string
     */
    public function getFirstName(): string
    {
        return $this->firstName;
    }

    /**
     * @param string $firstName
     *
     * @return User
     */
    public function setFirstName(string $firstName): User
    {
        $this->firstName = $firstName;
        return $this;
    }

    /**
     * @return string
     */
    public function getLastName(): string
    {
        return $this->lastName;
    }

    /**
     * @param string $lastName
     *
     * @return User
     */
    public function setLastName(string $lastName): User
    {
        $this->lastName = $lastName;
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

    public function serialize(): string
    {
        return serialize(
            [
                $this->id,
                $this->email,
                $this->password,
                $this->createdAt,
                $this->firstName,
                $this->lastName,
                $this->roles,
            ]
        );
    }

    public function unserialize($serialized): void
    {
        list(
            $this->id,
            $this->email,
            $this->password,
            $this->createdAt,
            $this->firstName,
            $this->lastName,
            $this->roles
            ) = unserialize($serialized);
    }
}
