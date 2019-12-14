<?php


namespace App\Controller;


use App\DTO\Response\UserRegistration;
use App\Form\RegistrationType;
use App\Service\UserRegistrationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class RegistrationController extends AbstractController
{
    /**
     * @var UserRegistrationService
     */
    private UserRegistrationService $registrationService;

    public function __construct(UserRegistrationService $registrationService)
    {
        $this->registrationService = $registrationService;
    }

    /**
     * @param Request $request
     *
     * @return Response
     * @throws \Exception
     */
    public function register(Request $request): Response
    {
        $user = new UserRegistration();
        $form = $this->createForm(RegistrationType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->registrationService->createNewUser($user);
            $this->addFlash('success', 'User successfully created, now you can login');

            return $this->redirectToRoute('messenger');
        }

        return $this->render('registration/registration.html.twig', ['form' => $form->createView()]);
    }
}