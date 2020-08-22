<?php


namespace App\Service;

use App\DTO\Request\UserRegistration;
use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

final class UserRegistrationService
{
    /**
     * @var UserPasswordEncoderInterface
     */
    private UserPasswordEncoderInterface $encoder;

    /**
     * @var UserRepository
     */
    private UserRepository $repository;

    /**
     * @param UserPasswordEncoderInterface $encoder
     * @param UserRepository               $repository
     */
    public function __construct(UserPasswordEncoderInterface $encoder, UserRepository $repository)
    {
        $this->encoder = $encoder;
        $this->repository = $repository;
    }

    /**
     * @param UserRegistration $dto
     *
     * @throws \Exception
     */
    public function createNewUser(UserRegistration $dto): void
    {
        $user = (new User())
            ->setEmail($dto->getEmail())
            ->setFirstName($dto->getFirstName())
            ->setLastName($dto->getLastName())
            ->setTimezone($dto->getTimezone());

        $user->setPassword(
            $this->encoder->encodePassword($user, $dto->getPassword())
        );

        $this->repository->save($user);
    }
}