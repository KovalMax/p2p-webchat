<?php

namespace App\Security\Decoder;

use App\Security\CryptoSecret;

class MessageDecoder implements MessageDecoderInterface
{
    /**
     * @var CryptoSecret
     */
    private CryptoSecret $secret;

    public function __construct(CryptoSecret $secret)
    {
        $this->secret = $secret;
    }

    public function decodeMessage(string $encodedMessage): string
    {
        return sodium_crypto_box_open(sodium_hex2bin($encodedMessage), $this->secret->getNonce(), $this->secret->getKey());
    }
}
