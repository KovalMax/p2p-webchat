<?php


namespace App\Controller;

use App\DTO\Request\UserRegistration;
use App\Service\UserRegistrationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\SerializerInterface;

class RegistrationController extends AbstractController
{
    /**
     * @var UserRegistrationService
     */
    private UserRegistrationService $registrationService;

    /**
     * @var SerializerInterface
     */
    private SerializerInterface $serializer;

    /**
     * @param UserRegistrationService $registrationService
     * @param SerializerInterface     $serializer
     */
    public function __construct(UserRegistrationService $registrationService, SerializerInterface $serializer)
    {
        $this->registrationService = $registrationService;
        $this->serializer = $serializer;
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function registration(Request $request): JsonResponse
    {
        /** @var UserRegistration $user */
        $user = $this->serializer->deserialize(
            $request->getContent(),
            UserRegistration::class,
            JsonEncoder::FORMAT
        );
        $response = $this->json(['status' => Response::HTTP_OK]);

        try {
            $this->registrationService->createNewUser($user);
        } catch (\Throwable $exception) {
            $response = $this->json(
                ['status' => Response::HTTP_INTERNAL_SERVER_ERROR, 'details' => 'Internal error, please contact support'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }

        return $response;
    }
}