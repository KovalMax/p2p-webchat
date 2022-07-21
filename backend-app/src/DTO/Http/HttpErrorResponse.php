<?php

namespace App\DTO\Http;

final class HttpErrorResponse
{
    private int $responseCode;

    private array $error;

    /**
     * @param int   $responseCode
     * @param array $error
     */
    public function __construct(int $responseCode, array $error)
    {
        $this->responseCode = $responseCode;
        $this->error = $error;
    }

    /**
     * @return int
     */
    public function getResponseCode(): int
    {
        return $this->responseCode;
    }

    /**
     * @return array
     */
    public function getError(): array
    {
        return $this->error;
    }
}
