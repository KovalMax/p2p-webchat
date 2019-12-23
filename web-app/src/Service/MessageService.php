<?php

namespace App\Service;

use App\Entity\Message;
use App\Repository\MessageRepository;

class MessageService
{
    /**
     * @var MessageRepository
     */
    private MessageRepository $repository;

    public function __construct(MessageRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @param int|null $limit
     *
     * @return Message[]
     */
    public function getMessages(int $limit = null): iterable
    {
        return $this->repository->getLastMessages($limit);
    }
}
