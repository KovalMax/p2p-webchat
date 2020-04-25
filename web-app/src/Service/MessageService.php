<?php

namespace App\Service;

use App\DTO\Request\SaveMessage;
use App\DTO\Response\MessageResponse;
use App\Entity\Message;
use App\Repository\MessageRepository;
use App\Security\Decoder\MessageDecoderInterface;
use App\Security\Encoder\MessageEncoderInterface;
use Symfony\Component\Security\Core\User\UserInterface;

final class MessageService
{
    /**
     * @var MessageRepository
     */
    private MessageRepository $repository;

    /**
     * @var MessageEncoderInterface
     */
    private MessageEncoderInterface $messageEncoder;

    /**
     * @var MessageDecoderInterface
     */
    private MessageDecoderInterface $messageDecoder;

    /**
     * @param MessageRepository       $repository
     * @param MessageEncoderInterface $messageEncoder
     * @param MessageDecoderInterface $messageDecoder
     */
    public function __construct(
        MessageRepository $repository,
        MessageEncoderInterface $messageEncoder,
        MessageDecoderInterface $messageDecoder
    ) {
        $this->repository = $repository;
        $this->messageEncoder = $messageEncoder;
        $this->messageDecoder = $messageDecoder;
    }

    /**
     * @param int|null $limit
     *
     * @return MessageResponse[]
     */
    public function getLastMessages(int $limit = null): iterable
    {
        $lastMessages = array_reverse($this->repository->getLastMessages($limit));

        return array_map(
            fn(Message $message) => new MessageResponse(
                sprintf('%s %s', $message->getUser()->getFirstName(), $message->getUser()->getLastName()),
                $this->messageDecoder->decodeMessage($message->getMessage()),
                $message->getCreatedAt()
            ),
            $lastMessages
        );
    }

    /**
     * @param SaveMessage   $dto
     * @param UserInterface $user
     *
     * @return void
     * @throws \Exception
     */
    public function saveMessage(SaveMessage $dto, UserInterface $user): void
    {
        $msg = (new Message())
            ->setUser($user)
            ->setMessage($this->messageEncoder->encodeMessage($dto->getMessage()))
            ->setCreatedAt($dto->getDatetime());

        $this->repository->saveMessage($msg);
    }
}
