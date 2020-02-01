<?php

namespace App\DTO;

final class Violation
{
    /**
     * @var string
     */
    private string $fieldName;

    /**
     * @var string
     */
    private string $errorMessage;

    public function __construct(string $fieldName, string $errorMessage)
    {
        $this->fieldName = $fieldName;
        $this->errorMessage = $errorMessage;
    }

    /**
     * @return string
     */
    public function getFieldName(): string
    {
        return $this->fieldName;
    }

    /**
     * @return string
     */
    public function getErrorMessage(): string
    {
        return $this->errorMessage;
    }
}
