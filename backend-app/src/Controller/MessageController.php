<?php

namespace App\Controller;

use App\DTO\Request\SaveMessage;
use App\Service\MessageService;
use App\Traits\PsrLoggerTrait;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

final class MessageController extends AbstractController
{
    use PsrLoggerTrait;

    /**
     * @var MessageService
     */
    private MessageService $messageService;

    /**
     * @param MessageService $messageService
     */
    public function __construct(MessageService $messageService)
    {
        $this->messageService = $messageService;
    }

    /**
     * @return JsonResponse
     */
    public function getMessages(): JsonResponse
    {
        return $this->json($this->messageService->getLastMessages());
    }

    /**
     * @param SaveMessage $message
     *
     * @return JsonResponse
     * @throws \Exception
     */
    public function saveMessage(SaveMessage $message): JsonResponse
    {
        $this->messageService->saveMessage($message, $this->getUser());

        return $this->json(['status' => Response::HTTP_OK]);
    }
}
