<?php
/**
 * Created by PhpStorm.
 * User: KMax
 * Date: 24.01.2016
 * Time: 19:49
 */
namespace AppBundle\Controller;

use AppBundle\Form\Type;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use AppBundle\Entity\Auth;

class AuthController extends Controller
{
    /**
     * @Route("/")
     */
    public function authAction()
    {
        $form = $this->createForm(new Type\AuthType(), null);

        return $this->render('auth.twig', ['form' => $form->createView()]);
    }
}