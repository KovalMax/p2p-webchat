<?php

namespace App\DTO\Request;

final class SaveMessage implements \JsonSerializable
{
    /**
     * @var string
     */
    private string $message;

    /**
     * @var \DateTimeInterface
     */
    private \DateTimeInterface $datetime;

    /**
     * @param string             $message
     * @param \DateTimeInterface $datetime
     */
    public function __construct(string $message, \DateTimeInterface $datetime)
    {
        $this->message = $message;
        $this->datetime = $datetime;
    }

    /**
     * @return string
     */
    public function getMessage(): string
    {
        return $this->message;
    }

    /**
     * @return \DateTimeInterface
     */
    public function getDatetime(): \DateTimeInterface
    {
        return $this->datetime;
    }

    /**
     * @inheritDoc
     */
    public function jsonSerialize(): array
    {
        return [
            'message' => $this->message,
            'datetime' => $this->datetime,
        ];
    }
}
