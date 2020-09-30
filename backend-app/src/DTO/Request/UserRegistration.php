<?php

namespace App\DTO\Request;

final class UserRegistration implements \JsonSerializable
{
    public string $email;

    public string $password;

    public string $firstName;

    public string $lastName;

    public string $timezone;

    public string $nickName;

    /**
     * @inheritDoc
     */
    public function jsonSerialize()
    {
        return [
            'email' => $this->email,
            'firstName' => $this->firstName,
            'lastName' => $this->lastName,
            'nickName' => $this->nickName,
            'timezone' => $this->timezone,
        ];
    }
}