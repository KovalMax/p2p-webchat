<?php

namespace App\Entity;

use App\Traits\CreatedAtTrait;
use App\Traits\IdentityTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Exception;
use Serializable;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use function serialize;
use function unserialize;

class User implements UserInterface, Serializable, PasswordAuthenticatedUserInterface
{
    use CreatedAtTrait, IdentityTrait;

    public const ROLE_USER = 'ROLE_USER';

    private Collection $messages;
    private string $email;
    private string $password;
    private string $firstName;
    private string $lastName;
    private string $nickName;
    private string $timezone;
    private array $roles;

    /**
     * @throws Exception
     */
    public function __construct()
    {
        $this->generateId();
        $this->roles = [self::ROLE_USER];
        $this->messages = new ArrayCollection();
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
        return $this->email;
    }

    public function getRoles(): array
    {
        return $this->roles;
    }

    public function setRoles(array $roles): self
    {
        $this->roles = array_unique($roles);

        return $this;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getFirstName(): string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): User
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): User
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getNickName(): string
    {
        return $this->nickName;
    }

    public function setNickName(string $nickName): self
    {
        $this->nickName = $nickName;

        return $this;
    }

    public function getTimezone(): string
    {
        return $this->timezone;
    }

    public function setTimezone(string $timezone): self
    {
        $this->timezone = $timezone;

        return $this;
    }

    public function getSalt(): void
    {
    }

    public function eraseCredentials(): void
    {
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

    public function unserialize($data): void
    {
        [
            $this->id,
            $this->email,
            $this->password,
            $this->createdAt,
            $this->firstName,
            $this->lastName,
            $this->roles,
        ] = unserialize($data);
    }

    public function __serialize(): array
    {
        return [
            $this->id,
            $this->email,
            $this->password,
            $this->createdAt,
            $this->firstName,
            $this->lastName,
            $this->roles,
        ];
    }

    public function __unserialize(array $data): void
    {
        [
            $this->id,
            $this->email,
            $this->password,
            $this->createdAt,
            $this->firstName,
            $this->lastName,
            $this->roles,
        ] = $data;
    }
}
