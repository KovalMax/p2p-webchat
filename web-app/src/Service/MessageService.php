<?php

namespace App\Service;

use App\DTO\Request\SaveMessage;
use App\DTO\Response\MessageResponse;
use App\Entity\Message;
use App\Exception\ConstraintValidationException;
use App\Repository\MessageRepository;
use App\Security\Decoder\MessageDecoderInterface;
use App\Security\Encoder\MessageEncoderInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class MessageService
{
    /**
     * @var MessageRepository
     */
    private MessageRepository $repository;

    /**
     * @var ValidatorInterface
     */
    private ValidatorInterface $validator;

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
     * @param ValidatorInterface      $validator
     * @param MessageEncoderInterface $messageEncoder
     * @param MessageDecoderInterface $messageDecoder
     */
    public function __construct(
        MessageRepository $repository,
        ValidatorInterface $validator,
        MessageEncoderInterface $messageEncoder,
        MessageDecoderInterface $messageDecoder
    ) {
        $this->repository = $repository;
        $this->validator = $validator;
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
     * @param SaveMessage   $request
     * @param UserInterface $user
     *
     * @return void
     * @throws ConstraintValidationException
     * @throws \Exception
     */
    public function saveMessage(SaveMessage $request, UserInterface $user): void
    {
        $errors = $this->validator->validate($request);
        if (count($errors) > 0) {
            throw ConstraintValidationException::createFromViolationList($errors);
        }

        $msg = (new Message())
            ->setUser($user)
            ->setMessage($this->messageEncoder->encodeMessage($request->getMessage()))
            ->setCreatedAt($request->getDatetime());

        $this->repository->saveMessage($msg);
    }
}
