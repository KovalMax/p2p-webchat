<?php

namespace App\DTO\Http;

final class HttpError
{
    private int $responseCode;

    private ErrorClassParameters $classParams;

    private ErrorStaticParameters $staticParams;

    /**
     * @param int                   $responseCode
     * @param ErrorClassParameters  $classParams
     * @param ErrorStaticParameters $staticParams
     */
    public function __construct(int $responseCode, ErrorClassParameters $classParams, ErrorStaticParameters $staticParams)
    {
        $this->responseCode = $responseCode;
        $this->classParams = $classParams;
        $this->staticParams = $staticParams;
    }

    /**
     * @return int
     */
    public function getResponseCode(): int
    {
        return $this->responseCode;
    }

    /**
     * @return ErrorClassParameters
     */
    public function getClassParams(): ErrorClassParameters
    {
        return $this->classParams;
    }

    /**
     * @return ErrorStaticParameters
     */
    public function getStaticParams(): ErrorStaticParameters
    {
        return $this->staticParams;
    }
}
