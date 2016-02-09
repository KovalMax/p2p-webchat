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
        $formQuery =  $request->request->all();
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
            return $this->redirectToRoute('_login',
                ['error' => 'Username not found']
            );
        }

        $userPassword = array_column($checkLogin, 'password')[0];

        if (password_verify($password, $userPassword)) {
            $session = $request->getSession();
            $session->set('login', md5($login));
            dump($session);
            return new Response(
                '<html><body><p>Logged in as: '.$login.'</p>
                <p>pass is: '.$password.'</p></body></html>'
            );
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
}