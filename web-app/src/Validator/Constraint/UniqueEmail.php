<?php


namespace App\Validator\Constraint;


use App\Validator\UniqueEmailValidator;
use Symfony\Component\Validator\Constraint;

class UniqueEmail extends Constraint
{
    public string $message = 'Email {{ email }} is already taken';

    public function getTargets(): string
    {
        return self::PROPERTY_CONSTRAINT;
    }

    public function validatedBy(): string
    {
        return UniqueEmailValidator::class;
    }
}