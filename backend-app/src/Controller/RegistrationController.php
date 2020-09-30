<?php


namespace App\Controller;

use App\DTO\Request\UserRegistration;
use App\Service\UserService;
use App\Traits\PsrLoggerTrait;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

final class RegistrationController extends AbstractController
{
    use PsrLoggerTrait;

    /**
     * @var UserService
     */
    private UserService $registrationService;

    /**
     * @param UserService $registrationService
     */
    public function __construct(UserService $registrationService)
    {
        $this->registrationService = $registrationService;
    }

    /**
     * @param UserRegistration $registration
     *
     * @return JsonResponse
     * @throws \Exception
     */
    public function __invoke(UserRegistration $registration): JsonResponse
    {
        $this->registrationService->createNewUser($registration);

        return $this->json(['status' => Response::HTTP_OK]);
    }
}