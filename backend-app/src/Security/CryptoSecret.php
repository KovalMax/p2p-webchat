<?php

namespace App\Security;

class CryptoSecret
{
    /**
     * @var string
     */
    private string $nonce;

    /**
     * @var string
     */
    private string $key;

    public function __construct(string $cryptoNonce, string $cryptoKey)
    {
        $this->nonce = sodium_hex2bin($cryptoNonce);
        $this->key = sodium_hex2bin($cryptoKey);
    }

    /**
     * @return string
     */
    public function getNonce(): string
    {
        return $this->nonce;
    }

    /**
     * @return string
     */
    public function getKey(): string
    {
        return $this->key;
    }
}
