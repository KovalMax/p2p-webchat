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
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Entity\Auth;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;

class AuthController extends Controller
{
    /**
     * @Route("/")
     */
    public function authAction()
    {
        $form = $this->createForm(new Type\AuthType(), null, [
            'action' => $this->generateUrl('app_auth_checkuser'),
            'method' => 'GET'
        ]);
        /**
         * @TODO
         * this is for registration page
        $createUser = new Auth();
        $createUser->setUserName('user1')
            ->setPassword(password_hash('12345', PASSWORD_BCRYPT));

        $em = $this->getDoctrine()->getManager();

        $em->persist($createUser);
        $em->flush();*/
        return $this->render('auth.twig', ['form' => $form->createView()]);
    }

    /**
     * @Route("/auth")
     */
    public function checkUser(Request $request)
    {
        $formQuery =  $request->query->all();
        $login = $formQuery['auth']['userName'];
        $password = $formQuery['auth']['password'];

        $em = $this->getDoctrine()
            ->getRepository('AppBundle:Auth');

        $checkLogin = $em->createQueryBuilder('u')
            ->select('u.userName, u.password')
            ->where('u.userName = ?1')
            ->setParameter(1, $login)
            ->getQuery()
            ->getResult();

        if (!array_column($checkLogin, 'userName')) {
            return new RedirectResponse($this->generateUrl('app_auth_auth'));
        }
        $userPassword = array_column($checkLogin, 'password')[0];
        if (password_verify($password, $userPassword)) {
            return new Response(
                '<html><body><p>login is: '.$login.'</p><p>pass is: '.$password.'</p></body></html>'
            );
        } else {
            return new Response(
                '<html><body><p>login failed!</p></body></html>'
            );
        }
    }
}