<?php

namespace App\Controller;

use App\Service\MessageService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Security;

class MessengerController extends AbstractController
{
    /**
     * @var MessageService
     */
    private MessageService $messageService;

    public function __construct(MessageService $messageService)
    {
        $this->messageService = $messageService;
    }

    public function index(): Response
    {
        return $this->render(
            'messenger/messenger.html.twig',
            ['messages' => $this->messageService->getMessages()]
        );
    }
}