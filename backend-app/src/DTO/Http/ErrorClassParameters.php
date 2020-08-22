<?php

namespace App\DTO\Http;

final class ErrorClassParameters
{
    private ?string $type;

    private ?string $title;

    private ?int $status;

    private ?string $detail;

    private ?string $invalidParams;

    /**
     * @param null|string $type
     * @param null|string $title
     * @param null|int    $status
     * @param null|string $invalidParams
     * @param null|string $detail
     */
    public function __construct(
        ?string $type = null,
        ?string $title = null,
        ?int $status = null,
        ?string $invalidParams = null,
        ?string $detail = null

    ) {
        $this->type = $type;
        $this->title = $title;
        $this->status = $status;
        $this->invalidParams = $invalidParams;
        $this->detail = $detail;
    }

    /**
     * @return null|string
     */
    public function getType(): ?string
    {
        return $this->type;
    }

    /**
     * @return null|string
     */
    public function getTitle(): ?string
    {
        return $this->title;
    }

    /**
     * @return null|int
     */
    public function getStatus(): ?int
    {
        return $this->status;
    }

    /**
     * @return null|string
     */
    public function getDetail(): ?string
    {
        return $this->detail;
    }

    /**
     * @return null|string
     */
    public function getInvalidParams(): ?string
    {
        return $this->invalidParams;
    }
}
