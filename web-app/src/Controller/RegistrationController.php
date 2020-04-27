<?php


namespace App\Controller;

use App\Component\RequestMapper;
use App\DTO\Request\UserRegistration;
use App\Service\UserRegistrationService;
use App\Traits\PsrLoggerTrait;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class RegistrationController extends AbstractController
{
    use PsrLoggerTrait;

    /**
     * @var UserRegistrationService
     */
    private UserRegistrationService $registrationService;

    /**
     * @var RequestMapper
     */
    private RequestMapper $requestMapper;

    /**
     * @param UserRegistrationService $registrationService
     * @param RequestMapper           $requestMapper
     */
    public function __construct(UserRegistrationService $registrationService, RequestMapper $requestMapper)
    {
        $this->registrationService = $registrationService;
        $this->requestMapper = $requestMapper;
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     * @throws \Exception
     */
    public function registration(Request $request): JsonResponse
    {
        /** @var UserRegistration $user */
        $user = $this->requestMapper->toDto(UserRegistration::class, $request->getContent());
        $this->registrationService->createNewUser($user);

        return $this->json(['status' => Response::HTTP_OK]);
    }
}