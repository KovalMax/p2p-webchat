<?php

namespace App\Service;

use App\DTO\Request\SaveMessage;
use App\Entity\Message;
use App\Exception\ConstraintValidationException;
use App\Repository\MessageRepository;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\ConstraintViolationListInterface;
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
     * @param MessageRepository  $repository
     * @param ValidatorInterface $validator
     */
    public function __construct(MessageRepository $repository, ValidatorInterface $validator)
    {
        $this->repository = $repository;
        $this->validator = $validator;
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
            ->setMessage($request->getMessage())
            ->setCreatedAt($request->getDatetime());

        $this->repository->saveMessage($msg);
    }
}
