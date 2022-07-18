<?php


namespace App\Controller;

use App\DTO\Request\UserRegistration;
use App\Service\UserService;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

final class RegistrationController extends AbstractController
{
    public function __construct(private readonly UserService $registrationService)
    {
    }

    /**
     * @throws Exception
     */
    public function __invoke(UserRegistration $registration): JsonResponse
    {
        $this->registrationService->createNewUser($registration);

        return $this->json(['status' => Response::HTTP_OK]);
    }
}
