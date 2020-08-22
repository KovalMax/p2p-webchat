<?php

namespace App\Security\Encoder;

interface MessageEncoderInterface
{
    public function encodeMessage(string $rawMessage): string;
}
