<?php


namespace App\Service;

use App\DTO\Request\UserRegistration;
use App\Entity\User;
use App\Repository\UserRepository;
use Exception;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class UserService
{
    public function __construct(private readonly UserPasswordHasherInterface $encoder, private readonly UserRepository $repository)
    {
    }

    /**
     * @throws Exception
     */
    public function createNewUser(UserRegistration $dto): void
    {
        $user = (new User())
            ->setEmail($dto->email)
            ->setFirstName($dto->firstName)
            ->setLastName($dto->lastName)
            ->setNickName($dto->nickName)
            ->setTimezone($dto->timezone);

        $user->setPassword(
            $this->encoder->hashPassword($user, $dto->password)
        );

        $this->repository->save($user);
    }
}
