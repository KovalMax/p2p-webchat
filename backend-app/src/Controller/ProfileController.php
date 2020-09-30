<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

final class ProfileController extends AbstractController
{
    public function __invoke(): JsonResponse
    {
        return $this->json($this->getUser(), 200, [], ['groups' => ['public']]);
    }
}
