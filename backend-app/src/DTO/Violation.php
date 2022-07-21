<?php

namespace App\DTO;

final class Violation implements \JsonSerializable
{
    /**
     * @var string
     */
    private string $name;

    /**
     * @var string
     */
    private string $reason;

    public function __construct(string $name, string $reason)
    {
        $this->name = $name;
        $this->reason = $reason;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @return string
     */
    public function getReason(): string
    {
        return $this->reason;
    }

    /**
     * @return array
     */
    public function jsonSerialize(): array
    {
        return [
            'name' => $this->name,
            'reason' => $this->reason,
        ];
    }
}
