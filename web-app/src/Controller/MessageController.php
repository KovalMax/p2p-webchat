<?php

namespace App\Controller;

use App\Component\RequestMapper;
use App\DTO\Request\SaveMessage;
use App\Service\MessageService;
use App\Traits\PsrLoggerTrait;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class MessageController extends AbstractController
{
    use PsrLoggerTrait;

    /**
     * @var MessageService
     */
    private MessageService $messageService;

    /**
     * @var RequestMapper
     */
    private RequestMapper $requestMapper;


    /**
     * @param MessageService $messageService
     * @param RequestMapper  $requestMapper
     */
    public function __construct(MessageService $messageService, RequestMapper $requestMapper)
    {
        $this->messageService = $messageService;
        $this->requestMapper = $requestMapper;
    }

    /**
     * @return JsonResponse
     */
    public function getMessages(): JsonResponse
    {
        return $this->json($this->messageService->getLastMessages());
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     * @throws \Exception
     */
    public function saveMessage(Request $request): JsonResponse
    {
        /** @var SaveMessage $message */
        $message = $this->requestMapper->toDto(SaveMessage::class, $request->getContent());
        $this->messageService->saveMessage($message, $this->getUser());

        return $this->json(['status' => Response::HTTP_OK]);
    }
}
