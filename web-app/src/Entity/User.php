<?php

namespace App\Entity;

use App\Traits\CreatedAtTrait;
use App\Traits\IdentityTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Security\Core\User\UserInterface;

class User implements UserInterface, \Serializable
{
    use CreatedAtTrait, IdentityTrait;

    public const ROLE_USER = 'ROLE_USER';

    private Collection $messages;

    private string $email;

    private string $password;

    private string $firstName;

    private string $lastName;

    private string $timezone;

    private array $roles;

    /**
     * @throws \Exception
     */
    public function __construct()
    {
        $this->generateRandomId();
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
     * @return string
     */
    public function getTimezone(): string
    {
        return $this->timezone;
    }

    /**
     * @param string $timezone
     *
     * @return User
     */
    public function setTimezone(string $timezone): self
    {
        $this->timezone = $timezone;

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
        [
            $this->id,
            $this->email,
            $this->password,
            $this->createdAt,
            $this->firstName,
            $this->lastName,
            $this->roles,
        ] = unserialize($serialized);
    }
}
