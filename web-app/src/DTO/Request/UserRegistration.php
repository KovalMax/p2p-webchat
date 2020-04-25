<?php

namespace App\DTO\Request;

final class UserRegistration implements \JsonSerializable
{
    private string $email;

    private string $password;

    private string $firstName;

    private string $lastName;

    private string $timezone;

    public function __construct(string $email, string $password, string $firstName, string $lastName, string $timezone)
    {
        $this->email = $email;
        $this->password = $password;
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->timezone = $timezone;
    }

    /**
     * @return string
     */
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * @return string
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    /**
     * @return string
     */
    public function getFirstName(): string
    {
        return $this->firstName;
    }

    /**
     * @return string
     */
    public function getLastName(): string
    {
        return $this->lastName;
    }

    /**
     * @return string
     */
    public function getTimezone(): string
    {
        return $this->timezone;
    }

    /**
     * @inheritDoc
     */
    public function jsonSerialize()
    {
        return [
            'email' => $this->email,
            'firstName' => $this->firstName,
            'lastName' => $this->lastName,
            'timezone' => $this->timezone,
        ];
    }
}