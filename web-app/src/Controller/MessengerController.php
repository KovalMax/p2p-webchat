<?php

namespace App\Controller;

use App\DTO\Request\SaveMessage;
use App\Exception\ConstraintValidationException;
use App\Service\MessageService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\SerializerInterface;

class MessengerController extends AbstractController
{
    /**
     * @var MessageService
     */
    private MessageService $messageService;

    /**
     * @var SerializerInterface
     */
    private SerializerInterface $serializer;

    /**
     * @param MessageService      $messageService
     * @param SerializerInterface $serializer
     */
    public function __construct(MessageService $messageService, SerializerInterface $serializer)
    {
        $this->messageService = $messageService;
        $this->serializer = $serializer;
    }

    /**
     * @return Response
     */
    public function index(): Response
    {
        return $this->render('messenger/messenger.html.twig', ['messages' => $this->messageService->getMessages()]);
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function saveMessage(Request $request): JsonResponse
    {
        /** @var SaveMessage $dto */
        $dto = $this->serializer->deserialize(\json_encode($request->request->all()), SaveMessage::class, JsonEncoder::FORMAT);
        $response = $this->json(['status' => Response::HTTP_OK]);

        try {
            $this->messageService->saveMessage($dto, $this->getUser());
        } catch (ConstraintValidationException $exception) {
            $response = $this->json(['status' => Response::HTTP_BAD_REQUEST, 'details' => $exception->getErrors()]);
        } catch (\Exception $exception) {
            $response = $this->json(['status' => Response::HTTP_INTERNAL_SERVER_ERROR, 'details' => 'Internal error, please contact support!']);
        }

        return $response;
    }
}