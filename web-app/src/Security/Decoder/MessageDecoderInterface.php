<?php

namespace App\Security\Decoder;

interface MessageDecoderInterface
{
    public function decodeMessage(string $encodedMessage): string;
}
