<?php

namespace App\Security\Encoder;

use App\Security\CryptoSecret;

class MessageEncoder implements MessageEncoderInterface
{
    /**
     * @var CryptoSecret
     */
    private CryptoSecret $secret;

    public function __construct(CryptoSecret $secret)
    {
        $this->secret = $secret;
    }

    public function encodeMessage(string $rawMessage): string
    {
        return sodium_bin2hex(sodium_crypto_box($rawMessage, $this->secret->getNonce(), $this->secret->getKey()));
    }
}
