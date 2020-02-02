<?php

namespace App\DTO\Request;

final class UserRegistration
{
    public string $email = '';
    public string $password = '';
    public string $firstName = '';
    public string $lastName = '';
    public string $timezone = '';
}