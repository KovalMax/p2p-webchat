<?php

namespace App\Controller;

use App\Service\MessageService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class MessageController extends AbstractController
{
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
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function getMessages(Request $request): JsonResponse
    {
        return $this->json($this->messageService->getLastMessages());
    }
}
