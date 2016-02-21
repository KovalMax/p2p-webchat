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
use Symfony\Component\HttpFoundation\Session\Session;


class AuthController extends Controller
{
    /**
     * @Route("/login", name="_login")
     * @param Request $request
     * @return Response
     * @internal param string $error
     */
    public function authAction(Request $request)
    {
        if ($request->getSession()->get('userId')) {
            return $this->redirectToRoute('_home');
        }

        $form = $this->createForm(new Type\AuthType(), null, [
            'action' => $this->generateUrl('_auth'),
            'method' => 'POST'
        ]);

        return $this->render('auth.twig', [
            'form' => $form->createView(),
            'error' => ($request->query->get('error')) ?:'',
            'success' => ($request->query->get('success')) ?:'',
            'pageName' => 'Login Page'
        ]);
    }

    /**
     * @Route("/auth", name="_auth")
     * @param Request $request
     * @return RedirectResponse|Response
     */
    public function checkUser(Request $request)
    {
        if ($request->getSession()->get('userId')) {
            return $this->redirectToRoute('_home');
        }

        $formQuery =  $request->request->all();
        $login = $formQuery['auth']['userName'];
        $password = $formQuery['auth']['password'];

        $em = $this->getDoctrine()
            ->getRepository('AppBundle:Auth');

        $dbData = $em->createQueryBuilder('u')
            ->select('u.userName, u.password, u.id')
            ->where('u.userName = ?1')
            ->setParameter(1, $login)
            ->getQuery()
            ->getResult();

        if (!array_column($dbData, 'userName')) {
            return $this->redirectToRoute('_login',
                ['error' => 'Username not found']
            );
        }

        $userPassword = array_column($dbData, 'password')[0];

        if (password_verify($password, $userPassword)) {
            $session = $request->getSession();

            $session->set('login', $login);

            $session->set('isLogined', true);

            $session->set('userId', array_column($dbData, 'id')[0]);

            return $this->redirectToRoute('_home');
        } else {
            return $this->redirectToRoute('_login',
                ['error' => 'Incorrect password']);
        }
    }

    /**
     * @Route("/register", name="_register")
     * @param Request $request
     * @return Response
     */
    public function registerAction(Request $request)
    {
        $createUser = new Auth();

        $form = $this->createForm(new Type\RegisterType(), $createUser);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $createUser->setPassword(
                password_hash(
                    $createUser->getPlainPassword(),
                    PASSWORD_BCRYPT
                )
            );

            $mailMessage = 'Thank you for registration on ' .
                $request->server->get('HTTP_HOST') . PHP_EOL
                . 'Registration credentials' . PHP_EOL
                . 'Login: ' . $createUser->getUserName() . PHP_EOL
                . 'Password: ' . $createUser->getPlainPassword();
            mail($createUser->getEmail(),
                'Thank you for registration!',
                $mailMessage
            );

            $em = $this->getDoctrine()->getManager();
            $em->persist($createUser);
            $em->flush();
            return $this->redirectToRoute('_login',
                ['success' => 'Registration complete you can login now']);
        }

        return $this->render('register.twig', [
            'form' => $form->createView(),
            'error' => ($request->query->get('error')) ?:'',
            'pageName' => 'Registration Page'
        ]);
    }

    /**
     * @Route("/logout", name="_logout")
     * @param Request $request
     * @return RedirectResponse
     */
    public function logoutAction(Request $request)
    {
        $session = $request->getSession();
        $session->clear();
        $session->invalidate();

        return $this->redirectToRoute('_login');
    }
}