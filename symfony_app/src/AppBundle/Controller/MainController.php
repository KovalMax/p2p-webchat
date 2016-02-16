<?php
/**
 * Created by PhpStorm.
 * User: KMax
 * Date: 14.02.2016
 * Time: 13:57
 */
namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
Class MainController extends Controller
{
    /**
     * @Route ("/", name="_home")
     * @param Request $request
     * @return RedirectResponse | Response
     */
    public function homeAction(Request $request)
    {
        $session = $request->getSession();
        $userId = $session->get('userId');
        $login = $session->get('login');

        if ($session->get('isLogined') && $userId) {
            return $this->render('base_tmpl.twig',
                [
                    'pageName' => 'Home Page',
                    'userName' => $login
                ]
            );
        } else {
            return $this->redirectToRoute('_login');
        }
    }
}