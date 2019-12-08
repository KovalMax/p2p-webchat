<?php


namespace App\Controller;


use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Security;

class MessengerController
{
    private Security $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public function index(): Response
    {
        $name = $this->security->getUser()->getUsername();

        return new Response("Hello {$name}!");
    }
}